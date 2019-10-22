import React from "react";
import { Link } from "react-router-dom";
import "./UsersList.scss";
import DefaultUserPic from "../../assets/default_user.png";

const UsersList = ({ users }) => {
  const UserItem = ({ id, username, picture }) => (
    <div className="user-item col xl2 l3 m4 s6">
      <div className="user-item">
        <div
          className="user-item-img"
          style={{
            backgroundImage: `url(${picture ? picture : DefaultUserPic})`
          }}
        />
        <span className="user-item-text">{username}</span>
      </div>
    </div>
  );

  const usersList = users =>
    users.map(
      user =>
        user._id !== undefined && (
          <Link to={`/user/${user.username}`} key={user._id}>
            <UserItem
              username={user.username}
              picture={user.img}
            />
          </Link>
        )
    );

  return <div className="users-list">{usersList(users)}</div>;
};

export default UsersList;
