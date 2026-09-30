 /* ======================================================
    全书树结构模块
 ====================================================== */


/* ======================================================
   新增根节点
====================================================== */

function addRootNode(type) {

    if (!currentBook) {
        return;
    }


    if (!Array.isArray(currentBook.nodes)) {

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
            1650

    };


    /* ==================================================
       加入当前书籍
    ================================================== */

    currentBook.nodes.push(
        node
    );


    /* ==================================================
       重新计算布局
       
       布局功能统一交给
       book-layout.js
    ================================================== */

    if (
        typeof updateVerticalLayout ===
        "function"
    ) {

        updateVerticalLayout();

    }


    /* ==================================================
       保存
    ================================================== */

    saveBooks();


    /* ==================================================
       重新渲染
    ================================================== */

    if (
        typeof renderNodes ===
        "function"
    ) {

        renderNodes();

    }

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


    /* ==================================================
       1～10
    ================================================== */

    if (number <= 10) {

        return numbers[number];

    }


    /* ==================================================
       11～19
    ================================================== */

    if (number < 20) {

        return "十" +
            numbers[number - 10];

    }


    /* ==================================================
       20～99
    ================================================== */

    if (number < 100) {

        const tens =
            Math.floor(
                number / 10
            );

        const ones =
            number % 10;


        return (
            numbers[tens] +
            "十" +
            (
                ones === 0
                    ? ""
                    : numbers[ones]
            )
        );

    }


    return String(number);

}
