import React, { Component } from "react";
import AuthService from "../services/AuthService";
import LoadingFullScreen from "../components/loadingAnim/LoadingFullScreen";

// HOC to wrap component and verify authentication
export default function withAuth(AuthComponent) {
  const Auth = new AuthService();

  return class AuthWrapped extends Component {
    constructor(props) {
      super(props);
      this._isMounted = false;
    }
    state = {
      loaded: false
    };

    async componentDidMount() {
      this._isMounted = true;
      if (!(await Auth.loggedIn())) {
        Auth.logout();
        this.props.history.replace("/login");
      } else {
        this._isMounted && this.setState({
          loaded: true
        });
      }
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    render() {
      if (this.state.loaded === true) {
        return <AuthComponent history={this.props.history} />;
      } else {
        return <LoadingFullScreen/>;
      }
    }
  };
}
