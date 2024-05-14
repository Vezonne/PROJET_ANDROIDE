import json 



def recupJSON(file):
    with open(file) as f:
        data=json.load(f)
    return data


data= recupJSON('bdd.json')

def recupProjet(data):

    Liste_Projet=[]
    for i in range (len(data)):
        tmp={}
        tmp['Projet '+str(i)]=data[i]['nom']
        tmp['Encadrant']=data[i]['responsable']
        tmp['Groupes']=groupeProjet(data[i])
        Liste_Projet.append(tmp)

    return Liste_Projet

def groupeProjet(projet):

    liste_grp=[]

    for g in projet['groupes']:
        find= False
        i=0
        if len(liste_grp)==0:
            tmp={}
            tmp['Grp']=g['nom']
            tmp['Score']=int(g['rang'])
            liste_grp.append(tmp)
        else:
            while i< len(liste_grp):
                if liste_grp[i]['Grp']==(g['nom']):
                    liste_grp[i]['Score']+=int(g['rang'])
                    find=True
                i+=1
            if not find:
                tmp={}
                tmp['Grp']=g['nom']
                tmp['Score']=int(g['rang'])
                liste_grp.append(tmp)
    return liste_grp

l=recupProjet(data)
print(l)