import React, { useEffect, useState, useRef } from "react";
import "./style.scss";
import AdminHeader from "components/admin-header";
import socket from "services/socket";
import { ReactComponent as DropdownIcon } from "../../../assets/svg/dropdown-icon-white.svg";
import GroupAQ from "./Components/GroupA_Q";
import Countdown from "react-countdown";
import { useSnackbar } from "notistack";
import ConfirmPopup from "components/confirm-popup";

function WarmUp(props) {
  const millisecond = 1000;
  const [timer, setTimer] = React.useState({
    timeOut: Date.now() + 300 * millisecond,
    timePeriod: 300 * millisecond,
  });
  const [confirmStartModal, setConfirmStartModal] = useState(false);
  const [confirmSwapQuestionModal, setConfirmSwapQuestionModal] =
    useState(false);
  const [isStart, setIsStart] = useState(0);
  const _countDownRef = useRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [questionCurrent, setQuestionCurrent] = useState({});
  const [answers, setAnswers] = useState([]);

  const handleStart = () => {
    socket.emit("warm-up-start");
  };

  const handlePrev = () => {
    const current = questionCurrent.order;
    socket.emit("warm-up-change-question", current - 1);
  };

  const handleNext = () => {
    const current = questionCurrent.order;
    socket.emit("warm-up-change-question", current + 1);
  };

  const handleTimeOut = () => {
    if (isStart === 1) {
      socket.emit("warm-up-timeOut");
      enqueueSnackbar("Kết thúc câu hỏi!", { variant: "error" });
    }
  };

  const handleSwapQuestion = () => {
    socket.emit("warm-up-swap-question");
  };

  useEffect(() => {
    socket.emit("get-warm-up-game");
  }, []);

  useEffect(() => {
    socket.on("warm-up-game", payload => {
      console.log({ warmup: payload });
      const { isStarted, timeOut, timePeriod, answers } = payload;
      //switch case
      switch (isStarted) {
        case 0:
          setTimer({
            timeOut: Date.now() + payload.timePeriod * millisecond,
            timePeriod: payload.timePeriod * millisecond,
          });
          setQuestionCurrent(payload.question);
          setAnswers(answers);
          setIsStart(0);
          return;
        case 1:
          setTimer({
            timeOut: timeOut,
            timePeriod: timePeriod * millisecond,
          });
          setQuestionCurrent(payload.question);
          setIsStart(1);
          _countDownRef.current.start();
          enqueueSnackbar("Vòng chơi bát đầu!", { variant: "info" });
          return;
        case 2:
          setTimer({
            timeOut: Date.now() + timePeriod * millisecond,
            timePeriod: timePeriod * millisecond,
          });
          setQuestionCurrent(payload.question);
          setAnswers(answers);
          setIsStart(2);
          return;
        default:
          return;
      }
    });
    socket.on("warm-up-start", payload => {
      console.log({ start: payload });
      setTimer({
        timeOut: payload.timeOut,
        timePeriod: payload.timePeriod * millisecond,
      });
      setQuestionCurrent(payload.question);
      enqueueSnackbar("Bắt đầu câu hỏi!", { variant: "info" });
      setIsStart(1);
      _countDownRef.current.start();
    });
    socket.on("warm-up-timeOut", payload => {
      //_countDownRef.current.stop();
      setIsStart(2);
      return;
    });

    socket.on("warm-up-team-update", payload => {
      const answer = payload;
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

    socket.on("warm-up-swap-question-success", payload => {
      enqueueSnackbar("Đổi câu hỏi thành công!", {
        variant: "success",
      });
    });
    socket.on("warm-up-swap-question-fail", payload => {
      enqueueSnackbar("Đổi câu hỏi thất bại!", { variant: "error" });
    });

    return () => {
      socket.off("warm-up-game");
      socket.off("warm-up-start");
      socket.off("warm-up-team-update");
      socket.off("warm-up-swap-question-success");
      socket.off("warm-up-swap-question-fail");
    };
  }, [answers, enqueueSnackbar]);
  return (
    <div className="warm-up-admin-container">
      <AdminHeader />
      <div className="content">
        <div className="container">
          <div className="left">
            <div className="header">
              <div className="scoreLeft">
                +{questionCurrent.point}
              </div>
              <div className="middle-title">
                <div className="title">VÒNG THI KHỞI ĐỘNG</div>
                <div className="selectRoundBtn">
                  Câu {questionCurrent.order}/10
                  <DropdownIcon />
                </div>
              </div>
              <div className="scoreRight">
                {answers.length > 0 ? questionCurrent.solution : "-"}
              </div>
            </div>
            <div className="content">
              <div className="paper">
                {(answers.length > 0 || isStart > 0) && (
                  <div
                    className="subject"
                    style={{
                      backgroundImage: `url("${questionCurrent.content}")`,
                    }}
                  ></div>
                )}
              </div>
            </div>
            <div className="footer">
              <div className="timer">
                <Countdown
                  date={timer.timeOut}
                  // intervalDelay={0}
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
              <div className="group-btn">
                <button
                  className="swap-question btn-3D"
                  onClick={() => {
                    setConfirmSwapQuestionModal(true);
                  }}
                  disabled={isStart === 1}
                >
                  ĐỔI CÂU HỎI
                </button>
                <button
                  className="prevBtn btn-3D"
                  onClick={handlePrev}
                  disabled={
                    questionCurrent.order === 1
                      ? true
                      : false || isStart === 1
                  }
                >
                  PHÍA TRƯỚC
                </button>
                <button
                  className="startBtn btn-3D"
                  onClick={() => setConfirmStartModal(true)}
                  disabled={isStart === 1 ? true : false}
                >
                  BẮT ĐẦU
                </button>
                <button
                  className="nextBtn btn-3D"
                  onClick={handleNext}
                  disabled={
                    questionCurrent.order === 10
                      ? true
                      : false || isStart === 1
                  }
                >
                  PHÍA SAU
                </button>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="textDA">ĐÁP ÁN CỦA CÁC ĐỘI</div>
            <div className="answer">
              {answers.length > 0 &&
                answers.map((item, index) => (
                  <GroupAQ
                    key={item._id}
                    txtName={item.userId.displayName}
                    txtAnswer={item.content}
                    state={(item.content === item.result).toString()}
                  />
                ))}
              {/* <GroupA_Q
              txtName="JUST IN TIME"
              txtAnswer="A"
              state="true"
            />
            <GroupA_Q
              txtName="JUST IN TIME"
              txtAnswer="A"
              state="true"
            /> */}
            </div>
          </div>
        </div>
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

export default WarmUp;
