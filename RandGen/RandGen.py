import numpy as np
from mallows_models import mallows_kendall as mk
from mallows_models import permutil as pu
import spicy as sp
import pandas as pd

NB_PROJ = 10
NB_ETU = 30
NB_CLASS = 3
MIN_CHOICE = 5
MIN_PROJ_SIZE = 2
MAX_PROJ_SIZE = 5

class project:
    proj_group = None
    def __init__(self, proj_id, proj_size):
        self.proj_id = proj_id
        self.proj_size = proj_size

def generate_projs():
    projects = []
    for i in range(NB_PROJ):
        proj_size = np.random.randint(MIN_PROJ_SIZE, MAX_PROJ_SIZE)
        projects.append(project(i, proj_size))
    return projects

def generate_class():
    classes = np.zeros((NB_CLASS, NB_PROJ), dtype=int)
    for i in range(NB_CLASS):
        pref = np.arange(NB_PROJ)
        np.random.shuffle(pref)
        classes[i] =  pref
    return classes

def generate_etus_pref(classes, props=None):
    etus_pref = np.array([])
    if not props:
        props = np.full(NB_CLASS, 1/NB_CLASS)

    for i in range(NB_CLASS):
        sample = mk.sample(m=int(props[i]*NB_ETU), n=NB_PROJ, theta=1, s0=classes[i])
        if not len(etus_pref):
            etus_pref = sample
        else:
            etus_pref = np.concatenate((etus_pref, sample), axis=0)
    
    return etus_pref

projects = generate_projs()

classes = generate_class()
print("\nClasses:")
for c in classes:
    print(c)

etus_pref = generate_etus_pref(classes)
print("\nEtus preferences:")
for e in etus_pref:
    lt = []
    for i in range(NB_CLASS):
        lt.append(mk.distance(classes[i], e))
    print("pref :",e,"t:",lt)