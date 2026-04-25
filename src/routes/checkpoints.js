const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/checkpointController");
const { checkAuth } = require("../middlewares/auth");
const { authorizeRole } = require("../middlewares/rolesAuthorize");

//Public routes
router.get("/", (req, res, next) => {
 // #swagger.tags = ['Checkpoints']
  // #swagger.summary = 'Get all checkpoints'
  // #swagger.description = 'Retrieves all checkpoints with filtering, searching, sorting, and pagination.'

  /* #swagger.parameters['status'] = {
        in: 'query',
        required: false,
        type: 'string',
        description: 'Filter checkpoints by current status',
        example: 'active'
  } */

  /* #swagger.parameters['search'] = {
        in: 'query',
        required: false,
        type: 'string',
        description: 'Search checkpoints by name',
        example: 'Huwwara'
  } */

  /* #swagger.parameters['sortBy'] = {
        in: 'query',
        required: false,
        type: 'string',
        description: 'Field used for sorting',
        example: 'created_at'
  } */

  /* #swagger.parameters['order'] = {
        in: 'query',
        required: false,
        type: 'string',
        description: 'Sort order: ASC or DESC',
        example: 'DESC'
  } */

  /* #swagger.parameters['page'] = {
        in: 'query',
        required: false,
        type: 'integer',
        description: 'Page number',
        example: 1
  } */

  /* #swagger.parameters['limit'] = {
        in: 'query',
        required: false,
        type: 'integer',
        description: 'Number of checkpoints per page',
        example: 10
  } */

  /* #swagger.responses[200] = {
        description: 'Checkpoints retrieved successfully',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: true },
                message: { type: "string", example: "Checkpoints retrieved successfully" },
                data: { type: "object" }
              }
            },
            example: {
              success: true,
              message: "Checkpoints retrieved successfully",
              data: { id: 1 }
            }
          }
        }
  } */

  /* #swagger.responses[500] = {
        description: 'Server error while fetching checkpoints',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: false },
                message: { type: "string", example: "Server error while fetching checkpoints" }
              }
            },
            example: {
              success: false,
              message: "Server error while fetching checkpoints"
            }
          }
        }
  } */

  return ctrl.getAllCheckpoints(req, res, next);
});

router.get("/:id", (req, res, next) => {
// #swagger.tags = ['Checkpoints']
  // #swagger.summary = 'Get checkpoint by ID'
  // #swagger.description = 'Retrieves a specific checkpoint by its ID.'

  /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        description: 'Checkpoint ID',
        example: 1
  } */

  /* #swagger.responses[200] = {
        description: 'Checkpoint retrieved successfully',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: true },
                message: { type: "string", example: "Checkpoint retrieved successfully" },
                data: { type: "object" }
              }
            },
            example: {
              success: true,
              message: "Checkpoint retrieved successfully",
              data: { id: 1 }
            }
          }
        }
  } */

  /* #swagger.responses[404] = {
        description: 'Checkpoint not found',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: false },
                message: { type: "string", example: "Checkpoint not found" }
              }
            },
            example: {
              success: false,
              message: "Checkpoint not found"
            }
          }
        }
  } */

  /* #swagger.responses[500] = {
        description: 'Server error while fetching checkpoint',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: false },
                message: { type: "string", example: "Server error while fetching checkpoint" }
              }
            },
            example: {
              success: false,
              message: "Server error while fetching checkpoint"
            }
          }
        }
  } */

  return ctrl.getCheckpointById(req, res, next);
});

router.get("/:id/history", (req, res, next) => {
 // #swagger.tags = ['Checkpoints']
  // #swagger.summary = 'Get checkpoint status history'
  // #swagger.description = 'Retrieves status change history for a specific checkpoint.'

  /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        description: 'Checkpoint ID',
        example: 1
  } */

  /* #swagger.responses[200] = {
        description: 'Checkpoint status history retrieved successfully',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: true },
                message: { type: "string", example: "Checkpoint status history retrieved successfully" },
                data: { type: "object" }
              }
            },
            example: {
              success: true,
              message: "Checkpoint status history retrieved successfully",
              data: { id: 1 }
            }
          }
        }
  } */

  /* #swagger.responses[404] = {
        description: 'Checkpoint not found',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: false },
                message: { type: "string", example: "Checkpoint not found" }
              }
            },
            example: {
              success: false,
              message: "Checkpoint not found"
            }
          }
        }
  } */

  /* #swagger.responses[500] = {
        description: 'Server error while fetching checkpoint history',
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean", example: false },
                message: { type: "string", example: "Server error while fetching checkpoint history" }
              }
            },
            example: {
              success: false,
              message: "Server error while fetching checkpoint history"
            }
          }
        }
  } */
  return ctrl.getCheckpointHistory(req, res, next);
});

