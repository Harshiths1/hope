import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const CheckoutPage: React.FC = () => {
  const [driverLocation, setDriverLocation] = useState<{ driverId: string; latitude: number; longitude: number } | null>(null);
  const [socketStatus, setSocketStatus] = useState<string>('Disconnected');

  useEffect(() => {
    const socket = io('http://localhost:3500');

    socket.on('connect', () => {
      console.log('Connected to socket server');
      setSocketStatus('Connected');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setSocketStatus('Disconnected');
    });

    socket.on('driverLocationUpdate', (data: { driverId: string; latitude: number; longitude: number }) => {
      console.log('Received driver location update:', data);
      setDriverLocation(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Checkout</h1>
      <p>Socket Status: {socketStatus}</p>
      {driverLocation ? (
        <div>
          <h2>Driver Location</h2>
          <p>Driver ID: {driverLocation.driverId}</p>
          <p>Latitude: {driverLocation.latitude}</p>
          <p>Longitude: {driverLocation.longitude}</p>
        </div>
      ) : (
        <p>Waiting for driver location...</p>
      )}
    </div>
  );
};

export default CheckoutPage;
