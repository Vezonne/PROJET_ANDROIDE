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
        groupes: req.body.groupes || [],
        classement: req.body.classement || new Map()
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
                groupes: req.body.groupes
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

module.exports.getAllGroupesCandidats = async (req, res) => {
    const {id} = req.params;
    try {
        const projet = await ProjetModel.findById(id);
        if (!projet) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }
        res.status(200).json(projet.groupes);
    }
    catch (err) {
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des groupes avec candidats' });
    }
};

module.exports.addGroupeCandidats = async (req, res) => {
    const {id} = req.params;
    const {nom, candidats, score} = req.body;
    try {
        const projet = await ProjetModel.findById(id);
        if (!projet) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }
    
    const nouveauGroupe = {
        nom,
        score,
        candidats
    };
    projet.groupes.push(nouveauGroupe);
    await projet.save();
    res.status(201).json({ message: 'Groupe avec candidats créé avec succès', groupe: nouveauGroupe });
    }
    catch (err) {
        res.status(500).json({ message: 'Erreur serveur lors de la création du groupe avec candidats' });
    }

};


module.exports.deleteGroupeCandidats = async (req, res) => {
    const {id, groupeId} = req.params;
    try {
        const projet = await ProjetModel.findById(id);
        if (!projet) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }
        const groupe = projet.groupes.find(groupe => groupe._id == groupeId);
        if (!groupe) {
            return res.status(404).json({ message: 'Groupe non trouvé' });
        }
        projet.groupes = projet.groupes.filter(groupe => groupe._id != groupeId);
        await projet.save();
        res.status(200).json({ message: 'Groupe avec candidats supprimé avec succès' });
    }
    catch (err) {
        res.status(500).json({ message: 'Erreur serveur lors de la suppression du groupe avec candidats' });
    }
}


module.exports.getClassement = async (req, res) => {
    const {id} = req.params;
    try {
        const projet = await ProjetModel.findById(id);
        if (!projet) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }
        res.status(200).json(projet.classement);
    }
    catch (err) {
        res.status(500).json({ message: 'Erreur serveur lors de la récupération du classement' });
    }
};


module.exports.addClassement = async (req, res) => {

    const {id} = req.params;
    const {classement} = req.body;
    try {
        const projet = await ProjetModel.findById(id);
        if (!projet) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }
        projet.classement = classement;
        await projet.save();
        res.status(200).json({ message: 'Classement ajouté avec succès' });
    }
    catch (err) {
        res.status(500).json({ message: 'Erreur serveur lors de l\'ajout du classement' });
    }
};

