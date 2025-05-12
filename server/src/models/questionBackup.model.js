import mongoose from "mongoose";

const QuestionBackupSchema = mongoose.Schema({
  roundId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Rounds",
  },
  content: {
    type: String,
  },
  point: {
    type: Number,
    default: 0,
  },
  solution: {
    type: String,
  },
  image: {
    type: String,
  },
  timePeriod: {
    type: Number,
    default: 300, //giây
  },
  year: {
    type: String,
  },
  isActive: {
    type: Number,
    default: 1,
  },
});

const QuestionBackupModel = mongoose.model(
  "QuestionsBackup",
  QuestionBackupSchema,
  "questionsBackup",
);

export default QuestionBackupModel;
