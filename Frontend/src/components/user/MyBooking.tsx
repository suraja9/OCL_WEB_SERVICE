import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUserAuth } from "@/contexts/UserAuthContext";
import UserLogin from "./UserLogin";
import {
  Package,
  MapPin,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Building,
  FileText,
  Weight,
  Ruler,
  Shield,
  DollarSign,
  Image as ImageIcon,
  Globe,
  Gift,
  Heart,
  Lock,
} from "lucide-react";

interface ContactSupportProps {
  isDarkMode: boolean;
}

interface Booking {
  _id: string;
  bookingReference: string;
  status: "pending" | "confirmed" | "in_transit" | "delivered" | "cancelled";
  origin: {
    name: string;
    mobileNumber: string;
    email?: string;
    companyName?: string;
    flatBuilding?: string;
    locality: string;
    landmark?: string;
    pincode: string;
    area?: string;
    city: string;
    district: string;
    state: string;
    gstNumber?: string;
    alternateNumbers?: string[];
    addressType?: string;
    birthday?: string;
    anniversary?: string;
    website?: string;
    otherAlternateNumber?: string;
  };
  destination: {
    name: string;
    mobileNumber: string;
    email?: string;
    companyName?: string;
    flatBuilding?: string;
    locality: string;
    landmark?: string;
    pincode: string;
    area?: string;
    city: string;
    district: string;
    state: string;
    gstNumber?: string;
    alternateNumbers?: string[];
    addressType?: string;
    birthday?: string;
    anniversary?: string;
    website?: string;
    otherAlternateNumber?: string;
  };
  shipment: {
    natureOfConsignment: string;
    insurance: string;
    riskCoverage: string;
    packagesCount: string;
    materials?: string;
    others?: string;
    description?: string;
    weight?: string;
    length?: string;
    width?: string;
    height?: string;
    insuranceCompanyName?: string;
    insurancePolicyNumber?: string;
    insurancePolicyDate?: string;
    insuranceValidUpto?: string;
    insurancePremiumAmount?: string;
    insuranceDocumentName?: string;
    insuranceDocument?: string;
  };
  packageImages?: string[];
  shippingMode?: string;
  serviceType?: string;
  calculatedPrice?: number;
  actualWeight?: number;
  volumetricWeight?: number;
  chargeableWeight?: number;
  originServiceable?: boolean;
  destinationServiceable?: boolean;
  originAddressInfo?: string;
  destinationAddressInfo?: string;
  createdAt: string;
  updatedAt: string;
}

