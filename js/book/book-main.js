/* ======================================================
   全书主程序
====================================================== */


/* ======================================================
   页面元素
====================================================== */

const bookTitle =
    document.getElementById("bookTitle");

const actionBar =
    document.getElementById("actionBar");

const layoutButton =
    document.getElementById("layoutButton");


/* ======================================================
   当前布局
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
   执行纵向布局
====================================================== */

function runVerticalLayout() {

    if (
        typeof updateVerticalLayout !==
        "function"
    ) {

        return;

    }


    updateVerticalLayout();

}


/* ======================================================
   执行横向布局
====================================================== */

function runHorizontalLayout() {

    if (
        typeof updateHorizontalLayout !==
        "function"
    ) {

        return;

    }


    updateHorizontalLayout();

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


    renderNodes();

}


/* ======================================================
   重新绘制连接线
====================================================== */

function redrawConnections() {

    if (
        typeof refreshConnections !==
        "function"
    ) {

        return;

    }


    refreshConnections();

}


/* ======================================================
   应用当前布局
====================================================== */

function applyCurrentLayout() {

    /* ==================================================
       保存
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
       排列节点
    ================================================== */

    if (
        currentLayout === "horizontal"
    ) {

        runHorizontalLayout();

    } else {

        runVerticalLayout();

    }


    /* ==================================================
       重新绘制
    ================================================== */

    redrawNodes();

    redrawConnections();

}


/* ======================================================
   切换布局
====================================================== */

function toggleLayout() {

    /* ==================================================
       纵向 → 横向
    ================================================== */

    if (
        currentLayout === "vertical"
    ) {

        currentLayout =
            "horizontal";

    }

    /* ==================================================
       横向 → 纵向
    ================================================== */

    else {

        currentLayout =
            "vertical";

    }


    /* ==================================================
       立即应用
    ================================================== */

    applyCurrentLayout();

}


/* ======================================================
   暴露布局切换
====================================================== */

window.toggleLayout =
    toggleLayout;


/* ======================================================
   更新书名
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
   书名操作栏
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

                        addRootNode(
                            action
                        );

                    }


                    hideActionBar();

                }
            );

        }
    );

}


/* ======================================================
   页面空白区域点击
====================================================== */

document.addEventListener(
    "click",
    function (event) {

        if (!actionBar) {

            return;

        }


        /* ==================================================
           点击书名
        ================================================== */

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


        /* ==================================================
           点击操作栏
        ================================================== */

        if (
            actionBar.contains(
                event.target
            )
        ) {

            return;

        }


        /* ==================================================
           点击布局按钮
        ================================================== */

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
   应用当前布局
====================================================== */

applyCurrentLayout();
