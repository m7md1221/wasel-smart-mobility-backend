const express = require("express");
const reportController = require("../controllers/reportController");
const authentication = require("../middlewares/auth");
const authorization = require("../middlewares/rolesAuthorize");
const validate = require("../middlewares/validateMiddleware");
const {
  submitReportValidator,
  voteValidator,
  moderationValidator,
  commentValidator,
} = require("../validators/reportValidator");

const router = express.Router();

// Moderation endpoints first (more specific) - MUST BE BEFORE /:id routes
router.get(
  "/moderation/queue",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN", "MODERATOR"),
  (req, res, next) => {
    // #swagger.tags = ['Reports']
    // #swagger.summary = 'Get moderation queue'
    // #swagger.description = 'Retrieves pending reports for moderation. Only Admin and Moderator can access this endpoint.'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.parameters['limit'] = {
          in: 'query',
          required: false,
          type: 'integer',
          description: 'Number of reports to return',
          example: 20
    } */

    /* #swagger.parameters['page'] = {
          in: 'query',
          required: false,
          type: 'integer',
          description: 'Page number for pagination',
          example: 0
    } */

    /* #swagger.responses[200] = {
          description: 'Moderation queue retrieved successfully',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Moderation queue retrieved successfully" },
                  data: { type: "object" }
                }
              },
              example: {
                success: true,
                message: "Moderation queue retrieved successfully",
                data: {
                reports: [
                  {
                    id: 101,
                    user_id: 12,
                    title: "Checkpoint Delay at Qalandia",
                    category: "DELAY",
                    status: "PENDING",
                    latitude: 31.8603,
                    longitude: 35.217
                  },
                  {
                    id: 102,
                    user_id: 15,
                    title: "Road Closure Near Ramallah",
                    category: "CLOSURE",
                    status: "PENDING",
                    latitude: 31.9056,
                    longitude: 35.2045
                  }
                ],
                total: 2,
                page: 0,
                limit: 20
              }
              }
            }
          }
    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - missing or invalid token',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Unauthorized - missing or invalid token" }
                }
              },
              example: {
                success: false,
                message: "Unauthorized - missing or invalid token"
              }
            }
          }
    } */

    /* #swagger.responses[403] = {
          description: 'Forbidden - only Admin or Moderator can access moderation queue',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Forbidden - only Admin or Moderator can access moderation queue" }
                }
              },
              example: {
                success: false,
                message: "Forbidden - only Admin or Moderator can access moderation queue"
              }
            }
          }
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while retrieving moderation queue',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Server error while retrieving moderation queue" }
                }
              },
              example: {
                success: false,
                message: "Server error while retrieving moderation queue"
              }
            }
          }
    } */
  return reportController.getModerationQueue(req, res, next);
  }
);

router.get(
  "/moderation/stats",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN", "MODERATOR"),
  (req, res, next) => {
// #swagger.tags = ['Reports']
    // #swagger.summary = 'Get moderation statistics'
    // #swagger.description = 'Retrieves moderation queue statistics. Only Admin and Moderator can access this endpoint.'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.responses[200] = {
          description: 'Moderation statistics retrieved successfully',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Moderation statistics retrieved successfully" },
                  data: { type: "object" }
                }
              },
              example: {
                success: true,
                message: "Moderation statistics retrieved successfully",
                data: {
                totalReports: 120,
                pendingReports: 18,
                resolvedReports: 90,
                rejectedReports: 12
              }
              }
            }
          }
    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - missing or invalid token',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Unauthorized - missing or invalid token" }
                }
              },
              example: {
                success: false,
                message: "Unauthorized - missing or invalid token"
              }
            }
          }
    } */

    /* #swagger.responses[403] = {
          description: 'Forbidden - only Admin or Moderator can access moderation statistics',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Forbidden - only Admin or Moderator can access moderation statistics" }
                }
              },
              example: {
                success: false,
                message: "Forbidden - only Admin or Moderator can access moderation statistics"
              }
            }
          }
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while retrieving moderation statistics',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Server error while retrieving moderation statistics" }
                }
              },
              example: {
                success: false,
                message: "Server error while retrieving moderation statistics"
              }
            }
          }
    } */

  return reportController.getModerationStats(req, res, next);
  }
);

