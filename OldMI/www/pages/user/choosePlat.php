<?php
session_start();
require_once('../../includes/functions.php');
areSetCookies();
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Choisissez vos plats</title>
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/commandeUser/choosePlat.css">
</head>

<body>
    <?php
    date_default_timezone_set('Europe/Paris');

    if (!isset($_SESSION['utilisateur']) && empty($_SESSION['utilisateur'])) {
        header("Location:commander.php");
        die();
    }

    if(HeuresActives($conn)){
        if (!canOrder($conn) || in_array(date("N"), array(6, 7))) {
            header("Location:commander.php");
            die();
        } elseif (intval(date("H")) >= 12 || intval(date("H")) < 0) {
            header("Location:commander.php");
            die();
        }
    }
    if (!isset($_GET['menu']) || empty($_GET['menu'])) {
        header("Location:commander.php");
        die();
    } elseif (intval($_GET['menu']) <= 0 || intval($_GET['menu']) > 3) {
        header("Location:commander.php");
        die();
    }

    $menu = intval($_GET['menu']);

    require_once("../../includes/header.php");
    ?>
    <a href="commander.php"><- Retour</a>

            <?php
            if (isset($_SESSION['erreurs'][0])) {
            ?>
                <div class="MentionsMainDiv">
                    <div>
                        <p>❗ <?= $_SESSION['erreurs'][0] ?> ❗</p>
                    </div>
                </div>

            <?php
                $_SESSION['erreurs'] = [];
            }
            ?>


            <div class="headCategory">
                <h1 class="text-center subTitle">Plats</h1>
                <p class="text-center">Choissisez 1 plat</p>
                <?php
                $platsList = getAllPlats($conn);
                ?>
                <span id="menuNum" class="hiddenCheckbox"><?= $menu ?></span>

            </div>


            <div>
                <form method="POST" action="validateCommande.php">
                    <input type="number" name="menu" value="<?= $menu ?>" class="hiddenCheckbox">
                    <div class="plats-container">


                        <?php

                        foreach ($platsList as $plat) {
                            $display = true;
                            if ($plat["ref"] == "EVENT") {
                                $display = false;
                            }
                            $ingredientsList = explode(';', $plat['ingredientsPossibles']);

                            foreach ($ingredientsList as $ingredientGroupe) {
                                $ingredientGroupe = explode(",", $ingredientGroupe);
                                if (intval($ingredientGroupe[2]) == 2) {
                                    if (intval(getIngredientById($conn, $ingredientGroupe[0])['qte']) < intval($ingredientGroupe[1])) {
                                        $display = false;
                                    }
                                }
                            }
                            if ($display) {
                        ?>
                                <label class="plat-item labl" id="plat" onclick="openOptions(1, this.children[1].children[1]);">
                                    <input type="radio" class="menuCheckbox" name="plat1[]" value="<?= $plat['id_carte'] ?>" onclick="event.stopPropagation()">
                                    <div class="conatinerPlat">
                                        <h2 class="plat-title"><?= $plat['nom'] ?>
                                            <?php
                                            if ($plat['nom'] == "Croque-Monsieur" || $plat['nom'] == "Hot-Dog") {
                                                echo ("x2");
                                            }
                                            ?>
                                        </h2>

                                        <div class="option-div-plat-1 option-div">

                                            <?php
                                            if ($plat['nom'] == "Croque-Monsieur" || $plat['nom'] == "Hot-Dog") {
                                            ?>
                                                <input type="radio" name="<?= $plat['nom'] . 'identiques1' ?>" value="False" checked onclick="changeDoubleIngredient('<?= $plat['nom'] ?>',1)" id="Identiques<?= $plat['nom'] ?>1"><label for="Identiques<?= $plat['nom'] ?>1">Identiques</label>
                                                <input type="radio" name="<?= $plat['nom'] . 'identiques1' ?>" value="True" onclick="changeDoubleIngredient('<?= $plat['nom'] ?>',1)" id="Differents<?= $plat['nom'] ?>1"><label for="Differents<?= $plat['nom'] ?>1">Différents</label>

                                            <?php
                                            }


                                            ?>



                                            <?php
                                            $iterator = 1;

                                            if ($plat['nom'] == "Croque-Monsieur" || $plat['nom'] == "Hot-Dog") {
                                                $iterator =  2;
                                            }



                                            $viandes = [];
                                            $ingredients = [];
                                            $extras = [];

                                            foreach ($ingredientsList as $ingredientData) {
                                                $parts = explode(",", $ingredientData);
                                                $ingredientId = $parts[0];
                                                $ingredientQuantity = $parts[1];
                                                $ingredientDefault = $parts[2];

                                                $ingredient = getIngredientById($conn, $ingredientId);

                                                if ($ingredient) {

                                                    $ingredient['default'] = $ingredientDefault;
                                                    $ingredient['quantity'] = $ingredientQuantity;

                                                    if (isset($ingredient['TypeIngredient'])) {


                                                        switch ($ingredient['TypeIngredient']) {
                                                            case 0:
                                                                $ingredients[] = $ingredient;
                                                                break;
                                                            case 1:
                                                                $viandes[] = $ingredient;
                                                                break;
                                                            case 2:
                                                                $extras[] = $ingredient;
                                                                break;
                                                            default:
                                                                $extras[] = $ingredient;
                                                                break;
                                                        }
                                                    }
                                                }
                                            }


                                            ?>
                                            <div class="ingredients-list">
                                                <?php
                                                for ($i = 1; $i <= $iterator; $i++) {
                                                    $chossableViandes = [];
                                                    foreach ($viandes as $ing) {
                                                        if ($ing['default'] != 2) {
                                                            $chossableViandes[] = $ing;
                                                        }
                                                    } ?>
                                                    <div class="<?= $plat['nom'] ?>IngredientList<?= $i ?>1 <?php if ($i == 2) {
                                                                                                                echo (' SecondIngredientList');
                                                                                                            } else {
                                                                                                                echo (' FirstIngredientList');
                                                                                                            } ?>">
                                                        <?php if (!empty($chossableViandes)) { ?>

                                                            <div class="ingDiv" viande>
                                                                <strong>Viandes (1 max) :</strong>
                                                                <?php

                                                                foreach ($viandes as $ing) {

                                                                    if ($ing['default'] != 2 && $ing['qte'] > $ing['quantity']) {
                                                                ?>
                                                                        <div>
                                                                            <input type="checkbox" onclick="checkIngredients('<?= $plat['nom'] . 'ing1' . $i . '[]' ?>',this)" typeIng="viande" name="<?= $plat['nom'] . "ing1" . $i . '[]' ?>" value="<?= $ing['id_article'] ?>" id="<?= $plat['nom'] . $ing['nom'] . 'Id' . $i . '1' ?>" <?php if ($ing['default'] == 1) {
                                                                                                                                                                                                                                                                                                                                                echo ('checked=true');
                                                                                                                                                                                                                                                                                                                                            } ?>><label class="labl-ing" for="<?= $plat['nom'] . $ing['nom'] . 'Id' . $i . '1' ?>"><?= $ing['nom'] ?></label>
                                                                        </div>
                                                                <?php
                                                                    }
                                                                }
                                                                ?>
                                                                <hr>
                                                            </div>
                                                        <?php  }

                                                        if (!empty($ingredients)) { ?>
                                                            <div class="ingDiv" ingredient>

                                                                <strong>Ingrédients :</strong>
                                                                <?php
                                                                foreach ($ingredients as $ing) {

                                                                    if ($ing['default'] != 2 && $ing['qte'] > $ing['quantity']) {
                                                                ?>
                                                                        <div>
                                                                            <input type="checkbox" onclick="checkIngredients('<?= $plat['nom'] . 'ing1' . $i . '[]' ?>',this)" typeIng="ingredient" name="<?= $plat['nom'] . "ing1" . $i . '[]' ?>" value="<?= $ing['id_article'] ?>" id="<?= $plat['nom'] . $ing['nom'] . 'Id' . $i . '1' ?>" <?php if ($ing['default'] == 1) {
                                                                                                                                                                                                                                                                                                                                                    echo ('checked=true');
                                                                                                                                                                                                                                                                                                                                                } ?>><label class="labl-ing" for="<?= $plat['nom'] . $ing['nom'] . 'Id' . $i . '1' ?>"><?= $ing['nom'] ?></label>
                                                                        </div>
                                                                <?php
                                                                    }
                                                                }
                                                                ?>
                                                            </div>
                                                        <?php } ?>
                                                        <hr>
                                                        <?php if (!empty($extras)) { ?>
                                                            <div class="ingDiv" extra>
                                                                <strong>Extras :</strong>
                                                                <?php
                                                                foreach ($extras as $ing) {
                                                                    if ($ing['default'] != 2 && $ing['qte'] > $ing['quantity']) {
                                                                ?>
                                                                        <div>
                                                                            <input type="checkbox" onclick="checkIngredients('<?= $plat['nom'] . 'ing1' . $i . '[]' ?>',this)" typeIng="extra" name="<?= $plat['nom'] . "ing1" . $i . '[]' ?>" value="<?= $ing['id_article'] ?>" id="<?= $plat['nom'] . $ing['nom'] . 'Id' . $i . '1' ?>" <?php if ($ing['default'] == 1) {
                                                                                                                                                                                                                                                                                                                                                echo ('checked=true');
                                                                                                                                                                                                                                                                                                                                            } ?>><label class="labl-ing" for="<?= $plat['nom'] . $ing['nom'] . 'Id' . $i . '1' ?>"><?= $ing['nom'] ?></label>
                                                                        </div>
                                                                <?php
                                                                    }
                                                                }
                                                                ?>
                                                            </div>
                                                        <?php } ?>
                                                    </div>
                                                <?php

                                                } ?>
                                            </div>
                                            <!--End ingredient list -->
                                        </div>
                                    </div>
                                </label>
                        <?php
                            }
                        }
                        ?>
                    </div>




                    <!-----------------------------DEUXIEME PLAT--------------------------->


                    <?php if ($menu == 3) { ?>
                        <p class="text-center mt">Choisissez un deuxième plat</p>
                        <div>

                            <div class="plats-container">


                                <?php

                                foreach ($platsList as $plat) {
                                    $display = true;
                                    $ingredientsList = explode(';', $plat['ingredientsPossibles']);
                                    foreach ($ingredientsList as $ingredientGroupe) {
                                        $ingredientGroupe = explode(",", $ingredientGroupe);
                                        if (intval($ingredientGroupe[2]) == 2) {
                                            if (intval(getIngredientById($conn, $ingredientGroupe[0])['qte']) < intval($ingredientGroupe[1])) {
                                                $display = false;
                                            }
                                        }
                                    }
                                    if ($display) {
                                ?>
                                        <label class="plat-item labl" onclick=" openOptions(2,this.children[1].children[1])">
                                            <input type="radio" class="menuCheckbox" name="plat2[]" value="<?= $plat['id_carte'] ?>" onclick="event.stopPropagation()">
                                            <div class="conatinerPlat">
                                                <h2 class="plat-title"><?= $plat['nom'] ?>
                                                    <?php
                                                    if ($plat['nom'] == "Croque-Monsieur" || $plat['nom'] == "Hot-Dog") {
                                                        echo ("x2");
                                                    }
                                                    ?>
                                                </h2>

                                                <div class="option-div-plat-2 option-div">

                                                    <?php
                                                    if ($plat['nom'] == "Croque-Monsieur" || $plat['nom'] == "Hot-Dog") {
                                                    ?>
                                                        <input type="radio" name="<?= $plat['nom'] . 'identiques2' ?>" value="False" checked onclick="changeDoubleIngredient('<?= $plat['nom'] ?>',2)" id="Identiques<?= $plat['nom'] ?>2"><label for="Identiques<?= $plat['nom'] ?>2">Identiques</label>
                                                        <input type="radio" name="<?= $plat['nom'] . 'identiques2' ?>" value="True" onclick="changeDoubleIngredient('<?= $plat['nom'] ?>',2)" id="Differents<?= $plat['nom'] ?>2"><label for="Differents<?= $plat['nom'] ?>2">Différents</label>

                                                    <?php
                                                    }


                                                    ?>



                                                    <?php
                                                    $iterator = 1;

                                                    if ($plat['nom'] == "Croque-Monsieur" || $plat['nom'] == "Hot-Dog") {
                                                        $iterator =  2;
                                                    }



                                                    $viandes = [];
                                                    $ingredients = [];
                                                    $extras = [];

                                                    foreach ($ingredientsList as $ingredientData) {
                                                        $parts = explode(",", $ingredientData);
                                                        $ingredientId = $parts[0];
                                                        $ingredientQuantity = $parts[1];
                                                        $ingredientDefault = $parts[2];

                                                        $ingredient = getIngredientById($conn, $ingredientId);

                                                        if ($ingredient) {
                                                            $ingredient['default'] = $ingredientDefault;
                                                            $ingredient['quantity'] = $ingredientQuantity;

                                                            if (isset($ingredient['TypeIngredient'])) {


                                                                switch ($ingredient['TypeIngredient']) {
                                                                    case 0:
                                                                        $ingredients[] = $ingredient;
                                                                        break;
                                                                    case 1:
                                                                        $viandes[] = $ingredient;
                                                                        break;
                                                                    case 2:
                                                                        $extras[] = $ingredient;
                                                                        break;
                                                                    default:
                                                                        $extras[] = $ingredient;
                                                                        break;
                                                                }
                                                            }
                                                        }
                                                    }


                                                    ?>
                                                    <div class="ingredients-list">
                                                        <?php
                                                        for ($i = 1; $i <= $iterator; $i++) {
                                                            $chossableViandes = [];
                                                            foreach ($viandes as $ing) {
                                                                if ($ing['default'] != 2) {
                                                                    $chossableViandes[] = $ing;
                                                                }
                                                            } ?>
                                                            <div class="<?= $plat['nom'] ?>IngredientList<?= $i ?>2 <?php if ($i == 2) {
                                                                                                                        echo (' SecondIngredientList');
                                                                                                                    } else {
                                                                                                                        echo (' FirstIngredientList');
                                                                                                                    } ?>">
                                                                <?php if (!empty($chossableViandes)) { ?>

                                                                    <div viande>
                                                                        <strong>Viandes (1 max) :</strong>
                                                                        <?php

                                                                        foreach ($viandes as $ing) {
                                                                            if ($ing['default'] != 2 && $ing['qte'] > $ing['quantity']) {
                                                                        ?>
                                                                                <div>
                                                                                    <input type="checkbox" onclick="checkIngredients('<?= $plat['nom'] . 'ing2' . $i ?>',this)" typeIng="viande" name="<?= $plat['nom'] . "ing2" . $i . '[]' ?>" value="<?= $ing['id_article'] ?>" id="<?= $plat['nom'] . $ing['nom'] . 'Id' . $i . '2' ?>" <?php if ($ing['default'] == 1) {
                                                                                                                                                                                                                                                                                                                                                echo ('checked=true');
                                                                                                                                                                                                                                                                                                                                            } ?>><label class="labl-ing" for="<?= $plat['nom'] . $ing['nom'] . 'Id' . $i . '2' ?>"><?= $ing['nom'] ?></label>
                                                                                </div>
                                                                        <?php
                                                                            }
                                                                        }
                                                                        ?>
                                                                        <hr>
                                                                    </div>
                                                                <?php  } ?>
                                                                <div ingredient>
                                                                    <strong>Ingrédients :</strong>
                                                                    <?php
                                                                    foreach ($ingredients as $ing) {
                                                                        if ($ing['default'] != 2 && $ing['qte'] > $ing['quantity']) {
                                                                    ?>
                                                                            <div>
                                                                                <input type="checkbox" onclick="checkIngredients('<?= $plat['nom'] . 'ing2' . $i ?>',this)" typeIng="ingredient" name="<?= $plat['nom'] . "ing2" . $i . '[]' ?>" value="<?= $ing['id_article'] ?>" id="<?= $plat['nom'] . $ing['nom'] . 'Id' . $i . '2' ?>" <?php if ($ing['default'] == 1) {
                                                                                                                                                                                                                                                                                                                                                echo ('checked=true');
                                                                                                                                                                                                                                                                                                                                            } ?>><label class="labl-ing" for="<?= $plat['nom'] . $ing['nom'] . 'Id' . $i . '2' ?>"><?= $ing['nom'] ?></label>
                                                                            </div>
                                                                    <?php
                                                                        }
                                                                    }
                                                                    ?>
                                                                </div>
                                                                <hr>
                                                                <?php if (!empty($extras)) { ?>
                                                                    <div extra>
                                                                        <strong>Extras :</strong>
                                                                        <?php
                                                                        foreach ($extras as $ing) {
                                                                            if ($ing['default'] != 2 && $ing['qte'] > $ing['quantity']) {
                                                                        ?>
                                                                                <div>
                                                                                    <input type="checkbox" onclick="checkIngredients('<?= $plat['nom'] . 'ing2' . $i ?>',this)" name="<?= $plat['nom'] . "ing2" . $i . '[]' ?>" typeIng="extra" value="<?= $ing['id_article'] ?>" id="<?= $plat['nom'] . $ing['nom'] . 'Id' . $i . '2' ?>" <?php if ($ing['default'] == 1) {
                                                                                                                                                                                                                                                                                                                                                echo ('checked=true');
                                                                                                                                                                                                                                                                                                                                            } ?>><label class="labl-ing" for="<?= $plat['nom'] . $ing['nom'] . 'Id' . $i . '2' ?>"><?= $ing['nom'] ?></label>
                                                                                </div>
                                                                        <?php
                                                                            }
                                                                        }
                                                                        ?>
                                                                    </div>
                                                                <?php } ?>
                                                            </div>
                                                        <?php

                                                        } ?>
                                                    </div>
                                                    <!--End ingredient list -->
                                                </div>
                                            </div>
                                        </label>
                                <?php
                                    }
                                }
                                ?>
                            </div>


                        <?php } ?>

                        <!----------------------------BONUS CROQUE HOT------------------------>
                        <?php if ($menu == 2) { ?>
                            <div class="headCategory">
                                <h1 class="text-center subTitle">Avec votre menu</h1>
                                <p class="text-center">Choisissez 1 plat</p>
                            </div>
                            <div class="plats-container">


                                <?php

                                foreach ($platsList as $plat) {
                                    if ($plat['nom'] == "Croque-Monsieur" || $plat['nom'] == "Hot-Dog") {
                                        $display = true;
                                        $ingredientsList = explode(';', $plat['ingredientsPossibles']);
                                        foreach ($ingredientsList as $ingredientGroupe) {
                                            $ingredientGroupe = explode(",", $ingredientGroupe);
                                            if (intval($ingredientGroupe[2]) == 2) {
                                                if (intval(getIngredientById($conn, $ingredientGroupe[0])['qte']) < intval($ingredientGroupe[1])) {
                                                    $display = false;
                                                }
                                            }
                                        }
                                        if ($display) {

                                ?>
                                            <label class="plat-item labl" onclick=" openOptions(3,this.children[1].children[1])">
                                                <input type="radio" class="menuCheckbox" name="plat3[]" value="<?= $plat['id_carte'] ?>" onclick="event.stopPropagation()">
                                                <div class="conatinerPlat">
                                                    <h2 class="plat-title"><?= $plat['nom'] ?></h2>

                                                    <div class="option-div-plat-3  option-div">





                                                        <?php



                                                        $viandes = [];
                                                        $ingredients = [];
                                                        $extras = [];

                                                        foreach ($ingredientsList as $ingredientData) {
                                                            $parts = explode(",", $ingredientData);
                                                            $ingredientId = $parts[0];
                                                            $ingredientQuantity = $parts[1];
                                                            $ingredientDefault = $parts[2];

                                                            $ingredient = getIngredientById($conn, $ingredientId);

                                                            if ($ingredient) {
                                                                $ingredient['default'] = $ingredientDefault;
                                                                $ingredient['quantity'] = $ingredientQuantity;

                                                                if (isset($ingredient['TypeIngredient'])) {


                                                                    switch ($ingredient['TypeIngredient']) {
                                                                        case 0:
                                                                            $ingredients[] = $ingredient;
                                                                            break;
                                                                        case 1:
                                                                            $viandes[] = $ingredient;
                                                                            break;
                                                                        case 2:
                                                                            $extras[] = $ingredient;
                                                                            break;
                                                                        default:
                                                                            $extras[] = $ingredient;
                                                                            break;
                                                                    }
                                                                }
                                                            }
                                                        }


                                                        ?>
                                                        <div class="ingredients-list">
                                                            <?php

                                                            $chossableViandes = [];
                                                            foreach ($viandes as $ing) {
                                                                if ($ing['default'] != 2) {
                                                                    $chossableViandes[] = $ing;
                                                                }
                                                            } ?>
                                                            <div class="<?= $plat['nom'] ?>IngredientList<?= $i ?>  FirstIngredientList">
                                                                <?php if (!empty($chossableViandes)) { ?>

                                                                    <div viande>
                                                                        <strong>Viandes (1 max) :</strong>
                                                                        <?php

                                                                        foreach ($viandes as $ing) {
                                                                            if ($ing['default'] != 2 && $ing['qte'] > $ing['quantity']) {
                                                                        ?>
                                                                                <div>
                                                                                    <input type="checkbox" onclick="checkIngredients('<?= $plat['nom'] . 'ing' . 'bonus' . '[]' ?>',this)" typeIng="viande" name="<?= $plat['nom'] . "ing" . "bonus" . '[]' ?>" value="<?= $ing['id_article'] ?>" id="<?= $plat['nom'] . $ing['nom'] . 'Id' . $i . '3' ?>" <?php if ($ing['default'] == 1) {
                                                                                                                                                                                                                                                                                                                                                                echo ('checked=true');
                                                                                                                                                                                                                                                                                                                                                            } ?>><label class="labl-ing" for="<?= $plat['nom'] . $ing['nom'] . 'Id' . $i . '3' ?>"><?= $ing['nom'] ?></label>
                                                                                </div>
                                                                        <?php
                                                                            }
                                                                        }
                                                                        ?>
                                                                        <hr>
                                                                    </div>
                                                                <?php  } ?>
                                                                <div ingredient>
                                                                    <strong>Ingrédients :</strong>
                                                                    <?php
                                                                    foreach ($ingredients as $ing) {
                                                                        if ($ing['default'] != 2 && $ing['qte'] > $ing['quantity']) {
                                                                    ?>
                                                                            <div>
                                                                                <input type="checkbox" onclick="checkIngredients('<?= $plat['nom'] . 'ing' . 'bonus' . '[]' ?>',this)" typeIng="ingredient" name="<?= $plat['nom'] . "ing" . "bonus" . '[]' ?>" value="<?= $ing['id_article'] ?>" id="<?= $plat['nom'] . $ing['nom'] . 'Id' . $i . '3' ?>" <?php if ($ing['default'] == 1) {
                                                                                                                                                                                                                                                                                                                                                                echo ('checked=true');
                                                                                                                                                                                                                                                                                                                                                            } ?>><label class="labl-ing" for="<?= $plat['nom'] . $ing['nom'] . 'Id' . $i . '3' ?>"><?= $ing['nom'] ?></label>
                                                                            </div>
                                                                    <?php
                                                                        }
                                                                    }
                                                                    ?>
                                                                </div>
                                                                <hr>
                                                                <?php if (!empty($extras)) { ?>
                                                                    <div extra>
                                                                        <strong>Extras :</strong>
                                                                        <?php
                                                                        foreach ($extras as $ing) {
                                                                            if ($ing['default'] != 2 && $ing['qte'] > $ing['quantity']) {
                                                                        ?>
                                                                                <div>
                                                                                    <input type="checkbox" onclick="checkIngredients('<?= $plat['nom'] . 'ing' . 'bonus' . '[]' ?>',this)" typeIng="extra" name="<?= $plat['nom'] . "ing" . "bonus" . '[]' ?>" value="<?= $ing['id_article'] ?>" id="<?= $plat['nom'] . $ing['nom'] . 'Id' . $i . '3' ?>" <?php if ($ing['default'] == 1) {
                                                                                                                                                                                                                                                                                                                                                                echo ('checked=true');
                                                                                                                                                                                                                                                                                                                                                            } ?>><label class="labl-ing" for="<?= $plat['nom'] . $ing['nom'] . 'Id' . $i . '3' ?>"><?= $ing['nom'] ?></label>
                                                                                </div>
                                                                        <?php
                                                                            }
                                                                        }
                                                                        ?>
                                                                    </div>
                                                            </div>
                                                        <?php
                                                                }
                                                        ?>
                                                        </div>
                                                        <!--End ingredient list -->
                                                    </div>
                                                </div>
                                            </label>
                                <?php
                                        }
                                    }
                                }
                                ?>
                            </div>


                        <?php
                        } ?>



                        <!---------------------------SNACKS---------------------------->



                        <?php if ($menu != 3) { ?>


                            <div class="headCategory">
                                <h1 class="text-center subTitle">Périphériques</h1>


                                <p class="text-center">Choisissez un periphérique</p>

                            </div>
                            <div id="snacksContainer">
                                <div>
                                    <h2 class="text-center">Snacks</h2>
                                    <div class="plats-container platSancks-conatiner">

                                        <?php $snacks = getAllSnacks($conn);
                                        foreach ($snacks as $snack) {

                                            $parts = explode(",", $snack['ingredientsPossibles']);
                                            $ingredientId = $parts[0];
                                            $ingredientQuantity = $parts[1];
                                            $ingredientDefault = $parts[2];

                                            $article = getIngredientSnackById($conn, $ingredientId);

                                            if ($article['qte'] > $ingredientQuantity) {
                                        ?>
                                                <label class="plat-item labl" onclick="checkSnacks(this,'<?= $snack['id_carte'] . '2T' ?>')">
                                                    <input type="checkbox" class="menuCheckbox" name="snacks[]" value="<?= $snack['id_carte'] ?>" onclick="event.stopPropagation();">
                                                    <div>
                                                        <h2 class="plat-title"><?= $snack['nom'] ?></h2>
                                                    </div>
                                                </label>


                                                <?php
                                                if ($menu == 1) {
                                                ?>
                                                    <label class="plat-item labl snack-2" id="<?= $snack['id_carte'] . '2T' ?>" onclick="checkSnacks(this,'<?= $snack['id_carte'] . '2T' ?>');// cacherSnack(this)">
                                                        <input type="checkbox" class="menuCheckbox" name="snacks[]" value="<?= $snack['id_carte'] ?>" onclick="event.stopPropagation();">
                                                        <div>
                                                            <h2 class="plat-title"><?= $snack['nom'] ?></h2>
                                                        </div>
                                                    </label>
                                        <?php
                                                }
                                            }
                                        }
                                        ?>
                                    </div>
                                </div>

                                <div>
                                    <h2 class="text-center">Boissons</h2>

                                    <div class="plats-container platSancks-conatiner">

                                        <?php $snacks = getAllBoissons($conn);
                                        foreach ($snacks as $snack) {

                                            $parts = explode(",", $snack['ingredientsPossibles']);
                                            $ingredientId = $parts[0];
                                            $ingredientQuantity = $parts[1];
                                            $ingredientDefault = $parts[2];

                                            $article = getIngredientSnackById($conn, $ingredientId);

                                            if ($article['qte'] > $ingredientQuantity) {
                                        ?>
                                                <label class="plat-item labl" onclick="checkSnacks(this,'<?= $snack['id_carte'] . '2T' ?>')">
                                                    <input type="checkbox" class="menuCheckbox" name="snacks[]" value="<?= $snack['id_carte'] ?>" onclick="event.stopPropagation(); ">
                                                    <div>
                                                        <h2 class="plat-title"><?= $snack['nom'] ?><?php if (strpos($snack['nom'], 'Redbull') !== FALSE) {
                                                                                                        echo (" (+0,5€)");
                                                                                                    } ?></h2>
                                                    </div>
                                                </label>


                                                <?php
                                                if ($menu == 1) {
                                                ?>
                                                    <label class="plat-item labl snack-2" id="<?= $snack['id_carte'] . '2T' ?>" onclick="checkSnacks(this,'<?= $snack['id_carte'] . '2T' ?>'); ">
                                                        <input type="checkbox" class="menuCheckbox" name="snacks[]" value="<?= $snack['id_carte'] ?>" onclick="event.stopPropagation();">
                                                        <div>
                                                            <h2 class="plat-title"><?= $snack['nom'] ?><?php if (strpos($snack['nom'], 'Redbull') !== FALSE) {
                                                                                                            echo (" (+0,5€)");
                                                                                                        } ?></h2>
                                                        </div>
                                                    </label>
                                        <?php
                                                }
                                            }
                                        }
                                        ?>
                                    </div>
                                </div>
                            </div>

                        <?php } ?>


                        <div class='comment-div'>
                            <label for="comment-input">
                                Quelque chose à ajouter ?
                            </label>
                            <br>
                            <textarea id="comment-input" name="commentaire"></textarea>
                        </div>



                        <div>
                            <input type="submit" class="btn btnValider" value="Valider">
                        </div>
                </form>
            </div>

            <?php require_once '../../includes/footer.php'; ?>
            <script src="commander.js"></script>
</body>

</html>