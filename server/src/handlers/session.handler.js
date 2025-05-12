import SessionService from "../services/session.service";
import RoundService from "../services/round.service";
import QuestionService from "../services/question.service";

module.exports = (io, socket) => {
  const getCurrentRound = async () => {
    const result = await SessionService.getSession();

    socket.emit("current-round", result);
  };

  const getCurrentRoundId = async () => {
    const result = await SessionService.getSession();

    socket.emit("current-roundId", result);
  };

  const changeCurrentRound = async (payload) => {
    const user = socket.request.user;
    if (user.role != "admin") return;

    const { roundId } = payload;

    const round = await RoundService.getRoundById(roundId);

    const question = await QuestionService.getFirstQuestion(roundId);
    console.log("QUESTION", question)
    if (round) {
      console.log("user", user.username, "change round to", round.name);
      await SessionService.updateSession({
        roundId,
        questionId: question._id,
        isStarted: 0,
        timePeriod: question.timePeriod,
      });
    }

    io.emit("current-round", { roundName: round.name });
  };

  socket.on("change-current-round", changeCurrentRound);
  socket.on("get-current-round", getCurrentRound);
  socket.on("get-current-roundId", getCurrentRoundId);
};