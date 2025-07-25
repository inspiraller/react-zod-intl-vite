# React - Zod - Intl - Vite
this is an example of how to use react-hook-form with zod, and custom translation loaded into zod.

## Directory structure of key files:
```pgsql
my-app/
├─ public/
│  ├─ locales/
│  │  ├─ en/
│  │  │  └─ translation.json
│  │  │  └─ zod.json
├─ src/
│  ├─ i18n.ts
│  ├─ main.tsx
│  ├─ App.tsx
│  └─ components/
       └─ FormExample.tsx
```
## src/i18n.ts
```json
  backend: {
    loadPath: "/locales/{{lng}}/{{ns}}.json", // path to load translations
  },
```
OR
```json
  resources: {
    en: {
      zod: {
        errors: {}
      },
    },
  },
```

## public/locales/en/translation.json
Example. See local file for complete json.
```json
{
  "errors": {
    ...,
    "invalid_type": "OVERRIDE Expected {expected}, received {received}",
    "too_small": {
      "string": {
        "inclusive": "OVERRIDE String must contain at least {minimum} character(s)",
        "inclusive_one": "String must contain at least {minimum} character",
        "inclusive_other": "String must contain at least {minimum} characters",
        "inclusive_with_path": "{path} OVERRIDE1 must contain at least {minimum} character(s)",
        "inclusive_with_path_one": "{path} OVERRIDE2 must contain at least {minimum} character",
        "inclusive_with_path_other": "{path} OVERRIDE3 must contain at least {minimum} characters",
        "not_inclusive": "String must contain over {minimum} character(s)",
        "not_inclusive_one": "String must contain over {minimum} character",
        "not_inclusive_other": "String must contain over {minimum} characters",
        "not_inclusive_with_path": "{path} OVERRIDE4 must contain over {minimum} character(s)",
        "not_inclusive_with_path_one": "{path} OVERRIDE5 must contain over {minimum} character",
        "not_inclusive_with_path_other": "{path} OVERRIDE6 must contain over {minimum} characters"
      }
    },
  }
}
```

## Root.tsx
```tsx
import React, { Suspense, useState, useEffect } from "react";
import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";
import { initI18n } from "./i18n";
import App from "./App";
import { Loader } from "./components/Loader";

export const Root = () => {
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    const userLang = navigator.language.split("-")[0] || "en";
    initI18n(userLang).then(() => {
      // Test:
      // const t = (key: string, options?: any) =>
      //   i18n.t(key, { ns: "zod", ...options });
      // console.log("errors.invalid_type=", t("errors.invalid_type"));
      //z.setErrorMap(makeZodI18nMap({ t: t as unknown as TFunction }));

      z.setErrorMap(makeZodI18nMap());
      setI18nReady(true);
    });
  }, []);

  if (!i18nReady) {
    return <Loader />;
  }

  return (
    <React.StrictMode>
      <Suspense fallback={<Loader />}>
        <App />
      </Suspense>
    </React.StrictMode>
  );
};
```

# Test
- npm run dev
- just press submit to see errors

Expect
> {path} OVERRIDE3 must contain at least {minimum} characters

Will have used local translation