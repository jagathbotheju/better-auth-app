"use client";
import { NewTokenSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { forgetPassword } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

const ForgetPassword = () => {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const form = useForm<z.infer<typeof NewTokenSchema>>({
    resolver: zodResolver(NewTokenSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (formData: z.infer<typeof NewTokenSchema>) => {
    console.log(formData);
    await forgetPassword({
      email: formData.email,
      redirectTo: "/auth/reset-password",
      fetchOptions: {
        onRequest: () => {
          setPending(true);
        },
        onResponse: () => {
          setPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("Rest password link sent to your email address");
          router.push("/auth/forgot-password/success");
        },
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {pending && <Loader2Icon className="mr-2" />}
          <span>Reset Password</span>
        </Button>
      </form>
    </Form>
  );
};

export default ForgetPassword;
