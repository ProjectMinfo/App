<?php
session_start(); //démarrage de la session
require_once "../../includes/functions.php"; //importation des fonctions
areSetCookies(); //création de la session si cookies existent
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
    <title>Chti'MI | Données personelles</title>
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
</head>

<body>

    <?php require_once '../../includes/header.php'; ?>
    <div class="MentionsMainDiv">
        <div class="PetiteZoneMentions">
            Politique des données personelles
        </div>
        <div>
            <p>Est considérée comme donnée personnelle toute information se rapportant à une personne
                physique identifiée ou identifiable, directement ou indirectement.</br>
                Le responsable de traitement est l’Association Maison ISEN, Association dont le siège social est situé 41 boulevard Vauban Lille (SIREN 783 707 003 00027).
            </p><br>
            <p>
                Dans le cadre de l’utilisation du site Internet www.maisonisen.fr l’association Maison ISEN peut être amenée à récolter vos données personnelles aux fins
                suivantes :
            <ul>
                <li>Dans le cadre de la navigation du site : analyses statistiques ;</li>
                <li>Dans le cadre du remplissage du formulaire de commande ;</li>
                <li>Dans le cadre de la création d'un compte sur le site ;</li>
            </ul>
            </p><br>
            <p>Ni Maison ISEN, ni l’un quelconque de ses sous-traitants, ne procèdent à la commercialisation de vos données personnelles.</p>
        </div>
        <div>
            <h2>Nature des données recoltées</h2><br>
            <p>
                La nature des données personnelles récoltées dépend de la finalité du traitement.
            </p><br>
            <p>
                A l’occasion de l’utilisation du site www.maisonisen.fr, peuvent être recueillies les données personnelles suivantes : nom, prénom, adresse e-mail, numéro de compte MI.
            </p><br>
            <p>
                L'association Maison ISEN s’engage à ne récolter que les données personnelles et suffisantes à cet égard. Seules les données signalées par un astérisque sur les
                formulaires de collecte sont obligatoires.
            </p><br>
            <p>
                Seule l'association Maison ISEN est destinataire de vos données personnelles.
            </p><br>
            <p>
                Celles-ci, que ce soit sous forme individuelle ou agrégée, ne sont jamais transmises à un tiers, nonobstant les sous-traitants auxquels l'association Maison ISEN
                fait appel.
            </p>
        </div>
        <div>
            <h2>Temps de conservation des données collectées</h2><br>
            <p>
                Vos données personnelles sont conservées par l'association Maison ISEN uniquement pour le temps correspondant à la finalité de la
                collecte.
            </p><br>
            <p>
                Conformément à la réglementation en vigueur, vous disposez des droits suivants :
            <ul>
                <li>Droit d’accès : Vous disposez de la faculté d’accéder aux données personnelles vous concernant ;</li>
                <li>Droit de rectification ou d’effacement : vous pouvez demander la rectification, la mise à jour, le verrouillage, ou encore
                    l’effacement des données personnelles vous concernant qui peuvent s’avérer le cas échéant inexactes, erronées, incomplètes ou obsolètes ;</li>
                <li>Droit d’effacement : vous pouvez demander l’effacement des données personnelles vous concernant ;</li>
                <li>Droit de limitation : vous pouvez demander la limitation des données personnelles vous concernant ;</li>
                <li>Droit de retirer votre consentement à un traitement de vos données personnelles;</li>
                <li>Droit à la portabilité : vous pouvez demander à recevoir les données personnelles vous concernant dans un format structuré, couramment utilisé et lisible par machine ;</li>
                <li>Droit d’opposition : dans certaines conditions, vous pouvez dans certains cas vous opposer au traitement des Données personnelles vous concernant ;</li>
                <li>Droit d’introduire une réclamation auprès d’une autorité de contrôle (la CNIL pour la France).</li>
            </ul>
            </p><br>
            <p>
                Vous pouvez également définir des directives générales et particulières relatives au sort des données à caractère personnel après votre décès. Le cas échéant,
                les héritiers d’une personne décédée peuvent exiger de prendre en considération le décès de leur proche et/ou de procéder aux mises à jour nécessaires.
            </p>
        </div>
        <div>
            <h2>Exercer vos droits</h2><br>
            <p>Vous pouvez exercer ces droits de la manière suivante : </p><br>
            <p>
                Ce droit peut être exercé par voie postale auprès de Maison ISEN, 41 boulevard Vauban, 59800 Lille, ou par voie électronique à l’adresse email suivante:
                lamaisonisen@gmail.com</a>
            </p><br>
            <p>
                Votre demande sera traitée sous réserve que vous apportiez la preuve de votre identité, notamment par la production d’un scan de votre titre d’identité valide
                ou d’une photocopie signée de votre titre d’identité valide (en cas de demande adressée par écrit).<br />
                Maison ISEN vous informe qu’il sera en droit, le cas échéant, de s’opposer aux demandes manifestement abusives (nombre, caractère répétitif ou systématique).<br />
                Maison ISEN s’engage à vous répondre dans un délai raisonnable qui ne saurait dépasser 1 mois à compter de la réception de votre demande.
            </p><br>
        </div>

    </div>
    <?php require_once '../../includes/footer.php'; ?>

</body>

</html>