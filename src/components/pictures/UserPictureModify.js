import React, { useState, useEffect, useContext } from "react";
import "./pictures.scss";
import ValidatePicture from "../../services/ValidatePicture";
import ErrorToast from "../../services/toasts/ErrorToasts";
import DefaultUserPic from "../../assets/default_user.png";
import { GlobalContext } from "../../context/GlobalContext";
import CustomLanguage from "../../services/DefineLocale";

const UserPictureModify = props => {
  const [pictureValid, setPictureValid] = useState(false);
  const [picture, setPicture] = useState(DefaultUserPic);
  const context = useContext(GlobalContext);
  const locale = context.locale;
  var lang = CustomLanguage.define(locale);  

  useEffect(() => {
    let isMounted = true;

    if (props.picture) {
      isMounted && setPicture(props.picture);
      isMounted && setPictureValid(true);
      return;
    }

    return () => isMounted = false;
  }, [props.picture]);

  const handlePictureUpload = e => {
    let file = e.target.files[0];

    if (file === undefined) {
      return;
    }
    if (!ValidatePicture.picture.format(file)) {
      ErrorToast.custom.error(lang.picture_modify[0].incorrect_format, 1400);
      return;
    }
    if (!ValidatePicture.picture.size(file)) {
      ErrorToast.custom.error(
        lang.picture_modify[0].incorrect_size,
        1400
      );
      return;
    }

    let pic = new Image();
    pic.src = window.URL.createObjectURL(file);
    pic.onerror = () => {
      ErrorToast.custom.error(lang.picture_modify[0].incorrect_picture, 1400);
      return;
    };
    pic.onload = () => {
      let width = pic.naturalWidth;
      let height = pic.naturalHeight;
      window.URL.revokeObjectURL(pic.src);
      if (width && height) {
        var reader = new FileReader();
        reader.onloadend = () => {
          setPicture(reader.result);
          setPictureValid(true);
          props.pictureToParent({ status: true, url: reader.result });
        };
        reader.readAsDataURL(file);
      }
    };
  };

  return (
    <div className="user-picture-modify">
      <div
        className="user-picture-box"
        style={{ backgroundImage: "url(" + picture + ")" }}
      ></div>
      <div className="upload-options" onChange={e => handlePictureUpload(e)}>
        <label>
          <input type="file" className="image-upload" accept="image/*" />
          <i className="material-icons picture-edit-add-icon">
            {pictureValid ? "edit" : "add"}
          </i>
        </label>
      </div>
    </div>
  );
};

export default UserPictureModify;
