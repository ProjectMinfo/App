const num_compte = document.querySelectorAll(".num_compte");
const barre_recherche_num_compte = document.querySelector("#recherche_num_compte");


//Recherche globale
barre_recherche_num_compte.addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    let previous = 1;
  
    for (let i = 0; i < num_compte.length; i++) {
        const name = num_compte[i].textContent.toLowerCase();
  
        if (name.includes(searchValue)) {
            num_compte[i].style.display = 'table-row';
        } else {
            num_compte[i].style.display = 'none';
        }

        // Ajoute ou retire la classe "even" en fonction de la visibilité
        if (num_compte[i].style.display === 'table-row') {
            if (previous === 0) {
                num_compte[i].classList.add('even');
                num_compte[i].classList.remove('odd');
                previous = 1;
            } else {
                num_compte[i].classList.add('odd');
                num_compte[i].classList.remove('even');
                previous = 0;
            }
        } else {
            num_compte[i].classList.remove('even', 'odd');
        }
    }
});
