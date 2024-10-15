'use client'

import { useEffect, useRef } from 'react'

interface MapProps {
  pickupCoordinate: [number, number]
  dropoffCoordinate: [number, number]
  driverCoordinate: [number, number]
  distance: string
}

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

const Map: React.FC<MapProps> = ({ pickupCoordinate, dropoffCoordinate, driverCoordinate, distance }) => {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadGomapsScript = () => {
      const script = document.createElement('script')
      script.src = `https://maps.gomaps.pro/maps/api/js?key=${process.env.NEXT_PUBLIC_GOMAPS_API_KEY}&libraries=places&callback=initMap`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }

    window.initMap = () => {
      if (mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 0, lng: 0 },
          zoom: 2
        });

        // Check if both coordinates are valid
        if (pickupCoordinate[0] !== 0 && pickupCoordinate[1] !== 0 &&
            dropoffCoordinate[0] !== 0 && dropoffCoordinate[1] !== 0) {
          
          const pickup = new window.google.maps.LatLng(pickupCoordinate[0], pickupCoordinate[1])
          const dropoff = new window.google.maps.LatLng(dropoffCoordinate[0], dropoffCoordinate[1])

          // Add markers
          new window.google.maps.Marker({ position: pickup, map, label: 'P' })
          new window.google.maps.Marker({ position: dropoff, map, label: 'D' })

          // Create a DirectionsService object to use the Directions API
          const directionsService = new window.google.maps.DirectionsService();
          const directionsRenderer = new window.google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true // This will suppress default markers as we've added our own
          });

          // Get route
          directionsService.route(
            {
              origin: pickup,
              destination: dropoff,
              travelMode: window.google.maps.TravelMode.DRIVING
            },
            (result, status) => {
              if (status === 'OK' && result) {
                directionsRenderer.setDirections(result);
              }
            }
          );

          // Add distance label
          const midpoint = new window.google.maps.LatLng(
            (pickup.lat() + dropoff.lat()) / 2,
            (pickup.lng() + dropoff.lng()) / 2
          );

          // new window.google.maps.InfoWindow({
          //   position: midpoint,
          //   content: `Distance: ${distance}`
          // }).open(map);

          // Fit map to show both points
          const bounds = new window.google.maps.LatLngBounds()
          bounds.extend(pickup)
          bounds.extend(dropoff)
          map.fitBounds(bounds)
        }
      }
    }

    if (!window.google) {
      loadGomapsScript();
    } else {
      window.initMap();
    }

    return () => {
      window.initMap = () => {};
    }
  }, [pickupCoordinate, dropoffCoordinate, driverCoordinate, distance])

  return <div ref={mapRef} className="w-full h-full min-h-[400px]" />
}

export default Map
