import express from 'express';
import Pokemon from '../models/Pokemon.js';

const router = express.Router();

// GET - Récupérer tous les pokémons (avec recherche et pagination)
router.get('/', async (req, res) => {
  let { name, type, page = 1, limit = 300 } = req.query;
  let query = {};

  // Filtrer par nom
  if (name) {
    query['name.english'] = { $regex: name, $options: 'i' };
  }

  // Filtrer par type
  if (type) {
    query['type'] = type.charAt(0).toUpperCase() + type.slice(1);
  }

  try {
    // Compter le nombre total de pokémons correspondant à la requête
    const total = await Pokemon.countDocuments(query);
    
    // Récupérer les pokémons avec pagination et tri par id
    const pokemons = await Pokemon.find(query)
      .sort({ id: 1 }) // Trier par id en ordre croissant
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Formater les données pour le frontend
    const formattedPokemons = pokemons.map(pokemon => {
      const pokemonObj = pokemon.toObject();
      
      // Gérer les statistiques spéciales
      if (pokemonObj.base) {
        // Copier SpAttack vers "Sp. Attack" si disponible
        if (pokemonObj.base.SpAttack !== undefined) {
          pokemonObj.base['Sp. Attack'] = pokemonObj.base.SpAttack;
        }
        
        // Copier SpDefense vers "Sp. Defense" si disponible
        if (pokemonObj.base.SpDefense !== undefined) {
          pokemonObj.base['Sp. Defense'] = pokemonObj.base.SpDefense;
        }
      }
      
      return pokemonObj;
    });

    res.status(200).json({ 
      status: 200, 
      total, 
      data: formattedPokemons 
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Erreur lors de la récupération des pokémons",
      error: error.message
    });
  }
});

// GET - Récupérer un pokémon par son ID
router.get('/:id', async (req, res) => {
  try {
    const pokemonId = parseInt(req.params.id);
    const pokemon = await Pokemon.findOne({ id: pokemonId });
    
    if (!pokemon) {
      return res.status(404).json({ 
        status: 404, 
        message: "Pokemon non trouvé" 
      });
    }
    
    // Formater les données pour le frontend
    const responseData = pokemon.toObject();
    
    // Gérer les statistiques spéciales
    if (responseData.base) {
      // Copier SpAttack vers "Sp. Attack" si disponible
      if (responseData.base.SpAttack !== undefined) {
        responseData.base['Sp. Attack'] = responseData.base.SpAttack;
      }
      
      // Copier SpDefense vers "Sp. Defense" si disponible
      if (responseData.base.SpDefense !== undefined) {
        responseData.base['Sp. Defense'] = responseData.base.SpDefense;
    }
    }
    
    res.status(200).json({ 
      status: 200, 
      data: responseData 
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Erreur lors de la récupération du pokémon",
      error: error.message
    });
  }
});

// POST - Créer un nouveau pokémon
router.post('/', async (req, res) => {
  try {
    const { id, name, type, base, image } = req.body;
    
    // Vérifier si le pokémon existe déjà
    const existingPokemon = await Pokemon.findOne({ id });
    if (existingPokemon) {
      return res.status(400).json({
        status: 400,
        message: "Un pokémon avec cet ID existe déjà"
      });
    }
    
    // Créer un nouveau pokémon
    const newPokemon = new Pokemon({
      id,
      name,
      type,
      base,
      image
    });
    
    // Sauvegarder le pokémon
    await newPokemon.save();
    
    // Formater la réponse pour le frontend
    const responseData = newPokemon.toObject();
    
    // Gérer les statistiques spéciales
    if (responseData.base) {
      if (responseData.base.SpAttack !== undefined) {
        responseData.base['Sp. Attack'] = responseData.base.SpAttack;
      }
      if (responseData.base.SpDefense !== undefined) {
        responseData.base['Sp. Defense'] = responseData.base.SpDefense;
      }
    }
    
    res.status(201).json({
      status: 201,
      message: "Pokémon créé avec succès",
      data: responseData
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Erreur lors de la création du pokémon",
      error: error.message
    });
  }
});

// PUT - Mettre à jour un pokémon
router.put('/:id', async (req, res) => {
  try {
    const pokemonId = parseInt(req.params.id);
    const updates = req.body;
    
    const updatedPokemon = await Pokemon.findOneAndUpdate(
      { id: pokemonId },
      { $set: updates },
      { new: true }
    );
    
    if (!updatedPokemon) {
      return res.status(404).json({
        status: 404,
        message: "Pokémon non trouvé"
      });
    }
    
    // Formater la réponse pour le frontend
    const responseData = updatedPokemon.toObject();
    
    // Gérer les statistiques spéciales
    if (responseData.base) {
      if (responseData.base.SpAttack !== undefined) {
        responseData.base['Sp. Attack'] = responseData.base.SpAttack;
      }
      if (responseData.base.SpDefense !== undefined) {
        responseData.base['Sp. Defense'] = responseData.base.SpDefense;
    }
    }
    
    res.status(200).json({
      status: 200,
      message: "Pokémon mis à jour avec succès",
      data: responseData
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Erreur lors de la mise à jour du pokémon",
      error: error.message
    });
  }
});

// DELETE - Supprimer un pokémon
router.delete('/:id', async (req, res) => {
  try {
    const pokemonId = parseInt(req.params.id);
    
    const deletedPokemon = await Pokemon.findOneAndDelete({ id: pokemonId });
    
    if (!deletedPokemon) {
      return res.status(404).json({
        status: 404,
        message: "Pokémon non trouvé"
      });
    }
    
    res.status(200).json({
      status: 200,
      message: "Pokémon supprimé avec succès"
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Erreur lors de la suppression du pokémon",
      error: error.message
    });
  }
});

export default router;
