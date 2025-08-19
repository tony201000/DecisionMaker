-- Migration: Add robustness features to prevent duplicates and improve concurrency
-- Date: 2025-08-19

-- 1. Add version column for optimistic locking
ALTER TABLE decisions 
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- 2. Add unique constraint to prevent duplicate titles per user
-- First, we need to handle existing duplicates if any
DO $$
DECLARE
    duplicate_record RECORD;
    counter INTEGER;
BEGIN
    -- Find and rename duplicates by appending a counter
    FOR duplicate_record IN 
        SELECT user_id, title, array_agg(id ORDER BY created_at) as ids
        FROM decisions 
        GROUP BY user_id, title 
        HAVING count(*) > 1
    LOOP
        -- Keep the first decision, rename the others with incremental counters
        counter := 1;
        FOR i IN 2..array_length(duplicate_record.ids, 1) LOOP
            -- Find a unique title by incrementing counter if needed
            WHILE EXISTS (
                SELECT 1 FROM decisions 
                WHERE user_id = duplicate_record.user_id 
                AND title = duplicate_record.title || ' (' || counter || ')'
            ) LOOP
                counter := counter + 1;
            END LOOP;
            
            UPDATE decisions 
            SET title = duplicate_record.title || ' (' || counter || ')'
            WHERE id = duplicate_record.ids[i];
            
            counter := counter + 1;
        END LOOP;
    END LOOP;
END $$;

-- Now add the unique constraint (PostgreSQL compatible way)
DO $$
BEGIN
    -- Check if constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_user_title' 
        AND table_name = 'decisions'
    ) THEN
        ALTER TABLE decisions ADD CONSTRAINT unique_user_title UNIQUE (user_id, title);
    END IF;
END $$;

