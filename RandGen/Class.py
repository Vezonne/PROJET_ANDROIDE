import numpy as np

class Project:
    nb_proj = 0
    min_size = 0
    max_size = 0

    @staticmethod
    def set_min_max(min, max):
        Project.min_size = min
        Project.max_size = max

    def __init__(self):
        self.id = Project.nb_proj
        Project.nb_proj += 1

    def __str__(self):
        return f"Project {self.id: >2}"
    
class Student:
    nb_student = 0

    def __init__(self):
        self.groups = []
        self.rank = None
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
    nb_group = 0

    def __init__(self, group_size):
        self.size = group_size
        self.studs = []
        self.pref = []
        self.id = Group.nb_group
        Group.nb_group += 1

    def __str__(self):
        str =  f"Group {self.id: >2} of size {self.size} of students: ["
        for s in self.studs:
            str += f"{s.id: >2} "
        str += f"\b]"
        return str
    
    def add_student(self, student):
        self.studs.append(student)
        student.groups.append(self)
    
    def add_pref(self, pref):
        self.pref.append(pref)

    def get_rank(self):
        ranks = [s.rank for s in self.studs]
        return np.mean(ranks)