router.get(
  "/moderation/logs",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN", "MODERATOR"),
  (req, res, next) => {
    // #swagger.tags = ['Reports']
    // #swagger.summary = 'Get moderation logs'
    // #swagger.description = 'Retrieves moderation logs. Only Admin and Moderator can access this endpoint.'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.parameters['event_type'] = {
          in: 'query',
          required: false,
          type: 'string',
          description: 'Filter logs by event type',
          example: 'REPORT_MODERATION'
    } */

    /* #swagger.parameters['action'] = {
          in: 'query',
          required: false,
          type: 'string',
          description: 'Filter logs by moderation action',
          example: 'APPROVE'
    } */

    /* #swagger.parameters['performed_by'] = {
          in: 'query',
          required: false,
          type: 'integer',
          description: 'Filter logs by moderator/admin user ID',
          example: 1
    } */

    /* #swagger.parameters['start_date'] = {
          in: 'query',
          required: false,
          type: 'string',
          description: 'Start date filter',
          example: '2026-04-01'
    } */

    /* #swagger.parameters['end_date'] = {
          in: 'query',
          required: false,
          type: 'string',
          description: 'End date filter',
          example: '2026-04-25'
    } */

    /* #swagger.parameters['limit'] = {
          in: 'query',
          required: false,
          type: 'integer',
          description: 'Number of logs to return',
          example: 50
    } */

    /* #swagger.parameters['page'] = {
          in: 'query',
          required: false,
          type: 'integer',
          description: 'Page number for pagination',
          example: 0
    } */

    /* #swagger.responses[200] = {
          description: 'Moderation logs retrieved successfully',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Moderation logs retrieved successfully" },
                  data: { type: "object" }
                }
              },
              example: {
                success: true,
                message: "Moderation logs retrieved successfully",
                data: {
                logs: [
                  {
                    id: 5001,
                    report_id: 101,
                    action: "APPROVED",
                    moderator_id: 2,
                    created_at: "2026-04-25T10:15:00.000Z"
                  }
                ],
                total: 1,
                page: 0,
                limit: 50
              }
              }
            }
          }
    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - missing or invalid token',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Unauthorized - missing or invalid token" }
                }
              },
              example: {
                success: false,
                message: "Unauthorized - missing or invalid token"
              }
            }
          }
    } */

    /* #swagger.responses[403] = {
          description: 'Forbidden - insufficient role permissions',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Forbidden - insufficient role permissions" }
                }
              },
              example: {
                success: false,
                message: "Forbidden - insufficient role permissions"
              }
            }
          }
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while retrieving moderation logs',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Server error while retrieving moderation logs" }
                }
              },
              example: {
                success: false,
                message: "Server error while retrieving moderation logs"
              }
            }
          }
    } */
  return reportController.getModerationLogs(req, res, next);
  }
);

router.get(
  "/moderation/duplicates",
  authentication.checkAuth,
  authorization.authorizeRole("ADMIN", "MODERATOR"),
  (req, res, next) => {
 // #swagger.tags = ['Reports']
    // #swagger.summary = 'Get duplicate reports'
    // #swagger.description = 'Retrieves potential duplicate reports. Only Admin and Moderator can access this endpoint.'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.responses[200] = {
          description: 'Duplicate reports retrieved successfully',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Duplicate reports retrieved successfully" },
                  data: { type: "object" }
                }
              },
              example: {
                success: true,
                message: "Duplicate reports retrieved successfully",
                data: {
                duplicate_groups: [
                  {
                    root_report_id: 101,
                    duplicate_ids: [113, 115],
                    category: "DELAY"
                  }
                ]
              }
              }
            }
          }
    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - missing or invalid token',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Unauthorized - missing or invalid token" }
                }
              },
              example: {
                success: false,
                message: "Unauthorized - missing or invalid token"
              }
            }
          }
    } */

    /* #swagger.responses[403] = {
          description: 'Forbidden - only Admin or Moderator can access duplicate reports',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Forbidden - only Admin or Moderator can access duplicate reports" }
                }
              },
              example: {
                success: false,
                message: "Forbidden - only Admin or Moderator can access duplicate reports"
              }
            }
          }
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while retrieving duplicate reports',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Server error while retrieving duplicate reports" }
                }
              },
              example: {
                success: false,
                message: "Server error while retrieving duplicate reports"
              }
            }
          }
    } */

  return reportController.getDuplicateReports(req, res, next);
  }
);

