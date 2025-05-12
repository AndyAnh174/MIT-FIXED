import QuestionModel from "../models/question.model";
import SessionModel from "../models/session.model";
//import ShapeModel from "../models/shape.model";

const SessionService = {};

SessionService.getSession = async () => {
  const result = await SessionModel.findOne().populate("roundId", "name _id");
  return {
    ...result._doc,
    roundName: result.roundId.name,
    roundId: result.roundId._id,
  };
};

SessionService.updateSession = async (payload) => {
  const session = await SessionModel.findOne({});

  const { roundId, questionId, timeOut, timePeriod, isStarted } = payload;

  if (roundId !== undefined) session.roundId = roundId;
  if (questionId !== undefined) session.questionId = questionId;
  if (timeOut !== undefined) session.timeOut = timeOut;
  if (timePeriod !== undefined) session.timePeriod = timePeriod;
  if (isStarted !== undefined) session.isStarted = isStarted;
  await session.save();

  return session;
};

export default SessionService;
