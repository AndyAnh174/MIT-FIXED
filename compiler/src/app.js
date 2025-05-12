import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import cors from "cors";
const morgan = require('morgan');
dotenv.config();

const port = process.env.PORT || 3334;
const app = express();
const httpServer = createServer(app);
app.use(express.json());
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  }),
);
app.use(morgan('combined'))
app.use("/api", require("./routes/api").default);

app.get("/", (req, res) => {
  res.json({
    message: "MIT UTE compiler server",
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
