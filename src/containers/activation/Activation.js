import React, { Component } from "react";
import "materialize-css/dist/css/materialize.min.css";
import NavBar from "../../components/navbar/NavBar";
import InfoToast from "../../services/toasts/InfoToasts";
import ErrorToast from "../../services/toasts/ErrorToasts";
import { GlobalContext } from "../../context/GlobalContext";
import CustomLanguage from "../../services/DefineLocale";
import axios from "axios";

class Activation extends Component {
  static contextType = GlobalContext;
  constructor(props) {
    super(props);
    this.state = {
      status: false
    };
  }

  componentDidMount() {
    let key = document.location.href;
    key = key.split("=");
    key = key[key.length - 1];
    let username = document.location.href;
    username = username.split("=");
    username = username[username.length - 2].split("&", -1)[0];
    var lang = CustomLanguage.define(this.context.locale);

    axios
      .post("/users/activation", {
        username: username,
        key: key
      })
      .then(res => {
        if (res.data.status)
          InfoToast.custom.info(lang.activate_account[0].activation_success, 4000);
        if (res.data.message) ErrorToast.custom.error(lang.activate_account[0][res.data.message], 4000);
        this.props.history.push("/login");
      })
      .catch(err => {
        ErrorToast.custom.error(lang.activate_account[0].activation_failed, 4000);
        this.props.history.push("/login");
      });
  }

  render() {
    return (
      <div className="App">
        <NavBar />
      </div>
    );
  }
}

export default Activation;
