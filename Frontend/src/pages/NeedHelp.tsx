import { motion } from "framer-motion";
import { Mail, Phone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import needImage from "@/assets/need.png";
import confuseIcon from "@/assets/confuse.png";
import callIcon from "@/Icon-images/call.png";
import emailIcon from "@/Icon-images/communication.png";

const NeedHelp = () => {
  return (
    <div className="min-h-screen bg-white relative">
      <Navbar />
      
      <div className="relative z-[100]">
        {/* Header Section with Background - Full Width */}
        <motion.div 
          className="mb-16 relative w-full min-h-[700px] flex flex-col items-start justify-center py-32 pl-40 md:pl-56 lg:pl-64"
          style={{
            backgroundImage: `url(${needImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100%'
          }}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-black text-left"
            style={{ fontFamily: "'Playfair Display', serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Need Help ?
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 max-w-xl text-left font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Get assistance for Booking Shipments - Speacial Rates - Complaints.
          </motion.p>
          
          {/* Soft Divider Line */}
          <motion.div 
            className="mt-8 w-64 md:w-80 lg:w-96 h-0.5 bg-gradient-to-r from-transparent via-[#E5E8EC] to-transparent"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </motion.div>
      </div>

      <div className="relative z-[100] container mx-auto px-4 pb-20">
        {/* Help Cards Section */}
        <motion.div
          className="max-w-6xl mx-auto mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto">
            {[
              {
                icon: Phone,
                title: "For Customer Support",
                description: "Contact our team for clarification before shipping",
                contact: "+91 8453994809",
                contactIcon: callIcon,
                color: "from-blue-50 to-blue-100/50",
                iconColor: "text-blue-600"
              },
              {
                icon: Mail,
                title: "Special Permissions",
                description: "Certain items may be shipped with the required documentation.",
                contact: "info@oclservices.com",
                contactIcon: emailIcon,
                color: "from-amber-50 to-amber-100/50",
                iconColor: "text-[#F5A623]"
              },
              {
                icon: Shield,
                title: "For Sales Enquiry",
                description: "Report any attempts to ship restricted items",
                contact: "+91 8453994809",
                contactIcon: callIcon,
                color: "from-red-50 to-red-100/50",
                iconColor: "text-red-600"
              }
            ].map((helpItem, index) => (
              <div
                key={index}
                className={`relative border border-[#E5E8EC] rounded-2xl transition-all duration-300 overflow-hidden group ${
                  index === 1 ? 'px-6 py-2' : 'px-6 py-1'
                } ${
                  index === 0 
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100/30' 
                    : index === 1
                    ? 'bg-gradient-to-br from-amber-50 to-amber-100/30'
                    : 'bg-gradient-to-br from-red-50 to-red-100/30'
                }`}
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px"
                }}
              >
                {/* Inner shadow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
                
                <div className="relative z-10 text-center flex flex-col items-center justify-center gap-0 h-full">
                  {index === 1 ? (
                    <>
                      <img
                        src={confuseIcon}
                        alt="Confused icon"
                        className="w-24 h-24 mx-auto mb-0"
                      />
                      <div className="flex justify-center mt-0">
                        <Button
                          className="text-sm font-medium px-4 py-1.5 rounded-lg transition-colors bg-white hover:bg-[#F5A623] hover:text-white text-[#0C1B33] border border-[#E5E8EC]"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('openEnquiry'));
                          }}
                          style={{ 
                            fontFamily: "'Inter', sans-serif",
                            boxShadow: "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px"
                          }}
                        >
                          <span>Write to us</span>
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-full">
                        <h4 
                          className={`text-sm font-semibold mb-0 text-[#0C1B33] leading-none ${index === 0 || index === 2 ? 'underline' : ''}`}
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {helpItem.title}
                        </h4>
                        <p 
                          className="text-sm text-gray-500 mb-0 font-inter leading-none font-normal"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {helpItem.description}
                        </p>
                      </div>
                      <div className="flex justify-center mt-0">
                        <Button
                          className="text-sm font-medium px-4 py-1.5 rounded-lg transition-colors bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => {
                            window.location.href = `tel:+918453994809`;
                          }}
                          style={{ 
                            fontFamily: "'Inter', sans-serif",
                            boxShadow: "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px"
                          }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <img
                              src={helpItem.contactIcon}
                              alt="Call"
                              className="w-4 h-4"
                            />
                            <span>{helpItem.contact}</span>
                          </div>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="relative z-[100]">
        <Footer />
      </div>
    </div>
  );
};

export default NeedHelp;

