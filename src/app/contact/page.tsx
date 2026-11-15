"use client";

import { Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/primitives";
import { useToast } from "@/lib/store";

const inputClass =
  "h-12 w-full rounded-xl border border-line bg-white px-4 text-[15px] text-ink transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10";

export default function ContactPage() {
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General enquiry");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email address.");
    if (message.trim().length < 10) return setError("Please write a message of at least 10 characters.");
    setError("");
    setName("");
    setEmail("");
    setMessage("");
    toast.push("Message noted (demo) — no email was sent");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bronze">Contact</p>
      <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Talk to us.</h1>
      <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-stone2">
        Questions about NIVORA, listing your property, or reporting a concern — we read
        everything. This demo form does not send email; it confirms receipt on your device.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_280px]">
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-ink">Name</label>
              <input id="contact-name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} autoComplete="name" />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-ink">Email</label>
              <input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} autoComplete="email" />
            </div>
          </div>
          <div>
            <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-ink">Subject</label>
            <select id="contact-subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass}>
              <option>General enquiry</option>
              <option>Listing my property</option>
              <option>Report a listing</option>
              <option>Advertiser support</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-ink">Message</label>
            <textarea
              id="contact-message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help?"
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
            />
          </div>
          {error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}
          <Button type="submit" size="lg">
            <Send className="h-4 w-4" aria-hidden="true" /> Send message (demo)
          </Button>
        </form>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-line bg-white p-5">
            <Mail className="h-5 w-5 text-bronze" aria-hidden="true" />
            <p className="mt-3 font-medium text-ink">Email</p>
            <p className="text-sm text-stone2">hello@nivora.example (demo)</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-5">
            <MapPin className="h-5 w-5 text-bronze" aria-hidden="true" />
            <p className="mt-3 font-medium text-ink">Demo market</p>
            <p className="text-sm text-stone2">Jaipur, Rajasthan, India</p>
          </div>
          <div className="rounded-2xl border border-dashed border-bronze/50 bg-mist p-5 text-sm leading-relaxed text-stone2">
            For property-specific questions, please use <strong className="text-ink">Send enquiry</strong> on the
            property page so your message reaches the advertiser (in production).
          </div>
        </aside>
      </div>
    </div>
  );
}
