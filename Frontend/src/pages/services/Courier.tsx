import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Clock, Shield, MapPin, CheckCircle, Package, Zap, Users, ChevronLeft, ChevronRight, Calendar, Star, Radio, HeadphonesIcon, DollarSign, TrendingDown, Globe, FileCheck, Lock, Link2, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import courierTeamImg from "@/assets/courier-team.jpg";
import shippingNetworkImg from "@/assets/shipping-network.jpg";
import pickupTruckImg from "@/assets/pickup-truck-icon.jpg";
import tataImg from "@/assets/tata.jpg";
import fastReliableImg from "@/assets/Fast-reliable.png";
import wideCoverageImg from "@/assets/wide-coverage.png";
import dedicatedSupportImg from "@/assets/dedicated-support.png";
import transparencyImg from "@/assets/transparency.png";

const Courier = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);


  const benefits = [
    {
      icon: <img src={fastReliableImg} alt="Fast & Reliable" className="w-full h-full object-contain p-2" />,
      title: "Fast & Reliable",
      description: "On-time delivery with 99% success rate"
    },
    {
      icon: <img src={wideCoverageImg} alt="Wide Coverage" className="w-full h-full object-contain p-2" />,
      title: "Wide Coverage",
      description: "Delivering to 25,000+ pin codes across India"
    },
    {
      icon: <img src={dedicatedSupportImg} alt="Dedicated Support" className="w-full h-full object-contain p-2" />,
      title: "Dedicated Support",
      description: "24/7 customer support for all your queries"
    },
    {
      icon: <img src={transparencyImg} alt="100% Transparency" className="w-full h-full object-contain p-2" />,
      title: "100% Transparency",
      description: "Real-time tracking and instant notifications"
    }
  ];

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused) {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
      return;
    }

    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % benefits.length);
    }, 2000);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isPaused, benefits.length]);

  // Icon mapping function for features
  const getFeatureIcon = (feature: string) => {
    const iconProps = { className: "w-5 h-5 text-[#424530] flex-shrink-0" };
    
    // EXPRESS DELIVERY icons
    if (feature === "Same-day pickup") return <Calendar {...iconProps} />;
    if (feature === "Priority Services") return <Star {...iconProps} />;
    if (feature === "Real-time tracking") return <Radio {...iconProps} />;
    if (feature === "Dedicated support") return <Users {...iconProps} />;
    
    // STANDARD DELIVERY icons
    if (feature === "Cost-effective") return <TrendingDown {...iconProps} />;
    if (feature === "Nationwide coverage") return <Globe {...iconProps} />;
    if (feature === "Insurance provided upon request") return <Shield {...iconProps} />;
    if (feature === "Proof of delivery") return <FileCheck {...iconProps} />;
    
    // SECURE COURIER icons
    if (feature === "Tamper-proof packaging") return <Lock {...iconProps} />;
    if (feature === "Chain of custody") return <Link2 {...iconProps} />;
    if (feature === "Background-verified agents") return <UserCheck {...iconProps} />;
    if (feature === "Insurance up to ₹1 Lakh") return <Shield {...iconProps} />;
    
    // Default fallback
    return <CheckCircle {...iconProps} />;
  };

  const services = [
    {
      title: "EXPRESS DELIVERY",
      description: "Same-day and next-day delivery for urgent shipments",
      features: ["Same-Day Pickup", "Priority Services", "Real-time Tracking", "Dedicated Support"],
      bgImage: courierTeamImg
    },
    {
      title: "STANDARD DELIVERY",
      description: "Reliable delivery within 2-5 business days",
      features: ["Cost-Effective", "Nationwide Coverage", "Insurance provided upon Request", "Proof of Delivery"],
      bgImage: shippingNetworkImg
    },
    {
      title: "SECURE COURIER",
      description: "Enhanced security for valuable and sensitive items",
      features: ["Tamper-proof packaging", "Chain of custody", "Background-verified agents", "Insurance up to ₹1 Lakh"],
      bgImage: pickupTruckImg
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-soft flex flex-col">
      <Navbar />
      
        {/* Hero Section */}
      <section 
        className="relative -mt-20 pt-24 pb-32"
        style={{
          backgroundImage: `url(${tataImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-white/40"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-brand-red/10 rounded-full flex items-center justify-center">
                  <Truck className="w-10 h-10 text-brand-red" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Courier Services
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-14">
                Fast, reliable, and secure courier services for all your delivery needs. 
                From documents to packages, we ensure your items reach their destination safely and on time.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/schedule-pickup">
                  <button
                    role="button"
                    className="button-17"
                    style={{
                      alignItems: 'center',
                      appearance: 'none',
                      backgroundColor: '#FCA324',
                      borderRadius: '24px',
                      borderStyle: 'none',
                      boxShadow: 'rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px',
                      boxSizing: 'border-box',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      fill: 'currentcolor',
                      fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
                      fontSize: '14px',
                      fontWeight: '500',
                      height: '48px',
                      justifyContent: 'center',
                      letterSpacing: '.25px',
                      lineHeight: 'normal',
                      maxWidth: '100%',
                      overflow: 'visible',
                      padding: '2px 24px',
                      position: 'relative',
                      textAlign: 'center',
                      textTransform: 'none',
                      transition: 'box-shadow 280ms cubic-bezier(.4, 0, .2, 1), opacity 15ms linear 30ms, transform 270ms cubic-bezier(0, 0, .2, 1) 0ms',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      touchAction: 'manipulation',
                      width: 'auto',
                      willChange: 'transform, opacity',
                      zIndex: 0,
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 2px 3px 0, rgba(60, 64, 67, .15) 0 6px 10px 4px';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.color = '#1a1a1a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px';
                      e.currentTarget.style.backgroundColor = '#FCA324';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 4px 4px 0, rgba(60, 64, 67, .15) 0 8px 12px 6px';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px';
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border = '2px solid #FCA324';
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = 'none';
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px';
                    }}
                  >
                      Book Pickup Now
                  </button>
                  </Link>
                
                  <Link to="/rates">
                  <button
                    role="button"
                    className="button-17"
                    style={{
                      alignItems: 'center',
                      appearance: 'none',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '24px',
                      borderStyle: 'none',
                      boxShadow: 'rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px',
                      boxSizing: 'border-box',
                      color: '#1a1a1a',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      fill: 'currentcolor',
                      fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
                      fontSize: '14px',
                      fontWeight: '500',
                      height: '48px',
                      justifyContent: 'center',
                      letterSpacing: '.25px',
                      lineHeight: 'normal',
                      maxWidth: '100%',
                      overflow: 'visible',
                      padding: '2px 24px',
                      position: 'relative',
                      textAlign: 'center',
                      textTransform: 'none',
                      transition: 'box-shadow 280ms cubic-bezier(.4, 0, .2, 1), opacity 15ms linear 30ms, transform 270ms cubic-bezier(0, 0, .2, 1) 0ms',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      touchAction: 'manipulation',
                      width: 'auto',
                      willChange: 'transform, opacity',
                      zIndex: 0,
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 2px 3px 0, rgba(60, 64, 67, .15) 0 6px 10px 4px';
                      e.currentTarget.style.backgroundColor = '#FCA324';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.color = '#1a1a1a';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 4px 4px 0, rgba(60, 64, 67, .15) 0 8px 12px 6px';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px';
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border = '2px solid #FCA324';
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = 'none';
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px';
                    }}
                  >
                      View Rates
                  </button>
                  </Link>
              </div>
            </motion.div>
          </div>
        </section>

      <main className="flex-1">
        {/* Services Section */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-9"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#424530' }}>
                Our Services
              </h2>
              <p className="max-w-2xl mx-auto" style={{ color: '#424530' }}>
                Choose from our range of services designed to meet your specific delivery requirements
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    ease: "easeOut",
                    delay: 0.3 + index * 0.15 
                  }}
                  className="relative h-[500px] cursor-pointer"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Card Container */}
                  <motion.div 
                    className="relative w-full h-full rounded-[20px] overflow-hidden"
                    style={{
                      boxShadow: 'rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px'
                    }}
                    whileHover="hover"
                    initial="initial"
                    variants={{
                      initial: {},
                      hover: {}
                    }}
                  >
                    {/* Background Image with Zoom Effect */}
                    <motion.div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${service.bgImage})`,
                      }}
                      variants={{
                        initial: { scale: 1 },
                        hover: { scale: 1.1 }
                      }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      {/* Dark Overlay - increases on hover */}
                      <motion.div 
                        className="absolute inset-0"
                        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                        variants={{
                          initial: { backgroundColor: 'rgba(0,0,0,0.4)' },
                          hover: { backgroundColor: 'rgba(0,0,0,0.6)' }
                        }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      />
                    </motion.div>

                    {/* Centered White Semi-Transparent Card on Hover */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: hoveredCard === index ? 1 : 0,
                        scale: hoveredCard === index ? 1 : 0.8
                      }}
                      transition={{
                        duration: 0.4,
                        ease: "easeOut"
                      }}
                      style={{
                        pointerEvents: 'none'
                      }}
                    >
                      <div
                        className="w-[200px] h-[200px] rounded-[15px] flex flex-col justify-center items-center p-6"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          boxShadow: 'rgba(0, 0, 0, 0.15) 0px 8px 24px, rgba(0, 0, 0, 0.1) 0px 4px 8px'
                        }}
                      >
                        <div className="space-y-3.5">
                          {service.features.map((feature, featureIndex) => (
                            <motion.div
                              key={featureIndex}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{
                                opacity: hoveredCard === index ? 1 : 0,
                                y: hoveredCard === index ? 0 : 10
                              }}
                              transition={{
                                duration: 0.3,
                                delay: hoveredCard === index ? 0.1 + featureIndex * 0.05 : 0
                              }}
                              className="flex items-center gap-3"
                            >
                              {getFeatureIcon(feature)}
                              <span
                                className="text-[#424530] text-sm font-medium"
                              >
                                {feature}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    {/* Bottom Left Text (always visible, fades on hover) */}
                    <div className="absolute bottom-0 left-0 p-6 pointer-events-none z-20">
                      <motion.h3 
                        variants={{
                          initial: { opacity: 1 },
                          hover: { opacity: 0 }
                        }}
                        transition={{ duration: 0.4 }}
                        className="text-white font-bold text-2xl mb-2 uppercase tracking-wide"
                        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}
                      >
                        {service.title}
                      </motion.h3>
                      <motion.p 
                        variants={{
                          initial: { opacity: 0.7 },
                          hover: { opacity: 0 }
                        }}
                        transition={{ duration: 0.4 }}
                        className="text-white text-sm"
                        style={{ 
                          textShadow: '0 2px 8px rgba(0,0,0,0.7)'
                        }}
                      >
                        {service.description}
                      </motion.p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section - Carousel */}
        <section className="py-16" style={{ background: 'linear-gradient(to bottom, #F49A2E 0%, #FFFFFF 100%)' }}>
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Choose OCL?
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto">
                Experience the difference with our professional courier services
              </p>
            </motion.div>

            {/* Carousel Container - 3D Center Focus Style */}
            <div 
              className="relative max-w-7xl mx-auto"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Carousel Track with 3D Perspective */}
              <div 
                className="overflow-visible py-8"
                style={{ perspective: '1200px' }}
                onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
                onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
                onTouchEnd={() => {
                  if (!touchStart || !touchEnd) return;
                  const distance = touchStart - touchEnd;
                  const isLeftSwipe = distance > 50;
                  const isRightSwipe = distance < -50;

                  if (isLeftSwipe) {
                    setCurrentIndex((prev) => (prev + 1) % benefits.length);
                  }
                  if (isRightSwipe) {
                    setCurrentIndex((prev) => (prev === 0 ? benefits.length - 1 : prev - 1));
                  }
                }}
              >
                <div className="flex items-center justify-center gap-6 lg:gap-8">
                  {benefits.map((benefit, index) => {
                    const isCenter = index === currentIndex;
                    const offset = index - currentIndex;
                    const absOffset = Math.abs(offset);
                    const isDesktop = windowWidth >= 1024;
                    
                    // Calculate position and scale - keep all cards visible
                    let translateX = 0;
                    let scale = 0.9;
                    let opacity = 1; // All cards visible
                    let blurValue = 1.5; // Slight blur for non-active cards
                    let zIndex = 1;

                    if (isDesktop) {
                      // Desktop: show all cards, center is larger and clear
                      if (absOffset === 0) {
                        scale = 1.2; // Much larger center card
                        blurValue = 0; // No blur on active card
                        zIndex = 10;
                        translateX = 0;
                      } else {
                        // All other cards get slight blur and are scaled down
                        translateX = 0; // Let flex gap handle spacing
                        scale = 0.85; // Smaller side cards for more contrast
                        blurValue = 1.5; // Slight blur for non-active cards
                      }
                    } else {
                      // Mobile: all cards visible with spacing
                      if (absOffset === 0) {
                        scale = 1.15; // Larger center card on mobile too
                        blurValue = 0;
                        zIndex = 10;
                        translateX = 0;
                      } else {
                        translateX = 0; // Let flex gap handle spacing on mobile too
                        scale = 0.8; // Smaller side cards
                        blurValue = 2; // More blur on mobile for side cards
                      }
                    }

                    return (
                <motion.div
                  key={index}
                        className="flex-shrink-0"
                        style={{
                          width: isDesktop ? '360px' : 'calc(100vw - 64px)',
                          maxWidth: '360px',
                          zIndex,
                        }}
                        initial={false}
                        animate={{
                          x: translateX,
                          scale,
                          opacity,
                          filter: `blur(${blurValue}px)`,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                          duration: 0.6,
                          ease: 'easeInOut',
                        }}
                      >
                        <Card 
                          className={`border h-full text-center
                                   rounded-[30px] shadow-lg transition-all duration-300
                                   ${isCenter ? 'border-gray-300 shadow-2xl' : 'border-gray-200 shadow-md'}`}
                          style={{
                            background: 'linear-gradient(to bottom, white 40%, #485342 40%)'
                          }}
                        >
                          <CardContent className="p-8">
                            <div className={`w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-6
                                         transition-colors duration-300 backdrop-blur-sm ${isCenter ? 'bg-white/40' : ''}`}>
                              <div className="text-gray-800">
                          {benefit.icon}
                        </div>
                      </div>
                            <h3 className={`font-bold text-lg text-white mb-3 ${isCenter ? 'text-xl' : ''}`}>
                              {benefit.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-white">
                              {benefit.description}
                            </p>
                    </CardContent>
                  </Card>
                </motion.div>
                    );
                  })}
            </div>
          </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center mt-8 gap-2">
                {benefits.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentIndex
                        ? 'w-8 h-2 bg-gray-700'
                        : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to card ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pt-10 pb-8 bg-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
            >
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#424530' }}>
                Ready to Ship?
              </h2>
              <p className="mb-8 max-w-2xl mx-auto" style={{ color: '#424530' }}>
                Get started with OCL courier services today. Fast, reliable, and affordable delivery solutions.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/schedule-pickup">
                  <button
                    role="button"
                    className="button-17"
                    style={{
                      alignItems: 'center',
                      appearance: 'none',
                      backgroundColor: '#FCA324',
                      borderRadius: '24px',
                      borderStyle: 'none',
                      boxShadow: 'rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px',
                      boxSizing: 'border-box',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      fill: 'currentcolor',
                      fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
                      fontSize: '14px',
                      fontWeight: '500',
                      height: '48px',
                      justifyContent: 'center',
                      letterSpacing: '.25px',
                      lineHeight: 'normal',
                      maxWidth: '100%',
                      overflow: 'visible',
                      padding: '2px 24px',
                      position: 'relative',
                      textAlign: 'center',
                      textTransform: 'none',
                      transition: 'box-shadow 280ms cubic-bezier(.4, 0, .2, 1), opacity 15ms linear 30ms, transform 270ms cubic-bezier(0, 0, .2, 1) 0ms',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      touchAction: 'manipulation',
                      width: 'auto',
                      willChange: 'transform, opacity',
                      zIndex: 0,
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 2px 3px 0, rgba(60, 64, 67, .15) 0 6px 10px 4px';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.color = '#1a1a1a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px';
                      e.currentTarget.style.backgroundColor = '#FCA324';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 4px 4px 0, rgba(60, 64, 67, .15) 0 8px 12px 6px';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px';
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border = '2px solid #FCA324';
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = 'none';
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px';
                    }}
                  >
                      Schedule Pickup
                  </button>
                  </Link>
                
                  <Link to="/track">
                  <button
                    role="button"
                    className="button-17"
                    style={{
                      alignItems: 'center',
                      appearance: 'none',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '24px',
                      borderStyle: 'none',
                      boxShadow: 'rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px',
                      boxSizing: 'border-box',
                      color: '#1a1a1a',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      fill: 'currentcolor',
                      fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
                      fontSize: '14px',
                      fontWeight: '500',
                      height: '48px',
                      justifyContent: 'center',
                      letterSpacing: '.25px',
                      lineHeight: 'normal',
                      maxWidth: '100%',
                      overflow: 'visible',
                      padding: '2px 24px',
                      position: 'relative',
                      textAlign: 'center',
                      textTransform: 'none',
                      transition: 'box-shadow 280ms cubic-bezier(.4, 0, .2, 1), opacity 15ms linear 30ms, transform 270ms cubic-bezier(0, 0, .2, 1) 0ms',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      touchAction: 'manipulation',
                      width: 'auto',
                      willChange: 'transform, opacity',
                      zIndex: 0,
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 2px 3px 0, rgba(60, 64, 67, .15) 0 6px 10px 4px';
                      e.currentTarget.style.backgroundColor = '#FCA324';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.color = '#1a1a1a';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 4px 4px 0, rgba(60, 64, 67, .15) 0 8px 12px 6px';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px';
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border = '2px solid #FCA324';
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = 'none';
                      e.currentTarget.style.boxShadow = 'rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px';
                    }}
                  >
                      Track Package
                  </button>
                  </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Courier;

