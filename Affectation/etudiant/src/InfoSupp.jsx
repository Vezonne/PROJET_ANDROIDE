import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Toolbar from './Toolbar';
import './InfoSupp.css';
import axios from 'axios';

const InfoSupp = () => {
  const { projectId } = useParams();
  const [projetsSelectionnes, setProjetsSelectionnes] = useState([]);
  const [infos, setInfos] = useState([]);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const [scores, setScores] = useState({});
  const [descriptionProjet, setDescriptionProjet] = useState('');
  const [projetNom, setProjetNom] = useState('');
  const [nomGroupe, setNomGroupe] = useState('');
  const [numeroEtudiantError, setNumeroEtudiantError] = useState([]);
  const numerosEtudiants = ['28710401', '28710402', '28710403']; // exemple de liste de numeros d'etudiants qui seront acceptés



  const handleBackButton = () => {
    navigate('/classementProjets');
  };

  useEffect(() => {
    const projetIndex = projetsSelectionnes.findIndex(projet => projet._id === projectId);
    if (projetIndex !== -1) {
      const capaciteMax = projetsSelectionnes[projetIndex].capaciteMax;
      const newInfos = Array.from({ length: capaciteMax }, () => ({
        nom: '',
        prenom: '',
        numeroEtudiant: '',
        email: ''
      }));
      setNomGroupe('');
      setInfos(newInfos);
      setDescriptionProjet(projetsSelectionnes[projetIndex].informationsSupplementaires);
    } else
      if (projetsSelectionnes.length > 0) {
        // Naviguer vers la page d'indice projetsSelectionnes[0]._id
        navigate(`/infoSupp/${projetsSelectionnes[0]._id}`);
      }
  }, [projetsSelectionnes, projectId, navigate]);

  const handleInputChange = (index, name, value) => {

    const newInfos = [...infos];
    newInfos[index][name] = value;
    setInfos(newInfos);

    // Validation du numéro étudiant
    if (name === 'numeroEtudiant') {
      const isValid = numerosEtudiants.includes(value);
      const newNumeroEtudiantError = [...numeroEtudiantError];

      if (!isValid) {
        newNumeroEtudiantError[index] = 'Numéro étudiant invalide';
        setNumeroEtudiantError(newNumeroEtudiantError);
      } else {
        newNumeroEtudiantError[index] = 'Numéro étudiant valide';
        setNumeroEtudiantError(newNumeroEtudiantError);
      }
    }

    const scoresLocalStorage = localStorage.getItem('scores');

    if (scoresLocalStorage) {
      setScores(JSON.parse(scoresLocalStorage));
    }

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    const invalidNumeroEtudiantIndex = numeroEtudiantError.findIndex(error => error !== 'Numéro étudiant valide');
    if (invalidNumeroEtudiantIndex !== -1) {
      // Il existe au moins un numéro étudiant invalide
      console.error('Au moins un numéro étudiant est invalide.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/projets/${projectId}/groupe/`, {
        nom: nomGroupe,
        rang: scores[projectId],
        candidats: infos
      });
      console.log('Groupe ajouté avec succès :', response.data);

    } catch (error) {
      console.error('Erreur lors de l\'ajout du groupe :', error);
    }

    // Vérifier que tous les scores sont renseignés
    const allScoresPresent = Object.values(scores).every(score => score !== '');

    if (!allScoresPresent) {
      // Afficher une alerte si tous les scores ne sont pas renseignés
      window.alert("Veuillez sélectionner un score pour chaque projet avant de soumettre puis rentrer les informations des participants à nouveau.");
      //reinitialiser les champs
      setInfos(infos.map(info => ({
        nom: '',
        prenom: '',
        email: '',
        numeroEtudiant: ''
      })));
      setNomGroupe('');
      return; // Arrêter la fonction si les scores ne sont pas tous renseignés
    }



    console.log('Informations soumises :', infos);
    // Réinitialiser les champs après la soumission
    setInfos(infos.map(info => ({
      nom: '',
      prenom: '',
      email: '',
      numeroEtudiant: ''
    })));
    setNomGroupe('');



    // Marquer le projet soumis comme soumis
    const updatedProjetsSelectionnes = projetsSelectionnes.map(projet => {

      if (projet._id === projectId) {

        return { ...projet, submitted: true };
      } else {
        return projet;
      }
    });
    setProjetsSelectionnes(updatedProjetsSelectionnes);

    // Enregistrer la mise à jour dans le localStorage
    localStorage.setItem('projetsSelectionnes', JSON.stringify(updatedProjetsSelectionnes));
    modifierCount(count - 1);

    // Naviguer vers le premier projet non soumis
    const prochainProjet = updatedProjetsSelectionnes.find(projet => !projet.submitted);
    if (prochainProjet) {
      navigate(`/infoSupp/${prochainProjet._id}`);
    } else {
      navigate('/classementProjets');
    }

  };



  const modifierCount = (val) => {
    setCount(val);
  };

  useEffect(() => {
    const panierLocalStorage = localStorage.getItem('projetsSelectionnes');
    if (panierLocalStorage && JSON.parse(panierLocalStorage).length > 0) {
      setProjetsSelectionnes(JSON.parse(panierLocalStorage));
    } else {
      window.alert("Vous n'avez pas encore sélectionné de projets ou vous les avez tous supprimés. Vous allez être redirigé vers la page de classement des projets.");
      navigate('/classementProjets');
    }
  }, [count]);

  useEffect(() => {
    const scoresLocalStorage = localStorage.getItem('scores');

    if (scoresLocalStorage) {
      setScores(JSON.parse(scoresLocalStorage));
    }
  }, []);


  useEffect(() => {
    console.log("scores :", scores);
  }, [scores]);


  useEffect(() => {
    console.log("Valeur actuelle de projetsSelectionnes :", projetsSelectionnes);
  }, [projetsSelectionnes]);

  useEffect(() => {
    const projet = projetsSelectionnes.find(projet => projet._id === projectId);
    if (projet) {
      setProjetNom(projet.nom);
    }
  }, [projetsSelectionnes, projectId]);


  // Naviguer vers le prochain projet non soumis
  useEffect(() => {
    if (projetsSelectionnes && projetsSelectionnes.length > 0) {
      const prochainProjet = projetsSelectionnes.find(projet => !projet.submitted);
      console.log('prochainProjet :', prochainProjet);
      if (prochainProjet) {
        navigate(`/infoSupp/${prochainProjet._id}`);
      } else {
        navigate('/classementProjets');
      }
    }
  }, [projetsSelectionnes]);


  return (
    <div className='toolbar-container'>
      <div className='button-Back-global-container'>
        <div className='form-container'>
          <h1 className='h1'>{projetNom}</h1>
          <p className='paragraphe'>
            Merci de remplir les informations requises pour chaque participant. Si vous êtes en dessous du nombre maximal de candidats, remplissez les champs restants avec des ***.
            <br />
            Vous devez cependant etre au moins la capacité minimum du projet pour pouvoir postuler, sinon vous ne serez pas pris en compte.
            <br />
            ATTENTION : se mettre dans participant n°1, pour que le score associé soit le bon.
          </p>
          <h2>Description du projet :  </h2>
          <p>{descriptionProjet}</p>
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="nomGroupe">Nom du groupe : </label>
            <input
              type="text"
              value={nomGroupe}
              onChange={(e) => setNomGroupe(e.target.value)}
              required
            />
            {(() => {
              const elements = [];
              for (let index = 0; index < infos.length; index++) {
                elements.push(
                  <div key={index}>
                    <h3 className='h3'>Participant {index + 1}</h3>
                    <label>
                      Nom :
                      <input
                        type="text"
                        value={infos[index].nom}
                        onChange={(e) => handleInputChange(index, 'nom', e.target.value)}
                        required
                      />
                    </label>
                    <br />
                    <label>
                      Prénom :
                      <input
                        type="text"
                        value={infos[index].prenom}
                        onChange={(e) => handleInputChange(index, 'prenom', e.target.value)}
                        required
                      />
                    </label>
                    <br />
                    <label>
                      Numéro Étudiant :
                      <input
                        type="text"
                        value={infos[index].numeroEtudiant}
                        onChange={(e) => handleInputChange(index, 'numeroEtudiant', e.target.value)}
                        required
                      />
                      {numeroEtudiantError[index] && (
                        <span style={{ color: numeroEtudiantError[index] === 'Numéro étudiant valide' ? 'green' : 'red' }}>
                          {numeroEtudiantError[index]}
                        </span>
                      )}
                    </label>
                    <br />
                    <label>
                      Email :
                      <input
                        type="text"
                        value={infos[index].email}
                        onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                        required
                      />
                    </label>
                    <br />
                  </div>
                );
              }
              return elements;
            })()}
            <div className='button-container-submit' >
              <button className="submit-button" type="submit">Soumettre</button>
            </div>
          </form>
        </div>
        <div className='button-back-container'>
          <button className='retour-button-info' onClick={handleBackButton}>Retour</button>
        </div>
      </div>
      <Toolbar count={count} modifierVal={modifierCount} />
    </div>
  );
};

export default InfoSupp;
