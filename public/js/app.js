$(document).ready(function() {

    var pbj = 0;
    var gc = 0;
    var rb = 0;
    var pbjClick = function() {
        alert("snarky pbj stuff");
        pbj++;
        alert("You've eaten " + pbj + " peanut butter sandwich");
    }
    $("#pbj").on("click", pbjClick);

    var grilledCheese = function() {
        alert("snarky gc stuff");
        gc++;
        alert("You've eaten " + gc + " grilled cheese sandwich");
    }
    $("#gc").on("click", grilledCheese);

    $("#rb").on("click", function() {
        alert("snarky rb stuff");
        rb++;
        alert("You've eaten " + rb + " roast beef sandwich");
    });
})
