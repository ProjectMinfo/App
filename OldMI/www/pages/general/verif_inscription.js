$(document).ready(function () {
    $("#email").on("input", function () {
        let email = $("#email").val();
        $.ajax({
            url: "requires/verif_inscription.php?email=" + email,
            success: function (response) {
                $("#error").html(response);
            }
        });
    });
});