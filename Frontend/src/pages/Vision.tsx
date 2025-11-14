import { motion } from "framer-motion";
import { Eye, Target, Heart, Shield, Zap, Globe, Leaf, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Vision = () => {
  const values = [
    {
      icon: Shield,
      title: "Trust & Reliability",
      description: "Building lasting relationships through consistent, dependable service that our customers can count on.",
      gradient: "from-blue-500 via-blue-400 to-blue-600",
      bgColor: "#EFF6FF"
    },
    {
      icon: Zap,
      title: "Innovation & Excellence",
      description: "Continuously evolving our technology and processes to deliver exceptional logistics solutions.",
      gradient: "from-purple-500 via-purple-400 to-purple-600",
      bgColor: "#F5F3FF"
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Putting our customers at the center of everything we do, ensuring their success is our success.",
      gradient: "from-rose-500 via-rose-400 to-rose-600",
      bgColor: "#FFF1F2"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connecting businesses and people across borders with seamless international logistics.",
      gradient: "from-teal-500 via-teal-400 to-teal-600",
      bgColor: "#F0FDFA"
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Committed to environmental responsibility through eco-friendly practices and green technology.",
      gradient: "from-emerald-500 via-emerald-400 to-emerald-600",
      bgColor: "#ECFDF5"
    },
    {
      icon: Users,
      title: "Team Excellence",
      description: "Empowering our people to grow, innovate, and deliver their best in everything they do.",
      gradient: "from-orange-500 via-orange-400 to-orange-600",
      bgColor: "#FFF7ED"
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(to bottom, #F9FAFB, #E8EEF2)" }}>
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-6 pt-24 pb-20 max-w-7xl">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6" style={{ color: "#0D1B2A" }}>
            Vision & Mission
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-light max-w-3xl mx-auto text-gray-600">
            Shaping the future of logistics with purpose, innovation, and unwavering commitment to excellence
          </p>
        </motion.div>

        {/* Vision & Mission Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-24">
          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="group"
          >
            <div className="rounded-3xl p-8 md:p-10 transition-all duration-500 h-full flex flex-col hover:-translate-y-2" style={{ backgroundColor: "#FCF9E6", boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px" }}>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-10 h-10" style={{ color: "#0D1B2A" }} />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6" style={{ color: "#0D1B2A" }}>
                Our Vision
              </h2>
              <div className="text-center space-y-6 flex-grow flex flex-col">
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700 flex-grow">
                  To be the world's most trusted and innovative logistics partner, connecting businesses and 
                  communities through seamless, sustainable, and intelligent delivery solutions.
                </p>
                
                <div className="space-y-4 mt-6">
                  <div className="p-5 rounded-xl bg-blue-50/50 group-hover:bg-blue-50 transition-colors duration-300">
                    <h4 className="text-xs sm:text-sm md:text-base font-semibold mb-2" style={{ color: "#0D1B2A" }}>Global Leadership</h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Becoming the preferred logistics partner across continents
                    </p>
                  </div>
                  
                  <div className="p-5 rounded-xl bg-blue-50/50 group-hover:bg-blue-50 transition-colors duration-300">
                    <h4 className="font-semibold mb-2" style={{ color: "#0D1B2A" }}>Technology Pioneer</h4>
                    <p className="text-sm text-gray-600">
                      Leading innovation in smart logistics and automation
                    </p>
                  </div>
                  
                  <div className="p-5 rounded-xl bg-blue-50/50 group-hover:bg-blue-50 transition-colors duration-300">
                    <h4 className="font-semibold mb-2" style={{ color: "#0D1B2A" }}>Sustainable Future</h4>
                    <p className="text-sm text-gray-600">
                      Building an environmentally responsible logistics ecosystem
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
            className="group"
          >
            <div className="rounded-3xl p-8 md:p-10 transition-all duration-500 h-full flex flex-col hover:-translate-y-2" style={{ backgroundColor: "#FCF9E6", boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px" }}>
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-10 h-10" style={{ color: "#FFB703" }} />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6" style={{ color: "#0D1B2A" }}>
                Our Mission
              </h2>
              <div className="text-center space-y-6 flex-grow flex flex-col">
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700 flex-grow">
                  To deliver excellence in every shipment by providing reliable, efficient, and innovative 
                  logistics solutions that empower businesses to grow and communities to thrive.
                </p>
                
                <div className="space-y-4 mt-6">
                  <div className="p-5 rounded-xl bg-blue-50/50 group-hover:bg-blue-50 transition-colors duration-300">
                    <h4 className="font-semibold mb-2" style={{ color: "#0D1B2A" }}>Customer Success</h4>
                    <p className="text-sm text-gray-600">
                      Ensuring every delivery exceeds customer expectations
                    </p>
                  </div>
                  
                  <div className="p-5 rounded-xl bg-blue-50/50 group-hover:bg-blue-50 transition-colors duration-300">
                    <h4 className="font-semibold mb-2" style={{ color: "#0D1B2A" }}>Operational Excellence</h4>
                    <p className="text-sm text-gray-600">
                      Maintaining the highest standards in safety and reliability
                    </p>
                  </div>
                  
                  <div className="p-5 rounded-xl bg-blue-50/50 group-hover:bg-blue-50 transition-colors duration-300">
                    <h4 className="font-semibold mb-2" style={{ color: "#0D1B2A" }}>Community Impact</h4>
                    <p className="text-sm text-gray-600">
                      Creating positive change in the communities we serve
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Core Values - 3x2 Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: "#0D1B2A" }}>
              Our Core Values
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide our actions and decisions every day
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.19, 1, 0.22, 1] }}
                  className="group"
                >
                  <div className="rounded-2xl p-6 md:p-8 transition-all duration-500 hover:-translate-y-2 h-full" style={{ backgroundColor: value.bgColor, boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px" }}>
                    <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-center mb-3 group-hover:text-blue-600 transition-colors duration-300" style={{ color: "#0D1B2A" }}>
                      {value.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 text-center leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Commitment Statement - Highlighted Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="relative"
        >
          {/* Subtle Divider Line */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-12"></div>
          
          <div className="bg-white rounded-3xl p-10 md:p-16 mt-12" style={{ backgroundColor: "#F5F7FA", boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px" }}>
            <div className="text-center max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8" style={{ color: "#0D1B2A" }}>
                Our Commitment to You
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-12">
                Every package we handle carries more than just goods - it carries trust, dreams, and connections 
                between people. We understand the responsibility that comes with this trust and pledge to honor 
                it with every delivery, every interaction, and every innovation we bring to the world of logistics.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ color: "#0D1B2A" }}>99.8%</div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">On-time Delivery</div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="text-4xl md:text-5xl font-bold mb-3" style={{ color: "#0D1B2A" }}>24/7</div>
                  <div className="text-base text-gray-600 font-medium">Customer Support</div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="text-4xl md:text-5xl font-bold mb-3" style={{ color: "#0D1B2A" }}>100%</div>
                  <div className="text-base text-gray-600 font-medium">Shipment Tracking</div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Vision;