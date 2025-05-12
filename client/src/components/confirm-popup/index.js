import classNames from "classnames";
import React from "react";
import "./style.scss";

export default function ConfirmPopup(props) {
  const { title, description, hideModal, confirm, show } = props;
  console.log({ show });

  return (
    <div
      id="modal-container"
      className={classNames({
        "notification-modal": true,
        show: show,
        "show out": show === false,
      })}
    >
      <div className="modal-background">
        <div className="modal">
          <p className="title">{title}</p>
          <p className="description">{description}</p>
          <div className="group-btn">
            <button className="btn-3D btn-confirm" onClick={confirm}>
              ĐỒNG Ý
            </button>
            <button className="btn-3D btn-close" onClick={hideModal}>
              HỦY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
