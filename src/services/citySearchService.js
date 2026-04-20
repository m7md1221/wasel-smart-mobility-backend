const { Op } = require("sequelize");
const Checkpoint = require("../models/checkpointModel");

class citySearchService {
  async getCheckpointsByCity(city) {
    return await Checkpoint.findAll({
      where: {
        city: {
          [Op.iLike]: `%${city.trim()}%`
        }
      },
      attributes: ["name", "city", "current_status"],
      order: [["name", "ASC"]],
      raw: true
    });
  }

  async getDistinctCities() {
    const rows = await Checkpoint.findAll({
      attributes: ["city"],
      group: ["city"],
      order: [["city", "ASC"]],
      raw: true
    });

    return rows.map(row => row.city).filter(Boolean);
  }
}

module.exports = citySearchService;