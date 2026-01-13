"use client"

import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/layout/logo";
import { loginSchema, LoginSchemaData, signUpSchema, SignUpSchemaData } from "@/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";

type FormData = LoginSchemaData | SignUpSchemaData;

interface AuthFormProps {
  isLogin: boolean;
  onToggleMode: () => void;
  redirectTo: string | null;
}

function AuthForm({ isLogin, onToggleMode, redirectTo }: AuthFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(isLogin ? loginSchema : signUpSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.error || 'An error occurred');
        return;
      }

      window.location.href = redirectTo || '/';
    } catch {
      setApiError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-serif font-semibold mb-2">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="text-muted">
          {isLogin
            ? 'Sign in to continue to your recipes'
            : 'Start your culinary journey today'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {!isLogin && (
          <Input
            label="Username"
            type="text"
            Icon={User}
            placeholder="Username"
            error={(errors as FieldErrors<SignUpSchemaData>).username?.message}
            {...register("username")}
          />
        )}

        <Input
          label="Email"
          Icon={Mail}
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          Icon={Lock}
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        {apiError && (
          <p className="text-sm text-error text-center">{apiError}</p>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          text={isSubmitting ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
          size="lg"
          disabled={isSubmitting}
        />
      </form>

      <div className="mt-6 text-center">
        <p className="text-muted">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            type="button"
            onClick={onToggleMode}
            className="ml-1 text-primary font-medium hover:underline"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </>
  );
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const searchParams = useSearchParams();
  const expired = searchParams.get("expired") === "true";
  const redirectTo = searchParams.get("redirect");

  return (
    <div className="min-h-screen gradient-warm flex items-center justify-center p-4">
      <div>
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Logo />
        </Link>

        <div className="bg-card border border-border rounded-2xl shadow-sm p-8">
          {expired && (
            <div className="mb-6 p-3 bg-secondary rounded-lg text-center">
              <p className="text-sm text-muted">
                Your session has expired. Please sign in again.
              </p>
            </div>
          )}

          <AuthForm
            key={isLogin ? 'login' : 'signup'}
            isLogin={isLogin}
            onToggleMode={() => setIsLogin(!isLogin)}
            redirectTo={redirectTo}
          />
        </div>

        <p className="text-center text-sm text-muted mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
