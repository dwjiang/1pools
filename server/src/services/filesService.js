const axios = require("axios");
const urlSlug = require("url-slug");
const yup = require("../validations/validations");
const metadataSchema = require("../validations/schemas/metadataSchema");
const constants = require("../constants/constants");

const uploadMetadata = async (metadata) => {
  const valid = metadataSchema.isValid(metadata, {
    strict: true, abortEarly: true,
  });
  if (!valid)
    throw new Error("Invalid metadata schema");
  return await axios.post(`${constants.PINATA_URL_PINNING_API}/pinJSONToIPFS`, 
    {
      pinataMetadata: { 
        name: `${urlSlug.convert(`1pools_${metadata.name}`, { separator: "_" })}.json` 
      },
      pinataContent: metadata,
    },
    {
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_API_SECRET,
      }
    }
  );
}

module.exports = {
  uploadMetadata,
};
