import React, { createContext, Component } from "react";
import axios from "axios";
import AuthService from "../services/AuthService";

export const GlobalContext = createContext({
  locale: "en",
  username: "",
  firstname: "",
  lastname: "",
  email: "",
  uid: "",
  picture: "",
  following: [],
  loaded: false,
  setLocale: () => {},
  updateContext: () => {},
  resetContext: () => {},
  updateMoviesSeen: () => {}
});

class GlobalContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locale: "en",
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      uid: "",
      picture: "",
      movies_seen: [],
      following: [],
      loaded: true,
      setLocale: data => this.setState({ locale: data }),
      updateContext: data =>
        this.setState({
          locale: data.locale,
          username: data.username,
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          picture: data.picture,
          uid: data.uid,
          loaded: true
        }),
      updateFollowing: data =>
        this.setState({
          following: data
        }),
      updateMoviesSeen: data =>
        this.setState({
          movies_seen: data
        }),
      resetContext: () =>
        this.setState({
          locale: this.state.locale,
          username: "",
          firstname: "",
          lastname: "",
          email: "",
          uid: "",
          picture: "",
          following: [],
          movies_seen: []
        })
    };
    this.Auth = new AuthService();
    this._isMounted = false;
  }

    async componentDidMount() {
        this._isMounted = true;
        var token = await this.Auth.getToken();
        if (token && this.state.username === "") {
          this._isMounted && await axios
                .get("/users/session", { headers: { Authorization: token } })
                .then(async res => {
                  this._isMounted && await this.setState({
                        locale: res.data.language ? res.data.language : "",
                        username: res.data.username ? res.data.username : "",
                        firstname: res.data.firstname ? res.data.firstname : "",
                        lastname: res.data.lastname ? res.data.lastname : "",
                        email: res.data.email ? res.data.email : "",
                        uid: res.data._id ? res.data._id : "",
                        picture: res.data.img ? res.data.img : "",
                        movies_seen: res.data.movies_seen
                            ? res.data.movies_seen
                            : [],
                        following: res.data.following ? res.data.following : [],
                        loaded: true
                    });
                })
                .catch(err => {
                    console.log("Cannot update GlobalContext");
                });
        } else if (!token) {
          this._isMounted && await this.setState({
                loaded: true
            });
        }
    }
  

    componentWillUnmount() {
      this._isMounted = false;
    }

    render() {
        return (
            <GlobalContext.Provider value={{ ...this.state }}>
                {this.state.loaded && this.props.children}
            </GlobalContext.Provider>
        );
    }
  }

export default GlobalContextProvider;
