DB_URL="mongodb+srv://adminMain:2r2fRIk9e7Ru1CK7@maisonisen.jwkhliv.mongodb.net/?retryWrites=true&w=majority&appName=MaisonIsen"

import pymongo
from pymongo import MongoClient
import json

# Connect to the MongoDB, change the connection string per your MongoDB environment
client = MongoClient(DB_URL)

#  se connecter à la base de données MaisonIsen
db = client.MaisonIsen


# afficher les elements dans la collection avec un typeIngredient = 1
def getViandes():
    collection = db.articles
    keyId = 0
    
    # supprimer tout les elements dans la collection "viandes"
    db.viandes.delete_many({})
    
    for x in collection.find({"typeIngredient":1}):
        print(x)
        
        # ajouter ces articles dans la collection "viandes"
        db.viandes.insert_one({
            "commentaire": x["commentaire"],
            "dispo": True,
            "id" : keyId,
            "nom": x["nom"],
            "quantite": x["qte"],
        })
        
        keyId += 1
    
def getIngredients():
    collection = db.articles
    keyId = 0
    
    # suppression de tout les elements dans la collection "ingredients"
    db.ingredients.delete_many({})
    
    for x in collection.find({"typeIngredient":2}):
        print(x)
        
        # ajouter ces articles dans la collection "plats"
        db.ingredients.insert_one({
            "commentaire": x["commentaire"],
            "dispo": True,
            "id" : keyId,
            "nom": x["nom"],
            "quantite": x["qte"],
        })
        
        keyId += 1


def getSnacks():
    collection = db.carte
    keyId = 0
    
    # suppression de tout les elements dans la collection "snacks"
    db.snacks.delete_many({})
    
    for x in collection.find({"ref": "Snack"}):
        print(x)
        
        # ajouter ces articles dans la collection "snacks"
        db.snacks.insert_one({
            "dispo": True,
            "id" : keyId,
            "nom": x["nom"],
            # récupérer la quantité de l'article depuis db.articles avec le nom de l'article
            "quantite": db.articles.find_one({"nom": x["nom"]})["qte"] if db.articles.find_one({"nom": x["nom"]}) else 0,
            "prix" : round(x["prix"],2),
            "prixServeur": round(x["prixServeur"],2)
        })
        
        keyId += 1
        
        
def getBoissons():
    collection = db.carte
    keyId = 0
    
    # suppression de tout les elements dans la collection "snacks"
    db.boissons.delete_many({})
    
    for x in collection.find({"ref": "Boisson"}):
        print(x)
        
        # ajouter ces articles dans la collection "snacks"
        db.boissons.insert_one({
            "dispo": True,
            "id" : keyId,
            "nom": x["nom"],
            # récupérer la quantité de l'article depuis db.articles avec le nom de l'article
            "quantite": db.articles.find_one({"nom": x["nom"]})["qte"] if db.articles.find_one({"nom": x["nom"]}) else 0,
            "prix" : round(x["prix"],2),
            "prixServeur": round(x["prixServeur"],2)
        })
        
        keyId += 1
    
def getPlats():
    collection = db.carte
    keyId = 0
    
    # suppression de tout les elements dans la collection "plats"
    db.plats.delete_many({})
    
    for x in collection.find({"ref": "Plat"}):
        print(x)
        
        # ajouter ces articles dans la collection "plats"
        db.plats.insert_one({
            "dispo": True,
            "id" : keyId,
            "nom": x["nom"],
            # récupérer la quantité de l'article depuis db.articles avec le nom de l'article
            "prix" : round(x["prix"],2),
            "prixServeur": round(x["prixServeur"],2),
            "ingredients" : [{"id" : 0, "qmin" : 0, "qmax" : 0}],
        })
        
        keyId += 1

def getMenu():
    collection = db.carte
    keyId = 0
    
    # suppression de tout les elements dans la collection "menu"
    db.menus.delete_many({})
    
    for x in collection.find({"ref": "Menu"}):
        print(x)
        
        # ajouter ces articles dans la collection "menu"
        db.menus.insert_one({
            "dispo": True,
            "id" : keyId,
            "nom": x["nom"],
            # récupérer la quantité de l'article depuis db.articles avec le nom de l'article
            "prix" : round(x["prix"],2),
            "prixServeur": round(x["prixServeur"],2),
            "quantitePlat" : 0,
            "quantiteBoisson" : 0,
            "quantiteSnack" : 0
        })
        
        keyId += 1
    

# getViandes()
# getIngredients()
# getSnacks()
# getBoissons()
getPlats()
# getMenu()