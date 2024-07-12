// Fonction pour gérer le clic sur un bouton
function boutonClique2(event) {
    // Récupérer l'attribut data-tableau du bouton cliqué
    var tableauAssocie2 = JSON.parse(event.target.getAttribute("data-tab2"));
    $.ajax({
        url: "delete_planning_courses.php?id_planning=" + tableauAssocie2[0] + "&num_semaine=" + tableauAssocie2[2],
        success: function (response) {
            $("#content2").html(response);
        }
    });
}

// Ajouter un écouteur d'événements à chaque bouton
var boutons3 = document.querySelectorAll("#delete_courses");
for (var i = 0; i < boutons3.length; i++) {
    boutons3[i].addEventListener("click", boutonClique2);
}