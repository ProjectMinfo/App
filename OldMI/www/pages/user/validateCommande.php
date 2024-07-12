<?php
session_start();
require_once('../../includes/functions.php');
areSetCookies();

$_SESSION['erreurs'] = [];

if (!isset($_POST['menu']) || empty($_POST['menu'])) {
    header('Location: commander.php');
    die();
}

$menu = intval($_POST['menu']);

if ($menu < 1 || $menu > 3) {
    header('Location: commander.php');
    die();
}

// Plat 1

if (!isset($_POST['plat1']) || empty($_POST['plat1'])) {
    $_SESSION['erreurs'][] = "T'as oublié de prendre un plat!";
    header("Location: choosePlat.php?menu=" . $menu);
    die();
}

$plat1 = intval($_POST['plat1'][0]);
$plat1Name = getPlatById($conn, $plat1)['nom'];

$doublesIngredients1 = false;

if (isset($_POST[$plat1Name . 'identiques1']) && $_POST[$plat1Name . 'identiques1'] == "True") {
    $doublesIngredients1 = true;
}

$ingredientsList1 = [];
$ingredientsList1Diff = [];

$sansIngreidents1 = false;
if (!isset($_POST[$plat1Name . 'ing11'])) {
    $sansIngreidents1 = true;
}

if ($sansIngreidents1 == false) {
    foreach ($_POST[$plat1Name . 'ing11'] as $ing) {
        $ing = sanitize($ing);
        $ingData = getIngredientById($conn, $ing);
        if ($ingData['qte'] <= 0) {
            $_SESSION['erreurs'][] = "Oups, nous n'avons plus de " . $ing . "Mais ne vous inquietez pas, nous avons plein d'autres ingrédients à vous proposer!";
            header("Location: choosePlat.php?menu=" . $menu);
            die();
        }
        $nbViandes = 0;
        $nbIngredients = 0;
        if ($ingData['TypeIngredient'] == 0) {
            $nbIngredients++;
        }
        if ($ingData['TypeIngredient'] == 1) {
            $nbViandes++;
            $nbIngredients++;
        }
        if ($nbViandes > 1 || $nbIngredients > 2) {
            $_SESSION['erreurs'][] = "Dit donc p'tit filou, tu n'a le droit qu'a une viande et un ingrédient ou deux ingrédients!";
            header("Location: choosePlat.php?menu=" . $menu);
            die();
        }
        $ingredientsList1[] = $ingData;
    }
}

if ($doublesIngredients1 == true) {
    foreach ($_POST[$plat1Name . 'ing12'] as $ing) {
        $ing = sanitize($ing);
        $ingData = getIngredientById($conn, $ing);
        if ($ingData['qte'] <= 0) {
            $_SESSION['erreurs'][] = "Oups, nous n'avons plus de " . $ing . "Mais ne vous inquietez pas, nous avons plein d'autres ingrédients a vous proposer!";
            header("Location: choosePlat.php?menu=" . $menu);
            die();
        }
        $nbViandes = 0;
        $nbIngredients = 0;
        if ($ingData['TypeIngredient'] == 0) {
            $nbIngredients++;
        }
        if ($ingData['TypeIngredient'] == 1) {
            $nbViandes++;
            $nbIngredients++;
        }
        if ($nbViandes > 1 || $nbIngredients > 2) {
            $_SESSION['erreurs'][] = "Dit donc p'tit filou, tu n'a le droit qu'a une viande et un ingrédient ou deux ingrédients!";
            header("Location: choosePlat.php?menu=" . $menu);
            die();
        }
        $ingredientsList1Diff[] = $ingData;
    }
}


