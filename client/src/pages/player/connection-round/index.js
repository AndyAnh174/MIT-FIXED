import PlayerHeader from "components/player-header";
import React, { useState } from "react";
import "./style.scss";
import { ReactComponent as RecoverIcon } from "../../../assets/svg/recover-icon.svg";
import { ReactComponent as SubmitIcon } from "../../../assets/svg/submit-icon.svg";
import ElementDrawable from "components/element-draw";
import exportAsImage from "services/html2canvas";
import { filesService } from "services/firebase/filesService";
import Countdown from "react-countdown";
import socket from "services/socket";
import controller from "./controller";
import NotificationPopup from "components/notification-popup";
import ConfirmPopup from "components/confirm-popup";
import { useSnackbar } from "notistack";
import { localFilesService } from "services/file/localFilesService";

function ConnectionRound(props) {
  const _connectionRef = React.useRef();
  const _pageRef = React.useRef();
  const _countdownRef = React.useRef();
  const _submitButtonRef = React.useRef();
  const _refreshButtonRef = React.useRef();
  const [notificationModal, setNotificationModal] = React.useState({
    show: false,
    title: "",
    description: "",
    disable: false,
  });
  const [confirmModal, setConfirmModal] = useState(false);

  const [answer, setAnswer] = React.useState({
    _id: "",
    content: "",
    questionId: "",
    point: "-",
    year: 0,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [timePeriod, setTimePeriod] = useState(0);
  const [initialTimer, setInitialTimer] = useState(
    Date.now() + 1 * 60 * 1000,
  );
  const [elements, setElements] = React.useState(<></>);
  const [question, setQuestion] = React.useState({
    _id: "-",
    content: "-",
    point: "-",
    image: "[]",
  });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleHideNotiModal = () => {
    setNotificationModal({
      show: false,
      title: "",
      description: "",
      disable: false,
    });
  };

  const handleHideConfirmModal = () => {
    setConfirmModal(false);
  };

  const handleConfirm = () => {
    setConfirmModal(true);
  };

  const handleSubmit = async () => {
    setConfirmModal(false);
    if (isStarted && !isSubmitted) {
      _connectionRef.current.style.cursor = "wait";
      const canvas = await exportAsImage(_pageRef.current, "test");
      await canvas.toBlob(
        async function (blob) {
          var res = await localFilesService.uploadTaskPromise(blob);
          console.log(res);
          socket.emit("connection-submit", {
            content: res.data,
          });
        },
        "image/png",
        2,
      );
    }
    _countdownRef.current.stop();
  };

  const handleComplete = () => {
    setNotificationModal({
      show: true,
      title: "ĐÃ HẾT THỜI GIAN LÀM BÀI",
      description:
        "Bài thi của bạn nếu chưa Nộp sẽ được nộp tự động!",
      disable: false,
    });
    handleSubmit();
  };

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
          initial: timePeriod * 1000,
        }}
      />
    );
  };

  React.useEffect(() => {
    if (isStarted) {
      enqueueSnackbar("Vòng chơi đang diễn ra!", { variant: "info" });
    }
  }, [isStarted]);

  React.useEffect(() => {
    socket.emit("get-connection-game");
  }, []);

  React.useEffect(() => {
    socket.on("connection-game", payload => {
      console.log(">> connection-game");
      setConfirmModal(false);
      setNotificationModal({ ...notificationModal, show: false });
      console.log(payload);
      const { timeOut, timePeriod, question } = payload;
      setIsStarted(payload.isStarted === 1 ? true : false);
      setElements(
        controller.renderElement(
          JSON.parse(question.image),
          _pageRef,
        ),
      );
      setTimePeriod(timePeriod);
      setQuestion(question);
      if (payload.answer !== undefined && payload.answer) {
        setIsSubmitted(true);
        setAnswer(payload.answer);
      } else {
        setIsSubmitted(false);
      }

      if (
        payload.isStarted !== undefined &&
        payload.isStarted === 1
      ) {
        setIsStarted(true);
        const initialTimerOut = Date.parse(timeOut);
        setInitialTimer(initialTimerOut);
        _countdownRef.current.start();
      } else {
        setInitialTimer(Date.now() + timePeriod * 1000);
        _countdownRef.current.stop();
        setIsStarted(false);
      }
    });

    socket.on("connection-received", payload => {
      const { status, answer } = payload;
      console.log({ answer });
      if (status) {
        setNotificationModal({
          show: true,
          title: "ĐÃ NỘP THÀNH CÔNG",
          description:
            "Đáp án của bạn đang được giám khảo chấm điểm!",
          disable: false,
        });
        setIsSubmitted(true);
        setAnswer({ ...answer, content: payload.answer.content });
      } else {
      }
      _connectionRef.current.style.cursor = "default";
    });

    socket.on("connection-result", payload => {
      if (payload.point !== null) {
        setNotificationModal({
          show: true,
          title: "BẠN NHẬN THÊM " + payload.point + " ĐIỂM",
          description:
            "Chúc mừng, bài thi của bạn đã được chấm thành công!",
          disable: false,
        });
        setAnswer({ ...answer, point: payload.point });
      }
    });

    socket.on("connection-timeOut", () => {
      enqueueSnackbar("Vòng chơi kết thúc!", { variant: "error" });
      setIsStarted(false);
      _countdownRef.current.stop();
      handleSubmit();
    });

    return () => {
      socket.off("connection-received");
      socket.off("connection-game");
      socket.off("connection-result");
      socket.off("connection-timeOut");
    };
  }, [
    answer,
    enqueueSnackbar,
    handleSubmit,
    isStarted,
    notificationModal,
  ]);

  return (
    <div className="connection-round" ref={_connectionRef}>
      <Countdown
        date={initialTimer}
        // intervalDelay={0}
        precision={4}
        autoStart={false}
        renderer={renderTimer}
        onComplete={handleComplete}
        ref={_countdownRef}
      />

      <div className="content">
        <div className="game-space">
          <div className="left-side">
            <div className="paper">
              <div className="canvas" ref={_pageRef}>
                {isSubmitted ? (
                  <div
                    style={{
                      backgroundImage: `url("${answer?.content}")`,
                      width: `100%`,
                      height: `100%`,
                      backgroundPosition: `center`,
                      backgroundRepeat: `no-repeat`,
                      backgroundSize: `cover`,
                      position: `relative`,
                      zIndex: `5`,
                    }}
                  />
                ) : isStarted ? (
                  elements
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className="right-side">
            <p className="name-round">VÒNG THI KẾT NỐI</p>
            <div className="question-container">
              <p className="title">Đề thi</p>
              <textarea
                className="question"
                disabled={true}
                value={
                  isStarted
                    ? question?.content
                    : "Nằm ngoài thời gian làm bài!"
                }
              ></textarea>
            </div>
            <div className="point-container">
              <p className="title">Điểm vòng thi</p>
              <p className="point">
                {answer
                  ? (answer.point ? answer.point : "-") +
                    "/" +
                    question?.point
                  : "-/" + question?.point}
              </p>
            </div>
            <button
              className="recover-btn btn-3D"
              disabled={!isStarted || isSubmitted}
              ref={_refreshButtonRef}
            >
              <RecoverIcon />
              KHÔI PHỤC
            </button>
            <button
              className="submit-btn btn-3D"
              disabled={!isStarted || isSubmitted}
              onClick={handleConfirm}
              ref={_submitButtonRef}
            >
              <SubmitIcon />
              {isSubmitted ? "ĐÃ NỘP" : "NỘP BÀI"}
            </button>
          </div>
          <NotificationPopup
            show={notificationModal.show}
            hideModal={handleHideNotiModal}
            title={notificationModal.title}
            description={notificationModal.description}
            disable={notificationModal.disable}
          />
          <ConfirmPopup
            show={confirmModal}
            hideModal={handleHideConfirmModal}
            confirm={handleSubmit}
            title={`XÁC NHẬN NỘP BÀI`}
            description={`Bạn chắc chắn muốn nộp bài chứ?`}
          />
        </div>
      </div>
    </div>
  );
}

export default ConnectionRound;
