"use client";

import { useTranslations } from "next-intl";

interface CookingLoaderProps {
  message?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
}

export default function CookingLoader({
  message,
  description,
  size = "md",
}: CookingLoaderProps) {
  const t = useTranslations("aiImport");

  const displayMessage = message ?? t("scraping");
  const displayDescription = description ?? t("scrapingDescription");

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const potSize = sizeClasses[size];

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      {/* Pot with Steam Animation */}
      <div className="relative">
        {/* Steam bubbles */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1">
          <div
            className="w-2 h-2 bg-muted/60 rounded-full animate-steam-1"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="w-1.5 h-1.5 bg-muted/40 rounded-full animate-steam-2"
            style={{ animationDelay: "0.3s" }}
          />
          <div
            className="w-2 h-2 bg-muted/50 rounded-full animate-steam-3"
            style={{ animationDelay: "0.6s" }}
          />
        </div>

        {/* Cooking Pot SVG */}
        <div className={`${potSize} relative`}>
          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full animate-pot-wobble"
          >
            {/* Pot body */}
            <path
              d="M12 28C12 28 10 48 14 52C18 56 46 56 50 52C54 48 52 28 52 28"
              className="fill-primary/20 stroke-primary"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Pot rim */}
            <ellipse
              cx="32"
              cy="28"
              rx="22"
              ry="6"
              className="fill-primary stroke-primary"
              strokeWidth="2"
            />
            {/* Left handle */}
            <path
              d="M8 32C4 32 4 40 8 40"
              className="stroke-primary"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right handle */}
            <path
              d="M56 32C60 32 60 40 56 40"
              className="stroke-primary"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Lid knob */}
            <circle
              cx="32"
              cy="20"
              r="4"
              className="fill-primary"
            />
            {/* Lid */}
            <ellipse
              cx="32"
              cy="24"
              rx="18"
              ry="4"
              className="fill-primary/80 stroke-primary"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>

      {/* Message */}
      <div className="text-center space-y-1">
        <p className="font-medium text-foreground">{displayMessage}</p>
        {displayDescription && (
          <p className="text-sm text-muted">{displayDescription}</p>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes steam-rise {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.8);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-20px) scale(1.2);
          }
        }

        @keyframes pot-wobble {
          0%, 100% {
            transform: rotate(-1deg);
          }
          50% {
            transform: rotate(1deg);
          }
        }

        :global(.animate-steam-1) {
          animation: steam-rise 1.5s ease-out infinite;
        }

        :global(.animate-steam-2) {
          animation: steam-rise 1.5s ease-out infinite;
          animation-delay: 0.3s;
        }

        :global(.animate-steam-3) {
          animation: steam-rise 1.5s ease-out infinite;
          animation-delay: 0.6s;
        }

        :global(.animate-pot-wobble) {
          animation: pot-wobble 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
