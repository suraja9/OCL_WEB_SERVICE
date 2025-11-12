import React, { useState, useEffect, useCallback } from 'react';
import { Tag, Calculator, TrendingUp, Package, Plane, Truck, Train, Save, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';1
import { makePermissionAwareRequest } from '@/utils/apiUtils';

type LocationRates = {
  assam: string;
  neBySurface: string;
  neByAirAgtImp: string;
  restOfIndia: string;
};

type DoxPricingState = {
  '01gm-250gm': LocationRates;
  '251gm-500gm': LocationRates;
  add500gm: LocationRates;
};

type PriorityPricingState = {
  '01gm-500gm': LocationRates;
  add500gm: LocationRates;
};

type ReverseDeliveryRates = {
  normal: string;
  priority: string;
};

type ReverseTransportRates = {
  byRoad: ReverseDeliveryRates;
  byTrain: ReverseDeliveryRates;
  byFlight: ReverseDeliveryRates;
};

type ReversePricingState = {
  toAssam: ReverseTransportRates;
  toNorthEast: ReverseTransportRates;
};

type NumericLocationRates = {
  assam: number;
  neBySurface: number;
  neByAirAgtImp: number;
  restOfIndia: number;
};

type ReverseDeliveryNumericRates = {
  normal: number;
  priority: number;
};

type ReverseTransportNumericRates = {
  byRoad: ReverseDeliveryNumericRates;
  byTrain: ReverseDeliveryNumericRates;
  byFlight: ReverseDeliveryNumericRates;
};

type DoxPricingResponse = {
  '01gm-250gm': NumericLocationRates;
  '251gm-500gm': NumericLocationRates;
  add500gm: NumericLocationRates;
};

type PriorityPricingResponse = {
  '01gm-500gm': NumericLocationRates;
  add500gm: NumericLocationRates;
};

type ReversePricingResponse = {
  toAssam: ReverseTransportNumericRates;
  toNorthEast: ReverseTransportNumericRates;
};

interface CustomerPricingApiResponse {
  doxPricing: DoxPricingResponse;
  nonDoxSurfacePricing: NumericLocationRates;
  nonDoxAirPricing: NumericLocationRates;
  priorityPricing: PriorityPricingResponse;
  reversePricing: ReversePricingResponse;
  notes?: string;
  lastUpdatedAt?: string;
  updatedAt?: string;
  lastUpdatedBy?: {
    name?: string;
    email?: string;
  } | string | null;
}

const createLocationRates = (fillValue = ''): LocationRates => ({
  assam: fillValue,
  neBySurface: fillValue,
  neByAirAgtImp: fillValue,
  restOfIndia: fillValue
});

const createDoxPricingState = (fillValue = ''): DoxPricingState => ({
  '01gm-250gm': createLocationRates(fillValue),
  '251gm-500gm': createLocationRates(fillValue),
  add500gm: createLocationRates(fillValue)
});

const createPriorityPricingState = (fillValue = ''): PriorityPricingState => ({
  '01gm-500gm': createLocationRates(fillValue),
  add500gm: createLocationRates(fillValue)
});

const createReverseDeliveryRates = (fillValue = ''): ReverseDeliveryRates => ({
  normal: fillValue,
  priority: fillValue
});

const createReverseTransportRates = (fillValue = ''): ReverseTransportRates => ({
  byRoad: createReverseDeliveryRates(fillValue),
  byTrain: createReverseDeliveryRates(fillValue),
  byFlight: createReverseDeliveryRates(fillValue)
});

const createReversePricingState = (fillValue = ''): ReversePricingState => ({
  toAssam: createReverseTransportRates(fillValue),
  toNorthEast: createReverseTransportRates(fillValue)
});

const formatNumberValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return '';
  }

  return numeric.toFixed(2);
};

const mapLocationRatesToState = (source?: NumericLocationRates): LocationRates => ({
  assam: formatNumberValue(source?.assam),
  neBySurface: formatNumberValue(source?.neBySurface),
  neByAirAgtImp: formatNumberValue(source?.neByAirAgtImp),
  restOfIndia: formatNumberValue(source?.restOfIndia)
});

const mapReverseDeliveryRatesToState = (source?: ReverseDeliveryNumericRates): ReverseDeliveryRates => ({
  normal: formatNumberValue(source?.normal),
  priority: formatNumberValue(source?.priority)
});

const mapReverseTransportRatesToState = (source?: ReverseTransportNumericRates): ReverseTransportRates => ({
  byRoad: mapReverseDeliveryRatesToState(source?.byRoad),
  byTrain: mapReverseDeliveryRatesToState(source?.byTrain),
  byFlight: mapReverseDeliveryRatesToState(source?.byFlight)
});

const mapCustomerPricingResponseToState = (data: CustomerPricingApiResponse) => ({
  doxPricing: {
    '01gm-250gm': mapLocationRatesToState(data.doxPricing?.['01gm-250gm']),
    '251gm-500gm': mapLocationRatesToState(data.doxPricing?.['251gm-500gm']),
    add500gm: mapLocationRatesToState(data.doxPricing?.add500gm)
  } as DoxPricingState,
  nonDoxSurfacePricing: mapLocationRatesToState(data.nonDoxSurfacePricing),
  nonDoxAirPricing: mapLocationRatesToState(data.nonDoxAirPricing),
  priorityPricing: {
    '01gm-500gm': mapLocationRatesToState(data.priorityPricing?.['01gm-500gm']),
    add500gm: mapLocationRatesToState(data.priorityPricing?.add500gm)
  } as PriorityPricingState,
  reversePricing: {
    toAssam: mapReverseTransportRatesToState(data.reversePricing?.toAssam),
    toNorthEast: mapReverseTransportRatesToState(data.reversePricing?.toNorthEast)
  } as ReversePricingState
});

const parsePriceValue = (value: string): number => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.round(numeric * 100) / 100;
};

