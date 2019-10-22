import React, { Component } from "react";
import NavBar from "../../components/navbar/NavBar";
import ValidateInput from "../../services/ValidateInput";
import Infotoast from "../../services/toasts/InfoToasts";
import ErrorToast from "../../services/toasts/ErrorToasts";
import { GlobalContext } from "../../context/GlobalContext";
import CustomLanguage from "../../services/DefineLocale";
import Axios from "axios";

class ResetPassword extends Component {
  static contextType = GlobalContext;
  constructor(props) {
    super(props);
    this.state = {
      pwd1: "",
      pwd2: "",
      pwd2Error: "",
      pwd1Valid: false,
      pwd1VerifyBox: "box-disabled",
      pwdHasLowercase: false,
      pwdHasUppercase: false,
      pwdHasNumber: false,
      pwdHasMinLen: false,
      username: "",
      key: ""
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    if (
      document.location.href.includes("user=") &&
      document.location.href.includes("&key=")
    ) {
      let key = document.location.href;
      key = key.split("=");
      key = key[key.length - 1];
      let username = document.location.href;
      username = username.split("=");
      username = username[username.length - 2].split("&", -1)[0];
      this._isMounted && this.setState({ username: username, key: key });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleChange = e => {
    let result;
    if (e.target.id === "pwd1") {
      result = ValidateInput.user("passwordHard", e.target.value);
    }

    this._isMounted &&
      this.setState({ [e.target.id]: e.target.value, ...result });
  };

  handleSubmit = async e => {
    e.preventDefault();
    var lang = await CustomLanguage.define(this.context.locale);

    this._isMounted && Axios.post("/users/reset-password", {
      username: this.state.username,
      key: this.state.key,
      pwd1: this.state.pwd1,
      pwd2: this.state.pwd2
    })
      .then(res => {
        if (res.data.status === "success")
          Infotoast.custom.info(lang.reset_password[0].reset_password_success, 4000);
        this.props.history.push("/login");
      })
      .catch(err => {
        ErrorToast.custom.error(lang.reset_password[0][err.response.data.error], 4000);
      });
  };

  render() {
    return (
      <GlobalContext.Consumer>
        {context => {
          const locale = context.locale;
          var lang = CustomLanguage.define(locale);
          return (
            <div className="App">
              <NavBar />
              <div className="container-background">
                <div className="row">
                  <div className="card-panel center auth-card">
                    <div className="title-page">{lang.reset_password[0].title}</div>
                    <form
                      className="reset-password-form"
                      onSubmit={this.handleSubmit}
                    >
                      <div className="input-field col s12">
                        <input
                          type="password"
                          id="pwd1"
                          autoComplete="password"
                          className="form-input-fields"
                          value={this.state.pwd1}
                          onChange={this.handleChange}
                          onFocus={e =>
                            this.setState({ pwd1VerifyBox: "box-enabled" })
                          }
                          onBlur={e =>
                            this.setState({ pwd1VerifyBox: "box-disabled" })
                          }
                          required
                        />
                        <div
                          className={"password-message " + this.state.pwd1VerifyBox}
                        >
                          <h3 id="pwd1-verify-title">
                            {lang.register[0].spaces}
                          </h3>
                          <p
                            id="letter"
                            className={
                              this.state.pwdHasLowercase ? "valid" : "invalid"
                            }
                          >
                            {lang.register[0].oneLetter}
                            <b>{lang.register[0].lowercase}</b>{" "}
                          </p>
                          <p
                            id="capital"
                            className={
                              this.state.pwdHasUppercase ? "valid" : "invalid"
                            }
                          >
                            {lang.register[0].oneLetter}
                            <b>{lang.register[0].uppercase}</b>{" "}
                          </p>
                          <p
                            id="number"
                            className={this.state.pwdHasNumber ? "valid" : "invalid"}
                          >
                            {lang.register[0].oneNumber}{" "}
                            <b>{lang.register[0].number}</b>
                          </p>
                          <p
                            id="length"
                            className={this.state.pwdHasMinLen ? "valid" : "invalid"}
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
                          value={this.state.pwd2}
                          onChange={this.handleChange}
                        ></input>
                        <div className="register-error">
                          {this.state.pwd2 !== this.state.pwd1 &&
                          this.state.pwd2 !== ""
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
                          !this.state.pwd1Valid || this.state.pwd2 !== this.state.pwd1
                        }
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
      );
      }}
      </GlobalContext.Consumer>
    );
  }
}

export default ResetPassword;
