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
import { sendVerificationEmail } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const NewToken = () => {
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
    await sendVerificationEmail({
      email: formData.email,
      callbackURL: "/auth/verify",
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
          toast.success("Verification Email send");
          router.push("/auth/verify/success");
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
          {pending ? "Requesting Token..." : "Request Token"}
        </Button>
      </form>
    </Form>
  );
};

export default NewToken;
