import PlayerHeader from "components/player-header";
import React from "react";
import "./style.scss";
import { ReactComponent as RecoverIcon } from "../../../assets/svg/recover-icon.svg";
import { ReactComponent as SubmitIcon } from "../../../assets/svg/submit-icon.svg";
import ConfirmPopup from "components/confirm-popup";
import socket from "services/socket";
import Countdown from "react-countdown";
import { useSnackbar } from "notistack";
import PopupSpeedUp from "components/popup-speedup";

function SpeedUp(props) {
  const _countdownRef = React.useRef();
  const _inputRef = React.useRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [btnState, setBtnState] = React.useState(false);
  const [isStart, setIsStart] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [question, setQuestion] = React.useState({
    _id: "",
    content: "",
    point: "",
  });
  const [answer, setAnswer] = React.useState({
    _id: "",
    content: "",
    point: "",
    result: "",
    status: 0,
    solution: "",
  });
  const [timer, setTimer] = React.useState({
    timeOut: Date.now() + 300 * 1000,
    timePeriod: 300 * 1000,
  });
  const [confirmSubmitModal, setConfirmSubmitModal] = React.useState({
    show: false,
  });
  const [modalNotification, setModalNotification] = React.useState({
    show: false,
    title: "ĐÃ NỘP ĐÁP ÁN THÀNH CÔNG!",
    description:
      "Đáp án đã được ghi nhận và đang trong quá trình tính điểm!",
    buttonText: "ĐÃ GỬI",
    buttonColor: "#0C9B75",
    disable: true,
    handleButtonClick: () => {
      setModalNotification({ ...modalNotification, show: false });
    },
  });

  function handleSubmit() {
    setConfirmSubmitModal({ ...confirmSubmitModal, show: false });
    socket.emit("speed-up-submit", answer.content);
    setIsSubmitted(true);
    enqueueSnackbar("Đáp án đang được gửi đi!", {
      variant: "info",
    });
  }

  function handleInputOnChange(event) {
    if (!isSubmitted) {
      setAnswer({ ...answer, content: event.target.value });
    }
  }

  function handleClearOnClick() {
    if (!isSubmitted) {
      setAnswer({ ...answer, content: "_" });
      _inputRef.current.focus();
    }
  }

  function handleTimeOut() {
    if (!isSubmitted) {
      handleSubmit();
    }
  }

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

  React.useEffect(() => {
    socket.emit("get-speed-up-game");
  }, []);

  React.useEffect(() => {
    socket.on("speed-up-game", payload => {
      setAnswer({
        ...answer,
        content: "",
        solution: "",
        status: 0,
        result: "",
        point: 0,
      });
      setConfirmSubmitModal(false);
      setModalNotification({ ...modalNotification, show: false });
      const { isStarted, timeOut, timePeriod } = payload;
      if (isStarted === 1) {
        setIsStart(true);
        setTimer({ timeOut: timeOut, timePeriod: timePeriod * 1000 });
        enqueueSnackbar("Vòng chơi bắt đầu!", { variant: "info" });
        _countdownRef.current.start();
      } else {
        setIsStart(false);
        setTimer({
          ...timer,
          timeOut: Date.now() + timePeriod * 1000,
          timePeriod: timePeriod * 1000,
        });
      }
      if (payload.answer && payload.answer !== null) {
        setAnswer(payload.answer);
        setIsSubmitted(true);
      } else {
        setIsSubmitted(false);
      }
      setQuestion(payload.question);
    });

    socket.on("speed-up-start", payload => {
      const { timeOut, timePeriod, question } = payload;
      setIsStart(true);
      setTimer({
        timeOut: timeOut,
        timePeriod: timePeriod * 1000,
      });
      enqueueSnackbar("Vòng chơi bắt đầu!", {
        variant: "info",
      });
      _countdownRef.current.start();
      setQuestion(question);
    });

    socket.on("speed-up-timeOut", payload => {
      enqueueSnackbar("Đã hết thời gian làm bài!", {
        variant: "warning",
      });
      setIsStart(false);
      // handleTimeOut();
      setTimer({ ...timer, timeOut: Date.now() });
      // _countdownRef.current.stop();
    });

    socket.on("speed-up-submitted", payload => {
      const { status } = payload;
      if (status) {
        setIsSubmitted(true);
        enqueueSnackbar("Đã nộp bài thành công!", {
          variant: "success",
        });
      } else {
        setIsSubmitted(false);
        enqueueSnackbar("Nộp bài thất bại!", {
          variant: "error",
        });
      }
    });

    socket.on("speed-up-result", payload => {
      console.log({ result: payload });
      const { answer } = payload;
      setAnswer(answer);
    });

    return () => {
      socket.off("speed-up-game");
      socket.off("speed-up-start");
      socket.off("speed-up-timeOut");
      socket.off("speed-up-submitted");
      socket.off("speed-up-result");
    };
  }, [
    _countdownRef,
    enqueueSnackbar,
    modalNotification,
    timer,
    answer,
  ]);

  React.useEffect(() => {
    if (answer?.status === 1) {
      const str = answer.result;
      const characterRight = str.split("1").length - 1;
      const characterSum = str.length;
      setModalNotification({
        show: true,
        title: "ĐÃ HOÀN THÀNH CHẤM ĐIỂM!",
        description: `Đội bạn nhận thêm +${answer.point} với ${characterRight}/${characterSum} kí tự giải mã chính xác!`,
        buttonText: "ẨN THÔNG BÁO",
        buttonColor: "#0C9B75",
        disable: false,
        handleButtonClick: () => {
          setModalNotification({ ...modalNotification, show: false });
        },
      });
    }
  }, [answer]);

  React.useEffect(() => {
    if (isSubmitted && answer?.status !== 1) {
      setModalNotification({
        show: true,
        title: "ĐÃ NỘP ĐÁP ÁN THÀNH CÔNG!",
        description:
          "Đáp án đã được ghi nhận và đang trong quá trình tính điểm!",
        buttonText: "ĐÃ GỬI",
        buttonColor: "#0C9B75",
        disable: true,
        handleButtonClick: () => {},
      });
    }
  }, [isSubmitted]);

  React.useEffect(() => {
    setBtnState(
      modalNotification.show ||
        confirmSubmitModal.show ||
        !isStart ||
        isSubmitted,
    );
  }, [modalNotification, confirmSubmitModal, isStart, isSubmitted]);

  return (
    <div className="player__speed-up">
      <Countdown
        date={timer.timeOut}
        // intervalDelay={0}
        precision={2}
        autoStart={false}
        renderer={renderTimer}
        onComplete={handleTimeOut}
        ref={_countdownRef}
      />
      <div className="content">
        <div className="game-space">
          <div className="title">VÒNG THI TĂNG TỐC</div>
          <div className="subject-container">
            {(isStart || isSubmitted) && (
              <div
                className="subject"
                style={{
                  backgroundImage: `url("${question?.content}")`,
                }}
              />
            )}
          </div>
          <div className="footer">
            <button
              className="btn-3D btn-refresh"
              onClick={handleClearOnClick}
              disabled={isSubmitted}
            >
              <RecoverIcon /> KHÔI PHỤC
            </button>
            <input
              className="answer-box"
              value={answer.content}
              placeholder="DAP AN CUA BAN"
              ref={_inputRef}
              disabled={isSubmitted || !isStart}
              onChange={handleInputOnChange}
            />
            <button
              className="btn-3D btn-submit"
              disabled={btnState}
              onClick={() =>
                setConfirmSubmitModal({
                  ...confirmSubmitModal,
                  show: true,
                })
              }
            >
              <SubmitIcon />
              NỘP BÀI
            </button>
          </div>
          <ConfirmPopup
            show={confirmSubmitModal.show}
            title={"XÁC NHẬN NỘP BÀI?"}
            description={
              "Sau khi nộp bạn sẽ không thể thay đổi đáp án?"
            }
            hideModal={() => {
              setConfirmSubmitModal({
                ...confirmSubmitModal,
                show: false,
              });
            }}
            confirm={handleSubmit}
          />
          <PopupSpeedUp
            show={modalNotification.show}
            title={modalNotification.title}
            description={modalNotification.description}
            disable={modalNotification.disable}
            buttonText={modalNotification.buttonText}
            buttonColor={modalNotification.buttonColor}
            hideModal={modalNotification.handleButtonClick}
            value={{
              answer: answer.content,
              result: answer.result,
              solution: answer.solution,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default SpeedUp;
