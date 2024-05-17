# %%
import os
import time
import numpy as np
from mallows_models import mallows_kendall as mk
from tqdm import tqdm
from GenClass import *
import json

NB_PROJ = 15
NB_STD = 40
NB_CLASS = 4
MIN_PROJ_SIZE = 2
MAX_PROJ_SIZE = 4
MIN_STD_WISHES = 5

def generate_projs(nb_proj=NB_PROJ, min_size=MIN_PROJ_SIZE, max_size=MAX_PROJ_SIZE):
    """
    Génère une liste de projets aléatoires.

    Args:
        nb_proj (int): Le nombre de projets à générer (par défaut: NB_PROJ).
        min_size (int): La taille minimale d'un projet (par défaut: MIN_PROJ_SIZE).
        max_size (int): La taille maximale d'un projet (par défaut: MAX_PROJ_SIZE).

    Returns:
        list: Une liste de projets générés aléatoirement.
    """
    Project.set_min_max(min_size, max_size)
    projects = [Project() for _ in range(nb_proj)]
    return projects


def generate_class(nb_class=NB_CLASS, nb_proj=NB_PROJ):
    """
    Génère une matrice de classe aléatoire.

    Args:
        nb_class (int): Le nombre de classes à générer. Par défaut, NB_CLASS est utilisé.
        nb_proj (int): Le nombre de projets par classe. Par défaut, NB_PROJ est utilisé.

    Returns:
        numpy.ndarray: Une matrice de classe aléatoire de taille (nb_class, nb_proj).
    """
    std_class = np.zeros((nb_class, nb_proj), dtype=int)

    for i in range(nb_class):
        pref = np.arange(nb_proj)
        np.random.shuffle(pref)
        std_class[i] = pref
    return std_class


def generate_studs_pref(classes, nb_std=NB_STD, ratio=None):
    """
    Génère les préférences des étudiants en fonction des classes et des ratios donnés.

    Args:
        classes (numpy.ndarray): Un tableau 2D représentant les classes et les projets disponibles.
        nb_std (int, optional): Le nombre d'étudiants à générer. Par défaut, il est égal à NB_STD.
        ratio (numpy.ndarray, optional): Un tableau 1D représentant les ratios de chaque classe.
            Si non spécifié, tous les ratios sont égaux.

    Returns:
        numpy.ndarray: Un tableau 1D contenant les étudiants générés avec leurs préférences.

    """
    studs_pref = np.array([])
    studs = np.zeros((nb_std), dtype=Student)
    nb_class = classes.shape[0]
    nb_proj = classes.shape[1]

    if not ratio:
        ratio = np.full(nb_class, 1 / nb_class)

    for i in range(nb_class):
        sample_size = round(ratio[i] * nb_std)
        if sample_size > (nb_std - len(studs_pref)):
            sample_size = nb_std - len(studs_pref)

        sample = mk.sample(m=sample_size, n=nb_proj, theta=1, s0=classes[i])

        if not len(studs_pref):
            studs_pref = sample
        else:
            studs_pref = np.concatenate((studs_pref, sample), axis=0)

    np.random.shuffle(studs_pref)

    for i in range(nb_std):
        std = Student()
        std.set_preference(studs_pref[i])
        studs[i] = std

    return studs


def generate_stud_rank(students):
    """
    Génère un classement aléatoire des étudiants.

    Args:
        students (numpy.ndarray): Un tableau contenant les étudiants.

    Returns:
        None
    """
    stud_rank = np.arange(students.shape[0])
    np.random.shuffle(stud_rank)
    for i in range(students.shape[0]):
        students[stud_rank[i]].set_rank(i)


