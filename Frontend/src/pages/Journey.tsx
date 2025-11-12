import { motion } from "framer-motion";
import { 
  Building2, 
  MapPin, 
  Monitor, 
  Plane, 
  Factory,
  Truck,
  Package,
  Network
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import courierTeamImg from "@/assets/courier-team.jpg";
import logisticsBgImg from "@/assets/logistics-bg.jpg";
import shippingNetworkImg from "@/assets/shipping-network.jpg";
import hero1Img from "@/assets/hero-1.jpg";
import hero2Img from "@/assets/hero-2.jpg";
import hero3Img from "@/assets/hero-3.jpg";

const Journey = () => {
  const milestones = [
    {
      heading: "Foundation Year",
      year: "2001",
      description: "OCL is founded, beginning operations as a dedicated local courier service focused on reliability and customer trust.",
      icon: Building2,
      bgColor: "bg-blue-50"
    },
    {
      heading: "Regional Growth",
      year: "2008",
      description: "Expanded our fleet and services to manage regional B2B logistics, strengthening delivery capabilities.",
      icon: MapPin,
      bgColor: "bg-yellow-50"
    },
    {
      heading: "Digital Transformation",
      year: "2017",
      description: "Launched our official website, introducing online booking, live tracking, and digital communication with customers.",
      icon: Monitor,
      bgColor: "bg-green-50"
    },
    {
      heading: "Diversified Operations",
      year: "2021",
      description: "Introduced Rail and Air Logistics divisions to deliver complete multi-modal transport solutions across India.",
      icon: Plane,
      bgColor: "bg-purple-50"
    },
    {
      heading: "Specialized Logistics",
      year: "2023",
      description: "Established the Industrial & Infrastructure Logistics division to serve complex, large-scale shipments across the Northeast.",
      icon: Factory,
      bgColor: "bg-pink-50"
    }
  ];

  const founders = [
    {
      name: "Founder Name",
      designation: "Founder & CEO",
      tagline: "Visionary leader driving innovation",
      image: "👤"
    },
    {
      name: "Co-Founder Name",
      designation: "Co-Founder & COO",
      tagline: "Operations excellence specialist",
      image: "👤"
    },
    {
      name: "Co-Founder Name",
      designation: "Co-Founder & CTO",
      tagline: "Technology transformation expert",
      image: "👤"
    }
  ];

  const teamImages = [
    { img: courierTeamImg, alt: "OCL Team" },
    { img: logisticsBgImg, alt: "Logistics Operations" },
    { img: shippingNetworkImg, alt: "Shipping Network" },
    { img: hero1Img, alt: "OCL Services" },
    { img: hero2Img, alt: "OCL Services" },
    { img: hero3Img, alt: "OCL Services" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* SECTION 1 – Hero / Intro Section */}
      <motion.section
        className="relative w-full py-20 md:py-32 bg-gradient-to-b from-white to-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Rounded bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white rounded-t-[3rem] md:rounded-t-[5rem]"></div>
        
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
              style={{ color: "#0D1B2A" }}
            >
              Our Journey
            </h1>
            <p
              className="text-xl md:text-2xl font-light max-w-4xl mx-auto text-gray-600"
            >
              From a small courier service to a leading logistics company<br />
              discover our story of growth and innovation.
            </p>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-lg md:text-xl font-light leading-relaxed text-gray-700 text-justify">
                Founded in 2001, OCL Services began with a vision to deliver reliability and speed in every shipment. Over the decades, we've evolved from a local courier into a national logistics network built on innovation, trust, and customer-first service.
              </p>
            </motion.div>

            {/* Right: Illustration Placeholder */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="relative bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-12 shadow-xl">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <Truck className="w-32 h-32 md:w-40 md:h-40" style={{ color: "#FFB703" }} />
                    <Network className="w-24 h-24 md:w-32 md:h-32 absolute -top-4 -right-4" style={{ color: "#0D1B2A", opacity: 0.3 }} />
                    <Package className="w-20 h-20 md:w-28 md:h-28 absolute -bottom-4 -left-4" style={{ color: "#0D1B2A", opacity: 0.3 }} />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-transparent rounded-3xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 2 – Milestone Section */}
      <motion.section
        className="py-20 md:py-32 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-16 text-center"
            style={{ color: "#0D1B2A" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Milestones
          </motion.h2>

          <div className="space-y-6 md:space-y-8">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <motion.div
                  key={milestone.year}
                  className={`${milestone.bgColor} rounded-2xl md:rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.01 }}
                >
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div 
                        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: "#FFB703" }}
                      >
                        <Icon className="w-8 h-8 md:w-10 md:h-10" style={{ color: "#0D1B2A" }} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {/* Heading with Icon */}
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl md:text-2xl font-bold" style={{ color: "#0D1B2A" }}>
                          {milestone.heading}
                        </h3>
                      </div>
                      
                      {/* Year */}
                      <div className="text-lg md:text-xl font-semibold mb-3" style={{ color: "#FFB703" }}>
                        {milestone.year}
                      </div>
                      
                      {/* Description */}
                      <p className="text-base md:text-lg font-light text-gray-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* SECTION 3 – Founders Section */}
      <motion.section
        className="py-20 md:py-32"
        style={{ backgroundColor: "#F4F4F4" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-16 text-center"
            style={{ color: "#0D1B2A" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Founders
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {founders.map((founder, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                {/* Profile Image Placeholder */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto mb-6 flex items-center justify-center text-6xl md:text-7xl bg-gradient-to-br from-yellow-100 to-orange-100 border-4" style={{ borderColor: "#FFB703" }}>
                  {founder.image}
                </div>
                
                <h3 className="text-2xl font-bold mb-2" style={{ color: "#0D1B2A" }}>
                  {founder.name}
                </h3>
                <p className="text-lg font-semibold mb-3" style={{ color: "#FFB703" }}>
                  {founder.designation}
                </p>
                <p className="text-gray-600 font-light">
                  {founder.tagline}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION 4 – Team / Culture Section */}
      <motion.section
        className="py-20 md:py-32 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-16 text-center"
            style={{ color: "#0D1B2A" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            The Team
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {teamImages.map((item, index) => (
              <motion.div
                key={index}
                className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                style={{ aspectRatio: "4/3" }}
              >
                <img
                  src={item.img}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default Journey;
