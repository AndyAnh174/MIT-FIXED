import AnswerModel from "../models/answer.model";
import QuestionModel from "../models/question.model";
import RoundModel from "../models/round.model";
import ShapeModel from "../models/shape.model";
import UserService from "./user.service";
import SessionService from "./session.service";

const SortService = {};

const ROUND_NAME = "sort";

SortService.getAnswer = async id => {
  var answer = await AnswerModel.findById(id);
  return answer;
};

SortService.getAnswersByQuestionId = async id => {
  var answers = await AnswerModel.find({ questionId: id }).populate(
    "userId",
    "_id displayName",
  );
  return answers;
};

SortService.getSortGame = async user => {
  const session = await SessionService.getSession();
  const { isStarted, timeOut, timePeriod, questionId } = session;
  const { userId, role } = user;

  if (session) {
    const answers = await SortService.getAnswersByQuestionId(
      questionId,
    );

    const question = await QuestionModel.findById(questionId);

    if (role === "admin") {
      return { isStarted, timeOut, timePeriod, answers, question };
    }

    if (role === "player") {
      const answer = answers.find(
        a => a.userId._id.toString() === userId.toString(),
      );

      if (session.isStarted == 1) {
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

SortService.createNewSortSubmit = async (userId, content) => {
  const session = await SessionService.getSession();
  const { questionId, roundId } = session;
  var answer;

  const userAnswers = await AnswerModel.find({ questionId, userId });

  let message = "You have successfully answered this question";
  if (userAnswers.length > 0) {
    message = "You have already answered this question";
  } else {
    answer = await AnswerModel.create({
      questionId,
      userId,
      roundId,
      content,
      status: 0, // false
      year: process.env.YEAR,
    });

    if (!answer) {
      message = "Something went wrong";
      return { message, answers: [], answer: null };
    }
  }

  var answers = await AnswerModel.find({ roundId })
    .select("_id content point")
    .sort({ createdAt: -1 })
    .populate("userId", "displayName");

  answer = await SortService.getAnswer(answer._id);

  return { message, answers, answer };
};

SortService.createNewSortResult = async (userId, point) => {
  const session = await SessionService.getSession();
  const { questionId } = session;

  let answer = await AnswerModel.findOne({ questionId, userId });

  answer.point = point;
  answer.status = 1;
  await answer.save();

  const user = await UserService.calcPointAndUpdate(userId);
  const rank = await UserService.getRank(userId);

  return {
    userId,
    userPoint: user.point,
    point: answer.point,
    rank: rank,
  };
};

SortService.getRound = async () => {
  const result = await RoundModel.findOne({ name: ROUND_NAME });

  return result;
};

SortService.getQuestion = async () => {
  const round = await SortService.getRound();
  const result = await QuestionModel.findOne({ roundId: round._id });
  return result;
};

SortService.getShapes = async year => {
  return await ShapeModel.find({ year: year });
};

export default SortService;
