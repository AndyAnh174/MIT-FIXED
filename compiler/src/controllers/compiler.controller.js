import {
  cPlusPlusDebug,
  cPlusPlusExecute,
} from "../compiler/compiler";

const CodeController = {};

CodeController.debug = async (req, res) => {
  const { data, _id } = req.body;
  if (data) {
    const result = await cPlusPlusDebug(data, _id);
    res.status(200).json(result);
  } else {
    res.status(403).json({ message: "code data is null" });
  }
};

CodeController.compile = async (req, res) => {
  const { data, _id, input } = req.body;
  const name = _id + "_at_" + Date.now().toString();
  if (data) {
    const result = await cPlusPlusExecute(data, input, name);
    res.status(200).json(result);
  } else {
    res.status(403).json({ message: "code data is null" });
  }
};

export default CodeController;
