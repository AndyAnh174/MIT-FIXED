import PlayerHeader from "components/player-header";
import React, { useEffect, useMemo, useState } from "react";
import "./style.scss";
import { ReactComponent as RecoverIcon } from "../../../assets/svg/recover-icon.svg";
import { ReactComponent as SubmitIcon } from "../../../assets/svg/submit-icon.svg";
import Countdown from "react-countdown";
import socket from "services/socket";
import NotificationPopup from "components/notification-popup";
import ConfirmPopup from "components/confirm-popup";
import { useSnackbar } from "notistack";
import { useCallback } from "react";
import { DragDropCode } from "components/dragdropcode";

function ArrangeRound(props) {
  const _countdownRef = React.useRef();
  const _submitButtonRef = React.useRef();
  const _refreshButtonRef = React.useRef();
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmResetModal, setConfirmResetModal] = useState(false);
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [notificationModal, setNotificationModal] = React.useState({
    show: false,
    title: "",
    description: "",
    disable: false,
  });

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
  const [question, setQuestion] = React.useState({
    _id: "-",
    content: "[]",
    point: "-",
    image: "[]",
  });
  const { enqueueSnackbar } = useSnackbar();

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

  const handleSubmit = useCallback(async () => {
    setConfirmModal(false);
    if (isStarted && !isSubmitted) {
      socket.emit("sort-submit", {
        content: JSON.stringify(codeBlocks),
      });
    }
  }, [codeBlocks, isStarted, isSubmitted]);

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

  const initialCodeBlocks = useMemo(
    () =>
      (isSubmitted && JSON.parse(answer.content)) ||
      (isStarted && JSON.parse(question.image)),
    [answer.content, isStarted, isSubmitted, question.image],
  );


  useEffect(() => {
    if (initialCodeBlocks) setCodeBlocks(initialCodeBlocks);
  }, [initialCodeBlocks]);

  React.useEffect(() => {
    if (isStarted) {
      enqueueSnackbar("Vòng chơi đang diễn ra!", { variant: "info" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStarted]);

  React.useEffect(() => {
    socket.emit("get-sort-game");
  }, []);

  React.useEffect(() => {
    socket.on("sort-game", payload => {
      console.log(">> sort-game");
      setConfirmModal(false);
      setNotificationModal({ ...notificationModal, show: false });
      const { timeOut, timePeriod, question } = payload;
      setIsStarted(payload.isStarted === 1 ? true : false);

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

    socket.on("sort-received", payload => {
      const { status, answer } = payload;
      if (status) {
        setNotificationModal({
          show: true,
          title: "ĐÃ NỘP THÀNH CÔNG",
          description:
            "Đáp án của bạn đang được giám khảo chấm điểm!",
          disable: false,
        });
        setIsSubmitted(true);
        setAnswer(answer);
      } else {
      }
    });

    socket.on("sort-result", ({ answer }) => {
      if (answer.point !== null) {
        setNotificationModal({
          show: true,
          title: "BẠN NHẬN THÊM " + answer.point + " ĐIỂM",
          description:
            "Chúc mừng, bài thi của bạn đã được chấm thành công!",
          disable: false,
        });
        setAnswer(answer);
      }
    });

    socket.on("sort-timeOut", () => {
      enqueueSnackbar("Vòng chơi kết thúc!", { variant: "error" });
      setIsStarted(false);
      _countdownRef.current.stop();
      handleSubmit();
    });

    return () => {
      socket.off("sort-received");
      socket.off("sort-game");
      socket.off("sort-result");
      socket.off("sort-timeOut");
    };
  }, [
    answer,
    enqueueSnackbar,
    handleSubmit,
    isStarted,
    notificationModal,
  ]);

  const handleReset = useCallback(async () => {
    setConfirmResetModal(false);
    setCodeBlocks(initialCodeBlocks);
  }, [initialCodeBlocks]);

  return (
    <div className="arrange-round">
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
              <DragDropCode
                disabled={!isStarted || isSubmitted}
                codeBlocks={codeBlocks}
                onChange={setCodeBlocks}
                result={answer?.result}
              />
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
              onClick={() => setConfirmResetModal(true)}
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
          <ConfirmPopup
            show={confirmResetModal}
            hideModal={() => setConfirmResetModal(false)}
            confirm={handleReset}
            title={`XÁC NHẬN KHÔI PHỤC`}
            description={`Bạn chắc chắn muốn khôi phục lại vị trí ban đầu chứ?`}
          />
        </div>
      </div>
    </div>
  );
}

export default ArrangeRound;
