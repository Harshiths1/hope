// client side fetchers
import { Driver, DriverLocation, RideRequest } from "@/types";
import supabaseBrowserClient from "./client";

export async function updateDriver(driver: Driver): Promise<Driver | null> {
  console.log(driver);
  const { data, error } = await supabaseBrowserClient.from("driver").upsert(driver).select();

  if (error) {
    console.error(error);
    return null;
  }
  console.log(data);
  return data[0] as unknown as Driver;
}

export async function updateDriverLocation(location: Omit<DriverLocation, 'last_updated'>) {
  // Implement the logic to update driver location in your database
  // For example:
  // return supabase.from('driver_locations').upsert(location);
}

export const updateRideRequestStatus = async (requestId: string, status: string) => {
  // Implementation here
};

export async function createRideRequest(request: Omit<RideRequest, 'id' | 'created_at'>){
  // Implementation of createRideRequest
}
