const mongoose = require('mongoose');

// Schéma pour un candidat
const CandidatSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: String,
  numeroEtudiant: String,
  cv: String,
  lettreMotivation: String
});

// Schéma pour un groupe
const GroupeSchema = new mongoose.Schema({
  nom: String,
  rang : String,
  candidats: [CandidatSchema] // Liste de candidats dans ce groupe
});

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
  groupes: [GroupeSchema], // Liste de groupes candidats au projet
  classement: {
    type: Map, // Utilisation de Map pour stocker un dictionnaire
    of: String // Les valeurs seront des chaînes de caractères
  }
});

const Projet = mongoose.model('Projet', projetSchema);

module.exports = Projet;