// Public endpoints
router.get("/", (req, res, next) => {
  // #swagger.tags = ['Reports']
  // #swagger.summary = 'Retrieve all reports'
  // #swagger.description = 'Retrieves all reports with info such as category, status, location radius, confidence, limit, and page.'

  /* #swagger.parameters['category'] = {
        in: 'query',
        required: false,
        type: 'string',
        description: 'Filter reports by category',
        example: 'CLOSURE'
  } */

  /* #swagger.parameters['status'] = {
        in: 'query',
        required: false,
        type: 'string',
        description: 'Filter reports by status',
        example: 'PENDING'
  } */

  /* #swagger.parameters['latitude'] = {
        in: 'query',
        required: false,
        type: 'number',
        description: 'Latitude for location-based filtering',
        example: 31.9522
  } */

  /* #swagger.parameters['longitude'] = {
        in: 'query',
        required: false,
        type: 'number',
        description: 'Longitude for location-based filtering',
        example: 35.2332
  } */

  /* #swagger.parameters['radius_km'] = {
        in: 'query',
        required: false,
        type: 'number',
        description: 'Radius in kilometers for location-based filtering',
        example: 5
  } */

  /* #swagger.parameters['min_confidence'] = {
        in: 'query',
        required: false,
        type: 'integer',
        description: 'Minimum confidence score',
        example: 50
  } */

  /* #swagger.parameters['limit'] = {
        in: 'query',
        required: false,
        type: 'integer',
        description: 'Number of reports to return',
        example: 20
  } */

  /* #swagger.parameters['page'] = {
        in: 'query',
        required: false,
        type: 'integer',
        description: 'Page number for pagination',
        example: 0
  } */

  /* #swagger.responses[200] = {
        description: 'Reports retrieved successfully',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: true },
                message: { type: "string", example: "Reports retrieved successfully" },
                data: { type: "object" }
              }
            },
            example: {
              success: true,
              message: "Reports retrieved successfully",
              data: {
              reports: [
                {
                  id: 101,
                  user_id: 12,
                  title: "Checkpoint Delay at Qalandia",
                  category: "DELAY",
                  status: "PENDING",
                  latitude: 31.8603,
                  longitude: 35.217
                },
                {
                  id: 102,
                  user_id: 15,
                  title: "Road Closure Near Ramallah",
                  category: "CLOSURE",
                  status: "RESOLVED",
                  latitude: 31.9056,
                  longitude: 35.2045
                }
              ],
              total: 2,
              page: 0,
              limit: 20
            }
            }
          }
        }
  } */

  /* #swagger.responses[500] = {
        description: 'Server error while retrieving reports',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: false },
                message: { type: "string", example: "Server error while retrieving reports" }
              }
            },
            example: {
              success: false,
              message: "Server error while retrieving reports"
            }
          }
        }
  } */
  return reportController.getReports(req, res, next);
});

router.get("/stats", (req, res, next) => {
  // #swagger.tags = ['Reports']
  // #swagger.summary = 'Get report statistics'
  // #swagger.description = 'Retrieves report statistics, optionally filtered by category.'

  /* #swagger.parameters['category'] = {
        in: 'query',
        required: false,
        type: 'string',
        description: 'Filter statistics by report category',
        example: 'CLOSURE'
  } */

  /* #swagger.responses[200] = {
        description: 'Report statistics retrieved successfully',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: true },
                message: { type: "string", example: "Report statistics retrieved successfully" },
                data: { type: "object" }
              }
            },
            example: {
              success: true,
              message: "Report statistics retrieved successfully",
              data: {
              totalReports: 120,
              byCategory: {
                DELAY: 50,
                CLOSURE: 40,
                INCIDENT: 30
              },
              byStatus: {
                PENDING: 18,
                RESOLVED: 90,
                REJECTED: 12
              }
            }
            }
          }
        }
  } */

  /* #swagger.responses[500] = {
        description: 'Server error while retrieving report statistics',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: false },
                message: { type: "string", example: "Server error while retrieving report statistics" }
              }
            },
            example: {
              success: false,
              message: "Server error while retrieving report statistics"
            }
          }
        }
  } */
  return reportController.getReportStats(req, res, next);
});

