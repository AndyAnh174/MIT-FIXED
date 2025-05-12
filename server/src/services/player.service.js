import UserService from "./user.service";

const PlayerService = {};

PlayerService.updateLeaderBoard = async io => {
  const players = await UserService.getPlayersInfo();
  players.forEach(player => {
    io.to(player._id.toString()).emit("player-info", {
      _id: player._id,
      displayName: player.displayName,
      point: player.point,
      rank: player.rank,
    });
  });
  const top5 = players.slice(0, 5);
  io.to("admin").emit("leader-board", top5);
};

export default PlayerService;
