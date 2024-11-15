import React from "react";
import { CSSTransition } from "react-transition-group";
import "./OverlayTransisi.css";

const OverlayTransisi = ({ inProp, children }) => {
  return (
    <CSSTransition
      in={inProp}
      timeout={500}
      classNames="overlay"
      unmountOnExit
    >
      <div className="overlay-container">{children}</div>
    </CSSTransition>
  );
};

export default OverlayTransisi;
