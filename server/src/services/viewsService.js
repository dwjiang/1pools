const viewsModel = require("../models/views");
const { Op } = require("sequelize");
const moment = require("moment");

const view = async (id) => {
  const timestamp = parseInt(moment().startOf("hour").valueOf() / 3600000);
  const [ pool, created ] = await viewsModel.findOrCreate({ 
    where: { pool: id, timestamp }
  });
  pool.count += 1;
  await pool.save();
}

const getViews = async (id) => {
  const end = parseInt(moment().startOf("hour").valueOf() / 3600000);;
  const start = end - 168;
  const views = await viewsModel.findAll({ 
    where: { pool: id, timestamp: { [Op.between]: [start, end] }}
  });
  return views.reduce((acc, view) => acc + view.count, 0);
}

module.exports = {
  view,
  getViews,
};
