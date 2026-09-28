document.addEventListener("DOMContentLoaded", function () {

    const backButton = document.getElementById("backButton");

    if (!backButton) {
        return;
    }

    backButton.onclick = function () {
        window.location.replace("./index.html");
    };

});
