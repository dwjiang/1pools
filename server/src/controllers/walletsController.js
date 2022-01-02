const walletsService = require("../services/walletsService");

const find = async (req, res) => {
  const { id } = req.params;
  const response = await walletsService.find(id);
  res.status(200).json(response)
}

module.exports = {
  find,
};
