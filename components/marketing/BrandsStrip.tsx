import { Container, Eyebrow } from "@/components/ui/container";

const BRANDS = [
  { name: "BMW", letters: "BMW" },
  { name: "Mercedes-Benz", letters: "MB" },
  { name: "Audi", letters: "Audi" },
  { name: "Porsche", letters: "Porsche" },
  { name: "Škoda", letters: "Škoda" },
  { name: "Volkswagen", letters: "VW" },
];

export function BrandsStrip() {
  return (
    <section className="relative py-12 lg:py-16 border-y border-graphite-500/30 bg-graphite-900">
      <Container>
        <div className="flex flex-col items-center text-center mb-8 lg:mb-12">
          <Eyebrow>Специализируемся на европейских марках</Eyebrow>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 lg:gap-x-20">
          {BRANDS.map((brand) => (
            <BrandLogo key={brand.name} name={brand.name} letters={brand.letters} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function BrandLogo({ name, letters }: { name: string; letters: string }) {
  return (
    <div
      className="group relative flex items-center justify-center text-chrome hover:text-graphite-50 transition-colors duration-base"
      title={name}
      aria-label={name}
    >
      <span className="font-display text-h2 lg:text-h1 font-medium tracking-tight">
        {letters}
      </span>
      <span className="absolute -inset-4 rounded-full bg-red-glow blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-base -z-10" aria-hidden />
    </div>
  );
}
