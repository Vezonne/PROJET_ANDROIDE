import React from 'react';
import './ClassementProjets.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toolbar from './Toolbar';


const ClassementProjets = () => {
  // Exemple de projet en attendant le backend
  const projets = [
    {
      _id: "661d8f4929ae726cebead501",
      responsable: "george",
      capaciteMin: 2,
      capaciteMax: 2,
      nom: "projet 1",
      description: "description du projet 1",
      informationsSupplementaires: "informations supplementaires du projet 1",
      submitted: false,
      groupes: [],
      __v: 2
    },
    {
      _id: "661d6d96ad83a91254aeca2a",
      responsable: "george",
      capaciteMin: 4,
      capaciteMax: 4,
      nom: "projet 2",
      description: "description du projet 2",
      informationsSupplementaires: "informations supplementaires du projet 1",
      submitted: false,
      groupes: [],
      __v: 2
    },
    {
      _id: "661d6da0ad83a91254aeca2c",
      responsable: "george",
      capaciteMin: 2,
      capaciteMax: 3,
      nom: "projet 3",
      description: "description du projet 3",
      informationsSupplementaires: "informations supplementaires du projet 1",
      submitted: false,
      groupes: [],
      __v: 2
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

  useEffect(() => {
    console.log('projets : ', projets);
  }, [projets]);


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

    if (!projetsSelectionnes.find(p => p._id === projet._id)) {
      //fenetre de confirmation pour l'ajout du projet
      //const confirmation = window.confirm(`Êtes-vous sûr de vouloir vous ajouter ce projet "${projets[projet._id-1].nom}" ?`)
      //if (confirmation) {
      const updatedProjetsSelectionnes = [...projetsSelectionnes, projet];
      const sortedProjetsSelectionnes = updatedProjetsSelectionnes.sort((a, b) => a._id - b._id);

      const newScores = { ...scores };
      newScores[projet._id] = ''; // Score vide

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
    if (panierLocal) {
      setProjetsSelectionnes(JSON.parse(panierLocal));
    }
  }, [count]);



  const handleClick = () => {
    if (projetsSelectionnes.length === 0) {
      window.alert("Vous devez selectionner au moins un projet pour continuer");
    }
    else {
      navigate(`/infoSupp/${projetsSelectionnes[0]._id}`);
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
                <React.Fragment key={projet._id}>
                  <tr key={projet._id}>
                    <td>{projet.nom}</td>
                    <td>{projet.responsable}</td>
                    <td>
                      {projet.capaciteMax === projet.capaciteMin
                        ? projet.capaciteMin
                        : `${projet.capaciteMin}-${projet.capaciteMax}`}
                    </td>
                    <td>{projet.description}</td>
                    <td>
                      <button className='add-button' onClick={() => addProject(projet)} disabled={projetsSelectionnes.some(p => p._id === projet._id)}>
                        +
                      </button>
                    </td>
                    <td>
                      <button
                        className="arrow-button"
                        onClick={() => toggleInformationsSupplementaires(projet._id)}
                      >
                        {projetsEtendus[projet._id] ? '↑' : '↓'}
                      </button>
                    </td>
                  </tr>
                  {projetsEtendus[projet._id] && (
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
        <Toolbar count={count} modifierVal={modifierCount}></Toolbar>
      </div>
    </div>
  );
}

export default ClassementProjets;
