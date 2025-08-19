import Link from "next/link"
import { UnifiedHeader } from "@/components/shared/unified-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeader />

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">Découvrez DecisionAI en action</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explorez notre plateforme de prise de décision avec une démonstration interactive basée sur la méthode Schulich enrichie par l'IA.
          </p>
        </div>

        {/* Demo Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🎯 Démo Interactive</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Créez votre compte gratuitement et testez toutes les fonctionnalités avec vos propres décisions.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">✅ Interface complète</div>
                <div className="flex items-center gap-2 text-sm">✅ Suggestions IA illimitées</div>
                <div className="flex items-center gap-2 text-sm">✅ Historique des décisions</div>
              </div>
              <Link href="/sign-up">
                <Button
                  className="w-full"
                  size="lg"
                >
                  Commencer maintenant
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">📋 Exemple Guidé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Découvrez un exemple concret d'analyse de décision avec la méthode Schulich.</p>
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Exemple : "Lancer un nouveau produit"</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-green-600 mb-1">Arguments positifs (14 pts)</div>
                    <div>• Opportunité marché (+8)</div>
                    <div>• Équipe motivée (+6)</div>
                  </div>
                  <div>
                    <div className="font-medium text-red-600 mb-1">Arguments négatifs (7 pts)</div>
                    <div>• Investissement élevé (-5)</div>
                    <div>• Risque concurrentiel (-2)</div>
                  </div>
                </div>
                <div className="mt-3 text-center font-semibold text-primary">Recommandation : Favorable (Ratio 2:1 respecté)</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Preview */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-8">Fonctionnalités clés</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🤖 Suggestions IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  L'IA analyse votre contexte et propose des arguments pertinents que vous n'auriez peut-être pas considérés.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📊 Visualisation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Gauge semi-circulaire intuitive pour visualiser instantanément l'équilibre de vos arguments.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📈 Méthode Schulich</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Règle 2:1 éprouvée pour des recommandations objectives basées sur la pondération des arguments.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Prêt à transformer vos décisions ?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Rejoignez des milliers de professionnels qui utilisent déjà DecisionAI pour optimiser leurs décisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="min-w-[200px]"
              >
                Créer un compte gratuit
              </Button>
            </Link>
            <Link href="/methode">
              <Button
                variant="outline"
                size="lg"
                className="min-w-[200px]"
              >
                En savoir plus sur la méthode
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
