import cookieParser from "cookie-parser";

import AuthMiddleware from "./middlewares/auth.middleware";

const sockets = {};

sockets.init = io => {
  sockets.io = io;
  const wrap = middleware => (socket, next) =>
    middleware(socket.request, {}, next);

  io.use(wrap(cookieParser()));
  io.use(wrap(AuthMiddleware.isAuthenticated));

  io.playersOnline = [];

  //const registerConnectionHandler = require("./handlers/connection.handler");
  const registerSessionHandler = require("./handlers/session.handler");
  const registerRoundHandler = require("./handlers/round.handler");
  const registerProgrammingHandler = require("./handlers/programming.handler");
  const registerWarmUpHandler = require("./handlers/warmup.handler");
  const registerSpeedUpHandler = require("./handlers/speedup.handler");
  const registerPlayerHandler = require("./handlers/player.handler");
  const registerEloquenceHandler = require("./handlers/eloquence.handler");
  const registerSortHandler = require("./handlers/sort.handler");

  io.on("connection", socket => {
    console.log(
      `${socket.request.user.username +
      "-" +
      socket.request.user.userId
      } connected`,
    );

    if (socket.request.user.role === "player") {
      io.playersOnline.push(socket.request.user);
    }
    io.emit("players-online", io.playersOnline);

    socket.join(socket.request.user.role);
    socket.join(socket.request.user.userId);

    socket.emit("connected", { user: socket.request.user });

    //registerConnectionHandler(io, socket);
    registerSessionHandler(io, socket);
    registerRoundHandler(io, socket);
    registerProgrammingHandler(io, socket);
    registerWarmUpHandler(io, socket);
    registerSpeedUpHandler(io, socket);
    registerPlayerHandler(io, socket);
    registerEloquenceHandler(io, socket);
    registerSortHandler(io, socket);

    socket.on("disconnect", () => {
      const isAuthenticated = socket.request.user;
      if (isAuthenticated) {
        console.log(`${socket.request.user.username} disconnected`);
      }

      io.playersOnline = io.playersOnline.filter(
        player => player.userId !== socket.request.user.userId,
      );
      io.emit("players-online", io.playersOnline);
    });
  });
};

export default sockets;
