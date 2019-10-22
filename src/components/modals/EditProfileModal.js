import React, { useReducer, useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import { Modal, Select } from "react-materialize";
import "./Modals.scss";
import UserPictureModify from "../../components/pictures/UserPictureModify";
import {
    FunctionButtonRegular,
    FunctionButtonSecondary
} from "../../components/buttons/Buttons";
import ValidateInput from "../../services/ValidateInput";
import InfoToast from "../../services/toasts/InfoToasts";
import ErrorToast from "../../services/toasts/ErrorToasts";
import CheckObjectsEquivalence from "../../services/CheckObjectsEquivalence";
import { GlobalContext } from "../../context/GlobalContext";
import CustomLanguage from "../../services/DefineLocale";
import AuthService from "../../services/AuthService";
import ChangePassword from "../../components/account/password/ChangePassword";
import DeleteAccount from "../../components/account/delete/DeleteAccount";
import axios from "axios";

const initialState = {
    sendingRequest: false,
    requestReceived: false,
    data: [],
    status: ""
};

const initialValidation = {
    firstnameError: "",
    firstnameValid: true,
    lastnameError: "",
    lastnameValid: true,
    usernameError: "",
    usernameValid: true,
    emailError: "",
    emailValid: true,
    pictureValid: true
};

const reducer = (state, action) => {
    switch (action.type) {
        case "USER_UPDATE_REQUEST":
            return {
                ...state,
                sendingRequest: true,
                requestReceived: false,
                data: [],
                status: "Pending..."
            };
        case "USER_UPDATE_SUCCESS":
            return {
                ...state,
                sendingRequest: false,
                requestReceived: true,
                data: action.payload,
                status: "Updated"
            };
        default:
            return state;
    }
};

const EditProfileModal = props => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const context = useContext(GlobalContext);
    const [user, setUser] = useState(props.user);
    const [passwordSwitch, setPasswordSwitch] = useState(false);
    const [delAccountSwitch, setDelAccountSwitch] = useState(false);
    const [error, setError] = useState(initialValidation);
    const event = new KeyboardEvent("keydown", { keyCode: 27 });
    const Auth = new AuthService();
    const locale = context.locale;
    var lang = CustomLanguage.define(locale);  

    const handleChange = e => {
        const { name, value } = e.target;

        if (name !== "locale") {
            let result = ValidateInput.user(name, value);
            setError({ ...error, ...result });
        }

        setUser({ ...user, [name]: value.toLowerCase() });
    };

    const handlePicture = picture => {
        if (picture.status && picture.url) {
            setError({ ...error, pictureValid: true });
            setUser({ ...user, picture: picture.url });
        } else {
            setError({ pictureValid: false });
        }
    };

    const handleCancel = e => {
        document.dispatchEvent(event);
        setUser(props.user);
        setError(initialValidation);
    };

    const handlePasswordSwitch = () => {
        if (delAccountSwitch) {
            setDelAccountSwitch(false);
        }
        setPasswordSwitch(!passwordSwitch);
    };

    const handleDelAccountSwitch = () => {
        if (passwordSwitch) {
            setPasswordSwitch(false);
        }
        setDelAccountSwitch(!delAccountSwitch);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        dispatch({
            type: "USER_UPDATE_REQUEST"
        });

        if (user.email === undefined) {
            ErrorToast.custom.error(lang.edit_profile[0].empty_email, 4000);
        } else if (
            error.firstnameValid &&
            error.lastnameValid &&
            error.usernameValid &&
            error.emailValid &&
            error.pictureValid
        ) {
            if (!CheckObjectsEquivalence(
                {username: user.username, firstname: user.firstname, lastname: user.lastname, email: user.email, picture: user.picture, locale: user.locale},
                {username: props.user.username, firstname: props.user.firstname, lastname: props.user.lastname, email: props.user.email, picture: props.user.picture, locale: props.user.locale})) {
                var token = await Auth.getToken();
                var data = {
                    ...(user.username.toLowerCase() !==
                        props.user.username.toLowerCase() && {
                        username: user.username.toLowerCase()
                    }),
                    ...(user.firstname.toLowerCase() !==
                        props.user.firstname.toLowerCase() && {
                        firstname: user.firstname.toLowerCase()
                    }),
                    ...(user.lastname.toLowerCase() !==
                        props.user.lastname.toLowerCase() && {
                        lastname: user.lastname.toLowerCase()
                    }),
                    ...(props.user.email === undefined ? {
                        email: user.email.toLowerCase()
                    } : user.email.toLowerCase() !==
                        props.user.email.toLowerCase() && {
                        email: user.email.toLowerCase()
                    }),
                    ...(user.locale !== props.user.locale && {
                        language: user.locale
                    }),
                    ...(user.picture !== props.user.picture && {
                        img: user.picture
                    })
                };

                axios
                    .post(
                        "/users/update",
                        { ...data },
                        { headers: { Authorization: token } }
                    )
                    .then(res => {
                        props.update(true);
                        context.updateContext({
                            locale: user.locale,
                            username: user.username.toLowerCase(),
                            firstname: user.firstname.toLowerCase(),
                            lastname: user.lastname.toLowerCase(),
                            email: user.email.toLowerCase(),
                            picture: user.picture,
                            uid: user.uid
                        });
                        if (props.user.following) {
                            context.updateFollowing(props.user.following);
                        }
                        if (props.user.movies_seen) {
                            context.updateMoviesSeen(props.user.movies_seen);
                        }
                        if (
                            user.username.toLowerCase() !==
                            props.user.username.toLowerCase()
                        ) {
                            props.history.push(user.username.toLowerCase());
                        }
                        InfoToast.custom.info(lang.edit_profile[0].saved, 4000);
                        document.dispatchEvent(event);
                        props.update(false);
                    })
                    .catch(err =>
                        {
                            ErrorToast.custom.error(lang.update_user[0][err.response.data.error], 4000);
                        }
                    );
            } else {
                InfoToast.custom.info(lang.edit_profile[0].nothing_changed, 4000);
            }
        } else {
            console.log(state);
            ErrorToast.custom.error(lang.edit_profile[0].incorrect_fields, 4000);
        }
    };

    return (
        <Modal id="edit-profile-modal" className="modal-black-background">
            <div className="modal-black-container">
                <p className="modal-black-title">{lang.edit_profile[0].title}</p>
                <div className="modal-black-content">
                    <div className="profile-picture-modify col l2 m4 s12 col-padding-zero">
                        <UserPictureModify
                            picture={user.picture}
                            pictureToParent={handlePicture}
                        />
                    </div>
                    <div className="profile-text-modify col l10 m8 s12">
                        <form className="edit-profile-form">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className={`form-input-fields-modal ${
                                    error.usernameValid
                                        ? ""
                                        : "edit-profile-invalid-input"
                                }`}
                                value={user.username === undefined ? "" : user.username}
                                onChange={handleChange}
                            ></input>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                className={`form-input-fields-modal half-input-fields-modal field-right-margin text-first-letter-capital ${
                                    error.firstnameValid
                                        ? ""
                                        : "edit-profile-invalid-input"
                                }`}
                                value={user.firstname === undefined ? "" : user.firstname}
                                onChange={handleChange}
                            ></input>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                className={`form-input-fields-modal half-input-fields-modal text-first-letter-capital ${
                                    error.lastnameValid
                                        ? ""
                                        : "edit-profile-invalid-input"
                                }`}
                                value={user.username === undefined ? "" : user.lastname}
                                onChange={handleChange}
                            ></input>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={`form-input-fields-modal  ${
                                    error.emailValid
                                        ? ""
                                        : "edit-profile-invalid-input"
                                }`}
                                value={user.email === undefined ? "" : user.email}
                                onChange={handleChange}
                            ></input>
                            <div className="profile-select-language">
                                <p className="profile-select-language-text">
                                    {lang.edit_profile[0].language}{" "}
                                </p>
                                <Select
                                    value={user.locale}
                                    onChange={handleChange}
                                    name="locale"
                                >
                                    <option value="en">English</option>
                                    <option value="fr">Français</option>
                                    <option value="es">Español</option>
                                </Select>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="profile-edit-actions">
                    <span className="profile-edit-actions-buttons">
                        <FunctionButtonRegular
                            text={lang.edit_profile[0].save}
                            func={handleSubmit}
                        />
                    </span>
                    <span className="profile-edit-actions-buttons">
                        <FunctionButtonSecondary
                            text={lang.edit_profile[0].cancel}
                            func={handleCancel}
                        />
                    </span>
                    <span className="profile-edit-actions-buttons">
                        <FunctionButtonSecondary
                            text={lang.edit_profile[0].delete}
                            func={handleDelAccountSwitch}
                        />
                    </span>
                    <span className="profile-edit-actions-buttons">
                        <FunctionButtonSecondary
                            text={lang.edit_profile[0].password}
                            func={handlePasswordSwitch}
                        />
                    </span>
                </div>
                {passwordSwitch && (
                    <ChangePassword
                        username={user.username}
                        closePasswordSwitch={handlePasswordSwitch}
                    />
                )}
                {delAccountSwitch && (
                    <DeleteAccount
                        username={user.username}
                        closeDelAccountSwitch={handleDelAccountSwitch}
                    />
                )}
            </div>
        </Modal>
    );
};

export default withRouter(EditProfileModal);
