import mongoose from 'mongoose';

export const healthCheck = (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    database: dbState,
    timestamp: new Date().toISOString()
  });
};
