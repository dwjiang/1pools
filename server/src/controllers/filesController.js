const filesService = require("../services/filesService");

const uploadMetadata = async (req, res) => {
  const metadata = { 
    name: req.body.name, 
    description: req.body.description,
    goal: req.body.goal,
  };
  const response = await filesService.uploadMetadata(metadata);
  res.status(200).json({ hash: response.data.IpfsHash });
}

module.exports = {
  uploadMetadata,
};
