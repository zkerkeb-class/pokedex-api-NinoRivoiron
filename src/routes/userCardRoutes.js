import express from 'express';
import { auth } from '../middleware/auth.js';
import { openBooster, getCollection } from '../controllers/userCardController.js';

const router = express.Router();

// Ouvrir un booster (5 cartes aléatoires)
router.post('/open-booster', auth, openBooster);

// Obtenir la collection d'un utilisateur
router.get('/collection', auth, getCollection);

export default router; 