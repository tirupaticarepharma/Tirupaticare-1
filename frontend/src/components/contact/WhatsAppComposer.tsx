"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon, ZapIcon } from "@/components/ui/Icons";

const quickTopics = [
  "Hospital OT Consumables List",
  "Surgical Forceps & Scissors Quote",
  "Diagnostic & BP Monitors",
  "Institutional Rate Contract",
];

/**
 * Direct WhatsApp inquiry desk. Formats inputs into a verified WhatsApp
 * transmission with zero backend database requirement.
 */
export function WhatsAppComposer() {
  const [name, setName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [message, setMessage] = useState("");

  function handleSelectTopic(topic: string) {
    setMessage((prev) => {
      if (!prev) return `I would like to inquire about pricing and stock for: ${topic}.`;
      return `${prev}\n• ${topic}`;
    });
  }

  const composed = [
    name ? `Hello Tirupati Surgicals, this is ${name}${organisation ? ` from ${organisation}` : ""}.` : "Hello Tirupati Surgicals,",
    "",
    message || "I'd like to enquire about surgical products, availability, and pricing.",
  ].join("\n");

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between border-b border-hairline pb-4">
        <div>
          <h2 className="text-lg font-bold text-ink-900 leading-tight">
            Direct WhatsApp Inquiry Desk
          </h2>
          <p className="mt-1 text-xs text-ink-500">
            Fills your message automatically and connects you directly to our sales desk.
          </p>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
          <ZapIcon className="text-xs" />
          Active Desk
        </span>
      </div>

      {/* Quick topics chips */}
      <div className="mt-4">
        <label className="block text-[0.6875rem] font-bold tracking-wider text-ink-400 uppercase mb-2">
          Quick Inquiry Presets
        </label>
        <div className="flex flex-wrap gap-1.5">
          {quickTopics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => handleSelectTopic(topic)}
              className="rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-xs font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-900 active:scale-95"
            >
              + {topic}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold tracking-wide text-ink-600 uppercase">
              Your Name / Title *
            </span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Dr. A. Sharma"
              className="h-11 rounded-xl border border-slate-200 px-3.5 text-sm outline-none transition-all placeholder:text-ink-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-2xs"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold tracking-wide text-ink-600 uppercase">
              Hospital / Clinic <span className="font-normal normal-case text-ink-400">(optional)</span>
            </span>
            <input
              type="text"
              value={organisation}
              onChange={(event) => setOrganisation(event.target.value)}
              placeholder="e.g. City Hospital, Ward 3"
              className="h-11 rounded-xl border border-slate-200 px-3.5 text-sm outline-none transition-all placeholder:text-ink-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-2xs"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold tracking-wide text-ink-600 uppercase">
            Required Surgical Items or Specifications
          </span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            placeholder="e.g. Please quote 50 units of Adson forceps 12cm, 20 packs of 3-ply masks, and delivery lead time to Pune."
            className="resize-y rounded-xl border border-slate-200 px-3.5 py-3 text-sm leading-relaxed outline-none transition-all placeholder:text-ink-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-2xs"
          />
        </label>

        <Button
          href={whatsappLink(composed)}
          variant="whatsapp"
          size="lg"
          fullWidth
          className="shadow-md shadow-whatsapp-dark/25 font-bold"
        >
          <WhatsAppIcon className="text-[1.25em]" />
          Launch WhatsApp with Pre-filled RFQ
        </Button>

        <p className="text-center text-[0.6875rem] text-ink-400">
          Clicking opens WhatsApp on your phone or desktop web app with this exact message pre-typed.
        </p>
      </div>
    </div>
  );
}
