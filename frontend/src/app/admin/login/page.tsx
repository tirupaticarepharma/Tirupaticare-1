"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getToken, login } from "@/lib/adminApi";
import { siteConfig } from "@/config/site";
import { LogoMark } from "@/components/ui/Icons";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  /* Already signed in? Skip the form. */
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
        loginError instanceof Error ? loginError.message : "Sign-in failed.",
      );
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 text-center">
          <LogoMark className="text-5xl text-brand-700" />
          <div>
            <h1 className="text-xl font-bold text-ink-900">Store admin</h1>
            <p className="mt-1 text-sm text-ink-500">{siteConfig.name}</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4 rounded-2xl border border-hairline bg-white p-6 shadow-sm"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold tracking-wide text-ink-500 uppercase">
              Username
            </span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              autoFocus
              required
              className="h-11 rounded-xl border border-hairline px-3.5 text-sm outline-none transition-colors focus:border-brand-400"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold tracking-wide text-ink-500 uppercase">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="h-11 rounded-xl border border-hairline px-3.5 text-sm outline-none transition-colors focus:border-brand-400"
            />
          </label>

          {error ? (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="h-11 rounded-xl bg-brand-700 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-ink-300">
          <Link href="/" className="transition-colors hover:text-brand-700">
            &larr; Back to the website
          </Link>
        </p>
      </div>
    </div>
  );
}