// Single report endpoints (AFTER more specific routes)
router.get("/:id", (req, res, next) => {
 // #swagger.tags = ['Reports']
  // #swagger.summary = 'Get report by ID'
  // #swagger.description = 'Retrieves a single report by its ID.'

  /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        description: 'Report ID',
        example: 1
  } */

  /* #swagger.responses[200] = {
        description: 'Report retrieved successfully',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: true },
                message: { type: "string", example: "Report retrieved successfully" },
                data: { type: "object" }
              }
            },
            example: {
              success: true,
              message: "Report retrieved successfully",
              data: {
                id: 101,
                user_id: 12,
                title: "Checkpoint Delay at Qalandia",
                category: "DELAY",
                description: "Heavy traffic and long waiting time.",
                status: "PENDING",
                latitude: 31.8603,
                longitude: 35.217,
                confidence_score: 82
              }
            }
          }
        }
  } */

  /* #swagger.responses[404] = {
        description: 'Report not found',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: false },
                message: { type: "string", example: "Report not found" }
              }
            },
            example: {
              success: false,
              message: "Report not found"
            }
          }
        }
  } */

  /* #swagger.responses[500] = {
        description: 'Server error while retrieving report',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: false },
                message: { type: "string", example: "Server error while retrieving report" }
              }
            },
            example: {
              success: false,
              message: "Server error while retrieving report"
            }
          }
        }
  } */
  return reportController.getReportById(req, res, next);
});

router.get("/:id/audit", (req, res, next) => {
 // #swagger.tags = ['Reports']
  // #swagger.summary = 'Get report audit trail'
  // #swagger.description = 'Retrieves the audit trail for a specific report.'

  /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        description: 'Report ID',
        example: 1
  } */

  /* #swagger.parameters['limit'] = {
        in: 'query',
        required: false,
        type: 'integer',
        description: 'Number of audit records to return',
        example: 50
  } */

  /* #swagger.responses[200] = {
        description: 'Audit trail retrieved successfully',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: true },
                message: { type: "string", example: "Audit trail retrieved successfully" },
                data: { type: "object" }
              }
            },
            example: {
              success: true,
              message: "Audit trail retrieved successfully",
              data: {
              auditTrail: [
                {
                  id: 9001,
                  report_id: 101,
                  action: "CREATED",
                  actor_id: 12,
                  created_at: "2026-04-25T09:00:00.000Z"
                },
                {
                  id: 9002,
                  report_id: 101,
                  action: "APPROVED",
                  actor_id: 2,
                  created_at: "2026-04-25T10:15:00.000Z"
                }
              ]
            }
            }
          }
        }
  } */

  /* #swagger.responses[500] = {
        description: 'Server error while retrieving audit trail',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: false },
                message: { type: "string", example: "Server error while retrieving audit trail" }
              }
            },
            example: {
              success: false,
              message: "Server error while retrieving audit trail"
            }
          }
        }
  } */

  return reportController.getAuditTrail(req, res, next);
});

router.get("/:id/comments", (req, res, next) => {
  // #swagger.tags = ['Reports']
  // #swagger.summary = 'Get report comments'
  // #swagger.description = 'Retrieves comments for a specific report.'

  /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        description: 'Report ID',
        example: 1
  } */

  /* #swagger.parameters['limit'] = {
        in: 'query',
        required: false,
        type: 'integer',
        description: 'Number of comments to return',
        example: 50
  } */

  /* #swagger.parameters['page'] = {
        in: 'query',
        required: false,
        type: 'integer',
        description: 'Page number for pagination',
        example: 0
  } */

  /* #swagger.responses[200] = {
        description: 'Comments retrieved successfully',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: true },
                message: { type: "string", example: "Comments retrieved successfully" },
                data: { type: "object" }
              }
            },
            example: {
              success: true,
              message: "Comments retrieved successfully",
              data: {
              comments: [
                {
                  id: 301,
                  report_id: 101,
                  user_id: 22,
                  comment: "Traffic is moving slowly but still blocked.",
                  created_at: "2026-04-25T10:20:00.000Z"
                }
              ],
              total: 1,
              page: 0,
              limit: 50
            }
            }
          }
        }
  } */

  /* #swagger.responses[404] = {
        description: 'Report or comments not found',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: false },
                message: { type: "string", example: "Report or comments not found" }
              }
            },
            example: {
              success: false,
              message: "Report or comments not found"
            }
          }
        }
  } */

  /* #swagger.responses[500] = {
        description: 'Server error while retrieving comments',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: false },
                message: { type: "string", example: "Server error while retrieving comments" }
              }
            },
            example: {
              success: false,
              message: "Server error while retrieving comments"
            }
          }
        }
  } */
  return reportController.getComments(req, res, next);
});

