import express from 'express';
import User from '../models/User.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Route pour obtenir tous les utilisateurs (admin seulement)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      status: 200,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).json({
      status: 500,
      message: "Erreur lors de la récupération des utilisateurs",
      error: error.message
    });
  }
});

// Route pour obtenir un utilisateur par son ID
router.get('/:id', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur est admin ou s'il consulte son propre profil
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({
        status: 403,
        message: "Accès non autorisé"
      });
    }

    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "Utilisateur non trouvé"
      });
    }

    res.status(200).json({
      status: 200,
      data: user
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    res.status(500).json({
      status: 500,
      message: "Erreur lors de la récupération de l'utilisateur",
      error: error.message
    });
  }
});

// Route pour mettre à jour un utilisateur
router.put('/:id', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur est admin ou s'il modifie son propre profil
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({
        status: 403,
        message: "Accès non autorisé"
      });
    }

    const { username, email, role } = req.body;
    
    // Créer un objet avec les champs à mettre à jour
    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    
    // Seul un admin peut changer le rôle
    if (role && req.user.role === 'admin') {
      updateFields.role = role;
    }

    // Mettre à jour l'utilisateur
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "Utilisateur non trouvé"
      });
    }

    res.status(200).json({
      status: 200,
      message: "Utilisateur mis à jour avec succès",
      data: user
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    res.status(500).json({
      status: 500,
      message: "Erreur lors de la mise à jour de l'utilisateur",
      error: error.message
    });
  }
});

// Route pour supprimer un utilisateur (admin seulement)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "Utilisateur non trouvé"
      });
    }

    res.status(200).json({
      status: 200,
      message: "Utilisateur supprimé avec succès"
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    res.status(500).json({
      status: 500,
      message: "Erreur lors de la suppression de l'utilisateur",
      error: error.message
    });
  }
});

export default router; 