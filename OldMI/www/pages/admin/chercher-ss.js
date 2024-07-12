const line_nettoyage = document.querySelectorAll(".ligne-nettoyage");
const barre_recherche_nettoyage = document.querySelector("#rechercher-nettoyage");


//Recherche globale
barre_recherche_nettoyage.addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    let previous = 1;
  
    for (let i = 0; i < line_nettoyage.length; i++) {
        const name = line_nettoyage[i].textContent.toLowerCase();
  
        if (name.includes(searchValue)) {
            line_nettoyage[i].style.display = 'table-row';
        } else {
            line_nettoyage[i].style.display = 'none';
        }
        // Ajoute ou retire la classe "even" en fonction de la visibilité
        if (line_nettoyage[i].style.display === 'table-row') {
            if (previous === 0) {
                line_nettoyage[i].classList.add('even');
                line_nettoyage[i].classList.remove('odd');
                previous = 1;
            } else {
                line_nettoyage[i].classList.add('odd');
                line_nettoyage[i].classList.remove('even');
                previous = 0;
            }
        } else {
            line_nettoyage[i].classList.remove('even', 'odd');
        }
    }
});

const line_temp = document.querySelectorAll(".ligne-temp");
const barre_recherche_temp = document.querySelector("#rechercher-temp");


//Recherche globale
barre_recherche_temp.addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    let previous = 1;
  
    for (let i = 0; i < line_temp.length; i++) {
        const name = line_temp[i].textContent.toLowerCase();
  
        if (name.includes(searchValue)) {
            line_temp[i].style.display = 'table-row';
        } else {
            line_temp[i].style.display = 'none';
        }

        // Ajoute ou retire la classe "even" en fonction de la visibilité
        if (line_temp[i].style.display === 'table-row') {
            if (previous === 0) {
                line_temp[i].classList.add('even');
                line_temp[i].classList.remove('odd');
                previous = 1;
            } else {
                line_temp[i].classList.add('odd');
                line_temp[i].classList.remove('even');
                previous = 0;
            }
        } else {
            line_temp[i].classList.remove('even', 'odd');
        }
    }
});