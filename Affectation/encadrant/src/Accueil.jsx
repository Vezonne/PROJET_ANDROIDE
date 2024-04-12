import React from 'react';
import { Link } from 'react-router-dom';
import './Accueil.css'


function Accueil() {
  return (
    <div className='accueil-container'>
      <h1>Bienvenue sur le site de création de projets</h1>
      <p>
        Sur ce site, vous pouvez creer des projets et les publier.
        <br />
        Ils apparaitront dans la liste des projets disponibles pour les étudiants.
      </p>
      <Link to="/ajoutProjet">
        <button>Classement des projets</button>
      </Link>
    </div>
  );
}

export default Accueil;
