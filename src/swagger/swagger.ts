import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bill Payment System API",
      version: "1.0.0",
      description: "SE4458 Midterm Project - Bill Payment APIs",
    },
    servers: [{ url: "http://localhost:3000/api/v1" }],
  },
  apis: [`${__dirname}/../routes/*.{ts,js}`],
};

export const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
