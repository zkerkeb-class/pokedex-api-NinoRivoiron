import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const router = express.Router();

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ 
      $or: [
        { username },
        { email }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        status: 400, 
        message: "Cet utilisateur ou cet email existe déjà" 
      });
    }

    // Créer un nouvel utilisateur
    const newUser = new User({
      username,
      email,
      password,
      role: 'user'
    });

    // Enregistrer l'utilisateur (le mot de passe sera haché automatiquement grâce au middleware)
    await newUser.save();

    // Générer un token JWT
    const payload = {
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      status: 201,
      message: "Utilisateur créé avec succès",
      token
    });
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    res.status(500).json({
      status: 500,
      message: "Erreur lors de l'inscription",
      error: error.message
    });
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Rechercher l'utilisateur
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        status: 400,
        message: "Identifiants invalides"
      });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        status: 400,
        message: "Identifiants invalides"
      });
    }

    // Générer un token JWT
    const payload = {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      status: 200,
      message: "Connexion réussie",
      token
    });
  } catch (error) {
    console.error("Erreur de connexion:", error);
    res.status(500).json({
      status: 500,
      message: "Erreur lors de la connexion",
      error: error.message
    });
  }
});

// Route pour vérifier le token
router.get('/me', async (req, res) => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        status: 401, 
        message: "Token manquant" 
      });
    }
    
    const token = authHeader.split(' ')[1]; // Extraire le token après "Bearer "

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupérer l'utilisateur sans le mot de passe
    const user = await User.findById(decoded.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "Utilisateur non trouvé"
      });
    }

    res.status(200).json({
      status: 200,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Erreur de vérification du token:", error);
    res.status(401).json({
      status: 401,
      message: "Token invalide ou expiré"
    });
  }
});

export default router; 