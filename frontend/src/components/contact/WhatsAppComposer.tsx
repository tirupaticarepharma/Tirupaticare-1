"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icons";

/**
 * A "contact form" with no backend: the fields are composed into a WhatsApp
 * message and handed to wa.me. Nothing is stored or transmitted anywhere else,
 * and the visitor sees the message before it is sent.
 */
export function WhatsAppComposer() {
  const [name, setName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [message, setMessage] = useState("");

  const composed = [
    name ? `Hello, this is ${name}${organisation ? ` from ${organisation}` : ""}.` : "Hello,",
    "",
    message || "I'd like to enquire about your products.",
  ].join("\n");

  return (
    <div className="rounded-2xl border border-hairline bg-white p-5 sm:p-6">
      <h2 className="text-lg font-bold text-ink-900">Send us a message</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
        Fill this in and we&rsquo;ll open WhatsApp with your message ready to
        go. Nothing is submitted to a server &mdash; you send it yourself.
      </p>

      <div className="mt-5 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold tracking-wide text-ink-500 uppercase">
              Your name
            </span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Dr. A. Sharma"
              className="h-11 rounded-xl border border-hairline px-3.5 text-sm outline-none transition-colors placeholder:text-ink-300 focus:border-brand-400"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold tracking-wide text-ink-500 uppercase">
              Hospital / clinic{" "}
              <span className="font-medium normal-case">(optional)</span>
            </span>
            <input
              type="text"
              value={organisation}
              onChange={(event) => setOrganisation(event.target.value)}
              placeholder="City Hospital"
              className="h-11 rounded-xl border border-hairline px-3.5 text-sm outline-none transition-colors placeholder:text-ink-300 focus:border-brand-400"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold tracking-wide text-ink-500 uppercase">
            What do you need?
          </span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            placeholder="e.g. Please quote 5 boxes of 3-ply masks and 2 dozen Adson forceps."
            className="resize-y rounded-xl border border-hairline px-3.5 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-ink-300 focus:border-brand-400"
          />
        </label>

        <Button href={whatsappLink(composed)} variant="whatsapp" size="lg" fullWidth>
          <WhatsAppIcon className="text-[1.15em]" />
          Open WhatsApp with this message
        </Button>
      </div>
    </div>
  );
}
