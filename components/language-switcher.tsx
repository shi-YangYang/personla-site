"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { localeNames, locales, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const segments = pathname.split("/");
  const currentLocale = (segments[1] ?? "zh") as Locale;
  const rest = segments.slice(2).join("/");

  const switchTo = (next: Locale) => {
    if (next === currentLocale) return;
    startTransition(() => {
      router.push(`/${next}${rest ? `/${rest}` : ""}`);
    });
  };

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-brand-primary/20 bg-bg-base/50 text-xs font-mono">
      {locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchTo(loc)}
          disabled={pending}
          className={cn(
            "px-3 py-1 rounded-full transition-colors",
            currentLocale === loc
              ? "bg-brand-primary text-bg-base font-medium"
              : "text-text-muted hover:text-text-secondary hover:bg-brand-primary/10",
          )}
          aria-label={localeNames[loc]}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
