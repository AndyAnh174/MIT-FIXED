import TestCaseModel from "../models/testcase.model";

const TestCaseService = {};

TestCaseService.getTestCases = async year => {
  const result = await TestCaseModel.find({ year: year }).sort({
    order: 1,
  });

  return result;
};

export default TestCaseService;
