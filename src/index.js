import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import pokemonRoutes from "./routes/pokemonRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import userCardRoutes from "./routes/userCardRoutes.js";
import { apiRateLimit } from "./middleware/rateLimit.js";
import initAdmin from "./config/initAdmin.js";

dotenv.config();

// Connexion à MongoDB
connectDB().then(() => {
  // Initialiser l'utilisateur administrateur après la connexion à la base de données
  initAdmin();
});

const app = express();
const PORT = 3000;

// Configuration CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Middleware de limitation de taux global
app.use("/api", apiRateLimit);

// Routes - Utilisation des routes définies dans pokemonRoutes.js
app.use("/api/pokemons", pokemonRoutes);

// Routes d'authentification
app.use("/api/auth", authRoutes);

// Routes utilisateurs
app.use("/api/users", userRoutes);

// Routes des cartes des utilisateurs
app.use("/api/user-cards", userCardRoutes);

// Route de base
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Pokémon avec MongoDB");
});

const VALID_TYPES = [
  "fire", "water", "grass", "electric", "ice", "fighting", "poison", "ground",
  "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});

