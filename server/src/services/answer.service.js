import AnswerModel from "../models/answer.model";

const AnswerService = {};

AnswerService.getAnswersByQuestionId = async questionId => {
  const result = await AnswerModel.find({
    questionId: questionId,
  })
    .populate("userId", "_id, displayName")
    .sort({
      timeSubmit: 1,
    });
  return result;
};

AnswerService.getByUserId = async (userId, questionId) => {
  const result = await AnswerModel.findOne({
    userId,
    questionId,
  }).populate("userId", "_id, displayName");
  return result;
};

AnswerService.removeByQuestionId = async questionId => {
  await AnswerModel.remove({ questionId: questionId });
};

export default AnswerService;
