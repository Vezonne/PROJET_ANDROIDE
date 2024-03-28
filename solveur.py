from pyomo.environ import *
infinity = float('inf')

model = AbstractModel()

########## CONSTANTS ##########

# Nombre d'étudiants affectés minimum
k = ...

########## SETS ##########

# Etudiants
model.E = Set()
# Groupes
model.G = Set()
# Projets
model.P = Set()

########## PARAMETERS ##########

# Somme du score du groupe G et de l'enseignant du projet P
model.score = Param(model.P, model.G, within=NonNegativeReals)
# Appartenance d'un étudiant à un groupe
model.appartenance = Param(model.E, model.G, within=Binary)
# Nombre d'étudiants dans un groupe
model.nb_etu = Param(model.G, within=NonNegativeIntegers)
# Candidature d'un groupe à un projet
model.candidature = Param(model.G, model.P, within=Binary)

########## VARIABLES ##########

# Affectation des étudiants à des projets
model.affectation_etu = Var(model.E, model.P, within=Binary)
# Affectation des groupes à des projets
model.affectation_grp = Var(model.G, model.P, within=Binary)

########## OBJECTIF ##########

# Maximiser la somme de tous les scores
def objectif_rule(model):
    return sum(model.score[p,g] * model.affectation_grp[g,p] for g in model.G for p in model.P)

model.obj = Objective(rule=objectif_rule, sense=maximize)

########## CONSTRAINTS ##########

# Affectation d'au moins k étudiants à un projet
def affectation_etu_rule(model):
    return sum(model.affectation_etu[e,p] for e in model.E for p in model.P) >= k

model.affectation_etu_con = Constraint(rule=affectation_etu_rule)

# Affectation d'au plus un projet à un groupe
def affectation_grp_rule(model, g):
    return sum(model.affectation_grp[g,p] for p in model.P) <= 1

model.affectation_grp_con = Constraint(model.G, rule=affectation_grp_rule)

# Affectation d'au plus un groupe à un projet
def affectation_prj_rule(model, p):
    return sum(model.affectation_grp[g,p] for g in model.G) <= 1

model.affectation_prj_con = Constraint(model.P, rule=affectation_prj_rule)

# Affectation d'au plus un projet à un étudiant
def affectation_etu_prj_rule(model, e, p):
    return model.affectation_grooup[g,p] == model.affectation_etu[e,p]