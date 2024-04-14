const mongoose = require('mongoose');

const projetSchema = new mongoose.Schema({
    responsable: {
      type: String,
      required: true
    },
    capaciteMin: {
      type: Number,
      required: true
    },
    capaciteMax: {
      type: Number,
      required: true
    },
    nom: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    informationsSupplementaires: {
      type: String
    },
    submitted: {
      type: Boolean,
      default: false
    },
    score: {
      type: Number,
      default: null
    },
    candidats: [{
      nom: String,
      prenom: String,
      email: String,
      numEtudiant: String,
      cv: String,
      lettreMotivation: String
    }]
  });
  
  const Projet = mongoose.model('Projet', projetSchema);
  
  module.exports = Projet;