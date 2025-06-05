import Channel from '../models/Channel.js';

/**
 * @swagger
 * /api/channels:
 *   get:
 *     summary: Obtener todos los canales habilitados
 *     tags: [Channels]
 *     responses:
 *       200:
 *         description: Lista de canales habilitados
 */
export const getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find({ enabled: true });
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/channels/{id}:
 *   get:
 *     summary: Obtener un canal por ID
 *     tags: [Channels]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del canal
 *     responses:
 *       200:
 *         description: Canal encontrado
 *       404:
 *         description: Canal no encontrado
 */
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findOne({ id: parseInt(req.params.id) });
    if (!channel) return res.status(404).json({ error: 'Canal no encontrado' });
    res.json(channel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/channels:
 *   post:
 *     summary: Crear un nuevo canal
 *     tags: [Channels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - url
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *               enabled:
 *                 type: boolean
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Canal creado
 *       400:
 *         description: ID duplicado
 */
export const createChannel = async (req, res) => {
  try {
    const { id, name, url, logoUrl, enabled, category } = req.body;
    const existing = await Channel.findOne({ id });
    if (existing) return res.status(400).json({ error: 'ID ya existe' });
    const newChannel = new Channel({ id, name, url, logoUrl, enabled, category });
    await newChannel.save();
    res.status(201).json(newChannel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/channels/{id}:
 *   put:
 *     summary: Actualizar canal por ID
 *     tags: [Channels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *               enabled:
 *                 type: boolean
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Canal actualizado
 *       404:
 *         description: Canal no encontrado
 */
export const updateChannel = async (req, res) => {
  try {
    const updated = await Channel.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Canal no encontrado' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/channels/{id}:
 *   delete:
 *     summary: Eliminar canal por ID
 *     tags: [Channels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Canal eliminado correctamente
 *       404:
 *         description: Canal no encontrado
 */
export const deleteChannel = async (req, res) => {
  try {
    const deleted = await Channel.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!deleted) return res.status(404).json({ error: 'Canal no encontrado' });
    res.json({ message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