def generate_groups(
    students, min_size=MIN_PROJ_SIZE, max_size=MAX_PROJ_SIZE, min_choices=MIN_STD_WISHES
):
    """
    Génère des groupes d'étudiants en fonction des paramètres donnés.

    Args:
        students (list): Une liste d'objets représentant les étudiants.
        min_size (int, optional): La taille minimale d'un groupe. Par défaut, MIN_PROJ_SIZE.
        max_size (int, optional): La taille maximale d'un groupe. Par défaut, MAX_PROJ_SIZE.
        min_choices (int, optional): Le nombre minimum de choix de groupe pour chaque étudiant. Par défaut, MIN_CHOICE.

    Returns:
        list: Une liste d'objets représentant les groupes générés.
    """
    groups = []

    for std in students:

        while len(std.groups) < min_choices:
            size = round(np.random.normal(3, 0.75))
            size = np.min([size, max_size])
            size = np.max([size, min_size])
            groups.append(Group(size))
            groups[-1].add_student(std)

            for i in range(size - 1):
                std_added = False

                while not std_added:
                    new_std = np.random.choice(students)

                    if new_std in groups[-1].studs:
                        continue

                    if len(new_std.groups) > 0:
                        t = 1 / np.exp(len(new_std.groups))
                    else:
                        t = 1
                    n = np.random.choice([0, 1], p=[1 - t, t])
                    if n == 0:
                        continue

                    if mk.distance(std.pref, new_std.pref) == 0:
                        d = 0
                    else:
                        d = 1 / mk.distance(std.pref, new_std.pref)
                    n = np.random.choice([0, 1], p=[1 - d, d])

                    if n == 1:
                        continue

                    groups[-1].add_student(new_std)
                    std_added = True

    return groups


def generate_wishes(groups):
    """
    Génère les souhaits des groupes d'étudiants.

    Args:
        groups (list): Une liste de groupes d'étudiants.

    Returns:
        dict: Un dictionnaire contenant les souhaits générés pour chaque groupe.
    """
    np.random.shuffle(groups)
    wishes = {}
    for g in groups:

        for p in g.pref:
            in_wishes = True

            for s in g.studs:

                if p in s.wishes:
                    in_wishes = True
                    break

                in_wishes = False

            if not in_wishes:
                break

        for s in g.studs:
            s.wishes.append(p)
            s.wishes.sort(key=list(s.pref).index)

        wishes[g.id] = p

    return wishes


def generate_proj_pref(projects, wishes, groups):
    """
    Génère les préférences de projet.

    Cette fonction prend en entrée une liste de projets, un dictionnaire de souhaits et un dictionnaire de groupes.
    Elle retourne un dictionnaire contenant les préférences de chaque projet.

    Args:
        projects (list): Une liste d'objets projet.
        wishes (dict): Un dictionnaire de souhaits où les clés sont les groupes et les valeurs sont les projets souhaités.
        groups (dict): Un dictionnaire de groupes où les clés sont les identifiants des groupes et les valeurs sont les objets groupe.

    Returns:
        dict: Un dictionnaire contenant les préférences de chaque projet.
    """
    pref = {}

    for p in projects:
        pref[p.id] = []

    for g, w in wishes.items():
        pref[w].append((groups[g].get_rank(), g))

    for p in projects:
        if pref[p.id] != []:
            pref[p.id] = sorted(pref[p.id])
            p.set_pref([grp for scr, grp in pref[p.id]])
        else:
            pref.pop(p.id)
    return pref


def store_data(stds, grps, prjs, file_name="RandGen/data/data.json"):
    """
    Stocke les données des étudiants, des groupes et des projets dans un fichier JSON.

    Args:
        stds (list): Liste des objets étudiants.
        grps (list): Liste des objets groupes.
        prjs (list): Liste des objets projets.
        file_name (str, optional): Chemin du fichier JSON de sortie. Par défaut, "RandGen/data/data.json".

    Returns:
        dict: Dictionnaire contenant les données stockées.

    Raises:
        TypeError: Si le type de données n'est pas pris en charge lors de la conversion en JSON.
    """
    data = {}
    data["students"] = []
    data["groups"] = []
    data["projects"] = []

    for s in stds:
        std = {}
        std["id"] = s.id
        std["wishes"] = s.wishes
        data["students"].append(std)

    for g in grps:
        grp = {}
        grp["id"] = g.id
        grp["students"] = [s.id for s in g.studs]
        data["groups"].append(grp)

    for p in prjs:
        prj = {}
        prj["id"] = p.id
        prj["preferences"] = p.pref
        data["projects"].append(prj)

    def default(o):
        if isinstance(o, np.int64):  # type: ignore
            return int(o)
        raise TypeError
    
    if os.path.isfile(file_name):
        os.remove(file_name)
    with open(file_name, "x") as f:
        json.dump(data, f, default=default)

    return data


