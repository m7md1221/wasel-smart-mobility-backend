const routingService = require("../services/routingService");

async function estimateRoute(req, res) {
  const { from, to, constraints = {} } = req.body;

  const result = await routingService.estimateRoute({
    from,
    to,
    constraints
  });

  if (result.error) {
    const { errorType } = result.error;

    if (errorType === "TIMEOUT") {
      return res.status(504).json({
        message: "Routing provider timed out"
      });
    }

    if (errorType === "RATE_LIMIT") {
      return res.status(503).json({
        message: "Routing provider rate limit reached",
        retryAfter: result.error.retryAfter || null
      });
    }

    if (errorType === "PROVIDER_ERROR" || errorType === "NETWORK_ERROR") {
      if (errorType === "PROVIDER_ERROR" && result.error.status === 404) {
        return res.status(404).json({
          message: "No route found for selected points or coordinates are not routable",
          details: result.error
        });
      }

      if (errorType === "PROVIDER_ERROR" && result.error.status === 400) {
        return res.status(400).json({
          message: "Invalid routing request payload for provider",
          details: result.error
        });
      }

      return res.status(502).json({
        message: "Routing provider request failed",
        details: result.error
      });
    }

    if (errorType === "NO_ROUTE") {
      return res.status(404).json({
        message: "No route found for selected points"
      });
    }

    if (errorType === "CONSTRAINT_VIOLATION") {
      return res.status(409).json({
        message: "Route violates selected constraints",
        details: result.error.details,
        route: result.payload
      });
    }

    return res.status(500).json({
      message: "Unexpected route estimation error",
      details: result.error
    });
  }

  return res.status(200).json(result);
}

module.exports = {
  estimateRoute
};
