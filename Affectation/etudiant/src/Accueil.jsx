import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Accueil.css'
import axios from 'axios';

function Accueil() {

  const [projets, setProjets] = useState([]);

  const handleBack = async () => {
    try {
      const response = await axios.get('http://localhost:5000/');
      console.log(response);
    }
    catch (error) {
      console.log(error);
    }
    localStorage.clear();
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projets');
        setProjets(response.data);
        console.log('Projets récupérés:', response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
      }
    };
    fetchData();

    projets.forEach(projet => {
      if (projet.submitted === true) {
        projet.submitted = false;
      }
    });
  });




  return (
    <div className='accueil-container'>
      <h1>Bienvenue sur le site de candidature aux projets</h1>
      <p>
        Sur ce site, vous pouvez candidater à une liste de projets proposés par des enseignants.
        Classez les projets en fonction de vos préférences et soumettez votre candidature.
      </p>
      <Link to="/classementProjets">
        <button onClick={handleBack}>Classement des projets</button>
      </Link>
    </div>
  );
}

export default Accueil;
