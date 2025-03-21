import * as z from "zod";

// Zod Schemas
export const LoginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
  .object({
    email: z.string().email({ message: "Enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const ResetPasswordSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

// Type Inference
export type LoginFormValues = z.infer<typeof LoginSchema>;
export type RegisterFormValues = z.infer<typeof RegisterSchema>;
export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

// Store Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  isResetEmailSent?: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

// Form Props
export interface AuthFormProps {
  onSubmit: (values: any) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
  clearError?: () => void;
  isSuccess?: boolean;
}
