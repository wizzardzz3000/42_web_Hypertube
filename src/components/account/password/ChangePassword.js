import React, { useState, useContext } from "react"
import ValidateInput from "../../../services/ValidateInput";
import Infotoast from "../../../services/toasts/InfoToasts";
import ErrorToast from "../../../services/toasts/ErrorToasts";
import { GlobalContext } from "../../../context/GlobalContext";
import CustomLanguage from "../../../services/DefineLocale";
import axios from "axios";

const initialState = {
    pwd1: "",
    pwd2: "",
    pwd2Error: "",
    pwd1Valid: false,
    pwd1VerifyBox: "box-disabled",
    pwdHasLowercase: false,
    pwdHasUppercase: false,
    pwdHasNumber: false,
    pwdHasMinLen: false
}

const ChangePassword = (props) => {
  const [pwd, setPwd] = useState(initialState);
  const context = useContext(GlobalContext);
  const locale = context.locale;
  var lang = CustomLanguage.define(locale);  

  const handleChange = e => {
      let result;
      if (e.target.id === "pwd1") {
          result = ValidateInput.user("passwordHard", e.target.value);
          setPwd({ ...result, [e.target.id]: e.target.value });
      } else {
          setPwd({ ...pwd, [e.target.id]: e.target.value });
      }
  };

  const handleSubmit = async e => {
      e.preventDefault();
      
      await axios.post("/users/change-password", {
          username: props.username,
          pwd1: pwd.pwd1,
          pwd2: pwd.pwd2
        })
      .then(res => {
          if (res.data.status === "success") {
              Infotoast.custom.info(lang.reset_password[0].reset_password_success, 4000);
              props.closePasswordSwitch();
          }
      })
      .catch(err => {
          ErrorToast.custom.error(lang.reset_password[0][err.response.data.error], 4000);
      });
  }

  return (
      <div className="change-password-block"><form
      className="reset-password-form"
      onSubmit={handleSubmit}
    >
      <div className="input-field col s12">
        <input
          type="password"
          id="pwd1"
          autoComplete="password"
          className="form-input-fields"
          onChange={handleChange}
          onFocus={e =>
            setPwd({ ...pwd, pwd1VerifyBox: "box-enabled" })
          }
          onBlur={e =>
            setPwd({ ...pwd, pwd1VerifyBox: "box-disabled" })
          }
          required
        />
        <div
          className={"password-message " + pwd.pwd1VerifyBox}
        >
          <h3 id="pwd1-verify-title">
            {lang.register[0].spaces}
          </h3>
          <p
            id="letter"
            className={
              pwd.pwdHasLowercase ? "valid" : "invalid"
            }
          >
            {lang.register[0].oneLetter}
            <b>{lang.register[0].lowercase}</b>{" "}
          </p>
          <p
            id="capital"
            className={
              pwd.pwdHasUppercase ? "valid" : "invalid"
            }
          >
            {lang.register[0].oneLetter}
            <b>{lang.register[0].uppercase}</b>{" "}
          </p>
          <p
            id="number"
            className={pwd.pwdHasNumber ? "valid" : "invalid"}
          >
            {lang.register[0].oneNumber}{" "}
            <b>{lang.register[0].number}</b>
          </p>
          <p
            id="length"
            className={pwd.pwdHasMinLen ? "valid" : "invalid"}
          >
          {lang.register[0].minimum}{" "}
          <b>{lang.register[0].characters}</b>
        </p>
        </div>
        <label className="label-form" htmlFor="pwd1">
          {lang.reset_password[0].pwd}
        </label>
      </div>
      <div className="input-field col s12">
        <input
          type="password"
          id="pwd2"
          autoComplete="password"
          className="form-input-fields"
          onChange={handleChange}
        ></input>
        <div className="register-error">
          {pwd.pwd2 !== pwd.pwd1 &&
          pwd.pwd2 !== ""
            ? lang.pwd_match_error
            : ""}
        </div>
        <label className="label-form" htmlFor="pwd2">
          {lang.reset_password[0].repeat_pwd}
        </label>
      </div>
      <input
        type="submit"
        name="submit"
        value={lang.reset_password[0].submit}
        className="btn btn-submit-form"
        disabled={
          !pwd.pwd1Valid || pwd.pwd2 !== pwd.pwd1
        }
      />
    </form>
    </div>
  )
}

export default ChangePassword;