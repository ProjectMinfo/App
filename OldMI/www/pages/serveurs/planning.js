$(document).ready(function () {
    $("#recherche_semaine_act").click(function () {
        let date = $("#semaine_actuelle").val();
        $.ajax({
            url: "get_planning.php?weeknumber=" + date,
            success: function (response) {
                $("#content").html(response);
            }
        });
        $.ajax({
            url: "get_planning_courses.php?weeknumber=" + date,
            success: function (response2) {
                $("#content2").html(response2);
            }
        });
    });

    $("#Recherche").click(function () {
        let date = $("#recherche_semaine").val();
        $.ajax({
            url: "get_planning.php?weeknumber=" + date,
            success: function (response) {
                $("#content").html(response);
            }
        });
        $.ajax({
            url: "get_planning_courses.php?weeknumber=" + date,
            success: function (response2) {
                $("#content2").html(response2);
            }
        });
    });
});