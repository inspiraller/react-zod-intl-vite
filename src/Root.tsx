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
