const cleanedInputString = inputString.trim(); // Supprime les espaces au début et à la fin
const elementsArray = cleanedInputString.split(";");
const nestedArrays = elementsArray.map(element => element.split(","));

//faire apparaitre dynamiquement les éléments deja ajoutés
for (let key in nestedArrays) {
    (function(key) {
        var nouvelleSection = document.createElement("section");
        nouvelleSection.className = "ingredients_pos";

        var selectIngredient = document.createElement("select");
        selectIngredient.name = "article";
        selectIngredient.id = "article";
        selectIngredient.required = true;
        var optionIngr = document.createElement("option");
        optionIngr.value = "";
        optionIngr.disabled = true;
        optionIngr.textContent = "Ingrédient";
        selectIngredient.appendChild(optionIngr);
        for(let key2 in tab_ingredients){
            let value = tab_ingredients[key2];
            let nouv_option = document.createElement("option");
            nouv_option.value = key2;
            nouv_option.text = value;
            if(key2 == nestedArrays[key][0]){
                nouv_option.selected = true;
            }
            selectIngredient.appendChild(nouv_option);
            }

        var selectQte = document.createElement("select");
        selectQte.name = "qte";
        selectQte.id = "qte";
        selectQte.required = true;
        var optionQte = document.createElement("option");
        optionQte.value = "";
        optionQte.disabled = true;
        optionQte.textContent = "Quantité";
        var optionQte1 = document.createElement("option");
        optionQte1.value = "1";
        optionQte1.textContent = "1";
        if(nestedArrays[key][1] == 1){
            optionQte1.selected = true;
        }
        var optionQte2 = document.createElement("option");
        optionQte2.value = "2";
        optionQte2.textContent = "2";
        if(nestedArrays[key][1] == 2){
            optionQte2.selected = true;
        }
        var optionQte3 = document.createElement("option");
        optionQte3.value = "3";
        optionQte3.textContent = "3";
        if(nestedArrays[key][1] == 3){
            optionQte3.selected = true;
        }
        var optionQte4 = document.createElement("option");
        optionQte4.value = "4";
        optionQte4.textContent = "4";
        if(nestedArrays[key][1] == 4){
            optionQte4.selected = true;
        }
        var optionQte5 = document.createElement("option");
        optionQte5.value = "5";
        optionQte5.textContent = "5";
        if(nestedArrays[key][1] == 5){
            optionQte5.selected = true;
        }
        var optionQte6 = document.createElement("option");
        optionQte6.value = "6";
        optionQte6.textContent = "6";
        if(nestedArrays[key][1] == 6){
            optionQte6.selected = true;
        }
        var optionQte7 = document.createElement("option");
        optionQte7.value = "7";
        optionQte7.textContent = "7";
        if(nestedArrays[key][1] == 7){
            optionQte7.selected = true;
        }
        var optionQte8 = document.createElement("option");
        optionQte8.value = "8";
        optionQte8.textContent = "8";
        if(nestedArrays[key][1] == 8){
            optionQte8.selected = true;
        }
        var optionQte9 = document.createElement("option");
        optionQte9.value = "9";
        optionQte9.textContent = "9";
        if(nestedArrays[key][1] == 9){
            optionQte9.selected = true;
        }
        var optionQte10 = document.createElement("option");
        optionQte10.value = "10";
        optionQte10.textContent = "10";
        if(nestedArrays[key][1] == 10){
            optionQte10.selected = true;
        }

        selectQte.appendChild(optionQte);
        selectQte.appendChild(optionQte1);
        selectQte.appendChild(optionQte2);
        selectQte.appendChild(optionQte3);
        selectQte.appendChild(optionQte4);
        selectQte.appendChild(optionQte5);
        selectQte.appendChild(optionQte6);
        selectQte.appendChild(optionQte7);
        selectQte.appendChild(optionQte8);
        selectQte.appendChild(optionQte9);
        selectQte.appendChild(optionQte10);

        var selectDefaut = document.createElement("select");
        selectDefaut.name = "defaut";
        selectDefaut.id = "defaut";
        selectDefaut.required = true;
        var optionDefaut = document.createElement("option");
        optionDefaut.value = "0";
        optionDefaut.textContent = "Choix libre";
        if(nestedArrays[key][2] == 0){
            optionDefaut.selected = true;
        }
        var optionDefaut1 = document.createElement("option");
        optionDefaut1.value = "1";
        optionDefaut1.textContent = "Par défaut";
        if(nestedArrays[key][2] == 1){
            optionDefaut1.selected = true;
        }
        var optionDefaut2 = document.createElement("option");
        optionDefaut2.value = "2";
        optionDefaut2.textContent = "Obligatoire";
        if(nestedArrays[key][2] == 2){
            optionDefaut2.selected = true;
        }
        selectDefaut.appendChild(optionDefaut);
        selectDefaut.appendChild(optionDefaut1);
        selectDefaut.appendChild(optionDefaut2);

        var lienSuppression = document.createElement("a");
        lienSuppression.href = "#";
        var imgElement = document.createElement("img");
        imgElement.src = "../../assets/svg/trash-solid.svg";
        imgElement.className = "delete";
        lienSuppression.appendChild(imgElement);

        lienSuppression.onclick = function() {
            nouvelleSection.remove(); // Supprime l'élément de cette itération
        };

        nouvelleSection.appendChild(selectIngredient);
        nouvelleSection.appendChild(selectQte);
        nouvelleSection.appendChild(selectDefaut);
        nouvelleSection.appendChild(lienSuppression);

        var sectionsContainer = document.getElementById('sectionsContainer');
        if (!sectionsContainer) {
            sectionsContainer = document.createElement('div');
            sectionsContainer.id = 'sectionsContainer';
            document.body.appendChild(sectionsContainer);
        }
        sectionsContainer.appendChild(nouvelleSection);
    })(key);
}

