import React, { useState } from 'react';
import { useLocation, useNavigate   } from 'react-router-dom';
import './InfoSupp.css';

const InfoSupp = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { projetsSelectionnes } = location.state;

    if (!projetsSelectionnes) {
        navigate('/classementProjets'); 
        return null; 
    }

    

    return (
        <div>
      <h2>Informations des projets sélectionnés :</h2>
      {projetsSelectionnes.map(projet => (
        <div key={projet.id}>
          <h3>{projet.nom}</h3>
          <p>{projet.description}</p>
          {/* Afficher d'autres informations du projet si nécessaire */}
        </div>
      ))}
    </div>
  );
};

export default InfoSupp;