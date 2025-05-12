import AnswerService from "../services/answer.service";
import CompilerService from "../services/compiler.service";
import PlayerService from "../services/player.service";
import ProgrammingService from "../services/programming.service";
import QuestionService from "../services/question.service";
import QuestionBackupService from "../services/questionBackup.service";
import SessionService from "../services/session.service";
import TestCaseService from "../services/testcase.service";
import UserService from "../services/user.service";

function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function stringRepeat(str, length) {
  let result = "";
  for (let index = 0; index < length; index++) {
    result += str;
  }
  console.log({ length });
  return result;
}

module.exports = (io, socket) => {
  const getProgrammingGame = async () => {
    const user = socket.request.user;
    console.log("user", user.username, "getProgrammingGame");

    const programmingGame =
      await ProgrammingService.getProgrammingGame(user);

    if (programmingGame) {
      if (user.role === "admin") {
        io.to("admin").emit("programming-game", programmingGame);
      } else if (user.role === "player") {
        io.to(socket.id).emit("programming-game", programmingGame);
      }
    }
  };

  const programmingStart = async () => {
    const user = socket.request.user;
    if (user.role != "admin") return;

    const question = await ProgrammingService.getQuestion();

    await SessionService.updateSession({
      questionId: question._id,
      roundId: question.roundId,
      timeOut: Date.now() + question.timePeriod * 1000,
      timePeriod: question.timePeriod,
      isStarted: 1,
    });

    let session = await ProgrammingService.getProgrammingGame(user);

    // io.to("admin").emit("programming-game", session);
    io.to("admin").emit("programming-start", {
      timeOut: session.timeOut,
      timePeriod: session.timePeriod,
    });

    const players = await UserService.getPlayers();
    players.forEach(async player => {
      session = await ProgrammingService.getProgrammingGame({
        role: "player",
        userId: player._id,
      });

      io.to(player._id.toString()).emit("programming-start", session);
    });
  };

  const programmingSubmit = async code => {
    const user = socket.request.user;
    const { userId, username } = user;

    console.log("user", username, "programmingSubmit");

    const result =
      await ProgrammingService.createNewProgrammingSubmit(
        userId,
        code,
      );

    if (result) {
      io.to(socket.id).emit("programming-submitted", {
        status: true,
        code,
      });
      io.to("admin").emit("programming-team-update", result);
    } else {
      io.to(socket.id).emit("programming-submitted", {
        status: false,
      });
    }
  };

  const programmingTimeOut = async data => {
    console.log(">> Programming-timeOut");
    const user = socket.request.user;
    if (user.role != "admin") return;

    await SessionService.updateSession({
      isStarted: 0,
    });
    io.to("player").emit("programming-timeOut", {
      message: "Time out",
    });
    io.emit("programming-timeOut", {
      message: "Time out",
    });
  };

  const programmingResult = async data => {
    const result =
      await ProgrammingService.createNewProgrammingResult(data);

    if (result) {
      io.to(result.userId.toString()).emit(
        "programming-result",
        result,
      );
      io.to("admin").emit("programming-result", {
        message: "Result received",
      });
    }
  };

  const programmingCalcPoint = async data => {
    const question = await ProgrammingService.getQuestion();
    var answers = await AnswerService.getAnswersByQuestionId(
      question._id,
    );
    const testCases = await TestCaseService.getTestCases(
      question.year,
    );

    for (let ia = 0; ia < answers.length; ia++) {
      let answer = answers[ia];
      answer.point = 0;
      answer.result = stringRepeat("-", testCases.length);
      io.to("admin").emit("programming-team-update", {
        answer,
      });
      await answer.save();
    }
    PlayerService.updateLeaderBoard(io);

    for (let it = 0; it < testCases.length; it++) {
      const testCase = testCases[it];
      const input = testCase.input;
      const output = testCase.output;
      io.to("admin").emit("programming-calculating-point", it);
      for (let ia = 0; ia < answers.length; ia++) {
        let answer = answers[ia];
        const result = await CompilerService.compile(
          answer.content,
          answer.userId._id,
          input,
        );
        const flag = result.output.toString() == output;
        answer.result = setCharAt(
          answer.result,
          it,
          flag ? "1" : "0",
        );
        answer.point = answer.point + (flag ? testCase.point : 0);
        if (it === testCases.length - 1) {
          if (
            (answer.result.match(/1/g) || []).length ==
            testCases.length
          ) {
            answer.point = question.point;
          }
          io.to(answer.userId._id.toString()).emit(
            "programming-result",
            {
              answer,
            },
          );
        }
        answer.status = 1;
        await answer.save();
        await delay(2000);
        io.to("admin").emit("programming-team-update", {
          answer,
        });
        PlayerService.updateLeaderBoard(io);
      }
    }
    io.to("admin").emit("programming-calc-point-complete");
    PlayerService.updateLeaderBoard(io);

    // for (let ia = 0; ia < answers.length; ia++) {
    //   let answer = answers[ia];
    //   io.to("admin").emit(
    //     "programming-calculating-point",
    //     answer.userId,
    //   );
    //   answer.point = 0;
    //   answer.result = "--------";
    //   io.to("admin").emit("programming-team-update", {
    //     answer,
    //   });
    //   for (let it = 0; it < testCases.length; it++) {
    //     const testCase = testCases[it];
    //     const input = testCase.input;
    //     const output = testCase.output;
    //     const result = await CompilerService.compile(
    //       answer.content,
    //       answer.userId._id,
    //       input,
    //     );
    //     const flag = result.output.toString() == output;
    //     answer.result = setCharAt(
    //       answer.result,
    //       testCase.order - 1,
    //       flag ? "1" : "0",
    //     );
    //     answer.point = answer.point + (flag ? 20 : 0);

    //     console.log({ point: answer.point });
    //     io.to("admin").emit("programming-team-update", {
    //       answer,
    //     });
    //   }
    //   if (answer.result == "11111111") {
    //     answer.point = question.point;
    //   }
    //   answer.status = 1;
    //   await answer.save();
    //   io.to("admin").emit("programming-team-update", {
    //     answer,
    //   });
    //   io.to(answer.userId._id.toString()).emit("programming-result", {
    //     answer,
    //   });
    // }
    // io.to("admin").emit("programming-calc-point-complete");

    // PlayerService.updateLeaderBoard(io);
  };

  const programmingTeamUpdate = async data => {};

  const timeSync = async data => {
    io.to("player").emit("timeSync", data);
  };

  const programmingSwapQuestion = async () => {
    console.log(">> Swap programming question");
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

      const programmingGameForAdmin =
        await ProgrammingService.getProgrammingGame(admin);
      io.to("admin").emit(
        "programming-game",
        programmingGameForAdmin,
      );
      const players = await UserService.getPlayers();

      if (players) {
        for (let index = 0; index < players.length; index++) {
          const player = players[index];
          const programmingGameForPlayer =
            await ProgrammingService.getProgrammingGame(player);
          console.log({ programmingGameForPlayer });
          io.to(player._id.toString()).emit(
            "programming-game",
            programmingGameForPlayer,
          );
        }
      }
      PlayerService.updateLeaderBoard(io);
      io.to("admin").emit("programming-swap-question-success", {});
    } else {
      io.to("admin").emit("programming-swap-question-fail", {});
    }
  };

  socket.on("get-programming-game", getProgrammingGame);
  socket.on("programming-submit", programmingSubmit);
  socket.on("programming-start", programmingStart);
  socket.on("programming-timeOut", programmingTimeOut);
  socket.on("programming-result", programmingResult);
  socket.on("programming-team-update", programmingTeamUpdate);
  socket.on("programming-calc-point", programmingCalcPoint);
  socket.on("programming-swap-question", programmingSwapQuestion);
  socket.on("timeSync", timeSync);
};