// Admin + Moderator only

// Create checkpoint
router.post(
  "/",
  checkAuth,
  authorizeRole("ADMIN", "MODERATOR"),
  (req, res, next) => {
// #swagger.tags = ['Checkpoints']
    // #swagger.summary = 'Create a new checkpoint'
    // #swagger.description = 'Creates a new checkpoint. Only Admin and Moderator can access this endpoint.'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.requestBody = {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "city"],
                properties: {
                  name: {
                    type: "string",
                    example: "Huwwara"
                  },
                  city: {
                    type: "string",
                    example: "Nablus"
                  },
                  latitude: {
                    type: "number",
                    example: 32.15643
                  },
                  longitude: {
                    type: "number",
                    example: 35.27006
                  }
                }
              }
            }
          }
    } */

    /* #swagger.responses[201] = {
          description: 'Checkpoint created successfully',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Checkpoint created successfully" },
                  data: { type: "object" }
                }
              },
              example: {
                success: true,
                message: "Checkpoint created successfully",
                data: { id: 1 }
              }
            }
          }
    } */

    /* #swagger.responses[400] = {
          description: 'Invalid checkpoint data. Name and city are required',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Invalid checkpoint data. Name and city are required" }
                }
              },
              example: {
                success: false,
                message: "Invalid checkpoint data. Name and city are required"
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
          description: 'Forbidden - only Admin or Moderator can create checkpoints',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Forbidden - only Admin or Moderator can create checkpoints" }
                }
              },
              example: {
                success: false,
                message: "Forbidden - only Admin or Moderator can create checkpoints"
              }
            }
          }
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while creating checkpoint',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Server error while creating checkpoint" }
                }
              },
              example: {
                success: false,
                message: "Server error while creating checkpoint"
              }
            }
          }
    } */

    return ctrl.createCheckpoint(req, res, next);
  }
);

// Update status
router.put(
  "/:id/status",
  checkAuth,
  authorizeRole("ADMIN", "MODERATOR"),
  (req, res, next) => {
  // #swagger.tags = ['Checkpoints']
    // #swagger.summary = 'Update checkpoint status'
    // #swagger.description = 'Updates the status of a checkpoint and saves the change in checkpoint history and moderation logs. Only Admin and Moderator can access this endpoint.'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          type: 'integer',
          description: 'Checkpoint ID',
          example: 1
    } */

    /* #swagger.requestBody = {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    example: "closed"
                  },
                  reason: {
                    type: "string",
                    example: "Checkpoint closed due to security restrictions."
                  }
                }
              }
            }
          }
    } */

    /* #swagger.responses[200] = {
          description: 'Checkpoint status updated successfully',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Checkpoint status updated successfully" },
                  data: { type: "object" }
                }
              },
              example: {
                success: true,
                message: "Checkpoint status updated successfully",
                data: { id: 1 }
              }
            }
          }
    } */

    /* #swagger.responses[400] = {
          description: 'Invalid status value. Status must be one of: active, closed, restricted',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Invalid status value. Status must be one of: active, closed, restricted" }
                }
              },
              example: {
                success: false,
                message: "Invalid status value. Status must be one of: active, closed, restricted"
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
          description: 'Forbidden - only Admin or Moderator can update checkpoint status',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Forbidden - only Admin or Moderator can update checkpoint status" }
                }
              },
              example: {
                success: false,
                message: "Forbidden - only Admin or Moderator can update checkpoint status"
              }
            }
          }
    } */

    /* #swagger.responses[404] = {
          description: 'Checkpoint not found',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Checkpoint not found" }
                }
              },
              example: {
                success: false,
                message: "Checkpoint not found"
              }
            }
          }
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while updating checkpoint status',
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  message: { type: "string", example: "Server error while updating checkpoint status" }
                }
              },
              example: {
                success: false,
                message: "Server error while updating checkpoint status"
              }
            }
          }
    } */

    return ctrl.updateCheckpointStatus(req, res, next);
  }
);


module.exports = router;