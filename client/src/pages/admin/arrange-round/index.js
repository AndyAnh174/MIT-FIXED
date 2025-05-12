import React, { useEffect, useState, useRef, useMemo } from "react";
import "./style.scss";
import AdminHeader from "components/admin-header";
import socket from "services/socket";
import { useSnackbar } from "notistack";
import Countdown from "react-countdown";
import ConfirmPopup from "components/confirm-popup";
import { DragDropCode } from "components/dragdropcode";

function ArrangeRound() {
  const [isStart, setIsStart] = useState(false);
  const [answerCurrent, setAnswerCurrent] = useState(-1);
  const [answers, setAnswers] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [timePeriod, setTimePeriod] = useState(0);
  const [question, setQuestion] = useState({ id: "", point: 0 });
  const [initialTimer, setInitialTimer] = useState(
    Date.now() + 1 * 60 * 1000,
  );
  const [confirmSwapQuestionModal, setConfirmSwapQuestionModal] =
    useState();
  const [confirmStartModal, setConfirmStartModal] = useState();
  const [confirmReStartModal, setConfirmReStartModal] = useState();
  const [confirmEndModal, setConfirmEndModal] = useState();

  const _countdownRef = useRef();

  useEffect(() => {
    socket.on("sort-received", data => {
      setAnswers(data);
    });
    socket.on("sort-start", () => {
      enqueueSnackbar("Vòng chơi bắt đầu!", { variant: "info" });
    });
    socket.on("sort-timeOut", () => {
      enqueueSnackbar("Vòng chơi kết thúc!", { variant: "error" });
      setIsStart(false);
    });
    socket.emit("get-sort-game");
    socket.on("sort-game", payload => {
      console.log({ connection: payload });
      const { isStarted, timeOut, timePeriod, answers } = payload;
      setQuestion(payload.question);
      setIsStart(isStarted === 1 ? true : false);
      console.log(answers);
      if (answers) {
        setAnswers(answers);
      }
      setTimePeriod(timePeriod * 1000);
      if (isStarted !== undefined && isStarted === 1) {
        const initialTimerOut = Date.parse(timeOut);
        setInitialTimer(initialTimerOut);
        _countdownRef.current.start();
      } else {
        setInitialTimer(Date.now() + timePeriod * 1000);
        _countdownRef.current.stop();
      }
    });

    socket.on("sort-swap-question-success", () => {
      enqueueSnackbar("Đổi câu hỏi thành công!", {
        variant: "success",
      });
    });
    socket.on("sort-swap-question-fail", () => {
      enqueueSnackbar("Đổi câu hỏi thất bại!", { variant: "error" });
    });
    socket.on("sort-calc-point-success", () => {
      enqueueSnackbar("Tính điểm thành công!", {
        variant: "success",
      });
    });
    socket.on("sort-calc-point-fail", () => {
      enqueueSnackbar("Tính điểm thất bại!", { variant: "error" });
    });
    socket.on("sort-team-update", _answers => {
      setAnswers(_answers);
    });

    return () => {
      socket.off("sort-game");
      socket.off("sort-received");
      socket.off("sort-start");
      socket.off("sort-timeOut");
      socket.off("sort-swap-question-success");
      socket.off("sort-swap-question-fail");
      socket.off("sort-calc-point-success");
      socket.off("sort-calc-point-fail");
      socket.off("sort-team-update");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = () => {
    setIsStart(true);
    socket.emit("sort-start");
  };
  const handleReStart = () => {
    setIsStart(true);
    socket.emit("sort-start");
  };

  const handleSwapQuestion = () => {
    socket.emit("sort-swap-question");
  };

  const handleEnd = () => {
    setIsStart(false);
    socket.emit("sort-timeOut");
    _countdownRef.current.stop();
  };

  const handleCheck = index => {
    if (answerCurrent !== index) setAnswerCurrent(index);
    else setAnswerCurrent(-1);
  };

  const handleComplete = () => {
    if (isStart !== null && isStart) {
      enqueueSnackbar("Thời gian đã hết!", { variant: "info" });
      socket.emit("sort-timeOut");
    }
  };

  const codeBlocks = useMemo(() => {
    try {
      const _answer = answers[answerCurrent];
      if (_answer) return JSON.parse(_answer.content);
      return JSON.parse(question.image);
    } catch (e) {
      return [];
    }
  }, [answerCurrent, answers, question.image]);

  return (
    <div className="arrange-admin-container">
      <AdminHeader />
      <div className="content">
        <div className="left-side">
          <div className="header">
            <div className="name-round">
              <p>VÒNG THI KẾT NỐI</p>
            </div>
            <div className="round-score">{question?.point}</div>
          </div>
          <div className="paper-container">
            {question?.image && (
              <DragDropCode
                disabled={answerCurrent !== -1}
                codeBlocks={codeBlocks}
                result={answers[answerCurrent]?.result || ""}
              />
            )}
          </div>
          <div className="footer">
            <div className="timer">
              <Countdown
                date={initialTimer}
                precision={4}
                autoStart={false}
                renderer={({ minutes, seconds, total }) => {
                  return (
                    <>
                      <p>
                        {minutes < 10 ? "0" + minutes : minutes}
                        {":"}
                        {seconds < 10 ? "0" + seconds : seconds}
                      </p>
                      <div
                        className="progress-bar"
                        style={{
                          backgroundSize:
                            (total / timePeriod) * 100 + "%",
                          "--value": `${(total / timePeriod) * 100}%`,
                        }}
                      ></div>
                    </>
                  );
                }}
                onComplete={handleComplete}
                ref={_countdownRef}
              />
            </div>
            <div className="group-btn">
              <button
                className="swap-question-btn btn-3D"
                disabled={isStart}
                onClick={() => {
                  setConfirmSwapQuestionModal(true);
                }}
              >
                ĐỔI CÂU HỎI
              </button>
              <button
                className="restart-btn btn-3D"
                disabled={!isStart}
                onClick={() => setConfirmReStartModal(true)}
              >
                BẮT ĐẦU LẠI
              </button>
              <button
                className="start-btn btn-3D"
                disabled={isStart}
                onClick={() => setConfirmStartModal(true)}
              >
                BẮT ĐẦU
              </button>
              <button
                className="end-btn btn-3D"
                disabled={!isStart}
                onClick={() => setConfirmEndModal(true)}
              >
                KẾT THÚC
              </button>
            </div>
          </div>
        </div>
        <div className="right-side">
          <div className="header">
            <p>ĐÁP ÁN CỦA CÁC ĐỘI</p>
          </div>
          <div className="teams">
            {answers.map((item, index) => (
              <TeamContainer
                key={index}
                team={{
                  ...item,
                  index,
                  checked: index === answerCurrent,
                }}
                check={() => handleCheck(index)}
                disabled={isStart}
              />
            ))}
          </div>
        </div>
        <ConfirmPopup
          show={confirmStartModal}
          title={"XÁC NHẬN BẮT ĐẦU ?"}
          description={"Bắt đầu vòng chơi ngay!"}
          confirm={() => {
            setConfirmStartModal(false);
            handleStart();
          }}
          hideModal={() => setConfirmStartModal(false)}
        />
        <ConfirmPopup
          show={confirmReStartModal}
          title={"XÁC NHẬN BẮT ĐẦU LẠI ?"}
          description={"Thời gian sẽ reset về ban đầu!"}
          confirm={() => {
            setConfirmReStartModal(false);
            handleReStart();
          }}
          hideModal={() => setConfirmReStartModal(false)}
        />
        <ConfirmPopup
          show={confirmEndModal}
          title={"XÁC NHẬN KẾT THÚC ?"}
          description={"Kết thúc vòng chơi ngay bây giờ!"}
          confirm={() => {
            setConfirmEndModal(false);
            handleEnd();
          }}
          hideModal={() => setConfirmEndModal(false)}
        />
        <ConfirmPopup
          show={confirmSwapQuestionModal}
          title={"XÁC NHẬN ĐỔI CÂU HỎI ?"}
          description={"Đổi câu hỏi từ nguồn câu hỏi dự phòng!"}
          confirm={() => {
            setConfirmSwapQuestionModal(false);
            handleSwapQuestion();
          }}
          hideModal={() => setConfirmSwapQuestionModal(false)}
        />
      </div>
    </div>
  );
}

export default ArrangeRound;

export const TeamContainer = props => {
  const { checked } = props.team;
  const { displayName, _id } = props.team.userId;
  const [confirmCalcPoint, setConfirmCalcPoint] = useState();

  const handleCalcPoint = () => {
    socket.emit("sort-calc-point-team", { userId: _id });
  };

  return (
    <div className="team-container">
      <button
        className="team-name-btn btn-3D"
        style={{ backgroundColor: !checked ? `#2DBBC8` : `#0088B2` }}
        onClick={props.check}
      >
        {displayName}
      </button>
      <div className="team-score">
        <input
          className="input-score"
          type={"number"}
          value={props.team.point}
          disabled={true}
        />
        <button
          className="submit btn-3D"
          onClick={() => setConfirmCalcPoint(true)}
          disabled={!checked || props.disabled}
          style={{
            backgroundColor:
              checked && !props.disabled ? `#1ACA9B` : `#888888`,
            cursor:
              checked && !props.disabled ? `pointer` : `default`,
          }}
        ></button>
      </div>
      <ConfirmPopup
        show={confirmCalcPoint}
        title={`XÁC NHẬN TÍNH ĐIỂM ?`}
        description={`Tính điểm cho đội chơi ${displayName}!`}
        confirm={() => {
          setConfirmCalcPoint(false);
          handleCalcPoint();
        }}
        hideModal={() => setConfirmCalcPoint(false)}
      />
    </div>
  );
};
