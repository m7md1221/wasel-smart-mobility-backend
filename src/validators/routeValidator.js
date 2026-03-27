const estimateRouteSchema = {
  from: {
    type: "object",
    strict: true,
    props: {
      lat: { type: "number", min: -90, max: 90 },
      lng: { type: "number", min: -180, max: 180 }
    }
  },
  to: {
    type: "object",
    strict: true,
    props: {
      lat: { type: "number", min: -90, max: 90 },
      lng: { type: "number", min: -180, max: 180 }
    }
  },
  constraints: {
    type: "object",
    optional: true,
    strict: true,
    props: {
      avoidCheckpointIds: {
        type: "array",
        optional: true,
        items: { type: "number", integer: true, positive: true }
      },
      avoidAreas: {
        type: "array",
        optional: true,
        items: {
          type: "object",
          strict: true,
          props: {
            center: {
              type: "object",
              strict: true,
              props: {
                lat: { type: "number", min: -90, max: 90 },
                lng: { type: "number", min: -180, max: 180 }
              }
            },
            radiusKm: { type: "number", positive: true, max: 100 }
          }
        }
      }
    }
  }
};

module.exports = {
  estimateRouteSchema
};
