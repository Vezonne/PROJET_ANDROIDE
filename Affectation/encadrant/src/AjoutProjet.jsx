import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AjoutProjet.css';

const AjoutProjet = () => {
    const [responsable, setResponsable] = useState('');
    const [capaciteMin, setCapaciteMin] = useState('');
    const [capaciteMax, setCapaciteMax] = useState('');
    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');
    const [informationsSupplementaires, setInformationsSupplementaires] = useState('');
    const [projects, setProjects] = useState([]);
    const [projetsEtendus, setProjetsEtendus] = useState({});
    const [cpt, setCpt] = useState(0);

    // Récupération des projets depuis l'API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/projets');
                setProjects(response.data);
                console.log('Projets récupérés:', response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des projets:', error);
            }
        };

        fetchData();
    }, [cpt]);



    // Fonction de soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (capaciteMin > capaciteMax) {
            alert('La capacité minimum doit être inférieure ou égale à la capacité maximum');
            return;
        }

        // Création de l'objet projet
        const newProject = {
            responsable: responsable,
            capaciteMin: capaciteMin,
            capaciteMax: capaciteMax,
            nom: nom,
            description: description,
            informationsSupplementaires: informationsSupplementaires,
            submitted: false,
            groupes: [],
        };

        try {
            console.log('Création du projet:', newProject);
            const response = await axios.post('http://localhost:5000/api/projets', newProject);
            console.log('Projet créé:', response.data);

            // Réinitialisation des champs après la soumission
            setResponsable('');
            setCapaciteMin('');
            setCapaciteMax('');
            setNom('');
            setDescription('');
            setInformationsSupplementaires('');
            setCpt(cpt + 1)
        }
        catch (error) {
            console.error('Erreur lors de la création du projet:', error);
        }
    };

    // Fonction pour afficher ou masquer les informations supplémentaires
    const toggleInformationsSupplementaires = (projetId) => {
        setProjetsEtendus({
            ...projetsEtendus,
            [projetId]: !projetsEtendus[projetId]
        });
    };

    // Fonction pour supprimer un projet appel à une requete delete
    const handleDelete = async (projetId) => {
        try {
            console.log('Suppression du projet:', projetId);
            const response = await axios.delete(`http://localhost:5000/api/projets/${projetId}`);
            console.log('Projet supprimé:', response.data);
            setCpt(cpt + 1)
        }
        catch (error) {
            console.error('Erreur lors de la suppression du projet:', error);
        }
    }
    
    

    return (
        <div className='container'>
            <div className='form-container'>
                <h2 className='h2-form'>Créer un nouveau projet</h2>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label>
                            Responsable:
                            <input type="text" value={responsable} onChange={(e) => setResponsable(e.target.value)} />
                        </label>
                    </div>
                    <div>
                        <label>
                            Capacité Minimum:
                            <input type="number" value={capaciteMin} onChange={(e) => setCapaciteMin(e.target.value)} />
                        </label>
                    </div>
                    <div>
                        <label>
                            Capacité Maximum:
                            <input type="number" value={capaciteMax} onChange={(e) => setCapaciteMax(e.target.value)} />
                        </label>
                    </div>
                    <div>
                        <label>
                            Nom du Projet:
                            <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} />
                        </label>
                    </div>
                    <div>
                        <label>
                            Description:
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                        </label>
                    </div>
                    <div>
                        <label>
                            Informations Supplémentaires:
                            <textarea value={informationsSupplementaires} onChange={(e) => setInformationsSupplementaires(e.target.value)} />
                        </label>
                    </div>
                    <button type="submit" className='btn-submit'>Créer</button>
                </form>
            </div>
            <div className='project-container'>
                <h1>Liste des projets existants</h1>
                <table className='projects-table'>
                    <thead>
                        <tr>
                            <th>Titre du Projet</th>
                            <th>Responsable</th>
                            <th>Capacité</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(projet => (
                            <React.Fragment key={projet._id}>
                                <tr key={projet._id}>
                                    <td>{projet.nom}</td>
                                    <td>{projet.responsable}</td>
                                    <td>
                                        {projet.capaciteMax === projet.capaciteMin
                                            ? projet.capaciteMin
                                            : `${projet.capaciteMin}-${projet.capaciteMax}`}
                                    </td>
                                    <td>{projet.description}</td>
                                    <td>
                                        <button
                                            className="arrow-button"
                                            onClick={() => toggleInformationsSupplementaires(projet._id)}
                                        >
                                            {projetsEtendus[projet._id] ? '↑' : '↓'}
                                        </button>
                                    </td>
                                    <td>
                                        <button 
                                            className='delete-button'
                                            onClick={async () => {handleDelete(projet._id)}}
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                                {projetsEtendus[projet._id] && (
                                    <tr>
                                        <td colSpan="5" className="informations-supplementaires">
                                            {projet.informationsSupplementaires}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AjoutProjet;
