"use client";

import { Eye, Flag, Heart, MessageCircle, Phone, Send } from "lucide-react";
import { useState } from "react";
import { Button, Modal } from "@/components/ui/primitives";
import { useEnquiries, useFavourites, useSession, useToast } from "@/lib/store";
import type { Property } from "@/types/property";

const inputClass =
  "h-12 w-full rounded-xl border border-line bg-white px-4 text-[15px] text-ink transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10";

export function ContactActions({ property: p }: { property: Property }) {
  const { isFav, toggle } = useFavourites();
  const { user } = useSession();
  const { addEnquiry } = useEnquiries();
  const toast = useToast();
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [contact, setContact] = useState(user?.email ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fav = isFav(p.id);

  const submitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) && contact.replace(/\D/g, "").length < 10) {
      return setError("Please enter a valid email or phone number.");
    }
    if (message.trim().length < 10) return setError("Please write a short message (at least 10 characters).");
    addEnquiry({
      id: `enq-${Date.now()}`,
      propertyId: p.id,
      propertyTitle: p.title,
      message: message.trim(),
      name: name.trim(),
      contact: contact.trim(),
      createdAt: new Date().toISOString(),
      status: "Sent (demo)",
    });
    setEnquiryOpen(false);
    setMessage("");
    setError("");
    toast.push("Enquiry saved (demo) — not delivered to a real person");
  };

  return (
    <div className="mt-5 space-y-2.5">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          toggle(p.id);
          toast.push(fav ? "Removed from saved properties" : "Saved to your properties");
        }}
        aria-pressed={fav}
      >
        <Heart className={`h-4 w-4 ${fav ? "fill-current" : ""}`} aria-hidden="true" />
        {fav ? "Saved" : "Save this property"}
      </Button>

      {phoneRevealed ? (
        <div className="rounded-2xl border border-line bg-mist px-4 py-3.5 text-center">
          <p className="text-sm text-muted">Advertiser phone (demo)</p>
          <p className="mt-0.5 text-lg font-semibold tracking-wide text-ink">{p.advertiser.phone}</p>
          <p className="mt-1 text-xs text-muted">Illustrative number — do not call.</p>
        </div>
      ) : (
        <Button className="w-full" onClick={() => setPhoneRevealed(true)}>
          <Phone className="h-4 w-4" aria-hidden="true" /> Reveal phone number
        </Button>
      )}

      <Button variant="outline" className="w-full" onClick={() => setWhatsappOpen(true)}>
        <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp advertiser
      </Button>

      <Button variant="bronze" className="w-full" onClick={() => setEnquiryOpen(true)}>
        <Send className="h-4 w-4" aria-hidden="true" /> Send enquiry
      </Button>

      {/* WhatsApp demo modal */}
      <Modal open={whatsappOpen} onClose={() => setWhatsappOpen(false)} title="WhatsApp (demo)">
        <p className="text-[15px] leading-relaxed text-stone2">
          WhatsApp messaging is not connected in this demo build, so no chat is opened.
          In production, this button would start a WhatsApp conversation with the advertiser.
        </p>
        <div className="mt-4 rounded-xl bg-mist px-4 py-3 text-sm text-stone2">
          Advertiser: <span className="font-medium text-ink">{p.advertiser.name}</span> ·{" "}
          <span className="font-medium text-ink">{p.advertiser.phone}</span> (demo number)
        </div>
        <Button className="mt-5 w-full" onClick={() => setWhatsappOpen(false)}>
          Got it
        </Button>
      </Modal>

      {/* Enquiry modal */}
      <Modal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} title="Send enquiry">
        <p className="text-sm leading-relaxed text-stone2">
          Your enquiry is saved locally for this demo — it is not delivered to a real person.
        </p>
        <form onSubmit={submitEnquiry} className="mt-5 space-y-4" noValidate>
          <div>
            <label htmlFor="enq-name" className="mb-1.5 block text-sm font-medium text-ink">Your name</label>
            <input id="enq-name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="enq-contact" className="mb-1.5 block text-sm font-medium text-ink">Email or phone</label>
            <input id="enq-contact" value={contact} onChange={(e) => setContact(e.target.value)} className={inputClass} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="enq-message" className="mb-1.5 block text-sm font-medium text-ink">Message</label>
            <textarea
              id="enq-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder={`Hi, I'm interested in "${p.title}". Is it still available?`}
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
            />
          </div>
          {error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}
          <Button type="submit" className="w-full" size="lg">
            <Send className="h-4 w-4" aria-hidden="true" /> Send enquiry (demo)
          </Button>
        </form>
      </Modal>
    </div>
  );
}

export function ReportListing({ title }: { title: string }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("Suspicious listing");
  const [details, setDetails] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    setDetails("");
    toast.push("Report recorded (demo). Thank you for helping keep NIVORA safe.");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex min-h-[36px] items-center gap-1.5 rounded text-sm font-medium text-stone2 transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
      >
        <Flag className="h-4 w-4" aria-hidden="true" /> Report this listing
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Report listing">
        <p className="text-sm leading-relaxed text-stone2">
          Reports are recorded locally in this demo. In production, reports go to the moderation team.
        </p>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="report-reason" className="mb-1.5 block text-sm font-medium text-ink">Reason</label>
            <select id="report-reason" value={reason} onChange={(e) => setReason(e.target.value)} className={inputClass}>
              <option>Suspicious listing</option>
              <option>Wrong price or details</option>
              <option>Duplicate listing</option>
              <option>Spam or scam</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="report-details" className="mb-1.5 block text-sm font-medium text-ink">
              Details (optional)
            </label>
            <textarea
              id="report-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              placeholder={`Tell us more about "${title}"…`}
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
            />
          </div>
          <Button type="submit" className="w-full">
            <Eye className="h-4 w-4" aria-hidden="true" /> Submit report (demo)
          </Button>
        </form>
      </Modal>
    </>
  );
}
