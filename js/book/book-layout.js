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
   进入全书时，将书名放在屏幕正中央
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const canvas =
            document.getElementById("canvas");


        if (!canvas) {

            return;

        }


        function centerBookTitle() {

            /*
             * 书名中心坐标：
             *
             * X = 1500
             * Y = 1500
             */

            const centerX =
                TREE_CENTER_X;

            const centerY =
                1500;


            /*
             * 让屏幕中心
             * 对准书名中心
             */

            canvas.scrollLeft =
                centerX -
                canvas.clientWidth / 2;


            canvas.scrollTop =
                centerY -
                canvas.clientHeight / 2;

        }


        /* ==================================================
           第一次定位
        ================================================== */

        requestAnimationFrame(
            function () {

                centerBookTitle();

            }
        );


        /* ==================================================
           页面完全稳定后再次定位
        ================================================== */

        setTimeout(
            function () {

                centerBookTitle();

            },
            100
        );


        setTimeout(
            function () {

                centerBookTitle();

            },
            300
        );

    }
);
