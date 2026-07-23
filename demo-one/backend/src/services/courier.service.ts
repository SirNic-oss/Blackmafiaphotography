export interface CourierQuote {
  cost: number;
  estimatedDays: number;
}

export interface CourierTrackingResult {
  trackingNumber: string;
  status: string;
  events: Array<{ status: string; description: string; timestamp: string }>;
}

export interface CourierService {
  createShipment(orderId: string, address: string): Promise<{ trackingNumber: string }>;
  getTracking(trackingNumber: string): Promise<CourierTrackingResult>;
  updateShipmentStatus(trackingNumber: string, status: string): Promise<void>;
  getQuote(address: string): Promise<CourierQuote>;
}

class PlaceholderCourierService implements CourierService {
  async createShipment(
    _orderId: string,
    _address: string
  ): Promise<{ trackingNumber: string }> {
    const trackingNumber = `CG-${Date.now()}`;
    console.log("[Courier Placeholder] createShipment", { trackingNumber });
    return { trackingNumber };
  }

  async getTracking(trackingNumber: string): Promise<CourierTrackingResult> {
    console.log("[Courier Placeholder] getTracking", { trackingNumber });
    return {
      trackingNumber,
      status: "PENDING",
      events: [],
    };
  }

  async updateShipmentStatus(
    trackingNumber: string,
    status: string
  ): Promise<void> {
    console.log("[Courier Placeholder] updateShipmentStatus", {
      trackingNumber,
      status,
    });
  }

  async getQuote(_address: string): Promise<CourierQuote> {
    return { cost: 99, estimatedDays: 3 };
  }
}

export const courierService: CourierService = new PlaceholderCourierService();
