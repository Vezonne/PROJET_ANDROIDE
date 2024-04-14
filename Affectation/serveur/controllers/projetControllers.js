const ProjetModel = require('../models/projetModel');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.getAllProjets = async (req, res) => {
    try{
        const projets = await ProjetModel.find().select();
        res.status(200).json(projets);
    } catch (err) {
        res.status(400).json({message: err});
    }  
};


module.exports.createProjet = async (req, res) => {
    const projet = new ProjetModel({
        responsable: req.body.responsable,
        capaciteMin: req.body.capaciteMin,
        capaciteMax: req.body.capaciteMax,
        nom: req.body.nom,
        description: req.body.description,
        informationsSupplementaires: req.body.informationsSupplementaires,
        submitted: req.body.submitted || false,
        score: req.body.score || null,
        candidats: req.body.candidats || []
    });
    try{
        const newProjet = await projet.save();
        res.status(201).json(newProjet);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};


module.exports.getProjetById = async (req, res) => {
    try {
        const projet = await ProjetModel.findById(req.params.id);
        if (projet){
            res.status(200).json(projet);
        }
        else{
            res.status(404).json({message: "Projet non trouvé"});
        }
    } catch (err) {
        res.status(500).json({message: err});
    }
};


module.exports.updateProjet = async (req, res) => {
    try {
        const updatedProjet = await ProjetModel.updateOne(
            {_id: req.params.id},
            {$set: {
                responsable: req.body.responsable,
                capaciteMin: req.body.capaciteMin,
                capaciteMax: req.body.capaciteMax,
                nom: req.body.nom,
                description: req.body.description,
                informationsSupplementaires: req.body.informationsSupplementaires,
                submitted: req.body.submitted,
                score: req.body.score,
                candidats: req.body.candidats
            }}
        );
        res.status(200).json(`project updated !`);
    }
    catch (err) {
        res.status(500).json({message: err});
    }
};

module.exports.deleteProjet = async (req, res) => {
    try {
        const projet = await ProjetModel.findByIdAndDelete(req.params.id);

        res.status(200).json({message : `${req.params.id} bien supprimé`});


	}catch(err){
	    res.status(500).json({message : `${req.params.id} pas supprimé ${err}`});
	}
  };