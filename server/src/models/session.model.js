import mongoose from "mongoose";

const SessionSchema = mongoose.Schema({
  roundId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Rounds",
  },

  questionId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Questions",
  },

  timeOut: {
    type: Date,
  },

  timePeriod: {
    type: Number,
    default: 300,
  },

  isStarted: {
    type: Number,
    enum: [0, 1, 2],
  },

  year: {
    type: String,
  },
});

SessionSchema.set("timestamps", true);

const SessionModel = mongoose.model("Sessions", SessionSchema, "sessions");

export default SessionModel;
