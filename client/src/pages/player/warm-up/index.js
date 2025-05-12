import PlayerHeader from "components/player-header";
import React, { useState, useEffect, useRef } from "react";
import NotiPopup from "./Components/noti-popup";
import socket from "services/socket";
import Countdown from "react-countdown";
import { useSnackbar } from "notistack";
import "./style.scss";

// Đặt URL backend tại đây (chỉnh lại nếu deploy thật)
const SERVER_URL = "http://localhost:3333";

function WarmUp() {
  const millisecond = 1000;
  const _countDownRef = useRef();

  const [answerCurrent, setAnswerCurrent] = useState("");
  const [isStart, setIsStart] = useState(0);
  const [timer, setTimer] = React.useState({
    timeOut: Date.now() + 300 * millisecond,
    timePeriod: 300 * millisecond,
  });
  const [questionCurrent, setQuestionCurrent] = React.useState({});
  const [result, setResult] = useState({ status: 0 });
  const { enqueueSnackbar } = useSnackbar();

  const renderTimer = ({
    hours,
    minutes,
    seconds,
    milliseconds,
    total,
    completed,
  }) => {
    return (
      <PlayerHeader
        timer={{
          minutes,
          seconds,
          milliseconds,
          total,
          initial: timer.timePeriod,
        }}
      />
    );
  };

  const handleChoose = event => {
    setAnswerCurrent(event);
  };

  const handleSubmit = () => {
    console.log("submit");
    socket.emit("warm-up-submit", answerCurrent);
    enqueueSnackbar("Đáp án đã được gửi!", { variant: "info" });
    setIsStart(2);
    _countDownRef.current.stop();
  };

  useEffect(() => {
    socket.emit("get-warm-up-game");
    socket.on("warm-up-game", payload => {
      console.log({ warmup: payload });
      if (payload.question && payload.question.content) {
        console.log("Đường dẫn hình ảnh câu hỏi:", payload.question.content);
      }
      
      const { isStarted, timeOut, timePeriod } = payload;
      switch (isStarted) {
        case 0:
          setTimer({
            timeOut: Date.now() + payload.timePeriod * millisecond,
            timePeriod: payload.timePeriod * millisecond,
          });
          setQuestionCurrent(payload.question);
          if (payload.answer) {
            setResult(payload.answer);
            handleChoose(payload.answer.content);
          } else {
            setResult({ status: 0 });
            handleChoose("");
          }
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
          return;
        case 2:
          setTimer({
            timeOut: Date.now() + timePeriod * millisecond,
            timePeriod: timePeriod * millisecond,
          });
          setQuestionCurrent(payload.question);
          if (payload.answer) {
            setResult(payload.answer);
            handleChoose(payload.answer.content);
          }
          setIsStart(2);
          return;
        default:
          return;
      }
    });
    socket.on("warm-up-start", payload => {
      console.log({ start: payload });
      if (payload.question && payload.question.content) {
        console.log("Đường dẫn hình ảnh câu hỏi (start):", payload.question.content);
      }
      
      setTimer({
        timeOut: payload.timeOut,
        timePeriod: payload.timePeriod * millisecond,
      });
      setQuestionCurrent(payload.question);
      enqueueSnackbar("Bắt đầu câu hỏi!", { variant: "info" });
      setIsStart(1);
      _countDownRef.current.start();
    });

    socket.on("warm-up-submitted", payload => {
      console.log({ submitted: payload });
      setResult(payload.answer);
      setIsStart(2);
    });
    //socket.on("warm-up-change-question", payload => {});

    return () => {
      socket.off("warm-up-game");
      socket.off("warm-up-start");
      socket.off("warm-up-submitted");
      //socket.off("warm-up-change-question");
    };
  }, [enqueueSnackbar]);

  useEffect(() => {
    if (questionCurrent && questionCurrent.content) {
      console.log("URL hình ảnh hiện tại:", questionCurrent.content);
      console.log("URL đầy đủ:", `url("${questionCurrent.content}")`);
    }
  }, [questionCurrent]);

  // Hàm lấy src ảnh đúng domain
  const getImageSrc = (src) => {
    if (!src) return "";
    if (src.startsWith("http")) return src;
    return SERVER_URL + src;
  };

  // Hàm log khi ảnh lỗi
  const handleImgError = (e) => {
    console.error("Không load được ảnh:", e.target.src);
  };

  return (
    <div className="warmup-round">
      <Countdown
        date={timer.timeOut}
        // intervalDelay={0}
        precision={4}
        autoStart={false}
        renderer={renderTimer}
        onComplete={handleSubmit}
        ref={_countDownRef}
      />
      <div className="content">
        <div className="title">VÒNG THI KHỞI ĐỘNG</div>
        <div className="question">CÂU {questionCurrent.order}/10</div>
        <div className="score">+{questionCurrent.point}</div>
        <div className="game-space">
          <div className="paper">
            {isStart > 0 && questionCurrent.content && (
              <div className="subject">
                <img 
                  src={getImageSrc(questionCurrent.content)} 
                  alt={`Câu hỏi ${questionCurrent.order}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onLoad={() => console.log("Ảnh đã load thành công:", getImageSrc(questionCurrent.content))}
                  onError={handleImgError}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="group-btn">
        {["A", "B", "C", "D"].map((item, index) => (
          <button
            key={index}
            className={
              answerCurrent === item
                ? "selected btn-3D answer-btn"
                : "btn-3D answer-btn"
            }
            onClick={() => handleChoose(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {result.status === 1 && (
        <NotiPopup
          answer={result.content === result.result}
          point={result.point}
          solution={result.result}
        />
      )}
    </div>
  );
}

export default WarmUp;
