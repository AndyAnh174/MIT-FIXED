import compilerAPI from "../api/compilerAPI";

const CompilerService = {};

CompilerService.compile = async (data, name, input) => {
  try {
    const response = await compilerAPI.compile(data, name, input);
    return response.data;
  } catch (e) {
    return {
      err: false,
      output: "fail",
    };
  }
};

export default CompilerService;
