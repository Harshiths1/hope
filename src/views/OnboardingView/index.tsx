"use client";

import { useState, FC } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formSchema, FormData, driverFormSchema } from "./types";
import { UserResponse } from "@supabase/supabase-js";
import AuthLayout from "@/components/ui/auth-layout";
import { Icons } from "@/components/ui/icons";
import supabaseBrowserClient from "@/lib/supabase/client";
import { updateDriver } from "@/lib/supabase/fetchers";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Driver } from "@/types";

const OnboardingView: FC<{
  from: "google" | "email" | undefined;
  user: UserResponse;
}> = ({ from, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<"user" | "driver" | null>(null);

  const router = useRouter();

  const userMethods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      city: "",
    },
  });

  const driverMethods = useForm<Driver>({
    resolver: zodResolver(driverFormSchema),
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      city: "",
    },
  });

  const onUserSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);

    try {
      await supabaseBrowserClient.auth.updateUser({
        data: {
          isOnboarding: true,
          userType: "user",
          first_name: data.first_name,
          last_name: data.last_name,
          city: data.city,
        },
      });

      setIsLoading(false);
      router.push("/");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDriverSubmit: SubmitHandler<Driver> = async (data) => {
    setIsLoading(true);
    console.log(data)
    try {
      const { data: userData, error: userError } = await supabaseBrowserClient.auth.updateUser({
        data: {
          userType: "driver",
          isOnboarding: true,
        },
      });
      if (userError) throw userError;

      const insertedDriver = await updateDriver(data);

      if (!insertedDriver) {
        throw new Error("Failed to insert driver data");
      }

      setIsLoading(false);
      router.push("/");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderUserTypeSelection = () => (
    <Card className="w-full max-w-md py-4 shadow-none rounded-none border-0">
      <CardHeader>
        <CardTitle className="text-2xl mb-2 text-gray-900 dark:text-gray-100">
          Choose Your Account Type
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Are you signing up as a user or a Driver Partner?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={() => setUserType("user")}
          className="w-full"
        >
          I'm a User
        </Button>
        <Button
          onClick={() => setUserType("driver")}
          className="w-full"
        >
          I'm a Driver Partner
        </Button>
      </CardContent>
    </Card>
  );

  const renderUserForm = () => (
    <Card className="w-full max-w-md py-4 shadow-none rounded-none border-0">
      <FormProvider {...userMethods}>
        <form onSubmit={userMethods.handleSubmit(onUserSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl mb-2 text-gray-900 dark:text-gray-100">
              Tell us about yourself!
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Please provide your basic information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                type="text"
                {...userMethods.register("first_name")}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                type="text"
                {...userMethods.register("last_name")}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                type="text"
                {...userMethods.register("city")}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </CardFooter>
        </form>
      </FormProvider>
    </Card>
  );
  const renderDriverForm = () => {
    console.log(driverMethods.formState.errors); // Log any validation errors
    return (
      <Card className="w-full max-w-md py-4 shadow-none rounded-none border-0">
        <FormProvider {...driverMethods}>
          <form onSubmit={driverMethods.handleSubmit(onDriverSubmit)}>
            <CardHeader>
              <CardTitle className="text-2xl mb-2 text-gray-900 dark:text-gray-100">
                Driver Partner Registration
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Please provide your information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  type="text"
                  {...driverMethods.register("first_name")}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  type="text"
                  {...driverMethods.register("last_name")}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  {...driverMethods.register("city")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={isLoading} // Ensure button is enabled unless loading
                className="w-full"
              >
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Submit
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    );
  };
  
  return (
    <AuthLayout>
      {userType === null ? renderUserTypeSelection() : 
       userType === "user" ? renderUserForm() : 
       renderDriverForm()}
    </AuthLayout>
  );
};

export default OnboardingView;