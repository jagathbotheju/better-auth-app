"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { MagicLinkSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";

const MagicLink = () => {
  const [pending, setPending] = useState(false);
  const form = useForm<z.infer<typeof MagicLinkSchema>>({
    resolver: zodResolver(MagicLinkSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (formData: z.infer<typeof MagicLinkSchema>) => {
    console.log(formData);
    await signIn.magicLink({
      email: formData.email,
      name: formData.email.split("@")[0],
      callbackURL: "/profile",
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
          toast.success("Check your email for Magic Link");
        },
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Magic Link</FormLabel>
              <FormControl>
                <div className="flex gap-2 items-center w-full">
                  <Input {...field} />
                  <Button type="submit">SEND</Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default MagicLink;
