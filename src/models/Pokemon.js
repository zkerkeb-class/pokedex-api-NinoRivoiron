import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
  id: Number,
  name: {
    english: String,
    japanese: String,
    chinese: String,
    french: String
  },
  type: [String],
  base: {
    HP: Number,
    Attack: Number,
    Defense: Number,
    SpAttack: Number,
    SpDefense: Number,
    Speed: Number
  },
  image: String
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

export default Pokemon;
