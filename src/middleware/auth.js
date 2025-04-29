import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const auth = (req, res, next) => {
  // Récupérer le token du header Authorization
  const authHeader = req.headers.authorization;
  console.log('Header Authorization reçu:', authHeader);
  
  // Vérifier si le header Authorization existe et commence par "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Token manquant ou mal formaté');
    return res.status(401).json({ 
      status: 401, 
      message: "Accès refusé, token manquant ou invalide" 
    });
  }
  
  const token = authHeader.split(' ')[1]; // Extraire le token après "Bearer "
  console.log('Token extrait:', token);

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token décodé:', decoded);
    
    // Ajouter l'utilisateur à la requête
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error('Erreur de vérification du token:', error.message);
    return res.status(401).json({ 
      status: 401, 
      message: "Token invalide ou expiré" 
    });
  }
};

// Middleware pour vérifier si l'utilisateur est un administrateur
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      status: 403, 
      message: "Accès refusé: droits d'administrateur requis" 
    });
  }
  next();
};

export { auth, isAdmin }; 