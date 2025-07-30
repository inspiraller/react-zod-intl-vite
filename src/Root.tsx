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
    // Set up global Zod locale with translations from next-intl

    initI18n(locale).then(() => {
      setisI18nReady(true);
    });
  });

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
