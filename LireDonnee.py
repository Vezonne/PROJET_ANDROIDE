import json
from turtle import clear

from designer import group 



def recupJSON(file):
    with open(file) as f:
        data=json.load(f)
    return data


data= recupJSON('bdd.json')

def recupProjet(data):

    Liste_Projet={}
    for i in range (len(data)):
        Liste_Projet['Projet '+str(i)]=groupeProjet(data[i])

    return Liste_Projet

def groupeProjet(projet):

    liste_grp=[]

    for g in projet['groupes']:
        if g['nom'] not in liste_grp:
            liste_grp.append(g['nom'])
    return liste_grp

def recupGroupe(data):
    grp={}
    j=0
    for i in range (len(data)):
        dict_groupes={}
        for g in data[i]['groupes']:
            set_temporaire=set()
            for e in g['candidats']:
                set_temporaire.add(e['numeroEtudiant'])
            occur=False
            for k in dict_groupes:
                if set_temporaire == dict_groupes[k]:
                    occur=True
            if not occur:
                dict_groupes['Groupe '+str(j)]=set_temporaire
                j+=1
        grp.update(dict_groupes)

    return grp

def recupEtudiant(data):
    etu={}
    
    list_etu=[]

    for i in range (len(data)):
        for g in data[i]['groupes']:
            list_etu.append((g['candidats'][0]['numeroEtudiant'], 'Projet '+str(i),int(g['rang'])))
    
    while len(list_etu)!=0:
        choisi=list_etu[0]
        if choisi[2]==1:
            etu[choisi[0]]=[choisi[1]]
        if choisi[2]>1:
            for i in range (1,len(list_etu)):
                if list_etu[i][0]==choisi[0] and list_etu[i][2]<choisi[2]:
                    choisi=list_etu[i]

            if choisi[2]==1:
                etu[choisi[0]]=[choisi[1]]
            else:
                etu[choisi[0]].append(choisi[1])

        list_etu.remove(choisi)

    return etu




            



l=recupProjet(data)
g=recupGroupe(data)
e=recupEtudiant(data)
print(e)