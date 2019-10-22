import React from "react";
import "./Buttons.scss";
import { Button } from "react-materialize";

const ModalButtonRegular = ({ text, tooltip, href }) => {
  return (
    <Button
      tooltip={tooltip}
      className="btn-regular btn-modal modal-trigger"
      href={"#" + href}
    >
      <span className="btn-modal-text">{text.toUpperCase()}</span>
    </Button>
  );
};

const ModalButtonSecondary = ({ text, tooltip, href }) => {
  return (
    <Button
      tooltip={tooltip}
      className="btn-secondary btn-modal modal-trigger"
      href={"#" + href}
    >
      <span className="btn-modal-text">{text.toUpperCase()}</span>
    </Button>
  );
};

export { ModalButtonSecondary, ModalButtonRegular };
