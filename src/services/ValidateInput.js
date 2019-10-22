const user = (type, value) => {
  switch (type) {
    case "login":
      let loginError = "";
      let regexLogin = /^[a-zA-Z0-9]*-?[a-zA-Z0-9]*$/;
      let regexEmail = /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/;

      if (!value.match(regexLogin) && !value.match(regexEmail)) {
        loginError = "invalid_login";
      } else if (value === "") {
        loginError = "empty_login";
      } else if (value.length > 30) {
        loginError = "length_login";
      }

      if (loginError) {
        return { loginError, loginValid: false };
      } else if (value !== "") {
        return { loginError, loginValid: true };
      }
      break;
    case "firstname":
      const firstnameRegex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]*-?[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]*$/;

      if (/\s/.test(value)) {
        return {
          firstnameError: "no_space",
          firstnameValid: false
        };
      } else if (!value.match(firstnameRegex)) {
        return {
          firstnameError: "invalid_firstname",
          firstnameValid: false
        };
      } else if (value === "") {
        return {
          firstnameError: "empty_firstname",
          firstnameValid: false
        };
      }
      return {
        firstnameError: "",
        firstnameValid: true
      };
    case "lastname":
      const lastnameRegex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]*-?[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]*$/;

      if (/\s/.test(value)) {
        return {
          lastnameError: "no_space",
          lastnameValid: false
        };
      } else if (!value.match(lastnameRegex)) {
        return {
          lastnameError: "invalid_lastname",
          lastnameValid: false
        };
      } else if (value === "") {
        return {
          lastnameError: "empty_lastname",
          lastnameValid: false
        };
      }
      return {
        lastnameError: "",
        lastnameValid: true
      };
    case "username":
      const usernameRegex = /^[a-zA-Z0-9]*-?[a-zA-Z0-9]*$/;

      if (/\s/.test(value)) {
        return {
          usernameError: "no_space",
          usernameValid: false
        };
      } else if (!value.match(usernameRegex)) {
        return {
          usernameError: "invalid_username",
          usernameValid: false
        };
      } else if (value.length > 30) {
        return {
          usernameError: "length_username",
          usernameValid: false
        };
      } else if (value === "") {
        return {
          usernameError: "empty_username",
          usernameValid: false
        };
      }
      return {
        usernameError: "",
        usernameValid: true
      };
    case "email":
      const emailRegex = /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/;

      if (/\s/.test(value)) {
        return {
          emailError: "no_space",
          emailValid: false
        };
      } else if (!value.match(emailRegex)) {
        return {
          emailError: "invalid_email",
          emailValid: false
        };
      } else if (value.length > 30) {
        return {
          emailError: "length_email",
          emailValid: false
        };
      } else if (value === "") {
        return {
          emailError: "empty_email",
          emailValid: false
        };
      }
      return {
        emailError: "",
        emailValid: true
      };
    case "passwordSimple":
      let pwdError = "";

      if (value.length < 8 || value.includes(" ")) {
        pwdError = "invalid_pwd";
      } else if (value.length > 30) {
        pwdError = "length_pwd";
      }

      if (pwdError) {
        return { pwdValid: false, pwdError };
      } else if (value) {
        return { pwdValid: true, pwdError };
      }
      break;
    case "passwordHard":
      let pwdHasLowercase = false;
      let pwdHasUppercase = false;
      let pwdHasNumber = false;
      let pwdHasMinLen = false;
      let pwd1Valid = false;

      if (/[a-z]/.test(value)) {
        pwdHasLowercase = true;
      } else {
        pwdHasLowercase = false;
      }

      if (/[A-Z]/g.test(value)) {
        pwdHasUppercase = true;
      } else {
        pwdHasUppercase = false;
      }
      if (/[0-9]/g.test(value)) {
        pwdHasNumber = true;
      } else {
        pwdHasNumber = false;
      }

      if (value.length >= 8 && value.length <= 30) {
        pwdHasMinLen = true;
      } else {
        pwdHasMinLen = false;
      }

      if (pwdHasLowercase && pwdHasUppercase && pwdHasNumber && pwdHasMinLen) {
        pwd1Valid = true;
      } else {
        pwd1Valid = false;
      }

      return {
        pwdHasLowercase,
        pwdHasUppercase,
        pwdHasNumber,
        pwdHasMinLen,
        pwd1Valid
      };
    default:
      return false;
  }
};

export default { user };
