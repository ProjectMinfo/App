$(document).ready(function() {
    $("#getpaiementbutton").click(function() {
        let date_start = $("#start").val();
        let date_end = $("#end").val();
        $.ajax({
            url: "tresorerie/get_paiements.php?start=" + date_start + "&end=" + date_end,
            success: function(response) {
                $("#content").html(response);
            }
        });
    });

    $("#getextrabutton").click(function() {
        let date_start = $("#start2").val();
        let date_end = $("#end2").val();
        $.ajax({
            url: "tresorerie/get_extra.php?start=" + date_start + "&end=" + date_end,
            success: function(response) {
                $("#content2").html(response);
            }
        });
    });
});