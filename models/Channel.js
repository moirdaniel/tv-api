import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  id: Number,
  name: String,
  url: String,
  logoUrl: String,
  enabled: Boolean,
  category: [String]
}, { collection: 'channels' });

export default mongoose.model('Channel', channelSchema);
