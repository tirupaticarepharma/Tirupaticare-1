import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";

/**
 * Trust indicators strip, sitting directly under the hero.
 * Values come from siteConfig.stats - replace them with the real numbers.
 */
export function TrustStats() {
  return (
    <div className="border-b border-hairline bg-white">
      <Container>
        <dl className="grid grid-cols-2 divide-x divide-y divide-hairline sm:divide-y-0 lg:grid-cols-4">
          {siteConfig.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 px-4 py-6 text-center sm:py-8"
            >
              <dt className="font-display text-2xl font-extrabold text-brand-800 sm:text-3xl">
                {stat.value}
              </dt>
              <dd className="text-xs font-medium text-ink-500 sm:text-sm">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </div>
  );
}
