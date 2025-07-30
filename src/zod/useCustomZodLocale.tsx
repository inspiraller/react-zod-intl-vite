// Custom error map function for global translations

import z, { locales } from "zod";
import { useEffect } from "react";
import type { zodLocale } from "@/@types";

type fnErrorMap = z.core.$ZodErrorMap<z.core.$ZodIssue>; // (iss: string, ctx?: any) => { message: string };

type PropWindow = { zodCustomEn: () => { localeError: fnErrorMap } };

interface Props {
  locale: zodLocale;
}
export const useCustomZodLocale = ({ locale }: Props) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/locales/en/zodv4.js";

    script.onload = () => {
      const localeError =
        locale === "en"
          ? (window as unknown as PropWindow).zodCustomEn().localeError
          : locales[locale]().localeError;
      z.config({ localeError: localeError });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [locale]);
};
