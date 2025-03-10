
export interface DeliveryOption {
  id: string;
  name: string;
  arabicName: string;
  price: number;
  estimatedDays: string;
  arabicDescription: string;
  isActive: boolean;
}

export interface DeliveryZone {
  id: string;
  name: string;
  arabicName: string;
  price: number;
  description: string;
  arabicDescription: string;
  isActive: boolean;
}

export interface DeliverySettings {
  freeShippingThreshold: number;
  defaultShippingMethod: string;
  internationalShipping: boolean;
  showEstimatedDelivery: boolean;
  allowPickup: boolean;
}