if ($menu == 3) {


    //Plat 2


    if (!isset($_POST['plat2']) || empty($_POST['plat2'])) {
        $_SESSION['erreurs'][] = "T'as oublié de prendre ton deuxième plat!";
        header("Location: choosePlat.php?menu=" . $menu);
        die();
    }

    $plat2 = intval($_POST['plat2'][0]);
    $plat2Name = getPlatById($conn, $plat2)['nom'];

    $doublesIngredients2 = false;

    if (isset($_POST[$plat2Name . 'identiques2']) && $_POST[$plat2Name . 'identiques2'] == "True") {
        $doublesIngredients2 = true;
    }

    $ingredientsList2 = [];
    $ingredientsList2Diff = [];

    $sansIngreidents2 = false;
    if (!isset($_POST[$plat2Name . 'ing21'])) {
        $sansIngreidents2 = true;
    }
    if (!$sansIngreidents2) {
        foreach ($_POST[$plat2Name . 'ing21'] as $ing) {
            $ing = sanitize($ing);
            $ingData = getIngredientById($conn, $ing);
            if ($ingData['qte'] <= 0) {
                $_SESSION['erreurs'][] = "Oups, nous n'avons plus de " . $ing . "Mais ne vous inquietez pas, nous avons plein d'autres ingrédients a vous proposer!";
                header("Location = choosePlat.php?menu=" . $menu);
                die();
            }
            $nbViandes = 0;
            $nbIngredients = 0;
            if ($ingData['TypeIngredient'] == 0) {
                $nbIngredients++;
            }
            if ($ingData['TypeIngredient'] == 1) {
                $nbViandes++;
                $nbIngredients++;
            }
            if ($nbViandes > 1 || $nbIngredients > 2) {
                $_SESSION['erreurs'][] = "Dit donc p'tit filou, tu n'a le droit qu'a une viande et un ingrédient ou deux ingrédients !";
                header("Location = choosePlat.php?menu=" . $menu);
                die();
            }
            $ingredientsList2[] = $ingData;
        }
    }

    if ($doublesIngredients2 == true) {
        foreach ($_POST[$plat2Name . 'ing22'] as $ing) {
            $ing = sanitize($ing);
            $ingData = getIngredientById($conn, $ing);
            if ($ingData['qte'] <= 0) {
                $_SESSION['erreurs'][] = "Oups, nous n'avons plus de " . $ing . "Mais ne vous inquietez pas, nous avons plein d'autres ingrédients a vous proposer!";
                header("Location = choosePlat.php?menu=" . $menu);
                die();
            }
            $nbViandes = 0;
            $nbIngredients = 0;
            if ($ingData['TypeIngredient'] == 0) {
                $nbIngredients++;
            }
            if ($ingData['TypeIngredient'] == 1) {
                $nbViandes++;
                $nbIngredients++;
            }
            if ($nbViandes > 1 || $nbIngredients > 2) {
                $_SESSION['erreurs'][] = "Dit donc p'tit filou, tu n'a le droit qu'a une viande et un ingrédient ou deux ingrédients!";
                header("Location = choosePlat.php?menu=" . $menu);
                die();
            }
            $ingredientsList2Diff[] = $ingData;
        }
    }
}

if ($menu == 2) {
    //Plat 3
    if (!isset($_POST['plat3']) || empty($_POST['plat3'])) {
        $_SESSION['erreurs'][] = "T'as oublié de prendre ton plat bonus!";
        header("Location: choosePlat.php?menu=" . $menu);
        die();
    }

    $plat3 = intval($_POST['plat3'][0]);
    $plat3Name = getPlatById($conn, $plat3)['nom'];


    $ingredientsList3 = [];
    $sansIngreidents3 = false;
    if (!isset($_POST[$plat3Name . 'ingbonus'])) {
        $sansIngreidents3 = true;
    }
    if (!$sansIngreidents3) {
        foreach ($_POST[$plat3Name . 'ingbonus'] as $ing) {
            $ing = sanitize($ing);
            $ingData = getIngredientById($conn, $ing);
            if ($ingData['qte'] <= 0) {
                $_SESSION['erreurs'][] = "Oups, nous n'avons plus de " . $ing . "Mais ne vous inquietez pas, nous avons plein d'autres ingrédients a vous proposer!";
                header("Location = choosePlat.php?menu=" . $menu);
                die();
            }
            $nbViandes = 0;
            $nbIngredients = 0;
            if ($ingData['TypeIngredient'] == 0) {
                $nbIngredients++;
            }
            if ($ingData['TypeIngredient'] == 1) {
                $nbViandes++;
                $nbIngredients++;
            }
            if ($nbViandes > 1 || $nbIngredients > 2) {
                $_SESSION['erreurs'][] = "Dit donc p'tit filou, tu n'a le droit qu'a une viande et un ingrédient ou deux ingrédients!";
                header("Location = choosePlat.php?menu=" . $menu);
                die();
            }
            $ingredientsList3[] = $ingData;
        }
    }
}


