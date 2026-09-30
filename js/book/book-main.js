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


/* ======================================================
   显示书名
====================================================== */

if (bookTitle) {

    bookTitle.textContent =
        currentBook?.title || "新书";

}


/* ======================================================
   显示 / 隐藏操作栏
====================================================== */

function toggleActionBar() {

    if (!actionBar) {
        return;
    }

    actionBar.classList.toggle("show");

}


function hideActionBar() {

    if (!actionBar) {
        return;
    }

    actionBar.classList.remove("show");

}


/* ======================================================
   书名：点击
====================================================== */

if (bookTitle) {

    bookTitle.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            toggleActionBar();

        }
    );

}


/* ======================================================
   操作栏
====================================================== */

if (actionBar) {

    /* ==================================================
       防止点击操作栏触发空白关闭
    ================================================== */

    actionBar.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

        }
    );


    /* ==================================================
       ＋序 ＋章 ＋篇 ＋卷
    ================================================== */

    const actionButtons =
        actionBar.querySelectorAll(
            "button[data-action]"
        );


    actionButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();


                    const action =
                        button.dataset.action;


                    /* ==================================
                       新增节点
                    ================================== */

                    addRootNode(action);


                    /* ==================================
                       新增完成后关闭操作栏
                    ================================== */

                    hideActionBar();

                }
            );

        }
    );

}


/* ======================================================
   点击空白区域
====================================================== */

document.addEventListener(
    "click",
    function (event) {

        if (!actionBar) {
            return;
        }


        /* ==============================================
           点击书名
           → 不关闭
        ============================================== */

        if (
            event.target === bookTitle ||
            bookTitle?.contains(event.target)
        ) {

            return;

        }


        /* ==============================================
           点击操作栏
           → 不关闭
        ============================================== */

        if (
            event.target === actionBar ||
            actionBar.contains(event.target)
        ) {

            return;

        }


        /* ==============================================
           点击其他区域
           → 关闭
        ============================================== */

        hideActionBar();

    }
);


/* ======================================================
   初始化
====================================================== */

renderNodes();
