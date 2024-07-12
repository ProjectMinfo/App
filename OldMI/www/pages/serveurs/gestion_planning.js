// Fonction pour gérer le clic sur un bouton
function boutonClique(event) {
    // On vérifie si l'utilisateur n'est pas déjà inscrit ce jour-là
    var tableauAssocie = JSON.parse(event.target.getAttribute("data-tab"));
    // Accédez au tableau (table) parent
    var tableauParent = event.target.closest("table");

    // Recherchez tous les boutons de désinscription (indice 1 de data-tab2) dans tout le tableau
    var boutonsDesinscription = tableauParent.querySelectorAll("button[id='delete'][data-tab2]");

    var donneesDataTab2 = [];

    boutonsDesinscription.forEach(function (bouton) {
        // Récupérez les données de data-tab2 (indice 1) pour chaque bouton
        var donnees = JSON.parse(bouton.getAttribute("data-tab2"));
        if (donnees.length > 1) {
            donneesDataTab2.push(donnees[1]);
        }
    });

    if (donneesDataTab2.includes(id_serveur)) {
        alert("Tu es déjà inscrit(e) ce jour-là");
    } else {
        $.ajax({
            url: "gestion_planning.php?poste=" + tableauAssocie[0] + "&num_poste=" + tableauAssocie[1] + "&date=" + tableauAssocie[2] + "&num_semaine=" + tableauAssocie[3] + "&tab=" + tableauAssocie[4],
            success: function (response) {
                $("#content").html(response);
            }
        });
    }
}

// Ajouter un écouteur d'événements à chaque bouton
var boutons = document.querySelectorAll(".inscrire");
for (var i = 0; i < boutons.length; i++) {
    boutons[i].addEventListener("click", boutonClique);
}
