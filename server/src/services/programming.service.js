import AnswerModel from "../models/answer.model";
import QuestionModel from "../models/question.model";
import RoundModel from "../models/round.model";
import UserService from "./user.service";
import SessionService from "./session.service";
import QuestionService from "./question.service";

const ProgrammingService = {};

const ROUND_NAME = "programming";

ProgrammingService.getProgrammingGame = async user => {
  //const players = await UserService.getPlayer();
  const session = await SessionService.getSession();
  console.log({ session });
  const { isStarted, timeOut, timePeriod, questionId } = session;

  if (session) {
    const answers = await AnswerModel.find({ questionId }).populate(
      "userId",
      "_id displayName",
    );
    const question = await QuestionService.getQuestion(questionId);

    if (user.role === "admin") {
      return { answers, isStarted, timeOut, timePeriod, question };
    } else if (user.role === "player") {
      const answer = answers.find(a => {
        return a.userId._id.toString() === user.userId.toString();
      });

      if (session.isStarted) {
        return {
          isStarted,
          timeOut,
          timePeriod,
          answer,
          question,
        };
      } else {
        return {
          isStarted,
          timeOut: 0,
          timePeriod: question.timePeriod,
          question,
          answer,
        };
      }
    }
  }
};

ProgrammingService.createNewProgrammingSubmit = async (
  userId,
  code,
) => {
  const session = await SessionService.getSession();
  const { questionId, roundId, timeOut, timePeriod } = session;

  const answers = await AnswerModel.find({ questionId, userId });
  const user = await UserService.getUser(userId);

  if (answers.length == 0) {
    const answer = await AnswerModel.create({
      questionId,
      userId,
      roundId,
      content: code,
      status: 0, // false
      year: process.env.YEAR,
      result: "--------",
      timeSubmit:
        timePeriod * 1000 - (Date.parse(timeOut) - Date.now()),
    });

    answer._doc.userId = {
      _id: user._id,
      displayName: user.displayName,
    };

    return { answer };
  }
};

ProgrammingService.createNewProgrammingResult = async data => {
  // update point answer
  const question = await ProgrammingService.getQuestion();

  let answer = await AnswerModel.findOne({
    questionId: question._id,
    userId: data.userId,
  });

  answer.point = data.point;
  answer.status = 1;
  await answer.save();

  let user = await UserService.updatePoint(data.userId);

  console.log(user);

  const rank = await UserService.getRank(data.userId);

  return {
    userId: user._id,
    userPoint: user.point,
    point: answer.point,
    rank: rank,
  };
};

ProgrammingService.getRound = async () => {
  const result = await RoundModel.findOne({ name: ROUND_NAME });
  return result;
};

ProgrammingService.getQuestion = async () => {
  const round = await ProgrammingService.getRound();
  const result = await QuestionService.getFirstQuestion(round._id);
  return result;
};

export default ProgrammingService;
