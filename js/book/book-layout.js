/* ======================================================
   全书布局
====================================================== */


/* ======================================================
   基础参数
====================================================== */

const TREE_CENTER_X = 1500;

const TREE_START_Y = 1650;

const TREE_SAME_LEVEL_GAP = 240;

const TREE_LEVEL_GAP = 180;


/* ======================================================
   横向布局参数
====================================================== */

const TREE_HORIZONTAL_START_X = 1650;

const TREE_HORIZONTAL_CENTER_Y = 1500;


/* ======================================================
   当前布局方向
====================================================== */

let currentLayoutDirection = "vertical";


/* ======================================================
   读取当前布局方向
====================================================== */

if (
    currentBook &&
    currentBook.layoutDirection === "horizontal"
) {

    currentLayoutDirection =
        "horizontal";

} else {

    currentLayoutDirection =
        "vertical";

}


/* ======================================================
   统一布局入口
====================================================== */

function updateLayout() {

    if (
        currentLayoutDirection ===
        "horizontal"
    ) {

        updateHorizontalLayout();

        return;

    }


    updateVerticalLayoutOnly();

}


/* ======================================================
   兼容旧函数
====================================================== */

function updateVerticalLayout() {

    updateLayout();

}


/* ======================================================
   设置布局方向
====================================================== */

function setLayoutDirection(
    direction
) {

    if (
        direction === "horizontal"
    ) {

        currentLayoutDirection =
            "horizontal";

    } else {

        currentLayoutDirection =
            "vertical";

    }


    /* ==================================================
       保存当前布局方向
    ================================================== */

    if (currentBook) {

        currentBook.layoutDirection =
            currentLayoutDirection;

    }


    /* ==================================================
       重新排列
    ================================================== */

    updateLayout();


    /* ==================================================
       保存
    ================================================== */

    if (
        typeof saveBooks ===
        "function"
    ) {

        saveBooks();

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

}


/* ======================================================
   获取当前布局方向
====================================================== */

function getLayoutDirection() {

    return currentLayoutDirection;

}


/* ======================================================
   切换布局方向
====================================================== */

function toggleLayoutDirection() {

    if (
        currentLayoutDirection ===
        "vertical"
    ) {

        setLayoutDirection(
            "horizontal"
        );

    } else {

        setLayoutDirection(
            "vertical"
        );

    }

}


/* ======================================================
   纵向自动排列
====================================================== */

function updateVerticalLayoutOnly() {

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
       第二卷 → 左边
       第三卷 → 更左
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

            layoutVerticalChildren(
                rootNode
            );

        }
    );

}


/* ======================================================
   子节点纵向排列
====================================================== */

function layoutVerticalChildren(
    parentNode
) {

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

            layoutVerticalChildren(
                child
            );

        }
    );

}


/* ======================================================
   横向自动排列
====================================================== */

function updateHorizontalLayout() {

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

       第一卷 → 最上面
       第二卷 → 下面
       第三卷 → 更下面
    ================================================== */

    const rootStartY =
        TREE_HORIZONTAL_CENTER_Y -
        (
            (rootNodes.length - 1) *
            TREE_SAME_LEVEL_GAP
        ) / 2;


    rootNodes.forEach(
        function (node, index) {

            node.x =
                TREE_HORIZONTAL_START_X;

            node.y =
                rootStartY +
                index *
                TREE_SAME_LEVEL_GAP;

        }
    );


    /* ==================================================
       排列子节点
    ================================================== */

    rootNodes.forEach(
        function (rootNode) {

            layoutHorizontalChildren(
                rootNode
            );

        }
    );

}


/* ======================================================
   子节点横向排列
====================================================== */

function layoutHorizontalChildren(
    parentNode
) {

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
       子节点以父节点为中心上下排列
    ================================================== */

    const startY =
        parentNode.y -
        (
            (children.length - 1) *
            TREE_SAME_LEVEL_GAP
        ) / 2;


    children.forEach(
        function (child, index) {

            child.x =
                parentNode.x +
                TREE_LEVEL_GAP;

            child.y =
                startY +
                index *
                TREE_SAME_LEVEL_GAP;

        }
    );


    /* ==================================================
       继续排列下一层
    ================================================== */

    children.forEach(
        function (child) {

            layoutHorizontalChildren(
                child
            );

        }
    );

}
