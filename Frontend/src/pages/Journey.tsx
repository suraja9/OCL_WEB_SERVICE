import { motion, useReducedMotion } from "framer-motion";
import { 
  Building2, 
  MapPin, 
  Monitor, 
  Plane, 
  Factory,
  Truck,
  Package,
  Network,
  Rocket,
  CheckCircle2,
  Cog
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import courierTeamImg from "@/assets/courier-team.jpg";
import logisticsBgImg from "@/assets/logistics-bg.jpg";
import shippingNetworkImg from "@/assets/shipping-network.jpg";
import hero1Img from "@/assets/hero-1.jpg";
import hero2Img from "@/assets/hero-2.jpg";
import hero3Img from "@/assets/hero-3.jpg";
import Timeline, { Milestone } from "@/components/journey/Timeline";
import FoundersGrid, { Founder } from "@/components/journey/FoundersGrid";
import TeamMasonry, { TeamMember } from "@/components/journey/TeamMasonry.tsx";
import ShowcaseCard from "@/components/journey/ShowcaseCard";

const Journey = () => {
  const prefersReducedMotion = useReducedMotion();

  const milestones: Milestone[] = [
    {
      id: "2001",
      year: "2001",
      title: "Foundation Year",
      summary:
        "Started as a dedicated local courier with a promise of reliability.",
      details:
        "We began operations with a small team, a smaller fleet, and a big vision: deliver trust with every shipment.",
      media: { type: "image", src: hero1Img, alt: "Early OCL operations" },
      pastelClass: "bg-blue-50",
      icon: <CheckCircle2 className="h-5 w-5 text-[#0A6B6B]" />
    },
    {
      id: "2008",
      year: "2008",
      title: "Regional Growth",
      summary:
        "Scaled our network and capabilities to serve regional B2B logistics.",
      details:
        "With expanded routes and service partnerships, we improved speed and coverage while keeping costs predictable.",
      media: { type: "image", src: shippingNetworkImg, alt: "Regional network" },
      pastelClass: "bg-yellow-50",
      icon: <MapPin className="h-5 w-5 text-[#0A6B6B]" />
    },
    {
      id: "2017",
      year: "2017",
      title: "Digital Transformation",
      summary:
        "Launched online booking, live tracking, and customer self-serve tools.",
      details:
        "We modernized our stack and processes to bring transparency and immediacy to every customer interaction.",
      media: { type: "image", src: hero2Img, alt: "Digital platform" },
      pastelClass: "bg-green-50",
      icon: <Monitor className="h-5 w-5 text-[#0A6B6B]" />
    },
    {
      id: "2021",
      year: "2021",
      title: "Multi‑Modal Expansion",
      summary: "Introduced Rail and Air logistics for end‑to‑end coverage.",
      details:
        "Multi‑modal routing allowed us to balance cost, speed, and reliability at scale.",
      media: { type: "image", src: logisticsBgImg, alt: "Multi-modal logistics" },
      pastelClass: "bg-purple-50",
      icon: <Plane className="h-5 w-5 text-[#0A6B6B]" />
    },
    {
      id: "2023",
      year: "2023",
      title: "Specialized Logistics",
      summary:
        "Launched Industrial & Infrastructure Logistics for heavy and complex loads.",
      details:
        "We now support construction logistics, oversize loads, and project cargo with specialist teams.",
      media: { type: "image", src: hero3Img, alt: "Specialized logistics" },
      pastelClass: "bg-pink-50",
      icon: <Factory className="h-5 w-5 text-[#0A6B6B]" />
    }
  ];

  const founders: Founder[] = [
    {
      id: "f1",
      name: "Arun Sharma",
      role: "Founder & CEO",
      bio: "Sets vision and standards for trust, scale, and innovation.",
      story:
        "Arun started OCL to solve reliability in last‑mile operations. Two decades later, the same obsession with precision and transparency guides our platform and culture."
    },
    {
      id: "f2",
      name: "Meera Das",
      role: "Co‑Founder & COO",
      bio: "Leads operations, safety, compliance, and partner growth.",
      story:
        "Meera built our operating playbook and nationwide partner network, transforming OCL into a dependable backbone for enterprises."
    },
    {
      id: "f3",
      name: "Rahul Sen",
      role: "Co‑Founder & CTO",
      bio: "Owns the tech roadmap for routing, tracking, and automation.",
      story:
        "Rahul’s team modernized our stack, enabling live tracking, predictive ETAs, and proactive exception handling."
    }
  ];

  const team: TeamMember[] = [
    { id: "t1", name: "Aditi", role: "Ops Lead", group: "Operations", photo: courierTeamImg },
    { id: "t2", name: "Karan", role: "Driver", group: "Driver", photo: hero1Img },
    { id: "t3", name: "Priya", role: "Sales Manager", group: "Sales", photo: hero2Img },
    { id: "t4", name: "Imran", role: "Warehouse Supervisor", group: "Warehousing", photo: shippingNetworkImg },
    { id: "t5", name: "Sonia", role: "Dispatcher", group: "Operations", photo: logisticsBgImg },
    { id: "t6", name: "Vikram", role: "Driver", group: "Driver", photo: hero3Img }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF8F4" }}>
      <Navbar />
      
      {/* HERO */}
      <motion.section
        className="relative w-full pt-[140px] md:pt-[160px] pb-20 md:pb-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-[1440px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[64px] leading-[1.05] font-bold text-[#0D1B2A]"
                style={{ fontFamily: "Merriweather, 'Playfair Display', serif" }}
            >
              Our Journey
            </h1>
              <p className="mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-[#2b3442]">
                A bold story of scale and precision—from local courier roots to a
                multi‑modal logistics network. Built on trust, engineered for speed.
              </p>
            </div>
            <motion.div
              className="relative rounded-[24px] p-6 md:p-8 bg-white/60 backdrop-blur shadow-[0_30px_60px_rgba(13,27,42,0.12)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="relative grid grid-cols-3 gap-4 md:gap-6">
                <motion.div
                  className="col-span-2 rounded-2xl overflow-hidden relative"
                  initial={{ y: 12 }}
                  animate={{ y: 0 }}
                  transition={
                    prefersReducedMotion ? { duration: 0.1 } : { duration: 0.8, ease: "easeOut" }
                  }
                >
                  <img
                    src={logisticsBgImg}
                    alt=""
                    loading="lazy"
                    className="h-[220px] md:h-[260px] w-full object-cover"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
            <motion.div
                  className="rounded-2xl overflow-hidden grid place-items-center bg-[#0A6B6B]"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                >
                  <Truck className="h-10 w-10 text-white opacity-90" />
                </motion.div>
              </div>
              <div className="mt-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#0A6B6B] text-white px-3 py-1 text-xs font-semibold">
                  <Rocket className="h-4 w-4" />
                  Timeline preview
                </div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {milestones.slice(0, 3).map((m) => (
                    <div key={m.id} className="rounded-xl bg-[#F0EBE2] px-4 py-3">
                      <div className="text-xs font-semibold text-[#0A6B6B]">{m.year}</div>
                      <div className="text-sm font-bold text-[#0D1B2A]">{m.title}</div>
                  </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* TIMELINE */}
      <section className="py-14 md:py-20">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold text-[#0D1B2A] mb-8"
            style={{ fontFamily: "Merriweather, serif" }}
          >
            Milestones
          </h2>
          <Timeline milestones={milestones} ariaLabel="OCL milestones" />
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="py-14 md:py-20" style={{ backgroundColor: "#F0EBE2" }}>
        <div className="max-w-[1440px] mx-auto px-5 md:px-8">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold text-[#0D1B2A] mb-10 text-center"
              style={{ fontFamily: "Merriweather, serif" }}
            >
              Founders
            </h2>
          <FoundersGrid founders={founders} />
        </div>
      </section>

      {/* TEAM */}
      <section className="py-14 md:py-20">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-1">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold text-[#0D1B2A]"
                style={{ fontFamily: "Merriweather, serif" }}
              >
                The Team
              </h2>
              <p className="mt-3 text-sm sm:text-base md:text-lg text-[#2b3442]">
                People who make precision possible—across operations, fleet, sales,
                and warehousing.
              </p>
              <div className="mt-6">
                <ShowcaseCard
                  header="Culture"
                  subheader="Reliable. Respectful. Relentless."
                  className="max-w-md"
                >
                  <div className="text-sm text-[#2b3442]">
                    We obsess over clarity and accountability, and we celebrate the
                    people behind every on‑time delivery.
                </div>
                </ShowcaseCard>
          </div>
        </div>
            <div className="lg:col-span-2">
              <TeamMasonry members={team} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Journey;
