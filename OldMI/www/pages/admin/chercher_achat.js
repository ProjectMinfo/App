const achats_elem = document.querySelectorAll(".achat");
const barre_recherche_achat = document.querySelector("#recherche_lot");
const barre_hide_close = document.querySelector("#checkboxHideClose");

// Récupère la valeur de l'input depuis le stockage local s'il existe
const savedSearchValue = localStorage.getItem('searchValue');
const savedHideValue = localStorage.getItem('HideValue');
if (savedSearchValue) {
  barre_recherche_achat.value = savedSearchValue;
}

//gére la préférence d'afficher ou non les lots fermés
barre_hide_close.checked = JSON.parse(savedHideValue);

// Fonction pour mettre à jour les résultats de la recherche
function updateSearchResults() {
  const searchValue = barre_recherche_achat.value.toLowerCase();
  const HideClose = barre_hide_close.checked;
  let previous = 1;

  for (let i = 0; i < achats_elem.length; i++) {
    const name = achats_elem[i].textContent.toLowerCase();
    console.log(achats_elem[i].textContent);

    //Code compacté qui permet de vérifier la recherche & si on affiche ou non les fermés
    const shouldDisplay = !HideClose
    ? name.includes(searchValue) && !name.includes("fermé") && !name.includes("périmé")
    : name.includes(searchValue);
  
    achats_elem[i].style.display = shouldDisplay ? 'table-row' : 'none';


    // Ajoute ou retire la classe "even" en fonction de la visibilité
    if (achats_elem[i].style.display === 'table-row') {
      if (previous === 0) {
        achats_elem[i].classList.add('even');
        achats_elem[i].classList.remove('odd');
        previous = 1;
      } else {
        achats_elem[i].classList.add('odd');
        achats_elem[i].classList.remove('even');
        previous = 0;
      }
    } else {
      achats_elem[i].classList.remove('even', 'odd');
    }
  }

  // Enregistre la valeur de l'input dans le stockage local
  localStorage.setItem('searchValue', searchValue);
  localStorage.setItem('HideValue', barre_hide_close.checked);
}

// Écoute l'événement 'input' sur l'input
barre_recherche_achat.addEventListener('input', updateSearchResults);
barre_hide_close.addEventListener('input', updateSearchResults);

// Appelle la fonction updateSearchResults pour mettre à jour les résultats au chargement de la page
updateSearchResults();
