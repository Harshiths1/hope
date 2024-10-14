'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import baseFares from '@/config/baseFares.json'

const AdminBaseFares = () => {
  const [fares, setFares] = useState(baseFares)

  const handleFareChange = (vehicleId: string, value: string) => {
    setFares(prev => ({ ...prev, [vehicleId]: parseFloat(value) || 0 }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would send the updated fares to your backend
    // For now, we'll just log them
    console.log('Updated fares:', fares)
    alert('Base fares updated successfully!')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Update Base Fares</h1>
      <Card>
        <CardHeader>
          <CardTitle>Edit Base Fares</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries(fares).map(([vehicleId, fare]) => (
              <div key={vehicleId} className="flex items-center space-x-2">
                <label className="w-1/3">{vehicleId}:</label>
                <Input
                  type="number"
                  value={fare}
                  onChange={(e) => handleFareChange(vehicleId, e.target.value)}
                  className="w-2/3"
                  step="0.01"
                />
              </div>
            ))}
            <Button type="submit" className="w-full">Update Base Fares</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminBaseFares
