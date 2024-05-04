const router = require('express').Router();
const projetController = require('../controllers/projetControllers');
const multer = require('multer');
const upload = multer();


//recuperer tous les projets
router.get('/', projetController.getAllProjets);

// Créer un nouveau projet
router.post('/', projetController.createProjet);

// Obtenir un projet par son ID
router.get('/:id', projetController.getProjetById);

// Mettre à jour un projet
router.put('/:id', projetController.updateProjet);

// Supprimer un projet
router.delete('/:id', projetController.deleteProjet);

// Obtenir tous les groupes candidats d'un projet
router.get('/:id/groupe', projetController.getAllGroupesCandidats);

// Ajouter un groupe à un projet avec des candidats
router.post('/:id/groupe', projetController.addGroupeCandidats);

// supprimer un groupe d'un projet
router.delete('/:id/groupe/:groupeId', projetController.deleteGroupeCandidats);

// obtenir le classement d'un projet
router.get('/:id/classement', projetController.getClassement);

// ajouter un classement à un projet
router.post('/:id/classement', projetController.addClassement);

// supprimer un classement d'un projet
router.delete('/:id/classement', projetController.deleteClassement);

module.exports = router;