const mapLocationRatesToPayload = (state: LocationRates): NumericLocationRates => ({
  assam: parsePriceValue(state.assam),
  neBySurface: parsePriceValue(state.neBySurface),
  neByAirAgtImp: parsePriceValue(state.neByAirAgtImp),
  restOfIndia: parsePriceValue(state.restOfIndia)
});

const mapReverseDeliveryRatesToPayload = (state: ReverseDeliveryRates): ReverseDeliveryNumericRates => ({
  normal: parsePriceValue(state.normal),
  priority: parsePriceValue(state.priority)
});

const mapReverseTransportRatesToPayload = (state: ReverseTransportRates): ReverseTransportNumericRates => ({
  byRoad: mapReverseDeliveryRatesToPayload(state.byRoad),
  byTrain: mapReverseDeliveryRatesToPayload(state.byTrain),
  byFlight: mapReverseDeliveryRatesToPayload(state.byFlight)
});

const buildCustomerPricingPayload = (
  doxPricing: DoxPricingState,
  nonDoxSurfacePricing: LocationRates,
  nonDoxAirPricing: LocationRates,
  priorityPricing: PriorityPricingState,
  reversePricing: ReversePricingState
): CustomerPricingApiResponse => ({
  doxPricing: {
    '01gm-250gm': mapLocationRatesToPayload(doxPricing['01gm-250gm']),
    '251gm-500gm': mapLocationRatesToPayload(doxPricing['251gm-500gm']),
    add500gm: mapLocationRatesToPayload(doxPricing.add500gm)
  },
  nonDoxSurfacePricing: mapLocationRatesToPayload(nonDoxSurfacePricing),
  nonDoxAirPricing: mapLocationRatesToPayload(nonDoxAirPricing),
  priorityPricing: {
    '01gm-500gm': mapLocationRatesToPayload(priorityPricing['01gm-500gm']),
    add500gm: mapLocationRatesToPayload(priorityPricing.add500gm)
  },
  reversePricing: {
    toAssam: mapReverseTransportRatesToPayload(reversePricing.toAssam),
    toNorthEast: mapReverseTransportRatesToPayload(reversePricing.toNorthEast)
  }
});

