# API Pokédex

Une API RESTful pour gérer une base de données de Pokémon avec authentification utilisateur.

## Installation

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
# Créer un fichier .env à la racine avec :
# MONGODB_URI=mongodb://localhost:27017/pokedex
# PORT=3000
# JWT_SECRET=votre_clé_secrète
# ADMIN_USERNAME=admin
# ADMIN_EMAIL=admin@pokedex.com
# ADMIN_PASSWORD=Admin123!

# Démarrer le serveur
npm start
```

## Routes API

### Authentification

#### Inscription
```
POST /api/auth/register
```
Corps de la requête :
```json
{
  "username": "utilisateur",
  "email": "utilisateur@example.com",
  "password": "motdepasse"
}
```

#### Connexion
```
POST /api/auth/login
```
Corps de la requête :
```json
{
  "username": "utilisateur",
  "password": "motdepasse"
}
```

#### Vérifier l'utilisateur actuel
```
GET /api/auth/me
```
Header requis :
```
Authorization: Bearer <token>
```

### Utilisateurs (Admin uniquement)

#### Obtenir tous les utilisateurs
```
GET /api/users
```
Header requis :
```
Authorization: Bearer <token>
```

#### Obtenir un utilisateur par ID
```
GET /api/users/:id
```
Header requis :
```
Authorization: Bearer <token>
```

#### Mettre à jour un utilisateur
```
PUT /api/users/:id
```
Header requis :
```
Authorization: Bearer <token>
```
Corps de la requête :
```json
{
  "username": "nouveau_nom",
  "email": "nouvel_email@example.com",
  "role": "admin" // Seulement pour les administrateurs
}
```

#### Supprimer un utilisateur
```
DELETE /api/users/:id
```
Header requis :
```
Authorization: Bearer <token>
```

### Pokémon

#### Obtenir tous les Pokémon
```
GET /api/pokemons
```
Paramètres de recherche optionnels :
- `name` - Recherche par nom (ex: ?name=pika)
- `type` - Filtrer par type (ex: ?type=fire)
- `page` - Numéro de page (défaut: 1)
- `limit` - Nombre de résultats par page (défaut: 300)

#### Obtenir un Pokémon par ID
```
GET /api/pokemons/:id
```

#### Créer un nouveau Pokémon
```
POST /api/pokemons
```
Header requis :
```
Authorization: Bearer <token>
```
Corps de la requête :
```json
{
  "id": 900,
  "name": {
    "english": "Nom du Pokémon",
    "japanese": "ポケモン",
    "chinese": "宝可梦",
    "french": "Nom du Pokémon"
  },
  "type": ["Type1", "Type2"],
  "base": {
    "HP": 100,
    "Attack": 70,
    "Defense": 80,
    "SpAttack": 90,
    "SpDefense": 85,
    "Speed": 75
  },
  "image": "https://example.com/image.png"
}
```

#### Mettre à jour un Pokémon
```
PUT /api/pokemons/:id
```
Header requis :
```
Authorization: Bearer <token>
```
Corps de la requête : similaire à la création, avec les champs à mettre à jour.

#### Supprimer un Pokémon
```
DELETE /api/pokemons/:id
```
Header requis :
```
Authorization: Bearer <token>
```
Nécessite le rôle administrateur.

## Limites de taux

- Les requêtes API générales sont limitées à 100 par minute par adresse IP.

## Sécurité

- Tous les mots de passe sont hachés avec bcrypt avant d'être stockés.
- Les tokens JWT expirent après 24 heures.
- Seuls les administrateurs peuvent supprimer des Pokémon et gérer les utilisateurs.

## Concepts à Comprendre
1. REST API
   - Méthodes HTTP (GET, POST, PUT, DELETE)
   - Codes de statut HTTP
   - Structure des URL
   - CORS (Cross-Origin Resource Sharing)

2. Express.js
   - Routing
   - Middleware
   - Gestion des requêtes et réponses
   - Configuration CORS

3. Sécurité de Base
   - Validation des entrées
   - Authentification
   - Gestion des erreurs
   - Politiques CORS

## Configuration CORS
CORS (Cross-Origin Resource Sharing) est un mécanisme qui permet à de nombreuses ressources (polices, JavaScript, etc.) d'une page web d'être demandées à partir d'un autre domaine que celui du domaine d'origine.

Pour utiliser l'API depuis un autre domaine :
1. L'API est configurée avec CORS activé
2. Toutes les origines sont autorisées dans cette version de développement
3. En production, vous devriez restreindre les origines autorisées

Pour une configuration plus restrictive, vous pouvez modifier les options CORS :

```javascript
app.use(cors({
  origin: 'https://votre-domaine.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Ressources Additionnelles
- [Documentation Express.js](https://expressjs.com/fr/)
- [Guide des Status HTTP](https://developer.mozilla.org/fr/docs/Web/HTTP/Status)
- [REST API Best Practices](https://restfulapi.net/)

## Support
Pour toute question ou problème :
1. Vérifiez la documentation
2. Consultez les messages d'erreur dans la console
3. Demandez de l'aide à votre formateur

## Prochaines Étapes
- Ajout d'une base de données (MongoDB)
- Implémentation de tests automatisés
- Déploiement de l'API
- Documentation avec Swagger

## Gestion des Fichiers Statiques
Le serveur expose le dossier `assets` pour servir les images des Pokémon. Les images sont accessibles via l'URL :
```
http://localhost:3000/assets/pokemons/{id}.png
```

Par exemple, pour accéder à l'image de Pikachu (ID: 25) :
```
http://localhost:3000/assets/pokemons/25.png
```

### Configuration
Le middleware `express.static` est utilisé pour servir les fichiers statiques :
```javascript
app.use('/assets', express.static(path.join(__dirname, '../assets')));
```

### Sécurité
- Seuls les fichiers du dossier `assets` sont exposés
- Les autres dossiers du projet restent inaccessibles
- En production, considérez l'utilisation d'un CDN pour les fichiers statiques

## Base de données

### Configuration de la base de données
L'application utilise MongoDB comme base de données. La connexion est configurée dans le fichier `.env` à la racine du projet.

### Importation des données Pokémon
Pour importer des données Pokémon dans la base de données, exécutez la commande suivante:

```bash
npm run import-pokemons
```

Cette commande va importer un jeu de données de base comprenant 10 Pokémon dans la base de données MongoDB. Les Pokémon existants (avec les mêmes IDs) ne seront pas remplacés.