function ajouterIngredient() {
    var nouvelleSection = document.createElement("section");
    nouvelleSection.className = "ingredients_pos";

    var selectIngredient = document.createElement("select");
    selectIngredient.name = "article";
    selectIngredient.id = "article";
    selectIngredient.required = true;
    var optionIngr = document.createElement("option");
    optionIngr.value = "";
    optionIngr.disabled = true;
    optionIngr.selected = true;
    optionIngr.textContent = "Ingrédient";
    selectIngredient.appendChild(optionIngr);
    for(let key in tab_ingredients){
        let value = tab_ingredients[key];
        let nouv_option = document.createElement("option");
        nouv_option.value = key;
        nouv_option.text = value;
        selectIngredient.appendChild(nouv_option);
        }

    var selectQte = document.createElement("select");
    selectQte.name = "qte";
    selectQte.id = "qte";
    selectQte.required = true;
    var optionQte = document.createElement("option");
    optionQte.value = "";
    optionQte.disabled = true;
    optionQte.selected = true;
    optionQte.textContent = "Quantité";
    var optionQte1 = document.createElement("option");
    optionQte1.value = "1";
    optionQte1.textContent = "1";
    var optionQte2 = document.createElement("option");
    optionQte2.value = "2";
    optionQte2.textContent = "2";
    var optionQte3 = document.createElement("option");
    optionQte3.value = "3";
    optionQte3.textContent = "3";
    var optionQte4 = document.createElement("option");
    optionQte4.value = "4";
    optionQte4.textContent = "4";
    var optionQte5 = document.createElement("option");
    optionQte5.value = "5";
    optionQte5.textContent = "5";
    var optionQte6 = document.createElement("option");
    optionQte6.value = "6";
    optionQte6.textContent = "6";
    var optionQte7 = document.createElement("option");
    optionQte7.value = "7";
    optionQte7.textContent = "7";
    var optionQte8 = document.createElement("option");
    optionQte8.value = "8";
    optionQte8.textContent = "8";
    var optionQte9 = document.createElement("option");
    optionQte9.value = "9";
    optionQte9.textContent = "9";
    var optionQte10 = document.createElement("option");
    optionQte10.value = "10";
    optionQte10.textContent = "10";

    selectQte.appendChild(optionQte);
    selectQte.appendChild(optionQte1);
    selectQte.appendChild(optionQte2);
    selectQte.appendChild(optionQte3);
    selectQte.appendChild(optionQte4);
    selectQte.appendChild(optionQte5);
    selectQte.appendChild(optionQte6);
    selectQte.appendChild(optionQte7);
    selectQte.appendChild(optionQte8);
    selectQte.appendChild(optionQte9);
    selectQte.appendChild(optionQte10);

    var selectDefaut = document.createElement("select");
    selectDefaut.name = "defaut";
    selectDefaut.id = "defaut";
    selectDefaut.required = true;
    var optionDefaut = document.createElement("option");
    optionDefaut.value = "0";
    optionDefaut.selected = true;
    optionDefaut.textContent = "Choix libre";
    var optionDefaut1 = document.createElement("option");
    optionDefaut1.value = "1";
    optionDefaut1.textContent = "Par défaut";
    var optionDefaut2 = document.createElement("option");
    optionDefaut2.value = "2";
    optionDefaut2.textContent = "Obligatoire";
    selectDefaut.appendChild(optionDefaut);
    selectDefaut.appendChild(optionDefaut1);
    selectDefaut.appendChild(optionDefaut2);

    var lienSuppression = document.createElement("a");
    lienSuppression.href = "#";
    var imgElement = document.createElement("img");
    imgElement.src = "../../assets/svg/trash-solid.svg";
    imgElement.className = "delete";
    lienSuppression.appendChild(imgElement);
    lienSuppression.onclick = function() {
        nouvelleSection.remove();
    };

    nouvelleSection.appendChild(selectIngredient);
    nouvelleSection.appendChild(selectQte);
    nouvelleSection.appendChild(selectDefaut);
    nouvelleSection.appendChild(lienSuppression);

    var sectionsContainer = document.getElementById('sectionsContainer');
    if (!sectionsContainer) {
        sectionsContainer = document.createElement('div');
        sectionsContainer.id = 'sectionsContainer';
        document.body.appendChild(sectionsContainer);
    }
    sectionsContainer.appendChild(nouvelleSection);
}

const form = document.getElementById("update_carte_elem");
const hiddenInput = document.getElementById("liste");

form.addEventListener("submit", function (event) {
    event.preventDefault(); // Empêche l'envoi du formulaire

    const sections = document.querySelectorAll(".ingredients_pos");
    const valuesArray = [];

    sections.forEach(section => {
        const articleSelect = section.querySelector("#article");
        const qteSelect = section.querySelector("#qte");
        const defautSelect = section.querySelector("#defaut");

        const articleValue = articleSelect.value;
        const qteValue = qteSelect.value;
        const defautValue = defautSelect.value;

        const sectionValues = `${articleValue},${qteValue},${defautValue};`;
        valuesArray.push(sectionValues);
    });

    const inputString = valuesArray.join(";");
    const groups = inputString.split(";").filter(group => group.trim() !== ""); // Divise en groupes et filtre les vides
    const modifiedGroups = groups.map(group => group.replace(/^(,)/, "")); // Supprime la première virgule de chaque groupe
    let resultString = modifiedGroups.join(";"); // Rejoint les groupes modifiés en une chaîne

    // Joindre les valeurs en une seule chaîne et les mettre dans l'input hidden
    hiddenInput.value = resultString;

    // Ensuite, soumettez le formulaire manuellement
    form.submit();
});