import express from 'express';
import {
  getAllChannels,
  getChannelById,
  createChannel,
  updateChannel,
  deleteChannel
} from '../controllers/channelController.js';

const router = express.Router();

router.get('/', getAllChannels);
router.get('/:id', getChannelById);
router.post('/', createChannel);
router.put('/:id', updateChannel);
router.delete('/:id', deleteChannel);

export default router;
