import React, { useState } from "react";
import "./style.scss";

NotificationPopup.defaultProps = {
  title: "title",
  description: "description",
  buttonText: "Ẩn thông báo",
  hideModal: () => {},
  show: false,
  disable: false,
  buttonColor: "#dd2e44",
};

function NotificationPopup(props) {
  const {
    title,
    description,
    buttonText,
    hideModal,
    show,
    disable,
    buttonColor,
  } = props;

  return (
    <div
      id="modal-container"
      className={
        show
          ? "notification-modal" + " show"
          : "notification-modal" + " show" + " out"
      }
    >
      <div className="modal-background">
        <div className="modal">
          <p className="title">{title}</p>
          <p className="description">{description}</p>
          <button
            className="btn-3D btn-close"
            onClick={hideModal}
            disabled={disable}
            style={{
              color: `#ffffff`,
              "--background-color": buttonColor,
            }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationPopup;
