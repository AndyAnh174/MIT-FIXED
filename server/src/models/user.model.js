import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    max: 20,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  point: {
    type: Number,
    default: 0,
  },
  year: {
    type: String,
  },
  status: {
    type: Number,
    enum: [0, 1], // 0 block
    default: 1,
  },
});

UserSchema.set("timestamps", true);

const UserModel = mongoose.model("Users", UserSchema, "users");

export default UserModel;
