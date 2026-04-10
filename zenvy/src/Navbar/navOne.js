import React from "react";
import Location from "./Location";
import Language from "./Language";
import { useTranslation } from "react-i18next";

function NavOne() {
  const { t } = useTranslation();

  return (
    <>
      <nav className="top-nav w-100 bg-dark"> 
        <div className="container-fluid container-md">
          <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 gap-sm-0">
            <div className="mb-2 mb-sm-0">
              <Location /> 
            </div>
            <div className="d-flex flex-row gap-3 align-items-center">
          
              <span className="d-flex align-items-center gap-1 support-link">
                <i className="bi bi-headset"></i>
                <span className="d-none d-sm-inline">{t("support")}</span>
                <span className="d-inline d-sm-none">{t("support")}</span>
              </span>

              <span className="d-flex align-items-center gap-1 language-selector" style={{cursor:"pointer"}}>
                <i className="bi bi-globe"></i>
                <Language/>
              </span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavOne;