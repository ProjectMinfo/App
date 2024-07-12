const elem_carte = document.querySelectorAll(".elem_carte");
const barre_recherche_elem = document.querySelector("#recherche_elem");

//pour la recherche par element
barre_recherche_elem.addEventListener('input', function() {
  const searchValue = this.value.toLowerCase();
  let previous = 1;

  for (let i = 0; i < elem_carte.length; i++) {
      const name = elem_carte[i].textContent.toLowerCase();

      if (name.includes(searchValue)) {
          elem_carte[i].style.display = 'table-row';
      } else {
          elem_carte[i].style.display = 'none';
      }

      // Ajoute ou retire la classe "even" en fonction de la visibilité
      if (elem_carte[i].style.display === 'table-row') {
          if (previous === 0) {
              elem_carte[i].classList.add('even');
              elem_carte[i].classList.remove('odd');
              previous = 1;
          } else {
              elem_carte[i].classList.add('odd');
              elem_carte[i].classList.remove('even');
              previous = 0;
          }
      } else {
              elem_carte[i].classList.remove('even', 'odd');
      }
  }
});