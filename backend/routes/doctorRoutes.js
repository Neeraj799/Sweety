import express from 'express';
import { getPatients } from '../controllers/doctorController.js';
import { getPatientReports } from '../controllers/reportController.js';
import { requireAuth } from '../middleware/requireAuth.js';

export const doctorRouter = express.Router();

doctorRouter.get('/patients', requireAuth, getPatients);
doctorRouter.get('/patients/:id/reports', requireAuth, getPatientReports);
