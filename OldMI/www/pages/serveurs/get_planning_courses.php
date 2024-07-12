<?php

require_once "../../includes/functions.php";
require_once "fct_planning.php";

if (isset($_GET["weeknumber"])) {
    $retour = afficherCourses($_GET["weeknumber"], $conn);
}