// Authenticated user endpoints
router.post(
  "/",
  authentication.checkAuth,
  validate(submitReportValidator),
  (req, res, next) => {
  // #swagger.tags = ['Reports']
    // #swagger.summary = 'Submit a new report'
    // #swagger.description = 'Allows an authenticated Citizen or Admin to submit a new road/checkpoint-related report.'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.requestBody = {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["category", "description", "latitude", "longitude"],
                properties: {
                  category: {
                    type: "string",
                    example: "CLOSURE"
                  },
                  description: {
                    type: "string",
                    example: "Checkpoint is closed and cars are waiting."
                  },
                  latitude: {
                    type: "number",
                    example: 31.9522
                  },
                  longitude: {
                    type: "number",
                    example: 35.2332
                  },
                  checkpoint_id: {
                    type: "integer",
                    example: 1
                  }
                }
              }
            }
          }
    } */

    /* #swagger.responses[201] = {
          description: 'Report submitted successfully',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Report submitted successfully" },
                  data: { type: "object" }
                }
              },
              example: {
                success: true,
                message: "Report submitted successfully",
                data: {
                id: 101,
                user_id: 12,
                title: "Checkpoint Delay at Qalandia",
                category: "DELAY",
                description: "Heavy traffic and long waiting time.",
                status: "PENDING",
                latitude: 31.8603,
                longitude: 35.217,
                confidence_score: 82
              }
              }
            }
          }
    } */

    /* #swagger.responses[200] = {
          description: 'Report submitted successfully, but similar reports exist nearby',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Report submitted successfully, but similar reports exist nearby" },
                  data: { type: "object" }
                }
              },
              example: {
                success: true,
                message: "Report submitted successfully, but similar reports exist nearby",
                data: {
                report: {
                  id: 120,
                  user_id: 12,
                  title: "Checkpoint Delay at Qalandia",
                  category: "DELAY",
                  status: "PENDING",
                  latitude: 31.8603,
                  longitude: 35.217
                },
                similar_reports: [
                  { id: 101, title: "Checkpoint Delay at Qalandia" },
                  { id: 113, title: "Long Queue at Qalandia" }
                ]
              }
              }
            }
          }
    } */

    /* #swagger.responses[400] = {
          description: 'Invalid report data',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Invalid report data" }
                }
              },
              example: {
                success: false,
                message: "Invalid report data"
              }
            }
          }
    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - user not authenticated',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Unauthorized - user not authenticated" }
                }
              },
              example: {
                success: false,
                message: "Unauthorized - user not authenticated"
              }
            }
          }
    } */

    /* #swagger.responses[403] = {
          description: 'Forbidden - only Citizen or Admin can submit reports',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Forbidden - only Citizen or Admin can submit reports" }
                }
              },
              example: {
                success: false,
                message: "Forbidden - only Citizen or Admin can submit reports"
              }
            }
          }
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while submitting report',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Server error while submitting report" }
                }
              },
              example: {
                success: false,
                message: "Server error while submitting report"
              }
            }
          }
    } */

    return reportController.submitReport(req, res, next);
  }
);

