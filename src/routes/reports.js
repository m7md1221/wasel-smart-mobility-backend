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
          schema: {
           message: "Moderation queue retrieved",
            reports: [
              {
                id: '123',
                contentId: 'abc',
                contentType: 'post',
                reason: 'Inappropriate content',
                status: 'pending',
                createdAt: '2024-01-01T00:00:00Z',
                reporter: {
                  id: 'user123',
                  username: 'reporter1'
                }
              }
            ],
            total: 1,
            page: 0,
            limit: 20
          }

    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - missing or invalid token'
    } */

    /* #swagger.responses[403] = {
          description: 'Forbidden - only Admin or Moderator can access moderation queue',
          schema:{
                  message: "Only moderators can access the moderation queue"}
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while retrieving moderation queue'
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
          schema: {
            message: "Moderation statistics retrieved",
            stats: {
              totalReports: 100,
              pendingReports: 20,
              resolvedReports: 70,
              rejectedReports: 10,
              reportsByReason: {
                "Inappropriate content": 50,
                "Spam": 30,
                "Harassment": 20
              }
            }
          } 

    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - missing or invalid token',
          schema: {
                  message: "Unauthorized"}

    } */

    /* #swagger.responses[403] = {
          description: 'Forbidden - only Admin or Moderator can access moderation statistics',
          schema: {
                  message: "Forbidden"}
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while retrieving moderation statistics',
          schema: {
                  message: "Server error"}
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
          schema: {
            message: "Moderation logs retrieved",
            logs: [
              {
                id: 'log123',
                eventType: 'REPORT_MODERATION',
                action: 'APPROVE',
                reportId: 'report123',
                contentId: 'content123',
                contentType: 'post',
                performedBy: {
                  id: 'mod123',
                  username: 'moderator1'
                },
                timestamp: '2024-01-01T00:00:00Z',
                details: {
                  reason: 'Inappropriate content',
                  comment: 'This post violates our guidelines'
                } 
              }
            ],
            total: 1,
            page: 0,
            limit: 50
          }
            
    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - missing or invalid token',
          schema: {
                  message: "Unauthorized"}
    } */

    /* #swagger.responses[403] = {
          description: 'Forbidden - insufficient role permissions',
          schema: {
                  message: "Forbidden"}
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while retrieving moderation logs',
          schema: {
                  message: "Server error"}  
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
          schema: {
            message: "Duplicate reports retrieved",
            duplicates: [
              {
                contentId: 'content123',
                contentType: 'post',
                reports: [  
                  {   
                    id: 'report123',
                    reason: 'Inappropriate content',
                    status: 'pending',  
                    createdAt: '2024-01-01T00:00:00Z',
                    reporter: {
                      id: 'user123',
                      username: 'reporter1'
                    }
                  },
                  {
                    id: 'report124',
                    reason: 'Inappropriate content',
                    status: 'pending',  
                    createdAt: '2024-01-02T00:00:00Z',  
                    reporter: {
                      id: 'user124',
                      username: 'reporter2'
                    }
                  }
                ]
              }
            ]
          }
    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - missing or invalid token',
          schema: {
                  message: "Unauthorized"}
    } */

    /* #swagger.responses[403] = {
          description: 'Forbidden - only Admin or Moderator can access duplicate reports',
          schema: {
                  message: "Forbidden"}
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while retrieving duplicate reports',
          schema: {
                  message: "Server error"}
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
        schema: {
          message: "Reports retrieved",
          reports: [
            {
              id: '123',
              contentId: 'abc',
              contentType: 'post',  
              reason: 'Inappropriate content',  
              status: 'pending',
              createdAt: '2024-01-01T00:00:00Z',
              reporter: {
                id: 'user123',

                username: 'reporter1' 
              }
            }
          ],  
          total: 1,
          page: 0,
          limit: 20
        }
  } */

  /* #swagger.responses[500] = {
        description: 'Server error while retrieving reports',
        schema: {
                message: "Server error"}
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
        schema: {
          message: "Report statistics retrieved",
          stats: {
            totalReports: 100,  
            reportsByCategory: {
              "CLOSURE": 50,
              "ACCIDENT": 30, 
              "HAZARD": 20
            },
            reportsByStatus: {
              "PENDING": 20,
              "RESOLVED": 70,
              "REJECTED": 10
            }
          }
        }

  } */

  /* #swagger.responses[500] = {
        description: 'Server error while retrieving report statistics',
        schema: {
                message: "Server error"}
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
        schema: {
          message: "Report retrieved",
          report: {
            id: '123',  
            contentId: 'abc',
            contentType: 'post',
            reason: 'Inappropriate content',
            status: 'pending',  
            createdAt: '2024-01-01T
            reporter: {
              id: 'user123',
              username: 'reporter1' 
            }
          }
        }
  } */

  /* #swagger.responses[404] = {
        description: 'Report not found',
        schema: {
                message: "Report not found"}
  } */

  /* #swagger.responses[500] = {
        description: 'Server error while retrieving report',
        schema: {
                message: "Server error"}
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
        schema: {

          message: "Audit trail retrieved",
          auditTrail: [
            {
              id: 'audit123', 
              eventType: 'REPORT_CREATED',
              performedBy: {
                id: 'user123',  
                username: 'reporter1'
              },    
              timestamp: '2024-01-01T00:00:00Z',
              details: {
                reason: 'Inappropriate content' 
              }
            },
            {
              id: 'audit124', 
              eventType: 'REPORT_MODERATED',
              performedBy: {  
                id: 'mod123', 
                username: 'moderator1'    
              },      
              timestamp: '2024-01-02T00:00:00Z',
              details: {
                action: 'APPROVE',
                comment: 'This report 
violates our guidelines'  
              }
            }
          ]
        }
  } */

  /* #swagger.responses[500] = {
        description: 'Server error while retrieving audit trail',
        schema: {
                message: "Server error"}
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
        schema: { 
          message: "Comments retrieved",
          comments: [
            {
              id: 'comment123',
              content: 'This is a comment on the report.',

            } ],
          total: 1,
          page: 0,
          limit: 50
        }
  } */

  /* #swagger.responses[404] = {
        description: 'Report or comments not found',
        schema: {
                message: "Report or comments not found"}
  } */

  /* #swagger.responses[500] = {
        description: 'Server error while retrieving comments',
        schema: {
                message: "Server error"}
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
          schema: {
            message: "Report submitted",
            report: {
              id: '123',
              contentId: 'abc',
              contentType: 'post',
              reason: 'Inappropriate content',
              status: 'pending',
              createdAt: '2024-01-01T00:00:00Z',
              reporter: {
                id: 'user123',
                username: 'reporter1'
              }
            }
          } 
    } */

    /* #swagger.responses[200] = {
          description: 'Report submitted successfully, but similar reports exist nearby',
          schema: {
            message: "Report submitted, but similar reports exist nearby",
            report: {
              id: '123',
              contentId: 'abc',
              contentType: 'post',
              reason: 'Inappropriate content',
              status: 'pending',
              createdAt: '2024-01-01T00:00:00Z',  
              reporter: {
                id: 'user123',
                username: 'reporter1'
              }
            }
          } 
    } */

    /* #swagger.responses[400] = {
          description: 'Invalid report data',
          schema: {
                  message: "Invalid report data"}

    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - user not authenticated',
          schema: {
                  message: "Unauthorized"}
    } */

    /* #swagger.responses[403] = {
          description: 'Forbidden - only Citizen or Admin can submit reports',
          schema: {
                  message: "Forbidden"}
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while submitting report',
          schema: {
                  message: "Server error"}
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
          schema: {
            message: "Vote recorded",
            report: {
              id: '123',
              contentId: 'abc',
              contentType: 'post',
              reason: 'Inappropriate content',
              status: 'pending',
              createdAt: '2024-01-01T00:00:00Z',
              reporter: {
                id: 'user123',
                username: 'reporter1'
              },
              votes: {
                upvotes: 10,  
                downvotes: 2
              }
            }
          }

    } */

    /* #swagger.responses[400] = {
          description: 'Invalid vote value',
          schema: {
                  message: "Invalid vote value"}
    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - user not authenticated',
          schema: {
                  message: "Unauthorized"}
    } */

    /* #swagger.responses[404] = {
          description: 'Report not found',
          schema: {
                  message: "Report not found"}
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while voting on report',
          schema: {
                  message: "Server error"}
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
          schema: {
            message: "Comment added",
            comment: {
              id: 'comment123',
              content: 'This is a comment on the report.',
              createdAt: '2024-01-01T00:00:00Z',
              commenter: {
                id: 'user123',
                username: 'commenter1'
              }
            }
         }

    } */

    /* #swagger.responses[400] = {
          description: 'Invalid comment data',
          schema: {
                  message: "Invalid comment data"}
    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - user not authenticated',
          schema: {
                  message: "Unauthorized"}
    } */

    /* #swagger.responses[404] = {
          description: 'Report not found',
          schema: {
                  message: "Report not found"}
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while adding comment',
          schema: {
                  message: "Server error"}
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
          schema: {
            message: "Report moderated",
            report: {
              id: '123',
              contentId: 'abc',
              contentType: 'post',
              reason: 'Inappropriate content',
              status: 'approved',
              createdAt: '2024-01-01T00:00:00Z',
              reporter: {
                id: 'user123',
                username: 'reporter1'
              },  
              moderator: {
                id: 'mod123',
                username: 'moderator1'
              },
              moderationReason: 'Report verified by moderator.'
            }
          } 

    } */

    /* #swagger.responses[400] = {
          description: 'Invalid moderation action',
          schema: {
                  message: "Invalid moderation action"} 
    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - user not authenticated',
          schema: {
                  message: "Unauthorized"}
    } */

    /* #swagger.responses[403] = {
          description: 'Forbidden - only Admin or Moderator can moderate reports',
          schema: {
                  message: "Forbidden"}
    } */

    /* #swagger.responses[404] = {
          description: 'Report not found',
          schema: {
                  message: "Report not found"}
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while moderating report',
          schema: {
                  message: "Server error"}
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
          schema: {
            message: "Report deleted"
          }
          
    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - user not authenticated',
          schema: {
                  message: "Unauthorized"}
    } */

    /* #swagger.responses[403] = {
          description: 'Forbidden - only Admin or Moderator can delete reports',
          schema: {
                  message: "Forbidden"}
    } */

    /* #swagger.responses[404] = {
          description: 'Report not found',
          schema: {
                  message: "Report not found"}
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while deleting report',
          schema: {
                  message: "Server error"}
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
          schema: {
            message: "Comment deleted"
          }
    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - user not authenticated',
          schema: {
                  message: "Unauthorized"}
    } */

    /* #swagger.responses[403] = {
          description: 'Forbidden - user cannot delete this comment',
          schema: {
                  message: "Forbidden"}
    } */

    /* #swagger.responses[404] = {
          description: 'Comment not found',
          schema: {
                  message: "Comment not found"}
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while deleting comment',
          schema: {
                  message: "Server error"}
    } */
    return reportController.deleteComment(req, res, next);
  }
);

module.exports = router;
