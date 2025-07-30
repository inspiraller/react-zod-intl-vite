// Custom error map function for global translations

import z, { locales } from "zod";
import { useEffect } from "react";
import type { zodLocale } from "@/@types";
import { useCustomZodLocale } from "./useCustomZodLocale";

interface Props {
  locale: zodLocale;
  children: React.ReactNode;
}
export const ZodSetup = ({ locale, children }: Props) => {
  // OPTION 1: Use for internal zod languages
  // useEffect(() => {
  //   const localeError = locales[locale]().localeError;
  //   z.config({ localeError: localeError });
  // }, [locale]);

  // OPTION 2: Use for dynamic custom languages
  useCustomZodLocale({ locale });

  return children;
};
