document.addEventListener("DOMContentLoaded", function () {

    const bookTitle = document.getElementById("bookTitle");
    const actionBar = document.getElementById("actionBar");
    const workspace = document.getElementById("workspace");

    if (!bookTitle || !actionBar || !workspace) {
        return;
    }


    function showActions() {

        actionBar.classList.add("show");

        actionBar.style.left = "1500px";
        actionBar.style.top = "1575px";

    }


    function hideActions() {

        actionBar.classList.remove("show");

    }


    bookTitle.addEventListener("click", function (event) {

        event.stopPropagation();

        if (actionBar.classList.contains("show")) {

            hideActions();

        } else {

            showActions();

        }

    });


    workspace.addEventListener("click", function (event) {

        if (
            event.target !== bookTitle &&
            !actionBar.contains(event.target)
        ) {

            hideActions();

        }

    });

});
