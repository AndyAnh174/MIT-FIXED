import React, { useEffect, useState, useRef } from "react";
import "./style.scss";
import AdminHeader from "components/admin-header";
import socket from "services/socket";
import { useSnackbar } from "notistack";
import Countdown from "react-countdown";
import ConfirmPopup from "components/confirm-popup";

function ConnectionAdmin() {
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
    useState(false);
  const [confirmStartModal, setConfirmStartModal] = useState(false);
  const [confirmReStartModal, setConfirmReStartModal] =
    useState(false);
  const [confirmEndModal, setConfirmEndModal] = useState(false);

  const _countdownRef = useRef();

  useEffect(() => {
    socket.on("connection-received", data => {
      setAnswers(data);
    });
    socket.on("connection-start", () => {
      enqueueSnackbar("Vòng chơi bắt đầu!", { variant: "info" });
    });
    socket.on("connection-timeOut", () => {
      enqueueSnackbar("Vòng chơi kết thúc!", { variant: "error" });
      setIsStart(false);
    });
    socket.on("connection-result", () => {
      enqueueSnackbar("Điểm đã được lưu!", { variant: "success" });
    });
    socket.emit("get-connection-game");
    socket.on("connection-game", payload => {
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

    socket.on("connection-swap-question-success", () => {
      enqueueSnackbar("Đổi câu hỏi thành công!", {
        variant: "success",
      });
    });
    socket.on("connection-swap-question-fail", () => {
      enqueueSnackbar("Đổi câu hỏi thất bại!", { variant: "error" });
    });

    return () => {
      socket.off("connection-game");
      socket.off("connection-received");
      socket.off("connection-start");
      socket.off("connection-timeOut");
      socket.off("connection-result");
      socket.off("connection-swap-question-success");
      socket.off("connection-swap-question-fail");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = () => {
    setIsStart(true);
    socket.emit("connection-start");
  };
  const handleReStart = () => {
    setIsStart(true);
    socket.emit("connection-start");
  };

  const handleSwapQuestion = () => {
    socket.emit("connection-swap-question");
  };

  const handleEnd = () => {
    setIsStart(false);
    socket.emit("connection-timeOut");
    _countdownRef.current.stop();
  };

  const handleCheck = index => {
    setAnswerCurrent(index);
  };

  const handleComplete = () => {
    if (isStart !== null && isStart) {
      enqueueSnackbar("Thời gian đã hết!", { variant: "info" });
      socket.emit("connection-timeOut");
    }
  };

  return (
    <div className="connection-admin-container">
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
            <div className="paper">
              <div
                style={{
                  backgroundImage: `url("${answers[answerCurrent]?.content}")`,
                  width: `100%`,
                  height: `100%`,
                  backgroundPosition: `center`,
                  backgroundRepeat: `no-repeat`,
                  backgroundSize: `cover`,
                  position: `relative`,
                  zIndex: `2`,
                }}
              />
            </div>
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
          {answers.map((item, index) => (
            <TeamContainer
              key={index}
              team={{
                ...item,
                index,
                checked: index === answerCurrent,
              }}
              check={() => handleCheck(index)}
            />
          ))}
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

export default ConnectionAdmin;

export const TeamContainer = props => {
  const { checked } = props.team;
  const { displayName, _id } = props.team.userId;
  const [point, setPoint] = useState(props.team.point);

  const handleChange = event => {
    setPoint(event.target.value);
  };

  const handleSubmit = () => {
    socket.emit("connection-result", { userId: _id, point });
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
          value={point}
          onChange={handleChange}
          disabled={!checked}
        />
        <button
          className="submit btn-3D"
          onClick={handleSubmit}
          disabled={!checked}
          style={{
            backgroundColor: checked ? `#1ACA9B` : `#888888`,
            cursor: checked ? `pointer` : `default`,
          }}
        ></button>
      </div>
    </div>
  );
};
