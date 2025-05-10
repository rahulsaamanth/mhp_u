import { ArrowRight, Leaf } from "lucide-react"

export default function AboutHomeopathy() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-brand flex items-center justify-center gap-2">
          About Homeopathy <Leaf className="size-8" />
        </h1>
        <p className="text-muted-foreground italic">
          "Like Cures Like" - The Fundamental Principle
        </p>
      </header>

      <section className="space-y-4">
        <p className="text-lg leading-relaxed">
          Homeopathy is a natural form of medicine used by over 200 million
          people worldwide to treat both acute and chronic conditions. Developed
          by Dr. Samuel Hahnemann in 1796, it is based on the principle of
          treating "like with like."
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Core Principles</h2>
        <div className="grid gap-6">
          {[
            {
              title: "Like Cures Like",
              description:
                "Substances which cause symptoms in a healthy person can treat similar symptoms in a sick person.",
            },
            {
              title: "Minimum Dose",
              description:
                "The lowest possible dose of medication should be used to trigger the body's self-healing response.",
            },
            {
              title: "Single Remedy",
              description:
                "One carefully selected homeopathic medicine treats all symptoms experienced by a patient.",
            },
          ].map((principle, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 border rounded-lg"
            >
              <ArrowRight className="size-5 text-brand mt-1 shrink-0" />
              <div>
                <h3 className="font-medium">{principle.title}</h3>
                <p className="text-muted-foreground mt-1">
                  {principle.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Benefits of Homeopathy</h2>
        <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
          <li>Natural and non-toxic treatment approach</li>
          <li>Safe for all ages, including infants and elderly</li>
          <li>No side effects or drug interactions</li>
          <li>Treats the root cause, not just symptoms</li>
          <li>Strengthens overall immunity and well-being</li>
          <li>Personalized treatment for each individual</li>
        </ul>
      </section>

      <footer className="text-center text-sm text-muted-foreground pt-8 border-t">
        <p>
          Note: Homeopathic treatment should be undertaken under the guidance of
          a qualified homeopathic practitioner.
        </p>
      </footer>
    </main>
  )
}
