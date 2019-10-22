import decode from "jwt-decode";
import axios from "axios";
import { GlobalContext } from "../context/GlobalContext";

export default class AuthService {
  static contextType = GlobalContext;
  // Setting token in local storage
  setToken(tokenData) {
    localStorage.setItem("Token", tokenData);
  }

  // Getting token from local storage
  async getToken() {
    return await localStorage.getItem("Token");
  }

  // Checking if token exists and is still valid
  loggedIn = async () => {
    const token = await this.getToken();
    if (!token) {
      return false;
    }
    var valid = false;
    await axios
      .get("/users/session", { headers: { Authorization: token } })
      .then(res => {
        if (res.data._id) valid = true;
      })
      .catch(err => {
        return false;
      });
    return !!token && !this.isTokenExpired(token) && valid;
  };

  // Checking if token exists and is still valid
  isTokenValid = async () => {
    const token = await this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Checking if session is valid
  isSessionValid = async () => {
    const token = await this.getToken();
    var valid = false;
    await axios
      .get("/users/session", { headers: { Authorization: token } })
      .then(res => {
        if (res.data._id) valid = true;
      })
      .catch(err => {
        console.log(err);
      });
      return valid;
  }

  // Checking if token is still valid
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  // Removing token from local storage
  async logout() {
    const token = await this.getToken();
    localStorage.removeItem("Token");
    if (token)
      await axios
        .get("/users/logout", { headers: { Authorization: token } });
  }
}
