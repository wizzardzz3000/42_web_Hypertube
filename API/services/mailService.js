const nodemailer = require("nodemailer");
const fs = require("fs");

module.exports = {
    sendActivation: user => {
        let transporter = nodemailer.createTransport({
            sendmail: true,
            //newline: "unix",
            path: "/usr/sbin/sendmail"
        });

        let message = "",
            search = {
                username: "^^username^^",
                link: "^^linkactivation^^",
                en: {
                    text_1: "^^text_1^^",
                    text_2: "^^text_2^^",
                    button: "^^button^^",
                },
                fr: {
                    text_1: "^^text_1^^",
                    text_2: "^^text_2^^",
                    button: "^^button^^",
                },
                es: {
                    text_1: "^^text_1^^",
                    text_2: "^^text_2^^",
                    button: "^^button^^",
                }
            },
            replace = {
                username: user.username,
                link:
                    "localhost:3000/activation?user=" +
                    encodeURIComponent(user.username) +
                    "&key=" +
                    encodeURIComponent(user.activationKey),
                en: {
                    text_1: "Welcome",
                    text_2: "Thanks for signing up on Hyperflix! Please activate your account to enjoy our collection of movies and TV shows.",
                    button: "Activate"
                },
                fr: {
                    text_1: "Bienvenue",
                    text_2: "Merci de votre inscription sur Hyperflix ! Veuillez activer votre compte pour profiter de notre collection de films.",
                    button: "Activer"
                },
                es: {
                    text_1: "Bienvenido",
                    text_2: "Gracias por registrar en Hyperflix! Por favor activa tu cuenta para disfrutar de nuestra collecíon de películas.",
                    button: "Activar"
                }
            };

        fs.readFile("API/templates/activationMail.html", (err, data) => {
            if (err) return console.error(err);
            message = data.toString();
            transporter.sendMail(
                {
                    from: "no-reply@hyperflix.com",
                    to: user.email,
                    subject: `${user.language === "es" ? "Bienvenido en" : user.language === "fr" ? "Bienvenue sur" : "Welcome to"} HyperFlix`,
                    html: message
                        .replace(search.username, replace.username)
                        .replace(search.link, replace.link)
                        .replace(search[user.language].text_1, replace[user.language].text_1)
                        .replace(search[user.language].text_2, replace[user.language].text_2)
                        .replace(search[user.language].button, replace[user.language].button)
                },
                (err, info) => {
                    console.log(info.envelope);
                }
            );
        });
    },

    sendNewPassword: (user, key) => {
        if (user.email === "" || user.email === undefined) return "error";
        let transporter = nodemailer.createTransport({
            sendmail: true,
            //newline: "unix",
            path: "/usr/sbin/sendmail"
        });

        let message = "",
            search = {
                username: "^^username^^",
                link: "^^linkactivation^^",
                en: {
                    text_1: "^^text_1^^",
                    text_2: "^^text_2^^",
                    text_3: "^^text_3^^",
                    button: "^^button^^",
                },
                fr: {
                    text_1: "^^text_1^^",
                    text_2: "^^text_2^^",
                    text_3: "^^text_3^^",
                    button: "^^button^^",
                },
                es: {
                    text_1: "^^text_1^^",
                    text_2: "^^text_2^^",
                    text_3: "^^text_3^^",
                    button: "^^button^^",
                }
            },
            replace = {
                username: user.username,
                link:
                    "http://localhost:3000/reset-password?user=" +
                    encodeURIComponent(user.username) +
                    "&key=" +
                    encodeURIComponent(key),
                en: {
                    text_1: "Cant' remember your password?",
                    text_2: "Don't worry",
                    text_3: "We got you covered!",
                    button: "Change Password"
                },
                fr: {
                    text_1: "Mot de passe oublié ?",
                    text_2: "Pas d'inquiétude",
                    text_3: "On a un lien pour aider",
                    button: "Changer mot de passe"
                },
                es: {
                    text_1: "Contraseña olvidada?",
                    text_2: "No te preocupes",
                    text_3: "Tenemos un link para ayudarte",
                    button: "Cambiar contraseña"
                }
            };

        fs.readFile("API/templates/forgotPasswordMail.html", (err, data) => {
            if (err) return "error";
            message = data.toString();
            transporter.sendMail(
                {
                    from: "no-reply@hyperflix.com",
                    to: user.email,
                    subject: `HyperFlix - ${user.language === "es" ? "Contraseña olvidada" : user.language === "fr" ? "Mot de passe oublié" : "Forgot Password"} `,
                    html: message
                        .replace(search.username, replace.username)
                        .replace(search.link, replace.link)
                        .replace(search[user.language].text_1, replace[user.language].text_1)
                        .replace(search[user.language].text_2, replace[user.language].text_2)
                        .replace(search[user.language].text_3, replace[user.language].text_3)
                        .replace(search[user.language].button, replace[user.language].button)
                },
                (err, info) => {
                    console.log(info.envelope);
                }
            );
        });
    }
};
