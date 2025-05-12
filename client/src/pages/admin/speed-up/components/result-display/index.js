import React from "react";
import PropTypes from "prop-types";
import "./style.scss";
import SpeedUpTeam from "../speed-up-team";
import ConfirmPopup from "components/confirm-popup";

ResultDisplay.propTypes = {};
ResultDisplay.defaultProps = {
  show: true,
  answers: [
    {
      _id: "",
      content: "",
      result: "--------",
      point: "80",
      userId: {
        _id: "",
        nameDisplay: "Just in time",
      },
      timeSubmit: "02:30",
    },
  ],
  solution: "",
  handleHide: () => {},
  handleCalcPoint: () => {},
};

function ResultDisplay(props) {
  const { show, answers, solution, handleHide, handleCalcPoint } =
    props;
  const [answersSort, setAnswersSort] = React.useState([]);
  const [confirmCalcPointModal, setConfirmCalcPointModal] =
    React.useState(false);
  React.useEffect(() => {
    const answersAfterSort = answers.sort(
      (a, b) => a.timeSubmit - b.timeSubmit,
    );
    setAnswersSort(answersAfterSort);
  }, [answers]);
  return (
    <div className={show ? "result-display show" : "result-display"}>
      <div className="list-answers">
        {answersSort.map((item, index) => {
          return <SpeedUpTeam answer={item} key={item._id} />;
        })}
      </div>
      <div className="footer">
        <div className="solution-container">
          <p className="title">Đáp án chính xác:</p>
          <div className="solution">
            <p>{solution}</p>
          </div>
        </div>
        <button
          className="btn-3D btn-calc-point"
          onClick={() => setConfirmCalcPointModal(true)}
        >
          TÍNH ĐIỂM
        </button>
        <button className="btn-3D btn-exit" onClick={handleHide}>
          THOÁT
        </button>
      </div>
      <ConfirmPopup
        show={confirmCalcPointModal}
        title={"XÁC NHẬN ?"}
        description={
          "Thực hiện tính toán điểm phần thi của các đội chơi!"
        }
        confirm={() => {
          setConfirmCalcPointModal(false);
          handleCalcPoint();
        }}
        hideModal={() => setConfirmCalcPointModal(false)}
      />
    </div>
  );
}

export default ResultDisplay;