const CustomerPricing = () => {
  const { toast } = useToast();
  
  // State for Standard Service - DOX pricing
  const [doxPricing, setDoxPricing] = useState<DoxPricingState>(() => createDoxPricingState());

  // State for NON DOX Surface pricing
  const [nonDoxSurfacePricing, setNonDoxSurfacePricing] = useState<LocationRates>(() => createLocationRates());

  // State for NON DOX Air pricing
  const [nonDoxAirPricing, setNonDoxAirPricing] = useState<LocationRates>(() => createLocationRates());

  // State for Priority Service - DOX pricing
  const [priorityPricing, setPriorityPricing] = useState<PriorityPricingState>(() => createPriorityPricingState());

  // State for Reverse Pricing (From Rest of India to Guwahati/Assam and North East)
  const [reversePricing, setReversePricing] = useState<ReversePricingState>(() => createReversePricingState());

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [metadata, setMetadata] = useState<{ updatedAt: string | null; updatedBy: string | null }>({
    updatedAt: null,
    updatedBy: null
  });

  const loadCustomerPricing = useCallback(async ({ initial = false } = {}) => {
    if (initial) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const response = await makePermissionAwareRequest<CustomerPricingApiResponse>('/admin/customer-pricing');

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch customer pricing data');
      }

      const formatted = mapCustomerPricingResponseToState(response.data);
      setDoxPricing(formatted.doxPricing);
      setNonDoxSurfacePricing(formatted.nonDoxSurfacePricing);
      setNonDoxAirPricing(formatted.nonDoxAirPricing);
      setPriorityPricing(formatted.priorityPricing);
      setReversePricing(formatted.reversePricing);
      setIsDirty(false);

      const updatedAt = response.data.lastUpdatedAt || response.data.updatedAt || null;
      const updatedBy =
        typeof response.data.lastUpdatedBy === 'string'
          ? response.data.lastUpdatedBy
          : response.data.lastUpdatedBy?.name || null;

      setMetadata({
        updatedAt,
        updatedBy
      });
    } catch (error) {
      console.error('Failed to load customer pricing:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to load customer pricing data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      if (initial) {
        setIsLoading(false);
      }
      setIsRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    loadCustomerPricing({ initial: true });
  }, [loadCustomerPricing]);

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) {
      return 'Never';
    }

    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  const handleSave = useCallback(async () => {
    if (isSaving || !isDirty) {
      return;
    }

    setIsSaving(true);
    try {
      const payload = buildCustomerPricingPayload(
        doxPricing,
        nonDoxSurfacePricing,
        nonDoxAirPricing,
        priorityPricing,
        reversePricing
      );

      const response = await makePermissionAwareRequest<CustomerPricingApiResponse>('/admin/customer-pricing', {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to save customer pricing');
      }

      const formatted = mapCustomerPricingResponseToState(response.data);
      setDoxPricing(formatted.doxPricing);
      setNonDoxSurfacePricing(formatted.nonDoxSurfacePricing);
      setNonDoxAirPricing(formatted.nonDoxAirPricing);
      setPriorityPricing(formatted.priorityPricing);
      setReversePricing(formatted.reversePricing);
      setIsDirty(false);

      const updatedAt = response.data.lastUpdatedAt || response.data.updatedAt || null;
      const updatedBy =
        typeof response.data.lastUpdatedBy === 'string'
          ? response.data.lastUpdatedBy
          : response.data.lastUpdatedBy?.name || null;

      setMetadata({
        updatedAt,
        updatedBy
      });

      toast({
        title: 'Customer pricing updated',
        description: 'All changes have been saved successfully.'
      });
    } catch (error) {
      console.error('Failed to save customer pricing:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to save customer pricing. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  }, [doxPricing, nonDoxSurfacePricing, nonDoxAirPricing, priorityPricing, reversePricing, isDirty, isSaving, toast]);

  const handleRefresh = useCallback(() => {
    if (isSaving) {
      return;
    }
    loadCustomerPricing();
  }, [isSaving, loadCustomerPricing]);

  // Testing section state
  const [testInputs, setTestInputs] = useState({
    fromPincode: '',
    destinationPincode: '',
    weight: '',
    type: 'dox', // 'dox' or 'non-dox'
    byAir: false,
    priority: false,
    transportMode: 'byRoad', // 'byRoad', 'byTrain', 'byFlight' for reverse pricing
    deliveryType: 'normal' // 'normal' or 'priority' for reverse pricing
  });

  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);

  // Format price input to show .00 at the end
  const formatPriceInput = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    return numValue.toFixed(2);
  };

  // Handle price input change
  const handlePriceChange = (value, setter, path) => {
    // Allow empty string or valid numbers
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setter(prev => {
        const newState = { ...prev };
        const keys = path.split('.');
        let current = newState;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return newState;
      });
      setIsDirty(true);
    }
  };

  // Handle price input blur (format on complete)
  const handlePriceBlur = (value, setter, path) => {
    const formatted = formatPriceInput(value);
    setter(prev => {
      const newState = { ...prev };
      const keys = path.split('.');
      let current = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = formatted;
      return newState;
    });
    if (formatted !== value) {
      setIsDirty(true);
    }
  };

  // Check if pincode is in Assam
  const isAssamPincode = (pincode) => {
    const pin = parseInt(pincode);
    return (pin >= 781000 && pin <= 781999) || 
           (pin >= 782000 && pin <= 782999) || 
           (pin >= 783000 && pin <= 783999) || 
           (pin >= 784000 && pin <= 784999) || 
           (pin >= 785000 && pin <= 785999) || 
           (pin >= 786000 && pin <= 786999) || 
           (pin >= 787000 && pin <= 787999) || 
           (pin >= 788000 && pin <= 788999);
  };

  // Check if pincode is in North East (excluding Assam)
  const isNorthEastPincode = (pincode) => {
    const pin = parseInt(pincode);
    return (pin >= 790000 && pin <= 791999) || // Arunachal Pradesh
           (pin >= 793000 && pin <= 793999) || // Meghalaya
           (pin >= 795000 && pin <= 795999) || // Manipur
           (pin >= 796000 && pin <= 796999) || // Mizoram
           (pin >= 797000 && pin <= 797999) || // Nagaland
           (pin >= 737000 && pin <= 737999) || // Sikkim
           (pin >= 799000 && pin <= 799999);   // Tripura
  };

  // Location classification logic
  const classifyLocation = (pincode, isAirRoute = false) => {
    const pin = parseInt(pincode);
    
    // Assam pincodes
    if ((pin >= 781000 && pin <= 781999) || 
        (pin >= 782000 && pin <= 782999) || 
        (pin >= 783000 && pin <= 783999) || 
        (pin >= 784000 && pin <= 784999) || 
        (pin >= 785000 && pin <= 785999) || 
        (pin >= 786000 && pin <= 786999) || 
        (pin >= 787000 && pin <= 787999) || 
        (pin >= 788000 && pin <= 788999)) {
      return 'assam';
    }
    
    // Kolkata pincodes (700xxx)
    if (pin >= 700000 && pin <= 700999) {
      return 'kol';
    }
    
    // Tripura (799xxx) and Manipur (795xxx) - AGT IMP only for air routes
    if (isAirRoute && ((pin >= 799000 && pin <= 799999) || (pin >= 795000 && pin <= 795999))) {
      return 'neByAirAgtImp';
    }
    
    // Tripura (799xxx) and Manipur (795xxx) - Surface route
    if (!isAirRoute && ((pin >= 799000 && pin <= 799999) || (pin >= 795000 && pin <= 795999))) {
      return 'neBySurface';
    }
    
    // Other NE states
    if ((pin >= 790000 && pin <= 791999) || 
        (pin >= 793000 && pin <= 793999) || 
        (pin >= 796000 && pin <= 796999) || 
        (pin >= 797000 && pin <= 797999) || 
        (pin >= 737000 && pin <= 737999)) {
      return 'neBySurface';
    }
    
    // Rest of India
    return 'restOfIndia';
  };

  // Price calculation logic
  const calculatePrice = () => {
    if (!testInputs.destinationPincode || !testInputs.weight) {
      toast({
        title: "Error",
        description: "Please enter destination pincode and weight",
        variant: "destructive"
      });
      return;
    }

    const weight = parseFloat(testInputs.weight);
    let price = 0;
    let serviceType = testInputs.type.toUpperCase();
    let location = '';
    let transportMode = '';
    let chargeableWeight = weight;
    let isMinimumWeightApplied = false;

    // Check if this is reverse pricing (from pincode provided and destination is Assam/North East)
    if (testInputs.fromPincode && testInputs.type === 'non-dox') {
      // Reverse pricing logic
      const minChargeableWeights = {
        byRoad: 500,
        byTrain: 100,
        byFlight: 25
      };
      
      chargeableWeight = Math.max(weight, minChargeableWeights[testInputs.transportMode]);
      isMinimumWeightApplied = chargeableWeight > weight;

      if (isAssamPincode(testInputs.destinationPincode)) {
        location = 'Assam';
        const pricePerKg = parseFloat(reversePricing.toAssam[testInputs.transportMode][testInputs.deliveryType]) || 0;
        price = pricePerKg * chargeableWeight;
        transportMode = testInputs.transportMode;
      } else if (isNorthEastPincode(testInputs.destinationPincode)) {
        location = 'North East';
        const pricePerKg = parseFloat(reversePricing.toNorthEast[testInputs.transportMode][testInputs.deliveryType]) || 0;
        price = pricePerKg * chargeableWeight;
        transportMode = testInputs.transportMode;
      } else {
        toast({
          title: "Error",
          description: "Reverse pricing is only available for Assam and North East destinations",
          variant: "destructive"
        });
        return;
      }
    } else {
      // Normal pricing logic
      location = classifyLocation(testInputs.destinationPincode, testInputs.byAir);
    
      if (testInputs.type === 'dox') {
        // DOX pricing logic
        if (testInputs.priority) {
          // Priority Service pricing
          if (weight <= 500) {
            price = parseFloat(priorityPricing['01gm-500gm'][location]) || 0;
          } else {
            const basePrice = parseFloat(priorityPricing['01gm-500gm'][location]) || 0;
            const additionalWeight = Math.ceil((weight - 500) / 500);
            const additionalPrice = parseFloat(priorityPricing.add500gm[location]) || 0;
            price = basePrice + (additionalWeight * additionalPrice);
          }
        } else {
          // Standard Service pricing
          if (weight <= 250) {
            price = parseFloat(doxPricing['01gm-250gm'][location]) || 0;
          } else if (weight <= 500) {
            price = parseFloat(doxPricing['251gm-500gm'][location]) || 0;
          } else {
            const basePrice = parseFloat(doxPricing['251gm-500gm'][location]) || 0;
            const additionalWeight = Math.ceil((weight - 500) / 500);
            const additionalPrice = parseFloat(doxPricing.add500gm[location]) || 0;
            price = basePrice + (additionalWeight * additionalPrice);
          }
        }
      } else {
        // NON-DOX pricing logic (per kg)
        if (testInputs.byAir) {
          const pricePerKg = parseFloat(nonDoxAirPricing[location]) || 0;
          price = pricePerKg * weight;
        } else {
          const pricePerKg = parseFloat(nonDoxSurfacePricing[location]) || 0;
          price = pricePerKg * weight;
        }
      }
    }
    
    setCalculatedPrice(price);
    
    if (testInputs.priority) serviceType += ' (Priority)';
    if (testInputs.byAir) serviceType += ' (By Air)';
    if (transportMode) serviceType += ` (${transportMode})`;
    
    const fromText = testInputs.fromPincode ? ` from ${testInputs.fromPincode}` : '';
    const weightText = isMinimumWeightApplied ? ` (charged for ${chargeableWeight}kg)` : '';
    toast({
      title: "Price Calculated",
      description: `Calculated price: ₹${price.toFixed(2)} for ${serviceType}${fromText} to ${location}${weightText}`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading customer pricing...</span>
        </div>
      </div>
    );
  }

  const lastUpdatedDisplay = formatTimestamp(metadata.updatedAt);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-indigo-50 p-3">
              <Tag className="h-7 w-7 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Customer Pricing Management</h1>
              <p className="mt-1 text-sm text-gray-500">Manage customer pricing plans and rates</p>
            </div>
          </div>
          <div className="flex w-full flex-col items-end gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <div className="text-xs text-gray-500 sm:text-right">
              <p>
                <span className="font-medium text-gray-600">Last updated:</span>{' '}
                <span className="text-gray-900">{lastUpdatedDisplay}</span>
              </p>
              {metadata.updatedBy && (
                <p className="mt-1">
                  <span className="font-medium text-gray-600">Updated by:</span>{' '}
                  <span className="text-gray-900">{metadata.updatedBy}</span>
                </p>
              )}
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isSaving || isRefreshing || isDirty}
                className="flex items-center gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </Button>
              <Button
                onClick={handleSave}
                disabled={!isDirty || isSaving}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving ? 'Saving...' : isDirty ? 'Save Changes' : 'Saved'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCalculator(!showCalculator)}
                className="flex items-center gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                <Calculator className="h-4 w-4" />
                {showCalculator ? 'Hide' : 'Show'} Calculator
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Price Calculator Section */}
      {showCalculator && (
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-200 py-4">
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Calculator className="h-6 w-6 text-purple-600" />
              Price Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Test Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromPincode" className="text-sm font-medium">From Pincode (Optional)</Label>
                  <Input
                    id="fromPincode"
                    value={testInputs.fromPincode}
                    onChange={(e) => setTestInputs({
                      ...testInputs,
                      fromPincode: e.target.value,
                      type: e.target.value ? 'non-dox' : 'dox',
                      weight: ''
                    })}
                    placeholder="e.g., 110001"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">Leave empty for normal pricing</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destinationPincode" className="text-sm font-medium">Destination Pincode</Label>
                  <Input
                    id="destinationPincode"
                    value={testInputs.destinationPincode}
                    onChange={(e) => setTestInputs({
                      ...testInputs,
                      destinationPincode: e.target.value
                    })}
                    placeholder="e.g., 781001"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm font-medium">
                    Weight ({testInputs.fromPincode ? 'Kg.' : (testInputs.type === 'dox' ? 'grams' : 'Kg.')})
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step={testInputs.fromPincode ? "0.01" : (testInputs.type === 'dox' ? "0.1" : "0.01")}
                    value={testInputs.weight}
                    onChange={(e) => setTestInputs({
                      ...testInputs,
                      weight: e.target.value
                    })}
                    placeholder={testInputs.fromPincode ? "e.g., 25" : (testInputs.type === 'dox' ? "e.g., 250" : "e.g., 1.5")}
                    className="w-full"
                  />
                </div>
                {!testInputs.fromPincode && (
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm font-medium">Type</Label>
                    <Select
                      value={testInputs.type}
                      onValueChange={(value) => setTestInputs({
                        ...testInputs,
                        type: value,
                        weight: ''
                      })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dox">DOX (Documents)</SelectItem>
                        <SelectItem value="non-dox">NON-DOX (Non-Documents)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {testInputs.fromPincode && (
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm font-medium">Type</Label>
                    <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-600">
                      NON-DOX (Reverse pricing only)
                    </div>
                  </div>
                )}
              </div>

              {/* Service Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="byAir"
                    checked={testInputs.byAir}
                    onChange={(e) => setTestInputs({
                      ...testInputs,
                      byAir: e.target.checked
                    })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    disabled={testInputs.fromPincode && testInputs.type === 'non-dox'}
                  />
                  <Label htmlFor="byAir" className="text-sm font-medium">
                    By Air {testInputs.fromPincode && testInputs.type === 'non-dox' && '(Use Transport Mode below)'}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="priority"
                    checked={testInputs.priority}
                    onChange={(e) => setTestInputs({
                      ...testInputs,
                      priority: e.target.checked
                    })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    disabled={testInputs.type === 'non-dox'}
                  />
                  <Label htmlFor="priority" className="text-sm font-medium">
                    Priority {testInputs.type === 'non-dox' && '(DOX only)'}
                  </Label>
                </div>
                {testInputs.fromPincode && testInputs.type === 'non-dox' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="transportMode" className="text-sm font-medium">Transport Mode</Label>
                      <Select
                        value={testInputs.transportMode || 'byRoad'}
                        onValueChange={(value) => setTestInputs({
                          ...testInputs,
                          transportMode: value
                        })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select transport mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="byRoad">By Road (Min. 500kg)</SelectItem>
                          <SelectItem value="byTrain">By Train (Min. 100kg)</SelectItem>
                          <SelectItem value="byFlight">By Flight (Min. 25kg)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryType" className="text-sm font-medium">Delivery Type</Label>
                      <Select
                        value={testInputs.deliveryType || 'normal'}
                        onValueChange={(value) => setTestInputs({
                          ...testInputs,
                          deliveryType: value
                        })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select delivery type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal Delivery</SelectItem>
                          <SelectItem value="priority">Priority Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>

              {/* Calculate Button */}
              <div className="flex justify-center">
                <Button 
                  onClick={calculatePrice}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-2 shadow-lg"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Price
                </Button>
              </div>

              {/* Results */}
              {calculatedPrice !== null && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Calculation Results
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {testInputs.fromPincode && (
                      <div className="bg-white/60 rounded-lg p-3">
                        <span className="font-semibold text-gray-700">From:</span> <span className="text-gray-900">{testInputs.fromPincode}</span>
                      </div>
                    )}
                    <div className="bg-white/60 rounded-lg p-3">
                      <span className="font-semibold text-gray-700">To:</span> <span className="text-gray-900">{testInputs.destinationPincode}</span>
                      {!testInputs.fromPincode && ` (${classifyLocation(testInputs.destinationPincode, testInputs.byAir)})`}
                    </div>
                    <div className="bg-white/60 rounded-lg p-3">
                      <span className="font-semibold text-gray-700">Type:</span> <span className="text-gray-900">{testInputs.type.toUpperCase()}</span>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3">
                      <span className="font-semibold text-gray-700">Weight:</span> <span className="text-gray-900">{testInputs.weight} {testInputs.fromPincode ? 'Kg.' : (testInputs.type === 'dox' ? 'grams' : 'Kg.')}</span>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3">
                      <span className="font-semibold text-gray-700">Service:</span> 
                      <span className="text-gray-900">
                        {testInputs.priority ? ' Priority' : ''}
                        {testInputs.byAir ? ' By Air' : ''}
                        {testInputs.transportMode && testInputs.fromPincode && testInputs.type === 'non-dox' ? ` ${testInputs.transportMode}` : ''}
                        {testInputs.deliveryType && testInputs.fromPincode && testInputs.type === 'non-dox' ? ` (${testInputs.deliveryType} delivery)` : ''}
                        {!testInputs.priority && !testInputs.byAir && !testInputs.transportMode ? ' Standard' : ''}
                      </span>
                    </div>
                    <div className="md:col-span-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border-2 border-green-300">
                      <span className="font-bold text-gray-800 text-base">Calculated Price:</span> 
                      <span className="text-green-700 font-bold text-2xl ml-3">₹{calculatedPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 1: Standard Service - DOX */}
      <Card className="border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-200 py-4">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-600" />
            Standard Service - DOX
          </CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">By Air & Surface</Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">Upto 1 Kg</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-blue-100 to-cyan-100 border-b-2 border-blue-200">
                  <TableHead className="font-bold text-gray-800 text-sm py-3">Weight</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3">Assam</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3">NE By Surface</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3">NE By Air AGT IMP</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3">Rest of India</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-gray-100 hover:bg-blue-50/50">
                  <TableCell className="font-semibold text-sm py-3">01 gm. to 250 gm.</TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={doxPricing['01gm-250gm'].assam}
                      onChange={(e) => handlePriceChange(e.target.value, setDoxPricing, '01gm-250gm.assam')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setDoxPricing, '01gm-250gm.assam')}
                      className="w-24 h-9 text-xs text-right border-blue-200 focus:border-blue-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={doxPricing['01gm-250gm'].neBySurface}
                      onChange={(e) => handlePriceChange(e.target.value, setDoxPricing, '01gm-250gm.neBySurface')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setDoxPricing, '01gm-250gm.neBySurface')}
                      className="w-24 h-9 text-xs text-right border-blue-200 focus:border-blue-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={doxPricing['01gm-250gm'].neByAirAgtImp}
                      onChange={(e) => handlePriceChange(e.target.value, setDoxPricing, '01gm-250gm.neByAirAgtImp')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setDoxPricing, '01gm-250gm.neByAirAgtImp')}
                      className="w-24 h-9 text-xs text-right border-blue-200 focus:border-blue-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={doxPricing['01gm-250gm'].restOfIndia}
                      onChange={(e) => handlePriceChange(e.target.value, setDoxPricing, '01gm-250gm.restOfIndia')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setDoxPricing, '01gm-250gm.restOfIndia')}
                      className="w-24 h-9 text-xs text-right border-blue-200 focus:border-blue-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-100 hover:bg-blue-50/50">
                  <TableCell className="font-semibold text-sm py-3">251 gm. to 500 gm.</TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={doxPricing['251gm-500gm'].assam}
                      onChange={(e) => handlePriceChange(e.target.value, setDoxPricing, '251gm-500gm.assam')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setDoxPricing, '251gm-500gm.assam')}
                      className="w-24 h-9 text-xs text-right border-blue-200 focus:border-blue-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={doxPricing['251gm-500gm'].neBySurface}
                      onChange={(e) => handlePriceChange(e.target.value, setDoxPricing, '251gm-500gm.neBySurface')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setDoxPricing, '251gm-500gm.neBySurface')}
                      className="w-24 h-9 text-xs text-right border-blue-200 focus:border-blue-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={doxPricing['251gm-500gm'].neByAirAgtImp}
                      onChange={(e) => handlePriceChange(e.target.value, setDoxPricing, '251gm-500gm.neByAirAgtImp')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setDoxPricing, '251gm-500gm.neByAirAgtImp')}
                      className="w-24 h-9 text-xs text-right border-blue-200 focus:border-blue-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={doxPricing['251gm-500gm'].restOfIndia}
                      onChange={(e) => handlePriceChange(e.target.value, setDoxPricing, '251gm-500gm.restOfIndia')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setDoxPricing, '251gm-500gm.restOfIndia')}
                      className="w-24 h-9 text-xs text-right border-blue-200 focus:border-blue-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-blue-50/50">
                  <TableCell className="font-semibold text-sm py-3">Add. 500 gm.</TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={doxPricing.add500gm.assam}
                      onChange={(e) => handlePriceChange(e.target.value, setDoxPricing, 'add500gm.assam')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setDoxPricing, 'add500gm.assam')}
                      className="w-24 h-9 text-xs text-right border-blue-200 focus:border-blue-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={doxPricing.add500gm.neBySurface}
                      onChange={(e) => handlePriceChange(e.target.value, setDoxPricing, 'add500gm.neBySurface')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setDoxPricing, 'add500gm.neBySurface')}
                      className="w-24 h-9 text-xs text-right border-blue-200 focus:border-blue-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={doxPricing.add500gm.neByAirAgtImp}
                      onChange={(e) => handlePriceChange(e.target.value, setDoxPricing, 'add500gm.neByAirAgtImp')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setDoxPricing, 'add500gm.neByAirAgtImp')}
                      className="w-24 h-9 text-xs text-right border-blue-200 focus:border-blue-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={doxPricing.add500gm.restOfIndia}
                      onChange={(e) => handlePriceChange(e.target.value, setDoxPricing, 'add500gm.restOfIndia')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setDoxPricing, 'add500gm.restOfIndia')}
                      className="w-24 h-9 text-xs text-right border-blue-200 focus:border-blue-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 border-t-2 border-blue-200">
            <p className="text-xs text-gray-600 font-medium">
              Above price is excluding of Other Charge and GST 18%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: NON DOX Surface */}
      <Card className="border-2 border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-200 py-4">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Truck className="h-6 w-6 text-orange-600" />
            NON DOX (By Surface) Upto 1 Kg
          </CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">Per Kg Rate</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-orange-100 to-amber-100 border-b-2 border-orange-200">
                  <TableHead className="font-bold text-gray-800 text-sm py-3">Weight</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3">Assam</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3">NE By Surface</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3">NE By Air AGT IMP</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3">Rest of India</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-orange-50/50">
                  <TableCell className="font-semibold text-sm py-3">Per Kg.</TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={nonDoxSurfacePricing.assam}
                      onChange={(e) => handlePriceChange(e.target.value, setNonDoxSurfacePricing, 'assam')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setNonDoxSurfacePricing, 'assam')}
                      className="w-24 h-9 text-xs text-right border-orange-200 focus:border-orange-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={nonDoxSurfacePricing.neBySurface}
                      onChange={(e) => handlePriceChange(e.target.value, setNonDoxSurfacePricing, 'neBySurface')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setNonDoxSurfacePricing, 'neBySurface')}
                      className="w-24 h-9 text-xs text-right border-orange-200 focus:border-orange-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={nonDoxSurfacePricing.neByAirAgtImp}
                      onChange={(e) => handlePriceChange(e.target.value, setNonDoxSurfacePricing, 'neByAirAgtImp')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setNonDoxSurfacePricing, 'neByAirAgtImp')}
                      className="w-24 h-9 text-xs text-right border-orange-200 focus:border-orange-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={nonDoxSurfacePricing.restOfIndia}
                      onChange={(e) => handlePriceChange(e.target.value, setNonDoxSurfacePricing, 'restOfIndia')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setNonDoxSurfacePricing, 'restOfIndia')}
                      className="w-24 h-9 text-xs text-right border-orange-200 focus:border-orange-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: NON DOX Air */}
      <Card className="border-2 border-sky-200 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50 border-b-2 border-sky-200 py-4">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Plane className="h-6 w-6 text-sky-600" />
            NON DOX (By Air) Upto 1 Kg
          </CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-sky-100 text-sky-700">Per Kg Rate</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-sky-100 to-blue-100 border-b-2 border-sky-200">
                  <TableHead className="font-bold text-gray-800 text-sm py-3">Weight</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3">Assam</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3">NE By Surface</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3">NE By Air AGT IMP</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3">Rest of India</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-sky-50/50">
                  <TableCell className="font-semibold text-sm py-3">Per Kg.</TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={nonDoxAirPricing.assam}
                      onChange={(e) => handlePriceChange(e.target.value, setNonDoxAirPricing, 'assam')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setNonDoxAirPricing, 'assam')}
                      className="w-24 h-9 text-xs text-right border-sky-200 focus:border-sky-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={nonDoxAirPricing.neBySurface}
                      onChange={(e) => handlePriceChange(e.target.value, setNonDoxAirPricing, 'neBySurface')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setNonDoxAirPricing, 'neBySurface')}
                      className="w-24 h-9 text-xs text-right border-sky-200 focus:border-sky-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={nonDoxAirPricing.neByAirAgtImp}
                      onChange={(e) => handlePriceChange(e.target.value, setNonDoxAirPricing, 'neByAirAgtImp')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setNonDoxAirPricing, 'neByAirAgtImp')}
                      className="w-24 h-9 text-xs text-right border-sky-200 focus:border-sky-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={nonDoxAirPricing.restOfIndia}
                      onChange={(e) => handlePriceChange(e.target.value, setNonDoxAirPricing, 'restOfIndia')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setNonDoxAirPricing, 'restOfIndia')}
                      className="w-24 h-9 text-xs text-right border-sky-200 focus:border-sky-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Priority Service */}
      <Card className="border-2 border-pink-200 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 border-b-2 border-pink-200 py-4">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-pink-600" />
            Priority Service - DOX
          </CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-pink-100 text-pink-700">By Air & Surface</Badge>
            <Badge variant="secondary" className="bg-pink-100 text-pink-700">Upto 1 Kg</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-pink-100 to-rose-100 border-b-2 border-pink-200">
                  <TableHead className="font-bold text-gray-800 text-sm py-3">Weight</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3">Assam</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3">NE By Surface</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3">NE By Air AGT IMP</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3">Rest of India</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-gray-100 hover:bg-pink-50/50">
                  <TableCell className="font-semibold text-sm py-3">01 gm. to 500 gm.</TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={priorityPricing['01gm-500gm'].assam}
                      onChange={(e) => handlePriceChange(e.target.value, setPriorityPricing, '01gm-500gm.assam')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setPriorityPricing, '01gm-500gm.assam')}
                      className="w-24 h-9 text-xs text-right border-pink-200 focus:border-pink-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={priorityPricing['01gm-500gm'].neBySurface}
                      onChange={(e) => handlePriceChange(e.target.value, setPriorityPricing, '01gm-500gm.neBySurface')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setPriorityPricing, '01gm-500gm.neBySurface')}
                      className="w-24 h-9 text-xs text-right border-pink-200 focus:border-pink-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={priorityPricing['01gm-500gm'].neByAirAgtImp}
                      onChange={(e) => handlePriceChange(e.target.value, setPriorityPricing, '01gm-500gm.neByAirAgtImp')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setPriorityPricing, '01gm-500gm.neByAirAgtImp')}
                      className="w-24 h-9 text-xs text-right border-pink-200 focus:border-pink-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={priorityPricing['01gm-500gm'].restOfIndia}
                      onChange={(e) => handlePriceChange(e.target.value, setPriorityPricing, '01gm-500gm.restOfIndia')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setPriorityPricing, '01gm-500gm.restOfIndia')}
                      className="w-24 h-9 text-xs text-right border-pink-200 focus:border-pink-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-pink-50/50">
                  <TableCell className="font-semibold text-sm py-3">Every Add, 500gm.</TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={priorityPricing.add500gm.assam}
                      onChange={(e) => handlePriceChange(e.target.value, setPriorityPricing, 'add500gm.assam')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setPriorityPricing, 'add500gm.assam')}
                      className="w-24 h-9 text-xs text-right border-pink-200 focus:border-pink-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={priorityPricing.add500gm.neBySurface}
                      onChange={(e) => handlePriceChange(e.target.value, setPriorityPricing, 'add500gm.neBySurface')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setPriorityPricing, 'add500gm.neBySurface')}
                      className="w-24 h-9 text-xs text-right border-pink-200 focus:border-pink-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={priorityPricing.add500gm.neByAirAgtImp}
                      onChange={(e) => handlePriceChange(e.target.value, setPriorityPricing, 'add500gm.neByAirAgtImp')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setPriorityPricing, 'add500gm.neByAirAgtImp')}
                      className="w-24 h-9 text-xs text-right border-pink-200 focus:border-pink-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3">
                    <Input
                      type="text"
                      value={priorityPricing.add500gm.restOfIndia}
                      onChange={(e) => handlePriceChange(e.target.value, setPriorityPricing, 'add500gm.restOfIndia')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setPriorityPricing, 'add500gm.restOfIndia')}
                      className="w-24 h-9 text-xs text-right border-pink-200 focus:border-pink-400"
                      placeholder="0.00"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-pink-50 border-t-2 border-pink-200">
            <p className="text-xs text-gray-600 font-medium">
              Above price is excluding of Other Charge and GST 18%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Reverse Pricing */}
      <Card className="border-2 border-emerald-200 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-200 py-4">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Train className="h-6 w-6 text-emerald-600" />
            Reverse Pricing
          </CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">From Rest of India</Badge>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">To Guwahati/Assam & North East</Badge>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Per Kg Rate</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-emerald-100 to-teal-100 border-b-2 border-emerald-200">
                  <TableHead className="font-bold text-gray-800 text-sm py-3">Destination</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3 text-center border-l-2 border-emerald-300" colSpan={2}>
                    By Road (Min. 500kg)
                  </TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3 text-center border-l-2 border-emerald-300" colSpan={2}>
                    By Train (Min. 100kg)
                  </TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3 text-center border-l-2 border-emerald-300" colSpan={2}>
                    By Flight (Min. 25kg)
                  </TableHead>
                </TableRow>
                <TableRow className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-200">
                  <TableHead className="font-bold text-gray-800 text-sm py-3"></TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3 text-center border-l-2 border-emerald-300">Normal</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3 text-center">Priority</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3 text-center border-l-2 border-emerald-300">Normal</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3 text-center">Priority</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3 text-center border-l-2 border-emerald-300">Normal</TableHead>
                  <TableHead className="font-bold text-gray-800 text-sm py-3 text-center">Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-gray-100 hover:bg-emerald-50/50">
                  <TableCell className="font-semibold text-sm py-3">To Guwahati (Assam)</TableCell>
                  <TableCell className="text-sm py-3 text-center border-l-2 border-emerald-300">
                    <Input
                      type="text"
                      value={reversePricing.toAssam.byRoad.normal}
                      onChange={(e) => handlePriceChange(e.target.value, setReversePricing, 'toAssam.byRoad.normal')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setReversePricing, 'toAssam.byRoad.normal')}
                      className="w-24 h-9 text-xs text-center border-emerald-200 focus:border-emerald-400 mx-auto"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3 text-center">
                    <Input
                      type="text"
                      value={reversePricing.toAssam.byRoad.priority}
                      onChange={(e) => handlePriceChange(e.target.value, setReversePricing, 'toAssam.byRoad.priority')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setReversePricing, 'toAssam.byRoad.priority')}
                      className="w-24 h-9 text-xs text-center border-emerald-200 focus:border-emerald-400 mx-auto"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3 text-center border-l-2 border-emerald-300">
                    <Input
                      type="text"
                      value={reversePricing.toAssam.byTrain.normal}
                      onChange={(e) => handlePriceChange(e.target.value, setReversePricing, 'toAssam.byTrain.normal')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setReversePricing, 'toAssam.byTrain.normal')}
                      className="w-24 h-9 text-xs text-center border-emerald-200 focus:border-emerald-400 mx-auto"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3 text-center">
                    <Input
                      type="text"
                      value={reversePricing.toAssam.byTrain.priority}
                      onChange={(e) => handlePriceChange(e.target.value, setReversePricing, 'toAssam.byTrain.priority')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setReversePricing, 'toAssam.byTrain.priority')}
                      className="w-24 h-9 text-xs text-center border-emerald-200 focus:border-emerald-400 mx-auto"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3 text-center border-l-2 border-emerald-300">
                    <Input
                      type="text"
                      value={reversePricing.toAssam.byFlight.normal}
                      onChange={(e) => handlePriceChange(e.target.value, setReversePricing, 'toAssam.byFlight.normal')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setReversePricing, 'toAssam.byFlight.normal')}
                      className="w-24 h-9 text-xs text-center border-emerald-200 focus:border-emerald-400 mx-auto"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3 text-center">
                    <Input
                      type="text"
                      value={reversePricing.toAssam.byFlight.priority}
                      onChange={(e) => handlePriceChange(e.target.value, setReversePricing, 'toAssam.byFlight.priority')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setReversePricing, 'toAssam.byFlight.priority')}
                      className="w-24 h-9 text-xs text-center border-emerald-200 focus:border-emerald-400 mx-auto"
                      placeholder="0.00"
                    />
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-emerald-50/50">
                  <TableCell className="font-semibold text-sm py-3">To North East (6 States)</TableCell>
                  <TableCell className="text-sm py-3 text-center border-l-2 border-emerald-300">
                    <Input
                      type="text"
                      value={reversePricing.toNorthEast.byRoad.normal}
                      onChange={(e) => handlePriceChange(e.target.value, setReversePricing, 'toNorthEast.byRoad.normal')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setReversePricing, 'toNorthEast.byRoad.normal')}
                      className="w-24 h-9 text-xs text-center border-emerald-200 focus:border-emerald-400 mx-auto"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3 text-center">
                    <Input
                      type="text"
                      value={reversePricing.toNorthEast.byRoad.priority}
                      onChange={(e) => handlePriceChange(e.target.value, setReversePricing, 'toNorthEast.byRoad.priority')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setReversePricing, 'toNorthEast.byRoad.priority')}
                      className="w-24 h-9 text-xs text-center border-emerald-200 focus:border-emerald-400 mx-auto"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3 text-center border-l-2 border-emerald-300">
                    <Input
                      type="text"
                      value={reversePricing.toNorthEast.byTrain.normal}
                      onChange={(e) => handlePriceChange(e.target.value, setReversePricing, 'toNorthEast.byTrain.normal')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setReversePricing, 'toNorthEast.byTrain.normal')}
                      className="w-24 h-9 text-xs text-center border-emerald-200 focus:border-emerald-400 mx-auto"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3 text-center">
                    <Input
                      type="text"
                      value={reversePricing.toNorthEast.byTrain.priority}
                      onChange={(e) => handlePriceChange(e.target.value, setReversePricing, 'toNorthEast.byTrain.priority')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setReversePricing, 'toNorthEast.byTrain.priority')}
                      className="w-24 h-9 text-xs text-center border-emerald-200 focus:border-emerald-400 mx-auto"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3 text-center border-l-2 border-emerald-300">
                    <Input
                      type="text"
                      value={reversePricing.toNorthEast.byFlight.normal}
                      onChange={(e) => handlePriceChange(e.target.value, setReversePricing, 'toNorthEast.byFlight.normal')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setReversePricing, 'toNorthEast.byFlight.normal')}
                      className="w-24 h-9 text-xs text-center border-emerald-200 focus:border-emerald-400 mx-auto"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-sm py-3 text-center">
                    <Input
                      type="text"
                      value={reversePricing.toNorthEast.byFlight.priority}
                      onChange={(e) => handlePriceChange(e.target.value, setReversePricing, 'toNorthEast.byFlight.priority')}
                      onBlur={(e) => handlePriceBlur(e.target.value, setReversePricing, 'toNorthEast.byFlight.priority')}
                      className="w-24 h-9 text-xs text-center border-emerald-200 focus:border-emerald-400 mx-auto"
                      placeholder="0.00"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-emerald-50 border-t-2 border-emerald-200">
            <p className="text-xs text-gray-600 font-medium">
              <strong>Minimum Chargeable Weight:</strong> By Road - 500kg, By Train - 100kg, By Flight - 25kg
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Above price is excluding of Other Charge and GST 18%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerPricing;
