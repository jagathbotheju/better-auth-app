import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .email("please enter valid email address")
    .min(1, "email is required"),
  password: z.string().min(1, "password is required"),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(1, "name is required"),
    email: z
      .email("please enter valid email address")
      .min(1, "email is required"),
    password: z.string().min(1, "password is required"),
    confirmPassword: z.string().min(1, "confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });
