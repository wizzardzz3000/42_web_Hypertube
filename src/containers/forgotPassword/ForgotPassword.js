import React, { Component } from "react";
import NavBar from "../../components/navbar/NavBar";
import ValidateInput from "../../services/ValidateInput";
import InfoToast from "../../services/toasts/InfoToasts";
import ErrorToast from "../../services/toasts/ErrorToasts";
import { GlobalContext } from "../../context/GlobalContext";
import CustomLanguage from "../../services/DefineLocale";
import axios from "axios";

class ForgotPassword extends Component {
  static contextType = GlobalContext;
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      loginError: "",
      loginValid: false,
      locale: "en"
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleChange = e => {
    let result = ValidateInput.user("login", e.target.value);
    this._isMounted &&
      this.setState({
        login: e.target.value,
        loginValid: result.loginValid,
        loginError: result.loginError
      });
  };

  handleSubmit = async e => {
    e.preventDefault();
    var lang = await CustomLanguage.define(this.context.locale);

    this._isMounted && await axios
      .post("/users/forgot-password", {
        login: this.state.login
      })
      .then(res => {
        this.props.history.push("/");
        InfoToast.custom.info(lang.forgot_password[0][res.data.message], 4000);
      })
      .catch(err => {
        ErrorToast.custom.error(lang.forgot_password[0][err.response.data.error], 4000);
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
                    <div className="title-page">{lang.forgot_password[0].title}</div>
                    <form
                      className="forgot-password-form"
                      onSubmit={this.handleSubmit}
                    >
                      <div className="input-field col s12">
                        <input
                          type="text"
                          id="user-login"
                          autoComplete="login"
                          className="form-input-fields"
                          value={this.state.login}
                          onChange={this.handleChange}
                        ></input>
                        <div className="login-error">{lang.login_error[0][this.state.loginError]}</div>
                        <label className="label-form" htmlFor="user-login">
                          {lang.forgot_password[0].input_title}
                        </label>
                      </div>
                      <input
                        type="submit"
                        name="submit"
                        autoComplete="submit"
                        value={lang.forgot_password[0].submit}
                        className="btn btn-submit-form"
                        disabled={!this.state.loginValid}
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

export default ForgotPassword;
