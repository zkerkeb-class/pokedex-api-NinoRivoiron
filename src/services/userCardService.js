import UserCard from '../models/UserCard.js';
import Pokemon from '../models/Pokemon.js';

export const getRandomPokemonIds = async (count) => {
  const allPokemons = await Pokemon.find({}, 'id');
  const pokemonIds = allPokemons.map(p => p.id);
  const selectedIds = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * pokemonIds.length);
    selectedIds.push(pokemonIds[randomIndex]);
  }

  return selectedIds;
};

export const createOrUpdateUserCard = async (userId, pokemonId) => {
  const existingCard = await UserCard.findOne({ userId, pokemonId });
  
  if (existingCard) {
    existingCard.quantity += 1;
    await existingCard.save();
    return { ...existingCard.toObject(), isNew: false };
  }

  const newCard = await UserCard.create({
    userId,
    pokemonId
  });
  return { ...newCard.toObject(), isNew: true };
};

export const getUserCollection = async (userId) => {
  const userCards = await UserCard.find({ userId })
    .sort({ obtainedAt: -1 });

  if (!userCards || userCards.length === 0) {
    return [];
  }

  const pokemonIds = userCards.map(card => card.pokemonId);
  const pokemons = await Pokemon.find({
    id: { $in: pokemonIds }
  });

  const pokemonMap = pokemons.reduce((acc, pokemon) => {
    acc[pokemon.id] = pokemon;
    return acc;
  }, {});

  return userCards.map(card => {
    const pokemon = pokemonMap[card.pokemonId];
    if (!pokemon) {
      console.error(`Pokémon non trouvé pour l'ID: ${card.pokemonId}`);
      return null;
    }
    return {
      ...pokemon.toObject(),
      quantity: card.quantity,
      status: "possédé",
      obtainedAt: card.obtainedAt
    };
  }).filter(card => card !== null);
}; 