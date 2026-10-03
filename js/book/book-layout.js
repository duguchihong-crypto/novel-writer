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

let currentLayoutDirection = “vertical”;

/* ======================================================
初始化布局方向
====================================================== */

function initializeLayoutDirection() {

if (
    typeof currentBook !== "undefined" &&
    currentBook &&
    currentBook.layoutDirection === "horizontal"
) {
    currentLayoutDirection =
        "horizontal";
} else {
    currentLayoutDirection =
        "vertical";
}
/* ==================================================
   同步主程序使用的布局状态
================================================== */
if (
    typeof currentLayout !== "undefined"
) {
    currentLayout =
        currentLayoutDirection;
}

}

/* ======================================================
同步布局状态
====================================================== */

function syncLayoutDirection() {

if (
    currentLayoutDirection !== "horizontal"
) {
    currentLayoutDirection =
        "vertical";
}
/* ==================================================
   同步 currentLayout
================================================== */
if (
    typeof currentLayout !== "undefined"
) {
    currentLayout =
        currentLayoutDirection;
}
/* ==================================================
   同步 currentBook
================================================== */
if (
    typeof currentBook !== "undefined" &&
    currentBook
) {
    currentBook.layoutDirection =
        currentLayoutDirection;
}

}

/* ======================================================
统一布局入口
====================================================== */

function updateLayout() {

syncLayoutDirection();
/* ==================================================
   执行布局
================================================== */
if (
    currentLayoutDirection ===
    "horizontal"
) {
    updateHorizontalLayout();
} else {
    updateVerticalLayoutOnly();
}
/* ==================================================
   重新生成节点
================================================== */
if (
    typeof renderNodes ===
    "function"
) {
    renderNodes();
}
/* ==================================================
   刷新连接线
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
兼容旧函数
====================================================== */

function updateVerticalLayout() {

updateVerticalLayoutOnly();

}

/* ======================================================
设置布局方向
====================================================== */

function setLayoutDirection(
direction
) {

/* ==================================================
   设置唯一布局状态
================================================== */
if (
    direction ===
    "horizontal"
) {
    currentLayoutDirection =
        "horizontal";
} else {
    currentLayoutDirection =
        "vertical";
}
/* ==================================================
   同步所有状态
================================================== */
syncLayoutDirection();
/* ==================================================
   执行布局
================================================== */
if (
    currentLayoutDirection ===
    "horizontal"
) {
    updateHorizontalLayout();
} else {
    updateVerticalLayoutOnly();
}
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
   重新生成节点
================================================== */
if (
    typeof renderNodes ===
    "function"
) {
    renderNodes();
}
/* ==================================================
   更新按钮
================================================== */
updateLayoutButton();
/* ==================================================
   刷新连接线
================================================== */
if (
    typeof refreshConnections ===
    "function"
) {
    refreshConnections();
}

}

/* ======================================================
获取当前布局方向
====================================================== */

function getLayoutDirection() {

return currentLayoutDirection;

}

/* ======================================================
更新顶部布局按钮
====================================================== */

function updateLayoutButton() {

const button =
    document.getElementById(
        "layoutButton"
    );
if (!button) {
    return;
}
if (
    currentLayoutDirection ===
    "horizontal"
) {
    button.textContent =
        "↔ 横向";
} else {
    button.textContent =
        "↕ 纵向";
}

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
暴露给其他模块
====================================================== */

window.toggleLayoutDirection =
toggleLayoutDirection;

window.setLayoutDirection =
setLayoutDirection;

window.getLayoutDirection =
getLayoutDirection;

window.updateLayout =
updateLayout;

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
    typeof currentBook === "undefined" ||
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
if (
    children.length === 0
) {
    return;
}
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
    typeof currentBook === "undefined" ||
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
    typeof currentBook === "undefined" ||
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
if (
    children.length === 0
) {
    return;
}
/* ==================================================
   子节点以上下方向排列
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

/* ======================================================
页面加载后初始化
====================================================== */

window.addEventListener(
“load”,
function () {

    initializeLayoutDirection();
    updateLayoutButton();
}

);
