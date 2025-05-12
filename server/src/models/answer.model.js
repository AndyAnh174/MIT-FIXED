import mongoose from "mongoose";

const AnswerSchema = mongoose.Schema({
  questionId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Questions",
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Users",
  },
  roundId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Rounds",
  },
  content: {
    type: String,
  },
  result: {
    type: String,
  },
  timeSubmit: {
    type: Number,
  },
  point: {
    type: Number,
    default: 0,
  },
  status: {
    type: Number,
    enum: [0, 1], // 0 false - 1 true
  },
  year: {
    type: String,
  },
});

AnswerSchema.set("timestamps", true);

const AnswerModel = mongoose.model(
  "Answers",
  AnswerSchema,
  "answers",
);

export default AnswerModel;
