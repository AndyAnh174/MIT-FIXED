import AnswerModel from "../models/answer.model";
import PlayerService from "../services/player.service";
import SessionService from "../services/session.service";
import UserService from "../services/user.service";

module.exports = (io, socket) => {
  const eloquenceGetAnswers = async () => {
    console.log(">> get eloquence answers");
    const user = socket.request.user;
    if (user.role !== "admin") return;
    const session = await SessionService.getSession();
    let players = await UserService.getPlayers();
    for (let index = 0; index < players.length; index++) {
      let player = players[index];
      const answer = await AnswerModel.findOne({
        questionId: session.questionId,
        userId: player._id,
      });
      if (answer) {
        player._doc.answer = answer;
      } else {
        const newAnswer = await AnswerModel.create({
          userId: player._id,
          questionId: session.questionId,
          roundId: session.roundId,
          content: "",
          result: "0",
          point: 0,
          status: 1,
          year: "2024",
        });
        player._doc.answer = newAnswer;
      }
    }
    io.to("admin").emit("eloquence-answers", players);
  };

  const eloquenceUpdatePointAnswer = async answer => {
    console.log(">> update point answer eloquence");
    console.log({ answer });
    const user = socket.request.user;
    if (user.role !== "admin") return;

    let oldAnswer = await AnswerModel.findById(answer._id);
    oldAnswer.result = answer.result;
    oldAnswer.point = answer.point;
    try {
      await oldAnswer.save();
      PlayerService.updateLeaderBoard(io);
      io.to("admin").emit(
        "eloquence-update-point-answer-success",
        {},
      );
    } catch (e) {
      io.to("admin").emit("eloquence-update-point-answer-fail", {});
    }
  };

  socket.on("eloquence-get-answers", eloquenceGetAnswers);
  socket.on(
    "eloquence-update-point-answer",
    eloquenceUpdatePointAnswer,
  );
};
