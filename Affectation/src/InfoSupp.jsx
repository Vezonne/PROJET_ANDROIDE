import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './InfoSupp.css';

const InfoSupp = () => {
    const location = useLocation();
    const projetsSelectionnes = location.state ? location.state.projetsSelectionnes : [];

    const [infosGenerales, setInfosGenerales] = useState({
        nom: "",
        prenom: "",
        email: "",
        numeroEtudiant: ""
    });

    const handleInfosGeneralesChange = (e) => {
        const { name, value } = e.target;
        setInfosGenerales(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    return (
        <div className="infos-supp-container">
            <h1>Informations Générales</h1>
            <form className="infos-form">
                <div className="infos-generales">
                    <input type="text" name="nom" value={infosGenerales.nom} onChange={handleInfosGeneralesChange} placeholder="Nom" />
                    <input type="text" name="prenom" value={infosGenerales.prenom} onChange={handleInfosGeneralesChange} placeholder="Prénom" />
                    <input type="email" name="email" value={infosGenerales.email} onChange={handleInfosGeneralesChange} placeholder="Email" />
                    <input type="text" name="numeroEtudiant" value={infosGenerales.numeroEtudiant} onChange={handleInfosGeneralesChange} placeholder="Numéro étudiant" />
                </div>
                <h2>Informations Spécifiques aux Projets</h2>
                <div className="projets-info">
                    {projetsSelectionnes.map((projet, index) => (
                        <div key={index} className="projet-info">
                            <h3>{projet.nom}</h3>
                            <div className="candidats-inputs">
                                {[...Array(Number(projet.capacite))].map((_, index) => (
                                    <div key={index} className="candidat-input">
                                        <input type="text" name="nom" placeholder="Nom" />
                                        <input type="text" name="prenom" placeholder="Prénom" />
                                        <input type="email" name="email" placeholder="Email" />
                                        <input type="text" name="numeroEtudiant" placeholder="Numéro étudiant" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <button type="submit" className="submit-btn">Soumettre</button>
            </form>
        </div>
    );
};

export default InfoSupp;