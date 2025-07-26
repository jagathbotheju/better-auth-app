"use client";
import { LoginSchema } from "@/lib/schema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Loader2Icon } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingGithub, setIsLoadingGithub] = useState(false);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  const onSubmit = async (formData: z.infer<typeof LoginSchema>) => {
    await signIn.email(
      {
        email: formData.email,
        password: formData.password,
        rememberMe: true,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Login successful");
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Login error occurred");
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          {/* email */}
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

          {/* password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Link
            href={`/auth/register`}
            className="my-4 flex justify-center hover:underline hover:text-primary"
          >
            <p className="text-muted-foreground">No account, please register</p>
          </Link>

          <Button className="mt-2 w-full" disabled={isLoading} type="submit">
            {isLoading && <Loader2Icon className="w-6 h-6 animate-spin" />}
            {isLoading ? "Logging In..." : "Login"}
          </Button>
        </form>
      </Form>

      <div className="flex flex-col gap-2 justify-center items-center w-full">
        <p className="text-xs">or login with</p>
        <Button
          type="button"
          className="w-full"
          onClick={async () =>
            await signIn.social({
              provider: "google",
              callbackURL: "/profile",
              errorCallbackURL: "/auth/login/error",
              fetchOptions: {
                onRequest: () => {
                  setIsLoadingGoogle(true);
                },
                onResponse: () => {
                  setIsLoadingGoogle(false);
                },
                onError: (ctx) => {
                  toast.error(ctx.error.message);
                },
                onSuccess: () => {
                  toast.success("Login successful");
                },
              },
            })
          }
        >
          {isLoadingGoogle && <Loader2Icon className="w-6 h-6 animate-spin" />}
          {isLoadingGoogle ? "Logging In with Google..." : "Login with Google"}
        </Button>
        <Button
          type="button"
          className="w-full cursor-pointer"
          onClick={async () =>
            await signIn.social({
              provider: "github",
              callbackURL: "/profile",
              errorCallbackURL: "/auth/login/error",
              fetchOptions: {
                onRequest: () => {
                  setIsLoadingGithub(true);
                },
                onResponse: () => {
                  setIsLoadingGithub(false);
                },
                onError: (ctx) => {
                  toast.error(ctx.error.message);
                },
                onSuccess: () => {
                  toast.success("Login successful");
                },
              },
            })
          }
        >
          {isLoadingGithub && <Loader2Icon className="w-6 h-6 animate-spin" />}
          {isLoadingGithub ? "Logging In with Github..." : "Login with Github"}
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
