import React from 'react';
import './ClassementProjets.css'
import { useState, useEffect } from 'react';

function ClassementProjets() {
  // Exemple de projet en attendant le backend
  const projets = [
    {
        id: 1,
        responsable: "Prof Shen",
        capacite: "2-4",
        nom: "Projet 1",
        description: "Description du projet 1",
        informationsSupplementaires: "Informations supplémentaires pour le projet 1"
      },
      {
        id: 2,
        responsable: "Prof Rayan",
        capacite: "2",
        nom: "Projet 2",
        description: "Description du projet 2",
        informationsSupplementaires: "Informations supplémentaires pour le projet 2"
      },
      {
        id: 3,
        responsable: "Prof george",
        capacite: "2",
        nom: "Projet 3",
        description: "Description du projet 2",
        informationsSupplementaires: "Informations supplémentaires pour le projet 2"
      },
      {
        id: 4,
        responsable: "Prof alex",
        capacite: "2",
        nom: "Projet 4",
        description: "Description du projet 2",
        informationsSupplementaires: "Informations supplémentaires pour le projet 2"
      },
      {
        id: 5,
        responsable: "Prof Shen",
        capacite: "2-4",
        nom: "Projet 1",
        description: "Description du projet 1",
        informationsSupplementaires: "Informations supplémentaires pour le projet 1"
      },
      {
        id: 6,
        responsable: "Prof Rayan",
        capacite: "2",
        nom: "Projet 2",
        description: "Description du projet 2",
        informationsSupplementaires: "Informations supplémentaires pour le projet 2"
      },
      {
        id: 7,
        responsable: "Prof george",
        capacite: "2",
        nom: "Projet 3",
        description: "Description du projet 2",
        informationsSupplementaires: "Informations supplémentaires pour le projet 2"
      },
      {
        id: 8,
        responsable: "Prof alex",
        capacite: "2",
        nom: "Projet 4",
        description: "Description du projet 2",
        informationsSupplementaires: "Informations supplémentaires pour le projet 2"
      },

  ];

  
  const [projetsEtendus, setProjetsEtendus] = useState({});
  const [projetsSelectionnes, setProjetsSelectionnes] = useState([]);
  const [scores, setScores] = useState({});

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
        setProjetsSelectionnes([...projetsSelectionnes,projet]);
        console.log("Vous vous êtes positionné sur le projet avec l'ID :", projet.id);
      //}
    }
  };

  const handleScoreChange = (projetId, score) => {
    //parcourir les projets sélectionnés et supprimer le score si le score est le même
    projetsSelectionnes.forEach(projet => { 
      if(scores[projet.id] === score){
        setScores(prevScores => ({
          ...prevScores,
          [projet.id]: ''
        }));
      }
    });
    // Met à jour le score du projet
    setScores(prevScores => ({
      ...prevScores,
      [projetId]: score
    }));
  };

  const handleRemoveProject = (projetId) => {
    // Supprime le projet de la liste des projets sélectionnés
    setProjetsSelectionnes(prevProjets => prevProjets.filter(projet => projet.id !== projetId)); 
    
    //supprime le score associé au projet
    const newScores = { ...scores };
    delete newScores[projetId];

    setScores(newScores); 


  };

  useEffect(() => {
    console.log("Valeur actuelle de projetsPositionnes :", projetsSelectionnes);
  }, [projetsSelectionnes]);

  useEffect(() => {
    console.log("Valeur actuelle de scores :", scores);
  }, [scores]);

  return (
    <div className='classement-projets-container'>
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
      <div className='selection'>
        <h2>Projets Sélectionnés</h2>
          <ul >
            {projetsSelectionnes.map(projet => (
              <li key={projet.id}>
              {projet.nom} - Score :
              <select className='projet-select' value={scores[projet.id] || ''} onChange={(e) => handleScoreChange(projet.id, e.target.value)}>
                <option value="" >Sélectionnez un score</option>
                {Array.from({ length: projetsSelectionnes.length }, (_, i) => i + 1).map(score => (
                  <option key={score} value={score}>{score}</option>
                ))}
              </select>
              <button className='supp-button' type="button" onClick={() => handleRemoveProject(projet.id)}>Supprimer</button>
            </li>
            ))}
          </ul>
        </div>
    </div>
  );
}

export default ClassementProjets;
