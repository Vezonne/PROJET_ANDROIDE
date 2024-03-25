import React from 'react';
import './ClassementProjets.css'
import { useState, useEffect } from 'react';

function ClassementProjets() {
  // Exemple de projet en attendant le back
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

  ];

  const [projetsEtendus, setProjetsEtendus] = useState({});
  const [projetsPositionnes, setProjetsPositionnes] = useState([]);

  // Fonction de gestion du clic sur la flèche déroulante pour afficher les informations supplémentaires
  const toggleInformationsSupplementaires = (projetId) => {
    setProjetsEtendus({
      ...projetsEtendus,
      [projetId]: !projetsEtendus[projetId]
    });
  };

  const handleClick = (projetId) => {
    
    const confirmation = window.confirm(`Êtes-vous sûr de vouloir vous positionner sur le projet "${projets[projetId-1].nom}" ?`)
    if (confirmation) {
      setProjetsPositionnes([...projetsPositionnes,projetId]);
      console.log("Vous vous êtes positionné sur le projet avec l'ID :", projetId);
    }
    
  };

  useEffect(() => {
    console.log("Valeur actuelle de projetsPositionnes :", projetsPositionnes);
  }, [projetsPositionnes]);

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
            <tr>
                <td>{projet.nom}</td>
                <td>{projet.responsable}</td>
                <td>{projet.capacite}</td>
                <td>{projet.description}</td>
                <td>
                <button className='positionnement-button' onClick={() => handleClick(projet.id)} disabled={projetsPositionnes.includes(projet.id)}>
                    Se positionner dans ce projet
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
  );
}

export default ClassementProjets;
