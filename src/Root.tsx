import React, { useState, useEffect, Suspense } from "react";
import { useSetupLocale, type ZodBuiltInLocale } from "./util/useSetupLocale";
import { Loader } from "./components/Loader";
import App from "./App";
import { initI18n } from "./i18n";

export const Root = () => {
  const [isI18nReady, setisI18nReady] = useState<boolean>(false);

  useEffect(() => {
    // Set up global Zod locale with translations from next-intl

    const userLang = (navigator.language.split("-")[0] ||
      "en") as ZodBuiltInLocale;
    initI18n(userLang).then(() => {

 
      setisI18nReady(true);

    });
  });

  //setupLocale(userLang);
  useSetupLocale({locale: "en", isReady: isI18nReady});

  if (!isI18nReady) {
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
