import mongoose from "mongoose";

const ShapeSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
  year: {
    type: String,
  },
});

const ShapeModel = mongoose.model("Shapes", ShapeSchema, "shapes");

export default ShapeModel;
