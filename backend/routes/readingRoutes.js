import express from 'express';
import { addReading, getReading, getReadings } from '../controllers/readingController.js';
import { requireAuth } from '../middleware/requireAuth.js';

export const readingRouter = express.Router();

readingRouter.get('/', requireAuth, getReadings);
readingRouter.get('/:id', requireAuth, getReading);
readingRouter.post('/', requireAuth, addReading);
