const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/incidentController");
const { checkAuth } = require("../middlewares/auth");
const { authorizeRole } = require("../middlewares/rolesAuthorize");

//Public routes
router.get("/", (req, res, next) => {
  // #swagger.tags = ['Incidents']
  // #swagger.summary = 'Get all incidents'
  // #swagger.description = 'Retrieves all incidents with filtering, sorting, and pagination.'

  /* #swagger.parameters['category'] = {
        in: 'query',
        required: false,
        type: 'string',
        description: 'Filter incidents by category',
        example: 'CLOSURE'
  } */

  /* #swagger.parameters['severity'] = {
        in: 'query',
        required: false,
        type: 'string',
        description: 'Filter incidents by severity',
        example: 'HIGH'
  } */

  /* #swagger.parameters['status'] = {
        in: 'query',
        required: false,
        type: 'string',
        description: 'Filter incidents by status',
        example: 'open'
  } */

  /* #swagger.parameters['checkpoint_id'] = {
        in: 'query',
        required: false,
        type: 'integer',
        description: 'Filter incidents by checkpoint ID',
        example: 1
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
        description: 'Number of incidents per page',
        example: 10
  } */

  /* #swagger.responses[200] = {
        description: 'Incidents retrieved successfully',
        schema: {
                total: 100,
                page: 1,
                limit: 10,
                incidents: [
                        {
                                id: 1,            
                                category: 'CLOSURE',
                                description: 'Road closed due to construction',
                                severity: 'HIGH',
                                status: 'open',
                                checkpoint_id: 1,
                                created_at: '2024-01-01T12:00:00Z',
                                updated_at: '2024-01-01T12:00:00Z'
                        }
                ]
        }

  } */

  /* #swagger.responses[500] = {
        description: 'Server error while fetching incidents',
        schema: {
                message: "Server error"
        }
  } */

  return ctrl.getAllIncidents(req, res, next);
});

router.get("/:id", (req, res, next) => {
// #swagger.tags = ['Incidents']
  // #swagger.summary = 'Get incident by ID'
  // #swagger.description = 'Retrieves a specific incident with checkpoint name, creator name, and verifier name.'

  /* #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        type: 'integer',
        description: 'Incident ID',
        example: 1
  } */

  /* #swagger.responses[200] = {
        description: 'Incident retrieved successfully',
        schema: {
                id: 1,            
                category: 'CLOSURE',
                description: 'Road closed due to construction',
                severity: 'HIGH',
                status: 'open',
                checkpoint_id: 1,
                checkpoint_name: 'Checkpoint A',
                creator_name: 'John Doe',
                verifier_name: 'Jane Smith',
                created_at: '2024-01-01T12:00:00Z',
                updated_at: '2024-01-01T12:00:00Z'
        } 
  } */

  /* #swagger.responses[404] = {
        description: 'Incident not found',
        schema: {
                message: "Incident not found"
        }
  } */

  /* #swagger.responses[500] = {
        description: 'Server error while fetching incident',
        schema: {
                message: "Server error"
        }
  } */

  return ctrl.getIncidentById(req, res, next);
});

//Any logged-in user
router.post("/", checkAuth, (req, res, next) => {
  // #swagger.tags = ['Incidents']
  // #swagger.summary = 'Create a new incident'
  // #swagger.description = 'Allows any authenticated user to create a new incident. The incident is created with open status.'
  // #swagger.security = [{ BearerAuth: [] }]

  /* #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "category", "severity", "description", "latitude", "longitude"],
              properties: {
                title: {
                  type: "string",
                  example: "Checkpoint closure near Huwwara"
                },
                category: {
                  type: "string",
                  example: "CLOSURE"
                },
                severity: {
                  type: "string",
                  example: "HIGH"
                },
                description: {
                  type: "string",
                  example: "The checkpoint is currently closed and vehicles are waiting."
                },
                latitude: {
                  type: "number",
                  example: 32.15643
                },
                longitude: {
                  type: "number",
                  example: 35.27006
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
        description: 'Incident created successfully',
        schema: {
                id: 1,            
                category: 'CLOSURE',
                description: 'Road closed due to construction',
                severity: 'HIGH',
                status: 'open',
                checkpoint_id: 1,
                created_at: '2024-01-01T12:00:00Z',
                updated_at: '2024-01-01T12:00:00Z'
        }

  } */

  /* #swagger.responses[400] = {
        description: 'Validation error',
        schema: {
                message: "Validation error: Missing required fields or invalid data types"
        }
  } */

  /* #swagger.responses[401] = {
        description: 'Unauthorized - missing or invalid token',
        schema: {
                message: "Unauthorized: missing or invalid token"
        }
  } */

  /* #swagger.responses[500] = {
        description: 'Server error while creating incident',
  } */

  return ctrl.createIncident(req, res, next);
});

//Admin + Moderator only
router.put(
  "/:id/status",
  checkAuth,
  authorizeRole("ADMIN", "MODERATOR"),
  (req, res, next) => {
 // #swagger.tags = ['Incidents']
    // #swagger.summary = 'Update incident status'
    // #swagger.description = 'Allows Admin or Moderator to update an incident status to open, verified, or closed. When an incident is verified, an alert is created ans sent to the subscribed users.'
    // #swagger.security = [{ BearerAuth: [] }]

    /* #swagger.parameters['id'] = {
          in: 'path',
          required: true,
          type: 'integer',
          description: 'Incident ID',
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
                    example: "verified"
                  },
                  reason: {
                    type: "string",
                    example: "Incident verified by moderator after checking reports."
                  }
                }
              }
            }
          }
    } */

    /* #swagger.responses[200] = {
          description: 'Incident status updated successfully',
          schema: {
                  id: 1,            
                  category: 'CLOSURE',
                  description: 'Road closed due to construction',
                  severity: 'HIGH',
                  status: 'verified',
                  checkpoint_id: 1,
                  created_at: '2024-01-01T12:00:00Z',
                  updated_at: '2024-01-02T12:00:00Z'
          }
    } */

    /* #swagger.responses[400] = {
          description: 'Invalid status value. Status must be one of: open, verified, closed',
          schema: {
                  message: "Invalid status value. Status must be one of: open, verified, closed"
          }
    } */

    /* #swagger.responses[401] = {
          description: 'Unauthorized - missing or invalid token',
          schema: {
                  message: "Unauthorized: missing or invalid token"
          }
    } */

    /* #swagger.responses[403] = {
          description: 'Forbidden - only Admin or Moderator can update incident status',
          schema: {
                  message: "Forbidden: only Admin or Moderator can update incident status"
          }
    } */

    /* #swagger.responses[404] = {
          description: 'Incident not found',
          schema: {
                  message: "Incident not found"
          }
    } */

    /* #swagger.responses[500] = {
          description: 'Server error while updating incident status',
          schema: {
                  message: "Server error while updating incident status"
          }
    } */

    return ctrl.updateIncidentStatus(req, res, next);
  }
);
module.exports = router;