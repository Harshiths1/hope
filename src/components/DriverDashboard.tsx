import React, { useEffect, useState } from 'react';
import { subscribeToRideRequests } from '@/lib/supabase/realtime';
import { updateRideRequestStatus, updateDriverLocation } from '@/lib/supabase/fetchers';
import { RideRequest, DriverLocation } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Map from '@/components/Map'; // Assume you have a Map component

interface DriverDashboardProps {
  driverId: string;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ driverId }) => {
  const [currentRequest, setCurrentRequest] = useState<RideRequest | null>(null);
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null);
  const [isRideAccepted, setIsRideAccepted] = useState(false);

  useEffect(() => {
    const channel = subscribeToRideRequests(driverId, (request) => {
      setCurrentRequest(request);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [driverId]);

  useEffect(() => {
    if (isRideAccepted) {
      startLocationUpdates();
    }
  }, [isRideAccepted]);

  const handleAccept = async () => {
    if (currentRequest) {
      await updateRideRequestStatus(currentRequest.id, 'accepted');
      setIsRideAccepted(true);
    }
  };

  const handleReject = async () => {
    if (currentRequest) {
      await updateRideRequestStatus(currentRequest.id, 'rejected');
      setCurrentRequest(null);
    }
  };

  const startLocationUpdates = () => {
    // Simulate location updates every 10 seconds
    const intervalId = setInterval(() => {
      const newLocation: Omit<DriverLocation, 'last_updated'> = {
        driver_id: driverId,
        latitude: Math.random() * 180 - 90, // Random latitude
        longitude: Math.random() * 360 - 180, // Random longitude
      };
      updateDriverLocation(newLocation);
      setDriverLocation(newLocation as DriverLocation);
    }, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  };

  if (!currentRequest && !isRideAccepted) {
    return <div>Waiting for ride requests...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isRideAccepted ? 'Current Ride' : 'New Ride Request'}</CardTitle>
      </CardHeader>
      <CardContent>
        {!isRideAccepted && currentRequest && (
          <>
            <p>Pickup: {currentRequest.pickup_location}</p>
            <p>Dropoff: {currentRequest.dropoff_location}</p>
            <p>Vehicle Type: {currentRequest.vehicle_type}</p>
            <div className="mt-4 space-x-2">
              <Button onClick={handleAccept}>Accept</Button>
              <Button onClick={handleReject} variant="destructive">Reject</Button>
            </div>
          </>
        )}
        {isRideAccepted && currentRequest && driverLocation && (
          <>
            <Map
              pickupCoordinate={[parseFloat(currentRequest.pickup_location.split(',')[1]), parseFloat(currentRequest.pickup_location.split(',')[0])]}
              dropoffCoordinate={[parseFloat(currentRequest.dropoff_location.split(',')[1]), parseFloat(currentRequest.dropoff_location.split(',')[0])]}
              driverCoordinate={[driverLocation.longitude, driverLocation.latitude]}
              distance="Calculating..."
            />
            <p>Pickup: {currentRequest.pickup_location}</p>
            <p>Dropoff: {currentRequest.dropoff_location}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DriverDashboard;
