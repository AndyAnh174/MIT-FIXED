import React, { useEffect } from "react";
import PropTypes from "prop-types";
import AdminHeader from "components/admin-header";
import "./style.scss";
import ProgrammingTeam from "./components/programming-team";
import socket from "services/socket";
import Countdown from "react-countdown";
import { useSnackbar } from "notistack";
import ConfirmPopup from "components/confirm-popup";

Programming.propTypes = {};

function Programming(props) {
  const _countDownRef = React.useRef();
  const [confirmEndModal, setConfirmEndModal] = React.useState(false);
  const [confirmStartModal, setConfirmStartModal] =
    React.useState(false);
  const [timer, setTimer] = React.useState({
    timePeriod: 300 * 1000,
    timeOut: Date.now() + 300 * 1000,
  });
  const [confirmSwapQuestionModal, setConfirmSwapQuestionModal] =
    React.useState(false);
  const [isStart, setIsStart] = React.useState(false);
  const [answers, setAnswers] = React.useState([
    // {
    //   _id: "",
    //   content: "",
    //   point: 0,
    //   status: 0,
    //   result: "100-----",
    //   userId: {
    //     _id: "",
    //     nameDisplay: "",
    //   },
    // },
  ]);
  const [testCasesDisplay, setTestCasesDisplay] = React.useState([
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7+",
  ]);
  const [question, setQuestion] = React.useState({
    _id: "",
    content: "",
    point: 100,
  });
  const [calculating, setCalculating] = React.useState(false);
  const [confirmCalcPointModal, setConfirmCalcPointModal] =
    React.useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  function handleTimeOut() {
    if (isStart) {
      socket.emit("programming-timeOut");
      enqueueSnackbar("Vòng chơi kết thúc!", {
        variant: "error",
      });
    }
  }

  function handleStart() {
    if (!isStart) {
      socket.emit("programming-start");
    }
  }

  const handleSwapQuestion = () => {
    socket.emit("programming-swap-question");
  };

  function handleCalcPoint() {
    setCalculating(true);
    socket.emit("programming-calc-point");
    setConfirmCalcPointModal(false);
  }

  useEffect(() => {
    socket.emit("get-programming-game");
  }, []);

  useEffect(() => {
    if (answers && answers.length > 0) {
      const strResult = answers[0].result;
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
      var tcDisplay = [];
      for (let index = begin; index < end; index++) {
        tcDisplay.push(index);
      }
      if (end < strResult.length) {
        tcDisplay[7] = `${tcDisplay[7]}+`;
      }
      setTestCasesDisplay([...tcDisplay]);
    }
  }, [answers]);

  useEffect(() => {
    socket.on("programming-game", payload => {
      console.log({ programming: payload });
      const { isStarted, timeOut, timePeriod } = payload;
      if (isStarted === 1) {
        setTimer({
          timeOut: timeOut,
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
      setAnswers(
        payload.answers?.sort((a, b) => a.timeSubmit - b.timeSubmit),
      );
      setQuestion(payload.question);
    });

    socket.on("programming-team-update", payload => {
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
      newAnswers = newAnswers?.sort(
        (a, b) => a.timeSubmit - b.timeSubmit,
      );
      setAnswers([...newAnswers]);
    });

    socket.on("programming-timeOut", payload => {
      setIsStart(false);
      setTimer({
        timePeriod: 300 * 1000,
        timeOut: Date.now(),
      });
    });

    socket.on("programming-start", payload => {
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
    });

    socket.on("programming-calculating-point", payload => {
      setCalculating(true);
      enqueueSnackbar("Đang tính toán cho testcase số " + payload, {
        variant: "info",
      });
    });

    socket.on("programming-calc-point-complete", payload => {
      setCalculating(false);
      enqueueSnackbar("Đã hoàn tất tính toán điểm!", {
        variant: "success",
      });
    });

    socket.on("programming-swap-question-success", payload => {
      enqueueSnackbar("Đổi câu hỏi thành công!", {
        variant: "success",
      });
    });
    socket.on("programming-swap-question-fail", payload => {
      enqueueSnackbar("Đổi câu hỏi thất bại!", { variant: "error" });
    });

    return () => {
      socket.off("programming-game");
      socket.off("programming-team-update");
      socket.off("programming-calculating-point");
      socket.off("programming-start");
      socket.off("programming-calc-point-complete");
      socket.off("programming-swap-question-success");
      socket.off("programming-swap-question-fail");
    };
  }, [answers, enqueueSnackbar, timer]);
  return (
    <div className="admin-programming-round">
      <AdminHeader />
      <div className="content">
        <div className="game-space">
          <p className="title">VÒNG THI LẬP TRÌNH TIẾP SỨC</p>
          <div className="list-teams-container">
            <div className="header">
              <p className="name" />
              <p className="time-created">THỜI GIAN</p>
              {testCasesDisplay.map((item, index) => (
                <p key={index} className="test-case">
                  {item}
                </p>
              ))}
              <p className="point">ĐIỂM</p>
            </div>
            <div className="teams">
              {answers.map((item, index) => {
                return (
                  <ProgrammingTeam
                    key={item._id.toString()}
                    answer={item}
                    maxPoint={question?.point}
                  />
                );
              })}
            </div>
          </div>
          <div className="footer">
            <div className="timer">
              <Countdown
                date={timer.timeOut}
                // intervalDelay={0}
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
                className="btn-swap-question btn-3D"
                onClick={() => {
                  setConfirmSwapQuestionModal(true);
                }}
                disabled={isStart}
              >
                ĐỔI CÂU HỎI
              </button>
              <button
                className="btn-calc-point btn-3D"
                onClick={() => {
                  setConfirmCalcPointModal(true);
                }}
                disabled={calculating}
              >
                TÍNH ĐIỂM
              </button>
              <button
                className="btn-start btn-3D"
                disabled={isStart}
                onClick={() => setConfirmStartModal(true)}
              >
                BẮT ĐẦU
              </button>
              <button
                className="btn-end btn-3D"
                disabled={!isStart}
                onClick={() => setConfirmEndModal(true)}
              >
                KẾT THÚC
              </button>
            </div>
          </div>
          <ConfirmPopup
            show={confirmCalcPointModal}
            title={"XÁC NHẬN ?"}
            description={
              "Thực hiện tính toán điểm phần thi của các đội chơi!"
            }
            confirm={handleCalcPoint}
            hideModal={() => setConfirmCalcPointModal(false)}
          />
          <ConfirmPopup
            show={confirmStartModal}
            title={"XÁC NHẬN BẮT ĐẦU ?"}
            description={"Bắt đầu vòng thi ngay bây giờ!"}
            confirm={() => {
              setConfirmStartModal(false);
              handleStart();
            }}
            hideModal={() => setConfirmStartModal(false)}
          />
          <ConfirmPopup
            show={confirmEndModal}
            title={"XÁC NHẬN KẾT THÚC?"}
            description={"Kết thúc vòng thi ngay bây giờ!"}
            confirm={() => {
              setConfirmEndModal(false);
              handleTimeOut();
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
    </div>
  );
}

export default Programming;
