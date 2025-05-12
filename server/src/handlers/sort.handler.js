import AnswerService from "../services/answer.service";
import SortService from "../services/sort.service";
import PlayerService from "../services/player.service";
import QuestionService from "../services/question.service";
import QuestionBackupService from "../services/questionBackup.service";
import SessionService from "../services/session.service";
import UserService from "../services/user.service";

module.exports = (io, socket) => {
  const getSortGame = async () => {
    const user = socket.request.user;

    const sortGame = await SortService.getSortGame(user);

    if (sortGame) {
      console.log(user.role, user.username, "getSortGame");

      if (user.role === "admin") {
        io.to("admin").emit("sort-game", sortGame);
      } else if (user.role === "player") {
        io.to(socket.id).emit("sort-game", sortGame);
      }
    }
  };

  const sortStart = async () => {
    const user = socket.request.user;
    if (user.role != "admin") return;

    const question = await SortService.getQuestion();

    await SessionService.updateSession({
      questionId: question._id,
      roundId: question.roundId,
      timeOut: Date.now() + question.timePeriod * 1000,
      timePeriod: question.timePeriod,
      isStarted: 1,
    });

    let session = await SortService.getSortGame(user);

    io.to("admin").emit("sort-game", session);
    io.to("admin").emit("sort-start");

    const players = await UserService.getPlayers();
    players.forEach(async player => {
      session = await SortService.getSortGame({
        role: "player",
        userId: player._id,
      });

      io.to(player._id.toString()).emit("sort-game", session);
    });
  };

  const sortSubmit = async payload => {
    const user = socket.request.user;
    const { content } = payload;
    const { userId, username } = user;

    const result = await SortService.createNewSortSubmit(
      userId,
      content,
    );

    if (result) {
      console.log("player", username, "sortSubmit");

      io.to(socket.id).emit("sort-received", {
        status: true,
        answer: result.answer,
      });
      io.to("admin").emit("sort-received", result.answers);
    } else {
      io.to(socket.id).emit("sort-received", { status: false });
    }
  };

  const sortTimeOut = async data => {
    const user = socket.request.user;
    if (user.role != "admin") return;

    console.log(">> Sort-timeOut");

    await SessionService.updateSession({
      isStarted: 0,
    });
    io.to("player").emit("sort-timeOut", {
      message: "Time out",
    });
    io.emit("sort-timeOut", {
      message: "Time out",
    });
  };

  const sortResult = async payload => {
    const { userId, point } = payload;

    const result = await SortService.createNewSortResult(
      userId,
      point,
    );

    if (result) {
      io.to(result.userId.toString()).emit("sort-result", result);

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

      io.to("admin").emit("sort-result", {
        message: "Result received",
      });
      3;
    }
  };

  const sortSwapQuestion = async () => {
    console.log(">> Swap sort question");
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

      const sortGameForAdmin = await SortService.getSortGame(admin);
      io.to("admin").emit("sort-game", sortGameForAdmin);
      const players = await UserService.getPlayers();

      if (players) {
        for (let index = 0; index < players.length; index++) {
          const player = players[index];
          const sortGameForPlayer = await SortService.getSortGame(
            player,
          );
          io.to(player._id.toString()).emit(
            "sort-game",
            sortGameForPlayer,
          );
        }
      }
      PlayerService.updateLeaderBoard(io);
      io.to("admin").emit("sort-swap-question-success", {});
    } else {
      io.to("admin").emit("sort-swap-question-fail", {});
    }
  };
  const sortCalcPoint = async () => {
    console.log("sortCalcPoint")
    let penalty = 20;
    const question = await SortService.getQuestion();

    let answers = await AnswerService.getAnswersByQuestionId(
      question._id,
    );
    const solution = question.solution.split(",");


    const pointForEachShape = question.point / solution.length;

    for (let ia = 0; ia < answers.length; ia++) {
      const answer = answers[ia];
      const content = JSON.parse(answer.content).map(v => v.id);
      io.to("admin").emit("sort-calculating-point", answer.userId);
      answer.point = 0;
      answer.result = "";
      let negativePoint = 0;
      let numberOfRightAnswer = 0;
      //let contentArrStr = content.join("-")


      // for (let is = 0; is < solution.length; is++) {
      //   if (Number(content[is]) === Number(solution[is])) {
      //     numberOfRightAnswer += 1;
      //     answer.result += "1";
      //     //negativePoint += pointForEachShape
      //   } else {
      //     answer.result += "0";
      //   }
      // }

      [answer.point, answer.result] = CheckAnswer(content.toString(), solution)

      console.log("ANSWER POINT", answer.point)
      if (numberOfRightAnswer === solution[0].length) {
        negativePoint = question[0].point;
      } else {
        if (numberOfRightAnswer >= solution[0].length / 2) {
          negativePoint =
            question.point -
            (solution.length - numberOfRightAnswer) * penalty;
        } else {
          negativePoint = 0;
        }
      }

      console.log({ negativePoint });
      answer.point = negativePoint;
      answer.status = 1;
      await answer.save();
      io.to("admin").emit("sort-team-update", { answer: answer });
      io.to(answer.userId._id.toString()).emit("sort-result", {
        answer: { ...answer._doc, solution: question.solution },
      });
    }
    io.to("admin").emit("sort-calc-point-complete");

    PlayerService.updateLeaderBoard(io);
  };
  const sortCalcPointOneTeam = async ({ userId }) => {
    console.log("sortCalcPointTeam")
    let penalty = 20;
    const question = await SortService.getQuestion();

    let answer = await AnswerService.getByUserId(
      userId,
      question._id,
    );

    const solution = question.solution.split(",");
    const pointForEachShape = question.point / solution.length;

    if (answer) {
      const content = JSON.parse(answer.content).map(v => v.id);
      console.log("CONTENT", content)
      answer.point = 0;
      answer.result = "";
      let negativePoint = 0;
      let numberOfRightAnswer = 0;
      //console.log("CONTENT", content)


      // for (let is = 0; is < solution.length; is++) {

      //   if (Number(content[is]) === Number(solution[is])) {
      //     numberOfRightAnswer += 1;
      //     answer.result += "1";
      //     //negativePoint += pointForEachShape
      //   } else {
      //     answer.result += "0";
      //   }
      // }
      [numberOfRightAnswer, answer.result] = CheckAnswer(content.toString(), solution)
      console.log("RAS", numberOfRightAnswer)
      //console.log(solution)
      let tempSolution = solution[0].split("-")
      console.log(tempSolution)
      console.log(question)
      if (numberOfRightAnswer === tempSolution.length) {
        negativePoint = question.point;
      } else {
        if (numberOfRightAnswer >= tempSolution.length / 2) {
          negativePoint =
            question.point -
            (tempSolution.length - numberOfRightAnswer) * penalty;
        } else {
          negativePoint = 0;
        }
      }
      console.log("ANSWER POINT", answer.point)
      answer.point = negativePoint;
      answer.status = 1;
      await answer.save();
      const answers = await AnswerService.getAnswersByQuestionId(
        question._id,
      );
      io.to("admin").emit("sort-team-update", answers);
      io.to(answer.userId._id.toString()).emit("sort-result", {
        answer: { ...answer._doc, solution: question.solution },
      });
      io.to("admin").emit("sort-calc-point-success");
      console.log("sort-calc-point-success");
      PlayerService.updateLeaderBoard(io);
    } else {
      io.to("admin").emit("sort-calc-point-fail");
    }
  };

  const timeSync = async data => {
    io.to("player").emit("timeSync", data);
  };

  socket.on("get-sort-game", getSortGame);
  socket.on("sort-submit", sortSubmit);
  socket.on("sort-start", sortStart);
  socket.on("sort-timeOut", sortTimeOut);
  socket.on("sort-result", sortResult);
  socket.on("sort-swap-question", sortSwapQuestion);
  socket.on("sort-calc-point", sortCalcPoint);
  socket.on("sort-calc-point-team", sortCalcPointOneTeam);
  socket.on("timeSync", timeSync);
};
function CheckAnswer(content, solution) {


  let resultArr = []
  let numberOfRightAnswerArr = []

  for (let is = 0; is < solution.length; is++) {
    let result = ""
    let numberOfRightAnswer = 0
    for (let js = 0; js < solution[is].length; js++) {
      let tempSolution = solution[is].split("-")
      let tempContent = content.split(",")
      if (Number(tempContent[js]) === Number(tempSolution[js])) {
        numberOfRightAnswer += 1;
        result += "1";
        //negativePoint += pointForEachShape
      } else {
        result += "0";
      }
    }
    resultArr[is] = result
    numberOfRightAnswerArr[is] = numberOfRightAnswer

  }
  let bestAnswer = 0
  let bestResult = 0
  let position = 0
  for (let i = 0; i < numberOfRightAnswerArr.length; i++) {
    if (Number(bestResult) < Number(numberOfRightAnswerArr[i])) {
      bestResult = numberOfRightAnswerArr[i]
      position = i
    }
  }
  //console.log(numberOfRightAnswerArr, resultArr)
  return [numberOfRightAnswerArr[position], resultArr[position]]

}