import PlayerHeader from "components/player-header";
import React, { useState } from "react";
import "./style.scss";
import Countdown from "react-countdown";
import Editor, { loader } from "@monaco-editor/react";
import { code } from "./defaultCode";
import codeApi from "apis/codeApi";
import MyModal from "components/modal";
import socket from "services/socket";
import { useSnackbar } from "notistack";
import NotificationPopup from "components/notification-popup";


loader.config({
  paths: {
    vs: '/monaco-editor/min/vs'
  }
});

function Programming(props) {
  const _programmingRef = React.useRef();
  const _countdownRef = React.useRef();
  const _turnCountDownRef = React.useRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [turn, setTurn] = React.useState({
    initial: Date.now() + 1.5 * 60 * 1000,
    current: 0,
    isStart: false,
  });

  const [btnState, setBtnState] = React.useState(true);
  const [confirmModal, setConfirmModal] = React.useState({
    show: false,
    handleHideModal: () => {
      setConfirmModal({ ...confirmModal, show: false });
    },
    handleConfirm: () => { },
  });
  const [modalSubject, setModalSubject] = React.useState({
    show: false,
    handleHideModal: () => {
      setModalSubject({ ...modalSubject, show: false });
    },
  });
  const handleEndTurn = () => {
    const nextTurn = turn.current + 1;
    console.log({ nextTurn });
    setModalSubject({ ...modalSubject, show: false });
    if (nextTurn < 7) {
      setTurn({
        ...turn,
        current: nextTurn,
        isStart: false,
      });
    }
  };
  const handleStartNewTurn = () => {
    setTurn({
      ...turn,
      initial: Date.now() + 1.5 * 60 * 1000,
      isStart: true,
    });
  };
  const [modalNotification, setModalNotification] = React.useState({
    show: false,
    title: "VÒNG CHƠI BẮT ĐẦU",
    description: "Hãy bắt đầu lượt đầu tiên ngay bây giờ!",
    buttonText: "BẮT ĐẦU",
    buttonColor: "#0C9B75",
    disable: false,
    handleButtonClick: handleStartNewTurn,
  });
  const [isStart, setIsStart] = useState(false);
  const [timer, setTimer] = useState({
    timeOut: Date.now() + 300 * 1000,
    timePeriod: 300 * 1000,
  });
  const [state, setState] = React.useState({
    input: "",
    code: code.cpp,
    result: "Enter Input and Run Code to See Result",
    lang: "cpp",
  });
  const [question, setQuestion] = React.useState({
    _id: "",
    content: "",
    point: 100,
  });
  const [answer, setAnswer] = React.useState({
    _id: "",
    content: "----",
    point: "-",
    status: 0,
    result: "--------",
  });
  const [isSubmit, setIsSubmit] = React.useState(false);
  const _editorRef = React.useRef(null);
  function handleEditorDidMount(editor, monaco) {
    _editorRef.current = editor;
    const codeRecover = localStorage.getItem("code-data");
    if (codeRecover !== null) {
      _editorRef.current.setValue(codeRecover);
      setState({ ...state, code: codeRecover });
    } else {
      _editorRef.current.setValue(code.cpp);
      setState({ ...state, code: code.cpp });
    }
    socket.emit("get-programming-game");
  }
  function handleEditorOnChange(value, event) {
    localStorage.setItem("code-data", value);
    setState({ ...state, code: value });
  }
  function handleInputOnChange(event) {
    localStorage.setItem("code-input", event.target.value);
    setState({ ...state, input: event.target.value });
  }
  function handleHideModalNotification() {
    setModalNotification({ ...modalNotification, show: false });
  }
  async function handleDebugClick() {
    setState({ ...state, result: "Debug..." });
    codeApi
      .debug(state.code)
      .then(res => {
        const { err, error, output } = res.data;
        setState({ ...state, result: output });
      })
      .catch(err => {
        console.log({ err });
      });
  }

  async function handleRunClick() {
    setState({ ...state, result: "Run..." });
    codeApi
      .compile(state.code, state.input)
      .then(res => {
        console.log({ res });
        const { err, error, output } = res.data;
        setState({ ...state, result: output });
      })
      .catch(err => {
        console.log({ err });
      });
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

  const handleTimeOut = () => {
    if (!isSubmit) {
      handleSubmit();
      if (turn.isStart) {
        setTurn({ ...turn, isStart: false });
        _turnCountDownRef.current.pause();
      }
    }
  };

  const handleSubmit = () => {
    if (state.code !== null) {
      if (!isSubmit) {
        socket.emit("programming-submit", state.code);
      }
    } else {
      socket.emit("programming-submit", "");
    }
  };

  const handleRecover = () => {
    const turnRecover = JSON.parse(localStorage.getItem("turn"));
    if (turnRecover) {
      setTurn({
        ...turn,
        ...turnRecover,
      });
    } else {
      setTurn({
        initial: Date.now() + 1.5 * 60 * 1000,
        current: 1,
        isStart: false,
      });
    }
  };

  React.useEffect(() => {
    // socket.emit("get-programming-game");
    socket.on("programming-game", payload => {
      setModalNotification({ ...modalNotification, show: false });
      setModalSubject({ ...modalSubject, show: false });
      setConfirmModal({ ...confirmModal, show: false });
      const { isStarted, timeOut, timePeriod, question } = payload;
      setQuestion(question);

      if (isStarted === 1) {
        setTimer({
          ...timer,
          timeOut: timeOut,
          timePeriod: timePeriod * 1000,
        });
        setIsStart(true);
        _countdownRef.current.start();
        enqueueSnackbar("Vòng chơi bắt đầu!", { variant: "info" });
        handleRecover();
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
        setIsSubmit(true);
        setState({ ...state, code: payload.answer.content });
        _editorRef.current.setValue(payload.answer.content);
      } else {
        setIsSubmit(false);
      }
    });

    socket.on("programming-start", payload => {
      const { timeOut, timePeriod, question } = payload;
      _turnCountDownRef.current.pause();
      setTurn({
        initial: Date.now() + 1.5 * 60 * 1000,
        current: 1,
        isStart: false,
      });
      setTimer({
        ...timer,
        timeOut: timeOut,
        timePeriod: timePeriod * 1000,
      });
      setQuestion(question);
      setIsStart(true);
      _countdownRef.current.start();
    });

    socket.on("programming-timeOut", payload => {
      setModalNotification({ ...modalNotification, show: false });
      setModalSubject({ ...modalSubject, show: false });
      setConfirmModal({ ...confirmModal, show: false });
      setIsStart(false);
      setTimer({
        ...timer,
        timeOut: Date.now(),
      });
      enqueueSnackbar("Đã hết thời gian làm bài!", {
        variant: "warning",
      });
    });

    socket.on("programming-submitted", payload => {
      const { status } = payload;
      if (status) {
        setIsSubmit(true);
        enqueueSnackbar("Đã nộp bài thành công!", {
          variant: "success",
        });
      }
      //handle notice
    });

    socket.on("programming-result", payload => {
      const { answer } = payload;
      setAnswer(answer);
    });

    return () => {
      socket.off("programming-game");
      socket.off("programming-start");
      socket.off("programming-submitted");
      socket.off("programming-result");
      socket.off("programming-timeOut");
    };
  }, [
    confirmModal,
    enqueueSnackbar,
    isStart,
    isSubmit,
    modalNotification,
    modalSubject,
    state,
    timer,
    turn,
  ]);

  React.useEffect(() => {
    if (turn.current !== 0) {
      localStorage.setItem("turn", JSON.stringify(turn));
      if (isStart && !isSubmit) {
        if (turn.isStart) {
          _turnCountDownRef.current.start();
          setModalNotification({
            ...modalNotification,
            show: false,
          });
        } else {
          _turnCountDownRef.current.pause();
          if (turn.current === 1) {
            setModalNotification({
              ...modalNotification,
              show: true,
              title: "VÒNG CHƠI BẮT ĐẦU",
              description: "Hãy bắt đầu lượt đầu tiên ngay bây giờ!",
              buttonText: "BẮT ĐẦU",
              buttonColor: "#0C9B75",
              disabled: false,
              handleButtonClick: handleStartNewTurn,
            });
          } else {
            if (turn.current < 6) {
              setModalNotification({
                ...modalNotification,
                show: true,
                title: "LƯỢT HIỆN TẠI ĐÃ KẾT THÚC",
                description: `Xin mời lượt tiếp theo: Thành viên thứ #${turn.current}`,
                buttonText: "LƯỢT MỚI",
                buttonColor: "#0C9B75",
                disable: false,
                handleButtonClick: handleStartNewTurn,
              });
            } else {
              setModalNotification({
                ...modalNotification,
                show: true,
                title: "ĐỘI CHƠI CỦA BẠN ĐÃ HẾT LƯỢT",
                description: `Bài thi đang được gửi đi`,
                buttonText: "ĐANG GỬI",
                buttonColor: "#0C9B75",
                disable: true,
                handleButtonClick: () => { },
              });
              if (!isSubmit) {
                handleSubmit();
              }
            }
          }
        }
      }
    }
  }, [turn, isStart, isSubmit]);

  React.useEffect(() => {
    if (isStart) {
      // setTurn({
      //   initial: Date.now() + 1.5 * 60 * 1000,
      //   current: 1,
      //   isStart: false,
      // });
      setModalSubject({ ...modalSubject, show: true });
    } else {
      setModalSubject({ ...modalSubject, show: false });
    }
  }, [isStart]);

  React.useEffect(() => {
    if (isSubmit) {
      if (answer?.status === 1) {
        //something
      } else {
        setModalNotification({
          ...modalNotification,
          show: true,
          title: "ĐÃ NỘP BÀI THÀNH CÔNG",
          description: `Bài thi đã được lưu lại và đang trong giai đoạn tính điểm!`,
          buttonText: "ĐÃ GỬI",
          buttonColor: "#0C9B75",
          disable: true,
          handleButtonClick: () => { },
        });
      }
    }
  }, [answer?.status, isSubmit]);

  React.useEffect(() => {
    if (answer?.status == 1) {
      setModalNotification({
        ...modalNotification,
        show: true,
        title: "ĐÃ HOÀN THÀNH CHẤM ĐIỂM",
        description:
          "Xin chúc mừng! Bài thi của bạn đạt " +
          answer.point +
          " Điểm!",
        disable: false,
        buttonText: "ẨN THÔNG BÁO",
        buttonColor: "#F98823",
        handleButtonClick: handleHideModalNotification,
      });
    }
  }, [answer]);

  React.useEffect(() => {
    setBtnState(modalNotification.show || isSubmit || !isStart);
  }, [modalNotification, isSubmit, isStart]);
  return (
    <div className="programming-round" ref={_programmingRef}>
      <Countdown
        date={timer.timeOut}
        // intervalDelay={0}
        precision={2}
        autoStart={false}
        renderer={renderTimer}
        onComplete={handleTimeOut}
        ref={_countdownRef}
      />
      <div id="content" className="content">
        <div className="game-space">
          <p className="point">
            {answer.point}/{question.point}
          </p>
          <div className="title">VÒNG THI TIẾP SỨC</div>
          <div className="compiler-space">
            <div className="left">
              <div className="code">
                <Editor
                  height="100%"
                  width="100%"
                  defaultLanguage="cpp"
                  onChange={handleEditorOnChange}
                  onMount={handleEditorDidMount}
                  loading={<p>loading</p>}
                  className="editor"
                  options={{
                    fontSize: "18px",
                    readOnly: isSubmit || !isStart || !turn.isStart,
                  }}
                />
              </div>
            </div>
            <div className="right">
              <div className="card input-card">
                <div className="title">Input</div>
                <div className="text-space">
                  <textarea
                    className="input"
                    value={state.input}
                    onChange={handleInputOnChange}
                  />
                </div>
              </div>
              <div className="controllers">
                <button className="btn-clear btn-3D">CLEAR</button>
                <button
                  className="btn-debug btn-3D"
                  onClick={handleDebugClick}
                >
                  DEBUG
                </button>
                <button
                  className="btn-run btn-3D"
                  onClick={handleRunClick}
                >
                  RUN
                </button>
              </div>
              <div className="card output-card">
                <div className="title">Output</div>
                <div className="text-space">
                  <textarea
                    className="input"
                    disabled={true}
                    value={state.result}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="footer">
            <button
              className="btn-view-subject btn-3D"
              onClick={() => {
                setModalSubject({ ...modalSubject, show: true });
              }}
              disabled={!isStart}
            >
              Xem đề
            </button>
            <Countdown
              date={turn.initial}
              // intervalDelay={0}
              precision={2}
              autoStart={false}
              renderer={({ minutes, seconds }) => {
                return (
                  <div className="time-out">
                    LƯỢT CỦA BẠN: {minutes}:{seconds}
                  </div>
                );
              }}
              onComplete={handleEndTurn}
              ref={_turnCountDownRef}
            />
            <button
              className="btn-stop-turn btn-3D"
              onClick={handleEndTurn}
              disabled={btnState}
            >
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.7227 10.2211C11.43 10.5142 11.4303 10.9891 11.7234 11.2818C12.0165 11.5745 12.4914 11.5742 12.7841 11.2811L17.7807 6.2776C18.0732 5.9847 18.0731 5.5101 17.7804 5.2174L12.7838 0.219721C12.4909 -0.0731989 12.016 -0.0732486 11.7231 0.219621C11.4302 0.512481 11.4301 0.987351 11.723 1.28028L15.443 5H7.6012C6.00642 5 4.79015 5.242 3.71218 5.7645L3.46576 5.89C2.35728 6.4829 1.48286 7.3573 0.89004 8.4658C0.28062 9.6053 0 10.8837 0 12.6012C0 13.0154 0.33579 13.3512 0.75 13.3512C1.16421 13.3512 1.5 13.0154 1.5 12.6012C1.5 11.1174 1.72765 10.0802 2.21276 9.1732C2.66578 8.3261 3.32609 7.6658 4.17316 7.2128C5.01046 6.765 5.95858 6.5365 7.2666 6.5041L7.6012 6.5H15.438L11.7227 10.2211Z"
                  fill="white"
                />
              </svg>
              {turn.current < 5 ? "Kết thúc lượt" : "Nộp bài"}
            </button>
          </div>
          <NotificationPopup
            show={modalNotification.show}
            title={modalNotification.title}
            description={modalNotification.description}
            disable={modalNotification.disable}
            buttonText={modalNotification.buttonText}
            buttonColor={modalNotification.buttonColor}
            hideModal={modalNotification.handleButtonClick}
          />
        </div>
      </div>
      {(isStart || isSubmit) && (
        <MyModal
          show={modalSubject.show}
          type="two"
          modalClass="subject-modal"
        >
          <div className="modal-background">
            <div className="modal">
              <div className="header">
                <p className="title">ĐỀ BÀI</p>
                <p
                  className="back"
                  onClick={modalSubject.handleHideModal}
                >
                  Trở về bài làm
                </p>
              </div>
              <div className="subject-container">
                <div
                  className="subject"
                  style={{
                    backgroundImage: `url("${question?.content}")`,
                  }}
                />
              </div>
            </div>
          </div>
        </MyModal>
      )}
    </div>
  );
}

export default Programming;
