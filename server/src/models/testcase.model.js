import mongoose from "mongoose";

const TestCaseSchema = mongoose.Schema({
  order: {
    type: Number,
    required: true,
  },
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  },
  point: {
    type: Number,
    default: 0,
  },
  year: {
    type: String,
    required: true,
  },
});

TestCaseSchema.set("timestamps", true);

const TestCaseModel = mongoose.model(
  "TestCase",
  TestCaseSchema,
  "testcases",
);

export default TestCaseModel;
