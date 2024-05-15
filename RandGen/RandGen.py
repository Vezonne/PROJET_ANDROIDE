# %%
import threading
import time
import numpy as np
from mallows_models import mallows_kendall as mk
from tqdm import tqdm
from Class import *
import ranky as rk

NB_PROJ = 15
NB_STD = 40
NB_CLASS = 4
MIN_PROJ_SIZE = 2
MAX_PROJ_SIZE = 4
MIN_CHOICE = 3
MIN_CHOICE_PROJ = 3


def generate_projs(nb_proj=NB_PROJ, min_size=MIN_PROJ_SIZE, max_size=MAX_PROJ_SIZE):
    Project.set_min_max(min_size, max_size)
    projects = [Project() for _ in range(nb_proj)]
    return projects


def generate_class(nb_class=NB_CLASS, nb_proj=NB_PROJ):
    std_class = np.zeros((nb_class, nb_proj), dtype=int)

    for i in range(nb_class):
        pref = np.arange(nb_proj)
        np.random.shuffle(pref)
        std_class[i] = pref
    return std_class


def generate_studs_pref(classes, nb_std=NB_STD, ratio=None):
    studs_pref = np.array([])
    studs = np.zeros((nb_std), dtype=Student)
    nb_class = classes.shape[0]
    nb_proj = classes.shape[1]

    if not ratio:
        ratio = np.full(nb_class, 1 / nb_class)

    for i in range(nb_class):
        sample = mk.sample(m=int(ratio[i] * nb_std), n=nb_proj, theta=1, s0=classes[i])

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
    stud_rank = np.arange(students.shape[0])
    np.random.shuffle(stud_rank)
    for i in range(students.shape[0]):
        students[stud_rank[i]].set_rank(i)


def generate_groups(
    students, min_size=MIN_PROJ_SIZE, max_size=MAX_PROJ_SIZE, min_choices=MIN_CHOICE
):
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

                    d = 1 / mk.distance(std.pref, new_std.pref)
                    n = np.random.choice([0, 1], p=[1 - d, d])

                    if n == 1:
                        continue

                    groups[-1].add_student(new_std)
                    std_added = True

    return groups


def generate_wishes(groups):
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
    pref = {}
    rank = {}

    for p in projects:
        pref[p.id] = []
        rank[p.id] = []
    for g, w in wishes.items():
        pref[w].append(g)
        rank[w].append(groups[g].get_rank())
    for p in projects:
        if pref[p.id] != []:
            pref[p.id].sort(key=rank[p.id].index, reverse=True)
        else:
            pref.pop(p.id)
            rank.pop(p.id)
    return pref


def main(args=None):

    # %% Projects
    projects = generate_projs()
    print("\nProjects:")
    for p in projects:
        print(p)

    # %% Classes
    classes = generate_class()
    print("\nClasses:")
    for c in classes:
        print(c)

    # %% Students
    studs = generate_studs_pref(classes)
    std_rk = generate_stud_rank(studs)
    print("\nStudent preferences:")
    for s in studs:
        # lt = []
        # for i in range(NB_CLASS):
        #     lt.append(mk.distance(classes[i], s.pref))
        print(f"{s}")

    # %% Groups
    groups = generate_groups(studs)
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
    print(f"total time: {end - start: .02f}")
    for g in groups:
        print(f"grp: {g.id: >2} pref: {g.pref}")

    # %% Group rank
    wishes = generate_wishes(groups)
    print("\nWishes:")
    print(wishes)

    print("\nStudent wishes:")
    for s in studs:
        print(f"std: {s.id: >2} wishes: {s.wishes}")

    # %% Project preferences
    pref = generate_proj_pref(projects, wishes, groups)
    print("\nProject preferences:")
    print(pref)
    # for p in pref:
    #     print(f"proj: {p.id} pref: {pref[p]}")


# %% Main
if __name__ == "__main__":
    main()

# %%
