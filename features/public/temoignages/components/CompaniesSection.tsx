import { companies } from "../data"

export function CompaniesSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ils nous font confiance</h2>
          <p className="text-muted-foreground">Plus de 500 entreprises utilisent DecisionAI quotidiennement</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {companies.map(company => (
            <div
              key={company}
              className="text-center p-4 bg-card rounded-lg border border-border/50"
            >
              <p className="text-sm font-medium text-muted-foreground">{company}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
