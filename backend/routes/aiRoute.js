import express from 'express';
import { recommendFragrance, chatConsultant, generateDescription, smartSearch, summarizeReviews } from '../controllers/aiController.js';
import { authAdmin } from '../middleware/auth.js';

const aiRouter = express.Router();

aiRouter.post('/recommend', recommendFragrance);
aiRouter.post('/chat', chatConsultant);
aiRouter.post('/generate-description', authAdmin, generateDescription);
aiRouter.post('/smart-search', smartSearch);
aiRouter.post('/summarize-reviews', summarizeReviews);

export default aiRouter;
