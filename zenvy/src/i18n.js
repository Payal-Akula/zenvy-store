import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector) 
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: false,

    interpolation: {
      escapeValue: false,
    },

    resources: {
      en: {
        translation: {
          support: "Support",
          delivering: "Delivering to",
          cart: "Cart",
          product: "Product",
          price: "Price"
        }
      },
      hi: {
        translation: {
          support: "सपोर्ट",
          delivering: "डिलीवर किया जा रहा है",
          cart: "कार्ट",
          product: "उत्पाद",
          price: "कीमत"
        }
      },
      te: {
        translation: {
          support: "సపోర్ట్",
          delivering: "డెలివరీ స్థలం",
          cart: "కార్ట్",
          product: "ఉత్పత్తి",
          price: "ధర"
        }
      },
      ta: {
        translation: {
          support: "ஆதரவு",
          delivering: "விநியோக இடம்",
          cart: "கார்ட்",
          product: "தயாரிப்பு",
          price: "விலை"
        }
      },
      ml: {
        translation: {
          support: "സഹായം",
          delivering: "ഡെലിവറി സ്ഥലം",
          cart: "കാർട്ട്",
          product: "ഉൽപ്പന്നം",
          price: "വില"
        }
      }
    }
  });

export default i18n;