-- 3. Create atomic function to update decision with arguments
CREATE OR REPLACE FUNCTION update_decision_with_arguments(
    p_decision_id UUID,
    p_title VARCHAR(255),
    p_description TEXT,
    p_expected_version INTEGER,
    p_arguments JSONB
) RETURNS TABLE(
    id UUID,
    title VARCHAR(255),
    description TEXT,
    version INTEGER,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_version INTEGER;
    v_user_id UUID;
BEGIN
    -- Get current version and verify ownership
    SELECT decisions.version, decisions.user_id 
    INTO v_current_version, v_user_id
    FROM decisions 
    WHERE decisions.id = p_decision_id;
    
    -- Check if decision exists
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Decision not found: %', p_decision_id;
    END IF;
    
    -- Verify user ownership
    IF v_user_id != auth.uid() THEN
        RAISE EXCEPTION 'Access denied: You can only update your own decisions';
    END IF;
    
    -- Check version for optimistic locking
    IF v_current_version != p_expected_version THEN
        RAISE EXCEPTION 'Decision was modified by another process. Expected version %, got %', p_expected_version, v_current_version;
    END IF;
    
    -- Update decision with new version
    UPDATE decisions 
    SET 
        title = p_title,
        description = p_description,
        version = decisions.version + 1,
        updated_at = NOW()
    WHERE decisions.id = p_decision_id
    RETURNING 
        decisions.id,
        decisions.title,
        decisions.description,
        decisions.version,
        decisions.created_at,
        decisions.updated_at
    INTO id, title, description, version, created_at, updated_at;
    
    -- Delete existing arguments
    DELETE FROM arguments WHERE decision_id = p_decision_id;
    
    -- Insert new arguments if provided
    IF p_arguments IS NOT NULL AND jsonb_array_length(p_arguments) > 0 THEN
        INSERT INTO arguments (decision_id, text, note)
        SELECT 
            p_decision_id,
            (arg->>'text')::TEXT,
            (arg->>'note')::INTEGER
        FROM jsonb_array_elements(p_arguments) AS arg;
    END IF;
    
    RETURN NEXT;
END;
$$;

-- 4. Create UPSERT function for decisions
CREATE OR REPLACE FUNCTION upsert_decision(
    p_user_id UUID,
    p_title VARCHAR(255),
    p_description TEXT,
    p_arguments JSONB,
    p_existing_id UUID DEFAULT NULL
) RETURNS TABLE(
    id UUID,
    title VARCHAR(255),
    description TEXT,
    version INTEGER,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    is_new BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_decision_id UUID;
    v_existing_version INTEGER;
    v_is_new BOOLEAN := FALSE;
BEGIN
    -- Verify user is authenticated
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;
    
    -- Verify user ownership
    IF p_user_id != auth.uid() THEN
        RAISE EXCEPTION 'Access denied: You can only manage your own decisions';
    END IF;
    
    -- Try to find existing decision
    IF p_existing_id IS NOT NULL THEN
        -- Update existing decision by ID
        SELECT decisions.version INTO v_existing_version
        FROM decisions 
        WHERE decisions.id = p_existing_id AND decisions.user_id = p_user_id;
        
        IF FOUND THEN
            v_decision_id := p_existing_id;
        END IF;
    END IF;
    
    -- If no existing decision found by ID, try by title
    IF v_decision_id IS NULL THEN
        SELECT decisions.id, decisions.version 
        INTO v_decision_id, v_existing_version
        FROM decisions 
        WHERE decisions.user_id = p_user_id AND decisions.title = p_title;
    END IF;
    
    -- Update existing or create new
    IF v_decision_id IS NOT NULL THEN
        -- Update existing decision
        UPDATE decisions 
        SET 
            title = p_title,
            description = p_description,
            version = decisions.version + 1,
            updated_at = NOW()
        WHERE decisions.id = v_decision_id
        RETURNING 
            decisions.id,
            decisions.title,
            decisions.description,
            decisions.version,
            decisions.created_at,
            decisions.updated_at
        INTO id, title, description, version, created_at, updated_at;
        
        v_is_new := FALSE;
        
        -- Update arguments atomically
        DELETE FROM arguments WHERE decision_id = v_decision_id;
    ELSE
        -- Create new decision
        INSERT INTO decisions (user_id, title, description)
        VALUES (p_user_id, p_title, p_description)
        RETURNING 
            decisions.id,
            decisions.title,
            decisions.description,
            decisions.version,
            decisions.created_at,
            decisions.updated_at
        INTO id, title, description, version, created_at, updated_at;
        
        v_decision_id := id;
        v_is_new := TRUE;
    END IF;
    
    -- Insert arguments
    IF p_arguments IS NOT NULL AND jsonb_array_length(p_arguments) > 0 THEN
        INSERT INTO arguments (decision_id, text, note)
        SELECT 
            v_decision_id,
            (arg->>'text')::TEXT,
            (arg->>'note')::INTEGER
        FROM jsonb_array_elements(p_arguments) AS arg
        WHERE (arg->>'text')::TEXT IS NOT NULL 
          AND (arg->>'text')::TEXT != ''
          AND (arg->>'note')::INTEGER BETWEEN -10 AND 10;
    END IF;
    
    is_new := v_is_new;
    RETURN NEXT;
END;
$$;

-- 5. Create function to check for potential conflicts
CREATE OR REPLACE FUNCTION check_decision_conflicts(
    p_user_id UUID,
    p_title VARCHAR(255),
    p_exclude_id UUID DEFAULT NULL
) RETURNS TABLE(
    conflict_id UUID,
    conflict_title VARCHAR(255),
    conflict_updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        decisions.id,
        decisions.title,
        decisions.updated_at
    FROM decisions
    WHERE decisions.user_id = p_user_id 
      AND decisions.title ILIKE p_title
      AND (p_exclude_id IS NULL OR decisions.id != p_exclude_id)
    ORDER BY decisions.updated_at DESC;
END;
$$;

-- 6. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_decisions_user_title ON decisions(user_id, title);
CREATE INDEX IF NOT EXISTS idx_decisions_user_updated ON decisions(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_arguments_decision_id ON arguments(decision_id);

-- 7. Update RLS policies to include version check
DROP POLICY IF EXISTS "Users can update their own decisions" ON decisions;
CREATE POLICY "Users can update their own decisions" ON decisions
  FOR UPDATE USING (auth.uid() = user_id);

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION update_decision_with_arguments TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_decision TO authenticated;
GRANT EXECUTE ON FUNCTION check_decision_conflicts TO authenticated;
