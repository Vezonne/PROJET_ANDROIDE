from tqdm import tqdm
from RandGen import RandGen
import numpy as np
import ranky as rk
import pyomo.environ as pyo
from pyomo.opt import SolverFactory
import platform

infinity = float("inf")


def main(args=None):

    students, groups, projects = RandGen.get_data("RandGen/data/data_test.json")
    print("students\n", students)
    print("groups\n", groups)
    print("projects\n", projects)

    # modification des préféreneces des étudiants de rangs à scores
    for s in students.keys():
        pref = {}
        for i in range(len(students[s])):
            pref[students[s][i]] = len(students[s]) - i

        students[s] = pref

    print("\nstudents scores\n", students)

    # modification des préféreneces des projets de rangs à scores
    for p in projects.keys():
        pref = {}
        for i in range(len(projects[p])):
            pref[projects[p][i]] = len(projects[p]) - i

        projects[p] = pref

    print("projects scores\n", projects)

    # calcul des préférences des groupes
    grps_pref = {}
    for g in tqdm(groups.keys(), desc="Computing groups preferences"):
        projs = set()

        for s in groups[g]:
            projs = projs.union(set(students[s]))

        std_score = np.zeros((len(projs), len(groups[g])), dtype=int)

        y_label = []
        y_pos = []
        for i, p in enumerate(projs):
            y_label.append(p)
            y_pos.append(i)

        x_label = []
        x_pos = []
        for i, s in enumerate(groups[g]):
            x_label.append(s)
            x_pos.append(i)

        for s, i in zip(x_label, x_pos):

            for p, scr in students[s].items():
                std_score[y_pos[y_label.index(p)]][i] = scr

        # print("\nStudents score for group", g)
        # print("x labels ", x_label)
        # print("y labels ", y_label)
        # i = 0
        # for p in std_score:
        #     str = f"proj: {y_label[i]: >2} ["
        #     for s in p:
        #         str += f"{s: >2} "
        #     str += f"\b]"
        #     i += 1
        #     print(str)

        pref_scores = rk.center(std_score, method="kendalltau", verbose=False)

        # print("pref scores", pref_scores)
        grp_pref = {}
        for y in range(len(pref_scores)):
            # i_min = np.where(pref_scores == np.min(pref_scores))[0][0]
            # pref_scores[i_min] = np.max(pref_scores) + 1
            # grps_pref[y_label[y]] = i_min
            grp_pref[y_label[y]] = pref_scores[y]

        grps_pref[g] = grp_pref

        # print("grp pref", grps_pref)

    def get_scoreGP(group, project):
        if project in grps_pref[group]:
            return grps_pref[group][project]
        else:
            return 0

    def get_scorePG(project, group):
        if project in projects and group in projects[project]:
            return projects[project][group]
        else:
            return 0

    def get_scoreEP(student, project):
        if project in students[student]:
            return students[student][project]
        else:
            return 0

    # modélisation problème linéaire
    model = pyo.ConcreteModel()

    ########## CONSTANTS ##########

    # Nombre d'étudiants affectés minimum
    k = 3 * len(students) / 4

    ########## SETS ##########

    # Etudiants
    model.E = pyo.Set(initialize=(s for s in students))
    # Groupes
    model.G = pyo.Set(initialize=(g for g in groups))
    # Projets
    model.P = pyo.Set(initialize=(p for p in projects))

    ########## PARAMETERS ##########

    # # Somme du score du groupe G et de l'enseignant du projet P
    # model.score = pyo.Param(model.P, model.G, within=pyo.NonNegativeReals)
    # # Appartenance d'un étudiant à un groupe
    # model.appartenance = pyo.Param(model.E, model.G, within=pyo.Binary)
    # # Nombre d'étudiants dans un groupe
    # model.nb_etu = pyo.Param(model.G, within=pyo.NonNegativeIntegers)
    # # Candidature d'un groupe à un projet
    # model.candidature = pyo.Param(model.G, model.P, within=pyo.Binary)

    ########## VARIABLES ##########

    # Affectation des étudiants à des projets
    model.affectation_etu = pyo.Var(model.E, model.P, domain=pyo.Binary)
    # Affectation des groupes à des projets
    model.affectation_grp = pyo.Var(model.G, model.P, domain=pyo.Binary)

    ########## OBJECTIF ##########

    # Maximiser la somme de tous les scores
    def objectif_rule(model):
        return sum(
            [
                sum(
                    [
                        model.affectation_grp[g, p]
                        * (get_scoreGP(g, p) * get_scorePG(p, g) / len(groups[g]))
                        for p in model.P
                    ]
                )
                for g in model.G
            ]
        )

    model.obj = pyo.Objective(rule=objectif_rule, sense=pyo.maximize)

    ########## CONSTRAINTS ##########

    # Affectation d'au moins k étudiants à un projet
    def affectation_etu_rule(model):
        return (
            sum([sum([model.affectation_etu[e, p] for p in model.P]) for e in model.E])
            >= k
        )

    model.affectation_etu_con = pyo.Constraint(rule=affectation_etu_rule)

    # Affectation d'au plus un projet à un groupe
    def affectation_grp_rule(model, g):
        return sum(model.affectation_grp[g, p] for p in model.P) <= 1

    model.affectation_grp_con = pyo.Constraint(model.G, rule=affectation_grp_rule)

    # Affectation d'au plus un groupe à un projet
    def affectation_prj_rule(model, p):
        return sum(model.affectation_grp[g, p] for g in model.G) <= 1

    model.affectation_prj_con = pyo.Constraint(model.P, rule=affectation_prj_rule)

    # # Affectation d'au plus un projet à un étudiant
    # def affectation_etu_prj_rule(model, g, p):
    #     return (
    #         sum(
    #             [
    #                 model.affectation_grp[g, p] - model.affectation_etu[e, p]
    #                 for e in groups[g]
    #             ]
    #         )
    #         == 0
    #     )

    # model.affectation_etu_prj_con = pyo.Constraint(
    #     model.G, model.P, rule=affectation_etu_prj_rule
    # )

    # Contrainte de stabilité
    def stabilite_rule(model, g, p):
        ret = 0
        for gbis in projects[p]:
            if get_scorePG(p, gbis) > get_scorePG(p, g):
                ret += model.affectation_grp[gbis, p]

        for e in groups[g]:
            for pbis in students[e]:
                if get_scoreEP(e, pbis) > get_scoreEP(e, p):
                    ret += model.affectation_etu[e, pbis]

        return ret >= 1

    model.stabilite_con = pyo.Constraint(model.G, model.P, rule=stabilite_rule)

    # os_name = platform.system()
    # if os_name == "Windows":
    #     solver = pyo.SolverFactory("cbc", executable="cbc-module/ampl.mswin64/cbc.exe")
    # elif os_name == "Darwin":
    #     solver = pyo.SolverFactory("cbc", executable="cbc-module/ampl.macos64/cbc")
    # else:
    #     solver = pyo.SolverFactory(
    #         "cbc", executable="cbc-module/ampl.linux-intel64/cbc"
    #     )

    solver = pyo.SolverFactory("glpk")
    results = solver.solve(model)

    print(results)

    # print("affectation des groupes")
    # for agrp in model.affectation_grp:
    #     if model.affectation_grp[agrp].value == 1:
    #         print(agrp)

    # print("affectation des étudiants")
    # for aetu in model.affectation_etu:
    #     if model.affectation_etu[aetu] == 1:
    #         print(aetu)

    # model.affectation_grp.display()
    # model.affectation_etu.display()
    grp_aff = model.affectation_grp.get_values()
    for g in grp_aff:
        if grp_aff[g] == 1:
            print(g)


if __name__ == "__main__":
    main()
