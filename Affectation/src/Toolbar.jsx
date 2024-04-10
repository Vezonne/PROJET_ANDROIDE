import React, { useEffect, useState } from 'react';
import './Toolbar.css';

const Toolbar = () => {

    const [projetsSelectionnes, setProjetsSelectionnes] = useState([]);
    const [scores, setScores] = useState({});

    const handleScoreChange = (projetId, score) => {
        //parcourir les projets sélectionnés et supprimer le score si le score est le même
        projetsSelectionnes.forEach(projet => { 
          if(scores[projet.id] === score){
            setScores(prevScores => ({
              ...prevScores,
              [projet.id]: ''
            }));
          }
          else{
            setScores(prevScores => ({
              ...prevScores,
              [projetId]: score
            }));
          }
        });
    };

    

    const handleRemoveProject = (projetId) => {
        const updatedProjetsSelectionnes  = projetsSelectionnes.filter(projet => projet.id !== projetId);
        setProjetsSelectionnes(updatedProjetsSelectionnes );
    
        // Supprimer le score associé au projet
        const nouveauxScores = { ...scores };
        delete nouveauxScores[projetId];
        setScores(nouveauxScores);

        localStorage.setItem('projetsSelectionnes', JSON.stringify(updatedProjetsSelectionnes ));

    };

    useEffect(() => {
        const panierLocalStorage = localStorage.getItem("projetsSelectionnes"); 
        if (panierLocalStorage) {
            setProjetsSelectionnes(JSON.parse(panierLocalStorage));
        }
    }
    , []);

    useEffect(() => {
        console.log("Valeur actuelle de projetsSelectionnes :", projetsSelectionnes);
    }
    , [projetsSelectionnes]);

    useEffect(() => {
        console.log("Valeur actuelle de scores :", scores);
    }
    , [scores]);
    
    return (
        <div className='selection-toolbar'>
          <h2>Projets Sélectionnés</h2>
          <ul className='toolbar-list'>
            {projetsSelectionnes.map(projet => (
              <li key={projet.id} className='toolbar-item'>
                {projet.nom} - Score :
                <select className='projet-select' value={scores[projet.id] || ''} onChange={(e) => handleScoreChange(projet.id, e.target.value)}>
                  <option value="">Sélectionnez un score</option>
                  {Array.from({ length: projetsSelectionnes.length }, (_, i) => i + 1).map(score => (
                    <option key={score} value={score}>{score}</option>
                  ))}
                </select>
                <button className='toolbar-button' type="button" onClick={() => handleRemoveProject(projet.id)}>Supprimer</button>
              </li>
            ))}
          </ul>
        </div>
      );
    }


export default Toolbar;