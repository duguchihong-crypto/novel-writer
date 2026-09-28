document.addEventListener("DOMContentLoaded", function () {

    const bookTitle =
        document.getElementById("bookTitle");

    const actionBar =
        document.getElementById("actionBar");

    const workspace =
        document.getElementById("workspace");


    if (
        !bookTitle ||
        !actionBar ||
        !workspace
    ) {
        return;
    }


    /* ==================================================
       让操作栏永远位于书名正下方
    ================================================== */

    function updateActionBarPosition() {

        const titleLeft =
            bookTitle.offsetLeft;

        const titleTop =
            bookTitle.offsetTop;

        const titleHeight =
            bookTitle.offsetHeight;


        actionBar.style.left =
            titleLeft + "px";


        actionBar.style.top =
            (
                titleTop +
                titleHeight / 2 +
                18
            ) + "px";
    }


    /* ==================================================
       初始化位置
    ================================================== */

    updateActionBarPosition();


    /* ==================================================
       点击书名
    ================================================== */

    bookTitle.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            updateActionBarPosition();

            actionBar.classList.toggle("show");

        }
    );


    /* ==================================================
       点击操作栏
    ================================================== */

    actionBar.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

        }
    );


    /* ==================================================
       点击空白区域
    ================================================== */

    document.addEventListener(
        "click",
        function () {

            actionBar.classList.remove("show");

        }
    );


    /* ==================================================
       窗口变化
    ================================================== */

    window.addEventListener(
        "resize",
        function () {

            updateActionBarPosition();

        }
    );


    /* ==================================================
       监听书名移动
       如果 main.js 拖动书名，
       操作栏也跟着移动
    ================================================== */

    let lastLeft =
        bookTitle.offsetLeft;

    let lastTop =
        bookTitle.offsetTop;

    let lastWidth =
        bookTitle.offsetWidth;

    let lastHeight =
        bookTitle.offsetHeight;


    function watchBookTitle() {

        const currentLeft =
            bookTitle.offsetLeft;

        const currentTop =
            bookTitle.offsetTop;

        const currentWidth =
            bookTitle.offsetWidth;

        const currentHeight =
            bookTitle.offsetHeight;


        if (
            currentLeft !== lastLeft ||
            currentTop !== lastTop ||
            currentWidth !== lastWidth ||
            currentHeight !== lastHeight
        ) {

            lastLeft =
                currentLeft;

            lastTop =
                currentTop;

            lastWidth =
                currentWidth;

            lastHeight =
                currentHeight;


            updateActionBarPosition();
        }


        requestAnimationFrame(
            watchBookTitle
        );
    }


    requestAnimationFrame(
        watchBookTitle
    );

});
