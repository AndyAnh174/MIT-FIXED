import React from "react";
import PropTypes from "prop-types";
import "./style.scss";

MyModal.propTypes = {};
MyModal.defaultProps = {
  show: false,
  modalClass: "",
};

function MyModal(props) {
  const { type, show, modalClass } = props;
  return (
    <div
      id="my-modal-container"
      className={
        show ? modalClass + " show" : modalClass + " show" + " out"
      }
    >
      {props.children}
    </div>
  );
}

export default MyModal;