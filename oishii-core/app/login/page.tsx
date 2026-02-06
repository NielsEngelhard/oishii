"use client"

import Input from "@/components/form/Input";
import LanguageSelect from "@/components/form/LanguageSelect";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/layout/logo";
import { Locale, defaultLocale } from "@/i18n/config";
import { setLanguageCookie } from "@/lib/i18n/language";
import { loginSchema, LoginSchemaData, signUpSchema, SignUpSchemaData } from "@/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";

type FormData = LoginSchemaData | SignUpSchemaData;

interface AuthFormProps {
  isLogin: boolean;
  onToggleMode: () => void;
  redirectTo: string | null;
  onLanguageChange: (locale: Locale) => void;
  selectedLanguage: Locale;
}

function AuthForm({ isLogin, onToggleMode, redirectTo, onLanguageChange, selectedLanguage }: AuthFormProps) {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
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
      const payload = isLogin ? data : { ...data, language: selectedLanguage };
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.error || 'An error occurred');
        return;
      }

      // Navigate to appropriate page after auth
      if (redirectTo) {
        window.location.href = redirectTo;
      } else if (isLogin) {
        window.location.href = '/recipes/my';
      } else {
        window.location.href = '/explore';
      }
    } catch {
      setApiError(tCommon('networkError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-serif font-semibold mb-2">
          {isLogin ? t('welcomeBack') : t('createYourAccount')}
        </h1>
        <p className="text-muted">
          {isLogin
            ? t('signInToContinue')
            : t('startJourney')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {!isLogin && (
          <Input
            label={t('username')}
            type="text"
            Icon={User}
            placeholder={t('username')}
            error={(errors as FieldErrors<SignUpSchemaData>).username?.message}
            {...register("username")}
          />
        )}

        <Input
          label={t('email')}
          Icon={Mail}
          type="email"
          placeholder={t('emailPlaceholder')}
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label={t('password')}
          Icon={Lock}
          type="password"
          placeholder={t('passwordPlaceholder')}
          error={errors.password?.message}
          {...register("password")}
        />

        {!isLogin && (
          <LanguageSelect
            value={selectedLanguage}
            onChange={onLanguageChange}
          />
        )}

        {apiError && (
          <p className="text-sm text-error text-center">{apiError}</p>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          text={isSubmitting ? tCommon('loading') : (isLogin ? t('signIn') : t('createYourAccount'))}
          size="lg"
          disabled={isSubmitting}
        />
      </form>

      <div className="mt-6 text-center">
        <p className="text-muted">
          {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}
          <button
            type="button"
            onClick={onToggleMode}
            className="ml-1 text-primary font-medium hover:underline"
          >
            {isLogin ? t('signUp') : t('signIn')}
          </button>
        </p>
      </div>
    </>
  );
}

function LoginContent() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const isSignUp = searchParams.has("sign-up");
  const [isLogin, setIsLogin] = useState(!isSignUp);
  const [selectedLanguage, setSelectedLanguage] = useState<Locale>(defaultLocale);
  const expired = searchParams.get("expired") === "true";
  const redirectTo = searchParams.get("redirect");

  const handleLanguageChange = (locale: Locale) => {
    setSelectedLanguage(locale);
    setLanguageCookie(locale);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 transition-transform hover:scale-105">
          <Logo />
        </Link>

        <div className="bg-card border border-border/40 rounded-2xl shadow-warm-lg p-6 sm:p-8 backdrop-blur-sm w-full max-w-sm">
          {expired && (
            <div className="mb-6 p-3 bg-secondary rounded-lg text-center">
              <p className="text-sm text-muted">
                {t('sessionExpired')}
              </p>
            </div>
          )}

          <AuthForm
            key={isLogin ? 'login' : 'signup'}
            isLogin={isLogin}
            onToggleMode={() => setIsLogin(!isLogin)}
            redirectTo={redirectTo}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
        </div>

        <p className="text-center text-sm text-muted mt-6">
          {t('termsAgreement')}
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
