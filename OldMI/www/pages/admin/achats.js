let categorie = document.getElementById("categorie");
let nom_article = document.getElementById("nom_article");
let id_produit = document.getElementById("id_produit");
let com = document.getElementById("commentaire");
if(nom_article.value == ""){
    com.style.display = "none";
}
else{
    com.style.display = "block";
}

//met à jour la liste des articles en fonction du type choisi
categorie.addEventListener('change', function(){
    let afficher;
    if(categorie.selectedIndex === 1){
        afficher = tab_ingredients;
    }
    if(categorie.selectedIndex === 2){
        afficher = tab_viandes;
    }
    if(categorie.selectedIndex === 3){
        afficher = tab_extra;
    }
    if(categorie.selectedIndex === 4){
        afficher = tab_boisson_snacks;
    }
    //on vide le select #nom_article (pour éviter le surajout de données)
    for(let i = nom_article.options.length - 1; i > 0; i--){
        nom_article.remove(i);
    }
    //on ajoute les elements
    for(let key in afficher){
    let value = afficher[key];
    let nouv_option = document.createElement("option");
    nouv_option.id = "name_option";
    nouv_option.value = value;
    nouv_option.text = value;
    nom_article.appendChild(nouv_option);
    }
});

//met à jour l'id de produit en fonction de l'article choisi
nom_article.addEventListener('change', function(){
    let elem_selectionne = nom_article.selectedIndex;
    let selected_ = nom_article.options[elem_selectionne];
    let tab_recherche;
    if(categorie.selectedIndex === 1){
        tab_recherche = tab_ingredients;
    }
    else if(categorie.selectedIndex === 2){
        tab_recherche = tab_viandes;
    }
    else if(categorie.selectedIndex === 3){
        tab_recherche = tab_extra;
    }
    else if(categorie.selectedIndex === 4){
        tab_recherche = tab_boisson_snacks;
    }
    let global_key;
    //recherche de l'id
    for(let key in tab_recherche){
        let value = tab_recherche[key];
        if(value === selected_.text){
            id_produit.value = key;
            global_key = key;
        }
    }

    let comment = commentaires[global_key];
    if(comment !== ""){
        com.innerHTML = comment;
        com.style.display = "block";
    }
    else{
        com.style.display = "none";
    }
});