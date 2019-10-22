import React, { useContext } from "react";
import { Button } from "react-materialize";
import Infotoast from "../../../services/toasts/InfoToasts";
import ErrorToast from "../../../services/toasts/ErrorToasts";
import AuthService from "../../../services/AuthService";
import { GlobalContext } from "../../../context/GlobalContext";
import CustomLanguage from "../../../services/DefineLocale";

import axios from "axios";

const DeleteAccount = (props) => {
    const Auth = new AuthService();
    const context = useContext(GlobalContext);
    const locale = context.locale;
    var lang = CustomLanguage.define(locale);

    const handleCancel = () => {
        props.closeDelAccountSwitch();
    }

    const handleDelete = async () => {
        var token = await Auth.getToken();
        await axios.delete("/users/delete", { headers: { Authorization: token }})
        .then(res => 
        { Auth.logout();
            Infotoast.custom.info(lang.delete_account[0].delete_account_success, 4000);
            window.location.replace("/login");
        })
        .catch(err => ErrorToast.custom.error(lang.delete_account[0].delete_account_failed, 4000));
    }

    return (
        <div className="delete-account-form">
            <Button className="btn-secondary btn-full-width" onClick={handleCancel} >{lang.delete_account[0].cancel}</Button>
            <Button className="btn-regular btn-full-width" onClick={handleDelete} >{lang.delete_account[0].delete}</Button>
        </div>
    )
}

export default DeleteAccount;