router.post(
  "/:id/vote",
  authentication.checkAuth,
  validate(voteValidator),
  (req, res, next) => {
     // #swagger.tags = ['Reports']
    // #swagger.summary = 'Vote on a report'
    // #swagger.description = 'Allows an authenticated user to vote on a specific report.'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          type: 'integer',
          description: 'Report ID',
          example: 1
    } */

    /* #swagger.requestBody = {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["vote"],
                properties: {
                  vote: {
                    type: "string",
                    example: "UPVOTE"
                  }
                }
              }
            }
          }
    } */

    /* #swagger.responses[200] = {
          description: 'Vote recorded successfully',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Vote recorded successfully" },
                  data: { type: "object" }
                }
              },
              example: {
                success: true,
                message: "Vote recorded successfully",
                data: {
                report: {
                  id: 101,
                  upvotes: 17,
                  downvotes: 2,
                  score: 15
                },
                user_vote: "UPVOTE"
              }
              }
            }
          }
    } */

    /* #swagger.responses[400] = {
          description: 'Invalid vote value',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Invalid vote value" }
                }
              },
              example: {
                success: false,
                message: "Invalid vote value"
              }
            }
          }
    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - user not authenticated',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Unauthorized - user not authenticated" }
                }
              },
              example: {
                success: false,
                message: "Unauthorized - user not authenticated"
              }
            }
          }
    } */

    /* #swagger.responses[404] = {
          description: 'Report not found',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Report not found" }
                }
              },
              example: {
                success: false,
                message: "Report not found"
              }
            }
          }
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while voting on report',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Server error while voting on report" }
                }
              },
              example: {
                success: false,
                message: "Server error while voting on report"
              }
            }
          }
    } */

    return reportController.voteOnReport(req, res, next);
  }
);

router.post(
  "/:id/comments",
  authentication.checkAuth,
  validate(commentValidator),
  (req, res, next) => {
 // #swagger.tags = ['Reports']
    // #swagger.summary = 'Add comment to report'
    // #swagger.description = 'Allows an authenticated user to add a comment to a specific report.'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          type: 'integer',
          description: 'Report ID',
          example: 1
    } */

    /* #swagger.requestBody = {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["comment"],
                properties: {
                  comment: {
                    type: "string",
                    example: "I passed from there 10 minutes ago and it is still closed."
                  }
                }
              }
            }
          }
    } */

    /* #swagger.responses[201] = {
          description: 'Comment added successfully',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Comment added successfully" },
                  data: { type: "object" }
                }
              },
              example: {
                success: true,
                message: "Comment added successfully",
                data: {
                id: 301,
                report_id: 101,
                user_id: 22,
                comment: "Traffic is moving slowly but still blocked.",
                created_at: "2026-04-25T10:20:00.000Z"
              }
              }
            }
          }
    } */

    /* #swagger.responses[400] = {
          description: 'Invalid comment data',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Invalid comment data" }
                }
              },
              example: {
                success: false,
                message: "Invalid comment data"
              }
            }
          }
    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - user not authenticated',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Unauthorized - user not authenticated" }
                }
              },
              example: {
                success: false,
                message: "Unauthorized - user not authenticated"
              }
            }
          }
    } */

    /* #swagger.responses[404] = {
          description: 'Report not found',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Report not found" }
                }
              },
              example: {
                success: false,
                message: "Report not found"
              }
            }
          }
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while adding comment',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Server error while adding comment" }
                }
              },
              example: {
                success: false,
                message: "Server error while adding comment"
              }
            }
          }
    } */
    return reportController.addComment(req, res, next);
  }
);

// Moderation endpoints (moderator/admin only)
router.post(
  "/:id/moderate",
  authentication.checkAuth,authorization.authorizeRole("ADMIN", "MODERATOR"),
  validate(moderationValidator),
  (req, res, next) => {
 // #swagger.tags = ['Reports']
    // #swagger.summary = 'Moderate a report'
    // #swagger.description = 'Allows Admin or Moderator to approve, reject, or otherwise moderate a specific report.'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          type: 'integer',
          description: 'Report ID',
          example: 1
    } */

    /* #swagger.requestBody = {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["action"],
                properties: {
                  action: {
                    type: "string",
                    example: "APPROVE"
                  },
                  reason: {
                    type: "string",
                    example: "Report verified by moderator."
                  }
                }
              }
            }
          }
    } */

    /* #swagger.responses[200] = {
          description: 'Report moderated successfully',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Report moderated successfully" },
                  data: { type: "object" }
                }
              },
              example: {
                success: true,
                message: "Report moderated successfully",
                data: {
                id: 101,
                status: "RESOLVED",
                moderated_by: 2,
                moderation_reason: "Verified by moderator",
                updated_at: "2026-04-25T10:15:00.000Z"
              }
              }
            }
          }
    } */

    /* #swagger.responses[400] = {
          description: 'Invalid moderation action',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Invalid moderation action" }
                }
              },
              example: {
                success: false,
                message: "Invalid moderation action"
              }
            }
          }
    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - user not authenticated',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Unauthorized - user not authenticated" }
                }
              },
              example: {
                success: false,
                message: "Unauthorized - user not authenticated"
              }
            }
          }
    } */

    /* #swagger.responses[403] = {
          description: 'Forbidden - only Admin or Moderator can moderate reports',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Forbidden - only Admin or Moderator can moderate reports" }
                }
              },
              example: {
                success: false,
                message: "Forbidden - only Admin or Moderator can moderate reports"
              }
            }
          }
    } */

    /* #swagger.responses[404] = {
          description: 'Report not found',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Report not found" }
                }
              },
              example: {
                success: false,
                message: "Report not found"
              }
            }
          }
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while moderating report',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Server error while moderating report" }
                }
              },
              example: {
                success: false,
                message: "Server error while moderating report"
              }
            }
          }
    } */
    return reportController.moderateReport(req, res, next);
  }
);

