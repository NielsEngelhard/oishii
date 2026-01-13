"use client"

import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/layout/logo";
import { loginSchema, LoginSchemaData } from "@/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LoginSchemaData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("waterpolo");
    
  };

    return (
    <div className="min-h-screen gradient-warm flex items-center justify-center p-4">
      <div>
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Logo />
        </Link>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-8">
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

          <form onSubmit={onSubmit} className="space-y-5">
            {/* {!isLogin && (
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    label="Username"
                    type="text"
                    Icon={User}
                    placeholder="Username"
                    className="pl-10 h-12"
                    {...register("username")}
                  />
                </div>
              </div>
            )} */}

            <div className="space-y-2">
              <div className="relative">
                <Input
                  label="Email"
                  Icon={Mail}
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 h-12"
                  {...register("email")}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  label="Password"
                  Icon={Lock}
                  type={'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12"
                  {...register("password")}
                  required
                />
              </div>
            </div>

            <Button
                type="submit"
                variant="primary"
                className="w-full"
                text={isLogin ? 'Sign In' : 'Create Account'}
                size="lg"
            />
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-primary font-medium hover:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
    )
}