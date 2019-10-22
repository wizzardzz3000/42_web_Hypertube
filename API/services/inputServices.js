const mongoose = require("mongoose");
const User = require("../schemas/User");

module.exports = {
  lastname: data => {
    const regex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]*-?[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]*$/;

    if (data == null || data == "") return { error: "missing_lastname" };
    if (/\s/.test(data)) return { error: "space_lastname" };
    if (!data.match(regex)) return { error: "invalid_lastname" };
    if (data.length < 3 || data.length > 28) return { error: "length_lastname" };
    else return { status: "valid" };
  },

  firstname: data => {
    const regex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]*-?[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]*$/;

    if (data == null || data == "") return { error: "missing_firstname" };
    if (/\s/.test(data)) return { error: "space_firstname" };
    if (!data.match(regex)) return { error: "invalid_firstname" };
    if (data.length < 3 || data.length > 28) return { error: "length_firstname" };
    else return { status: "valid" };
  },

  username: async data => {
    const regex = /^[a-zA-Z0-9]*-?[a-zA-Z0-9]*$/;

    if (data == null || data == "") return { error: "missing_username" };
    if (/\s/.test(data)) return { error: "space_username" };
    if (!data.match(regex)) return { error: "invalid_username" };
    if (data.length < 3 || data.length > 30) return { error: "length_username" };
    //Check db for already existing username
    var result = await User.find({ username: data.toLowerCase() });
    if (result != "") return { error: "already_registered_username" };
    else return { status: "valid" };
  },

  mail: async data => {
    if (data == null || data == "") return { error: "missing_mail" };
    if (/\s/.test(data)) return { error: "space_email" };
    //Check pattern
    var mailPattern = /^([a-zA-Z0-9]+(?:[\.\-\_]?[a-zA-Z0-9]+)*)@([a-zA-Z0-9]+(?:[\.\-\_]?[a-zA-Z0-9]+)*)\.([a-zA-Z]{2,})+$/;
    if (!mailPattern.test(data)) return { error: "invalid_email" };
    //Check db for already existing mail
    var result = await User.find({ email: data.toLowerCase() });
    if (result != "") return { error: "already_registered_email" };
    else return { status: "valid" };
  },

  password: data => {
    if (data == null || data == "") return { error: "missing_password" };
    if (/\s/.test(data)) return { error: "space_password" };
    //Check pattern
    var pwdPattern = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;
    if (!pwdPattern.test(data)) return { error: "invalid_password" };
    else return { status: "valid" };
  }
};
