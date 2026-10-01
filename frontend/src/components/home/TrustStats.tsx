import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import {
  BadgeIcon,
  CertificateIcon,
  HospitalIcon,
  PackageIcon,
  ShieldCheckIcon,
} from "@/components/ui/Icons";

const statIcons = [
  BadgeIcon,
  HospitalIcon,
  PackageIcon,
  ShieldCheckIcon,
];

/**
 * Trust indicators strip, sitting directly under the hero.
 * Communicates clinical authority, scale, longevity, and ISO certification.
 */
export function TrustStats() {
  return (
    <div className="relative border-b border-hairline bg-white py-6 sm:py-8 shadow-xs">
      <Container>
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4 sm:gap-6">
          {siteConfig.stats.map((stat, idx) => {
            const IconComponent = statIcons[idx] ?? CertificateIcon;

            return (
              <div
                key={stat.label}
                className="group relative flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-surface-muted/60 p-4 sm:p-5 text-center transition-all duration-300 hover:border-brand-200 hover:bg-white hover:shadow-md hover:shadow-brand-900/5 hover:-translate-y-0.5"
              >
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors duration-200 group-hover:bg-brand-600 group-hover:text-white">
                  <IconComponent className="text-xl" />
                </div>

                <div>
                  <dt className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-ink-900">
                    {stat.value}
                  </dt>
                  <dd className="mt-0.5 text-xs sm:text-sm font-semibold text-ink-500">
                    {stat.label}
                  </dd>
                </div>
              </div>
            );
          })}
        </dl>
      </Container>
    </div>
  );
}
