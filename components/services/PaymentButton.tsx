"use client";

import { useState } from "react";
import Script from "next/script";
import { Loader2, CheckCircle2, AlertCircle, MessageCircle, ShieldCheck, Lock, Clock } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input, Label, FieldError } from "@/components/ui/Input";
import { SERVICES, type ServiceType } from "@/lib/config";
import { formatINR } from "@/lib/utils";

type Status = "idle" | "form" | "loading" | "success" | "error";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export function PaymentButton({
  type,
  propertySlug,
  propertyAddress,
  className,
}: {
  type: ServiceType;
  propertySlug?: string;
  propertyAddress?: string;
  className?: string;
}) {
  const service = SERVICES[type];
  const [status, setStatus] = useState<Status>("idle");
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState("");
  const [waUrl, setWaUrl] = useState("");
  const [buyer, setBuyer] = useState({ name: "", phone: "", address: "" });
  const [touched, setTouched] = useState(false);

  const validName = buyer.name.trim().length >= 2;
  const validPhone = /^[0-9]{10}$/.test(buyer.phone.replace(/\D/g, "").slice(-10));

  const isGold = type === "concierge";
  const btnClass = isGold
    ? "bg-gold-500 text-white shadow-cta hover:bg-gold-600"
    : "bg-forest-700 text-white shadow-cta hover:bg-forest-800";

  async function startPayment() {
    setTouched(true);
    if (!validName || !validPhone) return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          propertySlug,
          propertyAddress: propertyAddress || buyer.address,
          buyerName: buyer.name,
          buyerPhone: buyer.phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start payment.");
      if (!window.Razorpay) throw new Error("Payment library failed to load.");

      const rzp = new window.Razorpay({
        key: data.key,
        order_id: data.orderId,
        amount: data.amount,
        currency: data.currency,
        name: "miestate",
        description: service.name,
        prefill: { name: buyer.name, contact: buyer.phone },
        theme: { color: "#0E6476" },
        modal: { ondismiss: () => setStatus("form") },
        handler: async (resp: any) => {
          setStatus("loading");
          try {
            const v = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: resp.razorpay_order_id,
                razorpayPaymentId: resp.razorpay_payment_id,
                razorpaySignature: resp.razorpay_signature,
              }),
            });
            const vd = await v.json();
            if (!v.ok) throw new Error(vd.error || "Verification failed.");
            setWaUrl(vd.whatsappUrl || "");
            setStatus("success");
          } catch (e: any) {
            setError(e.message);
            setStatus("error");
          }
        },
      });
      rzp.on("payment.failed", (resp: any) => {
        setError(resp?.error?.description || "Payment failed. Please try again.");
        setStatus("error");
      });
      rzp.open();
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptReady(true)}
        strategy="lazyOnload"
      />
      <button
        onClick={() => setStatus("form")}
        className={`${btnClass} rounded-lg px-5 py-2.5 text-[13px] font-semibold transition-all hover:-translate-y-0.5 focus-ring ${className ?? ""}`}
      >
        {service.cta}
      </button>

      <Modal
        open={status !== "idle"}
        onClose={() => status !== "loading" && setStatus("idle")}
        title={
          status === "success"
            ? "Payment confirmed"
            : `${service.name} · ${formatINR(service.price)}`
        }
      >
        {status === "form" || status === "loading" ? (
          <div className="space-y-4">
            {propertyAddress && (
              <p className="rounded-lg bg-forest-50 p-3 text-sm text-forest-800">
                For <strong>{propertyAddress}</strong>
              </p>
            )}
            <ul className="space-y-1.5 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-forest-700" />
                {type === "report"
                  ? "Report delivered in 48 hours on WhatsApp and email"
                  : "We start your search right after payment"}
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-gold-500" />
                Full refund if we can&apos;t complete it. No questions.
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-forest-700" />
                Payment secured by Razorpay. We never see your card details.
              </li>
            </ul>
            <div>
              <Label htmlFor="pb-name">Your name</Label>
              <Input
                id="pb-name"
                autoFocus
                value={buyer.name}
                onChange={(e) => setBuyer({ ...buyer, name: e.target.value })}
                placeholder="e.g. Vikram Sharma"
              />
              {touched && !validName && <FieldError message="Please enter your name." />}
            </div>
            <div>
              <Label htmlFor="pb-phone">WhatsApp number</Label>
              <Input
                id="pb-phone"
                inputMode="tel"
                value={buyer.phone}
                onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })}
                placeholder="10-digit mobile"
              />
              {touched && !validPhone && (
                <FieldError message="Enter a valid 10-digit number." />
              )}
            </div>
            {!propertyAddress && (
              <div>
                <Label htmlFor="pb-addr">Property address</Label>
                <Input
                  id="pb-addr"
                  value={buyer.address}
                  onChange={(e) => setBuyer({ ...buyer, address: e.target.value })}
                  placeholder="Project / locality you're considering"
                />
              </div>
            )}
            <button
              onClick={startPayment}
              disabled={status === "loading" || !scriptReady}
              className={`${btnClass} flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-medium disabled:opacity-50`}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Starting secure payment…
                </>
              ) : (
                `Pay ${formatINR(service.price)} securely`
              )}
            </button>
            <p className="text-center text-xs text-gray-500">
              Secured by Razorpay. Confirmation on WhatsApp.
            </p>
          </div>
        ) : status === "success" ? (
          <div className="space-y-4 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-forest-600" />
            <p className="text-sm text-gray-700">
              Your {service.name.toLowerCase()} is confirmed. We&apos;ll deliver
              via WhatsApp {type === "report" ? "in 48 hours" : "and get started right away"}.
            </p>
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-3 text-sm font-medium text-white"
              >
                <MessageCircle size={16} /> Open WhatsApp
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
            <div>
              <p className="font-medium text-gray-900">Payment didn&apos;t go through</p>
              <p className="mt-1 text-sm text-gray-600">{error}</p>
              <p className="mt-1 text-xs text-gray-500">
                You have not been charged. You can retry.
              </p>
            </div>
            <button
              onClick={() => setStatus("form")}
              className={`${btnClass} w-full rounded-md px-5 py-2.5 text-sm font-medium`}
            >
              Try again
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
