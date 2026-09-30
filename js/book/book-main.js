/* ======================================================
   全书主程序
====================================================== */


/* ======================================================
   JS 执行检测
   如果刷新后弹出这个提示
   说明 book-main.js 已经成功加载
====================================================== */

alert("book-main.js 已执行");


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
   操作栏点击
====================================================== */

if (actionBar) {

    actionBar.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

        }
    );


    /* ==================================================
       获取所有操作按钮
    ================================================== */

    const actionButtons =
        actionBar.querySelectorAll(
            "button[data-action]"
        );


    /* ==================================================
       绑定按钮
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
                       调试提示
                    ================================== */

                    alert(
                        "点击了：" +
                        action
                    );


                    /* ==================================
                       新增节点
                    ================================== */

                    addRootNode(action);


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
           其他区域
        ============================================== */

        hideActionBar();

    }
);


/* ======================================================
   新增根节点
====================================================== */

function addRootNode(type) {

    /* ==================================================
       检查当前书籍
    ================================================== */

    if (!currentBook) {

        alert(
            "没有找到当前书籍"
        );

        return;

    }


    /* ==================================================
       检查节点数组
    ================================================== */

    if (
        !Array.isArray(
            currentBook.nodes
        )
    ) {

        currentBook.nodes = [];

    }


    /* ==================================================
       序只能有一个
    ================================================== */

    if (type === "preface") {

        const exists =
            currentBook.nodes.some(
                function (node) {

                    return node.type === "preface";

                }
            );


        if (exists) {

            alert(
                "序章已经存在"
            );

            return;

        }

    }


    /* ==================================================
       创建节点
    ================================================== */

    const node = {

        id:
            Date.now().toString(),

        type:
            type,

        parentId:
            null,

        title:
            getNodeTitle(
                type,
                currentBook.nodes
            ),

        x:
            1500,

        y:
            1650 +
            currentBook.nodes.length * 100

    };


    /* ==================================================
       加入节点
    ================================================== */

    currentBook.nodes.push(
        node
    );


    /* ==================================================
       保存
    ================================================== */

    saveBooks();


    /* ==================================================
       刷新节点
    ================================================== */

    renderNodes();

}


/* ======================================================
   生成节点名称
====================================================== */

function getNodeTitle(
    type,
    nodes
) {

    const count =
        nodes.filter(
            function (node) {

                return node.type === type;

            }
        ).length + 1;


    if (type === "preface") {

        return "序章";

    }


    if (type === "volume") {

        return "第" +
            toChineseNumber(count) +
            "卷";

    }


    if (type === "part") {

        return "第" +
            toChineseNumber(count) +
            "篇";

    }


    if (type === "chapter") {

        return "第" +
            toChineseNumber(count) +
            "章";

    }


    return "新节点";

}


/* ======================================================
   中文数字
====================================================== */

function toChineseNumber(number) {

    const numbers = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十"
    ];


    if (number <= 10) {

        return numbers[number];

    }


    if (number < 20) {

        return "十" +
            numbers[number - 10];

    }


    if (number < 100) {

        const tens =
            Math.floor(
                number / 10
            );

        const ones =
            number % 10;


        return numbers[tens] +
            "十" +
            (
                ones === 0
                    ? ""
                    : numbers[ones]
            );

    }


    return String(number);

}


/* ======================================================
   初始化
====================================================== */

renderNodes();
