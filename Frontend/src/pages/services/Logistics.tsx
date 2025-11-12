import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useScrollAnimation, useStaggeredAnimation } from "@/hooks/useScrollAnimation";
import { Lightbulb, BarChart3, Rocket, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import truckImage from "@/assets/truck.jpg";
import retailImage from "@/assets/retail.png";
import manufacturingImage from "@/assets/manufacturing.png";
import ecommerceImage from "@/assets/e-commerce.png";
import healthcareImage from "@/assets/health-care.png";
import constructionImage from "@/assets/construction.png";
import dayToDayLifeImage from "@/assets/day-to-day.png";

const Logistics = () => {
  const titleAnimation = useScrollAnimation();
  const industryAnimations = useStaggeredAnimation(4, 150);
  const processAnimations = useStaggeredAnimation(4, 150);
  const logisticsServices = [
    {
      title: "LESS THAN TRUCK LOAD (LTL)",
      description: "Reliable and affordable small shipment solutions across India with full tracking support."
    },
    {
      title: "FULL TRUCK LOAD (FTL)",
      description: "Move bulk loads anywhere in India with end-to-end logistics management and timely delivery."
    },
    {
      title: "PROJECT & HEAVY HAUL",
      description: "Specialized in large and complex cargo movement with expert route planning and permits."
    },
    {
      title: "CROSS-BORDER LOGISTICS",
      description: "Hassle-free logistics across Nepal, Bhutan, and Bangladesh with customs clearance support."
    },
    {
      title: "CONTAINERIZED SERVICES",
      description: "Safe and organized movement of goods using containerized transport solutions."
    },
    {
      title: "VALUE-ADDED SERVICES",
      description: "Real-time tracking, analytics, and reporting tools that enhance your logistics efficiency."
    }
  ];

  const industries = [
    {
      name: "E-commerce",
      image: ecommerceImage,
      hoverDescription: "Reliable logistics for online sellers — faster deliveries, real-time tracking, and zero missed deadlines."
    },
    {
      name: "Manufacturing",
      image: manufacturingImage,
      hoverDescription: "On-time movement of materials and finished goods — keeping your production lines running 24/7."
    },
    {
      name: "Retail",
      image: retailImage,
      hoverDescription: "We handle nationwide store deliveries with precision, ensuring shelves stay stocked and sales never stop."
    },
    {
      name: "Healthcare",
      image: healthcareImage,
      hoverDescription: "Safe, temperature-controlled transport for critical medical supplies, pharma, and emergency shipments."
    },
    {
      name: "Construction",
      image: constructionImage,
      hoverDescription: "Heavy-duty logistics for materials, machinery, and tools — delivered exactly when your project needs them."
    },
    {
      name: "Day to Day Life Request",
      image: dayToDayLifeImage,
      hoverDescription: "Simplifying everyday logistics — from groceries to essentials, we keep life moving on schedule."
    }
  ];

  const [isHovered, setIsHovered] = useState(false);

  const process = [
    {
      step: "01",
      title: "Consultation",
      description: "Analyze your logistics requirements and design custom solutions",
      icon: Lightbulb,
      color: "#FDBA2D"
    },
    {
      step: "02",
      title: "Integration",
      description: "Seamlessly integrate with your existing systems and processes",
      icon: BarChart3,
      color: "#A45EE5"
    },
    {
      step: "03",
      title: "Execution",
      description: "Implement logistics operations with real-time monitoring",
      icon: Rocket,
      color: "#3AA1FF"
    },
    {
      step: "04",
      title: "Optimization",
      description: "Continuous improvement through data analysis and feedback",
      icon: Settings,
      color: "#1BC9A8"
    }
  ];

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundImage: `url(${truckImage})`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />
      
      <main className="flex-1 pt-16 relative z-10">
        {/* Hero Section */}
        <section className="relative py-0 overflow-x-hidden min-h-[50vh] w-full">
          {/* Dark Overlay for Hero Section Only */}
          <div 
            className="absolute inset-0"
                style={{
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              zIndex: 0,
            }}
          />
          
          <div className="container mx-auto px-4 relative z-10 flex items-center justify-center min-h-[80vh]">
            <div ref={titleAnimation.ref} className={`text-center transition-all duration-700 ${titleAnimation.className}`}>
              <motion.h1 
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Logistics Solutions
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Comprehensive logistics and supply chain management solutions to streamline your operations. 
                From warehousing to last-mile delivery, we've got your business covered.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div 
                  whileHover={{ scale: 1.05, y: -2 }} 
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Link to="/enquiry">
                    <Button 
                      size="lg" 
                      className="px-8 py-6 text-base font-semibold bg-[#FDA11E] text-white hover:bg-white hover:text-black rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#FDA11E] hover:border-white"
                    >
                      Get Custom Quote
                    </Button>
                  </Link>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05, y: -2 }} 
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  <Link to="/support/contact">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="px-8 py-6 text-base font-semibold bg-white text-black hover:bg-[#FA9D17] hover:text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-white hover:border-[#FA9D17]"
                    >
                      Contact Expert
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Logistics Services Section */}
        <section 
          className="py-20 relative z-10"
                      style={{
            background: "#ffffff",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontWeight: 600, color: "#1a1a1a" }}>
                Our Logistics Services
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                End-to-end transportation and logistics solutions for all business needs.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: "24px" }}>
              {logisticsServices.map((service, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1, 
                    ease: "easeOut" 
                  }}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-xl overflow-hidden transition-all duration-300"
                    style={{
                      boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
                      border: "1px solid rgba(148, 163, 184, 0.15)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px";
                      e.currentTarget.style.border = "1px solid rgba(148, 163, 184, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 6px 18px rgba(15, 23, 42, 0.06)";
                      e.currentTarget.style.border = "1px solid rgba(148, 163, 184, 0.15)";
                    }}
                  >
                    {/* Image Container - Placeholder */}
                    <div 
                      className="relative overflow-hidden bg-gray-200 flex items-center justify-center"
                      style={{
                        aspectRatio: "16/9",
                        borderRadius: "12px 12px 0 0",
                      }}
                    >
                      <motion.div
                        className="w-full h-full flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="text-gray-400 text-sm font-medium">Image Placeholder</div>
                      </motion.div>
                          </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-3 uppercase" style={{ color: "#1a1a1a" }}>
                          {service.title}
                        </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                          {service.description}
                        </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section 
          className="py-10 relative z-10"
          style={{
            background: "#F0F0F0",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            paddingTop: "40px",
            paddingBottom: "40px",
          }}
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontWeight: 600, color: "#1a1a1a" }}>
                Industries We Serve
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Specialized logistics solutions for various industry verticals
              </p>
            </motion.div>

            <div className="relative overflow-x-hidden py-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              <div className="flex justify-center items-center w-full min-h-[330px] sm:min-h-[370px] md:min-h-[410px]">
                <div 
                  className="flex gap-5"
                  style={{
                    animation: isHovered ? "none" : "scroll 35s linear infinite",
                    width: "fit-content",
                    gap: "20px",
                  }}
                >
                {/* Duplicate items for seamless infinite loop */}
                {[...industries, ...industries, ...industries].map((industry, index) => {
                    return (
                    <motion.div
                      key={`${industry.name}-${index}`}
                      className="flex-shrink-0 w-[250px] sm:w-[280px] md:w-[320px]"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.6, delay: (index % industries.length) * 0.1, ease: "easeOut" }}
                      onHoverStart={() => setIsHovered(true)}
                      onHoverEnd={() => setIsHovered(false)}
                    >
                      <motion.div
                        className="relative"
                        style={{
                          transformOrigin: "center center",
                        }}
                        initial="rest"
                        whileHover="hover"
                        variants={{
                          rest: { 
                            scale: 1,
                            boxShadow: "none",
                          },
                          hover: { 
                            scale: 1.08,
                            zIndex: 5,
                            boxShadow: "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
                            transition: { duration: 0.4, ease: "easeInOut" }
                          }
                        }}
                      >
                        <motion.div
                          className="industry-card h-[330px] sm:h-[370px] md:h-[410px] rounded-2xl relative overflow-hidden cursor-pointer"
                          style={{
                            backgroundImage: `url(${industry.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            transformOrigin: "center center",
                            borderRadius: "16px",
                          }}
                          variants={{
                            rest: { 
                              filter: "brightness(100%)",
                              transition: { duration: 0.4, ease: "easeInOut" }
                            },
                            hover: { 
                              filter: "brightness(60%)",
                              transition: { duration: 0.4, ease: "easeInOut" }
                            }
                          }}
                        >
                          {/* Dark gradient overlay for text visibility */}
                          <div 
                            className="absolute inset-0 z-0"
                            style={{
                              background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6))",
                            }}
                          />
                          
                          {/* Default title - centered */}
                          <motion.div 
                            className="absolute inset-0 flex items-center justify-center z-10"
                            variants={{
                              rest: { opacity: 1 },
                              hover: { opacity: 0, transition: { duration: 0.3 } }
                            }}
                          >
                            <h3 
                              className="font-bold text-xs md:text-sm text-white px-2"
                              style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)" }}
                            >
                              {industry.name}
                            </h3>
                          </motion.div>

                          {/* Frosted glass overlay - covers entire card on hover */}
                          <motion.div
                            className="absolute inset-0 z-20"
                            variants={{
                              rest: { 
                                opacity: 0,
                              },
                              hover: { 
                                opacity: 1,
                                transition: { duration: 0.4, ease: "easeInOut" }
                              }
                            }}
                            style={{
                              width: "100%",
                              height: "100%",
                              background: "rgba(0, 0, 0, 0.65)",
                              backdropFilter: "blur(10px)",
                              WebkitBackdropFilter: "blur(10px)",
                            }}
                          >
                            <div className="h-full w-full flex items-center justify-center p-6 text-center">
                              <p 
                                className="leading-relaxed"
                                style={{
                                  fontSize: "18px",
                                  fontWeight: 500,
                                  textAlign: "center",
                                  maxWidth: "90%",
                                  color: "#FFFFFF",
                                  lineHeight: 1.6,
                                  textShadow: "0 2px 12px rgba(0, 0, 0, 0.9)",
                                  zIndex: 30,
                                  position: "relative",
                                  opacity: 1,
                                }}
                              >
                                {industry.hoverDescription}
                            </p>
                          </div>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
            <style>{`
              @keyframes scroll {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-33.333%);
                }
              }
              @media (max-width: 640px) {
                .industry-card {
                  height: 250px !important;
                }
              }
              /* Hide scrollbars */
              .relative.overflow-x-hidden::-webkit-scrollbar {
                display: none;
              }
              .relative.overflow-x-hidden {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
          </div>
        </section>

        {/* Process Section */}
        <section 
          className="py-12 relative z-10"
          style={{
            background: "#ffffff",
          }}
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontWeight: 600, color: "#111111" }}>
                Our Process
              </h2>
              <p className="text-lg max-w-2xl mx-auto mb-6" style={{ color: "#555555" }}>
                Streamlined approach to logistics implementation
              </p>
              {/* Animated underline */}
              <motion.div
                className="h-0.5 bg-[#FDA11E] mx-auto"
                initial={{ width: 0 }}
                whileInView={{ width: "120px" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                style={{ maxWidth: "120px" }}
              />
            </motion.div>

            <div className="max-w-7xl mx-auto">
              <div className="relative flex justify-center">
                <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
                  {process.map((step, index) => {
                    const IconComponent = step.icon;
                    return (
                    <motion.div 
                      key={index}
                        initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                        className="relative flex-shrink-0"
                        style={{ width: "230px" }}
                      >
                        {/* Colored background layer - offset diagonally */}
                        <div
                          className="absolute rounded-2xl z-0"
                          style={{
                            width: "230px",
                            height: "210px",
                            background: step.color,
                            borderRadius: "16px",
                            top: "8px",
                            left: "8px",
                          }}
                        />
                        
                        {/* White card */}
                        <div 
                          className="relative bg-white rounded-2xl cursor-pointer transition-all duration-300"
                          style={{
                            width: "230px",
                            height: "210px",
                            borderRadius: "16px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                            padding: "20px 18px 60px 18px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            position: "relative",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-6px)";
                            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.12)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
                          }}
                        >
                          {/* Icon at top center */}
                          <div className="flex justify-center mb-3">
                            <IconComponent 
                              className="w-10 h-10"
                              style={{ 
                                color: step.color,
                                strokeWidth: 1.5,
                              }}
                            />
                      </div>
                          
                          {/* Title */}
                          <h3 
                            className="font-bold text-center mb-2"
                            style={{ 
                              color: "#111111",
                              fontSize: "1.2rem",
                            }}
                      >
                        {step.title}
                      </h3>
                          
                          {/* Description */}
                          <p 
                            className="text-center leading-relaxed"
                            style={{ 
                              color: "#555555",
                              fontSize: "0.9rem",
                              marginBottom: "16px",
                              flex: 1,
                            }}
                          >
                            {step.description}
                          </p>
                          
                          {/* Step tag in top-right corner - diagonal overlay */}
                          <div 
                            className="absolute top-0 right-0 z-10"
                            style={{
                              width: "65px",
                              height: "65px",
                              background: step.color,
                              clipPath: "polygon(100% 0, 100% 100%, 0 0)",
                              borderTopRightRadius: "16px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "flex-start",
                              alignItems: "flex-end",
                              paddingTop: "4px",
                              paddingRight: "6px",
                            }}
                          >
                            <span 
                              className="text-white"
                              style={{
                                fontSize: "10px",
                                fontWeight: 600,
                                lineHeight: "1.1",
                                marginBottom: "1px",
                                textAlign: "right",
                              }}
                            >
                              STEP
                            </span>
                            <span 
                              className="text-white"
                              style={{
                                fontSize: "12px",
                                fontWeight: 600,
                                lineHeight: "1.1",
                                textAlign: "right",
                              }}
                            >
                              {step.step}
                            </span>
                          </div>
                        </div>
                        
                        {/* Connector line between cards - desktop */}
                        {index < process.length - 1 && (
                          <motion.div
                            className="hidden md:block absolute top-1/2 left-full z-10"
                            style={{
                              background: "#E5E5E5",
                              transform: "translateY(-50%)",
                              width: "40px",
                              height: "2px",
                              left: "100%",
                            }}
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 + index * 0.1, ease: "easeOut" }}
                          />
                        )}
                        
                        {/* Connector line for mobile - vertical */}
                        {index < process.length - 1 && (
                          <div 
                            className="md:hidden absolute top-full left-1/2 z-10"
                            style={{
                              background: "#E5E5E5",
                              transform: "translateX(-50%)",
                              width: "2px",
                              height: "40px",
                            }}
                          />
                        )}
                    </motion.div>
                    );
                  })}
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

export default Logistics;