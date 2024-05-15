import pyomo.environ as po

infinity = float("inf")

model = po.AbstractModel()

########## CONSTANTS ##########

# Nombre d'étudiants affectés minimum
k = ...

########## SETS ##########

# Etudiants
model.E = po.Set()
# Groupes
model.G = po.Set()
# Projets
model.P = po.Set()

########## PARAMETERS ##########

# Somme du score du groupe G et de l'enseignant du projet P
model.score = po.Param(model.P, model.G, within=po.NonNegativeReals)
# Appartenance d'un étudiant à un groupe
model.appartenance = po.Param(model.E, model.G, within=po.Binary)
# Nombre d'étudiants dans un groupe
model.nb_etu = po.Param(model.G, within=po.NonNegativeIntegers)
# Candidature d'un groupe à un projet
model.candidature = po.Param(model.G, model.P, within=po.Binary)

########## VARIABLES ##########

# Affectation des étudiants à des projets
model.affectation_etu = po.Var(model.E, model.P, within=po.Binary)
# Affectation des groupes à des projets
model.affectation_grp = po.Var(model.G, model.P, within=po.Binary)

########## OBJECTIF ##########


# Maximiser la somme de tous les scores
def objectif_rule(model):
    return sum(
        [
            model.score[p, g] * model.affectation_grp[g, p]
            for g in [model.G for p in model.P]
        ]
    )


model.obj = po.Objective(rule=objectif_rule, sense=po.maximize)

########## CONSTRAINTS ##########


# Affectation d'au moins k étudiants à un projet
def affectation_etu_rule(model):
    return sum([model.affectation_etu[e, p] for e in [model.E for p in model.P]]) >= k


model.affectation_etu_con = po.Constraint(rule=affectation_etu_rule)


# Affectation d'au plus un projet à un groupe
def affectation_grp_rule(model, g):
    return sum(model.affectation_grp[g, p] for p in model.P) <= 1


model.affectation_grp_con = po.Constraint(model.G, rule=affectation_grp_rule)


# Affectation d'au plus un groupe à un projet
def affectation_prj_rule(model, p):
    return sum(model.affectation_grp[g, p] for g in model.G) <= 1


model.affectation_prj_con = po.Constraint(model.P, rule=affectation_prj_rule)


# Affectation d'au plus un projet à un étudiant
def affectation_etu_prj_rule(model, e, p):
    return model.affectation_grooup[g, p] == model.affectation_etu[e, p]
