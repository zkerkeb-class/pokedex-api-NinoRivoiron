import { getRandomPokemonIds, createOrUpdateUserCard, getUserCollection } from '../services/userCardService.js';
import Pokemon from '../models/Pokemon.js';

export const openBooster = async (req, res) => {
  try {
    const userId = req.user.id;
    const boosterSize = 5;

    // Obtenir des IDs de Pokémon aléatoires
    const selectedPokemonIds = await getRandomPokemonIds(boosterSize);

    // Créer ou mettre à jour les cartes
    const newCards = await Promise.all(
      selectedPokemonIds.map(pokemonId => 
        createOrUpdateUserCard(userId, pokemonId)
      )
    );

    // Récupérer les détails des Pokémon
    const pokemonDetails = await Pokemon.find({
      id: { $in: selectedPokemonIds }
    });

    // Préparer les informations des cartes
    const cardsInfo = newCards.reduce((acc, card) => {
      acc[card.pokemonId] = {
        quantity: card.quantity,
        isNew: card.isNew
      };
      return acc;
    }, {});

    res.status(201).json({
      status: 201,
      message: "Booster ouvert avec succès",
      cards: pokemonDetails.map(pokemon => ({
        ...pokemon.toObject(),
        quantity: cardsInfo[pokemon.id].quantity,
        status: cardsInfo[pokemon.id].isNew ? "nouveau" : "dupliqué"
      }))
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Erreur lors de l'ouverture du booster",
      error: error.message
    });
  }
};

export const getCollection = async (req, res) => {
  try {
    const userId = req.user.id;
    const collection = await getUserCollection(userId);

    res.status(200).json({
      status: 200,
      data: collection
    });
  } catch (error) {
    console.error("Erreur détaillée:", error);
    res.status(500).json({
      status: 500,
      message: "Erreur lors de la récupération de la collection",
      error: error.message
    });
  }
}; 