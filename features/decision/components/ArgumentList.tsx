"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CounterDisplay } from "@/components/ui/counter-display"
import { EditableArgumentItem } from "@/features/decision/components"
import { getArgumentColor } from "@/lib/utils/decision-styles"
import type { Argument } from "@/types/decision"

interface ArgumentListProps {
  arguments: Argument[]
  onRemoveArgument: (id: string) => void
  onUpdateArgumentWeight: (id: string, weight: number) => void
  onUpdateArgumentText: (id: string, text: string) => void
}

export const ArgumentList: React.FC<ArgumentListProps> = ({
  arguments: sortedArguments,
  onRemoveArgument,
  onUpdateArgumentWeight,
  onUpdateArgumentText
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📋 Arguments Ajoutés
          <CounterDisplay
            count={sortedArguments.length}
            label="argument"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedArguments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Aucun argument ajouté pour le moment</div>
        ) : (
          <div className="space-y-3">
            {sortedArguments.map(argument => (
              <div
                key={argument.id}
                className={getArgumentColor(argument.weight)}
              >
                <EditableArgumentItem
                  argument={argument}
                  onRemove={onRemoveArgument}
                  onUpdateWeight={onUpdateArgumentWeight}
                  onUpdateText={onUpdateArgumentText}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
