'use client'

import { useEffect, useState, useCallback } from 'react';
import useSocketStore from '@/states/socketState';
import { Button } from "@/components/ui/button";
import supabaseBrowserClient from '@/lib/supabase/client';

interface RideRequest {
  clientId: string;
  latitude: number;
  longitude: number;
  rideRequestId: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

export function DriverDashboardView() {
  const { socket, initSocket, disconnectSocket } = useSocketStore();
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [driverId, setDriverId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);

  console.log(requests)
  useEffect(() => {
    supabaseBrowserClient.auth.getUser().then(({ data: { user } }) => {
      setDriverId(user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    initSocket();
    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('rideRequestFromClient', (request: RideRequest) => {
        setRequests(prevRequests => [...prevRequests, request]);
      });
    }
    return () => {
      if (socket) {
        socket.off('rideRequestFromClient');
      }
    };
  }, [socket]);
  const updateLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setLocation(newLocation);
          if (socket && isOnline && driverId) {
            socket.emit('updateDriverLocation', {
              driverId,
              ...newLocation
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, [socket, isOnline, driverId]);

  const toggleOnlineStatus = () => {
    setIsOnline(prev => !prev);
  };

  const handleAcceptRequest = (clientId: string) => {
    if (socket) {
      socket.emit('acceptRideRequest', { clientId, driverId });
      setRequests(prevRequests => prevRequests.filter(req => req.clientId !== clientId));
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isOnline) {
      console.log('Updating location');
      updateLocation(); // Update location immediately when going online
      intervalId = setInterval(updateLocation, 5000); // Update location every 10 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isOnline, updateLocation]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Driver Dashboard</h1>
      <Button 
        onClick={toggleOnlineStatus}
        className={`mb-4 ${isOnline ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
        variant="ghost"
      >
        {isOnline ? 'Go Offline' : 'Go Online'}
      </Button>
      {location && (
        <p className="mb-4">Current Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
      )}
      <div className="space-y-4">
        {requests.map(request => (
          <div key={request.clientId} className="border p-4 rounded-md">
            <h2 className="font-semibold">Client ID: {request.clientId}</h2>
            <p>Pickup Location: {request.latitude}, {request.longitude}</p>
            <Button 
              onClick={() => handleAcceptRequest(request.clientId)}
              className="mt-2"
            >
              Accept Request
            </Button>
          </div>
        ))}
        {requests.length === 0 && (
          <p>No ride requests at the moment.</p>
        )}
      </div>
    </div>
  );
}