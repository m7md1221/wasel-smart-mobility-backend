const { Op } = require("sequelize");
const sequelize = require("../config/database");
const Incident = require("../models/incidentsModel");
const ModerationLog = require("../models/moderationLogsModel");

// GET /api/v1/incidents
async function getAllIncidents(req, res) {
  try {
    const {
      category, severity, status, checkpoint_id,
      sortBy = "created_at", order = "DESC",
      page = 1, limit = 10
    } = req.query;

    const where = {};
    if (category)      where.category      = category;
    if (severity)      where.severity      = severity;
    if (status)        where.status        = status;
    if (checkpoint_id) where.checkpoint_id = checkpoint_id;

    const allowedSort = ["created_at", "severity", "category", "status"];
    const safeSort = allowedSort.includes(sortBy) ? sortBy : "created_at";
    const safeOrder = order.toUpperCase() === "ASC" ? "ASC" : "DESC";
    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.min(parseInt(limit) || 10, 100);

    const { count, rows } = await Incident.findAndCountAll({
      where,
      order: [[safeSort, safeOrder]],
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
    });

    return res.status(200).json({
      data: rows,
      pagination: { total: count, page: pageNum, limit: limitNum, pages: Math.ceil(count / limitNum) },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching incidents", error: error.message });
  }
}

// GET /api/v1/incidents/:id
async function getIncidentById(req, res) {
  try {
    // Raw SQL مع JOIN
    const result = await sequelize.query(
      `SELECT i.*, c.name AS checkpoint_name,
              u1.name AS created_by_name, u2.name AS verified_by_name
       FROM incidents i
       LEFT JOIN checkpoints c  ON i.checkpoint_id = c.id
       LEFT JOIN users u1       ON i.created_by    = u1.id
       LEFT JOIN users u2       ON i.verified_by   = u2.id
       WHERE i.id = :id`,
      { replacements: { id: req.params.id }, type: sequelize.QueryTypes.SELECT }
    );

    if (!result[0]) return res.status(404).json({ message: "Incident not found" });
    return res.status(200).json({ data: result[0] });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching incident", error: error.message });
  }
}

// POST /api/v1/incidents
async function createIncident(req, res) {
  try {
    const { title, category, severity, description, latitude, longitude, checkpoint_id } = req.body;

    if (!title || !category || !severity) {
      return res.status(400).json({ message: "title, category, and severity are required" });
    }

    const allowedCategories = ["closure", "delay", "accident", "weather_hazard", "other"];
    const allowedSeverities = ["low", "medium", "high", "critical"];

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: `Category must be one of: ${allowedCategories.join(", ")}` });
    }
    if (!allowedSeverities.includes(severity)) {
      return res.status(400).json({ message: `Severity must be one of: ${allowedSeverities.join(", ")}` });
    }

    const incident = await Incident.create({
      title, category, severity, description,
      latitude, longitude, checkpoint_id,
      created_by: req.user.userId,
      status: "open",
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Moderation log
    await ModerationLog.create({
      event_type: "incident",
      event_id: incident.id,
      performed_by: req.user.userId,
      action: "created",
      created_at: new Date(),
    });

    return res.status(201).json({ message: "Incident created", data: incident });
  } catch (error) {
    return res.status(500).json({ message: "Error creating incident", error: error.message });
  }
}

// PATCH /api/v1/incidents/:id/status
async function updateIncidentStatus(req, res) {
  try {
    const { status, reason } = req.body;
    const allowedStatuses = ["open", "verified", "closed"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowedStatuses.join(", ")}` });
    }

    const incident = await Incident.findByPk(req.params.id);
    if (!incident) return res.status(404).json({ message: "Incident not found" });

    const updateData = { status, updated_at: new Date() };
    if (status === "closed") updateData.closed_at = new Date();
    if (["verified", "closed"].includes(status)) updateData.verified_by = req.user.userId;

    await incident.update(updateData);

    // Moderation log
    await ModerationLog.create({
      event_type: "incident",
      event_id: incident.id,
      performed_by: req.user.userId,
      action: `status_changed_to_${status}`,
      reason: reason || null,
      created_at: new Date(),
    });

    return res.status(200).json({ message: "Incident status updated", data: incident });
  } catch (error) {
    return res.status(500).json({ message: "Error updating incident status", error: error.message });
  }
}

module.exports = { getAllIncidents, getIncidentById, createIncident, updateIncidentStatus };