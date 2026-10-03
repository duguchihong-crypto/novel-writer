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
    localStorage.getItem("bookLayout") ||
    "vertical";


/* ======================================================
   防止异常布局值
====================================================== */

if (
    currentLayout !== "vertical" &&
    currentLayout !== "horizontal"
) {

    currentLayout = "vertical";

}


/* ======================================================
   显示书名
====================================================== */

if (bookTitle) {

    bookTitle.textContent =
        currentBook?.title || "新书";

}


/* ======================================================
   更新布局按钮
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
   执行当前布局
====================================================== */

function applyCurrentLayout() {

    /* ==================================================
       纵向
    ================================================== */

    if (
        currentLayout === "vertical"
    ) {

        if (
            typeof updateVerticalLayout ===
            "function"
        ) {

            updateVerticalLayout();

        }

    }


    /* ==================================================
       横向
    ================================================== */

    else {

        if (
            typeof updateHorizontalLayout ===
            "function"
        ) {

            updateHorizontalLayout();

        }

    }


    /* ==================================================
       保存布局
    ================================================== */

    localStorage.setItem(
        "bookLayout",
        currentLayout
    );


    /* ==================================================
       更新按钮
    ================================================== */

    updateLayoutButton();

}


/* ======================================================
   切换布局方向
====================================================== */

function toggleLayout() {

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
       执行布局
    ================================================== */

    applyCurrentLayout();


    /* ==================================================
       重新显示节点
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

}


/* ======================================================
   布局按钮点击
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


    /* ==================================================
       获取操作按钮
    ================================================== */

    const actionButtons =
        actionBar.querySelectorAll(
            "button[data-action]"
        );


    /* ==================================================
       绑定操作按钮
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
                       新增节点
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
                       关闭操作栏
                    ================================== */

                    hideActionBar();

                }
            );

        }
    );

}


/* ======================================================
   点击页面其他位置
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
            event.target === bookTitle ||
            bookTitle?.contains(
                event.target
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
            event.target === layoutButton ||
            layoutButton?.contains(
                event.target
            )
        ) {

            return;

        }


        /* ==============================================
           其他区域
        ============================================== */

        hideActionBar();

    }
);


/* ======================================================
   初始化布局按钮
====================================================== */

updateLayoutButton();


/* ======================================================
   初始化布局
====================================================== */

applyCurrentLayout();


/* ======================================================
   初始化节点
====================================================== */

if (
    typeof renderNodes ===
    "function"
) {

    renderNodes();

}


/* ======================================================
   初始化连接线
====================================================== */

if (
    typeof refreshConnections ===
    "function"
) {

    refreshConnections();

}
