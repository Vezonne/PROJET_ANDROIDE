import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClassementEtudiant.css';

const ClassementEtudiant = () => {
    const [groupes, setGroupes] = useState([]);
    const [projets, setProjets] = useState([]);
    const [maxNombreCandidats, setMaxNombreCandidats] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/projets');
                setProjets(response.data);
                console.log('Projets récupérés:', response.data);

                // Trouver le nombre maximum de candidats parmi tous les projets
                let max = 0;
                response.data.forEach(projet => {
                    projet.groupes.forEach(groupe => {
                        if (groupe.candidats.length > max) {
                            max = groupe.candidats.length;
                        }
                    });
                });
                setMaxNombreCandidats(max);
            } catch (error) {
                console.error('Erreur lors de la récupération des projets:', error);
            }
        };

        fetchData();
    }, []);

    const handleScoreChange = (projectId, groupeId, score) => {
        const updatedProjets = projets.map(projet => {
            if (projet._id.$oid === projectId) {
                projet.classement[groupeId] = score; // Mettre à jour le score du groupe dans le classement
            }
            return projet;
        });
        setProjets(updatedProjets);
        // Vous pouvez également envoyer les données mises à jour au serveur ici
    };

    return (
        <div className="classement-container">
            <h2>Liste des projets avec leurs groupes</h2>
            <ul className="projets-list">
                {projets.map((projet, projetIndex) => (
                    <li key={projetIndex}>
                        <h3>{projet.nom}</h3>
                        {projet.groupes.length === 0 ? (
                            <p>Pas encore de candidat</p>
                        ) : (
                            <ul className="groupes-list">
                                {projet.groupes.map((groupe, groupeIndex) => (
                                    <li key={groupeIndex}>
                                        <p>Groupe {groupeIndex + 1}:</p>
                                        <div>
                                            <label htmlFor={`score_${projetIndex}_${groupeIndex}`}>Score:</label>
                                            <select
                                                id={`score_${projetIndex}_${groupeIndex}`}
                                                value={projet.classement[groupe._id.$oid] || ""}
                                                onChange={e => handleScoreChange(projet._id.$oid, groupe._id.$oid, e.target.value)}
                                            >
                                                <option value="">Sélectionner un score</option>
                                                {[...Array(maxNombreCandidats).keys()].map(score => (
                                                    <option key={score + 1} value={score + 1}>{score + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClassementEtudiant;
