# React - Zod - Intl - Vite
this is an example of how to use react-hook-form with zod, and custom translation loaded into zod.

## Directory structure of key files:
```pgsql
my-app/
├─ public/
│  ├─ locales/
│  │  ├─ en/
│  │  │  └─ translation.json
│  │  │  └─ zodv4.js // <-- This is a direct copy from zod node_modules folder with some tweaks to load as a template and overriden text.
├─ src/
│  ├─ App.tsx
│  ├─ i18n.ts
│  ├─ main.tsx
│  └─ components/
       └─ FormExample.tsx
```
## src/i18n.ts
```json
  backend: {
    loadPath: "/locales/{{lng}}/{{ns}}.json", // path to load translations
  },
```

## public/locales/en/zodv4.js
Extracted from node_modules/zod locales folder.
- Replaced imports with util methods.
```js
const util = {
  stringifyPrimitive: (value) => {
    if (typeof value === "bigint") return value.toString() + "n";
    if (typeof value === "string") return `"${value}"`;
    return `${value}`;
  },
  joinValues: (array, separator = "|") => {
    return array.map((val) => stringifyPrimitive(val)).join(separator);
  },
};
// extract
// case "too_small": {
//   const adj = issue.inclusive ? ">=" : ">";
//   const sizing = getSizing(issue.origin);
//   if (sizing) {
//     return `Too small: expected OVERRIDE ${
//       issue.origin
//     } to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
//   }
//   return `Too small: expected OVERIDDE !!! ${
//     issue.origin
//   } to be ${adj}${issue.minimum.toString()}`;
// }
```

## main.tsx
```tsx
import React, { useState, useEffect, Suspense } from "react";

import { Loader } from "./components/Loader";
import App from "./App";
import { initI18n } from "./i18n";
import type { zodLocale } from "./@types";
import { ZodSetup } from "./zod/ZodSetup";

export const Root = () => {
  const [isI18nReady, setisI18nReady] = useState<boolean>(false);
  const locale = (navigator.language.split("-")[0] || "en") as zodLocale;

  useEffect(() => {
    if (!isI18nReady) {
      initI18n(locale).then(() => {
        setisI18nReady(true);
      });
    } else {
      i18n.changeLanguage(locale);
    }
  }, [locale, isI18nReady]);

  if (!isI18nReady) {
    return <Loader />;
  }

  return (
    <React.StrictMode>
      <Suspense fallback={<Loader />}>
        <ZodSetup locale={locale}>
          <App />
        </ZodSetup>
      </Suspense>
    </React.StrictMode>
  );
};
```

## ZodSetup.tsx
```tsx
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
```

## useCustomZodLocale.tsx
```tsx
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
```

## FormExample.tsx
```tsx
import { useForm } from "react-hook-form";

import z from "zod";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { zodResolver } from "@/zod/zodResolver";

export const FormExample = () => {
  const schema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
  });

  type PropsFormExample = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropsFormExample>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const { t } = useTranslation();

  const tZod = (key: string, options?: any) =>
    i18n.t(key, { ns: "zodv3_old_map", ...options });

  const onSubmit = (data: PropsFormExample) => {
    alert(JSON.stringify(data, null, 2));

    console.log("OG text=", t("Generic.submit"));
    console.log(
      "tZod('errors.invalid_type', {expected, recieved})=",
      tZod("errors.invalid_type", {
        expected: "string",
        received: "number",
      })
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("username")} placeholder="Username" />
      {errors.username && (
        <p style={{ color: "red" }}>{errors.username.message}</p>
      )}

      <input type="password" {...register("password")} placeholder="Password" />
      {errors.password && (
        <p style={{ color: "red" }}>{errors.password.message}</p>
      )}

      <button type="submit">Submit</button>
    </form>
  );
};
```

# Test
- npm run dev
- just press submit to see errors

Expect
> Too small: expected OVERRIDE string to have >=3 characters
