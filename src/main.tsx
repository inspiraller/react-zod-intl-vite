import ReactDOM from "react-dom/client";


import React, { useState, useEffect, Suspense } from "react";

import { Loader } from "./components/Loader";
import App from "./App";
import i18n, { initI18n } from "./i18n";
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


const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Root />);