router.delete("/:id", authentication.checkAuth,authorization.authorizeRole("ADMIN", "MODERATOR"), (req, res, next) => {
// #swagger.tags = ['Reports']
    // #swagger.summary = 'Delete a report'
    // #swagger.description = 'Deletes a specific report. Only Admin and Moderator can access this endpoint.'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          type: 'integer',
          description: 'Report ID',
          example: 1
    } */

    /* #swagger.responses[200] = {
          description: 'Report deleted successfully',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Report deleted successfully" },
                  data: { type: "object" }
                }
              },
              example: {
                success: true,
                message: "Report deleted successfully",
                data: {
                deletedReportId: 101
              }
              }
            }
          }
    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - user not authenticated',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Unauthorized - user not authenticated" }
                }
              },
              example: {
                success: false,
                message: "Unauthorized - user not authenticated"
              }
            }
          }
    } */

    /* #swagger.responses[403] = {
          description: 'Forbidden - only Admin or Moderator can delete reports',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Forbidden - only Admin or Moderator can delete reports" }
                }
              },
              example: {
                success: false,
                message: "Forbidden - only Admin or Moderator can delete reports"
              }
            }
          }
    } */

    /* #swagger.responses[404] = {
          description: 'Report not found',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Report not found" }
                }
              },
              example: {
                success: false,
                message: "Report not found"
              }
            }
          }
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while deleting report',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Server error while deleting report" }
                }
              },
              example: {
                success: false,
                message: "Server error while deleting report"
              }
            }
          }
    } */

  return reportController.deleteReport(req, res, next);
});

// Delete comment endpoint
router.delete(
  "/:id/comments/:commentId",
  authentication.checkAuth,
  (req, res, next) => {
  // #swagger.tags = ['Reports']
    // #swagger.summary = 'Delete a comment'
    // #swagger.description = 'Deletes a specific comment from a report. The user must be authenticated.'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          type: 'integer',
          description: 'Report ID',
          example: 1
    } */

    /* #swagger.parameters['commentId'] = {
          in: 'path',
          required: true,
          type: 'integer',
          description: 'Comment ID',
          example: 5
    } */

    /* #swagger.responses[200] = {
          description: 'Comment deleted successfully',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Comment deleted successfully" },
                  data: { type: "object" }
                }
              },
              example: {
                success: true,
                message: "Comment deleted successfully",
                data: {
                deletedCommentId: 301,
                reportId: 101
              }
              }
            }
          }
    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - user not authenticated',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Unauthorized - user not authenticated" }
                }
              },
              example: {
                success: false,
                message: "Unauthorized - user not authenticated"
              }
            }
          }
    } */

    /* #swagger.responses[403] = {
          description: 'Forbidden - user cannot delete this comment',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Forbidden - user cannot delete this comment" }
                }
              },
              example: {
                success: false,
                message: "Forbidden - user cannot delete this comment"
              }
            }
          }
    } */

    /* #swagger.responses[404] = {
          description: 'Comment not found',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Comment not found" }
                }
              },
              example: {
                success: false,
                message: "Comment not found"
              }
            }
          }
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while deleting comment',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Server error while deleting comment" }
                }
              },
              example: {
                success: false,
                message: "Server error while deleting comment"
              }
            }
          }
    } */
    return reportController.deleteComment(req, res, next);
  }
);

module.exports = router;
