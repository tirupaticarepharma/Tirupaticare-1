import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  // The panel must never be indexed, whatever robots.txt says.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The admin panel deliberately sits OUTSIDE the (site) route group, so it
 * gets none of the public chrome - no marketing header, no footer, no
 * floating WhatsApp button.
 */
export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="flex min-h-screen flex-1 flex-col bg-surface-muted">{children}</div>;
}
