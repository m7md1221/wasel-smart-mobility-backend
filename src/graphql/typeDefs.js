'use strict';

const { buildSchema } = require('graphql');

/**
 * Wasel Smart Mobility – GraphQL Schema (read-only)
 *
 * Conventions that match the project:
 *  - All IDs are Int (Sequelize INTEGER PK)
 *  - Timestamps are String (ISO-8601) because the DB uses no timezone offset
 *  - Nullable fields are typed as their base type (no "!" suffix)
 *  - Pagination follows the same shape already used in REST responses
 *  - Role-based access is enforced in resolvers, NOT in the schema
 */

const typeDefs = buildSchema(`
  # ─── Enums ──────────────────────────────────────────────────────────────────

  """User role within the system."""
  enum UserRole {
    ADMIN
    CITIZEN
    MODERATOR
  }

  """Possible statuses for a checkpoint."""
  enum CheckpointStatus {
    active
    closed
    restricted
  }

  """Possible statuses for an incident."""
  enum IncidentStatus {
    open
    verified
    closed
  }

  """Possible statuses for a report."""
  enum ReportStatus {
    pending
    approved
    rejected
    flagged
    hidden
  }

  """Direction used in list ordering."""
  enum SortOrder {
    ASC
    DESC
  }

  # ─── Shared types ────────────────────────────────────────────────────────────

  """Standard pagination metadata returned alongside list results."""
  type PaginationMeta {
    total: Int!
    limit: Int!
    offset: Int!
    pages: Int!
  }

  # ─── Health ──────────────────────────────────────────────────────────────────

  """Simple health-check response."""
  type HealthStatus {
    status: String!
    apiVersion: String!
  }

  # ─── Users ───────────────────────────────────────────────────────────────────

  """
  Public user profile – password is NEVER returned.
  Sensitive fields (is_authorized, confidence_score) are included because
  admin/moderator resolvers already gate access by role.
  """
  type User {
    id: Int!
    name: String
    email: String
    role: UserRole
    is_active: Boolean
    is_authorized: Boolean
    confidence_score: Int
    created_at: String
    updated_at: String
  }

  type UsersResult {
    data: [User!]!
    pagination: PaginationMeta!
  }

  # ─── Reports ─────────────────────────────────────────────────────────────────

  """A community-submitted traffic/road report."""
  type Report {
    id: Int!
    user_id: Int
    title: String
    latitude: Float
    longitude: Float
    category: String
    description: String
    status: ReportStatus
    confidence_score: Int
    duplicate_of: Int
    created_at: String
    updated_at: String
    """Vote statistics; populated only by reportById."""
    votes: VoteStats
  }

  type VoteStats {
    upvotes: Int!
    downvotes: Int!
    total: Int!
  }

  type ReportsResult {
    data: [Report!]!
    pagination: PaginationMeta!
  }

  """Per-category count used in report statistics."""
  type CategoryCount {
    category: String!
    count: Int!
  }

  """Overall report statistics."""
  type ReportStats {
    total: Int!
    approved: Int!
    pending: Int!
    rejected: Int!
    by_category: [CategoryCount!]!
  }

  """A single comment on a report."""
  type ReportComment {
    id: Int!
    report_id: Int
    user_id: Int
    comment: String
    created_at: String
    """Author basic info (populated via eager-load)."""
    author: CommentAuthor
  }

  type CommentAuthor {
    id: Int!
    name: String
    email: String
  }

  type ReportCommentsResult {
    data: [ReportComment!]!
    pagination: PaginationMeta!
  }

  """A single entry in the moderation audit trail."""
  type AuditEntry {
    id: Int!
    action: String
    reason: String
    performed_by: Int
    timestamp: String
  }

  """Stats returned by the moderation queue statistics endpoint."""
  type ModerationStats {
    pending_review: Int!
    flagged_for_review: Int!
    approved: Int!
    rejected: Int!
    total_in_queue: Int!
  }

  """A moderation log entry."""
  type ModerationLog {
    id: Int!
    event_type: String
    event_id: Int
    performed_by: Int
    action: String
    reason: String
    created_at: String
  }

  type ModerationLogsResult {
    data: [ModerationLog!]!
    pagination: PaginationMeta!
  }

  type ModerationQueueResult {
    data: [Report!]!
    pagination: PaginationMeta!
  }

  # ─── Checkpoints ─────────────────────────────────────────────────────────────

  """A physical road checkpoint (military/police etc.)."""
  type Checkpoint {
    id: Int!
    name: String
    city: String
    latitude: Float
    longitude: Float
    current_status: CheckpointStatus
    created_at: String
    updated_at: String
  }

  type CheckpointsResult {
    data: [Checkpoint!]!
    pagination: PaginationMeta!
  }

  """One row from the checkpoint status history table."""
  type CheckpointHistoryEntry {
    id: Int!
    checkpoint_id: Int
    status: String
    changed_at: String
    changed_by: Int
    changed_by_name: String
  }

  # ─── Incidents ───────────────────────────────────────────────────────────────

  """A traffic/security incident on the road network."""
  type Incident {
    id: Int!
    title: String
    category: String
    description: String
    severity: String
    status: IncidentStatus
    latitude: Float
    longitude: Float
    checkpoint_id: Int
    created_by: Int
    verified_by: Int
    created_at: String
    updated_at: String
    closed_at: String
    """Enriched fields returned by getIncidentById raw SQL join."""
    checkpoint_name: String
    created_by_name: String
    verified_by_name: String
  }

  type IncidentsResult {
    data: [Incident!]!
    pagination: PaginationMeta!
  }

  # ─── Alerts ──────────────────────────────────────────────────────────────────

  """A push-alert generated when an incident is verified."""
  type Alert {
    id: Int!
    incident_id: Int
    category: String
    message: String
    created_at: String
  }

  # ─── Alert Subscriptions ─────────────────────────────────────────────────────

  """A user's subscription to receive alerts for a location + category."""
  type AlertSubscription {
    id: Int!
    user_id: Int
    latitude: Float
    longitude: Float
    radius_km: Int
    category: String
    created_at: String
  }

  # ─── Query root ──────────────────────────────────────────────────────────────

  type Query {
    # Health
    """Check that the API is alive (no auth required)."""
    health: HealthStatus!

    # Users  (ADMIN + MODERATOR only, except myProfile)
    """Return the profile of the currently authenticated user."""
    myProfile: User!

    """
    Return a specific user by ID.
    Requires: ADMIN or MODERATOR role.
    """
    user(id: Int!): User

    """
    Return a paginated list of all users.
    Requires: ADMIN or MODERATOR role.
    """
    users(page: Int, limit: Int): UsersResult!

    # Reports  (most are public)
    """Return a paginated, filtered list of reports (public)."""
    reports(
      category: String
      status: String
      latitude: Float
      longitude: Float
      radius_km: Float
      min_confidence: Int
      page: Int
      limit: Int
    ): ReportsResult!

    """Return aggregate report statistics (public)."""
    reportStats(category: String): ReportStats!

    """Return a single report by ID, including vote counts (public)."""
    reportById(id: Int!): Report

    """Return paginated comments for a report (public)."""
    reportComments(reportId: Int!, page: Int, limit: Int): ReportCommentsResult!

    """Return the moderation audit trail for a report (public)."""
    reportAuditTrail(reportId: Int!, limit: Int): [AuditEntry!]!

    # Moderation views  (ADMIN + MODERATOR only)
    """
    Return the moderation queue (pending + flagged reports).
    Requires: ADMIN or MODERATOR role.
    """
    moderationQueue(page: Int, limit: Int): ModerationQueueResult!

    """
    Return moderation queue statistics.
    Requires: ADMIN or MODERATOR role.
    """
    moderationStats: ModerationStats!

    """
    Return moderation logs with optional filters.
    Requires: ADMIN role only.
    """
    moderationLogs(
      event_type: String
      action: String
      performed_by: Int
      start_date: String
      end_date: String
      page: Int
      limit: Int
    ): ModerationLogsResult!

    """
    Return reports that are flagged as duplicates.
    Requires: ADMIN or MODERATOR role.
    """
    duplicateReports: [Report!]!

    # Checkpoints  (public)
    """Return a paginated, filterable list of checkpoints (public)."""
    checkpoints(
      status: String
      search: String
      sortBy: String
      order: SortOrder
      page: Int
      limit: Int
    ): CheckpointsResult!

    """Return a single checkpoint by ID (public)."""
    checkpointById(id: Int!): Checkpoint

    """Return the status-change history of a checkpoint (public)."""
    checkpointHistory(id: Int!): [CheckpointHistoryEntry!]!

    # Incidents  (public)
    """Return a paginated, filterable list of incidents (public)."""
    incidents(
      category: String
      severity: String
      status: String
      checkpoint_id: Int
      sortBy: String
      order: SortOrder
      page: Int
      limit: Int
    ): IncidentsResult!

    """Return a single incident by ID, with joined names (public)."""
    incidentById(id: Int!): Incident

    # Alerts  (ADMIN + MODERATOR only)
    """
    Return all alerts.
    Requires: ADMIN or MODERATOR role.
    """
    alerts: [Alert!]!

    # Alert subscriptions  (ADMIN, MODERATOR, or own subscriptions)
    """
    Return alert subscriptions for a user.
    ADMIN and MODERATOR may query any userId.
    CITIZEN may only query their own userId.
    """
    alertSubscriptions(userId: Int!): [AlertSubscription!]!
  }
`);

module.exports = { typeDefs };
