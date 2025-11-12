import { motion } from "framer-motion";
import { Users, Clock, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import courierTeamImg from "@/assets/courier-team.jpg";
import logisticsBgImg from "@/assets/logistics-bg.jpg";
import shippingNetworkImg from "@/assets/shipping-network.jpg";
import hero1Img from "@/assets/hero-1.jpg";
import hero2Img from "@/assets/hero-2.jpg";
import hero3Img from "@/assets/hero-3.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section with Yellow Background */}
      <motion.section
        className="relative w-full py-16 md:py-24 pb-0 md:pb-0"
        style={{ backgroundColor: "#FFD54F" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              style={{ color: "#0D1B2A" }}
            >
              About OCL Services
            </h1>
            <p
              className="text-xl md:text-2xl font-light max-w-3xl mx-auto"
              style={{ color: "#0D1B2A" }}
            >
              We make sure your shipments reach on time — every time.
            </p>
          </motion.div>
        </div>

        {/* Floating Image Row - Overlaps between yellow and white sections */}
        <div className="relative w-full -mb-16 md:-mb-24 z-10">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {[
                { img: hero1Img, alt: "OCL Services 1" },
                { img: hero2Img, alt: "OCL Services 2" },
                { img: hero3Img, alt: "OCL Services 3" },
                { img: shippingNetworkImg, alt: "OCL Services 4" }
              ].map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + 0.1 * index }}
                  className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white"
                  style={{ 
                    aspectRatio: "4/3",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
                  }}
                >
                  <img
                    src={card.img}
                    alt={card.alt}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 1 */}
      <motion.section
        className="bg-white pt-16 md:pt-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.p
            className="text-lg md:text-xl font-light leading-relaxed text-gray-700 text-justify"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our Courier & Logistics (OCL) is a leading Courier & Logistics service provider, committed to delivering speed and building trust with every shipment. Established with a vision to revolutionize the logistics industry, we offer comprehensive solutions for businesses and individuals across the nation.
            <br /><br />
            With our strong network, advanced tracking systems, and a team dedicated to excellence, we ensure that every shipment — big or small — reaches its destination safely and on time.
          </motion.p>
        </div>
      </motion.section>

      {/* Section 2 */}
      <motion.section
        className="py-16 md:py-24 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-8"
                style={{ color: "#0D1B2A" }}
              >
                We specialize in:
              </h2>
              <ul className="space-y-4">
                {[
                  "Domestic Courier & Logistics Services",
                  "E-Commerce Logistics & Last-Mile Delivery",
                  "Document & Parcel Express Services",
                  "Customized Business Logistics Solutions"
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: "#FFD54F" }}
                    />
                    <span className="text-lg font-light text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              className="relative overflow-hidden rounded-2xl shadow-xl"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={logisticsBgImg}
                alt="Logistics Services"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                style={{ minHeight: "400px" }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 3 */}
      <motion.section
        className="py-16 md:py-24 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              className="relative overflow-hidden rounded-2xl shadow-xl order-2 lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={courierTeamImg}
                alt="OCL Team"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                style={{ minHeight: "400px" }}
              />
            </motion.div>
            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-6"
                style={{ color: "#0D1B2A" }}
              >
                Making Logistics Simple & Stress-Free
              </h2>
              <p className="text-lg font-light leading-relaxed text-gray-700 text-justify">
                At OCL, we believe logistics should be simple, transparent, and stress-free. That's why we focus on customer-centric solutions, real-time updates, and efficient support at every step of the journey.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 4 - Bottom with Icon Cards */}
      <motion.section
        className="py-10 md:py-16 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "#0D1B2A" }}
            >
              We help businesses grow faster and bigger
            </h2>
            <p className="text-xl font-light text-gray-600">
              Simplifying your logistics with smart, scalable solutions.
            </p>
          </motion.div>

          {/* 3 Icon Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: Users,
                title: "Customer-Centric",
                description: "Focused on transparency and trust."
              },
              {
                icon: Clock,
                title: "On-Time Delivery",
                description: "Every shipment delivered as promised."
              },
              {
                icon: Zap,
                title: "Smart Solutions",
                description: "Tailored logistics for every business need."
              }
            ].map((card, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: "#FFD54F" }}
                >
                  <card.icon className="w-8 h-8" style={{ color: "#0D1B2A" }} />
                </div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: "#0D1B2A" }}
                >
                  {card.title}
                </h3>
                <p className="text-gray-600 font-light">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default About;
