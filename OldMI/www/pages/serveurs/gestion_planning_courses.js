// Fonction pour gérer le clic sur un bouton
function boutonCliqueCourses(event) {
    // On vérifie si l'utilisateur n'est pas déjà inscrit ce jour-là
    var tableauAssocie = JSON.parse(event.target.getAttribute("data-tab"));
    // Accédez au tableau (table) parent
    var tableauParent = event.target.closest("table");

    // Recherchez tous les boutons de désinscription (indice 1 de data-tab2) dans tout le tableau
    var boutonsDesinscriptionCourses = tableauParent.querySelectorAll("button[id='delete_courses'][data-tab2]");

    var donneesDataTab2 = [];

    boutonsDesinscriptionCourses.forEach(function (bouton) {
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
            url: "gestion_planning_courses.php?date=" + tableauAssocie[2] + "&num_semaine=" + tableauAssocie[3],
            success: function (response) {
                $("#content2").html(response);
            }
        });
    }
}

// Ajouter un écouteur d'événements à chaque bouton
var boutons = document.querySelectorAll(".inscrire_courses");
for (var i = 0; i < boutons.length; i++) {
    boutons[i].addEventListener("click", boutonCliqueCourses);
}
