import React from "react";
import ReactLoading from 'react-loading';
import "./Loading.scss";

const LoadingBar = ({ type, color }) => (
	<ReactLoading type={type} color={color} height={222} width={125} />
);

const LoadingFullScreen = () => {
    return (
        <div className="loading-full-container">
            <div className="loading-full-anim">
                <LoadingBar type="bars" color="red" />
            </div>
        </div>
    )
}

export default LoadingFullScreen;