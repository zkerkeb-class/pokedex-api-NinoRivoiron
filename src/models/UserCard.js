import mongoose from 'mongoose';

const userCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pokemonId: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  obtainedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Créer un index composé pour optimiser les recherches
userCardSchema.index({ userId: 1, pokemonId: 1 });

const UserCard = mongoose.model('UserCard', userCardSchema);

export default UserCard; 