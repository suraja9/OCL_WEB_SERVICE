import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Package, Clock, CheckCircle, XCircle, Truck, Calendar, MapPin, ShoppingCart, ClipboardCheck, Home } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Shipment {
  id: string;
  trackingNumber: string;
  recipientName: string;
  destination: string;
  status: "in-transit" | "delivered" | "pending" | "cancelled";
  shipmentDate: string;
  estimatedDelivery: string;
  service: string;
  weight: string;
  amount: number;
}

const MyShipments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const viewMode = searchParams.get('view') || 'cards';
  const progressOnly = viewMode === 'progress';
  const [activeTab, setActiveTab] = useState("all");
  const [currentStep, setCurrentStep] = useState(0);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoadingTracking, setIsLoadingTracking] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const trackingNumber = searchParams.get('number');
  const trackingType = searchParams.get('type');
  
  const trackerSteps = [
    { key: 'placed', title: 'Order Placed', icon: ShoppingCart },
    { key: 'accepted', title: 'Accepted', icon: ClipboardCheck },
    { key: 'progress', title: 'In Progress', icon: Package },
    { key: 'way', title: 'On the Way', icon: Truck },
    { key: 'delivered', title: 'Delivered', icon: Home }
  ] as const;

  // Map API status to step index
  const getStepFromStatus = (status: string): number => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('delivered')) return 4;
    if (statusLower.includes('way') || statusLower.includes('transit')) return 3;
    if (statusLower.includes('progress')) return 2;
    if (statusLower.includes('accepted')) return 1;
    return 0; // placed/booked
  };

  // Fetch tracking data when in progress mode (only when explicitly enabled via ?live=1)
  useEffect(() => {
    const live = searchParams.get('live') === '1';
    if (progressOnly && trackingNumber && live) {
      setIsLoadingTracking(true);
      setTrackingError(null);
      
      const fetchTrackingData = async () => {
        try {
          const endpoint = trackingType === 'awb' 
            ? `/api/corporate/track/${trackingNumber}`
            : `/api/corporate/track/${trackingNumber}`; // Ref No can use same endpoint
          
          const response = await fetch(endpoint);
          
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setTrackingData(data.data);
              const stepIndex = getStepFromStatus(data.data.status || 'booked');
              setCurrentStep(stepIndex);
            } else {
              setTrackingError('Shipment not found. Please check the tracking number.');
            }
          } else {
            setTrackingError('Failed to fetch tracking information.');
          }
        } catch (error) {
          console.error('Tracking error:', error);
          setTrackingError('An error occurred while tracking your shipment.');
        } finally {
          setIsLoadingTracking(false);
        }
      };
      
      fetchTrackingData();
    }
  }, [progressOnly, trackingNumber, trackingType, searchParams]);

  useEffect(() => {
    // animate step-by-step with 0.8s delay (only if not using API data)
    if (progressOnly && trackingData) return; // Don't auto-animate when using real data
    if (currentStep >= trackerSteps.length - 1) return;
    const id = setTimeout(() => setCurrentStep((s) => Math.min(s + 1, trackerSteps.length - 1)), 800);
    return () => clearTimeout(id);
  }, [currentStep, progressOnly, trackingData, trackerSteps.length]);

  // Mock data - In real app, this would come from API
  const shipments: Shipment[] = [
    {
      id: "1",
      trackingNumber: "871026572",
      recipientName: "John Doe",
      destination: "Mumbai, MH",
      status: "delivered",
      shipmentDate: "2024-01-15",
      estimatedDelivery: "2024-01-17",
      service: "Express",
      weight: "2.5 kg",
      amount: 450
    },
    {
      id: "2", 
      trackingNumber: "871026573",
      recipientName: "Jane Smith",
      destination: "Delhi, DL",
      status: "in-transit",
      shipmentDate: "2024-01-18",
      estimatedDelivery: "2024-01-20",
      service: "Standard",
      weight: "1.2 kg",
      amount: 280
    },
    {
      id: "3",
      trackingNumber: "871026574", 
      recipientName: "Mike Johnson",
      destination: "Bangalore, KA",
      status: "pending",
      shipmentDate: "2024-01-20",
      estimatedDelivery: "2024-01-22",
      service: "Express",
      weight: "3.0 kg",
      amount: 520
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-transit":
        return <Truck className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-transit":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusAccent = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-[#28A745]";
      case "in-transit":
        return "bg-[#007BFF]";
      case "pending":
        return "bg-[#FFC107]";
      case "cancelled":
        return "bg-[#DC3545]";
      default:
        return "bg-gray-300";
    }
  };

  const filteredShipments = useMemo(() => {
    return shipments.filter(shipment => {
      const matchesSearch = shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           shipment.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           shipment.destination.toLowerCase().includes(searchTerm.toLowerCase());
      if (activeTab === "all") return matchesSearch;
      return matchesSearch && shipment.status === activeTab;
    });
  }, [shipments, searchTerm, activeTab]);

  const cardStagger = {
    hidden: { opacity: 0, y: 18 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.06 * i } })
  };

  const detailLine = {
    hidden: { opacity: 0, y: 8 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: 0.1 * i } })
  };

  const totalSteps = trackerSteps.length;
  const barLeft = `${(0.5 / totalSteps) * 100}%`;
  const barWidth = `${((totalSteps - 1) / totalSteps) * 100}%`;
  const fillWidth = `${(currentStep / (totalSteps - 1)) * 100}%`;

  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(135deg, #FFF9F3 0%, #F3F6FB 100%)" }}>
      <Navbar />
      {/* ultra subtle texture overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

      <motion.div className="relative container mx-auto px-4 pt-24 pb-16" initial={{ opacity: 0, y: 16, filter: 'blur(3px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.6 }}>
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 18, letterSpacing: "0.02em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.06em" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-wide bg-gradient-to-r from-[#002E33] to-[#034A53] bg-clip-text text-transparent">
            My Shipments / Tracking
          </h1>
          <motion.p className="text-lg text-[#3d4a5a]/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Track and manage all your shipments in one place. View delivery status, estimated dates, and shipment details.
          </motion.p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
            <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#002E33]/60 z-10 pointer-events-none" />
              <Input
                placeholder="Search by tracking number, recipient, or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-10 rounded-[14px] border-none bg-white/60 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.05)] focus-visible:ring-2 focus-visible:ring-[#FDBD4E]"
                style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 8px 16px, rgba(0, 0, 0, 0.20) 0px 4px 4px" }}
              />
              {searchTerm && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-2.5 h-6 w-6 rounded-full grid place-items-center text-[#5b6a76] hover:text-[#002E33] hover:bg-black/5"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center rounded-[14px] px-6 py-2.5 text-white shadow-md bg-gradient-to-r from-[#FE9F16] to-[#FDBD4E] hover:brightness-110 focus:outline-none"
              style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 8px 16px, rgba(0, 0, 0, 0.20) 0px 4px 4px" }}
            >
              <motion.span whileTap={{ scale: 0.95 }} className="inline-flex items-center">
                <Search className="h-4 w-4 mr-2" /> Search
              </motion.span>
            </motion.button>
          </div>

          {/* Animated Shipment Tracker - Only show for progress-only view (AWB/Ref) */}
          {progressOnly && (
          <div className="mb-8" style={{ background: '#FFF9F3', borderRadius: 12, boxShadow: 'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px', padding: '14px 25px', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <div className="mb-2">
              <div className="text-[14px] font-semibold" style={{ color: '#1B1B1B' }}>Order Status</div>
              <div className="text-[11px]" style={{ color: '#333333' }}>Order ID: #SDGT1254FD</div>
            </div>
            {isLoadingTracking && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FD9C13]"></div>
                <p className="mt-4 text-sm text-[#6b7280]">Loading tracking information...</p>
              </div>
            )}
            
            {trackingError && (
              <div className="text-center py-8">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <p className="text-sm text-red-600 font-medium">{trackingError}</p>
                <p className="text-xs text-[#6b7280] mt-2">Please check the tracking number and try again.</p>
              </div>
            )}
            
            {!isLoadingTracking && !trackingError && (
            <div className="flex items-start justify-between relative" style={{ gap: 32, paddingTop: 14, paddingBottom: 14 }}>
              {/* Single continuous progress bar from center of first to center of last icon */}
              <div className="absolute" style={{ left: barLeft, width: barWidth, top: 88 }}>
                <div className="h-2 w-full rounded-md" style={{ background: '#E0E0E0', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.06)' }} />
                <div className="h-2 rounded-md" style={{ background: '#FDA11E', position: 'relative', top: -8, width: fillWidth }} />
              </div>

              {/* Overlay: ticks aligned on the same baseline as the progress bar */}
              <div className="absolute" style={{ left: barLeft, width: barWidth, top: 92, height: 0, pointerEvents: 'none' }}>
                {trackerSteps.map((step, index) => {
                  const isDone = index <= currentStep;
                  return (
                    <div key={step.key} className="absolute" style={{ left: `${(index / (totalSteps - 1)) * 100}%`, transform: 'translate(-50%, -50%)', zIndex: 10 }}>
                      <div className={`h-3.5 w-3.5 rounded-[3px] border ${isDone ? 'bg-[#FDA11E] border-[#FDA11E]' : 'bg-white border-[#D6D6D6]'}`}>
                        {isDone && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="absolute top-0.5 left-0.5">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {trackerSteps.map((step, index) => {
                const Icon = step.icon;
                const isDone = index <= currentStep;
                const stepPosition = (index / (trackerSteps.length - 1)) * 100;
                return (
                  <div key={step.key} className="flex-1 flex flex-col items-center text-center relative">
                    {/* Icon and Text grouped together with slight space */}
                    <div className="flex flex-col items-center">
                      <motion.div
                        className={`relative z-10 grid place-items-center h-8 w-8 rounded-full border-2`}
                        style={{
                          background: '#FFFFFF',
                          borderColor: isDone ? '#FDA11E' : '#D6D6D6',
                          color: isDone ? '#FDA11E' : '#BDBDBD'
                        }}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </motion.div>
                      <div className="mt-0.5 text-[11px] font-medium" style={{ color: isDone ? '#1B1B1B' : '#333333' }}>{step.title}</div>
                    </div>
                    
                    {/* Clean gap between title and progress bar */}
                    <div className="h-6" />
                    {/* gap where the bar and ticks layer sits */}
                    <div className="h-0" />
                    {/* Clean gap between bar and date */}
                    <div className="h-6" />
                    
                    {/* Date */}
                    <div className="text-[9px]" style={{ color: '#333333' }}>
                      {(() => {
                        if (trackingData?.timeline && trackingData.timeline.length > 0) {
                          // Find timeline entry for this step
                          const timelineEntry = trackingData.timeline.find((t: any) => {
                            const tStatus = t.status.toLowerCase();
                            if (index === 0) return tStatus.includes('booked') || tStatus.includes('placed');
                            if (index === 1) return tStatus.includes('accepted');
                            if (index === 2) return tStatus.includes('progress');
                            if (index === 3) return tStatus.includes('way') || tStatus.includes('transit');
                            if (index === 4) return tStatus.includes('delivered');
                            return false;
                          });
                          
                          if (timelineEntry) {
                            const date = new Date(timelineEntry.timestamp);
                            return `${date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}`;
                          }
                        }
                        
                        // Fallback to booking date or current date
                        if (trackingData?.usedAt && index === 0) {
                          const date = new Date(trackingData.usedAt);
                          return `${date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}`;
                        }
                        
                        const now = new Date();
                        const date = new Date(now.getTime() + (index * 24 * 60 * 60 * 1000));
                        return index <= currentStep 
                          ? `${date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}`
                          : `Expected ${date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}`;
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>
          )}

          {!progressOnly && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="relative grid w-full grid-cols-5 bg-transparent">
              {(["all","delivered","in-transit","pending","cancelled"] as const).map((tab) => (
                <TabsTrigger key={tab} value={tab} className="group relative rounded-md px-4 py-2 text-[#1a2b34] data-[state=active]:text-[#FFB320] transition-transform data-[state=active]:font-semibold hover:scale-[1.03]">
                  <span className="capitalize">{tab === "in-transit" ? "In Transit" : tab}</span>
                  <span className="pointer-events-none absolute left-0 -bottom-1 h-0.5 w-full origin-left scale-x-0 bg-gradient-to-r from-[#FE9F16] to-[#FDBD4E] transition-transform duration-300 group-hover:scale-x-100" />
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="relative h-1 mt-1">
              <motion.div
                key={activeTab}
                layoutId="tab-underline"
                className="h-1 rounded-full bg-gradient-to-r from-[#FE9F16] to-[#FDBD4E]"
              />
            </div>

            <TabsContent value={activeTab} className="mt-6">
              {filteredShipments.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <img src={"/assets/pickup-truck-icon.jpg"} alt="No shipments" className="mx-auto h-24 w-24 object-contain opacity-90 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-[#002E33]">No shipments found. Try changing filters.</h3>
                </motion.div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="grid gap-6">
                    {filteredShipments.map((shipment, index) => (
                      <motion.div key={shipment.id} custom={index} variants={cardStagger} initial="hidden" animate="show">
                        <Card className="relative rounded-[18px] overflow-hidden border border-black/5 bg-gradient-to-br from-white to-[#FDFDFD] transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01]" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}>
                          <div className={`absolute left-0 top-0 h-full w-1.5 ${getStatusAccent(shipment.status)}`} />
                          <CardHeader className="pb-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <CardTitle className="text-xl font-bold text-[#002E33] flex items-center gap-2">
                                  {getStatusIcon(shipment.status)}
                                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                                    {shipment.trackingNumber}
                                  </motion.span>
                                </CardTitle>
                                <p className="text-[#3d4a5a]/70">To: {shipment.recipientName}</p>
                              </div>
                              <Badge className={`${getStatusColor(shipment.status)} capitalize rounded-[3px] h-[29px] leading-[29px] px-3 border pointer-events-none select-none shadow-[rgba(255,255,255,.6)_0_1px_0_inset]`}> 
                                {shipment.status.replace('-', ' ')}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                              <motion.div className="flex items-center gap-3" custom={0} variants={detailLine} initial="hidden" animate="show">
                                <MapPin className="h-5 w-5 text-[#034A53]/70" />
                                <div>
                                  <p className="text-sm text-[#3d4a5a]/70">Destination</p>
                                  <p className="font-medium text-[#002E33]">{shipment.destination}</p>
                                </div>
                              </motion.div>
                              <motion.div className="flex items-center gap-3" custom={1} variants={detailLine} initial="hidden" animate="show">
                                <Calendar className="h-5 w-5 text-[#034A53]/70" />
                                <div>
                                  <p className="text-sm text-[#3d4a5a]/70">Shipped Date</p>
                                  <p className="font-medium text-[#002E33]">{new Date(shipment.shipmentDate).toLocaleDateString()}</p>
                                </div>
                              </motion.div>
                              <motion.div className="flex items-center gap-3" custom={2} variants={detailLine} initial="hidden" animate="show">
                                <Clock className="h-5 w-5 text-[#034A53]/70" />
                                <div>
                                  <p className="text-sm text-[#3d4a5a]/70">Est. Delivery</p>
                                  <p className="font-medium text-[#002E33]">{new Date(shipment.estimatedDelivery).toLocaleDateString()}</p>
                                </div>
                              </motion.div>
                              <motion.div className="flex items-center gap-3" custom={3} variants={detailLine} initial="hidden" animate="show">
                                <Package className="h-5 w-5 text-[#034A53]/70" />
                                <div>
                                  <p className="text-sm text-[#3d4a5a]/70">Service</p>
                                  <p className="font-medium text-[#002E33]">{shipment.service}</p>
                                </div>
                              </motion.div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 pt-4 border-t border-black/5">
                              <div className="flex items-center gap-6 mb-4 md:mb-0">
                                <span className="text-sm text-[#3d4a5a]/70">
                                  Weight: <span className="font-medium text-[#002E33]">{shipment.weight}</span>
                                </span>
                                <span className="text-sm text-[#3d4a5a]/70">
                                  Amount: <span className="font-medium text-[#002E33]">₹{shipment.amount}</span>
                                </span>
                              </div>

                              <div className="flex gap-3">
                                <motion.button 
                                  whileHover={{ scale: 1.02, borderColor: '#FDA11E' }} 
                                  whileTap={{ scale: 0.98 }} 
                                  className="rounded-md px-4 py-2 bg-white border shadow transition-all duration-200 hover:text-[#FDA11E]"
                                  style={{ color: '#1B1B1B', borderColor: 'rgba(0, 0, 0, 0.1)' }}
                                >
                                  Track Details
                                </motion.button>
                                <motion.button 
                                  whileHover={{ scale: 1.02, backgroundColor: '#FE9F16' }} 
                                  whileTap={{ scale: 0.98 }} 
                                  className="rounded-md px-4 py-2 text-white shadow transition-all duration-200"
                                  style={{ background: '#FDA11E' }}
                                >
                                  Download Receipt
                                </motion.button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </TabsContent>
          </Tabs>
          )}
        </motion.div>

        {progressOnly && (
        <div className="rounded-[16px] p-5 md:p-6 border border-black/5" style={{ background: '#FFF9F3', boxShadow: 'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px' }}>
          <div className="text-sm font-semibold mb-4" style={{ color: '#1B1B1B' }}>Products</div>
          <div className="divide-y divide-gray-200/60">
            {[{name:'Wooden Sofa Chair', color:'Grey', qty:4, id:'#1001'},
              {name:'Red Gaming Chair', color:'Black', qty:2, id:'#1002'},
              {name:'Swivel Chair', color:'Light Brown', qty:1, id:'#1003'},
              {name:'Circular Sofa Chair', color:'Brown', qty:2, id:'#1004'}].map((p, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-gray-100 border border-gray-200 overflow-hidden grid place-items-center">
                    <img src={`/assets/placeholder.svg`} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#1B1B1B' }}>{p.name}</div>
                    <div className="text-xs" style={{ color: '#333333' }}>Color : {p.color} | {p.qty} Qty.</div>
                  </div>
                </div>
                <div className="text-xs font-medium" style={{ color: '#FDA11E' }}>{p.id}</div>
              </div>
            ))}
          </div>
        </div>
        )}
      </motion.div>

      <Footer />
    </div>
  );
};

export default MyShipments;
