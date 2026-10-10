"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { site } from "@/lib/site";

const ORDER_TEMPLATE = ["Quantity: ", "Color preferences: ", "Ship-to ZIP code: ", "Needed by (optional): "].join("\n");

type Field ="name" | "email" | "subject" | "message";
type Errors = Partial<Record<Field, string>>;

function validate(v: Record<Field, string>): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (!v.subject.trim()) e.subject = "Please add a subject.";
  if (v.message.trim().length < 10) e.message = "Please write at least 10 characters.";
  return e;
}

export default function ContactForm() {
  const params = useSearchParams();
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    email: "",
    subject: (params.get("subject") ?? "").slice(0, 150),
    // Order requests from a product page arrive with a short template so we get everything needed to quote.
    message: params.get("item") ? ORDER_TEMPLATE : "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const update = (field: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = (Object.keys(found) as Field[])[0];
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    const company = (new FormData(e.currentTarget).get("company") as string) || "";
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setValues({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="mt-6 rounded-card bg-hb-sage/20 p-6 text-hb-moss">
        <p className="font-semibold">Thanks, your message is on its way.</p>
        <p className="mt-1 text-sm">We’ll reply to the email address you provided.</p>
        <button type="button" className="mt-4 text-sm font-semibold underline" onClick={() => setStatus("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  const fieldProps = (field: Field) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    onChange: update(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
    className: "field mt-1",
  });

  const errorText = (field: Field) =>
    errors[field] && (
      <p id={`contact-${field}-error`} className="field-error">
        {errors[field]}
      </p>
    );

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="field-label">
            Name
          </label>
          <input type="text" autoComplete="name" maxLength={100} {...fieldProps("name")} />
          {errorText("name")}
        </div>
        <div>
          <label htmlFor="contact-email" className="field-label">
            Email
          </label>
          <input type="email" autoComplete="email" maxLength={200} {...fieldProps("email")} />
          {errorText("email")}
        </div>
      </div>
      <div>
        <label htmlFor="contact-subject" className="field-label">
          Subject
        </label>
        <input type="text" maxLength={150} {...fieldProps("subject")} />
        {errorText("subject")}
      </div>
      <div>
        <label htmlFor="contact-message" className="field-label">
          Message
        </label>
        <textarea rows={6} maxLength={5000} {...fieldProps("message")} />
        {errorText("message")}
      </div>

      {/* Honeypot for bots; hidden from people and assistive tech. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" disabled={status === "sending"} className="btn-primary w-full sm:w-auto">
        {status === "sending" ? "Sending…" : "Send message"}
      </button>

      {status === "error" && (
        <p role="alert" className="text-sm text-danger">
          Sorry, your message didn’t go through. Please try again, or call us at{" "}
          <a href={site.phone.href} className="font-semibold underline">
            {site.phone.display}
          </a>
          .
        </p>
      )}
    </form>
  );
}
