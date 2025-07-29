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

export const NewTokenSchema = z.object({
  email: z
    .email("please enter valid email address")
    .min(1, "email is required"),
});

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(1, "password is required"),
    confirmPassword: z.string().min(1, "confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "password is required"),
  newPassword: z.string().min(1, "password is required"),
});

export const MagicLinkSchema = z.object({
  email: z
    .email("please enter valid email address")
    .min(1, "email is required"),
});
