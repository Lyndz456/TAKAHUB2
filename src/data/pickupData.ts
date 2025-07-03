// src/data/pickupData.ts

export interface PickupRequest {
  request_id: number;
  pickup_date: string;
  location: string;
  waste_type: string;
}

export const pickupRequests: PickupRequest[] = [];
