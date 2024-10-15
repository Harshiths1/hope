export type Driver = {
  id: string;
  first_name: string;
  last_name: string;
  city: string;
  vehicle_id: string;
  vehicle_registration_number: string;
  vehicle_type: string;
  vehicle_model: string;
  odometer_reading: number;
  created_at?: string;
  updated_at?: string;
};

export type NewDriver = Omit<Driver, 'created_at' | 'updated_at'>;

export type DriverPartnerFormFields = {
  first_name: string;
  last_name: string;
  city: string;
  vehicle_id: string;
  vehicle_registration_number: string;
  vehicle_type: string;
  vehicle_model: string;
  odometer_reading: number;
};

export type RideRequest = {
  id: string;
  user_id: string;
  driver_id: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  pickup_location: string;
  dropoff_location: string;
  vehicle_type: 'semi-truck' | 'tempo';
  created_at: string;
};

export type DriverLocation = {
  driver_id: string;
  latitude: number;
  longitude: number;
  last_updated: string;
};
