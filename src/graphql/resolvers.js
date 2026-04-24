'use strict';

/**
 * graphql/resolvers.js
 *
 * Read-only resolvers only (no mutations).
 * All business logic is delegated to existing service modules.
 * Auth/role enforcement mirrors the REST route guards exactly.
 */

const { requireAuth, requireRole } = require('./auth');

// ── Services (existing) ───────────────────────────────────────────────────────
const reportService     = require('../services/reportService');
const moderationService = require('../services/moderationService');
const AlertService      = require('../services/alertService');
const EmailService      = require('../services/emailService');
const SubscriptionService = require('../services/subscriptionService');

// ── Models used where no service function exists yet ─────────────────────────
const User        = require('../models/userModel');
const Checkpoint  = require('../models/checkpointModel');
const Incident    = require('../models/incidentsModel');
const sequelize   = require('../config/database');
const { Op }      = require('sequelize');

// Instantiate stateful services once
const alertService        = new AlertService(new EmailService());
const subscriptionService = new SubscriptionService();

// ── Helper: safe pagination defaults ─────────────────────────────────────────
function safePagination(page, limit, maxLimit = 100) {
  const p = Math.max(parseInt(page) || 0, 0);
  const l = Math.min(parseInt(limit) || 20, maxLimit);
  return { page: p, limit: l, offset: p * l };
}

