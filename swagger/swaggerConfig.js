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
        url: 'https://tv-api.moir.cl', 
        description: 'Producción'
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ['./controllers/*.js'] // <== MUY IMPORTANTE
};

export default swaggerJsdoc(options);
