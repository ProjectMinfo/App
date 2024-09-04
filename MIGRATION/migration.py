import json
from pymongo import MongoClient
import pymongo
from datetime import datetime

# Chemin vers ton fichier JSON
json_file_path = './maisoseminitel_mysql_db.json'

# Connexion à MongoDB
DB_URL="mongodb+srv://adminMain:2r2fRIk9e7Ru1CK7@maisonisen.jwkhliv.mongodb.net/?retryWrites=true&w=majority&appName=MaisonIsen"
# Connect to the MongoDB, change the connection string per your MongoDB environment
client = MongoClient(DB_URL)
#  se connecter à la base de données MaisonIsen
db = client.MaisonIsen


def CompteMigration():
    # Lire le fichier JSON et extraire les données de la table "comptes"
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        comptes_data = next((table['data'] for table in data if table['type'] == 'table' and table['name'] == 'comptes'), None)

    # Insérer les données dans la collection MongoDB
    if comptes_data:
        db.comptes.delete_many({})
        for compte in comptes_data:
            db.comptes.insert_one({
                "acces" : int(compte['acces']),
                "email": compte['email'],
                "mdp": compte['mdp'],
                "montant" : round(float(compte['montant']), 2),
                "nom": compte['nom'],
                "numCompte": int(compte['num_compte']),
                "prenom": compte['prenom'],
                "promo": int(compte['promo']),
                "resetToken" : compte['reset_token'],
                "tokenExpiration" : compte['token_expiration'],
            })
    
    print("Migration de la collection 'comptes' terminée avec succès!")
            

def dateConvertionAchat(date):
    if date is None:
        return None
    return datetime.strptime(date, "%Y-%m-%d")


def AchatMigration():
    # Lire le fichier JSON et extraire les données de la table "achats"
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        achats_data = next((table['data'] for table in data if table['type'] == 'table' and table['name'] == 'achats'), None)

    # Insérer les données dans la collection MongoDB
    if achats_data:
        db.achats.delete_many({})
        for achat in achats_data:
            db.achats.insert_one({
                "idAchat": int(achat['id_achat']),
                "categorie": int(achat['categorie']),
                "dateFermeture": dateConvertionAchat(achat.get('date_fermeture')),
                "dateOuverture": dateConvertionAchat(achat.get('date_ouverture')),
                "dlc": dateConvertionAchat(achat.get('dlc')),
                "etat": int(achat['etat']),
                "idProduit": int(achat['id_produit']),
                "nbPortions": int(achat['nb_portions']),
                "nomArticle": achat['nom_article'],
                "numLot": achat['num_lot'],
                "qtePerimee": int(achat['qte_perimee']),
            })
    
    print("Migration de la collection 'achats' terminée avec succès!")


def ArticleQteMigration():
    # Lire le fichier JSON et extraire les données de la table "articles"
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        articles_data = next((table['data'] for table in data if table['type'] == 'table' and table['name'] == 'articles'), None)

    # Insérer les données dans la collection MongoDB
    if articles_data:
        for article in articles_data:
            if article["TypeIngredient"] == "0":
                db.ingredients.update_many(
                    {"nom": article['nom']},
                    {"$set": {"quantite": int(article['qte'])}}
                )
            if article["TypeIngredient"] == "2":
                db.ingredientsExtras.update_many(
                    {"nom": article['nom']},
                    {"$set": {"quantite": int(article['qte'])}}
                )
            if article["TypeIngredient"] == "1":
                db.viandes.update_many(
                    {"nom": article['nom']},
                    {"$set": {"quantite": int(article['qte'])}}
                )
            if article["TypeIngredient"] == "3":
                db.boissons.update_many(
                    {"nom": article['nom']},
                    {"$set": {"quantite": int(article['qte'])}}
                )
                db.snacks.update_many(
                    {"nom": article['nom']},
                    {"$set": {"quantite": int(article['qte'])}}
                )
    
    print("Migration des collections 'ingredients', 'viandes', 'boissons' et 'snacks' terminée avec succès!")


