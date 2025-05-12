import React, { useState } from "react";
import "./style.scss";

PopupSpeedUp.defaultProps = {
  title: "title",
  description: "description",
  buttonText: "Ẩn thông báo",
  hideModal: () => { },
  show: false,
  disable: false,
  buttonColor: "#dd2e44",
};

function PopupSpeedUp(props) {
  const {
    title,
    description,
    buttonText,
    hideModal,
    show,
    disable,
    buttonColor,
    value
  } = props;

  const [elements, setElements] = useState([]);


  function parseAnswer(content, result) {
    var elements = [];
    const arrayContent = content.split("");
    const arrayResult = result.split("");
    for (let index = 0; index < arrayContent.length; index++) {
      const c = arrayContent[index];
      var r = "-";
      if (index < arrayResult.length) {
        r = arrayResult[index];
      }
      switch (r) {
        case "1":
          elements.push(
            <span className="success" key={index}>
              {c}
            </span>,
          );
          break;
        case "0":
          elements.push(
            <span className="fail" key={index}>
              {c}
            </span>,
          );
          break;
        default:
          elements.push(<span key={index}>{c}</span>);
          break;
      }
    }
    return elements;
  }

  React.useEffect(() => {
    const newElements = parseAnswer(value.answer, value.result);
    setElements(newElements);
  }, [value]);

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
          <table className="answer_solution">
            <tr>
              <th align="left">Solution</th>
              <th align="center" className="value">{value.solution}</th>
            </tr>
            <tr>
              <th align="left">Your answer</th>
              <th align="center" className="value">
                {elements.map((item, index) => {
                  return item;
                })}
              </th>
            </tr>
          </table>
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

export default PopupSpeedUp;
