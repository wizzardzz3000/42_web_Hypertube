import React, { Component } from "react";
import "./NavBar.scss";
import AuthService from "../../services/AuthService";
import { withRouter, NavLink } from "react-router-dom";
import { LoginButton, RegisterButton } from "../buttons/Buttons";
import { Button } from "react-materialize";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import logo from "../../assets/hyperflix_logo2.png";
import { GlobalContext } from "../../context/GlobalContext";
import CountryPicker from "../buttons/CountryPicker";
import DefaultUserPic from "../../assets/default_user.png";
import CustomLanguage from "../../services/DefineLocale";

class NavBar extends Component {
  static contextType = GlobalContext;
  constructor(props) {
    super(props);
    this.state = {
      left: false,
      logged: false
    };
    this.Auth = new AuthService();
    this._isMounted = false;
  }

  async componentDidMount() {
    this._isMounted = true;
    if (await this.Auth.isTokenValid()) {
      this._isMounted && this.setState({logged: true});
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const useStyles = makeStyles(theme => ({
      margin: {
        margin: theme.spacing(2),
        marginRight: theme.spacing(3)
      },
      list: {
        width: 320
      }
    }));

    const MobileLoggedOutLinks = () => {
      const toggleMenu = (menu, open) => event => {
        if (
          event &&
          event.type === "keydown" &&
          (event.key === "Tab" || event.key === "Shift")
        ) {
          return;
        }

        this._isMounted && this.setState({ [menu]: open });
      };

      const classes = useStyles();

      const MobileMenuLoggedOut = menu => (
        <GlobalContext.Consumer>
          {context => {
            const locale = context.locale;
            var lang = CustomLanguage.define(locale);
            return (
              <div
                className={classes.list}
                role="presentation"
                onClick={toggleMenu(menu, false)}
                onKeyDown={toggleMenu(menu, false)}
              >
                <h5 style={{ textAlign: "center", color: "red" }}>Menu</h5>
                <List>
                  <ListItem>
                    <NavLink className="nav-mobile-menu-links" to="/login">
                      <i className="material-icons icons-red link-icon nav-mobile-menu-icons">
                        account_box
                      </i>
                      <span className="nav-mobile-menu-text">
                        {lang.navbar[0].login}
                      </span>
                    </NavLink>
                  </ListItem>
                  <ListItem>
                    <NavLink className="nav-mobile-menu-links" to="/register">
                      <i className="material-icons icons-red link-icon nav-mobile-menu-icons">
                        person_add
                      </i>
                      <span className="nav-mobile-menu-text">
                        {lang.navbar[0].register}
                      </span>
                    </NavLink>
                  </ListItem>
                </List>
              </div>
            );
          }}
        </GlobalContext.Consumer>
      );

      return (
        <div className="nav-mobile-menu">
          <Button
            className="nav-mobile-menu-btn"
            onClick={toggleMenu("left", true)}
          >
            <i className="material-icons icons-red">menu</i>
          </Button>
          <SwipeableDrawer
            anchor="left"
            open={this.state.left}
            onClose={toggleMenu("left", false)}
            onOpen={toggleMenu("left", true)}
          >
            {MobileMenuLoggedOut("left")}
          </SwipeableDrawer>
          <div className="nav-btns-right-mobile">
            <CountryPicker />
          </div>
        </div>
      );
    };

    const LoggedOutLinks = () => {
      return (
        <GlobalContext.Consumer>
          {context => {
            const locale = context.locale;
            var lang = CustomLanguage.define(locale);
            return (
              <div className="nav-btns-right">
                <LoginButton value={lang.navbar[0].login} />
                <RegisterButton value={lang.navbar[0].register} />
                <CountryPicker />
              </div>
            );
          }}
        </GlobalContext.Consumer>
      );
    };

    const MobileLoggedInLinks = () => {
      const toggleMenu = (menu, open) => event => {
        if (
          event &&
          event.type === "keydown" &&
          (event.key === "Tab" || event.key === "Shift")
        ) {
          return;
        }

        this._isMounted && this.setState({ [menu]: open });
      };

      const classes = useStyles();

      const MobileMenuLoggedIn = menu => (
        <GlobalContext.Consumer>
          {context => {
            const locale = context.locale;
            var lang = CustomLanguage.define(locale);
            return (
              <div
                className={classes.list}
                role="presentation"
                onClick={toggleMenu(menu, false)}
                onKeyDown={toggleMenu(menu, false)}
              >
                <h5 style={{ textAlign: "center", color: "red" }}>Menu</h5>
                <List>
                  <ListItem>
                    <NavLink className="nav-mobile-menu-links" to="/search">
                      <i className="material-icons icons-red link-icon nav-mobile-menu-icons">
                        search
                      </i>
                      <span className="nav-mobile-menu-text">
                        {lang.navbar[0].search}
                      </span>
                    </NavLink>
                  </ListItem>
                  <ListItem>
                    <NavLink className="nav-mobile-menu-links" to={`/user/${context.username}`} >
                      <i className="material-icons icons-red link-icon nav-mobile-menu-icons">
                      person
                      </i>
                      <span className="nav-mobile-menu-text">
                        {lang.navbar[0].profile}
                      </span>
                    </NavLink>
                  </ListItem>
                  <ListItem>
                    <NavLink className="nav-mobile-menu-links" to="#" onClick={this.handleLogout}>
                      <i className="material-icons icons-red link-icon nav-mobile-menu-icons">
                      exit_to_app
                      </i>
                      <span className="nav-mobile-menu-text">
                        {lang.navbar[0].logout}
                      </span>
                    </NavLink>
                  </ListItem>
                </List>
              </div>
            );
          }}
        </GlobalContext.Consumer>
      );

      return (
        <div className="nav-mobile-menu">
          <Button
            className="nav-mobile-menu-btn"
            onClick={toggleMenu("left", true)}
          >
            <i className="material-icons icons-red">menu</i>
          </Button>
          <SwipeableDrawer
            anchor="left"
            open={this.state.left}
            onClose={toggleMenu("left", false)}
            onOpen={toggleMenu("left", true)}
          >
            {MobileMenuLoggedIn("left")}
          </SwipeableDrawer>
        </div>
      );
    };

    const LoggedInLinks = () => {
      return (
        <GlobalContext.Consumer>
          {context => {
            if (context.username !== "") {
              return (
                <div className="nav-btns-right">
                  <NavLink to="/search" className="nav-link">
                    <i className="material-icons icons-white nav-link-icon">
                    search
                    </i>
                  </NavLink>
                  <NavLink to={`/user/${context.username}`} className="nav-link">
                    <div className="nav-link-img" style={{ backgroundImage: "url(" + (context.picture ? context.picture : DefaultUserPic) + ")" }}></div>
                  </NavLink>
                  <NavLink to="#" onClick={this.handleLogout} className="nav-link">
                    <i className="material-icons icons-white nav-link-icon">
                    exit_to_app
                    </i>
                  </NavLink>
                </div>
              );
            } else {
              return null;
            }
          }}
        </GlobalContext.Consumer>
      );
    };

    const NavLinks = () => {
      if (this.state.logged) {        
        return (
          <div className="nav-wrapper">
            <MobileLoggedInLinks />
            <NavLink to="/search" className="brand-logo">
              <img
                className="header-logo ml-2"
                src={logo}
                height="40px"
                width="100px"
                alt=""
              />
            </NavLink>
            <LoggedInLinks />
          </div>
        );
      } else {
        return (
          <div className="nav-wrapper">
            <MobileLoggedOutLinks />
            <NavLink to="/" className="brand-logo">
                <img
                  className="header-logo ml-2"
                  src={logo}
                  height="40px"
                  width="100px"
                  alt=""
                />
              </NavLink>
              <LoggedOutLinks />
          </div>
        );
      }
    }

    return (
      <div>
        <nav>
          <NavLinks/>
        </nav>
      </div>
    );
  }

  handleLogout = async () => {
    await this.Auth.logout();
    await this.context.resetContext();
    this.props.history.replace("/login");
  };
}

export default withRouter(NavBar);
