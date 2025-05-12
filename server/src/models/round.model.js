import mongoose from "mongoose";

const RoundSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  lawUrl: {
    type: String,
    required: true,
  },
  pointBonus: {
    type: Number,
    default: 0,
  },
  year: {
    type: String,
  },
});

const RoundModel = mongoose.model("Rounds", RoundSchema, "rounds");

export default RoundModel;
