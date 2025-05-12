import AnswerModel from "../models/answer.model";
import QuestionModel from "../models/question.model";
import RoundModel from "../models/round.model";
import ShapeModel from "../models/shape.model";
import UserService from "./user.service";
import SessionService from "./session.service";
import QuestionService from "./question.service";

const WarmUpService = {};

const ROUND_NAME = "warm-up";

WarmUpService.getWarmUpGame = async user => {
  const session = await SessionService.getSession();
  const { isStarted, timeOut, timePeriod, questionId } = session;
  const { userId, role } = user;

  if (session) {
    const answers = await AnswerModel.find({ questionId }).populate(
      "userId",
      "_id displayName",
    );
    const question = await QuestionService.getQuestion(questionId);

    if (role === "admin") {
      return { isStarted, timeOut, timePeriod, answers, question };
    }

    if (role === "player") {
      const answer = answers.find(
        a => a.userId._id.toString() === userId.toString(),
      );

      switch (session.isStarted) {
        case 1:
          return {
            isStarted,
            timeOut,
            timePeriod,
            answer,
            question: {
              _id: question._id,
              content: question.content,
              point: question.point,
              order: question.order,
            },
          };
          break;
        case 2:
          return {
            isStarted,
            timeOut,
            timePeriod,
            answer,
            question,
          };
          break;
        default:
          return {
            isStarted,
            timeOut: 0,
            timePeriod: question.timePeriod,
            answer,
            question: {
              _id: question._id,
              point: question.point,
              order: question.order,
            },
          };
          break;
      }
    }
  }
};

WarmUpService.createSubmit = async (userId, content) => {
  const session = await SessionService.getSession();
  const { questionId, roundId, timeOut, timePeriod } = session;

  const question = await QuestionService.getQuestion(questionId);
  const user = await UserService.getUser(userId);
  const answers = await AnswerModel.find({ questionId, userId });

  if (answers.length == 0) {
    const answer = await AnswerModel.create({
      questionId,
      userId,
      roundId,
      content: content,
      status: 1, // false
      year: process.env.YEAR,
      result: question.solution,
      point: content == question.solution ? question.point : 0,
      timeSubmit:
        timePeriod * 1000 - (Date.parse(timeOut) - Date.now()),
    });

    answer._doc.userId = {
      _id: user._id,
      displayName: user.displayName,
    };

    return answer;
  }
  return answers[0];
};

WarmUpService.getRound = async () => {
  const result = await RoundModel.findOne({ name: ROUND_NAME });

  return result;
};

WarmUpService.getQuestion = async order => {
  const round = await WarmUpService.getRound();
  const result = await QuestionService.getQuestionByOrder(
    round._id,
    order,
  );
  return result;
};

export default WarmUpService;
