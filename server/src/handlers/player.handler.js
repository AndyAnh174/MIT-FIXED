import UserService from "../services/user.service";

module.exports = (io, socket) => {
  socket.on("get-player-info", async () => {
    const players = await UserService.getPlayersInfo();
    players.forEach(player => {
      io.to(player._id.toString()).emit("player-info", {
        _id: player._id,
        displayName: player.displayName,
        point: player.point,
        rank: player.rank,
      });
    });
  });

  socket.on("get-leader-board", async () => {
    const players = await UserService.getPlayersInfo();
    const top5 = players.slice(0, 5);

    io.to("admin").emit("leader-board", top5);
  });

  socket.on("get-players-online", () => {
    socket.emit("players-online", io.playersOnline);
  });
};
