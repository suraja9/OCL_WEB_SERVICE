import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { Linkedin, Mail, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type Founder = {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarSrc?: string;
  linkedin?: string;
  email?: string;
  story?: string;
};

type FoundersGridProps = {
  founders: Founder[];
  className?: string;
};

export function FoundersGrid({ founders, className }: FoundersGridProps) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
        className
      )}
      role="list"
    >
      {founders.map((f, i) => (
        <motion.div
          key={f.id}
          role="listitem"
          className="relative rounded-[22px] bg-white p-6 shadow-[0_20px_40px_rgba(13,27,42,0.08)]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={
            prefersReducedMotion
              ? { duration: 0.1 }
              : { duration: 0.6, delay: i * 0.05, ease: [0.2, 0.9, 0.2, 1] }
          }
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -z-10 inset-0"
          >
            <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-[radial-gradient(closest-side,#F6B53A,transparent)] opacity-30" />
            <div className="absolute -bottom-12 -right-8 h-48 w-48 rounded-full bg-[radial-gradient(closest-side,#0A6B6B,transparent)] opacity-20" />
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="h-28 w-28 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                {f.avatarSrc ? (
                  <img
                    src={f.avatarSrc}
                    alt={`${f.name} portrait`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center bg-[#FAF8F4] text-2xl text-[#0D1B2A]">
                    👤
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 rounded-full bg-[#0A6B6B] text-white text-xs font-semibold px-2 py-1 shadow-md">
                Founder
              </div>
            </div>

            <div
              className="text-2xl font-bold text-[#0D1B2A]"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              {f.name}
            </div>
            <div className="text-[#0A6B6B] font-semibold">{f.role}</div>
            <p className="mt-2 text-sm text-[#2b3442]">{f.bio}</p>

            <div className="mt-4 flex items-center gap-3">
              {f.linkedin && (
                <a
                  href={f.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${f.name} on LinkedIn`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F5EFE6] text-[#0D1B2A] hover:bg-[#EDE6DA] transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {f.email && (
                <a
                  href={`mailto:${f.email}`}
                  aria-label={`Email ${f.name}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F5EFE6] text-[#0D1B2A] hover:bg-[#EDE6DA] transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </a>
              )}
              <FounderDialogTrigger founder={f} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function FounderDialogTrigger({ founder }: { founder: Founder }) {
  if (!founder.story) return null;
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="inline-flex h-10 items-center justify-center rounded-full bg-[#0A6B6B] px-4 text-white text-sm font-semibold hover:brightness-110 transition"
          aria-haspopup="dialog"
        >
          Story
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[rgba(0,0,0,0.5)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl">
          <div className="flex items-start justify-between">
            <Dialog.Title
              className="text-2xl md:text-3xl font-bold text-[#0D1B2A]"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              {founder.name}
            </Dialog.Title>
            <Dialog.Close
              className="inline-flex items-center justify-center rounded-full p-2 text-[#0D1B2A] hover:bg-[#F5EFE6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6B53A]"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="mt-1 text-[#0A6B6B] font-semibold">
            {founder.role}
          </Dialog.Description>
          <div className="mt-4 text-sm md:text-base text-[#2b3442] leading-relaxed">
            {founder.story}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default FoundersGrid;


