// Middleware de limitation des requêtes API générales
const requestLimits = new Map();

export const apiRateLimit = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  
  // Récupérer les requêtes pour cette IP
  const requests = requestLimits.get(ip) || [];
  
  // Nettoyer les requêtes plus anciennes que 1 minute
  const recentRequests = requests.filter(timestamp => now - timestamp < 60 * 1000);
  
  // Si 100 requêtes ou plus dans la dernière minute
  if (recentRequests.length >= 100) {
    return res.status(429).json({
      status: 429,
      message: "Trop de requêtes. Veuillez réessayer plus tard."
    });
  }
  
  // Ajouter la requête actuelle
  recentRequests.push(now);
  requestLimits.set(ip, recentRequests);
  
  next();
};

// Nettoyer les limites de requêtes expirées toutes les 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, requests] of requestLimits.entries()) {
    const filtered = requests.filter(timestamp => now - timestamp < 60 * 1000);
    if (filtered.length === 0) {
      requestLimits.delete(key);
    } else {
      requestLimits.set(key, filtered);
    }
  }
}, 5 * 60 * 1000); 