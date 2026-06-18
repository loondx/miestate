"use client";

import { useState } from "react";
import { Download, FileText, ExternalLink } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button, ButtonLink } from "@/components/ui/Button";
import { LeadForm } from "@/components/shared/LeadForm";

/**
 * Gates the brochure / cost sheet behind a quick name+phone capture.
 * On submit we save the lead, then reveal the developer brochure link.
 */
export function BrochureGate({
  propertyName,
  brochureUrl,
  className,
  variant = "outline",
}: {
  propertyName: string;
  brochureUrl?: string;
  className?: string;
  variant?: "outline" | "primary" | "accent";
}) {
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        className={className}
        onClick={() => setOpen(true)}
      >
        <Download className="h-4 w-4" /> Download cost sheet
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={unlocked ? "Your cost sheet is ready" : `Get the ${propertyName} cost sheet`}
      >
        {unlocked ? (
          <div className="space-y-4 pb-2 text-center">
            <FileText className="mx-auto h-10 w-10 text-forest-600" />
            <p className="text-sm text-gray-600">
              Thanks! Tap below to open the brochure & cost sheet. Rohit will also
              follow up with verified floor plans and a customised quote.
            </p>
            {brochureUrl ? (
              <ButtonLink href={brochureUrl} external className="w-full">
                Open brochure <ExternalLink className="h-4 w-4" />
              </ButtonLink>
            ) : (
              <p className="text-sm text-gray-500">
                We&apos;ll WhatsApp you the brochure shortly.
              </p>
            )}
          </div>
        ) : (
          <div className="pb-2">
            <p className="mb-4 text-sm text-gray-600">
              Enter your details and we&apos;ll share the verified brochure,
              floor plans and a customised cost sheet.
            </p>
            <LeadForm
              source="brochure-gate"
              defaultRequirement="brochure"
              lockRequirement
              propertyInterest={propertyName}
              submitLabel="Get the cost sheet"
              successTitle=""
              successBody=""
              onSuccess={() => setUnlocked(true)}
            />
          </div>
        )}
      </Modal>
    </>
  );
}
