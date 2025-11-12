import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Clock, MapPin, Calendar, CheckCircle, Package, Shield, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PremiumCard from "@/components/PremiumCard";
import logisticsBg from "@/assets/logistics-bg.jpg";
import shippingNetwork from "@/assets/shipping-network.jpg";
import courierTeam from "@/assets/courier-team.jpg";
import trackingTech from "@/assets/tracking-tech.jpg";
import jcb from "@/assets/jcb.jpg";
import ourJourney from "@/assets/our-journey.png";

const SchedulePickup = () => {
  // Hero schedule form state (UI only; wire to API later)
  const [pickupPincode, setPickupPincode] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [weight, setWeight] = useState("");

  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Flexible Scheduling",
      description: "Schedule pickups at your convenience - same day or advance booking"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-time Tracking",
      description: "Track your pickup agent in real-time with live GPS updates"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Doorstep Pickup",
      description: "Our agents will collect packages directly from your location"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Instant Confirmation",
      description: "Get instant booking confirmation with pickup details"
    }
  ];

  const steps = [
    { step: "1", title: "Schedule Pickup", description: "Choose time and share package details online" },
    { step: "2", title: "Pickup Confirmed", description: "Instant confirmation and dispatch scheduling" },
    { step: "3", title: "Secure Transit", description: "Tamper-evident handling and verified custody" },
    { step: "4", title: "Delivered with Care", description: "Professional handover and confirmation" }
  ];

  const services = [
    { icon: <Truck className="w-6 h-6" />, title: "Express Courier", desc: "Same-day and next-day pickups for priority parcels" },
    { icon: <Package className="w-6 h-6" />, title: "Bulk Shipments", desc: "Optimized pickup for cartons and multi-piece loads" },
    { icon: <Shield className="w-6 h-6" />, title: "Secure Handling", desc: "Tamper-evident sealing and ID-verified partners" },
    { icon: <Sparkles className="w-6 h-6" />, title: "White-Glove", desc: "Premium doorstep experience for high-value items" }
  ];

  const [activeService, setActiveService] = useState(1);

  const whyRef = useRef<HTMLDivElement | null>(null);
  const coreRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffffff] to-[#f8f6f5] flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-16">
        {/* Hero Section - Cinematic full-screen banner */}
        <section className="relative min-h-[80vh] flex items-center overflow-hidden" style={{ backgroundImage: `url(${ourJourney})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(43,14,14,0.8) 0%, rgba(43,14,14,0.55) 30%, rgba(43,14,14,0) 70%)" }} />
          <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 200px rgba(0,0,0,0.25)" }} />
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.19,1,0.22,1] }}
              className="w-full lg:w-[45%]"
            >
              <div className="mb-3 text-[12px] uppercase tracking-wide text-white/70">Premium Pickup Experience</div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">Schedule Your Pickup</h1>
              <p className="text-white/85 text-base md:text-lg mb-6 max-w-xl">Luxury-grade logistics at your doorstep. Elegant, smooth, and effortless scheduling with real-time tracking and instant confirmation.</p>
              <div id="schedule-form" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                  <input value={pickupPincode} onChange={(e) => setPickupPincode(e.target.value)} placeholder="Pickup Pincode" className="rounded-md bg-white text-[#1a1a1a] px-4 py-3 placeholder-[#8c8c8c] focus:outline-none focus:ring-2 focus:ring-[#FF9F0D]/50" />
                  <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="rounded-md bg-white text-[#1a1a1a] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF9F0D]/50" />
                  <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="rounded-md bg-white text-[#1a1a1a] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF9F0D]/50" />
                </div>
                <motion.div className="mt-5" whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Button className="relative overflow-hidden rounded-full px-8 py-4 text-lg font-semibold text-white shadow-[0_12px_30px_rgba(255,159,13,0.35)]" style={{ backgroundImage: "linear-gradient(135deg, #FF9F0D 0%, #A64B2A 100%)" }}>
                    Schedule Pickup
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        

        {/* Why Choose OCL Pickup - Interactive 3D Cards with Silhouette BG */}
        <section ref={whyRef} className="pt-10 pb-24 md:pb-32 relative why-section bg-white">
          {/* clean background (removed silhouette image) */}
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.19,1,0.22,1] }}
              className="text-center mb-2"
            >
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.19,1,0.22,1], delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold text-foreground mb-3"
              >
                Why Choose OCL Pickup
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.19,1,0.22,1], delay: 0.6 }}
                className="text-muted-foreground max-w-2xl mx-auto"
              >
                Premium-grade convenience and reliability for every pickup
              </motion.p>
            </motion.div>
            {/* Synced 2-column carousel */}
            <WhyCarousel features={features} />
          </div>
        </section>

        {/* Core Services - Mirrored cinematic carousel */}
        <section className="pt-10 pb-20 relative min-h-[600px] w-full" style={{ background: "linear-gradient(180deg, #FE9F19 0%, #FAD7A1 30%, #F3E0D5 65%, #FFFFFF 100%)" }}>
          <div className="container mx-auto px-4 w-full">
            <CoreServicesCarousel />
          </div>
        </section>

        {/* How OCL Handles Your Pickup - Cinematic Timeline */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">!!! How OCL Handles Your Consignments !!!</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">A transparent, technology-first flow — from request to delivery</p>
            </motion.div>

              <div className="max-w-5xl mx-auto relative">
              {/* connecting line */}
              <div
                aria-hidden
                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 rounded-full shadow-[0_6px_24px_rgba(0,0,0,0.04)] z-0"
                style={{ background: "#FE9F19" }}
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                {steps.map((s, idx) => (
                  <motion.div
                    key={s.step}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.15 * idx, ease: [0.19, 1, 0.22, 1] }}
                    className="relative text-center"
                  >
                    <div className="mx-auto mb-3 flex items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full text-white font-semibold" style={{ background: "#FE9F19" }}>
                        {s.step}
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/60 bg-white p-4" style={{ boxShadow: "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px" }}>
                      <h3 className="font-semibold text-[#1a1a1a] mb-1">{s.title}</h3>
                      <p className="text-sm text-[#6b6b6b]">{s.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Ready to Ship? CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-3xl">
              <motion.div
                className="absolute inset-0"
                style={{ backgroundImage: "linear-gradient(135deg, #5a1e1e 0%, #a86b45 100%)" }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative z-10 px-6 md:px-12 py-14 text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold text-white mb-3"
                >
                  Ready to Ship with OCL?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-base md:text-lg mb-8"
                  style={{ color: "#f5e3cc" }}
                >
                  Experience secure, on-time, and professional logistics — powered by OCL’s trusted network.
                </motion.p>
                <div className="flex flex-wrap justify-center gap-4">
                  <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.19,1,0.22,1] }}>
                  <Button
                    className="rounded-full text-white font-semibold px-8 py-4 text-lg shadow-[0_12px_30px_rgba(254,159,25,0.25)]"
                    style={{ background: "#FE9F19" }}
                      onClick={() => {
                        const el = document.getElementById('schedule-form');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    >
                      Schedule a Pickup
                    </Button>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.19,1,0.22,1], delay: 0.2 }}>
                    <a href="/track">
                      <Button
                        className="rounded-full px-8 py-4 text-lg font-semibold bg-white text-[#0C1B33] hover:bg-[#FE9F19] hover:text-white border-0"
                      >
                        Track Shipment
                      </Button>
                    </a>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SchedulePickup;

// Local component: WhyCarousel
const WhyCarousel: React.FC<{ features: { icon: React.ReactNode; title: string; description: string }[] }> = ({ features }) => {
  const cards = [
    { title: "Flexible Scheduling", description: "Schedule pickups at your convenience — same day or advance booking", color: "bg-blue-400" },
    { title: "Real-time Tracking", description: "Track your pickup agent with live GPS updates", color: "bg-orange-400" },
    { title: "Doorstep Pickup", description: "Our agents collect packages right from your location", color: "bg-green-400" },
    { title: "Instant Confirmation", description: "Get immediate booking confirmation with details", color: "bg-purple-400" }
  ];

  return (
    <div className="w-11/12 mx-auto mt-8 md:mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className={`${card.color} rounded-2xl p-6 text-white`}
            style={{ boxShadow: "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px" }}
          >
            <h3 className="text-xl font-bold mb-3">{card.title}</h3>
            <p className="text-white/90 text-sm leading-relaxed">{card.description}</p>
              </motion.div>
        ))}
      </div>
    </div>
  );
};

// Local component: CoreServicesCarousel (mirrors WhyCarousel with image on left and cards on right)
const CoreServicesCarousel: React.FC = () => {
  const cards = [
    { title: "Express Courier", description: "Priority shipments with tight SLAs", imageSrc: shippingNetwork, tag: "SERVICE", gradient: "linear-gradient(135deg, #5A1E1E 0%, #A86B45 100%)" },
    { title: "Bulk Shipments", description: "Optimized pickups for cartons & pallets", imageSrc: logisticsBg, tag: "SERVICE", gradient: "linear-gradient(135deg, #6E3E1E 0%, #C1824A 100%)" },
    { title: "Secure Handling", description: "ID-verified partners and custody trail", imageSrc: trackingTech, tag: "FEATURE", gradient: "linear-gradient(135deg, #3D1E1E 0%, #7E4A45 100%)" },
    { title: "White-Glove", description: "Premium doorstep experience for valuables", imageSrc: courierTeam, tag: "FEATURE", gradient: "linear-gradient(135deg, #A86B45 0%, #F5D3A1 100%)" }
  ];

  // Card order: Express (0) -> Bulk (1) -> White-Glove (3) -> Secure (2) -> Express (0)
  // Card positions in viewBox coordinates (0-100):
  // Express (0): center at (25, 25)
  // Bulk (1): center at (75, 25)
  // White-Glove (3): center at (75, 75)
  // Secure (2): center at (25, 75)
  const cardPositions = [
    { x: 25, y: 25, index: 0 }, // Express
    { x: 75, y: 25, index: 1 }, // Bulk
    { x: 25, y: 75, index: 2 }, // Secure
    { x: 75, y: 75, index: 3 }  // White-Glove
  ];
  
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [pathProgress, setPathProgress] = useState(0);

  // Calculate dot position along the path
  const getDotPosition = (progress: number) => {
    // Path: M 25 25 L 75 25 L 75 75 L 25 75 Z
    // Segments: 0-25%: (25,25)->(75,25), 25-50%: (75,25)->(75,75), 50-75%: (75,75)->(25,75), 75-100%: (25,75)->(25,25)
    const segment = progress * 4;
    const segmentProgress = segment % 1;
    
    if (segment < 1) {
      // Express to Bulk (top horizontal)
      return { x: 25 + (75 - 25) * segmentProgress, y: 25 };
    } else if (segment < 2) {
      // Bulk to White-Glove (right vertical)
      return { x: 75, y: 25 + (75 - 25) * segmentProgress };
    } else if (segment < 3) {
      // White-Glove to Secure (bottom horizontal)
      return { x: 75 - (75 - 25) * segmentProgress, y: 75 };
    } else {
      // Secure to Express (left vertical)
      return { x: 25, y: 75 - (75 - 25) * segmentProgress };
    }
  };

  useEffect(() => {
    const duration = 8000; // 8 seconds for full loop
    
    let startTime = Date.now();
    let animationFrame: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % duration) / duration;
      setPathProgress(progress);

      // Get current dot position
      const dotPos = getDotPosition(progress);
      
      // Check which card the dot is inside (within ~15 units of card center)
      const cardRadius = 15; // Approximate card radius in viewBox units
      let activeCard: number | null = null;
      
      for (const card of cardPositions) {
        const distance = Math.sqrt(
          Math.pow(dotPos.x - card.x, 2) + Math.pow(dotPos.y - card.y, 2)
        );
        if (distance <= cardRadius) {
          activeCard = card.index;
          break;
        }
      }
      
      setActiveCardIndex(activeCard);

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="w-11/12 mx-auto">
      {/* Centered Title and Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.19,1,0.22,1] }}
        className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-1">Core Services</h2>
          <p className="text-muted-foreground">Enterprise-grade capabilities, delivered with cinematic polish</p>
        </motion.div>

      {/* Content Row: Image on Left, Cards on Right */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* LEFT COLUMN: Image (38%) */}
        <div className="w-full lg:w-[38%] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: [0.19,1,0.22,1] }}
          animate={{ y: [0, -10, 0] }}
            className="w-full h-[400px] md:h-[450px] relative"
        >
          <img src={jcb} alt="Core services visual" className="absolute inset-0 w-full h-full object-cover" />
        </motion.div>
      </div>

        {/* Spacer on large screens (reduced to free more width for cards) */}
        <div className="hidden lg:block w-[2%]" />

        {/* RIGHT: Static 4-card row (60%) - aligned to middle of left image */}
        <div className="w-full lg:w-[60%] flex items-center">
          <div className="relative w-full" style={{ minHeight: '400px' }}>
            {/* Connecting line through card centers (Express -> Bulk -> White-Glove -> Secure -> Express) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Path: Top-left (25,25) -> Top-right (75,25) -> Bottom-right (75,75) -> Bottom-left (25,75) -> Top-left (25,25) */}
              <path
                id="card-path"
                d="M 25 25 L 75 25 L 75 75 L 25 75 Z"
                fill="none"
                stroke="#FE9F19"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              />
              {/* Animated dot */}
              <circle r="2.5" fill="#FE9F19" opacity="1">
                <animateMotion
                  dur="8s"
                  repeatCount="indefinite"
                  path="M 25 25 L 75 25 L 75 75 L 25 75 Z"
                />
              </circle>
            </svg>
            <div className="grid grid-cols-2 gap-4 md:gap-6 items-start justify-items-center w-full relative z-10">
            {cards.map((f, i) => {
              const isActive = activeCardIndex === i;
              return (
              <div key={i} className="w-full min-w-0 flex flex-col items-center">
                <motion.div
                  animate={{
                    scale: isActive ? 1.15 : 1
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut"
                  }}
                >
              <PremiumCard
                imageSrc={f.imageSrc}
                title={f.title}
                subtitle={f.description}
                tag={f.tag}
                gradient={f.gradient}
                    className="h-[150px] w-[150px] rounded-[12px]"
                  />
                </motion.div>
                {/* Title below card */}
                <h3 className="mt-3 text-center text-[14px] font-semibold text-[#1a1a1a]">
                  {f.title}
                </h3>
              </div>
            )})}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};