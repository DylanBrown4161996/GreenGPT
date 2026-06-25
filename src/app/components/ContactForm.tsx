"use client";

import { useState, type FormEvent } from "react";

const inputClass =
  "w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-600/20 disabled:opacity-60";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500";

export default function ContactForm({ source = "contact" }: { source?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<null | { type: "ok" | "err"; text: string }>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setNotice(null);

    try {
      setLoading(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, phone, message, source }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to send message.");

      setNotice({ type: "ok", text: "Thanks — we received your message and will follow up by email." });
      setName("");
      setEmail("");
      setCompany("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setNotice({
        type: "err",
        text: err instanceof Error ? err.message : "Failed to send message.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">Send us a message</h2>
      <p className="mt-2 text-slate-700">
        Tell us what you need — we&apos;ll follow up by email.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            disabled={loading}
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-email" className={labelClass}>
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="contact-phone" className={labelClass}>
              Phone <span className="font-normal normal-case text-slate-400">(optional)</span>
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              disabled={loading}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-company" className={labelClass}>
            Company <span className="font-normal normal-case text-slate-400">(optional)</span>
          </label>
          <input
            id="contact-company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            autoComplete="organization"
            disabled={loading}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="contact-message" className={labelClass}>
            Message
          </label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            disabled={loading}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send message"}
        </button>

        {notice && (
          <p
            className={`text-sm font-medium ${notice.type === "ok" ? "text-emerald-800" : "text-red-600"}`}
            role="status"
          >
            {notice.text}
          </p>
        )}
      </form>
    </section>
  );
}
