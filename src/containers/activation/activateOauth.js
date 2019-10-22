import React, { Component } from "react";
import "materialize-css/dist/css/materialize.min.css";
import ErrorToast from "../../services/toasts/ErrorToasts";
import AuthService from "../../services/AuthService";

class ActivateOauth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: false
        };
        this.Auth = new AuthService();
    }

    componentDidMount() {
        let token = document.location.href;
        token = token.split("?token=");
        token = token[token.length - 1];
        if (token) {
            this.Auth.setToken(token);
            this.props.history.replace("/search");
        } else {
            ErrorToast.custom.error(
                "Impossible to log in with this account...",
                4000
            );
            this.props.history.replace("/login");
        }
    }

    render() {
        return <div className="App"></div>;
    }
}

export default ActivateOauth;
