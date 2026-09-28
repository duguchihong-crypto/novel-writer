const backButton = document.getElementById("backButton");

if (backButton) {

    backButton.addEventListener("click", () => {

        if (document.referrer) {

            history.back();

        } else {

            window.location.href = "./index.html";

        }

    });

}
