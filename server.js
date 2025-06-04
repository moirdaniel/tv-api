import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Modelo de datos
const channelSchema = new mongoose.Schema({
  id: Number,
  name: String,
  url: String,
  logoUrl: String,
  enabled: Boolean,
  category: [String]
}, { collection: 'channels' });

const Channel = mongoose.model('Channel', channelSchema);

/**
 * @swagger
 * tags:
 *   - name: Canales
 *     description: Operaciones sobre los canales de TV
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Channel:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         url:
 *           type: string
 *         logoUrl:
 *           type: string
 *         enabled:
 *           type: boolean
 *         category:
 *           type: array
 *           items:
 *             type: string
 */

// Endpoints
/**
 * @swagger
 * /api/channels:
 *   get:
 *     summary: Obtener todos los canales habilitados
 *     tags: [Canales]
 *     responses:
 *       200:
 *         description: Lista de canales habilitados
 */
app.get('/api/channels', async (req, res) => {
  try {
    const channels = await Channel.find({ enabled: true });
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/channels/{id}:
 *   get:
 *     summary: Obtener un canal por su ID
 *     tags: [Canales]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Canal encontrado
 *       404:
 *         description: Canal no encontrado
 */
app.get('/api/channels/:id', async (req, res) => {
  try {
    const channel = await Channel.findOne({ id: parseInt(req.params.id) });
    if (!channel) {
      return res.status(404).json({ error: 'Canal no encontrado' });
    }
    res.json(channel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/channels:
 *   post:
 *     summary: Crear un nuevo canal
 *     tags: [Canales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Channel'
 *     responses:
 *       201:
 *         description: Canal creado
 *       400:
 *         description: Canal con ID ya existe
 */
app.post('/api/channels', async (req, res) => {
  try {
    const { id, name, url, logoUrl, enabled, category } = req.body;
    const existingChannel = await Channel.findOne({ id });
    if (existingChannel) {
      return res.status(400).json({ error: 'El canal con este ID ya existe' });
    }
    const newChannel = new Channel({ id, name, url, logoUrl, enabled, category });
    await newChannel.save();
    res.status(201).json(newChannel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/channels/{id}:
 *   put:
 *     summary: Actualizar un canal por su ID
 *     tags: [Canales]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Channel'
 *     responses:
 *       200:
 *         description: Canal actualizado
 *       404:
 *         description: Canal no encontrado
 */
app.put('/api/channels/:id', async (req, res) => {
  try {
    const { name, url, logoUrl, enabled, category } = req.body;
    const updatedChannel = await Channel.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      { name, url, logoUrl, enabled, category },
      { new: true }
    );
    if (!updatedChannel) {
      return res.status(404).json({ error: 'Canal no encontrado' });
    }
    res.json(updatedChannel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/channels/{id}:
 *   delete:
 *     summary: Eliminar un canal por su ID
 *     tags: [Canales]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Canal eliminado
 *       404:
 *         description: Canal no encontrado
 */
app.delete('/api/channels/:id', async (req, res) => {
  try {
    const deletedChannel = await Channel.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!deletedChannel) {
      return res.status(404).json({ error: 'Canal no encontrado' });
    }
    res.json({ message: 'Canal eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Swagger setup
if (process.env.ENABLE_SWAGGER === 'true') {
  const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'TV API',
      version: '1.0.0',
      description: 'API para gestionar canales de TV'
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 3001}`, description: 'Servidor local' }]
  };

  const options = {
    swaggerDefinition,
    apis: [path.join(__dirname, 'server.js')]
  };

  const swaggerSpec = swaggerJSDoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('🔎 Swagger UI habilitado en /api-docs');
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 API corriendo en http://localhost:${PORT}/api/channels`);
});

export default app;
