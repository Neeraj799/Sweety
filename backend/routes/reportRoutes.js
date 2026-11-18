import express from 'express';
import { getReports } from '../controllers/reportController.js';
import { requireAuth } from '../middleware/requireAuth.js';

export const reportRouter = express.Router();

reportRouter.get('/', requireAuth, getReports);
