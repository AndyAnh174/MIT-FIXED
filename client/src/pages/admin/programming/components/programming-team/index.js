import React from "react";
import "./style.scss";

ProgrammingTeam.defaultProps = {
  answer: {
    _id: "",
    content: "code here",
    point: 0,
    status: 0,
    timeSubmit: 0,
    result: "100-----",
    userId: {
      _id: "",
      displayName: "Name of Team",
    },
  },
  maxPoint: 100,
};

function ProgrammingTeam(props) {
  const { answer, maxPoint } = props;
  const [result, setResult] = React.useState("");
  const minutes = Math.floor(answer.timeSubmit / 1000 / 60);
  const seconds = Math.floor((answer.timeSubmit / 1000) % 60);
  const [showCode, setShowCode] = React.useState(false);
  React.useEffect(() => {
    const strResult = answer.result;
    var indexUnCalc =
      strResult.indexOf("-") === -1
        ? strResult.length
        : strResult.indexOf("-");
    console.log(indexUnCalc);
    var indexDiv8 =
      Math.floor(indexUnCalc / 8) < 1
        ? 0
        : indexUnCalc % 8 === 0
        ? Math.floor(indexUnCalc / 8) - 1
        : Math.floor(indexUnCalc / 8);
    var begin = indexDiv8 * 8;
    var end = begin + 8;
    if (end > strResult.length) {
      end = strResult.length;
    }
    var afterSlice = strResult.slice(begin, end);
    setResult(afterSlice);
  }, [answer]);
  return (
    <div className="programming-team">
      <div
        className="information"
        onClick={() => setShowCode(!showCode)}
      >
        <p className="name">{answer.userId.displayName}</p>
        <p className="time-created">
          {minutes}:{seconds}
        </p>
        {result.split("").map((item, index) => {
          return (
            <div key={index} className={"test-case t" + item}></div>
          );
        })}
        <p className="point">
          {answer.point}
          <span className="max-point">/{maxPoint}</span>
        </p>
      </div>
      <textarea
        disabled
        className={showCode ? "code show" : "code"}
        value={answer.content}
      ></textarea>
    </div>
  );
}

export default ProgrammingTeam;
