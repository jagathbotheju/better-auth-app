"use client";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChangePasswordSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useChangePassword } from "@/server/backend/mutations/userMutations";

const ChangePassword = () => {
  const { mutate: changePassword } = useChangePassword();
  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (formData: z.infer<typeof ChangePasswordSchema>) => {
    console.log("formData", formData);
    changePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h3 className="text-xl font-bold">Change Password</h3>

        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-fit" type="submit">
          Change Password
        </Button>
      </form>
    </Form>
  );
};

export default ChangePassword;
