const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const v1Routes = require("./routes/v1");
const swaggerUi=require('swagger-ui-express');
const swaggerDocuments = require('../swagger-output.json');
// Middleware
app.use(express.json());
app.use(bodyparser.json());
//testing for webhook 
app.get("/test", (req, res) => {
  // #swagger.tags = ['Testing']
  // #swagger.summary = 'Test endpoint to verify the main app is working'
  res.json({ message: "main app works" });
});
// Routes
app.use("/api/v1", v1Routes);

//swagger documentation as json file
app.get('/swagger-output.json', (req, res) => {
  // #swagger.tags = ['API Documentation']
  // #swagger.summary = 'The generated Swagger documentation JSON file'
  res.json(require('../swagger-output.json'));
});
//API DOCUMENTATION
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocuments));

const { graphqlHandler } = require('./graphql');
//graphQL routes 
app.all('/graphql',
  /*
    #swagger.tags = ['GraphQL']
    #swagger.summary = 'GraphQL endpoint'
    #swagger.description = 'Single GraphQL endpoint.Send a GraphQL query in the request body.'
    #swagger.security = [{
      "bearerAuth": []
    }]
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["query"],
            properties: {
              query: {
                type: "string",
                example: "query { checkpoints { id name city current_status } }"
              },
              variables: {
                type: "object",
                example: {}
              },
              operationName: {
                type: "string",
                example: "GetCheckpoints"
              }
            }
          }
        }
      }
    }*/
    graphqlHandler);

// Error route (optional)
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

module.exports = app;