'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Map from '@/components/Map'
import baseFares from '@/config/baseFares.json'

interface Vehicle {
  id: string;
  name: string;
  capacity: string;
  image: string;
}

const vehicles: Vehicle[] = [
  {
    id: 'semi-truck',
    name: 'Semi-Truck',
    capacity: '80,000 lbs',
    image: '/semi_truck.jpeg',
  },
  {
    id: 'tempo',
    name: 'Tempo',
    capacity: '2,000 lbs',
    image: '/tempo.jpg',
  },
]

const Page = () => {
  const router = useRouter()
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [pickupCoordinate, setPickupCoordinate] = useState<[number, number]>([0, 0])
  const [dropoffCoordinate, setDropoffCoordinate] = useState<[number, number]>([0, 0])
  const [showMap, setShowMap] = useState(false)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [prices, setPrices] = useState<{[key: string]: number}>({})

  useEffect(() => {
    if (distance) {
      const distanceInKm = parseFloat(distance.replace(' km', ''))
      const newPrices = vehicles.reduce((acc, vehicle) => {
        const baseFare = baseFares[vehicle.id as keyof typeof baseFares]
        acc[vehicle.id] = Number((baseFare * distanceInKm).toFixed(2))
        return acc
      }, {} as {[key: string]: number})
      setPrices(newPrices)
    }
  }, [distance])

  const getCoordinatesAndRoute = async () => {
    const directionsUrl = `https://maps.gomaps.pro/maps/api/directions/json?origin=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(dropoff)}&key=${process.env.NEXT_PUBLIC_GOMAPS_API_KEY}`

    try {
      const response = await fetch(directionsUrl)
      const data = await response.json()
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0]
        const leg = route.legs[0]
        const startLocation = leg.start_location
        const endLocation = leg.end_location
        setPickupCoordinate([startLocation.lat, startLocation.lng])
        setDropoffCoordinate([endLocation.lat, endLocation.lng])
        setDistance(leg.distance.text)
        setDuration(leg.duration.text)
      } else {
        console.error('Directions were not successful')
      }
    } catch (error) {
      console.error('Error fetching directions:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await getCoordinatesAndRoute()
    setShowMap(true)
  }

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId)
  }

  const handleProceedToCheckout = () => {
    if (selectedVehicle) {
      router.push(`/checkout?vehicle=${selectedVehicle}&distance=${distance}&duration=${duration}&price=${prices[selectedVehicle]}`)
    } else {
      alert('Please select a vehicle before proceeding to checkout.')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Find a Ride</h1>
      {!showMap ? (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Enter Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter pickup location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Enter dropoff location"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">Find Ride</Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="w-full h-[50vh] relative mb-4">
            <Map
              pickupCoordinate={pickupCoordinate}
              dropoffCoordinate={dropoffCoordinate}
              distance={distance}
            />
            <Button 
              onClick={() => setShowMap(false)}
              className="absolute top-4 left-4 z-10"
            >
              Back to Form
            </Button>
          </div>
          {distance && duration && (
            <div className="bg-white p-4 rounded-md shadow-md mb-4">
              <p>Distance: {distance}</p>
              <p>Estimated Duration: {duration}</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {vehicles.map((vehicle) => (
              <Card 
                key={vehicle.id} 
                className={`cursor-pointer ${selectedVehicle === vehicle.id ? 'border-2 border-blue-500' : ''}`}
                onClick={() => handleVehicleSelect(vehicle.id)}
              >
                <CardContent className="flex items-center p-4">
                  <Image src={vehicle.image} alt={vehicle.name} width={100} height={100} className="mr-4" />
                  <div>
                    <h3 className="font-bold">{vehicle.name}</h3>
                    <p>Capacity: {vehicle.capacity}</p>
                    <p>Price: Rs{prices[vehicle.id] || 'Calculating...'}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button 
            onClick={handleProceedToCheckout} 
            className="w-full"
            disabled={!selectedVehicle}
          >
            Proceed to Checkout
          </Button>
        </>
      )}
    </div>
  )
}

export default Page
