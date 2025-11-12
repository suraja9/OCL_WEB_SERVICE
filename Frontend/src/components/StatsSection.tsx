import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import h10Image from "@/assets/h-10.png";
import h11Image from "@/assets/h-11.png";
import h12Image from "@/assets/h-12.png";
import h13Image from "@/assets/h-13.png";

const services = [
  {
    id: 1,
    title: "Reliable Road Transport Solutions",
    illustration: "road"
  },
  {
    id: 2,
    title: "Heavy-Duty Trailer Services",
    illustration: "trailer"
  },
  {
    id: 3,
    title: "Fast & Secure Air Cargo Services",
    illustration: "air"
  },
  {
    id: 4,
    title: "Efficient Rail Cargo Network",
    illustration: "railway"
  }
];

// Isometric SVG Illustrations
const IsometricIllustrations = {
  road: (
    <svg viewBox="0 0 200 150" className="w-full h-auto">
      {/* Road */}
      <path d="M0,120 L200,120 L200,150 L0,150 Z" fill="#E5E7EB" />
      <path d="M0,130 L200,130 L200,140 L0,140 Z" fill="#9CA3AF" />
      
      {/* Truck - Isometric */}
      <g transform="translate(80, 80)">
        {/* Truck body */}
        <path d="M0,30 L30,15 L30,0 L0,15 Z" fill="#F7931E" />
        <path d="M30,0 L60,15 L60,30 L30,15 Z" fill="#E67E00" />
        <rect x="0" y="15" width="60" height="15" fill="#F7931E" />
        
        {/* Windows */}
        <path d="M5,20 L15,15 L15,10 L5,15 Z" fill="#87CEEB" />
        <path d="M20,15 L35,20 L35,25 L20,20 Z" fill="#5BA3D0" />
        
        {/* Wheels */}
        <ellipse cx="15" cy="35" rx="8" ry="4" fill="#1F2937" />
        <ellipse cx="45" cy="35" rx="8" ry="4" fill="#1F2937" />
      </g>
    </svg>
  ),
  trailer: (
    <svg viewBox="0 0 200 150" className="w-full h-auto">
      {/* Road */}
      <path d="M0,120 L200,120 L200,150 L0,150 Z" fill="#E5E7EB" />
      <path d="M0,130 L200,130 L200,140 L0,140 Z" fill="#9CA3AF" />
      
      {/* Trailer Truck - Isometric */}
      <g transform="translate(50, 60)">
        {/* Truck cab */}
        <path d="M0,50 L25,40 L25,10 L0,20 Z" fill="#F7931E" />
        <path d="M25,10 L45,20 L45,50 L25,40 Z" fill="#E67E00" />
        <rect x="0" y="20" width="45" height="30" fill="#F7931E" />
        
        {/* Trailer */}
        <path d="M45,50 L120,35 L120,5 L45,20 Z" fill="#F7931E" />
        <path d="M120,5 L140,10 L140,40 L120,35 Z" fill="#E67E00" />
        <rect x="45" y="20" width="95" height="30" fill="#F7931E" />
        
        {/* Windows */}
        <path d="M5,25 L15,20 L15,15 L5,20 Z" fill="#87CEEB" />
        
        {/* Wheels */}
        <ellipse cx="20" cy="60" rx="8" ry="4" fill="#1F2937" />
        <ellipse cx="70" cy="55" rx="8" ry="4" fill="#1F2937" />
        <ellipse cx="110" cy="55" rx="8" ry="4" fill="#1F2937" />
      </g>
    </svg>
  ),
  air: (
    <svg viewBox="0 0 200 150" className="w-full h-auto">
      {/* Sky gradient */}
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#E0F2FE" />
        </linearGradient>
      </defs>
      <rect width="200" height="150" fill="url(#skyGrad)" />
      
      {/* Clouds */}
      <ellipse cx="50" cy="40" rx="20" ry="12" fill="#FFFFFF" opacity="0.7" />
      <ellipse cx="150" cy="50" rx="25" ry="15" fill="#FFFFFF" opacity="0.7" />
      
      {/* Plane - Isometric */}
      <g transform="translate(70, 60)">
        {/* Plane body */}
        <path d="M0,20 L50,10 L50,0 L0,10 Z" fill="#F7931E" />
        <path d="M50,0 L60,5 L60,15 L50,10 Z" fill="#E67E00" />
        <rect x="0" y="10" width="60" height="10" fill="#F7931E" />
        
        {/* Wings */}
        <path d="M15,15 L25,5 L30,10 L20,20 Z" fill="#0C2340" />
        <path d="M15,10 L25,0 L30,5 L20,15 Z" fill="#1E3A8A" />
      </g>
    </svg>
  ),
  railway: (
    <svg viewBox="0 0 200 150" className="w-full h-auto">
      {/* Ground/Tracks */}
      <path d="M0,120 L200,120 L200,150 L0,150 Z" fill="#E5E7EB" />
      <rect x="0" y="125" width="200" height="8" fill="#9CA3AF" />
      <rect x="0" y="137" width="200" height="8" fill="#9CA3AF" />
      
      {/* Railway Train - Isometric */}
      <g transform="translate(40, 70)">
        {/* Locomotive */}
        <path d="M0,50 L40,35 L40,5 L0,20 Z" fill="#F7931E" />
        <path d="M40,5 L55,10 L55,40 L40,35 Z" fill="#E67E00" />
        <rect x="0" y="20" width="55" height="30" fill="#F7931E" />
        
        {/* Locomotive details */}
        <rect x="5" y="25" width="15" height="10" fill="#0C2340" />
        <rect x="25" y="25" width="20" height="10" fill="#0C2340" />
        
        {/* Train cars */}
        <path d="M55,50 L100,38 L100,8 L55,20 Z" fill="#F7931E" />
        <path d="M100,8 L115,13 L115,43 L100,38 Z" fill="#E67E00" />
        <rect x="55" y="20" width="60" height="30" fill="#F7931E" />
        <rect x="60" y="25" width="50" height="20" fill="#0C2340" />
        
        {/* Wheels */}
        <ellipse cx="20" cy="55" rx="6" ry="3" fill="#1F2937" />
        <ellipse cx="75" cy="53" rx="6" ry="3" fill="#1F2937" />
        <ellipse cx="95" cy="53" rx="6" ry="3" fill="#1F2937" />
      </g>
    </svg>
  )
};