// ── Root resolver map ─────────────────────────────────────────────────────────
const resolvers = {

  // ── Health ──────────────────────────────────────────────────────────────────
  health() {
    return { status: 'ok', apiVersion: 'v1' };
  },

  // ── Users ───────────────────────────────────────────────────────────────────

  async myProfile(_args, context) {
    const user = requireAuth(context);
    // Support both token shapes: { id } and { userId }
    const authId = user.id || user.userId;
    const found = await User.findByPk(authId);
    if (!found) throw new Error('NOT_FOUND: User not found');
    const obj = found.toJSON();
    delete obj.password;
    return obj;
  },

  async user({ id }, context) {
    const user = requireAuth(context);
    requireRole(user, ['ADMIN', 'MODERATOR']);
    const found = await User.findByPk(id);
    if (!found) throw new Error('NOT_FOUND: User not found');
    const obj = found.toJSON();
    delete obj.password;
    return obj;
  },

  async users({ page, limit }, context) {
    const user = requireAuth(context);
    requireRole(user, ['ADMIN', 'MODERATOR']);

    const { limit: l, offset } = safePagination(page, limit, 100);

    const { count, rows } = await User.findAndCountAll({
      limit: l,
      offset,
      order: [['created_at', 'DESC']],
    });

    const data = rows.map(u => {
      const obj = u.toJSON();
      delete obj.password;
      return obj;
    });

    return {
      data,
      pagination: {
        total: count,
        limit: l,
        offset,
        pages: Math.ceil(count / l),
      },
    };
  },

  // ── Reports ─────────────────────────────────────────────────────────────────

  async reports({ category, status, latitude, longitude, radius_km, min_confidence, page, limit }) {
    const { page: p, limit: l, offset } = safePagination(page, limit, 100);

    const result = await reportService.getReports({
      category,
      status,
      latitude:       latitude       ? parseFloat(latitude)       : null,
      longitude:      longitude      ? parseFloat(longitude)      : null,
      radius_km:      radius_km      ? parseFloat(radius_km)      : null,
      min_confidence: min_confidence ? parseInt(min_confidence)   : null,
      limit: l,
      page: p,
    });

    return {
      data: result.reports.map(r => r.toJSON ? r.toJSON() : r),
      pagination: result.pagination,
    };
  },

  async reportStats({ category }) {
    return await reportService.getReportStats(category || null);
  },

  async reportById({ id }) {
    const result = await reportService.getReportById(id);
    // getReportById returns a plain object already (spread + votes)
    return result;
  },

  async reportComments({ reportId, page, limit }) {
    const { page: p, limit: l, offset } = safePagination(page, limit, 200);

    const result = await reportService.getReportComments(
      reportId,
      l,
      offset
    );

    return {
      data: result.comments,
      pagination: result.pagination,
    };
  },

  async reportAuditTrail({ reportId, limit }) {
    return await moderationService.getAuditTrail(
      reportId,
      limit ? parseInt(limit) : 50
    );
  },

  // ── Moderation views (ADMIN + MODERATOR) ─────────────────────────────────────

  async moderationQueue({ page, limit }, context) {
    const user = requireAuth(context);
    requireRole(user, ['ADMIN', 'MODERATOR']);

    const { limit: l, offset } = safePagination(page, limit, 100);
    const result = await moderationService.getPendingReportsForModeration(l, offset);

    return {
      data: result.reports.map(r => r.toJSON ? r.toJSON() : r),
      pagination: result.pagination,
    };
  },

  async moderationStats(_args, context) {
    const user = requireAuth(context);
    requireRole(user, ['ADMIN', 'MODERATOR']);
    return await moderationService.getModerationQueueStats();
  },

  async moderationLogs(
    { event_type, action, performed_by, start_date, end_date, page, limit },
    context
  ) {
    // Mirrors REST: ADMIN only
    const user = requireAuth(context);
    requireRole(user, ['ADMIN']);

    const { limit: l, page: p } = safePagination(page, limit, 200);

    const result = await moderationService.getModerationLogs({
      event_type,
      action,
      performed_by: performed_by ? parseInt(performed_by) : null,
      start_date,
      end_date,
      limit: l,
      page: p,
    });

    return {
      data: result.logs.map(log => log.toJSON ? log.toJSON() : log),
      pagination: result.pagination,
    };
  },

  async duplicateReports(_args, context) {
    const user = requireAuth(context);
    requireRole(user, ['ADMIN', 'MODERATOR']);
    const dups = await moderationService.getDuplicateReports();
    return dups.map(r => r.toJSON ? r.toJSON() : r);
  },

  // ── Checkpoints ──────────────────────────────────────────────────────────────

  async checkpoints({ status, search, sortBy, order, page, limit }) {
    const where = {};
    if (status) where.current_status = status;
    if (search)  where.name = { [Op.iLike]: `%${search}%` };

    const allowedSort = ['name', 'created_at', 'current_status'];
    const safeSort  = allowedSort.includes(sortBy) ? sortBy : 'created_at';
    const safeOrder = order === 'ASC' ? 'ASC' : 'DESC';

    const pageNum  = Math.max(parseInt(page)  || 1, 1);
    const limitNum = Math.min(parseInt(limit) || 10, 100);

    const { count, rows } = await Checkpoint.findAndCountAll({
      where,
      order: [[safeSort, safeOrder]],
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
    });

    return {
      data: rows.map(r => r.toJSON()),
      pagination: {
        total: count,
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        pages: Math.ceil(count / limitNum),
      },
    };
  },

  async checkpointById({ id }) {
    const checkpoint = await Checkpoint.findByPk(id);
    if (!checkpoint) throw new Error('NOT_FOUND: Checkpoint not found');
    return checkpoint.toJSON();
  },

  async checkpointHistory({ id }) {
    const checkpoint = await Checkpoint.findByPk(id);
    if (!checkpoint) throw new Error('NOT_FOUND: Checkpoint not found');

    // Mirrors the raw-SQL query used in checkpointController.getCheckpointHistory
    const history = await sequelize.query(
      `SELECT h.*, u.name AS changed_by_name
       FROM checkpoint_status_history h
       LEFT JOIN users u ON h.changed_by = u.id
       WHERE h.checkpoint_id = :id
       ORDER BY h.changed_at DESC`,
      { replacements: { id }, type: sequelize.QueryTypes.SELECT }
    );

    return history;
  },

  // ── Incidents ────────────────────────────────────────────────────────────────

  async incidents({ category, severity, status, checkpoint_id, sortBy, order, page, limit }) {
    const where = {};
    if (category)     where.category      = category;
    if (severity)     where.severity      = severity;
    if (status)       where.status        = status;
    if (checkpoint_id) where.checkpoint_id = checkpoint_id;

    const allowedSort = ['created_at', 'severity', 'category', 'status'];
    const safeSort    = allowedSort.includes(sortBy) ? sortBy : 'created_at';
    const safeOrder   = order === 'ASC' ? 'ASC' : 'DESC';

    const pageNum  = Math.max(parseInt(page)  || 1, 1);
    const limitNum = Math.min(parseInt(limit) || 10, 100);

    const { count, rows } = await Incident.findAndCountAll({
      where,
      order: [[safeSort, safeOrder]],
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
    });

    return {
      data: rows.map(r => r.toJSON()),
      pagination: {
        total: count,
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        pages: Math.ceil(count / limitNum),
      },
    };
  },

  async incidentById({ id }) {
    // Mirror incidentController.getIncidentById — raw SQL with JOINs
    const result = await sequelize.query(
      `SELECT i.*, c.name AS checkpoint_name,
              u1.name AS created_by_name, u2.name AS verified_by_name
       FROM incidents i
       LEFT JOIN checkpoints c  ON i.checkpoint_id = c.id
       LEFT JOIN users u1       ON i.created_by    = u1.id
       LEFT JOIN users u2       ON i.verified_by   = u2.id
       WHERE i.id = :id`,
      { replacements: { id }, type: sequelize.QueryTypes.SELECT }
    );

    if (!result[0]) throw new Error('NOT_FOUND: Incident not found');
    return result[0];
  },

  // ── Alerts ───────────────────────────────────────────────────────────────────

  async alerts(_args, context) {
    const user = requireAuth(context);
    requireRole(user, ['ADMIN', 'MODERATOR']);
    const alerts = await alertService.getAlerts();
    return alerts.map(a => a.toJSON ? a.toJSON() : a);
  },

  // ── Alert Subscriptions ───────────────────────────────────────────────────────

  async alertSubscriptions({ userId }, context) {
    const user = requireAuth(context);

    const authId = user.id || user.userId;

    // Citizens may only see their own subscriptions
    if (user.role === 'CITIZEN' && authId !== userId) {
      throw new Error('FORBIDDEN: Citizens can only view their own subscriptions');
    }

    // ADMIN + MODERATOR can view any userId (already authenticated above)
    if (!['ADMIN', 'MODERATOR', 'CITIZEN'].includes(user.role)) {
      throw new Error('FORBIDDEN: Insufficient role');
    }

    const subs = await subscriptionService.getUserSubscriptions(userId);
    return subs.map(s => s.toJSON ? s.toJSON() : s);
  },
};

module.exports = { resolvers };