const MyBooking: React.FC<ContactSupportProps> = ({ isDarkMode }) => {
  const { isAuthenticated, customer, isLoading: authLoading } = useUserAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      setLoading(false);
      return;
    }
    
    fetchBookings();
  }, [isAuthenticated, authLoading]);

  const fetchBookings = async () => {
    if (!customer?._id) {
      setError("Please login to view your bookings");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const API_BASE: string = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE}/api/customer-booking?onlineCustomerId=${customer._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      if (data.success && data.data) {
        setBookings(data.data);
      } else {
        setBookings([]);
      }
    } catch (err: any) {
      console.error("Error fetching bookings:", err);
      setError(err.message || "Failed to load bookings");
      toast({
        title: "Error",
        description: "Failed to load your bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (bookingId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(bookingId)) {
      newExpanded.delete(bookingId);
    } else {
      newExpanded.add(bookingId);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: "Pending",
        className: isDarkMode
          ? "bg-yellow-500/20 text-yellow-200 border-yellow-500/40"
          : "bg-yellow-100 text-yellow-700 border-yellow-300",
        icon: Clock,
      },
      confirmed: {
        label: "Confirmed",
        className: isDarkMode
          ? "bg-blue-500/20 text-blue-200 border-blue-500/40"
          : "bg-blue-100 text-blue-700 border-blue-300",
        icon: CheckCircle,
      },
      in_transit: {
        label: "In Transit",
        className: isDarkMode
          ? "bg-purple-500/20 text-purple-200 border-purple-500/40"
          : "bg-purple-100 text-purple-700 border-purple-300",
        icon: Truck,
      },
      delivered: {
        label: "Delivered",
        className: isDarkMode
          ? "bg-green-500/20 text-green-200 border-green-500/40"
          : "bg-green-100 text-green-700 border-green-300",
        icon: CheckCircle,
      },
      cancelled: {
        label: "Cancelled",
        className: isDarkMode
          ? "bg-red-500/20 text-red-200 border-red-500/40"
          : "bg-red-100 text-red-700 border-red-300",
        icon: XCircle,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border",
          config.className
        )}
      >
        <Icon size={12} />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            className={cn(
              "h-8 w-8 animate-spin",
              isDarkMode ? "text-blue-400" : "text-blue-600"
            )}
          />
          <p
            className={cn(
              "text-sm",
              isDarkMode ? "text-slate-300" : "text-slate-600"
            )}
          >
            {authLoading ? "Checking authentication..." : "Loading your bookings..."}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card
            className={cn(
              "transition",
              isDarkMode
                ? "border-slate-800/60 bg-slate-900/70"
                : "border-slate-200 bg-white"
            )}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-3 text-center py-8">
                <Lock
                  className={cn(
                    "h-16 w-16",
                    isDarkMode ? "text-slate-500" : "text-slate-400"
                  )}
                />
                <div>
                  <h3
                    className={cn(
                      "text-lg font-semibold mb-1",
                      isDarkMode ? "text-white" : "text-slate-900"
                    )}
                  >
                    Login Required
                  </h3>
                  <p
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-slate-300" : "text-slate-600"
                    )}
                  >
                    Please login to view your bookings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
          <DialogContent className="max-w-md p-0 border-0 bg-transparent">
            <UserLogin
              isDarkMode={isDarkMode}
              onLoginSuccess={() => {
                setShowLoginDialog(false);
                fetchBookings();
              }}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
        </div>
        <Card
          className={cn(
            "transition",
            isDarkMode
              ? "border-red-500/40 bg-red-500/10"
              : "border-red-200 bg-red-50"
          )}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <XCircle
                className={cn(
                  "h-12 w-12",
                  isDarkMode ? "text-red-400" : "text-red-600"
                )}
              />
              <div>
                <h3
                  className={cn(
                    "text-lg font-semibold mb-1",
                    isDarkMode ? "text-white" : "text-slate-900"
                  )}
                >
                  Error Loading Bookings
                </h3>
                <p
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  )}
                >
                  {error}
                </p>
              </div>
              <Button
                onClick={fetchBookings}
                className="mt-2"
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
        </div>
        <Button
          onClick={fetchBookings}
          variant="outline"
          size="sm"
          className={cn(
            isDarkMode
              ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          )}
        >
          Refresh
        </Button>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <Card
          className={cn(
            "transition",
            isDarkMode
              ? "border-slate-800/60 bg-slate-900/70"
              : "border-slate-200 bg-white"
          )}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-3 text-center py-8">
              <Package
                className={cn(
                  "h-16 w-16",
                  isDarkMode ? "text-slate-500" : "text-slate-400"
                )}
              />
              <div>
                <h3
                  className={cn(
                    "text-lg font-semibold mb-1",
                    isDarkMode ? "text-white" : "text-slate-900"
                  )}
                >
                  No Bookings Yet
                </h3>
                <p
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  )}
                >
                  You haven't made any bookings yet. Create your first booking
                  to get started!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isExpanded = expandedRows.has(booking._id);
            return (
              <Card
                key={booking._id}
                className={cn(
                  "transition-all duration-200",
                  isDarkMode
                    ? "border-slate-800/60 bg-slate-900/70 hover:border-blue-500/40"
                    : "border-slate-200 bg-white hover:border-blue-300/50 hover:shadow-md"
                )}
              >
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => toggleRow(booking._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-1">
                      {/* First Line: Booking ID + Created Date/Time */}
                      <div className="flex items-center gap-2">
                        <CardTitle
                          className={cn(
                            "text-sm font-semibold",
                            isDarkMode ? "text-white" : "text-slate-900"
                          )}
                        >
                          {booking.bookingReference}
                        </CardTitle>
                        <p
                          className={cn(
                            "text-[10px]",
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          )}
                        >
                          {formatShortDate(booking.createdAt)}
                        </p>
                      </div>
                      {/* Second Line: Route, Package, and Price */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <MapPin
                            className={cn(
                              "h-3.5 w-3.5 flex-shrink-0",
                              isDarkMode ? "text-blue-400" : "text-blue-600"
                            )}
                          />
                          <p
                            className={cn(
                              "text-[10px] font-medium",
                              isDarkMode ? "text-slate-200" : "text-slate-700"
                            )}
                          >
                            {booking.origin.city} → {booking.destination.city}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package
                            className={cn(
                              "h-3.5 w-3.5 flex-shrink-0",
                              isDarkMode ? "text-purple-400" : "text-purple-600"
                            )}
                          />
                          <p
                            className={cn(
                              "text-[10px] font-medium",
                              isDarkMode ? "text-slate-200" : "text-slate-700"
                            )}
                          >
                            {booking.shipment.packagesCount}
                          </p>
                        </div>
                        {booking.calculatedPrice && (
                          <div className="flex items-center gap-0.5">
                            <span
                              className={cn(
                                "text-[10px] font-medium",
                                isDarkMode ? "text-green-400" : "text-green-600"
                              )}
                            >
                              ₹
                            </span>
                            <p
                              className={cn(
                                "text-[10px] font-medium",
                                isDarkMode ? "text-slate-200" : "text-slate-700"
                              )}
                            >
                              {booking.calculatedPrice.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <button className="p-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                      {isExpanded ? (
                        <ChevronUp
                          className={cn(
                            "h-4 w-4",
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          )}
                        />
                      ) : (
                        <ChevronDown
                          className={cn(
                            "h-4 w-4",
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          )}
                        />
                      )}
                    </button>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="space-y-2 pt-3">
                      {/* Origin Details - Complete */}
                      <div className={cn(
                        "p-3",
                        isDarkMode
                          ? "bg-slate-800/20"
                          : "bg-slate-50/50"
                      )}>
                        <div className="flex items-center gap-1.5 mb-2">
                          <MapPin
                            className={cn(
                              "h-4 w-4",
                              isDarkMode ? "text-blue-400" : "text-blue-600"
                            )}
                          />
                          <h3
                            className={cn(
                              "text-sm font-semibold",
                              isDarkMode ? "text-white" : "text-slate-900"
                            )}
                          >
                            Origin / Sender Details
                          </h3>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          <div>
                            <p
                              className={cn(
                                "text-[10px] font-medium mb-0.5",
                                isDarkMode ? "text-slate-400" : "text-slate-500"
                              )}
                            >
                              Name
                            </p>
                            <p
                              className={cn(
                                "text-xs",
                                isDarkMode ? "text-white" : "text-slate-900"
                              )}
                            >
                              {booking.origin.name}
                            </p>
                          </div>
                          <div>
                            <p
                              className={cn(
                                "text-[10px] font-medium mb-0.5",
                                isDarkMode ? "text-slate-400" : "text-slate-500"
                              )}
                            >
                              Mobile Number
                            </p>
                            <div className="flex items-center gap-1">
                              <Phone
                                className={cn(
                                  "h-2.5 w-2.5",
                                  isDarkMode ? "text-slate-400" : "text-slate-500"
                                )}
                              />
                              <p
                                className={cn(
                                  "text-xs",
                                  isDarkMode ? "text-white" : "text-slate-900"
                                )}
                              >
                                {booking.origin.mobileNumber}
                              </p>
                            </div>
                          </div>
                          {booking.origin.email && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode ? "text-slate-400" : "text-slate-500"
                                )}
                              >
                                Email
                              </p>
                              <div className="flex items-center gap-1">
                                <Mail
                                  className={cn(
                                    "h-2.5 w-2.5",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  )}
                                />
                                <p
                                  className={cn(
                                    "text-xs",
                                    isDarkMode ? "text-white" : "text-slate-900"
                                  )}
                                >
                                  {booking.origin.email}
                                </p>
                              </div>
                            </div>
                          )}
                          {booking.origin.companyName && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode ? "text-slate-400" : "text-slate-500"
                                )}
                              >
                                Company Name
                              </p>
                              <div className="flex items-center gap-1">
                                <Building
                                  className={cn(
                                    "h-2.5 w-2.5",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  )}
                                />
                                <p
                                  className={cn(
                                    "text-xs",
                                    isDarkMode ? "text-white" : "text-slate-900"
                                  )}
                                >
                                  {booking.origin.companyName}
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="sm:col-span-2 lg:col-span-3">
                            <p
                              className={cn(
                                "text-[10px] font-medium mb-0.5",
                                isDarkMode ? "text-slate-400" : "text-slate-500"
                              )}
                            >
                              Address
                            </p>
                            <p
                              className={cn(
                                "text-xs",
                                isDarkMode ? "text-white" : "text-slate-900"
                              )}
                            >
                              {[
                                booking.origin.flatBuilding,
                                booking.origin.locality,
                                booking.origin.landmark,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                            <p
                              className={cn(
                                "text-xs mt-0.5",
                                isDarkMode ? "text-slate-300" : "text-slate-600"
                              )}
                            >
                              {booking.origin.area && `${booking.origin.area}, `}
                              {booking.origin.city}, {booking.origin.district},{" "}
                              {booking.origin.state} - {booking.origin.pincode}
                            </p>
                          </div>
                          {booking.origin.gstNumber && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode ? "text-slate-400" : "text-slate-500"
                                )}
                              >
                                GST Number
                              </p>
                              <p
                                className={cn(
                                  "text-xs",
                                  isDarkMode ? "text-white" : "text-slate-900"
                                )}
                              >
                                {booking.origin.gstNumber}
                              </p>
                            </div>
                          )}
                          {booking.origin.addressType && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode ? "text-slate-400" : "text-slate-500"
                                )}
                              >
                                Address Type
                              </p>
                              <p
                                className={cn(
                                  "text-xs",
                                  isDarkMode ? "text-white" : "text-slate-900"
                                )}
                              >
                                {booking.origin.addressType}
                              </p>
                            </div>
                          )}
                          {booking.origin.alternateNumbers &&
                            booking.origin.alternateNumbers.length > 0 && (
                              <div>
                                <p
                                  className={cn(
                                    "text-[10px] font-medium mb-0.5",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  )}
                                >
                                  Alternate Numbers
                                </p>
                                <p
                                  className={cn(
                                    "text-xs",
                                    isDarkMode ? "text-white" : "text-slate-900"
                                  )}
                                >
                                  {booking.origin.alternateNumbers.join(", ")}
                                </p>
                              </div>
                            )}
                          {booking.origin.otherAlternateNumber && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode ? "text-slate-400" : "text-slate-500"
                                )}
                              >
                                Other Alternate Number
                              </p>
                              <p
                                className={cn(
                                  "text-xs",
                                  isDarkMode ? "text-white" : "text-slate-900"
                                )}
                              >
                                {booking.origin.otherAlternateNumber}
                              </p>
                            </div>
                          )}
                          {booking.origin.birthday && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode ? "text-slate-400" : "text-slate-500"
                                )}
                              >
                                Birthday
                              </p>
                              <div className="flex items-center gap-1">
                                <Gift
                                  className={cn(
                                    "h-2.5 w-2.5",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  )}
                                />
                                <p
                                  className={cn(
                                    "text-xs",
                                    isDarkMode ? "text-white" : "text-slate-900"
                                  )}
                                >
                                  {booking.origin.birthday}
                                </p>
                              </div>
                            </div>
                          )}
                          {booking.origin.anniversary && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode ? "text-slate-400" : "text-slate-500"
                                )}
                              >
                                Anniversary
                              </p>
                              <div className="flex items-center gap-1">
                                <Heart
                                  className={cn(
                                    "h-2.5 w-2.5",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  )}
                                />
                                <p
                                  className={cn(
                                    "text-xs",
                                    isDarkMode ? "text-white" : "text-slate-900"
                                  )}
                                >
                                  {booking.origin.anniversary}
                                </p>
                              </div>
                            </div>
                          )}
                          {booking.origin.website && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode ? "text-slate-400" : "text-slate-500"
                                )}
                              >
                                Website
                              </p>
                              <div className="flex items-center gap-1">
                                <Globe
                                  className={cn(
                                    "h-2.5 w-2.5",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  )}
                                />
                                <a
                                  href={booking.origin.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={cn(
                                    "text-xs underline",
                                    isDarkMode
                                      ? "text-blue-300 hover:text-blue-200"
                                      : "text-blue-600 hover:text-blue-700"
                                  )}
                                >
                                  {booking.origin.website}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Destination Details - Complete */}
                      <div className={cn(
                        "p-3",
                        isDarkMode
                          ? "bg-slate-800/20"
                          : "bg-slate-50/50"
                      )}>
                        <div className="flex items-center gap-1.5 mb-2">
                          <MapPin
                            className={cn(
                              "h-4 w-4",
                              isDarkMode ? "text-green-400" : "text-green-600"
                            )}
                          />
                          <h3
                            className={cn(
                              "text-sm font-semibold",
                              isDarkMode ? "text-white" : "text-slate-900"
                            )}
                          >
                            Destination / Receiver Details
                          </h3>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          <div>
                            <p
                              className={cn(
                                "text-[10px] font-medium mb-0.5",
                                isDarkMode ? "text-slate-400" : "text-slate-500"
                              )}
                            >
                              Name
                            </p>
                            <p
                              className={cn(
                                "text-xs",
                                isDarkMode ? "text-white" : "text-slate-900"
                              )}
                            >
                              {booking.destination.name}
                            </p>
                          </div>
                          <div>
                            <p
                              className={cn(
                                "text-[10px] font-medium mb-0.5",
                                isDarkMode ? "text-slate-400" : "text-slate-500"
                              )}
                            >
                              Mobile Number
                            </p>
                            <div className="flex items-center gap-1">
                              <Phone
                                className={cn(
                                  "h-2.5 w-2.5",
                                  isDarkMode ? "text-slate-400" : "text-slate-500"
                                )}
                              />
                              <p
                                className={cn(
                                  "text-xs",
                                  isDarkMode ? "text-white" : "text-slate-900"
                                )}
                              >
                                {booking.destination.mobileNumber}
                              </p>
                            </div>
                          </div>
                          {booking.destination.email && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode ? "text-slate-400" : "text-slate-500"
                                )}
                              >
                                Email
                              </p>
                              <div className="flex items-center gap-1">
                                <Mail
                                  className={cn(
                                    "h-2.5 w-2.5",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  )}
                                />
                                <p
                                  className={cn(
                                    "text-xs",
                                    isDarkMode ? "text-white" : "text-slate-900"
                                  )}
                                >
                                  {booking.destination.email}
                                </p>
                              </div>
                            </div>
                          )}
                          {booking.destination.companyName && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode ? "text-slate-400" : "text-slate-500"
                                )}
                              >
                                Company Name
                              </p>
                              <div className="flex items-center gap-1">
                                <Building
                                  className={cn(
                                    "h-2.5 w-2.5",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  )}
                                />
                                <p
                                  className={cn(
                                    "text-xs",
                                    isDarkMode ? "text-white" : "text-slate-900"
                                  )}
                                >
                                  {booking.destination.companyName}
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="sm:col-span-2 lg:col-span-3">
                            <p
                              className={cn(
                                "text-[10px] font-medium mb-0.5",
                                isDarkMode ? "text-slate-400" : "text-slate-500"
                              )}
                            >
                              Address
                            </p>
                            <p
                              className={cn(
                                "text-xs",
                                isDarkMode ? "text-white" : "text-slate-900"
                              )}
                            >
                              {[
                                booking.destination.flatBuilding,
                                booking.destination.locality,
                                booking.destination.landmark,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                            <p
                              className={cn(
                                "text-xs mt-0.5",
                                isDarkMode ? "text-slate-300" : "text-slate-600"
                              )}
                            >
                              {booking.destination.area &&
                                `${booking.destination.area}, `}
                              {booking.destination.city},{" "}
                              {booking.destination.district},{" "}
                              {booking.destination.state} -{" "}
                              {booking.destination.pincode}
                            </p>
                          </div>
                          {booking.destination.gstNumber && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode ? "text-slate-400" : "text-slate-500"
                                )}
                              >
                                GST Number
                              </p>
                              <p
                                className={cn(
                                  "text-xs",
                                  isDarkMode ? "text-white" : "text-slate-900"
                                )}
                              >
                                {booking.destination.gstNumber}
                              </p>
                            </div>
                          )}
                          {booking.destination.addressType && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode ? "text-slate-400" : "text-slate-500"
                                )}
                              >
                                Address Type
                              </p>
                              <p
                                className={cn(
                                  "text-xs",
                                  isDarkMode ? "text-white" : "text-slate-900"
                                )}
                              >
                                {booking.destination.addressType}
                              </p>
                            </div>
                          )}
                          {booking.destination.alternateNumbers &&
                            booking.destination.alternateNumbers.length > 0 && (
                              <div>
                                <p
                                  className={cn(
                                    "text-[10px] font-medium mb-0.5",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  )}
                                >
                                  Alternate Numbers
                                </p>
                                <p
                                  className={cn(
                                    "text-xs",
                                    isDarkMode ? "text-white" : "text-slate-900"
                                  )}
                                >
                                  {booking.destination.alternateNumbers.join(", ")}
                                </p>
                              </div>
                            )}
                          {booking.destination.otherAlternateNumber && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode ? "text-slate-400" : "text-slate-500"
                                )}
                              >
                                Other Alternate Number
                              </p>
                              <p
                                className={cn(
                                  "text-xs",
                                  isDarkMode ? "text-white" : "text-slate-900"
                                )}
                              >
                                {booking.destination.otherAlternateNumber}
                              </p>
                            </div>
                          )}
                          {booking.destination.birthday && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode ? "text-slate-400" : "text-slate-500"
                                )}
                              >
                                Birthday
                              </p>
                              <div className="flex items-center gap-1">
                                <Gift
                                  className={cn(
                                    "h-2.5 w-2.5",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  )}
                                />
                                <p
                                  className={cn(
                                    "text-xs",
                                    isDarkMode ? "text-white" : "text-slate-900"
                                  )}
                                >
                                  {booking.destination.birthday}
                                </p>
                              </div>
                            </div>
                          )}
                          {booking.destination.anniversary && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode ? "text-slate-400" : "text-slate-500"
                                )}
                              >
                                Anniversary
                              </p>
                              <div className="flex items-center gap-1">
                                <Heart
                                  className={cn(
                                    "h-2.5 w-2.5",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  )}
                                />
                                <p
                                  className={cn(
                                    "text-xs",
                                    isDarkMode ? "text-white" : "text-slate-900"
                                  )}
                                >
                                  {booking.destination.anniversary}
                                </p>
                              </div>
                            </div>
                          )}
                          {booking.destination.website && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode ? "text-slate-400" : "text-slate-500"
                                )}
                              >
                                Website
                              </p>
                              <div className="flex items-center gap-1">
                                <Globe
                                  className={cn(
                                    "h-2.5 w-2.5",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  )}
                                />
                                <a
                                  href={booking.destination.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={cn(
                                    "text-xs underline",
                                    isDarkMode
                                      ? "text-blue-300 hover:text-blue-200"
                                      : "text-blue-600 hover:text-blue-700"
                                  )}
                                >
                                  {booking.destination.website}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Shipment Details - Complete */}
                      <div className={cn(
                        "p-3",
                        isDarkMode
                          ? "bg-slate-800/20"
                          : "bg-slate-50/50"
                      )}>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Package
                            className={cn(
                              "h-4 w-4",
                              isDarkMode ? "text-purple-400" : "text-purple-600"
                            )}
                          />
                          <h3
                            className={cn(
                              "text-sm font-semibold",
                              isDarkMode ? "text-white" : "text-slate-900"
                            )}
                          >
                            Shipment Details
                          </h3>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          <div>
                            <p
                              className={cn(
                                "text-[10px] font-medium mb-0.5",
                                isDarkMode ? "text-slate-400" : "text-slate-500"
                              )}
                            >
                              Nature of Consignment
                            </p>
                            <p
                              className={cn(
                                "text-xs",
                                isDarkMode ? "text-white" : "text-slate-900"
                              )}
                            >
                              {booking.shipment.natureOfConsignment}
                            </p>
                          </div>
                          <div>
                            <p
                              className={cn(
                                "text-[10px] font-medium mb-0.5",
                                isDarkMode ? "text-slate-400" : "text-slate-500"
                              )}
                            >
                              Insurance
                            </p>
                            <p
                              className={cn(
                                "text-xs",
                                isDarkMode ? "text-white" : "text-slate-900"
                              )}
                            >
                              {booking.shipment.insurance}
                            </p>
                          </div>
                          <div>
                            <p
                              className={cn(
                                "text-[10px] font-medium mb-0.5",
                                isDarkMode ? "text-slate-400" : "text-slate-500"
                              )}
                            >
                              Risk Coverage
                            </p>
                            <p
                              className={cn(
                                "text-xs",
                                isDarkMode ? "text-white" : "text-slate-900"
                              )}
                            >
                              {booking.shipment.riskCoverage}
                            </p>
                          </div>
                          <div>
                            <p
                              className={cn(
                                "text-[10px] font-medium mb-0.5",
                                isDarkMode ? "text-slate-400" : "text-slate-500"
                              )}
                            >
                              Packages Count
                            </p>
                            <p
                              className={cn(
                                "text-xs",
                                isDarkMode ? "text-white" : "text-slate-900"
                              )}
                            >
                              {booking.shipment.packagesCount}
                            </p>
                          </div>
                          {booking.shipment.materials && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode
                                    ? "text-slate-400"
                                    : "text-slate-500"
                                )}
                              >
                                Materials
                              </p>
                              <p
                                className={cn(
                                  "text-xs",
                                  isDarkMode ? "text-white" : "text-slate-900"
                                )}
                              >
                                {booking.shipment.materials}
                              </p>
                            </div>
                          )}
                          {booking.shipment.others && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode
                                    ? "text-slate-400"
                                    : "text-slate-500"
                                )}
                              >
                                Others
                              </p>
                              <p
                                className={cn(
                                  "text-xs",
                                  isDarkMode ? "text-white" : "text-slate-900"
                                )}
                              >
                                {booking.shipment.others}
                              </p>
                            </div>
                          )}
                          {booking.shipment.weight && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode
                                    ? "text-slate-400"
                                    : "text-slate-500"
                                )}
                              >
                                Weight
                              </p>
                              <div className="flex items-center gap-1">
                                <Weight
                                  className={cn(
                                    "h-2.5 w-2.5",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  )}
                                />
                                <p
                                  className={cn(
                                    "text-xs",
                                    isDarkMode ? "text-white" : "text-slate-900"
                                  )}
                                >
                                  {booking.shipment.weight} kg
                                </p>
                              </div>
                            </div>
                          )}
                          {booking.shipment.length && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode
                                    ? "text-slate-400"
                                    : "text-slate-500"
                                )}
                              >
                                Length
                              </p>
                              <div className="flex items-center gap-1">
                                <Ruler
                                  className={cn(
                                    "h-2.5 w-2.5",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  )}
                                />
                                <p
                                  className={cn(
                                    "text-xs",
                                    isDarkMode ? "text-white" : "text-slate-900"
                                  )}
                                >
                                  {booking.shipment.length} cm
                                </p>
                              </div>
                            </div>
                          )}
                          {booking.shipment.width && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode
                                    ? "text-slate-400"
                                    : "text-slate-500"
                                )}
                              >
                                Width
                              </p>
                              <div className="flex items-center gap-1">
                                <Ruler
                                  className={cn(
                                    "h-2.5 w-2.5",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  )}
                                />
                                <p
                                  className={cn(
                                    "text-xs",
                                    isDarkMode ? "text-white" : "text-slate-900"
                                  )}
                                >
                                  {booking.shipment.width} cm
                                </p>
                              </div>
                            </div>
                          )}
                          {booking.shipment.height && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode
                                    ? "text-slate-400"
                                    : "text-slate-500"
                                )}
                              >
                                Height
                              </p>
                              <div className="flex items-center gap-1">
                                <Ruler
                                  className={cn(
                                    "h-2.5 w-2.5",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  )}
                                />
                                <p
                                  className={cn(
                                    "text-xs",
                                    isDarkMode ? "text-white" : "text-slate-900"
                                  )}
                                >
                                  {booking.shipment.height} cm
                                </p>
                              </div>
                            </div>
                          )}
                          {booking.shipment.description && (
                            <div className="sm:col-span-2 lg:col-span-3">
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode
                                    ? "text-slate-400"
                                    : "text-slate-500"
                                )}
                              >
                                Description
                              </p>
                              <p
                                className={cn(
                                  "text-xs",
                                  isDarkMode ? "text-slate-300" : "text-slate-600"
                                )}
                              >
                                {booking.shipment.description}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Insurance Details */}
                        {booking.shipment.insuranceCompanyName && (
                          <div className="mt-2 pt-2">
                            <div className="flex items-center gap-1.5 mb-2">
                              <Shield
                                className={cn(
                                  "h-4 w-4",
                                  isDarkMode ? "text-blue-400" : "text-blue-600"
                                )}
                              />
                              <h4
                                className={cn(
                                  "text-sm font-semibold",
                                  isDarkMode ? "text-white" : "text-slate-900"
                                )}
                              >
                                Insurance Details
                              </h4>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                              <div>
                                <p
                                  className={cn(
                                    "text-[10px] font-medium mb-0.5",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  )}
                                >
                                  Insurance Company
                                </p>
                                <p
                                  className={cn(
                                    "text-xs",
                                    isDarkMode ? "text-white" : "text-slate-900"
                                  )}
                                >
                                  {booking.shipment.insuranceCompanyName}
                                </p>
                              </div>
                              {booking.shipment.insurancePolicyNumber && (
                                <div>
                                  <p
                                    className={cn(
                                      "text-[10px] font-medium mb-0.5",
                                      isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                    )}
                                  >
                                    Policy Number
                                  </p>
                                  <p
                                    className={cn(
                                      "text-xs",
                                      isDarkMode ? "text-white" : "text-slate-900"
                                    )}
                                  >
                                    {booking.shipment.insurancePolicyNumber}
                                  </p>
                                </div>
                              )}
                              {booking.shipment.insurancePolicyDate && (
                                <div>
                                  <p
                                    className={cn(
                                      "text-[10px] font-medium mb-0.5",
                                      isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                    )}
                                  >
                                    Policy Date
                                  </p>
                                  <p
                                    className={cn(
                                      "text-xs",
                                      isDarkMode ? "text-white" : "text-slate-900"
                                    )}
                                  >
                                    {booking.shipment.insurancePolicyDate}
                                  </p>
                                </div>
                              )}
                              {booking.shipment.insuranceValidUpto && (
                                <div>
                                  <p
                                    className={cn(
                                      "text-[10px] font-medium mb-0.5",
                                      isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                    )}
                                  >
                                    Valid Upto
                                  </p>
                                  <p
                                    className={cn(
                                      "text-xs",
                                      isDarkMode ? "text-white" : "text-slate-900"
                                    )}
                                  >
                                    {booking.shipment.insuranceValidUpto}
                                  </p>
                                </div>
                              )}
                              {booking.shipment.insurancePremiumAmount && (
                                <div>
                                  <p
                                    className={cn(
                                      "text-[10px] font-medium mb-0.5",
                                      isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                    )}
                                  >
                                    Premium Amount
                                  </p>
                                  <p
                                    className={cn(
                                      "text-xs",
                                      isDarkMode ? "text-white" : "text-slate-900"
                                    )}
                                  >
                                    ₹{booking.shipment.insurancePremiumAmount}
                                  </p>
                                </div>
                              )}
                              {booking.shipment.insuranceDocument && (
                                <div className="sm:col-span-2 lg:col-span-3">
                                  <p
                                    className={cn(
                                      "text-[10px] font-medium mb-0.5",
                                      isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                    )}
                                  >
                                    Insurance Document
                                  </p>
                                  <button
                                    onClick={() => setSelectedImage(booking.shipment.insuranceDocument!)}
                                    className={cn(
                                      "text-xs underline inline-flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity",
                                      isDarkMode
                                        ? "text-blue-300 hover:text-blue-200"
                                        : "text-blue-600 hover:text-blue-700"
                                    )}
                                  >
                                    <FileText className="h-3 w-3" />
                                    View Document
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Package Images */}
                      {booking.packageImages &&
                        booking.packageImages.length > 0 && (
                          <div className={cn(
                            "p-3",
                            isDarkMode
                              ? "bg-slate-800/20"
                              : "bg-slate-50/50"
                          )}>
                            <div className="flex items-center gap-1.5 mb-2">
                              <ImageIcon
                                className={cn(
                                  "h-4 w-4",
                                  isDarkMode ? "text-purple-400" : "text-purple-600"
                                )}
                              />
                              <h3
                                className={cn(
                                  "text-sm font-semibold",
                                  isDarkMode ? "text-white" : "text-slate-900"
                                )}
                              >
                                Package Images ({booking.packageImages.length})
                              </h3>
                            </div>
                            <div className="flex gap-2">
                              {booking.packageImages.map((imageUrl, index) => (
                                <div
                                  key={index}
                                  className="relative group overflow-hidden rounded cursor-pointer flex-1"
                                  onClick={() => setSelectedImage(imageUrl)}
                                >
                                  <img
                                    src={imageUrl}
                                    alt={`Package ${index + 1}`}
                                    className="w-full h-20 object-cover transition-transform group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span
                                      className={cn(
                                        "text-white text-xs font-medium"
                                      )}
                                    >
                                      View Full Size
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Shipping & Pricing Information */}
                      <div className={cn(
                        "p-3",
                        isDarkMode
                          ? "bg-slate-800/20"
                          : "bg-slate-50/50"
                      )}>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Truck
                            className={cn(
                              "h-4 w-4",
                              isDarkMode ? "text-orange-400" : "text-orange-600"
                            )}
                          />
                          <h3
                            className={cn(
                              "text-sm font-semibold",
                              isDarkMode ? "text-white" : "text-slate-900"
                            )}
                          >
                            Shipping & Pricing Information
                          </h3>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {booking.shippingMode && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode
                                    ? "text-slate-400"
                                    : "text-slate-500"
                                )}
                              >
                                Shipping Mode
                              </p>
                              <p
                                className={cn(
                                  "text-xs",
                                  isDarkMode ? "text-white" : "text-slate-900"
                                )}
                              >
                                {booking.shippingMode
                                  .replace("by", "")
                                  .toUpperCase()}
                              </p>
                            </div>
                          )}
                          {booking.serviceType && (
                            <div>
                              <p
                                className={cn(
                                  "text-[10px] font-medium mb-0.5",
                                  isDarkMode
                                    ? "text-slate-400"
                                    : "text-slate-500"
                                )}
                              >
                                Service Type
                              </p>
                              <p
                                className={cn(
                                  "text-xs capitalize",
                                  isDarkMode ? "text-white" : "text-slate-900"
                                )}
                              >
                                {booking.serviceType}
                              </p>
                            </div>
                          )}
                          {booking.calculatedPrice !== null &&
                            booking.calculatedPrice !== undefined && (
                              <div>
                                <p
                                  className={cn(
                                    "text-[10px] font-medium mb-0.5",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  )}
                                >
                                  Calculated Price
                                </p>
                                <div className="flex items-center gap-1">
                                  <DollarSign
                                    className={cn(
                                      "h-3 w-3",
                                      isDarkMode
                                        ? "text-green-400"
                                        : "text-green-600"
                                    )}
                                  />
                                  <p
                                    className={cn(
                                      "text-xs font-semibold",
                                      isDarkMode ? "text-white" : "text-slate-900"
                                    )}
                                  >
                                    ₹{booking.calculatedPrice.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            )}
                          {booking.actualWeight !== null &&
                            booking.actualWeight !== undefined && (
                              <div>
                                <p
                                  className={cn(
                                    "text-[10px] font-medium mb-0.5",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  )}
                                >
                                  Actual Weight
                                </p>
                                <div className="flex items-center gap-1">
                                  <Weight
                                    className={cn(
                                      "h-2.5 w-2.5",
                                      isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                    )}
                                  />
                                  <p
                                    className={cn(
                                      "text-xs",
                                      isDarkMode ? "text-white" : "text-slate-900"
                                    )}
                                  >
                                    {booking.actualWeight} kg
                                  </p>
                                </div>
                              </div>
                            )}
                          {booking.volumetricWeight !== null &&
                            booking.volumetricWeight !== undefined && (
                              <div>
                                <p
                                  className={cn(
                                    "text-[10px] font-medium mb-0.5",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  )}
                                >
                                  Volumetric Weight
                                </p>
                                <div className="flex items-center gap-1">
                                  <Weight
                                    className={cn(
                                      "h-2.5 w-2.5",
                                      isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                    )}
                                  />
                                  <p
                                    className={cn(
                                      "text-xs",
                                      isDarkMode ? "text-white" : "text-slate-900"
                                    )}
                                  >
                                    {booking.volumetricWeight} kg
                                  </p>
                                </div>
                              </div>
                            )}
                          {booking.chargeableWeight !== null &&
                            booking.chargeableWeight !== undefined && (
                              <div>
                                <p
                                  className={cn(
                                    "text-[10px] font-medium mb-0.5",
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-500"
                                  )}
                                >
                                  Chargeable Weight
                                </p>
                                <div className="flex items-center gap-1">
                                  <Weight
                                    className={cn(
                                      "h-2.5 w-2.5",
                                      isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                    )}
                                  />
                                  <p
                                    className={cn(
                                      "text-xs",
                                      isDarkMode ? "text-white" : "text-slate-900"
                                    )}
                                  >
                                    {booking.chargeableWeight} kg
                                  </p>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Timestamps */}
                      <div className={cn(
                        "p-2",
                        isDarkMode
                          ? "bg-slate-800/20"
                          : "bg-slate-50/50"
                      )}>
                        <div className="flex flex-wrap items-center gap-2 text-[10px]">
                          <div className="flex items-center gap-1">
                            <Calendar
                              className={cn(
                                "h-3 w-3",
                                isDarkMode ? "text-slate-400" : "text-slate-500"
                              )}
                            />
                            <span
                              className={cn(
                                "font-medium",
                                isDarkMode ? "text-slate-400" : "text-slate-500"
                              )}
                            >
                              Created:
                            </span>
                            <span
                              className={cn(
                                isDarkMode ? "text-slate-300" : "text-slate-600"
                              )}
                            >
                              {formatDate(booking.createdAt)}
                            </span>
                          </div>
                          {booking.updatedAt !== booking.createdAt && (
                            <div className="flex items-center gap-1">
                              <Clock
                                className={cn(
                                  "h-3 w-3",
                                  isDarkMode ? "text-slate-400" : "text-slate-500"
                                )}
                              />
                              <span
                                className={cn(
                                  "font-medium",
                                  isDarkMode
                                    ? "text-slate-400"
                                    : "text-slate-500"
                                )}
                              >
                                Updated:
                              </span>
                              <span
                                className={cn(
                                  isDarkMode ? "text-slate-300" : "text-slate-600"
                                )}
                              >
                                {formatDate(booking.updatedAt)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Image/Document Modal Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>View Document</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative">
              {selectedImage.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={selectedImage}
                  className="w-full h-[80vh] border-0"
                  title="Document Viewer"
                />
              ) : (
                <img
                  src={selectedImage}
                  alt="Document"
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyBooking;

