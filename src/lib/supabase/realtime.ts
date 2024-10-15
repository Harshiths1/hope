import { RealtimeChannel } from '@supabase/supabase-js';
import supabaseBrowserClient from './client';
import { RideRequest, DriverLocation } from '@/types';

export const subscribeToRideRequests = (
  driverId: string,
  onRideRequest: (request: RideRequest) => void
): RealtimeChannel => {
  return supabaseBrowserClient
    .channel('ride_requests')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'ride_requests',
        filter: `driver_id=eq.${driverId} AND status=eq.pending`,
      },
      (payload) => {
        onRideRequest(payload.new as RideRequest);
      }
    )
    .subscribe();
};

export const subscribeToDriverLocation = (
  driverId: string,
  onLocationUpdate: (location: DriverLocation) => void
): RealtimeChannel => {
  return supabaseBrowserClient
    .channel('driver_locations')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'driver_locations',
        filter: `driver_id=eq.${driverId}`,
      },
      (payload) => {
        onLocationUpdate(payload.new as DriverLocation);
      }
    )
    .subscribe();
};
