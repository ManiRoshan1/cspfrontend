import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import te from "./locales/te.json";
import kn from "./locales/kn.json";
import ta from "./locales/ta.json";
import ml from "./locales/ml.json";
import hi from "./locales/hi.json";

const resources = {
  en: { translation: en },
  te: { translation: te },
  kn: { translation: kn },
  ta: { translation: ta },
  ml: { translation: ml },
  hi: { translation: hi }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
