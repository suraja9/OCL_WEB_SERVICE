import React, { useState, useEffect } from 'react';
import MedicineSidebar from '@/components/medicine/MedicineSidebar';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Search, 
  RefreshCw, 
  Loader2,
  Scan,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MedicineBooking {
  _id: string;
  bookingReference: string;
  consignmentNumber?: number;
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled' | 'Booked' | 'Arrived at Hub';
  origin: {
    name: string;
    mobileNumber: string;
    email: string;
    city: string;
    state: string;
  };
  destination: {
    name: string;
    mobileNumber: string;
    email: string;
    city: string;
    state: string;
  };
  shipment?: {
    chargeableWeight?: number;
    actualWeight?: string;
  };
  package?: {
    totalPackages?: string;
  };
  invoice?: {
    invoiceNumber?: string;
  };
  createdAt: string;
}

const MedicineReceivedScan: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [receivedData, setReceivedData] = useState<MedicineBooking[]>([]);
  const [showAlreadyReceivedPopup, setShowAlreadyReceivedPopup] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('medicineToken');
    const info = localStorage.getItem('medicineInfo');
    if (!token || !info) {
      navigate('/medicine');
      return;
    }
    try {
      setUser(JSON.parse(info));
    } catch {
      navigate('/medicine');
      return;
    }
    
    // Load received data from localStorage
    loadReceivedData();
  }, [navigate]);

  // Load received data from localStorage
  const loadReceivedData = () => {
    const storedReceived = localStorage.getItem('medicineReceived');
    if (storedReceived) {
      try {
        setReceivedData(JSON.parse(storedReceived));
      } catch (error) {
        console.error('Error parsing received data:', error);
        setReceivedData([]);
      }
    }
  };

  // Handle barcode scan and directly add to received
  const handleBarcodeScan = async (consignmentNumber: string) => {
    if (!consignmentNumber.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('medicineToken');
      const response = await fetch(`/api/medicine/bookings/consignment/${consignmentNumber}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          // Check if booking is already received
          if (result.data.status === 'delivered' || result.data.status === 'Arrived at Hub') {
            // Show "Already Received" popup for 2 seconds
            setShowAlreadyReceivedPopup(true);
            setTimeout(() => {
              setShowAlreadyReceivedPopup(false);
            }, 2000);
            
            // Clear the input
            setBarcodeInput('');
            return;
          }

          // Check if booking is in "Booked" status
          if (result.data.status !== 'Booked') {
            toast({
              title: "Invalid Status",
              description: `Consignment ${consignmentNumber} is not in Booked status`,
              variant: "destructive"
            });
            setBarcodeInput('');
            return;
          }
          
          // Check if consignment already exists in received
          const existsInReceived = receivedData.some(booking => booking.consignmentNumber === result.data.consignmentNumber);
          if (existsInReceived) {
            toast({
              title: "Already in Received",
              description: `Consignment ${consignmentNumber} is already marked as received`,
              variant: "destructive"
            });
            setBarcodeInput('');
            return;
          }
          
          // Update booking status to "Arrived at Hub"
          const updateResponse = await fetch(`/api/medicine/bookings/${result.data._id}/status`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'Arrived at Hub' })
          });

          if (!updateResponse.ok) {
            throw new Error('Failed to update booking status');
          }

          // Add to received data with "Arrived at Hub" status
          const booking = { ...result.data, status: 'Arrived at Hub' };
          
          // Save to localStorage
          const existingReceived = localStorage.getItem('medicineReceived');
          let receivedArray = existingReceived ? JSON.parse(existingReceived) : [];
          
          // Check if consignment already exists in localStorage
          const existsInStorage = receivedArray.some((b: MedicineBooking) => b.consignmentNumber === result.data.consignmentNumber);
          if (existsInStorage) {
            toast({
              title: "Already in Received",
              description: `Consignment ${consignmentNumber} is already marked as received`,
              variant: "destructive"
            });
            setBarcodeInput('');
            return;
          }
          
          receivedArray = [booking, ...receivedArray];
          localStorage.setItem('medicineReceived', JSON.stringify(receivedArray));
          
          // Update received data state
          setReceivedData(receivedArray);
          
          // Show success message
          toast({
            title: "Arrived at Hub",
            description: `Consignment ${consignmentNumber} marked as Arrived at Hub`,
          });
          
          // Clear the input
          setBarcodeInput('');
        } else {
          toast({
            title: "No booking found",
            description: `No booking found with consignment number ${consignmentNumber}`,
            variant: "destructive"
          });
          setBarcodeInput('');
        }
      } else if (response.status === 404) {
        toast({
          title: "No booking found",
          description: `No booking found with consignment number ${consignmentNumber}`,
          variant: "destructive"
        });
        setBarcodeInput('');
      } else {
        throw new Error('Failed to fetch booking');
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
      toast({
        title: "Error",
        description: "Failed to scan consignment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle barcode input change
  const handleBarcodeInputChange = (value: string) => {
    setBarcodeInput(value);
    // Auto-trigger scan when barcode is entered (simulating barcode scanner)
    if (value.length >= 6) {
      handleBarcodeScan(value);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate totals for received
  const calculateTotals = () => {
    return receivedData.reduce(
      (totals, booking) => {
        const weight = (booking?.shipment?.chargeableWeight as number) || parseFloat(booking?.shipment?.actualWeight || '0') || 0;
        const units = parseInt(booking?.package?.totalPackages || '0', 10) || 0;
        
        return {
          totalWeight: totals.totalWeight + weight,
          totalUnits: totals.totalUnits + units
        };
      },
      { totalWeight: 0, totalUnits: 0 }
    );
  };

  const totals = calculateTotals();

  // Clear all received data
  const handleClearAll = () => {
    setReceivedData([]);
    localStorage.removeItem('medicineReceived');
    toast({
      title: "Cleared",
      description: "All received data has been cleared",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('medicineToken');
    localStorage.removeItem('medicineInfo');
    localStorage.removeItem('medicineReceived');
    navigate('/medicine');
  };

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MedicineSidebar 
        user={user} 
        isSidebarCollapsed={isSidebarCollapsed} 
        setIsSidebarCollapsed={setIsSidebarCollapsed} 
        onLogout={handleLogout} 
      />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <main className="p-6">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Arrived at Hub Scan</h1>
            
            {/* Scanner Section */}
            <Card className="border-0 shadow-sm rounded-xl mb-6">
              <CardHeader className="px-6 py-4 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle className="text-lg font-medium text-gray-800 flex items-center gap-2">
                    <Scan className="h-5 w-5 text-blue-600" />
                    Scan Consignment
                  </CardTitle>
                  <div className="relative w-full md:w-2/5">
                    <Input
                      type="text"
                      placeholder="Scan barcode or enter consignment number"
                      value={barcodeInput}
                      onChange={(e) => handleBarcodeInputChange(e.target.value)}
                      className="text-lg py-3 px-4 border-2 border-blue-200 focus:border-blue-500 rounded-xl w-full text-center"
                      autoFocus
                      disabled={loading}
                    />
                    {loading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="max-w-2xl mx-auto text-center">
                  <p className="text-gray-600">
                    Scan consignment numbers to mark them as Arrived at Hub. Only consignments in "Booked" status can be marked as Arrived at Hub.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Already Received Popup */}
            {showAlreadyReceivedPopup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm mx-4">
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <Package className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Already Marked</h3>
                    <p className="text-gray-600">This consignment has already been marked as Arrived at Hub</p>
                  </div>
                </div>
              </div>
            )}

            {/* Received Section */}
            <Card className="border-0 shadow-sm rounded-xl">
              <CardHeader className="px-6 py-4 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle className="text-lg font-medium text-gray-800 flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    Arrived at Hub Consignments
                  </CardTitle>
                  {receivedData.length > 0 && (
                    <Button 
                      onClick={handleClearAll}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {receivedData.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-50">
                          <tr className="text-left text-xs text-gray-600">
                            <th className="px-3 py-2 border-b">Sr. No</th>
                            <th className="px-3 py-2 border-b">AWB / Docket No</th>
                            <th className="px-3 py-2 border-b">Origin</th>
                            <th className="px-3 py-2 border-b">Destination</th>
                            <th className="px-3 py-2 border-b">Units</th>
                            <th className="px-3 py-2 border-b">Weight (Kg)</th>
                            <th className="px-3 py-2 border-b">Date</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {receivedData.map((booking, idx) => {
                            const weight = (booking?.shipment?.chargeableWeight as number) || parseFloat(booking?.shipment?.actualWeight || '0') || 0;
                            const units = parseInt(booking?.package?.totalPackages || '0', 10) || 0;
                            return (
                              <tr key={booking._id} className="odd:bg-white even:bg-gray-50">
                                <td className="px-3 py-2 border-b text-gray-700">{idx + 1}</td>
                                <td className="px-3 py-2 border-b font-medium text-gray-900">{booking.consignmentNumber}</td>
                                <td className="px-3 py-2 border-b text-gray-700">{booking.origin.city}, {booking.origin.state}</td>
                                <td className="px-3 py-2 border-b text-gray-700">{booking.destination.city}, {booking.destination.state}</td>
                                <td className="px-3 py-2 border-b text-gray-700">{units || '-'}</td>
                                <td className="px-3 py-2 border-b text-gray-700">{weight ? weight.toFixed(2) : '-'}</td>
                                <td className="px-3 py-2 border-b text-gray-700">{formatDate(booking.createdAt)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-100 text-sm">
                            <td className="px-3 py-2 border-t font-semibold" colSpan={4}>Total</td>
                            <td className="px-3 py-2 border-t font-semibold">{totals.totalUnits}</td>
                            <td className="px-3 py-2 border-t font-semibold">{totals.totalWeight.toFixed(2)}</td>
                            <td className="px-3 py-2 border-t"></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="p-12 text-center">
                    <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                      <Package className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Arrived at Hub Consignments</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      No consignments have been marked as Arrived at Hub yet. Scan consignment numbers above to mark them as Arrived at Hub.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MedicineReceivedScan;