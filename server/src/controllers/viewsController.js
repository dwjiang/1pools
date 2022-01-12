const viewsService = require("../services/viewsService");

const view = async (req, res) => {
  const { id } = req.query;
  await viewsService.view(id);
  res.sendStatus(200);
}

const getViews = async (req, res) => {
  const { id } = req.query;
  const response = await viewsService.getViews(id);
  res.status(200).json({ views: response  });
}

module.exports = {
  view,
  getViews
};
