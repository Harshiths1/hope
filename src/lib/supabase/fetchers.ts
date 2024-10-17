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

export async function createRideRequest(request: Omit<RideRequest, 'id' | 'created_at'>){
  const { data, error } = await supabaseBrowserClient.from("ride_requests").insert(request).select();
  if (error) {
    console.error(error);
    return null;
  }
  return data[0] as unknown as RideRequest;
}

