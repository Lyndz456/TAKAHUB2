// src/data/pickupData.ts

export interface PickupRequest {
  request_id: number;
  pickup_date: string;
  location: string;
  waste_type: string;
  user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  reason?: string;
}

// This is the shared pickup request array used by both resident & collector
export const pickupRequests: PickupRequest[] = [];
