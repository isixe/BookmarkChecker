import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import zh from "./zh-CN.json";

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    lng: "en",
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",
    interpolation: { escapeValue: false },
    returnObjects: true,
  });
}

export default i18next;
