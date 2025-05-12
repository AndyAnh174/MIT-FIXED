import AnswerService from "../services/answer.service";
import ConnectionService from "../services/connection.service";
import PlayerService from "../services/player.service";
import QuestionService from "../services/question.service";
import QuestionBackupService from "../services/questionBackup.service";
import SessionService from "../services/session.service";
import UserService from "../services/user.service";

module.exports = (io, socket) => {
  const getConnectionGame = async () => {
    const user = socket.request.user;

    const connectionGame = await ConnectionService.getConnectionGame(
      user,
    );

    if (connectionGame) {
      console.log(user.role, user.username, "getConnectionGame");

      if (user.role === "admin") {
        io.to("admin").emit("connection-game", connectionGame);
      } else if (user.role === "player") {
        io.to(socket.id).emit("connection-game", connectionGame);
      }
    }
  };

  const connectionStart = async () => {
    const user = socket.request.user;
    if (user.role != "admin") return;

    const question = await ConnectionService.getQuestion();

    await SessionService.updateSession({
      questionId: question._id,
      roundId: question.roundId,
      timeOut: Date.now() + question.timePeriod * 1000,
      timePeriod: question.timePeriod,
      isStarted: 1,
    });

    let session = await ConnectionService.getConnectionGame(user);

    io.to("admin").emit("connection-game", session);
    io.to("admin").emit("connection-start");

    const players = await UserService.getPlayers();
    players.forEach(async player => {
      session = await ConnectionService.getConnectionGame({
        role: "player",
        userId: player._id,
      });

      io.to(player._id.toString()).emit("connection-game", session);
    });
  };

  const connectionSubmit = async payload => {
    const user = socket.request.user;
    const { content } = payload;
    const { userId, username } = user;

    const result = await ConnectionService.createNewConnectionSubmit(
      userId,
      content,
    );

    if (result) {
      console.log("player", username, "connectionSubmit");

      io.to(socket.id).emit("connection-received", {
        status: true,
        answer: result.answer,
      });
      io.to("admin").emit("connection-received", result.answers);
    } else {
      io.to(socket.id).emit("connection-received", { status: false });
    }
  };

  const connectionTimeOut = async data => {
    const user = socket.request.user;
    if (user.role != "admin") return;

    console.log(">> Connection-timeOut");

    await SessionService.updateSession({
      isStarted: 0,
    });
    io.to("player").emit("connection-timeOut", {
      message: "Time out",
    });
    io.emit("connection-timeOut", {
      message: "Time out",
    });
  };

  const connectionResult = async payload => {
    const { userId, point } = payload;

    const result = await ConnectionService.createNewConnectionResult(
      userId,
      point,
    );

    if (result) {
      io.to(result.userId.toString()).emit(
        "connection-result",
        result,
      );

      const players = await UserService.getPlayersInfo(userId);
      players.forEach(player => {
        io.to(player._id.toString()).emit("player-info", {
          _id: player._id,
          displayName: player.displayName,
          point: player.point,
          rank: player.rank,
        });
      });

      const top5 = players.slice(0, 5);
      io.to("admin").emit("leader-board", top5);

      io.to("admin").emit("connection-result", {
        message: "Result received",
      });
      3;
    }
  };

  const connectionSwapQuestion = async () => {
    console.log(">> Swap connection question");
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

      const connectionGameForAdmin =
        await ConnectionService.getConnectionGame(admin);
      io.to("admin").emit("connection-game", connectionGameForAdmin);
      const players = await UserService.getPlayers();

      if (players) {
        for (let index = 0; index < players.length; index++) {
          const player = players[index];
          const connectionGameForPlayer =
            await ConnectionService.getConnectionGame(player);
          io.to(player._id.toString()).emit(
            "connection-game",
            connectionGameForPlayer,
          );
        }
      }
      PlayerService.updateLeaderBoard(io);
      io.to("admin").emit("connection-swap-question-success", {});
    } else {
      io.to("admin").emit("connection-swap-question-fail", {});
    }
  };

  socket.on("get-connection-game", getConnectionGame);
  socket.on("connection-submit", connectionSubmit);
  socket.on("connection-start", connectionStart);
  socket.on("connection-timeOut", connectionTimeOut);
  socket.on("connection-result", connectionResult);
  socket.on("connection-swap-question", connectionSwapQuestion);
};
