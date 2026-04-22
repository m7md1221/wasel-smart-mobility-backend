const swaggerAutogen = require('swagger-autogen')(); 
const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/app.js"];
const doc = {
  info: {
    title: 'API Documentation',
    description: 'Generated with swagger-autogen',
  },
  host: 'localhost:4000',
  schemes: ['http'],
};
swaggerAutogen(outputFile,endpointsFiles).then(() =>
{
 console.log("swagger documentation generated");
});

