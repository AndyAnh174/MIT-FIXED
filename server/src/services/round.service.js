import RoundModel from "../models/round.model";

const RoundService = {};

RoundService.getRoundById = async roundId => {
  const result = await RoundModel.findById(roundId);

  return result;
};

export default RoundService;
