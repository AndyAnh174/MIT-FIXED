import React from "react";
import PropTypes from "prop-types";
import "./style.scss";

SpeedUpTeam.propTypes = {};
SpeedUpTeam.defaultProps = {
  answer: {
    _id: "",
    content: "",
    result: "--------",
    point: "-",
    userId: {
      _id: "",
      nameDisplay: "Just in time",
    },
    timeSubmit: "02:30",
  },
};

function SpeedUpTeam(props) {
  const { answer } = props;
  const [elementsAnswer, setElementsAnswer] = React.useState([]);
  const str = answer.result;
  const characterRight = str.split("1").length - 1;
  const characterSum = str.length;
  const minutes = Math.floor(answer.timeSubmit / 1000 / 60);
  const seconds = Math.floor((answer.timeSubmit / 1000) % 60);

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
    const newElements = parseAnswer(answer.content, answer.result);
    setElementsAnswer(newElements);
  }, [answer]);
  return (
    <div
      className="speed-up-team"
      style={{
        "--time-submit": `"${
          (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
        }`,
      }}
    >
      <p className="name-display">{answer.userId.displayName}</p>
      <div className="answer-content">
        <p>
          {/* <span className="success">CÔNG NGHỆ VIỆT</span>
          <span className="fail"> LAN TỎA BLA BLA</span> */}
          {elementsAnswer.map((item, index) => {
            return item;
          })}
        </p>
      </div>
      {answer.status === 1 ? (
        <p className="result">
          {characterRight}
          <span>/{characterSum}</span>
        </p>
      ) : (
        <p className="result">
          -<span>/-</span>
        </p>
      )}
      <p className="point">
        {answer.status === 1 ? answer.point : "-"}
      </p>
    </div>
  );
}

export default SpeedUpTeam;
