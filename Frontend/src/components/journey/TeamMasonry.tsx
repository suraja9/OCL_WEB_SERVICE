import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  group: "Operations" | "Driver" | "Sales" | "Warehousing";
  photo: string;
  email?: string;
};

type TeamMasonryProps = {
  members: TeamMember[];
  className?: string;
};

const groups: Array<TeamMember["group"]> = [
  "Operations",
  "Driver",
  "Sales",
  "Warehousing"
];

export function TeamMasonry({ members, className }: TeamMasonryProps) {
  const [active, setActive] = useState<TeamMember["group"] | "All">("All");
  const prefersReducedMotion = useReducedMotion();

  const filtered = useMemo(
    () => (active === "All" ? members : members.filter((m) => m.group === active)),
    [members, active]
  );

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {["All", ...groups].map((g) => (
          <button
            key={g}
            onClick={() => setActive(g as any)}
            className={cn(
              "inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition",
              active === g
                ? "bg-[#0A6B6B] text-white border-[#0A6B6B]"
                : "bg-white text-[#0D1B2A] border-[#E6E0D6] hover:bg-[#F5EFE6]"
            )}
            aria-pressed={active === g}
          >
            {g}
          </button>
        ))}
      </div>

      <div
        className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]"
        role="list"
      >
        {filtered.map((m, i) => (
          <motion.div
            key={m.id}
            role="listitem"
            className="mb-4 break-inside-avoid rounded-2xl overflow-hidden shadow-[0_18px_40px_rgba(13,27,42,0.08)] group relative"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={
              prefersReducedMotion
                ? { duration: 0.1 }
                : { duration: 0.5, delay: i * 0.03 }
            }
          >
            <div className="relative">
              <img
                src={m.photo}
                alt={`${m.name}, ${m.role}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06] will-change-transform"
              />
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[linear-gradient(0deg,rgba(0,0,0,0.45),transparent_60%)]" />
              <div className="absolute left-0 right-0 bottom-0 p-4 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div>
                  <div className="text-lg font-bold">{m.name}</div>
                  <div className="text-sm opacity-90">{m.role}</div>
                </div>
                {m.email && (
                  <a
                    href={`mailto:${m.email}`}
                    aria-label={`Email ${m.name}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default TeamMasonry;


