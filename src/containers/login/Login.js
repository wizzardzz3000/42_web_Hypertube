import React, { Component } from "react";
import "./Login.scss";
import "materialize-css/dist/css/materialize.min.css";
import NavBar from "../../components/navbar/NavBar";
import { NavLink } from "react-router-dom";
import AuthService from "../../services/AuthService";
import ValidateInput from "../../services/ValidateInput";
import TwitterLogo from "../../assets/Twitter_Logo_WhiteOnBlue.png";
import GoogleLogo from "../../assets/Google_Logo.png";
import GithubLogo from "../../assets/Github_Logo.png";
import SchoolLogo from "../../assets/42_Logo.png";
import axios from "axios";
import ErrorToast from "../../services/toasts/ErrorToasts";
import InfoToast from "../../services/toasts/InfoToasts";
import { GlobalContext } from "../../context/GlobalContext";
import CustomLanguage from "../../services/DefineLocale";

class Login extends Component {
  static contextType = GlobalContext;
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      password: "",
      loginError: "",
      pwdError: "",
      loginValid: false,
      pwdValid: false,
      responseToPost: "",
      locale: "en"
    };
    this.Auth = new AuthService();
    this._isMounted = false;
  }

  async componentDidMount() {
    this._isMounted = true;
    if (await this.Auth.isTokenValid()) {
      var lang = await CustomLanguage.define(this.context.locale);
      InfoToast.custom.info(lang.already_logged, 4000);
      this.props.history.replace("/search");
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  authGoogle = () => {
    window.location.replace("http://localhost:5000/auth/google");
  };
  authGithub = () => {
    window.location.replace("http://localhost:5000/auth/github");
  };
  auth42 = () => {
    window.location.replace("http://localhost:5000/auth/42");
  };
  authTwitter = () => {
    window.location.replace("http://localhost:5000/auth/twitter");
  };

  handleChange = e => {
    const isLogin = e.target.id === "user-login";
    const isPwd = e.target.id === "user-password";

    if (isLogin) {
      let result = ValidateInput.user("username", e.target.value);
      this._isMounted &&
        this.setState({
          login: e.target.value,
          loginValid: result.usernameValid,
          loginError: result.usernameError
        });
    }

    if (isPwd) {
      let result = ValidateInput.user("passwordSimple", e.target.value);
      this._isMounted &&
        this.setState({
          password: e.target.value,
          pwdValid: result.pwdValid,
          pwdError: result.pwdError
        });
    }
  };

  handleSubmit = async e => {
    e.preventDefault();
    var lang = await CustomLanguage.define(this.context.locale);
    
    this._isMounted && await axios
      .post("/users/login", {
        username: this.state.login,
        password: this.state.password
      })
      .then(async res => {
        if (res.data.status === "success") {
          await this.context.updateContext({locale: res.data.user.language, username: res.data.user.username, firstname: res.data.user.firstname, lastname: res.data.user.lastname, email: res.data.user.email, picture: res.data.user.picture, uid: res.data.user._id});
          await this.context.updateMoviesSeen(res.data.user.movies_seen);
          await this.context.updateFollowing(res.data.user.following);
          await this.Auth.setToken(res.data.token);
          await this.props.history.replace("/search");
        } else {
          ErrorToast.custom.error(lang.login_error[0][res.data.msg], 4000);
        }
      })
      .catch(err => {
        ErrorToast.custom.error(lang.login_error[0].login_failed, 4000);
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
                    <div className="title-page">{lang.login[0].log_in}</div>
                    <form className="login-form" onSubmit={this.handleSubmit}>
                      <div className="input-field col s12">
                        <input
                          type="text"
                          id="user-login"
                          className="form-input-fields"
                          autoComplete="login"
                          value={this.state.login}
                          onChange={this.handleChange}
                        ></input>
                        <div className="login-error">
                          {lang.username_error[0][this.state.loginError]}
                        </div>
                        <label className="label-form" htmlFor="user-login">
                          {lang.login[0].username}
                        </label>
                      </div>
                      <div className="input-field col s12">
                        <input
                          type="password"
                          id="user-password"
                          className="form-input-fields"
                          autoComplete="password"
                          value={this.state.password}
                          onChange={this.handleChange}
                        ></input>
                        <div className="login-error">
                          {lang.passwordSimple_error[0][this.state.pwdError]}
                        </div>
                        <label className="label-form" htmlFor="user-password">
                          {lang.login[0].password}
                        </label>
                      </div>
                      <input
                        type="submit"
                        name="submit"
                        autoComplete="submit"
                        value={lang.login[0].login}
                        className="btn btn-submit-form"
                        disabled={
                          !this.state.loginValid || !this.state.pwdValid
                        }
                      />
                    </form>
                    <div className="register-login-with-social">
                      <p className="register-login-social-text">
                        {lang.login[0].other}
                      </p>
                      <img
                        onClick={this.auth42}
                        src={SchoolLogo}
                        alt="42 logo"
                        className="third-party-logo"
                      ></img>
                      <img
                        onClick={this.authTwitter}
                        src={TwitterLogo}
                        alt="twitter logo"
                        className="third-party-logo"
                      ></img>
                      <img
                        onClick={this.authGoogle}
                        src={GoogleLogo}
                        alt="google logo"
                        className="third-party-logo"
                      ></img>
                      <img
                        onClick={this.authGithub}
                        src={GithubLogo}
                        alt="github logo"
                        className="third-party-logo"
                      ></img>
                    </div>
                    <p className="register-login-link link-left">
                      {lang.login[0].forgot_pwd}{" "}
                      <NavLink className="red-link" to="/forgot-password">
                        {lang.login[0].click_here}
                      </NavLink>
                    </p>
                    <p className="register-login-link link-right">
                      {lang.login[0].no_account}{" "}
                      <NavLink className="red-link" to="/register">
                        {lang.login[0].register}
                      </NavLink>
                    </p>
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

export default Login;
