import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RideBookingProps {
  userId: string;
}

const RideBooking: React.FC<RideBookingProps> = ({ userId }) => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [vehicleType, setVehicleType] = useState<'semi-truck' | 'tempo'>('semi-truck');
  const router = useRouter();

  const handleProceedToCheckout = () => {
    router.push({
      pathname: '/checkout',
      query: { pickup, dropoff, vehicleType },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book a Ride</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Pickup Location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        />
        <Input
          placeholder="Dropoff Location"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
        />
        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value as 'semi-truck' | 'tempo')}
        >
          <option value="semi-truck">Semi-truck</option>
          <option value="tempo">Tempo</option>
        </select>
        <Button onClick={handleProceedToCheckout}>Proceed to Checkout</Button>
      </CardContent>
    </Card>
  );
};

export default RideBooking;
