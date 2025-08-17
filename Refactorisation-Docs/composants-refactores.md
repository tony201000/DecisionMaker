# Composants refactorisés et à refactoriser

## Composants déjà refactorisés

1. ResultsSection → utilise ScoreDisplay et RatioDisplay
2. DecisionResult → utilise ScoreDisplay
3. DecisionChart → utilise ScoreDisplay
4. DecisionHistory → utilise DateDisplay, CounterDisplay, RecommendationBadge, LoadingSpinner

## Composants à refactoriser

1. DecisionHeader → peut utiliser SaveStatus
2. HistoryPage → peut utiliser DateDisplay, CounterDisplay, RecommendationBadge, LoadingSpinner
3. SidebarStats → peut utiliser CounterDisplay
4. SidebarRecent → peut utiliser DateDisplay, RecommendationBadge, CounterDisplay