def ArticleAllMigration():
    # Lire le fichier JSON et extraire les données de la table "articles"
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        articles_data = next((table['data'] for table in data if table['type'] == 'table' and table['name'] == 'articles'), None)

    # Supprimer les collections existantes
    db.ingredients.delete_many({})
    db.ingredientsExtras.delete_many({})
    db.viandes.delete_many({})

    # Insérer les données dans la collection MongoDB
    if articles_data:
        for article in articles_data:
            if article["TypeIngredient"] == "0":
                db.ingredients.insert_many([
                    {
                        "nom": article['nom'],
                        "quantite": int(article['qte']),
                        "id": int(article['id_article']),
                        "commentaire": article['commentaire'],
                        "dispo": True,
                    }
                ])
            if article["TypeIngredient"] == "2":
                db.ingredientsExtras.insert_many([
                    {
                        "nom": article['nom'],
                        "quantite": int(article['qte']),
                        "id": int(article['id_article']),
                        "commentaire": article['commentaire'],
                        "dispo": True,
                    }
                ])
            if article["TypeIngredient"] == "1":
                db.viandes.insert_many([
                    {
                        "nom": article['nom'],
                        "quantite": int(article['qte']),
                        "id": int(article['id_article']),
                        "commentaire": article['commentaire'],
                        "dispo": True,
                    }
                ])
            if article["TypeIngredient"] == "3":
                db.boissons.update_many(
                    {"nom": article['nom']},
                    {"$set": {"quantite": int(article['qte'])}}
                )
                db.snacks.update_many(
                    {"nom": article['nom']},
                    {"$set": {"quantite": int(article['qte'])}}
                )
    
    print("Migration des collections 'ingredients', 'viandes', 'boissons' et 'snacks' terminée avec succès!")



def NettoyageMigration():
    # Lire le fichier JSON et extraire les données de la table "nettoyage"
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        nettoyage_data = next((table['data'] for table in data if table['type'] == 'table' and table['name'] == 'nettoyage'), None)
        
    # Insérer les données dans la collection MongoDB
    if nettoyage_data:
        db.nettoyage.delete_many({})
        for nettoyage in nettoyage_data:
            db.nettoyage.insert_one({
                "nettoyageId" : int(nettoyage['nettoyage_id']),
                "date" : nettoyage['date'],
                "explication" : nettoyage['explication'],
                "nomMembre" : nettoyage['nom_membre'],
            })
            
    print("Migration de la collection 'nettoyage' terminée avec succès!")


def PlanningMigration():
    # Lire le fichier JSON et extraire les données de la table "planning"
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        planning_data = next((table['data'] for table in data if table['type'] == 'table' and table['name'] == 'planning'), None)

    # Insérer les données dans la collection MongoDB
    if planning_data:
        db.planning.delete_many({})
        for planning in planning_data:
            db.planning.insert_one({
                "idPlanning" : int(planning['id_planning']),
                "date" : planning['date'],
                "numPoste" : int(planning['num_poste']),
                "numSemaine" : int(planning['num_semaine']),
                "prenom" : planning['prenom'],
                "tabac" : int(planning['tab']),
                "numCompte" : int(planning['id_user']),
            })
    
    print("Migration de la collection 'planning' terminée avec succès!")


def PlanningCoursesMigration():
    # Lire le fichier JSON et extraire les données de la table "planning_courses"
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        planning_courses_data = next((table['data'] for table in data if table['type'] == 'table' and table['name'] == 'planning_courses'), None)

    # Insérer les données dans la collection MongoDB
    if planning_courses_data:
        db.planningCourses.delete_many({})
        for planning_courses in planning_courses_data:
            db.planningCourses.insert_one({
                "id" : int(planning_courses['id']),
                "date" : planning_courses['date'],
                "numSemaine" : int(planning_courses['num_semaine']),
                "prenom" : planning_courses['prenom'],
                "numCompte" : int(planning_courses['id_user']),
            })
    
    print("Migration de la collection 'planning_courses' terminée avec succès!")


def TemperaturesMigration():
    # Lire le fichier JSON et extraire les données de la table "temperature"
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        temperatures_data = next((table['data'] for table in data if table['type'] == 'table' and table['name'] == 'temperatures'), None)

    # Insérer les données dans la collection MongoDB
    if temperatures_data:
        db.temperatures.delete_many({})
        for temperatures in temperatures_data:
            db.temperatures.insert_one({
                "temperatureId" : int(temperatures['temperature_id']),
                "date" : (datetime.strptime(temperatures['date'], "%Y-%m-%d %H:%M:%S").isoformat()+ "Z"),
                "nomMembre" : temperatures['NomMembre'],
                "tmp1": int(temperatures['tmp1']),
                "tmp2": int(temperatures['tmp2']),
                "tmp3": 0,
            })
    
    print("Migration de la collection 'temperatures' terminée avec succès!")

# CompteMigration()
AchatMigration()
ArticleQteMigration()
ArticleAllMigration()
NettoyageMigration()
PlanningMigration()
PlanningCoursesMigration()
TemperaturesMigration()


# Fermer la connexion MongoDB
client.close()

print("Migration terminée avec succès!")