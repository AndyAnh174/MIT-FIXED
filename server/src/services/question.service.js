import QuestionModel from "../models/question.model";
import QuestionBackupModel from "../models/questionBackup.model";
import QuestionBackupService from "./questionBackup.service";
import fs from "fs";
import path from "path";

const QuestionService = {};

// Hàm kiểm tra xem file có tồn tại không
const checkFileExists = (filePath) => {
  try {
    // Nếu là đường dẫn API, lấy phần sau /api/files/
    if (filePath.startsWith('/api/files/')) {
      filePath = filePath.replace('/api/files/', '');
    }
    
    const absolutePath = path.resolve(__dirname, "../../public/files", filePath);
    console.log("Đường dẫn tuyệt đối:", absolutePath);
    const exists = fs.existsSync(absolutePath);
    console.log("File tồn tại:", exists);
    return exists;
  } catch (error) {
    console.error("Lỗi khi kiểm tra file:", error);
    return false;
  }
};

QuestionService.getFirstQuestion = async roundId => {
  var result = await QuestionModel.findOne({ roundId, order: 1 });
  if (result) {
    console.log("Nội dung câu hỏi gốc:", result._doc.content);
    // Không cần thêm /files/ vào đường dẫn nếu đã có /api/files/
    if (result._doc.content && !result._doc.content.startsWith('http') && !result._doc.content.startsWith('/api/files/')) {
      result._doc.content = `/api/files/${result._doc.content}`;
      console.log("Nội dung sau khi thêm đường dẫn:", result._doc.content);
    }
    checkFileExists(result._doc.content);
  }
  console.log("RESULT IN ", result)
  return result;
};

QuestionService.getQuestion = async questionId => {
  var result = await QuestionModel.findById(questionId);
  if (result) {
    console.log("Nội dung câu hỏi gốc:", result._doc.content);
    // Không cần thêm /files/ vào đường dẫn nếu đã có /api/files/
    if (result._doc.content && !result._doc.content.startsWith('http') && !result._doc.content.startsWith('/api/files/')) {
      result._doc.content = `/api/files/${result._doc.content}`;
      console.log("Nội dung sau khi thêm đường dẫn:", result._doc.content);
    }
    checkFileExists(result._doc.content);
  }
  return result;
};

QuestionService.getQuestionByOrder = async (roundId, order) => {
  var result = await QuestionModel.findOne({
    roundId: roundId,
    order: order,
  });
  if (result) {
    console.log("Nội dung câu hỏi gốc:", result._doc.content);
    // Không cần thêm /files/ vào đường dẫn nếu đã có /api/files/
    if (result._doc.content && !result._doc.content.startsWith('http') && !result._doc.content.startsWith('/api/files/')) {
      result._doc.content = `/api/files/${result._doc.content}`;
      console.log("Nội dung sau khi thêm đường dẫn:", result._doc.content);
    }
    checkFileExists(result._doc.content);
  }
  return result;
};

QuestionService.swapQuestion = async (
  questionId,
  questionBackupId,
) => {
  let question = await QuestionModel.findById(questionId);
  let questionBackup = await QuestionBackupModel.findById(
    questionBackupId,
  );
  const content = question.content;
  const point = question.point;
  const solution = question.solution;
  const image = question.image;
  const timePeriod = question.timePeriod;
  const year = question.year;

  question.content = questionBackup.content;
  question.point = questionBackup.point;
  question.solution = questionBackup.solution;
  question.image = questionBackup.image;
  question.timePeriod = questionBackup.timePeriod;
  question.year = questionBackup.year;

  questionBackup.content = content;
  questionBackup.point = point;
  questionBackup.solution = solution;
  questionBackup.image = image;
  questionBackup.timePeriod = timePeriod;
  questionBackup.year = year;
  questionBackup.isActive = 0;

  await question.save();
  await questionBackup.save();
};

export default QuestionService;
