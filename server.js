import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/tvapp';
const swaggerUrl = process.env.API_BASE_URL || `http://localhost:${PORT}`;

// Conexión a MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Modelo de canales
const channelSchema = new mongoose.Schema({
  id: Number,
  name: String,
  url: String,
  logoUrl: String,
  enabled: Boolean,
  category: [String]
}, { collection: 'channels' });

const Channel = mongoose.model('Channel', channelSchema);

// Endpoints
app.get('/api/channels', async (req, res) => {
  try {
    const channels = await Channel.find({ enabled: true });
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

// Swagger (si está habilitado)
if (process.env.ENABLE_SWAGGER === 'true') {
  const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'TV API',
      version: '1.0.0',
      description: 'API para gestionar canales de TV'
    },
    servers: [
      {
        url: swaggerUrl,
        description: 'Servidor dinámico (según .env)'
      }
    ]
  };

  const options = {
    swaggerDefinition,
    apis: ['./server.js']
  };

  const swaggerSpec = swaggerJSDoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('🔎 Swagger UI habilitado en /api-docs');
}

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 API corriendo en ${swaggerUrl}/api/channels`);
});

export default app;
