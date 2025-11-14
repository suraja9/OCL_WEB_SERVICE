import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import companyData from "@/data/company.json";
import conconImg from "@/assets/concon.jpg";

const ContactOCL = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our customer service team",
      contact: companyData.contact.phone,
      action: `tel:${companyData.contact.phone}`,
      actionText: "Call Now",
      emoji: "📞"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Support",
      description: "Get instant help via WhatsApp",
      contact: "+91-98765-43210",
      action: "https://wa.me/919876543210",
      actionText: "Chat on WhatsApp",
      emoji: "💬"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us your queries and we'll respond within 24 hours",
      contact: companyData.contact.email,
      action: `mailto:${companyData.contact.email}`,
      actionText: "Send Email",
      emoji: "📧"
    }
  ];

  const officeHours = [
    { day: "Mon - Sat", hours: "10:00 AM - 7:00 PM" },
    { day: "Sunday", hours: "HOLIDAY" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.42, 0, 0.58, 1] as const
      }
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Navbar />
      
      {/* Full-Width Hero Section */}
      <motion.div
        className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          backgroundImage: `url(${conconImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed"
        }}
      >
        {/* Centered Title */}
        <motion.h1
          className="relative z-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            textShadow: "0px 4px 20px rgba(0, 0, 0, 0.8)"
          }}
        >
          Contact
        </motion.h1>
      </motion.div>

      {/* Three Contact Cards Section */}
      <div className="relative z-10 container mx-auto px-4 py-16 max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  y: -8, 
                  scale: 1.03,
                  transition: { duration: 0.1, ease: "easeOut" }
                }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                className="relative group"
              >
                <div
                  className="rounded-2xl p-8 h-full transition-all duration-100"
                  style={{
                    background: "#EFF3F4",
                    boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px";
                  }}
                >
                  <motion.div
                    className="flex justify-center mb-5"
                    whileHover={{ 
                      scale: [1, 1.15, 1],
                      rotate: [0, -10, 10, -10, 0]
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                      style={{
                        background: "linear-gradient(135deg, #F5A623 0%, #F5A623dd 100%)",
                      }}
                    >
                      {method.emoji}
                    </div>
                  </motion.div>
                  
                  <h3
                    className="text-xl font-bold text-center mb-3"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      color: "#0C1B33"
                    }}
                  >
                    {method.title}
                  </h3>
                  
                  <p
                    className="text-sm text-center mb-6 min-h-[40px]"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      color: "#5A5A5A",
                      lineHeight: "1.5"
                    }}
                  >
                    {method.description}
                  </p>
                  
                  <motion.button
                    onClick={() => window.open(method.action, '_blank')}
                    className="w-auto px-8 py-2.5 rounded-xl font-semibold transition-all duration-100 mx-auto block"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      background: method.actionText === "Chat on WhatsApp" ? "#F5A623" : "#FFFFFF",
                      color: method.actionText === "Chat on WhatsApp" ? "#FFFFFF" : "#0C1B33",
                      border: "none",
                      boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px"
                    }}
                    whileHover={{ 
                      background: method.actionText === "Chat on WhatsApp" ? "#FFFFFF" : "#F5A623",
                      color: method.actionText === "Chat on WhatsApp" ? "#0C1B33" : "#FFFFFF",
                      scale: 1.02,
                      boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
                      transition: { duration: 0.1 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.1 }}
                  >
                    {method.actionText}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Lower Section: Two-Column Grid - Full Width */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full py-12 px-4 md:px-8 mb-16"
        style={{
          background: "#0C1B33"
        }}
      >
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto items-stretch">
          {/* Left: Office Hours + Emergency Support */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <div
              className="rounded-2xl p-6 backdrop-blur-md h-full flex flex-col"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.1)"
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #F5A623 0%, #F5A623dd 100%)",
                  }}
                >
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h2
                  className="text-xl font-bold"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    textShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)"
                  }}
                >
                  Office Hours
                </h2>
              </div>
              
              <div className="space-y-3 mb-5">
                {officeHours.map((schedule, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center py-2 border-b border-white/20 last:border-b-0"
                  >
                    <span
                      className="font-medium text-sm"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                        color: "#FFFFFF",
                        textShadow: "0px 1px 2px rgba(0, 0, 0, 0.3)"
                      }}
                    >
                      {schedule.day}
                    </span>
                    <span
                      className="text-sm"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        color: "#FFFFFF",
                        textShadow: "0px 1px 2px rgba(0, 0, 0, 0.3)"
                      }}
                    >
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
              
              <div
                className="p-3 rounded-xl mt-auto"
                style={{
                  background: "rgba(37, 211, 102, 0.25)",
                  border: "1px solid rgba(37, 211, 102, 0.4)",
                  backdropFilter: "blur(10px)"
                }}
              >
                <p
                  className="text-xs"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    color: "#FFFFFF",
                    lineHeight: "1.5",
                    textShadow: "0px 1px 2px rgba(0, 0, 0, 0.3)"
                  }}
                >
                  <strong style={{ color: "#FFFFFF", fontWeight: 600 }}>24/7 Emergency Support:</strong> For urgent shipment issues, call us @ <span style={{ color: "#FFFFFF", fontWeight: 600 }}>+91 98765 43211</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Head Office Details + Map Button */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <div
              className="rounded-2xl p-6 backdrop-blur-md h-full flex flex-col"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.1)"
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #F5A623 0%, #F5A623dd 100%)",
                  }}
                >
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h2
                  className="text-xl font-bold"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    textShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)"
                  }}
                >
                  Head Office
                </h2>
              </div>
              
              <div className="space-y-3 mb-5">
                <div>
                  <h3
                    className="font-semibold mb-2 text-sm"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      color: "#FFFFFF",
                      textShadow: "0px 1px 2px rgba(0, 0, 0, 0.3)"
                    }}
                  >
                    Address
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      color: "#FFFFFF",
                      lineHeight: "1.5",
                      textShadow: "0px 1px 2px rgba(0, 0, 0, 0.3)"
                    }}
                  >
                    {companyData.contact.address}
                  </p>
                </div>
                
                <motion.button
                  onClick={() => window.open('https://maps.google.com/?q=OCL+SERVICES+House+Mumbai', '_blank')}
                  className="w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 border-2 transition-all duration-300 text-sm"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    background: "rgba(255, 255, 255, 0.2)",
                    borderColor: "rgba(255, 255, 255, 0.4)",
                    color: "#FFFFFF",
                    textShadow: "0px 1px 2px rgba(0, 0, 0, 0.3)"
                  }}
                  whileHover={{ 
                    background: "rgba(255, 255, 255, 0.3)",
                    borderColor: "rgba(255, 255, 255, 0.6)",
                    scale: 1.02,
                    y: -2
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MapPin className="w-4 h-4" />
                  Open in Google Maps
                </motion.button>
              </div>

              <div
                className="p-3 rounded-xl mt-auto"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)"
                }}
              >
                <p
                  className="text-xs"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    color: "#FFFFFF",
                    lineHeight: "1.5",
                    textShadow: "0px 1px 2px rgba(0, 0, 0, 0.3)"
                  }}
                >
                  <strong style={{ color: "#FFFFFF", fontWeight: 600 }}>Visiting Hours:</strong> Monday to Friday, 10:00 AM - 6:00 PM. 
                  Please call ahead to schedule an appointment.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-7xl">
        {/* Need Immediate Assistance Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div
            className="rounded-2xl p-10 bg-white"
            style={{
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.06)"
            }}
          >
            <h3
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                color: "#0C1B33"
              }}
            >
              Need Immediate Assistance?
            </h3>
            <p
              className="text-base mb-8 max-w-2xl mx-auto"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                color: "#5A5A5A",
                lineHeight: "1.6"
              }}
            >
              For immediate support, you can also track your shipments, schedule pickups, or access our help center
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => window.location.href = '/track'}
                className="px-8 py-3 rounded-xl font-semibold transition-all duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  background: "#0C1B33",
                  color: "#FFFFFF",
                  boxShadow: "0px 4px 12px rgba(12, 27, 51, 0.2)"
                }}
                whileHover={{ 
                  background: "#F5A623",
                  scale: 1.05,
                  y: -3,
                  boxShadow: "0px 6px 20px rgba(245, 166, 35, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                Track Shipment
              </motion.button>
              <motion.button
                onClick={() => window.location.href = '/schedule-pickup'}
                className="px-8 py-3 rounded-xl font-semibold border-2 transition-all duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  background: "transparent",
                  borderColor: "#0C1B33",
                  color: "#0C1B33"
                }}
                whileHover={{ 
                  background: "#0C1B33",
                  color: "#FFFFFF",
                  scale: 1.05,
                  y: -3
                }}
                whileTap={{ scale: 0.98 }}
              >
                Schedule Pickup
              </motion.button>
              <motion.button
                onClick={() => window.location.href = '/support/write'}
                className="px-8 py-3 rounded-xl font-semibold border-2 transition-all duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  background: "transparent",
                  borderColor: "#0C1B33",
                  color: "#0C1B33"
                }}
                whileHover={{ 
                  background: "#0C1B33",
                  color: "#FFFFFF",
                  scale: 1.05,
                  y: -3
                }}
                whileTap={{ scale: 0.98 }}
              >
                Write to Us
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactOCL;
