document.addEventListener("DOMContentLoaded", function () {

    const canvas = document.getElementById("canvas");

    if (!canvas) {
        return;
    }

    requestAnimationFrame(function () {

        canvas.scrollLeft =
            (canvas.scrollWidth - canvas.clientWidth) / 2;

        canvas.scrollTop =
            (canvas.scrollHeight - canvas.clientHeight) / 2;

    });

});