if ($menu != 3) {
    //géstion du premier périphérique
    if (!isset($_POST['snacks']) || empty($_POST['snacks'])) {
        $_SESSION['erreurs'][] = "T'as oublié de prendre un snack";
        header("Location: choosePlat.php?menu=" . $menu);
        die();
    }

    $snack1 = intval($_POST['snacks'][0]);

    $snack1Name = getPlatById($conn, $snack1)['nom'];
    $snack1Name = plusToSpace($snack1Name);
    $snackPlatData = getPlatById($conn, $snack1);
    $snack1Ingredients = listInTabIngredient($snackPlatData['ingredientsPossibles']);
    $ingrdient1 = $snack1Ingredients[0][0];
    $snack1Qte = $snack1Ingredients[0][1];
    $snackData = getIngredientSnackById($conn, $ingrdient1);

    if ($snackData['qte'] <= 0) {
        $_SESSION['erreurs'][] = "Oups, nous n'avons plus de " . $snack1Name . "Mais ne t'inquiete pas, nous avons plein d'autres snacks à te proposer!";
        header("Location = choosePlat.php?menu=" . $menu);
        die();
    }
}



if ($menu == 1) {
    //géstion du premier périphérique
    if (!isset($_POST['snack2']) || empty($_POST['snack2'])) {

        $_SESSION['erreurs'][] = "T'as oublié de prendre ton deuxième snack";

        //header("Location: choosePlat.php?menu=".$menu);
        //die();
    }

    $snack2 = intval($_POST['snacks'][1]);
    $snack2Name = getPlatById($conn, $snack2)['nom'];
    $snack2Name = plusToSpace($snack2Name);
    $snackPlatData = getPlatById($conn, $snack2);
    $snack2Ingredients = listInTabIngredient($snackPlatData['ingredientsPossibles']);
    $ingrdient2 = $snack2Ingredients[0][0];
    $snack2Qte = $snack2Ingredients[0][1];
    $snackData = getIngredientSnackById($conn, $ingrdient2);

    if ($snackData['qte'] <= 0) {
        $_SESSION['erreurs'][] = "Oups, nous n'avons plus de " . $snack2 . "Mais ne t'inquiete pas, nous avons plein d'autres snacks à te proposer!";
        //header("Location = choosePlat.php?menu=".$menu);
        //die();
    }
}
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chti'MI | Choisissez vos plats</title>
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/commandeUser/validate.css">
</head>

