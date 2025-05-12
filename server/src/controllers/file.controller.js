import path from "path";
import fs from "fs";
import sharp from "sharp";

var dir = path.join(
  __dirname.replace("\\src\\controllers", ""),
  "public",
);

var mime = {
  html: "text/html",
  txt: "text/plain",
  css: "text/css",
  gif: "image/gif",
  jpg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  js: "application/javascript",
};

const removeTemp = path => {
  fs.unlink(path, err => {
    if (err) throw err;
  });
};

const FileController = {};

FileController.getFile = async (req, res) => {
  var file = path.join(dir, req.path.replace(/\/$/, "/index.html"));
  console.log(file);
  if (file.indexOf(dir + path.sep) !== 0) {
    return res.status(403).end("Forbidden");
  }
  var type = mime[path.extname(file).slice(1)] || "text/plain";
  var s = fs.createReadStream(file);
  s.on("open", function () {
    res.set("Content-Type", type);
    s.pipe(res);
  });
  s.on("error", function () {
    res.set("Content-Type", "text/plain");
    res.status(404).end("Not found");
  });
};

FileController.postFile = async (req, res) => {
  const user = req.user;
  const { userId } = user;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ msg: "No file were uploaded" });
  }
  const file = req.files.image;
  const image = await fs.readFileSync(file.tempFilePath);
  console.log(file);
  if (
    file.mimetype !== "image/jpeg" &&
    file.mimetype != "image/png"
  ) {
    return res.status(400).json({ msg: "file is incorrect format" });
  }
  const pathFile = path.join(
    dir,
    "/files/round02_connection/results/" +
      userId +
      "." +
      file.mimetype.replace("image/", ""),
  );
  try {
    await sharp(image).toFile(pathFile);
    removeTemp(file.tempFilePath);
    const url =
      "/api/files/round02_connection/results/" +
      userId +
      "." +
      file.mimetype.replace("image/", "");
    return res.status(200).json(url);
  } catch (e) {
    return res.status(500).json({ msg: "save file fail" });
  }
};

export default FileController;
