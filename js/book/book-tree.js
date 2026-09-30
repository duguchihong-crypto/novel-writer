/* ======================================================
   全书树结构模块
====================================================== */


/* ======================================================
   布局参数
====================================================== */

const TREE_CENTER_X = 1500;

const TREE_START_Y = 1650;

const TREE_SAME_LEVEL_GAP = 240;

const TREE_LEVEL_GAP = 180;


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
                node =>
                    node.type === "preface"
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
            TREE_CENTER_X,

        y:
            TREE_START_Y

    };


    /* ==================================================
       加入当前书籍
    ================================================== */

    currentBook.nodes.push(
        node
    );


    /* ==================================================
       重新计算纵向布局
    ================================================== */

    updateVerticalLayout();


    /* ==================================================
       保存
    ================================================== */

    saveBooks();


    /* ==================================================
       重新渲染
    ================================================== */

    renderNodes();

}


/* ======================================================
   更新纵向布局
====================================================== */

function updateVerticalLayout() {

    if (
        !currentBook ||
        !Array.isArray(currentBook.nodes)
    ) {
        return;
    }


    const nodes =
        currentBook.nodes;


    /* ==================================================
       根节点
       
       同级从右往左：

       第一卷
       第二卷
       第三卷

       显示：

       第三卷  第二卷  第一卷
    ================================================== */

    const rootNodes =
        nodes.filter(
            node =>
                node.parentId === null ||
                node.parentId === undefined
        );


    const rootStartX =
        TREE_CENTER_X +
        (
            (rootNodes.length - 1) *
            TREE_SAME_LEVEL_GAP
        ) / 2;


    rootNodes.forEach(
        function (
            node,
            index
        ) {

            node.x =
                rootStartX -
                index *
                TREE_SAME_LEVEL_GAP;

            node.y =
                TREE_START_Y;

        }
    );


    /* ==================================================
       处理子节点
    ================================================== */

    rootNodes.forEach(
        function (rootNode) {

            layoutChildren(
                rootNode,
                1
            );

        }
    );

}


/* ======================================================
   子节点布局
====================================================== */

function layoutChildren(
    parentNode,
    level
) {

    if (
        !currentBook ||
        !Array.isArray(currentBook.nodes) ||
        !parentNode
    ) {
        return;
    }


    const children =
        currentBook.nodes.filter(
            node =>
                String(node.parentId) ===
                String(parentNode.id)
        );


    if (
        children.length === 0
    ) {
        return;
    }


    /* ==================================================
       同级节点从右往左
    ================================================== */

    const startX =
        parentNode.x +
        (
            (children.length - 1) *
            TREE_SAME_LEVEL_GAP
        ) / 2;


    children.forEach(
        function (
            child,
            index
        ) {

            child.x =
                startX -
                index *
                TREE_SAME_LEVEL_GAP;

            child.y =
                parentNode.y +
                TREE_LEVEL_GAP;

        }
    );


    /* ==================================================
       继续向下处理
    ================================================== */

    children.forEach(
        function (child) {

            layoutChildren(
                child,
                level + 1
            );

        }
    );

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
            node =>
                node.type === type
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
