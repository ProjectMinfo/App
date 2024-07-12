const noms = document.querySelectorAll(".nom");
const barre_recherche_nom = document.querySelector("#recherche_nom");
const donnees = document.querySelector(".donnees");

function hideIngredients() {
  const parentDiv = document.getElementById("ingredients");
  const spanElements = parentDiv.getElementsByTagName("tr");
  let allChildrenHidden = true;

  for (let i = 0; i < spanElements.length; i++) {
      if (getComputedStyle(spanElements[i]).display !== "none") {
          allChildrenHidden = false;
          break;
      }
  }

  if (allChildrenHidden) {
      parentDiv.style.display = "none";
  }
  else{
    parentDiv.style.display = "flex";
  }
}

function hideViande() {
  const parentDiv = document.getElementById("viande");
  const spanElements = parentDiv.getElementsByTagName("tr");
  let allChildrenHidden = true;

  for (let i = 0; i < spanElements.length; i++) {
      if (getComputedStyle(spanElements[i]).display !== "none") {
          allChildrenHidden = false;
          break;
      }
  }

  if (allChildrenHidden) {
      parentDiv.style.display = "none";
  }
  else{
    parentDiv.style.display = "flex";
  }
}

function hideExtra() {
  const parentDiv = document.getElementById("extra");
  const spanElements = parentDiv.getElementsByTagName("tr");
  let allChildrenHidden = true;

  for (let i = 0; i < spanElements.length; i++) {
      if (getComputedStyle(spanElements[i]).display !== "none") {
          allChildrenHidden = false;
          break;
      }
  }

  if (allChildrenHidden) {
      parentDiv.style.display = "none";
  }
  else{
    parentDiv.style.display = "flex";
  }
}

function hideBoisson() {
  const parentDiv = document.getElementById("boisson");
  const spanElements = parentDiv.getElementsByTagName("tr");
  let allChildrenHidden = true;

  for (let i = 0; i < spanElements.length; i++) {
      if (getComputedStyle(spanElements[i]).display !== "none") {
          allChildrenHidden = false;
          break;
      }
  }

  if (allChildrenHidden) {
      parentDiv.style.display = "none";
  }
  else{
    parentDiv.style.display = "flex";
  }
}

//pour la recherche par nom d'article
barre_recherche_nom.addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
  
    for (let i = 0; i < noms.length; i++) {
      const name = noms[i].textContent.toLowerCase();
  
      if (name.includes(searchValue)) {
        noms[i].parentNode.style.display = 'table-row';
      } else {
        noms[i].parentNode.style.display = 'none';
      }
    }
    hideIngredients();
    hideViande();
    hideExtra();
    hideBoisson();

    // Fonction pour mettre à jour la classe .odd en fonction du nombre d'éléments affichés
    function updateOddClass() {
      const parentDivs = [document.getElementById("ingredients"), document.getElementById("viande"), document.getElementById("extra"), document.getElementById("boisson")];

      for (const parentDiv of parentDivs) {
        const spanElements = parentDiv.getElementsByTagName("tr");
        let odd = true;

        for (let i = 0; i < spanElements.length; i++) {
          if (getComputedStyle(spanElements[i]).display !== "none") {
            // Si l'élément est affiché, alternez la classe .odd
            spanElements[i].classList.toggle("odd", odd);
            odd = !odd;
          }
        }
      }
    }

    updateOddClass();
});