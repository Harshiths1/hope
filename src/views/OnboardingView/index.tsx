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
import { formSchema, FormData } from "./types";
import { UserResponse } from "@supabase/supabase-js";
import AuthLayout from "@/components/ui/auth-layout";
import { Icons } from "@/components/ui/icons";
import supabaseBrowserClient from "@/lib/supabase/client";
import Link from "next/link";

const OnboardingView: FC<{
  from: "google" | "email" | undefined;
  user: UserResponse;
}> = ({ from, user }) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const defaultValues: FormData = {
    first_name: "",
    last_name: "",
    city: "",
  };

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues,
  });

  const { handleSubmit, trigger } = methods;

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);

    try {
      // Update user metadata setting onboarding to true
      await supabaseBrowserClient.auth.updateUser({
        data: {
          isOnboarding: true,
          first_name: data.first_name,
          last_name: data.last_name,
          city: data.city,
        },
      });

      setIsLoading(false);
      router.push("/");
    } catch {
      console.log("Error submitting form");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md py-4 shadow-none rounded-none border-0">
        <FormProvider {...methods}>
          <form className="" onSubmit={handleSubmit(onSubmit)}>
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
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="first_name"
                  type="text"
                  {...methods.register("first_name")}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="last_name"
                  type="text"
                  {...methods.register("last_name")}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  {...methods.register("city")}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center w-full"
              >
                {isLoading && (
                  <Icons.spinner className="animate-spin w-4 h-4 mx-2" />
                )}
                Submit
              </Button>
              <Button
                type="button"
                variant="ghost"
                asChild
                className="w-full mt-2"
              >
                <Link href="/">Skip</Link>
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </AuthLayout>
  );
};

export default OnboardingView;
