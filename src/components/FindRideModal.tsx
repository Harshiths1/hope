'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import useSocketStore from '@/states/socketState';
import { createRideRequest } from '@/lib/supabase/fetchers';
import supabaseBrowserClient from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface Driver {
  id: string;
  name: string;
  rating: number;
  distance: string;
}



interface DriversListModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    pickupCoordinate: [number, number];
    dropoffCoordinate: [number, number];
}

export function FindRideModal({ open, setOpen, pickupCoordinate, dropoffCoordinate }: DriversListModalProps) {
    const [user, setUser] = useState<User | null>(null)
    const {socket} = useSocketStore()
    
    useEffect(() => {
        supabaseBrowserClient.auth.getUser().then(({ data: { user } }) => setUser(user))
    }, [])

    useEffect(() => {
        const createClientRideRequest = async () => {
        try {
           if (user && socket) {
            const rideRequest = await createRideRequest({
              client_id: user?.id ?? '',
              pickupLat: pickupCoordinate[0],
              pickupLong: pickupCoordinate[1],
              dropoffLat: dropoffCoordinate[0],
              dropoffLong: dropoffCoordinate[1],
              assignedDriver: null,
              status: 'pending',
          });
          console.log('Ride request created successfully:', rideRequest);
            socket?.emit('requestRide', {
              client_id: user?.id,
              latitude: pickupCoordinate[0],
              longitude: pickupCoordinate[1],
              rideRequestId: rideRequest?.id
              })
            }
            } catch (error) {
                console.error('Error creating ride request:', error);
            }
        };
        createClientRideRequest();
    }, [user, pickupCoordinate, dropoffCoordinate, socket]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Find Nearest Driver</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        Waiting for driver to accept ride...
      </DialogContent>
    </Dialog>
  )
}
