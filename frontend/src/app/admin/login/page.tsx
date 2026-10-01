"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getToken, login } from "@/lib/adminApi";
import { siteConfig } from "@/config/site";
import { LogoMark, ShieldCheckIcon } from "@/components/ui/Icons";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  /* Already signed in? Skip form */
  useEffect(() => {
    if (getToken()) router.replace("/admin/products");
  }, [router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);

    try {
      await login(username.trim(), password);
      router.replace("/admin/products");
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : "Authentication failed.",
      );
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-surface-muted px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 text-center mb-6">
          <div className="rounded-2xl p-2 bg-brand-50 border border-brand-100 shadow-2xs">
            <LogoMark className="text-4xl text-brand-700" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-ink-900 tracking-tight">
              Catalogue Management
            </h1>
            <p className="mt-0.5 text-xs text-ink-500 font-medium">{siteConfig.name} Admin Portal</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-hairline text-xs font-bold text-ink-700 uppercase tracking-wider">
            <ShieldCheckIcon className="text-base text-brand-600" />
            <span>Authorized Access Only</span>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold tracking-wide text-ink-600 uppercase">
              Username
            </span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              autoFocus
              required
              className="h-11 rounded-xl border border-slate-200 px-3.5 text-sm outline-none transition-all placeholder:text-ink-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-2xs"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold tracking-wide text-ink-600 uppercase">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="h-11 rounded-xl border border-slate-200 px-3.5 text-sm outline-none transition-all placeholder:text-ink-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-2xs"
            />
          </label>

          {error ? (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-relaxed text-red-700"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="h-11 rounded-xl bg-linear-to-b from-brand-600 to-brand-700 text-sm font-bold text-white shadow-xs transition-all duration-200 hover:from-brand-500 hover:to-brand-600 active:scale-98 disabled:opacity-60"
          >
            {busy ? "Authenticating…" : "Sign In to Portal"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-ink-400">
          <Link href="/" className="font-semibold text-brand-700 hover:underline">
            &larr; Return to main catalogue
          </Link>
        </p>
      </div>
    </div>
  );
}
