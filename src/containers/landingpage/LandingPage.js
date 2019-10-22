import React, { Component } from "react";
import "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import "./LandingPage.scss";
import Navbar from "../../components/navbar/NavBar";
import AuthService from "../../services/AuthService";
import { LpBigButton } from "../../components/buttons/BigButtons";
import { withRouter } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import InfoToast from "../../services/toasts/InfoToasts";
import CustomLanguage from "../../services/DefineLocale";

class LandingPage extends Component {
  constructor(props) {
    super(props);
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

  render() {
    return (
      <GlobalContext.Consumer>
        {context => {
          const locale = context.locale;
          var lang = CustomLanguage.define(locale);
          return (
            <div className="App">
              <Navbar />
              <div className="container-background-image">
                <div className="landing-page-title row">
                  {lang.home[0].line1}
                </div>
                <div className="landing-page-content">
                  <div className="landing-page-content-text">
                    {lang.home[0].line2}
                  </div>
                  <div className="landing-page-content-title-second">
                    <i className="material-icons icons-red landing-page-content-title-icon">
                      money_off
                    </i>
                    {lang.home[0].line3}
                  </div>
                  <LpBigButton value={lang.home[0].try_it} />
                </div>
              </div>
            </div>
          );
        }}
      </GlobalContext.Consumer>
    );
  }
}
export default withRouter(LandingPage);