def get_data(file_name="RandGen/data/data.json"):
    """
    Récupère les données à partir d'un fichier JSON et les retourne sous forme de dictionnaires.

    Args:
        file_name (str): Le chemin du fichier JSON contenant les données. Par défaut, il est défini sur "RandGen/data/data.json".

    Returns:
        tuple: Un tuple contenant trois dictionnaires. Le premier dictionnaire contient les étudiants et leurs souhaits, le deuxième dictionnaire contient les groupes et les étudiants qui y appartiennent, et le troisième dictionnaire contient les projets et les groupes qui les préfèrent.
    """
    with open(file_name, "r") as f:
        data = json.load(f)

    students = {}
    for s in data["students"]:
        students[f"{s["id"]}"] = [f"{w}" for  w in s["wishes"]]

    groups = {}
    for g in data["groups"]:
        groups[f"{g["id"]}"] = [f"{s}" for s in g["students"]]

    projects = {}
    for p in data["projects"]:
        projects[f"{p['id']}"] = [f"{g}" for g in p["preferences"]]

    # students = {}
    # for s in data["students"]:
    #     students[s["id"]] = [w for w in s["wishes"]]

    # groups = {}
    # for g in data["groups"]:
    #     groups[g["id"]] = [s for s in g["students"]]

    # projects = {}
    # for p in data["projects"]:
    #     projects[p["id"]] = [g for g in p["preferences"]]

    return students, groups, projects


def gen_data(
    nb_std=NB_STD,
    nb_proj=NB_PROJ,
    nb_class=NB_CLASS,
    min_proj_size=MIN_PROJ_SIZE,
    max_pro_size=MAX_PROJ_SIZE,
    min_std_wishes=MIN_STD_WISHES,
    file_name="RandGen/data/data.json",
    verbose=True,
):

    Student.clear_nb_student()
    Group.clear_nb_group()
    Project.clear_nb_project()

    # %% Projects
    projects = generate_projs()
    if verbose:
        print("\nProjects:")
        for p in projects:
            print(p)

    # %% Classes
    classes = generate_class()
    if verbose:
        print("\nClasses:")
        for c in classes:
            print(c)

    # %% Students
    studs = generate_studs_pref(classes)
    std_rk = generate_stud_rank(studs)
    if verbose:
        print("\nStudent preferences:")
        for s in studs:
            # lt = []
            # for i in range(NB_CLASS):
            #     lt.append(mk.distance(classes[i], s.pref))
            print(f"{s}")

    # %% Groups
    groups = generate_groups(studs)
    if verbose:
        print("\nGroups:")
        for g in groups:
            print(g)

        # for s in studs:
        #     str = f"std: {s.id: >2} grp: ["
        #     for g in s.groups:
        #         str += f"{g.id: >2} "
        #     str += f"\b]"
        #     print(str)

        print(f"average grps per std: {np.mean([len(s.groups) for s in studs]):.2f}")

    # %% Group preferences
    if verbose:
        print(f"\nGroup preferences:")
    start = time.time()
    threads = []
    for i in tqdm(range(len(groups)), desc="compute group preferences"):
        # t = threading.Thread(target=g.compute_pref)
        # print(f"thread {g.id: >2} started")
        # t.start()
        # threads.append(t)
        groups[i].compute_pref()

    # for t in threads:
    #     t.join()
    end = time.time()
    if verbose:
        print(f"total time: {end - start: .02f}")
        for g in groups:
            print(f"grp: {g.id: >2} pref: {g.pref}")

    # %% Group rank
    wishes = generate_wishes(groups)
    if verbose:
        print("\nWishes:")
        print(wishes)

        print("\nStudent wishes:")
        for s in studs:
            print(f"std: {s.id: >2} wishes: {s.wishes}")

    # %% Project preferences
    pref = generate_proj_pref(projects, wishes, groups)
    if verbose:
        print("\nProject preferences:")
        # print(pref)
        for p in projects:
            print(f"proj: {p.id: >2} pref: {p.pref}")

    # %% Store data
    data = store_data(studs, groups, projects, file_name)
    if verbose:
        print("\nData stored in {file_name}")


def main(args=None):

    for i in range(1):
        gen_data(file_name=f"RandGen/data/data{i}.json")


# %% Main
if __name__ == "__main__":
    main()

# %%