const StatsSection = () => {
  return (
    <section 
      className="w-full py-12 md:py-16 relative overflow-hidden"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {/* Service Cards */}
      <div className="max-w-[98%] xl:max-w-[95%] 2xl:max-w-[92%] mx-auto px-4 sm:px-6 lg:px-8 mb-12 md:mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-14 xl:gap-16">
          {services.map((service, index) => {
            const descriptions: Record<string, string> = {
              road: "Reliable truck logistics ensuring safe and on-time deliveries nationwide.",
              trailer: "Heavy-duty trailers built for large, long-distance cargo movement.",
              air: "Cost-effective and efficient freight transport through our rail network.",
              railway: "Fast, secure, and trackable air cargo solutions for time-critical deliveries."
            };
            
            return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative flex flex-col"
            >
              {/* Service Card */}
              <div
                className="relative w-full bg-white rounded-[10px] overflow-hidden"
                style={{
                  border: "1px solid #E0E0E0",
                  boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                  WebkitBoxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  aspectRatio: "35/10",
                  minHeight: "240px",
                  minWidth: "100%"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.30) 0px 10px 10px";
                  e.currentTarget.style.transform = "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {/* Background Image - Fills entire card, scaled larger */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  {service.illustration === "road" ? (
                    <img src={h13Image} alt={service.title} className="w-full h-full object-cover" style={{ objectPosition: "center", transition: "transform 0.3s ease", transform: "scale(1.25)" }} />
                  ) : service.illustration === "trailer" ? (
                    <img src={h10Image} alt={service.title} className="w-full h-full object-cover" style={{ objectPosition: "center", transition: "transform 0.3s ease", transform: "scale(1.25)" }} />
                  ) : service.illustration === "air" ? (
                    <img src={h11Image} alt={service.title} className="w-full h-full object-cover" style={{ objectPosition: "center", transition: "transform 0.3s ease", transform: "scale(1.25)" }} />
                  ) : service.illustration === "railway" ? (
                    <img src={h12Image} alt={service.title} className="w-full h-full object-cover" style={{ objectPosition: "center", transition: "transform 0.3s ease", transform: "scale(1.25)" }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {IsometricIllustrations[service.illustration as keyof typeof IsometricIllustrations]}
                    </div>
                  )}
                </div>

                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />

                {/* Circular Arrow Button - Always visible, turns orange and rotates on card hover */}
                <div className="absolute bottom-6 right-6 z-30">
                  <motion.button
                    className="arrow-button flex items-center justify-center rounded-full"
                    style={{
                      width: "38px",
                      height: "38px",
                      border: "1.5px solid #FFFFFF",
                      backgroundColor: "transparent",
                      transform: "rotate(0deg)",
                      transformOrigin: "center center",
                      transition: "transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease"
                    }}
                  >
                    <ArrowRight
                      className="w-5 h-5 transition-colors duration-300"
                      style={{ color: "#FFFFFF" }}
                    />
                  </motion.button>
                </div>

                {/* Glass-like overlay - Covers entire card, appears smoothly from bottom on hover */}
                <div 
                  className="absolute inset-0 flex items-center justify-center opacity-0 translate-y-[20px] group-hover:opacity-100 group-hover:translate-y-0 rounded-[10px]"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "opacity 0.4s ease, transform 0.4s ease"
                  }}
                >
                  <p 
                    className="text-white text-sm md:text-base font-medium text-center px-6"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
                    }}
                  >
                    {descriptions[service.illustration] || "Professional logistics solutions"}
                  </p>
                </div>
              </div>

              {/* Service Title - Below the card */}
              <h3
                className="text-center mt-4 text-lg md:text-xl font-bold"
                style={{
                  color: "#1E1E1E",
                  fontFamily: "Poppins, sans-serif"
                }}
              >
                {service.title}
              </h3>
            </motion.div>
            );
          })}
        </div>
      </div>

      {/* Arrow button hover styles - Applied globally */}
      <style>{`
        .group:hover .arrow-button {
          background-color: #F7931E !important;
          border-color: #F7931E !important;
          transform: rotate(-45deg) !important;
        }
        .group:hover .arrow-button svg {
          color: #FFFFFF !important;
        }

        /* Gradient animation for numbers */
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }

        .gradient-number {
          background: linear-gradient(90deg, #ff6a00, #0078ff, #8e2de2);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
          animation: gradientMove 3s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default StatsSection;
