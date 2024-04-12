import React from 'react';
import './ClassementProjets.css';
import { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import Toolbar from './Toolbar';

const ClassementProjets = () => {
  // Exemple de projet en attendant le backend
  const projets = [
    {
        id: 1,
        responsable: "Prof Shen",
        capaciteMin: "2",
        capaciteMax: "4",
        nom: "Projet 1",
        description: "Description du projet 1",
        informationsSupplementaires: "Informations supplémentaires pour le projet 1",
        submitted : false,
        score : null,
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
        capaciteMin: "2",
        capaciteMax: "2",
        nom: "Projet 2",
        description: "Description du projet 2",
        informationsSupplementaires: "Informations supplémentaires pour le projet 2",
        submitted : false,
        score : null,
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
        capaciteMin: "2",
        capaciteMax: "2",
        nom: "Projet 3",
        description: "Description du projet 2",
        informationsSupplementaires: "Informations supplémentaires pour le projet 2",
        submitted : false,
        score : null,
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
        capaciteMin: "2",
        capaciteMax: "4",
        nom: "Projet 4",
        description: "Description du projet 2",
        informationsSupplementaires: "Projet de recherche sur l'intelligence artificielle",
        submitted : false,
        score : null,
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
        capaciteMin: "2",
        capaciteMax: "2",
        nom: "Projet 5",
        description: "Description du projet 1",
        informationsSupplementaires: "Informations supplémentaires pour le projet 1",
        submitted : false,
        score : null,
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
        capaciteMin: "2",
        capaciteMax: "4",
        nom: "Projet 6",
        description: "Description du projet 2",
        informationsSupplementaires: "Informations supplémentaires pour le projet 2",
        submitted : false,
        score : null,
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
        capaciteMin: "2",
        capaciteMax: "4",
        nom: "Projet 7",
        description: "Description du projet 2",
        informationsSupplementaires: "Informations supplémentaires pour le projet 2",
        submitted : false,
        score : null,
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
        capaciteMin: "4",
        capaciteMax: "4",
        nom: "Projet 8",
        description: "Description du projet 2",
        informationsSupplementaires: "Informations supplémentaires pour le projet 2",
        submitted : false,
        score : null,
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
  const [count, setCount] = useState(0);
  const [scores, setScores] = useState({});

  useEffect(() => {
    const scoresLocalStorage = localStorage.getItem('scores');
    if (scoresLocalStorage) {
      setScores(JSON.parse(scoresLocalStorage));
    }
  }, [count]);


  // Fonction de gestion du clic sur la flèche déroulante pour afficher les informations supplémentaires
  const toggleInformationsSupplementaires = (projetId) => {
    setProjetsEtendus({
      ...projetsEtendus,
      [projetId]: !projetsEtendus[projetId]
    });
  };

  const modifierCount = (val) => {
    setCount(val);
  }

  // Fonction de gestion du clic sur le bouton d'ajout d'un projet
  const addProject = (projet) => {

    if(!projetsSelectionnes.find(p => p.id === projet.id)){
      //fenetre de confirmation pour l'ajout du projet
      //const confirmation = window.confirm(`Êtes-vous sûr de vouloir vous ajouter ce projet "${projets[projet.id-1].nom}" ?`)
      //if (confirmation) {
      const updatedProjetsSelectionnes = [...projetsSelectionnes, projet];
      const sortedProjetsSelectionnes = updatedProjetsSelectionnes.sort((a, b) => a.id - b.id);
      
      const newScores = { ...scores };
      newScores[projet.id] = ''; // Score vide
      
      setProjetsSelectionnes(sortedProjetsSelectionnes);
      setScores(newScores);

      localStorage.setItem('projetsSelectionnes', JSON.stringify(sortedProjetsSelectionnes));
      localStorage.setItem('scores', JSON.stringify(newScores));
      console.log("localStorage.getItem('scores') :", localStorage.getItem('scores'));
      //}

      // window.location.reload();

      modifierCount(count + 1);

    }
  };

  useEffect(() => {
    const panierLocal = localStorage.getItem('projetsSelectionnes');
    if(panierLocal){
      setProjetsSelectionnes(JSON.parse(panierLocal));
    }
  }, [count]);



  const handleClick = () => {
    if(projetsSelectionnes.length === 0){
      window.alert("Vous devez selectionner au moins un projet pour continuer");
    }
      else{
        navigate(`/infoSupp/${projetsSelectionnes[0].id}`);
      }

  };

  const handleclickBack = () => {
    navigate('/');
  };


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
                          <td>
                            {projet.capaciteMax === projet.capaciteMin
                              ? projet.capaciteMin
                              : `${projet.capaciteMin}-${projet.capaciteMax}`}
                          </td>
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
          <Toolbar count={count} modifierVal = {modifierCount}></Toolbar>
          </div>
      </div>
  );
}

export default ClassementProjets;
