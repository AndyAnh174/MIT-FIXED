import SpeedUpService from "../services/speedup.service";
import AnswerService from "../services/answer.service";
import PlayerService from "../services/player.service";
import QuestionService from "../services/question.service";
import QuestionBackupService from "../services/questionBackup.service";
import SessionService from "../services/session.service";
import UserService from "../services/user.service";

module.exports = (io, socket) => {
  const getSpeedUpGame = async () => {
    const user = socket.request.user;

    const SpeedUpGame = await SpeedUpService.getSpeedUpGame(user);

    if (SpeedUpGame) {
      console.log(user.role, user.username, "getSpeedUpGame");

      if (user.role === "admin") {
        io.to("admin").emit("speed-up-game", SpeedUpGame);
      } else if (user.role === "player") {
        io.to(socket.id).emit("speed-up-game", SpeedUpGame);
      }
    }
  };

  const speedUpStart = async () => {
    console.log(">> Speed Up Started");
    const user = socket.request.user;
    if (user.role != "admin") return;

    const sessionOld = await SessionService.getSession();

    await SessionService.updateSession({
      isStarted: 1,
      timeOut: Date.now() + sessionOld.timePeriod * 1000,
    });

    let session = await SpeedUpService.getSpeedUpGame(user);

    io.to("admin").emit("speed-up-start", {
      timeOut: session.timeOut,
      timePeriod: session.timePeriod,
      question: session.question,
    });

    const players = await UserService.getPlayers();
    players.forEach(async player => {
      session = await SpeedUpService.getSpeedUpGame({
        role: "player",
        userId: player._id,
      });

      io.to(player._id.toString()).emit("speed-up-start", session);
    });
  };

  const speedUpTimeOut = async data => {
    console.log(">> Speed Up timeOut");
    const user = socket.request.user;
    if (user.role != "admin") return;

    await SessionService.updateSession({
      isStarted: 0,
    });

    io.to("player").emit("speed-up-timeOut", {
      message: "Time out",
    });
    io.emit("speed-up-timeOut", {
      message: "Time out",
    });
  };

  const speedUpSubmit = async content => {
    const user = socket.request.user;
    const { userId, username } = user;

    console.log("user", username, "speedUpSubmit");

    const result = await SpeedUpService.createSubmit(userId, content);

    if (result) {
      io.to(socket.id).emit("speed-up-submitted", {
        status: true,
        content,
      });
      io.to("admin").emit("speed-up-team-update", result);
    } else {
      io.to(socket.id).emit("speed-up-submitted", {
        status: false,
      });
    }
  };

  const speedUpCalcPoint = async () => {
    const question = await SpeedUpService.getQuestion();
    var answers = await AnswerService.getAnswersByQuestionId(
      question._id,
    );
    const solution = question.solution.split("");
    const bonusPoint = [20, 15, 10, 5, 0];
    for (let ia = 0; ia < answers.length; ia++) {
      let answer = answers[ia];
      const content = answer.content.split("");
      console.log({ content });
      io.to("admin").emit(
        "speed-up-calculating-point",
        answer.userId,
      );
      answer.point = 0;
      answer.result = "";
      let negativePoint = 0;
      for (let is = 0; is < solution.length; is++) {
        let s = solution[is];
        let c = "";
        if (is < content.length) c = content[is];
        answer.result += s === c ? "1" : "0";
        negativePoint += s === c ? 0 : 1;
      }
      console.log({ negativePoint });
      if (solution.length < content.length) {
        negativePoint += content.length - solution.length;
      }

      if (negativePoint === 0) {
        answer.point = question.point;
        if (ia < bonusPoint.length) {
          answer.point += bonusPoint[ia];
        }
      } else {
        if (negativePoint === 1) {
          answer.point = question.point - 20;
        } else {
          answer.point =
            question.point - 20 - (negativePoint - 1) * 5;
        }
      }

      if (answer.point < 0) answer.point = 0;
      if (answer.result.split("1").length == 0) answer.point = 0;

      answer.status = 1;
      await answer.save();
      io.to("admin").emit("speed-up-team-update", { answer: answer });
      io.to(answer.userId._id.toString()).emit("speed-up-result", {
        answer: { ...answer._doc, solution: question.solution },
      });
    }
    io.to("admin").emit("speed-up-calc-point-complete");

    PlayerService.updateLeaderBoard(io);
  };

  const speedupSwapQuestion = async () => {
    console.log(">> Swap speed up question");
    const admin = socket.request.user;
    if (admin.role != "admin") return;
    let session = await SessionService.getSession();
    // get
    let questionBackup =
      await QuestionBackupService.getFirstQuestionActive(
        session.roundId,
      );

    if (questionBackup) {
      await QuestionService.swapQuestion(
        session.questionId,
        questionBackup._id,
      );
      await AnswerService.removeByQuestionId(session.questionId);
      await SessionService.updateSession({
        isStarted: 0,
        timeOut: Date.now() + questionBackup.timePeriod * 1000,
        timePeriod: questionBackup.timePeriod,
      });

      const speedupGameForAdmin = await SpeedUpService.getSpeedUpGame(
        admin,
      );
      io.to("admin").emit("speed-up-game", speedupGameForAdmin);
      const players = await UserService.getPlayers();

      if (players) {
        for (let index = 0; index < players.length; index++) {
          const player = players[index];
          const speedupGameForPlayer =
            await SpeedUpService.getSpeedUpGame(player);
          io.to(player._id.toString()).emit(
            "speed-up-game",
            speedupGameForPlayer,
          );
        }
      }
      PlayerService.updateLeaderBoard(io);
      io.to("admin").emit("speed-up-swap-question-success", {});
    } else {
      io.to("admin").emit("speed-up-swap-question-fail", {});
    }
  };

  socket.on("get-speed-up-game", getSpeedUpGame);
  socket.on("speed-up-start", speedUpStart);
  socket.on("speed-up-timeOut", speedUpTimeOut);
  socket.on("speed-up-submit", speedUpSubmit);
  socket.on("speed-up-calc-point", speedUpCalcPoint);
  socket.on("speed-up-swap-question", speedupSwapQuestion);
};
