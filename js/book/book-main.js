/* ======================================================
   全书主程序
====================================================== */


/* ======================================================
   基础元素
====================================================== */

const bookTitle =
    document.getElementById("bookTitle");

const actionBar =
    document.getElementById("actionBar");

const tree =
    document.getElementById("tree");

const layoutButton =
    document.getElementById("layoutButton");


/* ======================================================
   当前布局方向
====================================================== */

let currentLayout =
    localStorage.getItem("bookLayout");


if (
    currentLayout !== "vertical" &&
    currentLayout !== "horizontal"
) {

    currentLayout =
        "vertical";

}


/* ======================================================
   更新布局按钮文字
====================================================== */

function updateLayoutButton() {

    if (!layoutButton) {
        return;
    }


    if (
        currentLayout === "horizontal"
    ) {

        layoutButton.textContent =
            "→ 横向";

    } else {

        layoutButton.textContent =
            "↕ 纵向";

    }

}


/* ======================================================
   纵向布局
====================================================== */

function runVerticalLayout() {

    if (
        typeof updateVerticalLayout !==
        "function"
    ) {

        console.warn(
            "updateVerticalLayout 不存在"
        );

        return;

    }


    try {

        updateVerticalLayout();

    } catch (error) {

        console.error(
            "纵向布局错误：",
            error
        );

    }

}


/* ======================================================
   横向布局
====================================================== */

function runHorizontalLayout() {

    if (
        typeof updateHorizontalLayout !==
        "function"
    ) {

        console.warn(
            "updateHorizontalLayout 不存在"
        );

        return;

    }


    try {

        updateHorizontalLayout();

    } catch (error) {

        console.error(
            "横向布局错误：",
            error
        );

    }

}


/* ======================================================
   重新绘制节点
====================================================== */

function redrawNodes() {

    if (
        typeof renderNodes !==
        "function"
    ) {

        return;

    }


    try {

        renderNodes();

    } catch (error) {

        console.error(
            "节点重新绘制错误：",
            error
        );

    }

}


/* ======================================================
   刷新连接线
====================================================== */

function redrawConnections() {

    if (
        typeof refreshConnections !==
        "function"
    ) {

        return;

    }


    try {

        refreshConnections();

    } catch (error) {

        console.error(
            "连接线刷新错误：",
            error
        );

    }

}


/* ======================================================
   执行当前布局
====================================================== */

function applyCurrentLayout() {


    /* ==================================================
       保存当前方向
    ================================================== */

    localStorage.setItem(
        "bookLayout",
        currentLayout
    );


    /* ==================================================
       更新按钮
    ================================================== */

    updateLayoutButton();


    /* ==================================================
       执行布局
    ================================================== */

    if (
        currentLayout === "horizontal"
    ) {

        runHorizontalLayout();

    } else {

        runVerticalLayout();

    }


    /* ==================================================
       重新绘制节点
    ================================================== */

    redrawNodes();


    /* ==================================================
       刷新连接线
    ================================================== */

    redrawConnections();

}


/* ======================================================
   切换布局
====================================================== */

function toggleLayout() {


    /* ==================================================
       切换方向
    ================================================== */

    if (
        currentLayout === "vertical"
    ) {

        currentLayout =
            "horizontal";

    } else {

        currentLayout =
            "vertical";

    }


    /* ==================================================
       保存
    ================================================== */

    localStorage.setItem(
        "bookLayout",
        currentLayout
    );


    /* ==================================================
       立即改变按钮文字
    ================================================== */

    updateLayoutButton();


    /* ==================================================
       执行布局
    ================================================== */

    if (
        currentLayout === "horizontal"
    ) {

        runHorizontalLayout();

    } else {

        runVerticalLayout();

    }


    /* ==================================================
       重新绘制节点
    ================================================== */

    redrawNodes();


    /* ==================================================
       刷新连接线
    ================================================== */

    redrawConnections();

}


/* ======================================================
   暴露到 window
====================================================== */

window.toggleLayout =
    toggleLayout;


/* ======================================================
   书名
====================================================== */

function updateBookTitle() {

    if (!bookTitle) {
        return;
    }


    if (
        typeof currentBook !==
        "undefined" &&
        currentBook
    ) {

        bookTitle.textContent =
            currentBook.title ||
            "新书";

    } else {

        bookTitle.textContent =
            "新书";

    }

}


/* ======================================================
   显示操作栏
====================================================== */

function showActionBar() {

    if (!actionBar) {
        return;
    }


    actionBar.classList.add(
        "show"
    );

}


/* ======================================================
   隐藏操作栏
====================================================== */

function hideActionBar() {

    if (!actionBar) {
        return;
    }


    actionBar.classList.remove(
        "show"
    );

}


/* ======================================================
   切换操作栏
====================================================== */

function toggleActionBar() {

    if (!actionBar) {
        return;
    }


    if (
        actionBar.classList.contains(
            "show"
        )
    ) {

        hideActionBar();

    } else {

        showActionBar();

    }

}


/* ======================================================
   书名点击
====================================================== */

if (bookTitle) {

    bookTitle.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            toggleActionBar();

        }
    );

}


/* ======================================================
   操作栏
====================================================== */

if (actionBar) {

    actionBar.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

        }
    );


    const actionButtons =
        actionBar.querySelectorAll(
            "button[data-action]"
        );


    actionButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();


                    const action =
                        button.dataset.action;


                    if (
                        typeof addRootNode ===
                        "function"
                    ) {

                        try {

                            addRootNode(
                                action
                            );

                        } catch (error) {

                            console.error(
                                "新增节点错误：",
                                error
                            );

                        }

                    }


                    hideActionBar();

                }
            );

        }
    );

}


/* ======================================================
   点击其他区域
====================================================== */

document.addEventListener(
    "click",
    function (event) {

        if (!actionBar) {
            return;
        }


        /* ==============================================
           书名
        ============================================== */

        if (
            bookTitle &&
            (
                event.target === bookTitle ||
                bookTitle.contains(
                    event.target
                )
            )
        ) {

            return;

        }


        /* ==============================================
           操作栏
        ============================================== */

        if (
            event.target === actionBar ||
            actionBar.contains(
                event.target
            )
        ) {

            return;

        }


        /* ==============================================
           布局按钮
        ============================================== */

        if (
            layoutButton &&
            (
                event.target === layoutButton ||
                layoutButton.contains(
                    event.target
                )
            )
        ) {

            return;

        }


        hideActionBar();

    }
);


/* ======================================================
   布局按钮
====================================================== */

if (layoutButton) {

    layoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            toggleLayout();

        }
    );

}


/* ======================================================
   初始化
====================================================== */

updateBookTitle();

updateLayoutButton();


/* ======================================================
   初始化当前布局
====================================================== */

applyCurrentLayout();
