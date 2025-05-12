import RoundModel from "../models/round.model";

module.exports = (io, socket) => {
  const getListRounds = async () => {
    if (socket.request.user.role !== "admin") return;

    const rounds = await RoundModel.find({
      year: process.env.YEAR,
    });

    socket.emit("list-rounds", rounds);
  };

  socket.on("get-list-rounds", getListRounds);
};
