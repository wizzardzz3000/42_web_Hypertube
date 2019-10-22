const define = locale => {
  var lang;
  switch (locale) {
    case "en":
      lang = require("../locale/en");
      break;
    case "es":
      lang = require("../locale/es");
      break;
    case "fr":
      lang = require("../locale/fr");
      break;
    default:
      lang = require("../locale/en");
  }
  return lang;
};

export default { define };
