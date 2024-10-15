import { z } from "zod";

export const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  city: z.string().min(1, "City is required"),
});

export type FormData = z.infer<typeof formSchema>;

export const driverFormSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  address: z.string().min(1, "Address is required"),
  // Vehicle information
  vehicle_model: z.string().min(1, "Vehicle model is required"),
  vehicle_company: z.string().min(1, "Vehicle company is required"),
  vehicle_type: z.string().min(1, "Vehicle type is required"),
  vehicle_reg_no: z.string().min(1, "Vehicle registration number is required"),
});

export type DriverFormData = z.infer<typeof driverFormSchema>;
