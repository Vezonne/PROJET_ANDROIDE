import React, { useEffect, useState } from 'react';
import './Toolbar.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const Toolbar = ({count, modifierVal}) => {

    const [projetsSelectionnes, setProjetsSelectionnes] = useState([]);
    const [scores, setScores] = useState({});
    const navigate = useNavigate();
    const location = useLocation();


    const cpt = count;

    const handleScoreChange = (projetId, score) => {
        //parcourir les projets sélectionnés et supprimer le score si le score est le même
        projetsSelectionnes.forEach(projet => { 
          if(scores[projet._id] === score){
            setScores(prevScores => ({
              ...prevScores,
              [projet._id]: ''
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
        const updatedProjetsSelectionnes  = projetsSelectionnes.filter(projet => projet._id !== projetId);
        setProjetsSelectionnes(updatedProjetsSelectionnes );
    
        // Supprimer le score associé au projet
        const nouveauxScores = { ...scores };
        delete nouveauxScores[projetId];
        setScores(nouveauxScores);

        localStorage.setItem('scores', JSON.stringify(nouveauxScores));
        localStorage.setItem('projetsSelectionnes', JSON.stringify(updatedProjetsSelectionnes ));

        // window.location.reload();
        
        if(location.pathname !== "/classementProjets"){
          navigate(`/infoSupp/${projetsSelectionnes[0]._id}`);
        }
        modifierVal(cpt - 1);
    };

    useEffect(() => {
        const panierLocalStorage = localStorage.getItem("projetsSelectionnes"); 
        if (panierLocalStorage) {
            setProjetsSelectionnes(JSON.parse(panierLocalStorage));
        }
    }
    , [cpt]);

    useEffect(() => {
      const scoresLocalStorage = localStorage.getItem('scores');
      if (scoresLocalStorage) {
        setScores(JSON.parse(scoresLocalStorage));
      }
    }, [cpt]);
    

    useEffect(() => {
      console.log("Valeur actuelle de projetsSelectionnes :", projetsSelectionnes);
    }
    , [projetsSelectionnes]);

    useEffect(() => {
      localStorage.setItem('scores', JSON.stringify(scores));
      console.log("scores :", scores);
    }, [scores]);
    
    return (
        <div className='selection-toolbar'>
          <h2>Projets Sélectionnés</h2>
            <ul className='toolbar-list'>
              {projetsSelectionnes.map(projet => (
                <div>
                  {projet.submitted ? (
                  <li key={projet._id} className='toolbar-item-disable'>

                      <span className='link-disable'>
                      {projet.nom} - Score : {scores[projet._id]}
                      </span> 
                      <button className='toolbar-button' type="button" onClick={() => handleRemoveProject(projet._id)}>Supprimer</button>

                </li>
                ) : (
                  <li key={projet._id} className='toolbar-item'>
                      <NavLink className='info-sup-link' to={`/infoSupp/${projet._id}`}>
                      {projet.nom} - Score :
                      </NavLink>
                    
                      <select className='projet-select' value={scores[projet._id] || ''} onChange={(e) => handleScoreChange(projet._id, e.target.value)}>
                        <option value="">Sélectionnez un score</option>
                        {Array.from({ length: projetsSelectionnes.length }, (_, i) => i + 1).map(score => (
                          <option key={score} value={score}>{score}</option>
                        ))}
                      </select>
                  <button className='toolbar-button' type="button" onClick={() => handleRemoveProject(projet._id)}>Supprimer</button>
                </li>
                )}
                </div>
              ))}
            </ul>
        </div>
      );
    }


export default Toolbar;