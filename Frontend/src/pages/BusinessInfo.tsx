import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  CreditCard, 
  Hash, 
  CheckCircle2,
  Shield,
  IdCard
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import realManImg from "@/assets/real-man.png";

interface BusinessInfoData {
  gstNumber: string;
  panNumber: string;
  hsnSacNumber: string;
  legalName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  isVerified: boolean;
  lastUpdated: string;
}

const BusinessInfo = () => {
  const [formData] = useState<BusinessInfoData>({
    gstNumber: "18AJRPG5984B1ZV",
    panNumber: "AJRPG5984B",
    hsnSacNumber: "996812",
    legalName: "Our Courier & Logistics",
    bankName: "HDFC Bank",
    accountNumber: "50200070561441",
    ifscCode: "HDFC0004436",
    branch: "ULUBARI BRANCH",
    isVerified: true,
    lastUpdated: "2024-01-15"
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.42, 0, 0.58, 1] as const
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.42, 0, 0.58, 1] as const
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#C5CAC2] via-[#D4E6F2] to-[#C5CAC2]">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.08)] mb-8 overflow-hidden"
        >
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold text-[#0D1B2A] mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Business Information
              </motion.h1>
              <motion.p 
                className="text-lg text-gray-600 font-light max-w-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Manage your company's official details for smooth verification and billing.
              </motion.p>
            </div>
            <motion.div
              className="hidden md:block flex-shrink-0 relative w-48 h-48 overflow-visible"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
              <img 
                src={realManImg} 
                alt="Business illustration" 
                className="w-72 h-72 object-contain absolute -top-12 -right-12"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Information Cards Section - Full Width Background */}
      <div className="w-full py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
          {/* GST Details Card */}
          <motion.div variants={cardVariants}>
            <Card className="bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 border-0">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 bg-[#FFF5E6] rounded-xl mb-4">
                  <FileText className="w-6 h-6 text-[#FDA11E]" />
                </div>
                <h3 className="text-xl font-bold text-[#0D1B2A] mb-1">GST Details</h3>
                <p className="text-sm text-[#6B7280] mb-4">GST Identification Number</p>
                <p className="text-xl font-bold font-mono text-[#0D1B2A]">{formData.gstNumber || "Not provided"}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* PAN Details Card */}
          <motion.div variants={cardVariants}>
            <Card className="bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 border-0">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 bg-[#FFF5E6] rounded-xl mb-4">
                  <IdCard className="w-6 h-6 text-[#FDA11E]" />
                </div>
                <h3 className="text-xl font-bold text-[#0D1B2A] mb-1">PAN Details</h3>
                <p className="text-sm text-[#6B7280] mb-4">Permanent Account Number</p>
                <p className="text-xl font-bold font-mono text-[#0D1B2A]">{formData.panNumber || "Not provided"}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* HSN / SAC Number Card */}
          <motion.div variants={cardVariants}>
            <Card className="bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 border-0">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 bg-[#FFF5E6] rounded-xl mb-4">
                  <Hash className="w-6 h-6 text-[#FDA11E]" />
                </div>
                <h3 className="text-xl font-bold text-[#0D1B2A] mb-1">HSN / SAC Number</h3>
                <p className="text-sm text-[#6B7280] mb-4">Harmonized System Nomenclature</p>
                <p className="text-xl font-bold font-mono text-[#0D1B2A]">{formData.hsnSacNumber || "Not provided"}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Legal Name Card */}
          <motion.div variants={cardVariants}>
            <Card className="bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 border-0">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 bg-[#FFF5E6] rounded-xl mb-4">
                  <Shield className="w-6 h-6 text-[#FDA11E]" />
                </div>
                <h3 className="text-xl font-bold text-[#0D1B2A] mb-1">Legal Name</h3>
                <p className="text-sm text-[#6B7280] mb-4">Registered Company Name</p>
                <p className="text-xl font-bold text-[#0D1B2A]">{formData.legalName || "Not provided"}</p>
              </CardContent>
            </Card>
          </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Bank Account Card (Special - Full Width) */}
        <motion.div
          variants={cardVariants}
          className="mb-6"
        >
          <Card className="bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 border-0">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl">
                    <CreditCard className="w-6 h-6 text-[#FDA11E]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0D1B2A]">Bank Account Details</h3>
                    <p className="text-sm text-gray-500 font-light">Banking information for transactions</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  {formData.isVerified && (
                    <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  )}
                  {/* Image Placeholder */}
                  <div className="">
                  <img
                  src="/src/assets/HDFC_LOGO.png"
                  alt="OCL Services"
                  className="h-20 w-30 "
                />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm text-[#6B7280] font-light mb-2 block">Bank Name</Label>
                  <p className="text-lg text-[#0D1B2A] font-light">{formData.bankName || "Not provided"}</p>
                </div>

                <div>
                  <Label className="text-sm text-[#6B7280] font-light mb-2 block">Account Number</Label>
                  <p className="text-lg font-mono text-[#0D1B2A] font-light">{formData.accountNumber || "Not provided"}</p>
                </div>

                <div>
                  <Label className="text-sm text-[#6B7280] font-light mb-2 block">IFSC Code</Label>
                  <p className="text-lg font-mono text-[#0D1B2A] font-light">{formData.ifscCode || "Not provided"}</p>
                </div>

                <div>
                  <Label className="text-sm text-[#6B7280] font-light mb-2 block">Branch</Label>
                  <p className="text-lg text-[#0D1B2A] font-light">{formData.branch || "Not provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Last Updated Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-right"
        >
          <p className="text-sm text-gray-500 font-light">
            Last Updated: {new Date(formData.lastUpdated).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default BusinessInfo;

