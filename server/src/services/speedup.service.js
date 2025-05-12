import AnswerModel from "../models/answer.model";
import QuestionModel from "../models/question.model";
import RoundModel from "../models/round.model";
import ShapeModel from "../models/shape.model";
import UserService from "./user.service";
import SessionService from "./session.service";
import QuestionService from "./question.service";

const SpeedUpService = {};

const ROUND_NAME = "speed-up";

SpeedUpService.getSpeedUpGame = async user => {
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
      console.log({ session });
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
            },
          };
        default:
          if (answer) {
            return {
              isStarted,
              timeOut: Date.now() + question.timePeriod * 1000,
              timePeriod: question.timePeriod,
              answer:
                answer.status == 1
                  ? { ...answer._doc, solution: question.solution }
                  : answer,
              question: {
                _id: question._id,
                content: question.content,
                point: question.point,
              },
            };
          } else {
            return {
              isStarted,
              timeOut: Date.now() + question.timePeriod * 1000,
              timePeriod: question.timePeriod,
              answer,
            };
          }
      }
    }
  }
};

SpeedUpService.createSubmit = async (userId, content) => {
  const session = await SessionService.getSession();
  const { questionId, roundId, timeOut, timePeriod } = session;

  const answers = await AnswerModel.find({ questionId, userId });
  const user = await UserService.getUser(userId);

  if (answers.length == 0) {
    const answer = await AnswerModel.create({
      questionId,
      userId,
      roundId,
      content: content,
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

SpeedUpService.getRound = async () => {
  const result = await RoundModel.findOne({ name: ROUND_NAME });
  return result;
};

SpeedUpService.getQuestion = async () => {
  const round = await SpeedUpService.getRound();
  const result = await QuestionService.getFirstQuestion(round._id);
  return result;
};

export default SpeedUpService;
