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
          className="mb-8 md:mb-16 relative w-full min-h-[400px] md:min-h-[500px] lg:min-h-[700px] flex flex-col items-start justify-center py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:pl-40 xl:pl-56 2xl:pl-64"
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
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 text-black text-left"
            style={{ fontFamily: "'Playfair Display', serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Need Help ?
          </motion.h1>
          <motion.p 
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-w-xl text-left font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Get assistance for Booking Shipments - Special Rates - Complaints.
          </motion.p>
          
          {/* Soft Divider Line */}
          <motion.div 
            className="mt-4 md:mt-6 lg:mt-8 w-48 sm:w-56 md:w-64 lg:w-80 xl:w-96 h-0.5 bg-gradient-to-r from-transparent via-[#E5E8EC] to-transparent"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </motion.div>
      </div>

      <div className="relative z-[100] container mx-auto px-4 sm:px-6 md:px-8 pb-12 md:pb-20">
        {/* Help Cards Section */}
        <motion.div
          className="max-w-6xl mx-auto mt-4 md:mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
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
                className={`relative border-2 border-[#E5E8EC] rounded-2xl transition-all duration-300 overflow-hidden group hover:shadow-xl ${
                  index === 0 
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100/30 hover:from-blue-100 hover:to-blue-200/40' 
                    : index === 1
                    ? 'bg-gradient-to-br from-amber-50 to-amber-100/30 hover:from-amber-100 hover:to-amber-200/40'
                    : 'bg-gradient-to-br from-red-50 to-red-100/30 hover:from-red-100 hover:to-red-200/40'
                }`}
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px"
                }}
              >
                {/* Inner shadow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                
                <div className="relative z-10 flex flex-col p-5 sm:p-6 md:p-7">
                  {index === 1 ? (
                    <>
                      <div className="flex flex-col items-center justify-center mb-6">
                        <img
                          src={confuseIcon}
                          alt="Confused icon"
                          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto"
                        />
                      </div>
                      <div>
                        <Button
                          className="w-full text-base sm:text-lg font-semibold px-6 py-3 rounded-lg transition-all duration-300 bg-white hover:bg-[#F5A623] hover:text-white text-[#0C1B33] border-2 border-[#E5E8EC] shadow-md hover:shadow-lg hover:scale-105"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('openEnquiry'));
                          }}
                          style={{ 
                            fontFamily: "'Inter', sans-serif"
                          }}
                        >
                          <span>Write to us</span>
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-5">
                        <h4 
                          className={`text-base sm:text-lg md:text-xl font-bold text-[#0C1B33] mb-3 ${index === 0 || index === 2 ? 'underline decoration-2 underline-offset-2' : ''}`}
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {helpItem.title}
                        </h4>
                        <p 
                          className="text-sm sm:text-base md:text-lg text-gray-700 font-inter font-normal leading-relaxed"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {helpItem.description}
                        </p>
                      </div>
                      <div className="mt-auto">
                        <Button
                          className="w-full text-sm sm:text-base md:text-lg font-semibold px-6 py-3 rounded-lg transition-all duration-300 bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg hover:scale-105"
                          onClick={() => {
                            if (index === 0 || index === 2) {
                              window.location.href = `tel:+918453994809`;
                            } else {
                              window.location.href = `mailto:${helpItem.contact}`;
                            }
                          }}
                          style={{ 
                            fontFamily: "'Inter', sans-serif"
                          }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <img
                              src={helpItem.contactIcon}
                              alt="Contact"
                              className="w-4 h-4 sm:w-5 sm:h-5"
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

