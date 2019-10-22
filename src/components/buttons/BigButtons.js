import React from "react";
import "./Buttons.scss";
import { Button } from "react-materialize";
import { NavLink } from "react-router-dom";

const LpBigButton = props => {
  return (
    <NavLink to="/register">
      <Button className="btn-regular btn-big modal-trigger">
        <span className="btn-regular-text">
          {props.value}
          <i className="material-icons icons-red btn-big-icon">
            arrow_forward_ios
          </i>
        </span>
      </Button>
    </NavLink>
  );
};

export { LpBigButton };
