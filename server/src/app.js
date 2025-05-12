import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import fileupload from "express-fileupload";
import path from "path";

import connectDatabase from "./configs/db.config";
import sockets from "./sockets";

dotenv.config();

connectDatabase();
const testcase = require("./models/testcase.model");
const answer = require("./models/answer.model");
const questionBackup = require("./models/questionBackup.model");
const port = process.env.PORT || 3000;
const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.REACT_APP_CLIENT_URL_LOCALHOST,
      process.env.REACT_APP_CLIENT_URL_PRODUCTION,
    ],
    credentials: true,
  }),
);

app.use(
  fileupload({
    useTempFiles: true,
  }),
);

// Phục vụ các file tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, "../public")));

// Tạo route riêng cho files
app.use("/api/files", express.static(path.join(__dirname, "../public/files")));

app.use("/api", require("./routes/api").default);

app.get("/", (req, res) => {
  res.json({
    message: "MIT UTE server",
  });
});

const io = new Server(httpServer, {
  cors: {
    origin: [
      process.env.REACT_APP_CLIENT_URL_LOCALHOST,
      process.env.REACT_APP_CLIENT_URL_PRODUCTION,
    ],
    credentials: true,
  },
});

sockets.init(io);

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
