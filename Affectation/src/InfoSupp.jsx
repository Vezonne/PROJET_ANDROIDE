import React, { useEffect, useState } from 'react';
import './InfoSupp.css';

const InfoSupp = () => {

    const [projetsSelectionnes, setProjetsSelectionnes] = useState([]);

    useEffect(() => {
      console.log("Valeur actuelle de projetsSelectionnes :", projetsSelectionnes);
    }, [projetsSelectionnes]);

    useEffect(() => {
      const panierLocalStorage = localStorage.getItem("projetsSelectionnes");
      if (panierLocalStorage) {
        setProjetsSelectionnes(JSON.parse(panierLocalStorage));
      }
    }
    , []);


    

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