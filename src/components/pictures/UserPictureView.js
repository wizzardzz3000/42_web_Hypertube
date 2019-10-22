import React from "react";
import DefaultUserPic from "../../assets/default_user.png";

const UserPictureView = data => {
  return (
    <div
      className="user-picture-view"
      style={{
        backgroundImage: `url(${
          data.picture_url ? data.picture_url : DefaultUserPic
        })`
      }}
    ></div>
  );
};

export default UserPictureView;
