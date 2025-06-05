import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger/swaggerConfig.js';
import channelRoutes from './routes/channelRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tvapp')
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => console.error('❌ Error MongoDB:', err));

// Rutas
app.use('/api/channels', channelRoutes);
app.use('/healthcheck', healthRoutes);

// Swagger
if (process.env.ENABLE_SWAGGER === 'true') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('🔎 Swagger habilitado en /api-docs');
}

// Inicio
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 API corriendo en http://localhost:${PORT}`);
});

export default app;
