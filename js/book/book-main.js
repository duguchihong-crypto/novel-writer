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
    localStorage.getItem("bookLayout") || "vertical";


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

    if (currentLayout === "horizontal") {

        layoutButton.textContent =
            "→ 横向";

    } else {

        layoutButton.textContent =
            "↕ 纵向";

    }

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
       保存布局状态
    ================================================== */

    localStorage.setItem(
        "bookLayout",
        currentLayout
    );


    /* ==================================================
       重新布局
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

    } else {

        if (
            typeof updateHorizontalLayout ===
            "function"
        ) {

            updateHorizontalLayout();

        }

    }


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
       更新连接线
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
   绑定布局按钮
====================================================== */

if (layoutButton) {

    layoutButton.onclick =
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            toggleLayout();

        };

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

    bookTitle.onclick = function () {

        toggleActionBar();

    };

}


/* ======================================================
   操作栏点击
====================================================== */

if (actionBar) {

    actionBar.onclick = function (event) {

        event.stopPropagation();

    };


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

            button.onclick = function (event) {

                event.preventDefault();

                event.stopPropagation();


                const action =
                    button.dataset.action;


                /* ======================================
                   新增节点
                ====================================== */

                if (
                    typeof addRootNode ===
                    "function"
                ) {

                    addRootNode(action);

                }


                /* ======================================
                   关闭操作栏
                ====================================== */

                hideActionBar();

            };

        }
    );

}


/* ======================================================
   点击空白区域
====================================================== */

document.onclick = function (event) {

    if (!actionBar) {
        return;
    }


    /* ==============================================
       点击书名
    ============================================== */

    if (
        event.target === bookTitle ||
        bookTitle?.contains(event.target)
    ) {

        return;

    }


    /* ==============================================
       点击操作栏
    ============================================== */

    if (
        event.target === actionBar ||
        actionBar.contains(event.target)
    ) {

        return;

    }


    /* ==============================================
       点击布局按钮
    ============================================== */

    if (
        event.target === layoutButton ||
        layoutButton?.contains(event.target)
    ) {

        return;

    }


    /* ==============================================
       点击其他区域
    ============================================== */

    hideActionBar();

};


/* ======================================================
   初始化布局按钮
====================================================== */

updateLayoutButton();


/* ======================================================
   初始化布局
====================================================== */

if (
    currentLayout === "vertical"
) {

    if (
        typeof updateVerticalLayout ===
        "function"
    ) {

        updateVerticalLayout();

    }

} else {

    if (
        typeof updateHorizontalLayout ===
        "function"
    ) {

        updateHorizontalLayout();

    }

}


/* ======================================================
   初始化
====================================================== */

if (
    typeof renderNodes ===
    "function"
) {

    renderNodes();

}
