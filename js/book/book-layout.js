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
   纵向布局
====================================================== */

function updateVerticalLayout() {

    updateVerticalLayoutOnly();

}


/* ======================================================
   纵向自动排列
====================================================== */

function updateVerticalLayoutOnly() {

    if (
        typeof currentBook === "undefined" ||
        !currentBook ||
        !Array.isArray(currentBook.nodes)
    ) {
        return;
    }

    const nodes = currentBook.nodes;


    /* ==================================================
       找出根节点
    ================================================== */

    const rootNodes =
        nodes.filter(function (node) {

            return (
                node.parentId === null ||
                node.parentId === undefined
            );

        });


    /* ==================================================
       根节点排列
    ================================================== */

    const rootStartX =
        TREE_CENTER_X +
        (
            (rootNodes.length - 1) *
            TREE_SAME_LEVEL_GAP
        ) / 2;


    rootNodes.forEach(function (node, index) {

        node.x =
            rootStartX -
            index *
            TREE_SAME_LEVEL_GAP;

        node.y =
            TREE_START_Y;

    });


    /* ==================================================
       排列所有子节点
    ================================================== */

    rootNodes.forEach(function (rootNode) {

        layoutVerticalChildren(rootNode);

    });

}


/* ======================================================
   子节点纵向排列
====================================================== */

function layoutVerticalChildren(parentNode) {

    if (
        typeof currentBook === "undefined" ||
        !currentBook ||
        !Array.isArray(currentBook.nodes)
    ) {
        return;
    }


    const children =
        currentBook.nodes.filter(function (node) {

            return (
                String(node.parentId) ===
                String(parentNode.id)
            );

        });


    if (children.length === 0) {
        return;
    }


    /* ==================================================
       子节点左右排列
    ================================================== */

    const startX =
        parentNode.x +
        (
            (children.length - 1) *
            TREE_SAME_LEVEL_GAP
        ) / 2;


    children.forEach(function (child, index) {

        child.x =
            startX -
            index *
            TREE_SAME_LEVEL_GAP;

        child.y =
            parentNode.y +
            TREE_LEVEL_GAP;

    });


    /* ==================================================
       继续下一层
    ================================================== */

    children.forEach(function (child) {

        layoutVerticalChildren(child);

    });

}


/* ======================================================
   横向自动排列
====================================================== */

function updateHorizontalLayout() {

    if (
        typeof currentBook === "undefined" ||
        !currentBook ||
        !Array.isArray(currentBook.nodes)
    ) {
        return;
    }

    const nodes = currentBook.nodes;


    /* ==================================================
       找出根节点
    ================================================== */

    const rootNodes =
        nodes.filter(function (node) {

            return (
                node.parentId === null ||
                node.parentId === undefined
            );

        });


    /* ==================================================
       根节点上下排列
    ================================================== */

    const rootStartY =
        TREE_HORIZONTAL_CENTER_Y -
        (
            (rootNodes.length - 1) *
            TREE_SAME_LEVEL_GAP
        ) / 2;


    rootNodes.forEach(function (node, index) {

        node.x =
            TREE_HORIZONTAL_START_X;

        node.y =
            rootStartY +
            index *
            TREE_SAME_LEVEL_GAP;

    });


    /* ==================================================
       排列所有子节点
    ================================================== */

    rootNodes.forEach(function (rootNode) {

        layoutHorizontalChildren(rootNode);

    });

}


/* ======================================================
   子节点横向排列
====================================================== */

function layoutHorizontalChildren(parentNode) {

    if (
        typeof currentBook === "undefined" ||
        !currentBook ||
        !Array.isArray(currentBook.nodes)
    ) {
        return;
    }


    const children =
        currentBook.nodes.filter(function (node) {

            return (
                String(node.parentId) ===
                String(parentNode.id)
            );

        });


    if (children.length === 0) {
        return;
    }


    /* ==================================================
       子节点上下排列
    ================================================== */

    const startY =
        parentNode.y -
        (
            (children.length - 1) *
            TREE_SAME_LEVEL_GAP
        ) / 2;


    children.forEach(function (child, index) {

        child.x =
            parentNode.x +
            TREE_LEVEL_GAP;

        child.y =
            startY +
            index *
            TREE_SAME_LEVEL_GAP;

    });


    /* ==================================================
       继续下一层
    ================================================== */

    children.forEach(function (child) {

        layoutHorizontalChildren(child);

    });

}


/* ======================================================
   设置布局方向
====================================================== */

function setLayoutDirection(direction) {

    if (
        direction !== "horizontal" &&
        direction !== "vertical"
    ) {
        direction = "vertical";
    }


    /* ==================================================
       使用 book-main.js 的唯一状态
    ================================================== */

    if (
        typeof currentLayout !== "undefined"
    ) {
        currentLayout = direction;
    }


    /* ==================================================
       同步 currentBook
    ================================================== */

    if (
        typeof currentBook !== "undefined" &&
        currentBook
    ) {

        currentBook.layoutDirection =
            direction;

    }


    /* ==================================================
       保存布局
    ================================================== */

    localStorage.setItem(
        "bookLayout",
        direction
    );


    /* ==================================================
       执行布局
    ================================================== */

    if (direction === "horizontal") {

        updateHorizontalLayout();

    } else {

        updateVerticalLayout();

    }


    /* ==================================================
       重新绘制节点
    ================================================== */

    if (
        typeof renderNodes === "function"
    ) {

        renderNodes();

    }


    /* ==================================================
       刷新连接线
    ================================================== */

    if (
        typeof refreshConnections === "function"
    ) {

        refreshConnections();

    }


    /* ==================================================
       更新按钮
    ================================================== */

    if (
        typeof updateLayoutButton === "function"
    ) {

        updateLayoutButton();

    }


    /* ==================================================
       保存书籍
    ================================================== */

    if (
        typeof saveBooks === "function"
    ) {

        saveBooks();

    }

}


/* ======================================================
   获取布局方向
====================================================== */

function getLayoutDirection() {

    if (
        typeof currentLayout !== "undefined"
    ) {

        return currentLayout;

    }

    return "vertical";

}


/* ======================================================
   切换布局
====================================================== */

function toggleLayoutDirection() {

    const current =
        getLayoutDirection();


    if (current === "horizontal") {

        setLayoutDirection("vertical");

    } else {

        setLayoutDirection("horizontal");

    }

}


/* ======================================================
   统一布局入口
====================================================== */

function updateLayout() {

    const direction =
        getLayoutDirection();


    if (direction === "horizontal") {

        updateHorizontalLayout();

    } else {

        updateVerticalLayout();

    }


    if (
        typeof renderNodes === "function"
    ) {

        renderNodes();

    }


    if (
        typeof refreshConnections === "function"
    ) {

        refreshConnections();

    }


    if (
        typeof updateLayoutButton === "function"
    ) {

        updateLayoutButton();

    }

}


/* ======================================================
   暴露函数
====================================================== */

window.setLayoutDirection =
    setLayoutDirection;

window.getLayoutDirection =
    getLayoutDirection;

window.toggleLayoutDirection =
    toggleLayoutDirection;

window.updateLayout =
    updateLayout;
