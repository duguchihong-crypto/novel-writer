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
   应用当前布局
====================================================== */

function applyCurrentLayout() {

    /* ==================================================
       检查布局方向
    ================================================== */

    if (
        currentLayout !== "vertical" &&
        currentLayout !== "horizontal"
    ) {

        currentLayout =
            "vertical";

    }


    /* ==================================================
       交给 book-layout.js
    ================================================== */

    if (
        typeof setLayoutDirection ===
        "function"
    ) {

        setLayoutDirection(
            currentLayout
        );

        return;

    }


    /* ==================================================
       备用布局
    ================================================== */

    if (
        currentLayout === "horizontal"
    ) {

        if (
            typeof updateHorizontalLayout ===
            "function"
        ) {

            updateHorizontalLayout();

        }

    } else {

        if (
            typeof updateVerticalLayout ===
            "function"
        ) {

            updateVerticalLayout();

        }

    }


    /* ==================================================
       重新绘制节点
    ================================================== */

    if (
        typeof renderNodes ===
        "function"
    ) {

        renderNodes();

    }


    /* ==================================================
       刷新连接线
    ================================================== */

    if (
        typeof refreshConnections ===
        "function"
    ) {

        refreshConnections();

    }


    /* ==================================================
       更新按钮
    ================================================== */

    updateLayoutButton();

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
       保存当前选择
    ================================================== */

    localStorage.setItem(
        "bookLayout",
        currentLayout
    );


    /* ==================================================
       应用布局
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

    /* ==================================================
       防止操作栏点击传到页面
    ================================================== */

    actionBar.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

        }
    );


    /* ==================================================
       获取操作按钮
    ================================================== */

    const actionButtons =
        actionBar.querySelectorAll(
            "button[data-action]"
        );


    /* ==================================================
       注册操作按钮
    ================================================== */

    actionButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();


                    const action =
                        button.dataset.action;


                    /* ==================================
                       创建根节点
                    ================================== */

                    if (
                        typeof addRootNode ===
                        "function"
                    ) {

                        addRootNode(
                            action
                        );

                    }


                    /* ==================================
                       创建完成后关闭操作栏
                    ================================== */

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


        /* ==================================================
           其他位置
        ================================================== */

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


            /* ==========================================
               切换布局
            ========================================== */

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
