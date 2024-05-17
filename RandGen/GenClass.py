import numpy as np
import ranky as rk


class Project:
    """
    Classe représentant un projet.

    Attributs de classe:
        nb_proj (int): Le nombre total de projets créés.
        min_size (int): La taille minimale d'un projet.
        max_size (int): La taille maximale d'un projet.

    Méthodes statiques:
        set_min_max(min: int, max: int) -> None:
            Définit la taille minimale et maximale d'un projet.

        clear_nb_project() -> None:
            Réinitialise le nombre total de projets.

    Méthodes d'instance:
        __init__() -> None:
            Initialise une instance de la classe Project.

        __str__() -> str:
            Renvoie une représentation sous forme de chaîne de caractères de l'objet Project.

        set_pref(preferences: list) -> None:
            Définit les préférences du projet.

    """

    nb_proj = 0
    min_size = 0
    max_size = 0

    @staticmethod
    def set_min_max(min, max):
        """
        Définit les valeurs minimales et maximales pour la taille du projet.

        Args:
            min (int): La valeur minimale pour la taille du projet.
            max (int): La valeur maximale pour la taille du projet.
        """
        Project.min_size = min
        Project.max_size = max

    @staticmethod
    def clear_nb_project():
        """
        Réinitialise le nombre de projets à zéro.
        """
        Project.nb_proj = 0

    def __init__(self):
        self.id = Project.nb_proj
        self.pref = []
        Project.nb_proj += 1

    def __str__(self):
        return f"Project {self.id: >2}"

    def set_pref(self, preferences):
        self.pref = preferences


class Student:
    """
    Classe représentant un étudiant.

    Attributs:
        nb_student (int): Le nombre total d'étudiants créés.
        groups (list): Une liste des groupes auxquels l'étudiant appartient.
        rank (int): Le rang de l'étudiant.
        wishes (list): Une liste des souhaits de l'étudiant.
        id (int): L'identifiant unique de l'étudiant.

    Méthodes:
        clear_nb_student(): Réinitialise le nombre total d'étudiants.
        __init__(): Initialise un nouvel objet étudiant.
        __str__(): Renvoie une représentation sous forme de chaîne de caractères de l'étudiant.
        set_preference(preference): Définit les préférences de l'étudiant.
        set_rank(rank): Définit le rang de l'étudiant.
    """

    nb_student = 0

    @staticmethod
    def clear_nb_student():
        """
        Réinitialise le nombre d'étudiants à zéro.
        """
        Student.nb_student = 0

    def __init__(self):
        self.groups = []
        self.rank = None
        self.wishes = []
        self.id = Student.nb_student
        Student.nb_student += 1

    def __str__(self):
        str = f"Std {self.id: >2} pref: ["
        for p in self.pref:
            str += f"{p: >2} "
        str += f"\b] rank: {self.rank}"
        return str

    def set_preference(self, preference):
        self.pref = preference

    def set_rank(self, rank):
        self.rank = rank


class Group:
    """
    Classe représentant un groupe d'étudiants.

    Attributes:
        nb_group (int): Le nombre total de groupes créés.
        size (int): La taille du groupe.
        studs (list): La liste des étudiants dans le groupe.
        pref (list): La liste des préférences des étudiants dans le groupe.
        score (int): Le score du groupe.
        id (int): L'identifiant du groupe.

    Methods:
        clear_nb_group(): Réinitialise le nombre total de groupes créés.
        __init__(group_size): Initialise un groupe avec une taille donnée.
        __str__(): Retourne une représentation en chaîne de caractères du groupe.
        add_student(student): Ajoute un étudiant au groupe.
        get_rank(): Retourne la moyenne des rangs des étudiants dans le groupe.
        compute_pref(): Calcule les préférences du groupe.
        compute_score(): Calcule le score du groupe.
    """

    nb_group = 0

    @staticmethod
    def clear_nb_group():
        """
        Réinitialise le nombre total de groupes créés.
        """
        Group.nb_group = 0

    def __init__(self, group_size):
        self.size = group_size
        self.studs = []
        self.pref = []
        self.score = 0
        self.id = Group.nb_group
        Group.nb_group += 1

    def __str__(self):
        str = f"Group {self.id: >2} of size {self.size} of students: ["
        for s in self.studs:
            str += f"{s.id: >2} "
        str += f"\b]"
        return str

    def add_student(self, student):
        """
        Ajoute un étudiant au groupe.

        Args:
            student (Student): L'étudiant à ajouter.
        """
        self.studs.append(student)
        student.groups.append(self)

    def get_rank(self):
        """
        Retourne la moyenne des rangs des étudiants dans le groupe.

        Returns:
            float: La moyenne des rangs des étudiants dans le groupe.
        """
        ranks = [s.rank for s in self.studs]
        return np.mean(ranks)

    def compute_pref(self):
        """
        Calcule les préférences du groupe.
        """
        std_pref = np.zeros((len(self.studs[0].pref), len(self.studs)), dtype=int)

        for i in range(len(self.studs)):
            std = self.studs[i]
            tmp = np.zeros(len(std.pref), dtype=int)

            for j in range(len(std.pref)):
                std_pref[std.pref[j]][i] = j + 1

        pref_scores = rk.center(std_pref, method="kendalltau", verbose=False)

        for _ in range(len(pref_scores)):
            i_min = np.where(pref_scores == np.min(pref_scores))[0][0]
            pref_scores[i_min] = np.max(pref_scores) + 1
            self.pref.append(i_min)

    def compute_score(self):
        """
        Calcule le score du groupe.
        """
        self.score = 0
        for s in self.studs:
            self.score += s.rank
