import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script pour créer un utilisateur administrateur par défaut
 * Cette fonction est appelée au démarrage de l'application
 */
const initAdmin = async () => {
  try {
    // Vérifier si un administrateur existe déjà
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      console.log('Aucun administrateur trouvé, création de l\'utilisateur admin par défaut...');
      
      // Créer l'utilisateur admin
      const adminUser = new User({
        username: process.env.ADMIN_USERNAME || 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@pokedex.com',
        password: process.env.ADMIN_PASSWORD || 'Admin123!',
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Utilisateur administrateur créé avec succès!');
    } else {
      console.log('Un utilisateur administrateur existe déjà, aucune action nécessaire.');
    }
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur administrateur:', error);
  }
};

export default initAdmin; 