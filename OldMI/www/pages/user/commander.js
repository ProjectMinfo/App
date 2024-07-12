var menu = parseInt(document.getElementById("menuNum").innerHTML);
var maxPeriph = 0;
switch (menu) {
    case 1:
        maxPeriph = 2;
        break;
    case 2:
        maxPeriph = 1;
        break;
    case 3:
        maxPeriph = 0;
        break;
}


function openOptions(numPlat, OptionContainer) {
    let allOptions = document.getElementsByClassName('option-div-plat-' + numPlat.toString());

    for (const elt of allOptions) {
        elt.style.display = 'none';
    }
    OptionContainer.style.display = 'block';
}

function changeDoubleIngredient(plat, numPlat) {
    let inputs = document.getElementsByName(plat + 'identiques' + numPlat);

    let doubleIngredientDiv = document.getElementsByClassName(plat + 'IngredientList2' + numPlat);
    let simpleIngrdientDiv = document.getElementsByClassName(plat + 'IngredientList1' + numPlat);

    for (const input of inputs) {
        if (input.value == "True" && input.checked === true) {
            doubleIngredientDiv[0].style.display = 'block';
            simpleIngrdientDiv[0].style.width = '50%'
        } else {
            doubleIngredientDiv[0].style.display = 'none';
            simpleIngrdientDiv[0].style.width = '100%'
        }
    }
}


function checkIngredients(nomClass, elt) {

    let ingredientDiv = document.getElementsByName(nomClass);
    let viandes = 0;
    let ingredients = 0;
    for (let item of ingredientDiv) {

        if (item.checked === true) {
            switch (item.attributes['typeing'].value) {
                case "viande":
                    viandes++;
                    ingredients++;
                    break;
                case "ingredient":
                    ingredients++;
                    break;
            }
        }
    }

    if (viandes > 1) {
        alert("Vous avez dÃ©ja le nombre maximum de viandes");
        elt.checked = false;
    } else if (ingredients > 2) {
        alert("Vous avez dÃ©ja pris le nombre d'ingrÃ©dients maximum");
        elt.checked = false;
    }


}

function showSecond(elt, secondElt) {

    secondElt = document.getElementById(secondElt);
    let allSeconds = document.getElementsByClassName('snack-2');
    if (secondElt) {
        secondElt.style.display = 'block';
    }
}

function checkSnacks(elt, secondElt) {

    let nbSnacks = 0
    let checkboxList = document.getElementsByName('snacks[]');
    for (let checkbox of checkboxList) {
        if (checkbox.checked) {
            nbSnacks++;
        }
    }
    if (nbSnacks >= maxPeriph) {
        elt.control.checked = true;
    } else {

        showSecond(elt, secondElt);

    }


    secondElt = document.getElementById(secondElt)
    if (secondElt.control.checked == false && elt.control.checked == true) {
        secondElt.style.display = 'none';
    }

}

function cacherSnack(elt) {

    if (elt.control.checked === true) {
        elt.style.display = 'none';
    }
}
// Attach event listeners
/*
document.addEventListener("DOMContentLoaded", function () {
    const platItem = document.querySelector(".plat-item.labl");
    platItem.addEventListener("click", function () {
        openOptions(1, this.children[1].children[1]);
    });
});
*/