<body>
    <?php require_once("../../includes/header.php"); ?>
    <div class="MentionsMainDiv">
        <h2>Résumé de votre commande</h2>
        <?php
        if (isset($plat1)) {
            if ($plat1Name != "Croque-Monsieur" && $plat1Name != "Hot-Dog") {
                echo "<h3>1 " . $plat1Name . "</h3>";
                foreach ($ingredientsList1 as $ing) {
                    echo "<p>" . $ing['nom'] . "</p>";
                }
            } else {
                if ($doublesIngredients1 == false) {
                    echo "<h3>2 " . $plat1Name . "</h3>";
                    foreach ($ingredientsList1 as $ing) {
                        echo "<p>" . $ing['nom'] . "</p>";
                    }
                } else {
                    echo "<h3>1 " . $plat1Name . "</h3>";
                    foreach ($ingredientsList1 as $ing) {
                        echo "<p>" . $ing['nom'] . "</p>";
                    }
                    echo "<h3>1 " . $plat1Name . "</h3>";
                    foreach ($ingredientsList1Diff as $ing) {
                        echo "<p>" . $ing['nom'] . "</p>";
                    }
                }
            }
        }
        if (isset($plat2)) {
            if ($plat2Name != "Croque-Monsieur" && $plat2Name != "Hot-Dog") {
                echo "<h3>1 " . $plat2Name . "</h3>";
                foreach ($ingredientsList2 as $ing) {
                    echo "<p>" . $ing['nom'] . "</p>";
                }
            } else {
                if ($doublesIngredients2 == false) {
                    echo "<h3>2 " . $plat2Name . "</h3>";
                    foreach ($ingredientsList2 as $ing) {
                        echo "<p>" . $ing['nom'] . "</p>";
                    }
                } else {
                    echo "<h3>1 " . $plat2Name . "</h3>";
                    foreach ($ingredientsList2 as $ing) {
                        echo "<p>" . $ing['nom'] . "</p>";
                    }
                    echo "<h3>1 " . $plat2Name . "</h3>";
                    foreach ($ingredientsList2Diff as $ing) {
                        echo "<p>" . $ing['nom'] . "</p>";
                    }
                }
            }
        }
        if (isset($plat3)) {
            echo "<h3>1 " . $plat3Name . "</h3>";
            foreach ($ingredientsList3 as $ing) {
        ?>
                <p>
                    <?= $ing['nom'] ?>
                </p>
        <?php
            }
        }
        if (isset($snack1)) {
            echo "<h3>1 " . $snack1Name . "</h3>";
        }
        if (isset($snack2)) {
            echo "<h3>1 " . $snack2Name . "</h3>";
        }
        if (isset($_POST['commentaire']) && !empty($_POST['commentaire'])) {
            echo "<h3>Commentaire</h3>";
            echo "<p>" . sanitize($_POST['commentaire']) . "</p>";
        }
        ?>
    </div>

    <?php

    if (isServeur($conn, $_SESSION["utilisateur"]["uid"])) {
        $prix = getPrixMenu($conn, $menu, true)[0];
    } else {
        $prix = getPrixMenu($conn, $menu, false)[0];
    }


    // écriture de la commande
    $ingredientsListTotal = [];
    $commandeInOut = "";

    if (isset($plat1)) {

        $plat1data = getPlatById($conn, $plat1);
        $plat1ListIng = listInTabIngredient($plat1data['ingredientsPossibles']);

        // ingrédients par défaut
        foreach ($plat1ListIng as $platIng) {
            if ($platIng[2] == 2) {
                $ingredientsListTotal[] = [$platIng[0], $platIng[1]];
            }
        }

        foreach ($plat1ListIng as $platIng) {
            if ($platIng[0] == $ing['id_article']) {
                $ingredientsListTotal[] = [$platIng[0], $platIng[1]];
            }
        }

        if ($plat1Name != "Croque-Monsieur" && $plat1Name != "Hot-Dog") {
            $commandeInOut .= '1 ' . $plat1Name . ' ';
            $listIng = [];

            foreach ($ingredientsList1 as $ing) {
                foreach ($plat1ListIng as $platIng) {
                    if ($platIng[0] == $ing['id_article']) {
                        $ingredientsListTotal[] = [$platIng[0], $platIng[1]];
                    }
                }
                $listIng[] = $ing['nom'];
            }

            $commandeInOut .= implode(' ', $listIng);
        } else {
            // on double les ingredients obligatoires pour corque et hotdog
            foreach ($plat1ListIng as $platIng) {
                if ($platIng[2] == 2) {
                    $ingredientsListTotal[] = [$platIng[0], $platIng[1]];
                }
            }
            if ($doublesIngredients1 == false) {
                $commandeInOut .= '2 ' . $plat1Name . ' ';
                $listIng = [];
                foreach ($ingredientsList1 as $ing) {
                    foreach ($plat1ListIng as $platIng) {
                        if ($platIng[0] == $ing['id_article']) {
                            $ingredientsListTotal[] = [$platIng[0], $platIng[1]];
                        }
                    }
                    $listIng[] = $ing['nom'];
                }
                $commandeInOut .= implode(' ', $listIng);
            } else {
                $commandeInOut .= '1 ' . $plat1Name . ' ';
                $listIng = [];
                foreach ($ingredientsList1 as $ing) {
                    foreach ($plat1ListIng as $platIng) {
                        if ($platIng[0] == $ing['id_article']) {
                            $ingredientsListTotal[] = [$platIng[0], $platIng[1]];
                        }
                    }
                    $listIng[] = $ing['nom'];
                }
                $commandeInOut .= implode(' ', $listIng);
                $commandeInOut .= ',';
                $commandeInOut .= '1 ' . $plat1Name . ' ';
                $listIng = [];
                foreach ($ingredientsList1Diff as $ing) {
                    foreach ($plat1ListIng as $platIng) {
                        if ($platIng[0] == $ing['id_article']) {
                            $ingredientsListTotal[] = [$platIng[0], $platIng[1]];
                        }
                    }
                    $listIng[] = $ing['nom'];
                }
                $commandeInOut .= implode(' ', $listIng);
            }
        }
        if ($menu !== 1) {
            $commandeInOut .= ',';
        }
    }
    if (isset($plat2)) {
        $plat2data = getPlatById($conn, $plat2);
        $plat2ListIng = listInTabIngredient($plat2data['ingredientsPossibles']);
        if ($plat2Name != "Croque-Monsieur" && $plat2Name != "Hot-Dog") {

            $commandeInOut .= '1 ' . $plat2Name . ' ';
            $listIng = [];
            foreach ($ingredientsList2 as $ing) {
                foreach ($plat2ListIng as $platIng) {
                    if ($platIng[0] == $ing['id_article']) {
                        $ingredientsListTotal[] = [$platIng[0], $platIng[1]];
                    }
                }
                $listIng[] = $ing['nom'];
            }
            $commandeInOut .= implode(' ', $listIng);
        } else {
            if ($doublesIngredients2 == false) {
                $commandeInOut .= '2 ' . $plat2Name . ' ';
                $listIng = [];
                foreach ($ingredientsList2 as $ing) {
                    foreach ($plat2ListIng as $platIng) {
                        if ($platIng[0] == $ing['id_article']) {
                            $ingredientsListTotal[] = [$platIng[0], $platIng[1]];
                        }
                    }
                    $listIng[] = $ing['nom'];
                }
                $commandeInOut .= implode(' ', $listIng);
            } else {
                $commandeInOut .= '1 ' . $plat2Name . ' ';
                $listIng = [];
                foreach ($ingredientsList2 as $ing) {
                    foreach ($plat2ListIng as $platIng) {
                        if ($platIng[0] == $ing['id_article']) {
                            $ingredientsListTotal[] = [$platIng[0], $platIng[1]];
                        }
                    }
                    $listIng[] = $ing['nom'];
                }
                $commandeInOut .= implode(' ', $listIng);
                $commandeInOut .= '1 ' . $plat2Name . ' ';
                $listIng = [];
                foreach ($ingredientsList2Diff as $ing) {
                    foreach ($plat2ListIng as $platIng) {
                        if ($platIng[0] == $ing['id_article']) {
                            $ingredientsListTotal[] = [$platIng[0], $platIng[1]];
                        }
                    }
                    $listIng[] = $ing['nom'];
                }
                $commandeInOut .= implode(' ', $listIng);
            }
        }
    }
    if (isset($plat3)) {
        $plat3data = getPlatById($conn, $plat3);
        $plat3ListIng = listInTabIngredient($plat3data['ingredientsPossibles']);
        $commandeInOut .= '1 ' . $plat3Name . ' ';
        $listIng = [];
        foreach ($ingredientsList3 as $ing) {
            foreach ($plat3ListIng as $platIng) {
                if ($platIng[0] == $ing['id_article']) {
                    $ingredientsListTotal[] = [$platIng[0], $platIng[1]];
                }
            }
            $listIng[] = $ing['nom'];
        }
        $commandeInOut .= implode(' ', $listIng);
    ?>
    <?php
    }
    $commandeInOut .= ';';

    if (isset($snack1)) {
        $commandeInOut .= $snack1Name;
        $ingredientsListTotal[] = [$snack1, $snack1Qte];
        if (strpos($snack1Name, 'Redbull') !== FALSE) {
            $prix += 0.5;
        }
    }
    if (isset($snack2)) {
        $commandeInOut .= ',' . $snack2Name;
        $ingredientsListTotal[] = [$snack2, $snack2Qte];
        if (strpos($snack2Name, 'Redbull') !== FALSE) {
            $prix += 0.5;
        }
    }

    if (isset($_POST['commentaire']) && !empty($_POST['commentaire'])) {
        $commentaire = sanitize($_POST['commentaire']);
        $commandeInOut .= ';' . $commentaire;
    }

    $ingredientsListTotal = TabIngredientInList($ingredientsListTotal);
    ?>

    <form action="commandeSucces.php" method="POST">
        <div class="MentionsMainDiv">
            <div>
                <h2>Prix : <b>
                        <?php echo ($prix); ?>€
                    </b></h2>
                <h3>Choisissez votre moyen de paiement</h3>
                <?php
                $argent = floatval(getMoneyOnAccount($conn, $_SESSION['utilisateur']['id'])['montant']);
                if ($argent >= $prix) {
                ?>
                    <label for="payementCompte" style="display:block" class="labl">
                        <input type="radio" name="moyenPaiment" value="2" id="payementCompte">
                        <div class="divInput">
                            Compte MI
                        </div>
                    </label>
                <?php } ?>
                <label for="payementComptoir" style="display:block" class="labl">
                    <input type="radio" name="moyenPaiment" value="3" id="payementComptoir">
                    <div class="divInput">
                        <p>Au comptoir</p>
                    </div>
                </label>
            </div>
        </div>
        <input type="number" class="hiddenInput" name="menu" value=<?= $menu ?>>
        <input type="text" class="hiddenInput" name="Prix" value="<?= $prix ?>">
        <input type="text" class="hiddenInput" name="commandeWrite" value="<?= $commandeInOut ?>">
        <input type="text" class="hiddenInput" name="ingredientsCommande" value="<?= $ingredientsListTotal ?>">
        <input type="submit" name="envoyer" class="btn btn_validate" value="Valider">
    </form>
    <?php require_once("../../includes/footer.php"); ?>
</body>

</html>