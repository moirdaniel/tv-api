import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'TV API',
    version: '1.0.0',
    description: 'API para gestionar canales de TV'
  },
  servers: [
    {
      url: process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3001}`,
      description: 'Servidor principal'
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ['./controllers/*.js'] // <== MUY IMPORTANTE
};

export default swaggerJsdoc(options);
