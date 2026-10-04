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

    currentLayout = "vertical";

}


/* ======================================================
   更新布局按钮文字
====================================================== */

function updateLayoutButton() {

    if (!layoutButton) {
        return;
    }

    if (currentLayout === "horizontal") {

        layoutButton.textContent =
            "→ 横向";

    } else {

        layoutButton.textContent =
            "↕ 纵向";

    }

}


/* ======================================================
   更新当前布局
====================================================== */

function applyCurrentLayout() {

    if (
        currentLayout !== "vertical" &&
        currentLayout !== "horizontal"
    ) {

        currentLayout = "vertical";

    }


    /* ==================================================
       保存
    ================================================== */

    localStorage.setItem(
        "bookLayout",
        currentLayout
    );


    /* ==================================================
       更新按钮
       这里先更新，不依赖布局函数
    ================================================== */

    updateLayoutButton();


    /* ==================================================
       执行布局
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
       重新绘制连接线
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
       立即更新按钮
    ================================================== */

    updateLayoutButton();


    /* ==================================================
       应用布局
    ================================================== */

    applyCurrentLayout();

}


/* ======================================================
   暴露给整个页面
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
        typeof currentBook !== "undefined" &&
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

    actionBar.classList.add("show");

}


/* ======================================================
   隐藏操作栏
====================================================== */

function hideActionBar() {

    if (!actionBar) {
        return;
    }

    actionBar.classList.remove("show");

}


/* ======================================================
   切换操作栏
====================================================== */

function toggleActionBar() {

    if (!actionBar) {
        return;
    }


    if (
        actionBar.classList.contains("show")
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
                       完成后关闭操作栏
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
                bookTitle.contains(event.target)
            )
        ) {

            return;

        }


        /* ==================================================
           点击操作栏
        ================================================== */

        if (
            actionBar.contains(event.target)
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
                layoutButton.contains(event.target)
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

    /* ==================================================
       点击事件
    ================================================== */

    layoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            toggleLayout();

        }
    );


    /* ==================================================
       iPhone / Safari 备用点击方式
       防止某些情况下 click 没有正常触发
    ================================================== */

    layoutButton.onclick =
        function (event) {

            if (event) {

                event.preventDefault();
                event.stopPropagation();

            }

            toggleLayout();

        };

}


/* ======================================================
   初始化书名
====================================================== */

updateBookTitle();


/* ======================================================
   初始化布局按钮
====================================================== */

updateLayoutButton();


/* ======================================================
   初始化布局
====================================================== */

applyCurrentLayout();
