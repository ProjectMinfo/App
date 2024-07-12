function validate_achat_deletion(id_achat, article_id, nb_portions, etat, already_del) {
    // Créer une div pour le popup
    let popup = document.createElement("div");
    popup.className = "popup";

    // Ajouter du contenu au popup
    popup.innerHTML = `
        <p>Voulez-vous vraiment supprimer l'achat avec l'ID ${id_achat} ?</p>
        <a href="delete_achat.php?id=${id_achat}&id_produit=${article_id}&portions=${nb_portions}&etat=${etat}&already_del=${already_del}" id="confirmDelete">Confirmer</a>
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