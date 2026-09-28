const backButton = document.getElementById("backButton");

if (backButton) {

    backButton.addEventListener("click", () => {

        history.back();

    });

}
