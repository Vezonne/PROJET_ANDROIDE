import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClassementEtudiant.css';

const ClassementEtudiant = () => {
    const [projets, setProjets] = useState([]);
    const [classement, setClassement] = useState({});
    const [expandedProjets, setExpandedProjets] = useState({});
    const [expandedCandidats, setExpandedCandidats] = useState({});
    const [projetsClassementEnvoye, setProjetsClassementEnvoye] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/projets');
                const projetsData = response.data;

                // Initialiser le classement
                const initialClassement = {};
                projetsData.forEach(projet => {
                    const projetId = projet._id;
                    initialClassement[projetId] = {}; // Initialiser chaque projet avec un dictionnaire vide
                    projet.groupes.forEach(groupe => {
                        initialClassement[projetId][groupe._id] = ''; // Initialiser chaque groupe avec un score vide
                    });
                });
                setClassement(initialClassement);

                setProjets(projetsData);
                console.log('Projets récupérés:', projetsData);
            } catch (error) {
                console.error('Erreur lors de la récupération des projets:', error);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        console.log('classement:', classement);
    }
        , [classement]);

    const handleScoreChange = (projectId, groupId, score) => {
        // Vérifier si la nouvelle valeur est déjà présente pour un autre groupe de ce projet
        const isScoreAlreadyUsed = Object.entries(classement[projectId]).find(([_, value]) => value === score);
        if (isScoreAlreadyUsed) {

            const [usedGroupId] = isScoreAlreadyUsed;
            setClassement(prevClassement => ({
                ...prevClassement,
                [projectId]: {
                    ...prevClassement[projectId],
                    [usedGroupId]: '', // Réinitialiser le score déjà utilisé à une chaîne vide ('')
                    [groupId]: score, // Mettre à jour le score pour le groupe spécifié
                },
            }));
        } else {
            // Mettre à jour le dictionnaire de scores avec le nouveau score pour le groupe spécifié
            setClassement(prevClassement => ({
                ...prevClassement,
                [projectId]: {
                    ...prevClassement[projectId],
                    [groupId]: score,
                },
            }));

        };
    };

    const toggleProjetExpansion = projectId => {
        setExpandedProjets(prevExpandedProjets => ({
            ...prevExpandedProjets,
            [projectId]: !prevExpandedProjets[projectId],
        }));
    };

    const toggleGroupeExpansion = (projectId, groupId) => {
        setExpandedCandidats(prevExpandedCandidats => ({
            ...prevExpandedCandidats,
            [`${projectId}_${groupId}`]: !prevExpandedCandidats[`${projectId}_${groupId}`],
        }));
    };

    const handleSubmit = async (projet) => {
        try {
            const classementData = {
                classement: {}
            };

            // Copier les données de classement existantes avec les IDs de groupe
            Object.keys(classement[projet._id]).forEach(groupeId => {
                classementData.classement[groupeId] = classement[projet._id][groupeId];
            });

            console.log('Envoi du classement:', classementData);
            const response = await axios.post(`http://localhost:5000/api/projets/${projet._id}/classement`, classementData);
            setProjetsClassementEnvoye(prevProjetsClassementEnvoye => ({
                ...prevProjetsClassementEnvoye,
                [projet._id]: true,
            }
            ));
            console.log('Classement envoyé:', response.data);
        } catch (error) {
            console.error('Erreur lors de l\'envoi du classement:', error);
        }
    };

    const checkScores = (projet) => {
        for (const groupe of projet.groupes) {
            if (classement[projet._id]?.[groupe._id] === '') {
                return false; // Désactive le bouton si un score est ''
            }
        }
        return true; // Active le bouton si tous les scores sont différents de ''
    };

    return (
        <div className="classement-container">
            <h2>Liste des projets avec leurs groupes</h2>
            <br />
            <div className='instructions-div'>
                <p>Vous pouvez affecter un classement sur les groupes qui ont candidatés à votre projet.</p>
                <p>Quelques instructions :</p>
                    <ul>
                        <li>Vous devez affecter un rang à chaque groupe qui a candidaté à votre projet pour envoyer.</li>
                        <li>Vous ne pouvez pas affecter le même rang à plusieurs groupes.</li>
                        <li>Vous pouvez cliquer sur la fleche à côté du nom du projet pour voir les groupes qui ont candidaté à ce projet.</li>
                        <li>Vous pouvez cliquer sur la fleche à côté du nom du groupe pour voir les candidats de ce groupe.</li>
                        <li>Une fois votre classement envoyé, il sera impossible de le modifier.</li>
                    </ul>
                
            </div>
            <ul className="projets-list">
                {projets.map(projet => (
                    <li key={projet._id} className={projetsClassementEnvoye[projet._id] ? 'classement-envoye' : ''}>

                        {projetsClassementEnvoye[projet._id] ? (
                            <div>
                                <span> Le classement a bien été envoyé pour le projet : {projet.nom}. Encadrant : {projet.responsable}.</span>
                            </div>
                        ) : (

                        <div>
                            <div className='deroule-div'>
                                <span>{projet.nom}. Encadrant : {projet.responsable}</span>
                                <button onClick={() => toggleProjetExpansion(projet._id)} style={{ cursor: 'pointer' }}>
                                    {expandedProjets[projet._id] ? '↑' : '↓'}
                                </button>
                            </div>


                            {expandedProjets[projet._id] && (
                                <ul className="groupes-list">
                                    {projet.groupes.map(groupe => (
                                        <li key={groupe._id}>
                                            <span>{groupe.nom}</span>
                                            <div className='select-container'>
                                                <select
                                                    value={classement[projet._id]?.[groupe._id] || ''}
                                                    onChange={e => handleScoreChange(projet._id, groupe._id, e.target.value)}
                                                >
                                                    <option value="">Sélectionner un rang</option>
                                                    {[...Array(projet.groupes.length).keys()].map(score => (
                                                        <option key={score + 1} value={score + 1}>{score + 1}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <button onClick={() => toggleGroupeExpansion(projet._id, groupe._id)} style={{ cursor: 'pointer' }}>
                                                {expandedCandidats[`${projet._id}_${groupe._id}`] ? '↑' : '↓'}
                                            </button>
                                            {expandedCandidats[`${projet._id}_${groupe._id}`] && (
                                                <ul>
                                                    {groupe.candidats.map(candidat => (
                                                        <li key={candidat._id}>
                                                            {candidat.nom} {candidat.prenom} ({candidat.numeroEtudiant})
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                    <button
                                        className='submit-button'
                                        onClick={() => handleSubmit(projet)}
                                        disabled={!checkScores(projet)}
                                    >
                                        Envoyer
                                    </button>
                                </ul>

                            )}
                        </div>
                        )}
                    </li>

                ))}
            </ul>
        </div>
    );

};


export default ClassementEtudiant;
