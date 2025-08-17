# Refactor – lib/actions.ts (auth)

Problèmes:
- Types faibles (`any`), gestion d’erreur hétérogène.

Objectifs:
- Types explicites de retours et erreurs, messages constants, logs côté serveur uniquement.

Actions:
- Créer un type `ActionResult<T> = { success: true; data: T } | { success: false; error: string }`.
- Harmoniser les retours (signIn, signUp, signOut) et utiliser des messages constants.
- Supprimer `console.error` au profit d’un logger serveur si dispo; sinon conserver mais standardiser.
- Tests: inputs manquants, erreurs Supabase, chemin heureux.

Résultats:
- Actions prévisibles, facilement consommables côté UI.
