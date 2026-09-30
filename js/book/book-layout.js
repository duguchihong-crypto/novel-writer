/* ======================================================
   全书布局
====================================================== */


/* ======================================================
   自动居中
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const canvas =
            document.getElementById("canvas");

        const workspace =
            document.getElementById("workspace");


        if (
            !canvas ||
            !workspace
        ) {

            return;

        }


        function centerView() {

            const x =
                (
                    workspace.scrollWidth -
                    canvas.clientWidth
                ) / 2;


            const y =
                (
                    workspace.scrollHeight -
                    canvas.clientHeight
                ) / 2;


            canvas.scrollLeft =
                x;


            canvas.scrollTop =
                y;

        }


        requestAnimationFrame(
            function () {

                centerView();


                setTimeout(
                    centerView,
                    100
                );


                setTimeout(
                    centerView,
                    300
                );

            }
        );

    }
);
