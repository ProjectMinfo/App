<?php

session_start(); //démarrage de la session
require_once('../../includes/functions.php');
areSetCookies(); //création de la session si cookies existent

if (!isConnected()) {
  header("Location: ../index.php");
  exit();
} elseif (!isServeur($conn, $_SESSION["utilisateur"]["uid"])) {
  header("Location: ../index.php");
  exit();
}
//Gestion 
?>

<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
  <title>Chti'MI | Cuisine serveurs</title>
  <link rel="stylesheet" href="/assets/css/global.css">
  <link rel="stylesheet" href="/assets/css/affichageCuisine.css">
  <script src="JS/commandes.js"></script>
  <script src="JS/affichageCuisine.js"></script>
</head>

<body>
  <div id="MainBlock">
    <div id="FroidDiv">
      <div id="TextFroid" class="TexteZone">Froid</div>
      <div class="CommandeZone" id="CommandeFroid">
        <div class="bloc">
          <div class="ligne">
            <div class="colonne NameZone">William B</div>
            <div class="colonne NourritureZone">Sandwitch Poulet Curry Maroilles tomate salade beurre</div>
            <div class="colonne AlliasZone">SPCM crud</div>
          </div>
          <div class="ligne">
            <div class="colonne CommentaireZone">Déposer au frigo</div>
          </div>
        </div>
        <div class="bloc">
          <div class="ligne">
            <div class="colonne NameZone">William B</div>
            <div class="colonne NourritureZone">Sandwitch Poulet Curry Maroilles tomate salade beurre</div>
            <div class="colonne AlliasZone">SPCM crud</div>
          </div>
        </div>
        <div class="bloc">
          <div class="ligne">
            <div class="colonne NameZone">William B</div>
            <div class="colonne NourritureZone">Sandwitch Poulet Curry Maroilles tomate salade beurre</div>
            <div class="colonne AlliasZone">SPCM crud</div>
          </div>
        </div>
        <div class="bloc">
          <div class="ligne">
            <div class="colonne NameZone">William B</div>
            <div class="colonne NourritureZone">Sandwitch Poulet Curry Maroilles tomate salade beurre</div>
            <div class="colonne AlliasZone">SPCM crud</div>
          </div>
        </div>
        <div class="bloc">
          <div class="ligne">
            <div class="colonne NameZone">William B</div>
            <div class="colonne NourritureZone">Sandwitch Poulet Curry Maroilles tomate salade beurre</div>
            <div class="colonne AlliasZone">SPCM crud</div>
          </div>
        </div>
      </div>
    </div>
    <div id="ChaudDiv">
      <div id="TextChaud" class="TexteZone">Chaud</div>
      <div class="CommandeZone" id="CommandeChaud"></div>
    </div>
  </div>
</body>

</html>