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
// Error route (optional)
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

module.exports = app;