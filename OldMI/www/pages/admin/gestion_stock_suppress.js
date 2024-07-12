function validate_stock_deletion(id_article) {
    // Créer une div pour le popup
    let popup = document.createElement("div");
    popup.className = "popup";

    // Ajouter du contenu au popup
    popup.innerHTML = `
        <p>Voulez-vous vraiment supprimer l'article avec l'ID ${id_article} ?</p>
        <a href="delete_article.php?id=${id_article}" id="confirmDelete">Confirmer</a>
        <a href="" id="cancelDelete">Annuler</a>
    `;

    // Ajouter le popup à la page
    document.body.appendChild(popup);

    // Fonction pour gérer la confirmation de la suppression
    document.getElementById("confirmDelete").addEventListener("click", function(event) {
        // Supprimez l'élément ici
        // Vous pouvez ajouter votre logique de suppression ici
        // Après la suppression, supprimez également le popup
        document.body.removeChild(popup);
    });

    // Fonction pour annuler la suppression
    document.getElementById("cancelDelete").addEventListener("click", function(event) {
        // Fermez simplement le popup en le supprimant
        document.body.removeChild(popup);
    });
}