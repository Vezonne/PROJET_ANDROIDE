import React from 'react';
import './ClassementProjets.css';
import { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import Toolbar from './Toolbar';

function ClassementProjets() {
  // Exemple de projet en attendant le backend
  const projets = [
    {
        id: 1,
        responsable: "Prof Shen",
        capacite: "2-4",
        nom: "Projet 1",
        description: "Description du projet 1",
        informationsSupplementaires: "Informations supplémentaires pour le projet 1",
        candidats: [
          {
            nom: "Nom du candidat",
            prenom: "Prénom du candidat",
            email: "email@example.com",
            numEtudiant: "Numéro étudiant",
            cv: "", // Chemin vers le CV du candidat
            lettreMotivation: "" // Chemin vers la lettre de motivation du candidat
          }
        ]
      },
      {
        id: 2,
        responsable: "Prof Rayan",
        capacite: "2",
        nom: "Projet 2",
        description: "Description du projet 2",
        informationsSupplementaires: "Informations supplémentaires pour le projet 2",
        candidats: [
          {
            nom: "Nom du candidat",
            prenom: "Prénom du candidat",
            email: "email@example.com",
            numEtudiant: "Numéro étudiant",
            cv: "", // Chemin vers le CV du candidat
            lettreMotivation: "" // Chemin vers la lettre de motivation du candidat
          }
        ]
      },
      {
        id: 3,
        responsable: "Prof george",
        capacite: "2",
        nom: "Projet 3",
        description: "Description du projet 2",
        informationsSupplementaires: "Informations supplémentaires pour le projet 2",
        candidats: [
          {
            nom: "Nom du candidat",
            prenom: "Prénom du candidat",
            email: "email@example.com",
            numEtudiant: "Numéro étudiant",
            cv: "", // Chemin vers le CV du candidat
            lettreMotivation: "" // Chemin vers la lettre de motivation du candidat
          }
        ]
      },
      {
        id: 4,
        responsable: "Prof alex",
        capacite: "2",
        nom: "Projet 4",
        description: "Description du projet 2",
        informationsSupplementaires: "Informations supplémentaires pour le projet 2",
        candidats: [
          {
            nom: "Nom du candidat",
            prenom: "Prénom du candidat",
            email: "email@example.com",
            numEtudiant: "Numéro étudiant",
            cv: "", // Chemin vers le CV du candidat
            lettreMotivation: "" // Chemin vers la lettre de motivation du candidat
          }
        ]
      },
      {
        id: 5,
        responsable: "Prof Shen",
        capacite: "2-4",
        nom: "Projet 1",
        description: "Description du projet 1",
        informationsSupplementaires: "Informations supplémentaires pour le projet 1",
        candidats: [
          {
            nom: "Nom du candidat",
            prenom: "Prénom du candidat",
            email: "email@example.com",
            numEtudiant: "Numéro étudiant",
            cv: "", // Chemin vers le CV du candidat
            lettreMotivation: "" // Chemin vers la lettre de motivation du candidat
          }
        ]
      },
      {
        id: 6,
        responsable: "Prof Rayan",
        capacite: "2",
        nom: "Projet 2",
        description: "Description du projet 2",
        informationsSupplementaires: "Informations supplémentaires pour le projet 2",
        candidats: [
          {
            nom: "Nom du candidat",
            prenom: "Prénom du candidat",
            email: "email@example.com",
            numEtudiant: "Numéro étudiant",
            cv: "", // Chemin vers le CV du candidat
            lettreMotivation: "" // Chemin vers la lettre de motivation du candidat
          }
        ]
      },
      {
        id: 7,
        responsable: "Prof george",
        capacite: "2",
        nom: "Projet 3",
        description: "Description du projet 2",
        informationsSupplementaires: "Informations supplémentaires pour le projet 2",
        candidats: [
          {
            nom: "Nom du candidat",
            prenom: "Prénom du candidat",
            email: "email@example.com",
            numEtudiant: "Numéro étudiant",
            cv: "", // Chemin vers le CV du candidat
            lettreMotivation: "" // Chemin vers la lettre de motivation du candidat
          }
        ]
      },
      {
        id: 8,
        responsable: "Prof alex",
        capacite: "2",
        nom: "Projet 4",
        description: "Description du projet 2",
        informationsSupplementaires: "Informations supplémentaires pour le projet 2",
        candidats: [
          {
            nom: "Nom du candidat",
            prenom: "Prénom du candidat",
            email: "email@example.com",
            numEtudiant: "Numéro étudiant",
            cv: "", // Chemin vers le CV du candidat
            lettreMotivation: "" // Chemin vers la lettre de motivation du candidat
          }
        ]
      },

  ];

  
  const [projetsEtendus, setProjetsEtendus] = useState({});
  const [projetsSelectionnes, setProjetsSelectionnes] = useState([]);
  const navigate = useNavigate();

  // Fonction de gestion du clic sur la flèche déroulante pour afficher les informations supplémentaires
  const toggleInformationsSupplementaires = (projetId) => {
    setProjetsEtendus({
      ...projetsEtendus,
      [projetId]: !projetsEtendus[projetId]
    });
  };


  // Fonction de gestion du clic sur le bouton d'ajout d'un projet
  const addProject = (projet) => {

    if(!projetsSelectionnes.find(p => p.id === projet.id)){
      //fenetre de confirmation pour l'ajout du projet
      //const confirmation = window.confirm(`Êtes-vous sûr de vouloir vous ajouter ce projet "${projets[projet.id-1].nom}" ?`)
      //if (confirmation) {
      const updatedProjetsSelectionnes = [...projetsSelectionnes, projet];
      setProjetsSelectionnes(updatedProjetsSelectionnes);
      localStorage.setItem('projetsSelectionnes', JSON.stringify(updatedProjetsSelectionnes));
      console.log("Vous vous êtes positionné sur le projet avec l'ID :", projet.id);
      //}

      window.location.reload();
    }
  };

  useEffect(() => {
    const panierLocal = localStorage.getItem('projetsSelectionnes');
    if(panierLocal){
      setProjetsSelectionnes(JSON.parse(panierLocal));
    }
  }, [projetsSelectionnes]);


  const handleClick = () => {
    navigate('/infoSupp');
  };

  const handleclickBack = () => {
    navigate('/');
  };

  useEffect(() => {
    console.log("Valeur actuelle de projetsSelectionnes :", projetsSelectionnes);
  }, [projetsSelectionnes]);


  return (
    <div className='outlet-toolbar-container'>
      <div className='button-projet-container'>
        <div className='projet-container'>
          <h1>Liste des Projets</h1>
            <table className='projets-table'>
              <thead>
                <tr>
                  <th>Titre du Projet</th>
                  <th>Responsable</th>
                  <th>Capacité</th>
                  <th>Description</th>
                </tr>
              </thead>
                <tbody>
                  {projets.map(projet => (
                    <React.Fragment key={projet.id}>
                      <tr key = {projet.id}>
                          <td>{projet.nom}</td>
                          <td>{projet.responsable}</td>
                          <td>{projet.capacite}</td>
                          <td>{projet.description}</td>
                          <td>
                          <button className='add-button' onClick={() => addProject(projet)} disabled={projetsSelectionnes.some(p => p.id === projet.id)}>
                              +
                          </button>
                          </td>
                          <td> 
                          <button
                              className="arrow-button" 
                              onClick={() => toggleInformationsSupplementaires(projet.id)}
                          >
                              {projetsEtendus[projet.id] ? '↑' : '↓'}
                          </button>
                          </td>
                      </tr>
                      {projetsEtendus[projet.id] && (
                          <tr>
                          <td colSpan="5" className="informations-supplementaires">
                              {projet.informationsSupplementaires}
                          </td>
                          </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              </div>
          
          <div className='button-container'>
              <button className='retour-button' onClick={handleclickBack}>Retour</button>
              <button className='suivant-button' onClick={handleClick}>Étape suivante</button>
          </div>
          </div>
          <Toolbar className='toolbar' ></Toolbar>
      </div>
  );
}

export default ClassementProjets;
