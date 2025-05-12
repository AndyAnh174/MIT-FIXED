import AnswerService from "../services/answer.service";
import PlayerService from "../services/player.service";
import QuestionService from "../services/question.service";
import QuestionBackupService from "../services/questionBackup.service";
import SessionService from "../services/session.service";
import UserService from "../services/user.service";
import WarmUpService from "../services/warmup.service";

module.exports = (io, socket) => {
  const getWarmUpGame = async () => {
    const user = socket.request.user;

    const warmUpGame = await WarmUpService.getWarmUpGame(user);

    if (warmUpGame) {
      console.log(user.role, user.username, "getWarmUpGame");

      if (user.role === "admin") {
        io.to("admin").emit("warm-up-game", warmUpGame);
      } else if (user.role === "player") {
        io.to(socket.id).emit("warm-up-game", warmUpGame);
      }
    }
  };

  const warmUpStart = async () => {
    console.log(">> Warm Up Started");
    const user = socket.request.user;
    if (user.role != "admin") return;

    const sessionOld = await SessionService.getSession();

    await SessionService.updateSession({
      isStarted: 1,
      timeOut: Date.now() + sessionOld.timePeriod * 1000,
    });

    let session = await WarmUpService.getWarmUpGame(user);

    io.to("admin").emit("warm-up-start", {
      timeOut: session.timeOut,
      timePeriod: session.timePeriod,
      question: session.question,
    });
    console.log({ question: session.question });

    const players = await UserService.getPlayers();
    players.forEach(async player => {
      session = await WarmUpService.getWarmUpGame({
        role: "player",
        userId: player._id,
      });

      io.to(player._id.toString()).emit("warm-up-start", session);
    });
  };

  const warmUpTimeOut = async data => {
    console.log(">> Warm up timeOut");
    const user = socket.request.user;
    if (user.role != "admin") return;

    await SessionService.updateSession({
      isStarted: 2,
      timeOut: Date.now(),
    });
    io.to("player").emit("warm-up-timeOut", {
      message: "Time out",
    });
    io.emit("warm-up-timeOut", {
      message: "Time out",
    });
  };

  const warmUpSubmit = async content => {
    const user = socket.request.user;
    const { userId, username } = user;

    console.log("user", username, "warmUpSubmit");

    const answer = await WarmUpService.createSubmit(userId, content);

    if (answer) {
      io.to(socket.id).emit("warm-up-submitted", {
        status: true,
        answer,
      });

      io.to("admin").emit("warm-up-team-update", answer);

      PlayerService.updateLeaderBoard(io);
    } else {
      io.to(socket.id).emit("warm-up-submitted", {
        status: false,
      });
    }
  };

  const warmUpChangeQuestion = async order => {
    console.log(">> Warm up change question");
    const user = socket.request.user;
    if (user.role != "admin") return;

    const question = await WarmUpService.getQuestion(order);
    if (question) {
      let session = await SessionService.updateSession({
        questionId: question._id,
        isStarted: 0,
        timeOut: Date.now() + question.timePeriod * 1000,
        timePeriod: question.timePeriod,
      });
      const warmUpGame = await WarmUpService.getWarmUpGame(user);

      if (warmUpGame) {
        io.to("admin").emit("warm-up-game", warmUpGame);
      }
      const players = await UserService.getPlayers();
      players.forEach(async player => {
        session = await WarmUpService.getWarmUpGame({
          role: "player",
          userId: player._id,
        });

        io.to(player._id.toString()).emit("warm-up-game", session);
      });
    } else {
      io.to("admin").emit("warm-up-change-question-fail", {
        message: `order ${order} can't be found!`,
      });
    }
  };

  const warmUpSwapQuestion = async () => {
    console.log(">> Swap warm up question");
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

      const warmUpGameForAdmin = await WarmUpService.getWarmUpGame(
        admin,
      );
      io.to("admin").emit("warm-up-game", warmUpGameForAdmin);
      const players = await UserService.getPlayers();

      if (players) {
        for (let index = 0; index < players.length; index++) {
          const player = players[index];
          const warmUpGameForPlayer =
            await WarmUpService.getWarmUpGame(player);
          io.to(player._id.toString()).emit(
            "warm-up-game",
            warmUpGameForPlayer,
          );
        }
      }
      PlayerService.updateLeaderBoard(io);
      io.to("admin").emit("warm-up-swap-question-success", {});
    } else {
      io.to("admin").emit("warm-up-swap-question-fail", {});
    }
  };

  socket.on("get-warm-up-game", getWarmUpGame);
  socket.on("warm-up-start", warmUpStart);
  socket.on("warm-up-timeOut", warmUpTimeOut);
  socket.on("warm-up-submit", warmUpSubmit);
  socket.on("warm-up-change-question", warmUpChangeQuestion);
  socket.on("warm-up-swap-question", warmUpSwapQuestion);
};
