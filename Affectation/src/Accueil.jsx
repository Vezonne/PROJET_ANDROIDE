import React from 'react';
import { Link } from 'react-router-dom';
import './Accueil.css'


function Accueil() {
  return (
    <div className='accueil-container'>
      <h1>Bienvenue sur le site de candidature aux projets</h1>
      <p>
        Sur ce site, vous pouvez candidater à une liste de projets proposés par des enseignants.
        Classez les projets en fonction de vos préférences et soumettez votre candidature.
      </p>
      <Link to="/classementProjets">
        <button>Classement des projets</button>
      </Link>
    </div>
  );
}

export default Accueil;
