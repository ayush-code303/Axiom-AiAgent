import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import config from './config/config.js';
import aiRoutes from './routes/aiRoutes.js';
import requestLogger from './middleware/requestLogger.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || config.port || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AXIOM backend is healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ AXIOM backend running on http://localhost:${PORT}`);
});
