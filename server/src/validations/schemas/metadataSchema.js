const yup = require("../validations");

const metadataSchema = yup.object().shape({
  name: yup.string().min(5).max(50).required(),
  description: yup.string().min(10).max(10000).required(),
  goal: yup.number().positive().integer().max(999999999999999).required(),
});
  
module.exports = metadataSchema;
