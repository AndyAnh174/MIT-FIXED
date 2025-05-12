import mongoose from "mongoose";

const QuestionSchema = mongoose.Schema({
  order: {
    type: Number,
  },
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
});

const QuestionModel = mongoose.model(
  "Questions",
  QuestionSchema,
  "questions",
);

export default QuestionModel;
