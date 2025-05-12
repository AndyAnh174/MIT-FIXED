import UserModel from "../models/user.model";
import AnswerModel from "../models/answer.model";

const UserService = {};

UserService.createNewAccount = async (
  username,
  password,
  displayName,
  role,
) => {
  const result = await UserModel.create({
    username: username,
    password: password,
    displayName: displayName,
    role: role,
  });

  return result;
};

UserService.deleteAccount = async username => {
  const result = await UserModel.deleteOne({
    username: username,
  });

  return result;
};

UserService.getUser = async userId => {
  const result = await UserModel.findById(userId);

  return result;
};

UserService.getPlayers = async () => {
  const result = await UserModel.find({ role: "player" }).select(
    "_id displayName point role year status",
  );
  return result;
};

UserService.getAllUsers = async () => {
  const result = await UserModel.find();
  return result;
};

UserService.calcPointAndUpdate = async userId => {
  const answers = await AnswerModel.find({
    userId,
    status: 1,
  });
  const point = answers.reduce((acc, cur) => acc + cur.point, 0);

  return await UserModel.findByIdAndUpdate(userId, { point });
};

UserService.getRank = async userId => {
  const players = await UserModel.find({ role: "player" }).sort({
    point: -1,
  });
  const rank =
    players.findIndex(
      player => player._id.toString() === userId.toString(),
    ) + 1;

  return rank;
};

UserService.getPlayersInfo = async () => {
  let players = await UserModel.find({ role: "player" });

  for (const player of players) {
    await UserService.calcPointAndUpdate(player._id);
  }

  players = await UserModel.find({ role: "player" }).select(
    "_id displayName point",
  );

  players.sort((a, b) => b.point - a.point);
  players.forEach((player, index) => {
    player._doc.rank = index + 1;
    player.rank = index + 1;
  });

  return players;
};

export default UserService;
