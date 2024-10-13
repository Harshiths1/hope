import { z } from "zod";

export const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  city: z.string().min(1, "City is required"),
});

export type FormData = z.infer<typeof formSchema>;
