// Custom error map function for global translations

import z, { locales } from "zod";
import { useEffect } from "react";
export type ZodBuiltInLocale = keyof typeof locales;
type fnErrorMap = z.core.$ZodErrorMap<z.core.$ZodIssue>; // (iss: string, ctx?: any) => { message: string };

// export const customErrorMap: fnErrorMap = (iss) => {
//   switch (iss.code) {
//     case "invalid_type":
//       if (iss.expected === "string") {
//         return { message: "This field must be text" };
//       }
//       if (iss.expected === "number") {
//         return { message: "This field must be a number" };
//       }
//       break;

//     case "too_small":
//       if (iss.type === "string") {
//         return {
//           message: `Must be at least ${iss.minimum} characters long`,
//         };
//       }
//       if (iss.type === "number") {
//         return {
//           message: `Must be at least ${iss.minimum}`,
//         };
//       }
//       break;

//     case "too_big":
//       if (iss.type === "string") {
//         return {
//           message: `Must be no more than ${iss.maximum} characters long`,
//         };
//       }
//       if (iss.type === "number") {
//         return {
//           message: `Must be no more than ${iss.maximum}`,
//         };
//       }
//       break;

//     case "invalid_string":
//       if (iss.validation === "email") {
//         return { message: "Please enter a valid email address" };
//       }
//       if (iss.validation === "url") {
//         return { message: "Please enter a valid URL" };
//       }
//       break;

//     case "custom":
//       return { message: iss.params?.message || "Invalid input" };

//     default:
//       // Return undefined to use default error message
//       return { message: undefined };
//   }

//   // Return undefined to use default error message
//   return { message: undefined };
// };

//setupLocale(userLang);
//setupLocale("de");

type PropWindow = { zodCustomEn: () => { localeError: fnErrorMap } };

interface Props {
  locale: ZodBuiltInLocale;
  isReady: boolean;
}
export const useSetupLocale = ({ locale, isReady }: Props) => {

  useEffect(() => {
    if (isReady) {
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
    }
  }, [isReady, locale]);
};
