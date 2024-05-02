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

      <p>
        vous pouvez aussi donner votre liste de préférence en fonction des étudiants qui ont candidatés.
      </p>
      <div className='button-container'>
        <Link to="/ajoutProjet">
          <button className='btn-proj'>Création et visualisation des projets</button>
        </Link>
        <Link to="/classementEtudiant">
          <button className='btn-etu'>Classement des etudiants</button>
        </Link>
      </div>
    </div>
  );
}

export default Accueil;
