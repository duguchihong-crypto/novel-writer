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
       parentId 为空的节点就是根节点
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
       
       创建顺序：
       第一卷 → 第二卷 → 第三卷

       显示位置：
       第三卷 ← 第二卷 ← 第一卷
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
       排列每一个节点的子节点
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
       子节点组以父节点为中心
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
       继续向下排列
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
   自动居中
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const canvas =
            document.getElementById("canvas");

        const workspace =
            document.getElementById("workspace");


        if (
            !canvas ||
            !workspace
        ) {

            return;

        }


        function centerView() {

            const x =
                (
                    workspace.scrollWidth -
                    canvas.clientWidth
                ) / 2;


            const y =
                (
                    workspace.scrollHeight -
                    canvas.clientHeight
                ) / 2;


            canvas.scrollLeft =
                x;


            canvas.scrollTop =
                y;

        }


        requestAnimationFrame(
            function () {

                centerView();


                setTimeout(
                    centerView,
                    100
                );


                setTimeout(
                    centerView,
                    300
                );

            }
        );

    }
);
