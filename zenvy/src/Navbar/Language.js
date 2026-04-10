import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function Language() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "hi", label: "हिंदी", flag: "🇮🇳" },
    { code: "te", label: "తెలుగు", flag: "🇮🇳" },
    { code: "ta", label: "தமிழ்", flag: "🇮🇳" },
    { code: "ml", label: "മലയാളം", flag: "🇮🇳" }
  ];

  const current = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <div style={{ position: "relative" }}>
      
      <span onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
        {current.flag} {current.label}
      </span>

      {open && (
        <div style={{
          position: "absolute",
          top: "25px",
          right: "0",
          background: "#fff",
          color: "#000",
          borderRadius: "6px",
          padding: "5px",
          minWidth: "140px",
          zIndex: 1000
        }}>
          {languages.map((l) => (
            <div
              key={l.code}
              style={{ padding: "6px", cursor: "pointer" }}
              onClick={() => {
                i18n.changeLanguage(l.code);
                localStorage.setItem("i18nextLng", l.code); // persist
                setOpen(false);
              }}
            >
              {l.flag} {l.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Language