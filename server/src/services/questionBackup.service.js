import QuestionBackupModel from "../models/questionBackup.model";

const QuestionBackupService = {};

QuestionBackupService.getFirstQuestionActive = async roundId => {
  var result = await QuestionBackupModel.findOne({
    roundId,
    isActive: 1,
  });
  return result;
};

export default QuestionBackupService;
