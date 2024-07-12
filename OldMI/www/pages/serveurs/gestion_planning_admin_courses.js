//pour ajouter un serveur par le biais d'un admin
function add_serveur_courses(event) {
    var tableauAssocie = JSON.parse(event.target.getAttribute("data-tab"));
    var tableauParent = event.target.closest("table");

    var boutonsDesinscriptionCourses = tableauParent.querySelectorAll("button[id='delete_courses'][data-tab2]");

    var donneesDataTab2 = [];

    boutonsDesinscriptionCourses.forEach(function (bouton) {
        var donnees = JSON.parse(bouton.getAttribute("data-tab2"));
        if (donnees.length > 1) {
            donneesDataTab2.push(donnees[1]);
        }
    });

    let popup = document.createElement("div");
    popup.className = "popup";

    const selectElement = document.createElement('select');
    selectElement.id = 'addserv';

    serveurs.forEach(server => {
        const option = document.createElement('option');
        option.value = server[0];
        option.text = server[1] + " " + server[2];
        selectElement.appendChild(option);
    });

    popup.innerHTML += `
        <h3>Ajouter un serveur</h3>
        <form method="POST">
            <div>
                <div>
                    <label>Choisir le serveur</label><br>
                    ${selectElement.outerHTML}
                </div>
            </div>
            <br>
            <input type="submit" value="Inscrire" name="sendTemp" id="confirm" class="add_serv_admin">
            <input type="button" value="Annuler" id="cancel">
        </form>
    `;

    document.body.appendChild(popup);

    document.getElementById("cancel").addEventListener("click", function (event) {
        document.body.removeChild(popup);
    });

    //écouteur d'événements au bouton Inscrire dans la popup
    document.getElementById("confirm").addEventListener("click", function (event) {
        var selectedServerId = document.getElementById("addserv").value;
        if (donneesDataTab2.includes(parseInt(selectedServerId))) {
            alert("Le serveur est déjà inscrit(e) ce jour-là");
        } else {
            $.ajax({
                url: "gestion_planning_courses.php?date=" + tableauAssocie[2] + "&num_semaine=" + tableauAssocie[3] + "&idserveur=" + selectedServerId,
                success: function (response) {
                    $("#content2").html(response);
                }
            });
        }
    });
}

//écouteur d'événements aux éléments avec la classe choix
var choix_courses = document.querySelectorAll(".choix_courses");
for (var i = 0; i < choix_courses.length; i++) {
    choix_courses[i].addEventListener("click", add_serveur_courses);
}