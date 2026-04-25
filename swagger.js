const swaggerAutogen = require('swagger-autogen')({ openapi: "3.0.0" }); 
const doc = {
  info: {
    title: 'Wasel Palestine API Documentation',
    description: 'API Documentation for Wasel Palestine backend project generated with swagger-autogen',
  },
  host: 'localhost:4000',
  basePath: '/',
  schemes: ['http'],
  securityDefinitions: {
  BearerAuth: {
    type: 'apiKey',
    in: 'header',
    name: 'Authorization',
    description: 'Enter your token as: Bearer <token>'
  }
}
};
const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/app.js'];
swaggerAutogen(outputFile,endpointsFiles,doc).then(() =>
{
 console.log("swagger documentation generated");
});

