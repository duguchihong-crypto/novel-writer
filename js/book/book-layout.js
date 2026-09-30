/* ======================================================
   全书布局
====================================================== */


/* ======================================================
   纵向布局参数
====================================================== */

const TREE_CENTER_X = 1500;

const TREE_START_Y = 1650;

const TREE_SAME_LEVEL_GAP = 240;

const TREE_LEVEL_GAP = 180;


/* ======================================================
   纵向自动排列
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
       找出根节点
    ================================================== */

    const rootNodes =
        nodes.filter(
            function (node) {

                return (
                    node.parentId === null ||
                    node.parentId === undefined
                );

            }
        );


    /* ==================================================
       根节点排列

       第一卷 → 最右
       第二卷 → 中间
       第三卷 → 最左
    ================================================== */

    const rootStartX =
        TREE_CENTER_X +
        (
            (rootNodes.length - 1) *
            TREE_SAME_LEVEL_GAP
        ) / 2;


    rootNodes.forEach(
        function (node, index) {

            node.x =
                rootStartX -
                index *
                TREE_SAME_LEVEL_GAP;

            node.y =
                TREE_START_Y;

        }
    );


    /* ==================================================
       排列子节点
    ================================================== */

    rootNodes.forEach(
        function (rootNode) {

            layoutChildren(
                rootNode
            );

        }
    );

}


/* ======================================================
   子节点纵向排列
====================================================== */

function layoutChildren(parentNode) {

    if (
        !currentBook ||
        !Array.isArray(currentBook.nodes)
    ) {

        return;

    }


    const children =
        currentBook.nodes.filter(
            function (node) {

                return (
                    String(node.parentId) ===
                    String(parentNode.id)
                );

            }
        );


    if (children.length === 0) {

        return;

    }


    /* ==================================================
       子节点以父节点为中心
    ================================================== */

    const startX =
        parentNode.x +
        (
            (children.length - 1) *
            TREE_SAME_LEVEL_GAP
        ) / 2;


    children.forEach(
        function (child, index) {

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
       继续排列下一层
    ================================================== */

    children.forEach(
        function (child) {

            layoutChildren(
                child
            );

        }
    );

}


/* ======================================================
   进入全书时自动定位书名
====================================================== */

function centerBookTitle() {

    const canvas =
        document.getElementById("canvas");

    const bookTitle =
        document.getElementById("bookTitle");


    if (
        !canvas ||
        !bookTitle
    ) {

        return;

    }


    /* ==================================================
       获取书名和画布的实际屏幕位置
    ================================================== */

    const titleRect =
        bookTitle.getBoundingClientRect();

    const canvasRect =
        canvas.getBoundingClientRect();


    /* ==================================================
       计算书名实际中心
    ================================================== */

    const titleCenterX =
        titleRect.left +
        titleRect.width / 2;

    const titleCenterY =
        titleRect.top +
        titleRect.height / 2;


    /* ==================================================
       计算 canvas 可视区域中心
    ================================================== */

    const canvasCenterX =
        canvasRect.left +
        canvasRect.width / 2;

    const canvasCenterY =
        canvasRect.top +
        canvasRect.height / 2;


    /* ==================================================
       计算需要移动的距离
    ================================================== */

    const moveX =
        titleCenterX -
        canvasCenterX;

    const moveY =
        titleCenterY -
        canvasCenterY;


    /* ==================================================
       调整滚动位置
    ================================================== */

    canvas.scrollLeft +=
        moveX;

    canvas.scrollTop +=
        moveY;

}


/* ======================================================
   页面加载完成
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* ==================================================
           等待页面第一次绘制
        ================================================== */

        requestAnimationFrame(
            function () {

                centerBookTitle();


                /* ==================================================
                   等待节点、字体等完成布局
                ================================================== */

                requestAnimationFrame(
                    function () {

                        centerBookTitle();

                    }
                );

            }
        );


        /* ==================================================
           最后再校正一次
        ================================================== */

        setTimeout(
            function () {

                centerBookTitle();

            },
            300
        );

    }
);
