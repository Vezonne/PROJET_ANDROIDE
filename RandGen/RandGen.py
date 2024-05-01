import numpy as np
from mallows_models import mallows_kendall as mk
from mallows_models import permutil as pu
import scipy.stats as stats
import spicy as sp
import pandas as pd
import ranky as rk

NB_PROJ = 15
NB_STD = 40
NB_CLASS = 4
MIN_CHOICE = 5
MIN_PROJ_SIZE = 2
MAX_PROJ_SIZE = 5
MIN_CHOICE_PROJ = 3

class Project:
    nb_proj = 0

    def __init__(self, proj_size):
        self.id = Project.nb_proj
        self.size = proj_size
        Project.nb_proj += 1

    def __str__(self):
        return f"Project {self.id} of size {self.size}"
    
class Student:
    nb_student = 0

    def __init__(self):
        self.id = Student.nb_student
        Student.nb_student += 1

    def __str__(self):
        str = f"Std {self.id} pref: ["
        for p in self.pref:
            str += f"{p: >2} "
        str += "\b]"
        return str
    
    def set_preference(self, preference):
        self.pref = preference
    
class Group:
    nb_group = 0

    def __init__(self, group_size):
        self.size = group_size
        self.studs = []
        self.pref = []
        self.id = Group.nb_group
        Group.nb_group += 1

    def __str__(self):
        return f"Group {self.id} of size {self.size}"
    
    def add_student(self, student):
        self.studs.append(student)
    
    def add_pref(self, pref):
        self.pref.append(pref)

def generate_projs():
    projects = []
    proj_sizes = np.random.normal(3, 0.75, (NB_PROJ))

    for i in range(NB_PROJ):
        proj_size = round(proj_sizes[i])
        proj_size = np.min([proj_size, MAX_PROJ_SIZE])
        proj_size = np.max([proj_size, MIN_PROJ_SIZE])
        projects.append(Project(proj_size))
    return projects

def generate_class():
    classes = np.zeros((NB_CLASS, NB_PROJ), dtype=int)

    for i in range(NB_CLASS):
        pref = np.arange(NB_PROJ)
        np.random.shuffle(pref)
        classes[i] =  pref
    return classes

def generate_studs_pref(classes, props=None):
    studs_pref = np.array([])
    studs = np.zeros((NB_STD), dtype=Student)

    if not props:
        props = np.full(NB_CLASS, 1/NB_CLASS)

    for i in range(NB_CLASS):
        sample = mk.sample(m=int(props[i]*NB_STD), n=NB_PROJ, theta=1, s0=classes[i])

        if not len(studs_pref):
            studs_pref = sample
        else:
            studs_pref = np.concatenate((studs_pref, sample), axis=0)
    
    np.random.shuffle(studs_pref)

    for i in range(NB_STD):
        std = Student()
        std.set_preference(studs_pref[i])
        studs[i] = std

    return studs

def generate_stud_rank():
    stud_rank = np.arange(NB_STD)
    np.random.shuffle(stud_rank)
    return stud_rank

# def generate_groups(studs_pref):
#     groups = []
#     for sp in studs_pref:
#         size = np.round(np.random.normal(3, 0.75))
#         size = np.min([size, MAX_PROJ_SIZE])
#         size = np.max([size, MIN_PROJ_SIZE])
#         groups.append(group(size))
#         groups[-1].add_pref(sp)

#         for i in range(size):
#             while()

def main(args=None):
    projects = generate_projs()
    print("\nProjects:")
    for p in projects:
        print(p)

    std_rk = generate_stud_rank()
    print("\nStudents rank:")
    print(std_rk)

    classes = generate_class()
    print("\nClasses:")
    for c in classes:
        print(c)

    studs = generate_studs_pref(classes)
    print("\nStudents preferences:")
    for s in studs:
        # lt = []
        # for i in range(NB_CLASS):
        #     lt.append(mk.distance(classes[i], s.pref))
        print(f"{s}")

if __name__ == "__main__":
    main()