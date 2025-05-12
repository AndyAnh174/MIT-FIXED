import React from "react";
import AdminHeader from "components/admin-header";
import Countdown from "react-countdown";
import "./style.scss";
import ResultDisplay from "./components/result-display";
import { useSnackbar } from "notistack";
import socket from "services/socket";
import ConfirmPopup from "components/confirm-popup";

SpeedUp.propTypes = {};

function SpeedUp(props) {
  const _countDownRef = React.useRef();
  const { enqueueSnackbar } = useSnackbar();
  const [resultDisplay, setResultDisplay] = React.useState(false);
  const [timer, setTimer] = React.useState({
    timePeriod: 10 * 60 * 1000,
    timeOut: Date.now() + 10 * 60 * 1000,
  });
  const [confirmSwapQuestionModal, setConfirmSwapQuestionModal] =
    React.useState(false);
  const [isStart, setIsStart] = React.useState(false);
  const [answers, setAnswers] = React.useState([
    // {
    //   _id: "",
    //   content: "BAGD BDGE BDG",
    //   result: "1101-----",
    //   point: "80",
    //   userId: {
    //     _id: "",
    //     nameDisplay: "Just in time",
    //   },
    //   timeSubmit: "02:30",
    // },
  ]);
  const [question, setQuestion] = React.useState({
    _id: "",
    content: "",
    point: "",
    solution: "",
  });

  const [calcPointComplete, setCalcPointComplete] =
    React.useState(false);

  const [confirmStartModal, setConfirmStartModal] =
    React.useState(false);

  const [confirmEndModal, setConfirmEndModal] = React.useState(false);

  function handleHideResult() {
    setResultDisplay(false);
  }

  const handleSwapQuestion = () => {
    socket.emit("speed-up-swap-question");
  };

  function handleResultOnClick() {
    setResultDisplay(true);
  }

  function handleTimeOut() {
    if (isStart) {
      setConfirmEndModal(false);
      socket.emit("speed-up-timeOut");
      enqueueSnackbar("Vòng chơi kết thúc!", {
        variant: "error",
      });
    }
  }

  function handleStart() {
    if (!isStart) {
      setConfirmStartModal(false);
      socket.emit("speed-up-start");
    }
  }

  function handleCalcPoint() {
    socket.emit("speed-up-calc-point");
  }

  React.useEffect(() => {
    socket.on("speed-up-game", payload => {
      setCalcPointComplete(false);
      const { isStarted, timeOut, timePeriod } = payload;
      if (isStarted === 1) {
        setTimer({
          timeOut,
          timePeriod: timePeriod * 1000,
        });
        setIsStart(true);
        _countDownRef.current.start();
      } else {
        setIsStart(false);
        setTimer({
          timeOut: Date.now() + timePeriod * 1000,
          timePeriod: timePeriod * 1000,
        });
      }
      setAnswers(payload.answers);
      setQuestion(payload.question);
    });

    socket.on("speed-up-team-update", payload => {
      const { answer } = payload;
      console.log({ answer });
      var newAnswers = answers;
      var oldTeamIndex = newAnswers.findIndex(
        team => team._id === answer._id,
      );
      if (oldTeamIndex < 0) {
        enqueueSnackbar(
          `Đã nhận được đáp án đến từ đội ${answer.userId.displayName}!`,
          {
            variant: "info",
          },
        );
        newAnswers.push(answer);
      } else {
        newAnswers[oldTeamIndex] = answer;
      }
      setAnswers([...newAnswers]);
    });

    socket.on("speed-up-timeOut", payload => {
      _countDownRef.current.stop();
      setIsStart(false);
      // setTimer({
      //   timePeriod: 300 * 1000,
      //   timeOut: Date.now(),
      // });
      setResultDisplay(true);
    });

    socket.on("speed-up-start", payload => {
      console.log({ payload });
      const { timeOut, timePeriod } = payload;
      setTimer({
        ...timer,
        timeOut: timeOut,
        timePeriod: timePeriod * 1000,
      });
      setIsStart(true);
      console.log("start");
      _countDownRef.current.start();
      enqueueSnackbar("Vòng chơi bắt đầu!", {
        variant: "info",
      });
      setQuestion(payload.question);
    });

    socket.on("speed-up-calc-point-complete", payload => {
      setCalcPointComplete(true);
    });

    socket.on("speed-up-question-success", payload => {
      enqueueSnackbar("Đổi câu hỏi thành công!", {
        variant: "success",
      });
    });
    socket.on("speed-up-question-fail", payload => {
      enqueueSnackbar("Đổi câu hỏi thất bại!", { variant: "error" });
    });

    return () => {
      socket.off("speed-up-game");
      socket.off("speed-up-team-update");
      socket.off("speed-up-timeOut");
      socket.off("speed-up-start");
      socket.off("speed-up-calc-point-complete");
    };
  }, [answers, enqueueSnackbar, timer]);

  React.useEffect(() => {
    socket.emit("get-speed-up-game");
  }, []);

  return (
    <div className="admin__speed-up">
      <AdminHeader />
      <div className="content">
        <div className="game-space">
          <div className="title-component">
            <div className="title">VÒNG THI TĂNG TỐC</div>
          </div>
          <div className="subject-container">
            {isStart && (
              <div
                className="subject"
                style={{
                  backgroundImage: `url("${question.content}")`,
                }}
              />
            )}
          </div>
          <div className="footer">
            <div className="timer">
              <Countdown
                date={timer.timeOut}
                precision={2}
                autoStart={false}
                renderer={({ minutes, seconds, total }) => {
                  return (
                    <>
                      <p className="time">
                        {minutes < 10 ? "0" + minutes : minutes}:
                        {seconds < 10 ? "0" + seconds : seconds}
                      </p>
                      <div
                        className="progress-bar"
                        style={{
                          backgroundSize:
                            (total / timer.timePeriod) * 100 + "%",
                          "--value": `${
                            (total / timer.timePeriod) * 100
                          }%`,
                        }}
                      ></div>
                    </>
                  );
                }}
                onComplete={handleTimeOut}
                ref={_countDownRef}
              />
            </div>
            <div className="controller">
              <button
                className="btn-3D btn-swap-question"
                onClick={() => {
                  setConfirmSwapQuestionModal(true);
                }}
                disabled={isStart}
              >
                ĐỔI CÂU HỎI
              </button>
              <button
                className="btn-3D btn-start"
                onClick={() => setConfirmStartModal(true)}
                disabled={isStart && !confirmStartModal}
              >
                BẮT ĐẦU
              </button>
              <button
                className="btn-3D btn-end"
                disabled={!isStart && !confirmEndModal}
                onClick={() => setConfirmEndModal(true)}
              >
                KẾT THÚC
              </button>
              <button
                className="btn-3D btn-result"
                onClick={handleResultOnClick}
              >
                KẾT QUẢ
              </button>
            </div>
          </div>
          <ResultDisplay
            show={resultDisplay}
            answers={answers}
            handleHide={handleHideResult}
            handleCalcPoint={handleCalcPoint}
            solution={calcPointComplete ? question.solution : ""}
          />
          <ConfirmPopup
            show={confirmStartModal}
            title={"XÁC NHẬN BẮT ĐẦU ?"}
            description={"Bắt đầu vòng thi ngay bây giờ!"}
            confirm={handleStart}
            hideModal={() => setConfirmStartModal(false)}
          />
          <ConfirmPopup
            show={confirmEndModal}
            title={"XÁC NHẬN KẾT THÚC?"}
            description={"Kết thúc vòng thi ngay bây giờ!"}
            confirm={handleTimeOut}
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
    </div>
  );
}

export default SpeedUp;
