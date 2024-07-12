<header>
    <div class="logo-container">
        <img src="/assets/img/Logo_sans_texte.png" alt="logo" onclick="window.location.href='/index.php'" />
        <a href="/index.php">Chti'MI</a>
    </div>
    <div class="links-container">
        <?php
        if (isset($_SESSION["utilisateur"]) && isAdmin($conn, $_SESSION["utilisateur"]["uid"])) {
            echo '<a href="/pages/admin/admin.php">Admin</a>';
        } elseif (isset($_SESSION["utilisateur"]) && isServeur($conn, $_SESSION["utilisateur"]["uid"])) {
            echo '<a href="/pages/serveurs/serveurs.php">Serveur</a>';
        }
        ?>
        <a href="/pages/general/carte.php">Carte</a>
        <a href="/pages/user/commander.php">Commander</a>
        <?php
        if (isset($_SESSION["utilisateur"])) {
            echo '<a href="/pages/user/profil.php">Compte</a>';
        } else {
            echo '<a href="/pages/general/connexion.php">Connexion</a>';
        }
        ?>
    </div>
</header>