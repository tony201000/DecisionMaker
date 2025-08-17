import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { title, description, existingArguments } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Construire le contexte pour l'IA
    const existingArgsText =
      existingArguments?.length > 0
        ? `\n\nArguments déjà identifiés :\n${existingArguments.map((arg: { text: string; weight: number }) => `- ${arg.text} (note: ${arg.weight})`).join("\n")}`
        : ""

    const prompt = `Tu es un assistant expert en prise de décision qui aide les utilisateurs à explorer tous les aspects d'une décision importante. 

DÉCISION À ANALYSER :
Titre : ${title}
${description ? `Description : ${description}` : ""}${existingArgsText}

MISSION :
Génère 6 arguments pertinents (3 positifs, 3 négatifs) pour enrichir cette analyse de décision. Ces arguments doivent :

1. Être différents des arguments déjà listés
2. Couvrir des aspects que l'utilisateur pourrait avoir oubliés
3. Inclure des perspectives à long terme, des impacts sur les autres, des considérations financières, émotionnelles, professionnelles, etc.
4. Être concrets et spécifiques à la situation
5. Aider à dépasser les biais cognitifs et les angles morts

FORMAT DE RÉPONSE (JSON strict) :
{
  "suggestions": [
    {
      "text": "Argument positif concret et spécifique",
      "weight": 7,
      "category": "Financier"
    },
    {
      "text": "Argument négatif concret et spécifique", 
      "weight": -5,
      "category": "Émotionnel"
    }
  ]
}

CATÉGORIES possibles : Financier, Émotionnel, Professionnel, Social, Santé, Temps, Risque, Opportunité, Personnel, Familial

Génère exactement 6 arguments (3 positifs avec poids 3-8, 3 négatifs avec poids -3 à -8).`

    const { text } = await generateText({
      model: groq("openai/gpt-oss-20b"),
      prompt,
      temperature: 0.7
    })

    // Parser la réponse JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from AI")
    }

    const suggestions = JSON.parse(jsonMatch[0])

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error("Error generating suggestions:", error)
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 })
  }
}
