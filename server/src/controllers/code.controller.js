import compilerAPI from "../api/compilerAPI";
import {
  cPlusPlusDebug,
  cPlusPlusExecute,
} from "../compiler/compiler";
import UserService from "../services/user.service";

const CodeController = {};

CodeController.debug = async (req, res) => {
  const user = req.user;
  const { data } = req.body;
  const { userId } = user;

  if (data) {
    compilerAPI
      .debug(data, userId)
      .then(response => {
        res.status(200).json(response.data);
      })
      .catch(err => {
        res.status(403).json({ message: "compile fail" });
      });
  } else {
    res.status(403).json({ message: "code data is null" });
  }
};

CodeController.compile = async (req, res) => {
  const user = req.user;
  const { data, input } = req.body;
  const { userId } = user;
  const name = userId + "_atTime_" + Date.now().toString();
  if (data) {
    compilerAPI
      .compile(data, name, input)
      .then(response => {
        res.status(200).json(response.data);
      })
      .catch(err => {
        console.log(err)
        res.status(403).json({ message: "compile fail" });
      });
  } else {
    res.status(403).json({ message: "code data is null" });
  }
};

export default CodeController;
