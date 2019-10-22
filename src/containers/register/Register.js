import React, { Component } from "react";
import "materialize-css/dist/css/materialize.min.css";
import "./Register.scss";
import NavBar from "../../components/navbar/NavBar";
import { NavLink } from "react-router-dom";
import ValidateInput from "../../services/ValidateInput";
import TwitterLogo from "../../assets/Twitter_Logo_WhiteOnBlue.png";
import GoogleLogo from "../../assets/Google_Logo.png";
import GithubLogo from "../../assets/Github_Logo.png";
import SchoolLogo from "../../assets/42_Logo.png";
import ErrorToast from "../../services/toasts/ErrorToasts";
import InfoToast from "../../services/toasts/InfoToasts";
import { GlobalContext } from "../../context/GlobalContext";
import CustomLanguage from "../../services/DefineLocale";
import AuthService from "../../services/AuthService";
import UserPictureModify from "../../components/pictures/UserPictureModify";

import axios from "axios";

class Register extends Component {
  static contextType = GlobalContext;
  constructor(props) {
    super(props);
    this.state = {
      lang: "",
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      pwd1: "",
      pwd2: "",
      lastnameError: "",
      firstnameError: "",
      usernameError: "",
      emailError: "",
      pwd2Error: "",
      lastnameValid: false,
      firstnameValid: false,
      usernameValid: false,
      emailValid: false,
      pwd1Valid: false,
      pwd1VerifyBox: "box-disabled",
      pwdHasLowercase: false,
      pwdHasUppercase: false,
      pwdHasNumber: false,
      pwdHasMinLen: false,
      pictureUrl: "",
      pictureValid: false
    };
    this._isMounted = false;
    this.Auth = new AuthService();
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
    let result;
    if (e.target.id === "pwd1") {
      result = ValidateInput.user("passwordHard", e.target.value);
    } else if (e.target.id !== "pwd2") {
      result = ValidateInput.user(e.target.id, e.target.value);
    }
    this._isMounted &&
      this.setState({ [e.target.id]: e.target.value, ...result });
  };

  handlePicture = picture => {
    this._isMounted &&
      this.setState({
        pictureValid: picture.status,
        pictureUrl: picture.url
      });
  };

  handleSubmit = async e => {
    e.preventDefault();

    var lang = await CustomLanguage.define(this.context.locale);
    this._isMounted && await axios
      .post("/users/register", {
        username: this.state.username,
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        email: this.state.email,
        pwd1: this.state.pwd1,
        pwd2: this.state.pwd2,
        picture: this.state.pictureUrl,
        language: this.context.locale
      })
      .then(res => {
        if (res.data.status === "success") {
          var lang = CustomLanguage.define(this.context.locale);
          InfoToast.custom.info(lang.register[0].confirmation, 4000);
          this.props.history.push("/login");
        }
      })
      .catch(err => {
        ErrorToast.custom.error(lang.register_error[0][err.response.data.error], 4000);
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
                  {" "}
                  <div className="card-panel center auth-card">
                    {" "}
                    <div className="title-page">
                      {lang.register[0].register}
                    </div>
                    <div className="register-picture-box">
                      <UserPictureModify pictureToParent={this.handlePicture} />
                    </div>
                    <form
                      className="register-form"
                      onSubmit={this.handleSubmit}
                    >
                      <div className="input-field col s12">
                        <input
                          type="text"
                          id="username"
                          className="form-input-fields"
                          autoComplete="username"
                          value={this.state.username}
                          onChange={this.handleChange}
                        ></input>
                        <div className="register-error">
                          {lang.username_error[0][this.state.usernameError]}
                        </div>
                        <label className="label-form" htmlFor="username">
                          {lang.register[0].username}
                        </label>
                      </div>
                      <div className="input-field col s6">
                        <input
                          type="text"
                          id="firstname"
                          autoComplete="firstname"
                          className="form-input-fields"
                          value={this.state.firstname}
                          onChange={this.handleChange}
                        ></input>
                        <div className="register-error">
                          {lang.firstname_error[0][this.state.firstnameError]}
                        </div>
                        <label className="label-form" htmlFor="firstname">
                          {lang.register[0].firstname}
                        </label>
                      </div>
                      <div className="input-field col s6">
                        <input
                          type="text"
                          id="lastname"
                          autoComplete="lastname"
                          className="form-input-fields"
                          value={this.state.lastname}
                          onChange={this.handleChange}
                        ></input>
                        <div className="register-error">
                          {lang.firstname_error[0][this.state.lastnameError]}
                        </div>
                        <label className="label-form" htmlFor="lastname">
                          {lang.register[0].lastname}
                        </label>
                      </div>
                      <div className="input-field col s12">
                        <input
                          type="email"
                          id="email"
                          autoComplete="email"
                          className="form-input-fields"
                          value={this.state.email}
                          onChange={this.handleChange}
                        ></input>
                        <div className="register-error">
                          {lang.email_error[0][this.state.emailError]}
                        </div>
                        <label className="label-form" htmlFor="email">
                          {lang.register[0].email}
                        </label>
                      </div>
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
                          className={
                            "password-message " + this.state.pwd1VerifyBox
                          }
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
                            className={
                              this.state.pwdHasNumber ? "valid" : "invalid"
                            }
                          >
                            {lang.register[0].oneNumber}{" "}
                            <b>{lang.register[0].number}</b>
                          </p>
                          <p
                            id="length"
                            className={
                              this.state.pwdHasMinLen ? "valid" : "invalid"
                            }
                          >
                            {lang.register[0].minimum}{" "}
                            <b>{lang.register[0].characters}</b>
                          </p>
                        </div>
                        <label className="label-form" htmlFor="pwd1">
                          {lang.register[0].password}
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
                          {lang.register[0].repeat_pwd}
                        </label>
                      </div>
                      <input
                        type="submit"
                        name="submit"
                        value={lang.register[0].register}
                        className="btn btn-submit-form"
                        disabled={
                          !this.state.lastnameValid ||
                          !this.state.firstnameValid ||
                          !this.state.usernameValid ||
                          !this.state.emailValid ||
                          !this.state.pwd1Valid ||
                          this.state.pwd2 !== this.state.pwd1 ||
                          !this.state.pictureValid
                        }
                      />
                    </form>
                    <div className="register-login-with-social">
                      <p className="register-login-social-text">
                        {lang.register[0].other}
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
                    <p className="register-login-link link-right">
                      {lang.register[0].already_account}{" "}
                      <NavLink className="red-link" to="/login">
                        {lang.register[0].login}
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

export default Register;
