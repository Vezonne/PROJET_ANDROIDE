import numpy as np
import ranky as rk


class Project:
    nb_proj = 0
    min_size = 0
    max_size = 0

    @staticmethod
    def set_min_max(min, max):
        Project.min_size = min
        Project.max_size = max

    @staticmethod
    def clear_nb_project():
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
    nb_student = 0

    @staticmethod
    def clear_nb_student():
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
    nb_group = 0

    @staticmethod
    def clear_nb_group():
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
        self.studs.append(student)
        student.groups.append(self)

    def get_rank(self):
        ranks = [s.rank for s in self.studs]
        return np.mean(ranks)

    def compute_pref(self):
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
        self.score = 0
        for s in self.studs:
            self.score += s.rank
