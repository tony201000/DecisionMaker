-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create decisions table
CREATE TABLE IF NOT EXISTS decisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create arguments table
CREATE TABLE IF NOT EXISTS arguments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  weight INTEGER NOT NULL CHECK (weight >= -10 AND weight <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE arguments ENABLE ROW LEVEL SECURITY;

-- Create policies for decisions
CREATE POLICY "Users can view their own decisions" ON decisions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own decisions" ON decisions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own decisions" ON decisions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own decisions" ON decisions
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for arguments
CREATE POLICY "Users can view arguments for their decisions" ON arguments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM decisions 
      WHERE decisions.id = arguments.decision_id 
      AND decisions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert arguments for their decisions" ON arguments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM decisions 
      WHERE decisions.id = arguments.decision_id 
      AND decisions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update arguments for their decisions" ON arguments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM decisions 
      WHERE decisions.id = arguments.decision_id 
      AND decisions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete arguments for their decisions" ON arguments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM decisions 
      WHERE decisions.id = arguments.decision_id 
      AND decisions.user_id = auth.uid()
    )
  );
