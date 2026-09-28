document.addEventListener("DOMContentLoaded", function () {

    const canvas = document.getElementById("canvas");

    if (!canvas) {
        return;
    }

    function centerView() {

        const centerX = 1500;
        const centerY = 1500;

        canvas.scrollLeft =
            centerX - canvas.clientWidth / 2;

        canvas.scrollTop =
            centerY - canvas.clientHeight / 2;

    }

    centerView();

    setTimeout(centerView, 50);
    setTimeout(centerView, 200);

});
