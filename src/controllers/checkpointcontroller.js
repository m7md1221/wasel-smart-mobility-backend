const { Op } = require("sequelize");
const sequelize = require("../config/database");
const Checkpoint = require("../models/checkpointModel");
const CheckpointStatus = require("../models/checkpointStatusModel");
const ModerationLog = require("../models/moderationLogsModel");

// GET /api/v1/checkpoints
async function getAllCheckpoints(req, res) {
  try {
    const {
      status, search,
      sortBy = "created_at", order = "DESC",
      page = 1, limit = 10
    } = req.query;

    const where = {};
    if (status) where.current_status = status;
    if (search) where.name = { [Op.iLike]: `%${search}%` };

    const allowedSort = ["name", "created_at", "current_status"];
    const safeSort = allowedSort.includes(sortBy) ? sortBy : "created_at";
    const safeOrder = order.toUpperCase() === "ASC" ? "ASC" : "DESC";
    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.min(parseInt(limit) || 10, 100);

    const { count, rows } = await Checkpoint.findAndCountAll({
      where,
      order: [[safeSort, safeOrder]],
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
    });

    return res.status(200).json({
      data: rows,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(count / limitNum),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching checkpoints", error: error.message });
  }
}

// GET /api/v1/checkpoints/:id
async function getCheckpointById(req, res) {
  try {
    const checkpoint = await Checkpoint.findByPk(req.params.id);
    if (!checkpoint) return res.status(404).json({ message: "Checkpoint not found" });
    return res.status(200).json({ data: checkpoint });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching checkpoint", error: error.message });
  }
}

// POST /api/v1/checkpoints
async function createCheckpoint(req, res) {
  try {
    const { name,city, latitude, longitude } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!city) return res.status(400).json({ message: "City is required" });

    const checkpoint = await Checkpoint.create({
      name, city, latitude, longitude,
      current_status: "active",
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.status(201).json({ message: "Checkpoint created", data: checkpoint });
  } catch (error) {
    return res.status(500).json({ message: "Error creating checkpoint", error: error.message });
  }
}

// PATCH /api/v1/checkpoints/:id/status
async function updateCheckpointStatus(req, res) {
  try {
    const { status, reason } = req.body;
    const allowedStatuses = ["active", "closed", "restricted"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowedStatuses.join(", ")}` });
    }

    const checkpoint = await Checkpoint.findByPk(req.params.id);
    if (!checkpoint) return res.status(404).json({ message: "Checkpoint not found" });

    // سجّل في تاريخ الحالة
    await CheckpointStatus.create({
      checkpoint_id: checkpoint.id,
      status: status,
      changed_by: req.user.userId,
      changed_at: new Date(),
    });

    // سجّل في moderation logs
    await ModerationLog.create({
      event_type: "checkpoint",
      event_id: checkpoint.id,
      performed_by: req.user.userId,
      action: `status_changed_to_${status}`,
      reason: reason || null,
      created_at: new Date(),
    });

    await checkpoint.update({ current_status: status, updated_at: new Date() });

    return res.status(200).json({ message: "Status updated", data: checkpoint });
  } catch (error) {
    return res.status(500).json({ message: "Error updating status", error: error.message });
  }
}

// GET /api/v1/checkpoints/:id/history
async function getCheckpointHistory(req, res) {
  try {
    const checkpoint = await Checkpoint.findByPk(req.params.id);
    if (!checkpoint) return res.status(404).json({ message: "Checkpoint not found" });

    // Raw SQL لأن المشروع يطلب raw queries
    const history = await sequelize.query(
      `SELECT h.*, u.name AS changed_by_name
       FROM checkpoint_status_history h
       LEFT JOIN users u ON h.changed_by = u.id
       WHERE h.checkpoint_id = :id
       ORDER BY h.changed_at DESC`,
      { replacements: { id: req.params.id }, type: sequelize.QueryTypes.SELECT }
    );

    return res.status(200).json({ data: history });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching history", error: error.message });
  }
}

module.exports = { getAllCheckpoints, getCheckpointById, createCheckpoint, updateCheckpointStatus, getCheckpointHistory };