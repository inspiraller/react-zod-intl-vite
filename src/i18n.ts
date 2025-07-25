import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

export const AVAILABLE_LOCALES = ["en"];
export const DEFAULT_LOCALE = "en";
export const initI18n = (locale = DEFAULT_LOCALE) =>
  i18n
    .use(Backend) // load translations from public/locales
    .use(LanguageDetector) // detect user language
    .use(initReactI18next) // pass to react-i18next
    .init({
      lng: locale,
      fallbackLng: DEFAULT_LOCALE,
      supportedLngs: AVAILABLE_LOCALES,

      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json", // path to load translations
      },
      // Alternative solution:
      // resources: {
      //   en: {
      //     zod: {
      //       errors: {}
      //     },
      //   },
      // },
      ns: ["translation", "zod"],
      defaultNS: "translation",
    });

export default i18n;
