function add_temperature() {
    // Créer une div pour le popup
    let popup = document.createElement("div");
    popup.className = "popup";

    // Ajouter du contenu au popup
    popup.innerHTML = `
        <h3>Ajouter un relevé</h3>
        <form method="POST" action="add-temp.php">
            <div>
                <div>
                    <label>Température frigo 1</label><br>
                    <input type="number" name="tmp1" required>
                </div>
                <div>
                    <label>Température frigo 2</label><br>
                    <input type="number" name="tmp2" required>
                </div>
            </div>
            <br>
            <input type="submit" value="Envoyer" name="sendTemp" id="confirm">
            <input type="button" value="Annuler" id="cancel">
        </form>
    `;

    // Ajouter le popup à la page
    document.body.appendChild(popup);

    // Fonction pour annuler la suppression
    document.getElementById("cancel").addEventListener("click", function(event) {
        // Fermez simplement le popup en le supprimant
        document.body.removeChild(popup);
    });
}

function add_nettoyage() {
    // Créer une div pour le popup
    let popup = document.createElement("div");
    popup.className = "popup";

    // Ajouter du contenu au popup
    popup.innerHTML = `
        <h3>Ajouter un nettoyage</h3>
        <form method="POST" action="add-nettoyage.php">
            <div>
                <label>Commentaire</label><br>
                <textarea name="comment" required></textarea>
            </div>
            <br>
            <input type="submit" value="Envoyer" name="sendNet" id="confirm">
            <input type="button" value="Annuler" id="cancel">
        </form>
    `;

    // Ajouter le popup à la page
    document.body.appendChild(popup);

    // Fonction pour annuler la suppression
    document.getElementById("cancel").addEventListener("click", function(event) {
        // Fermez simplement le popup en le supprimant
        document.body.removeChild(popup);
    });
}