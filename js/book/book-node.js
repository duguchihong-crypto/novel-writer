/* ======================================================
   全书节点模块
====================================================== */


/* ======================================================
   基础元素
====================================================== */

const nodeTree =
    document.getElementById("tree");


/* ======================================================
   当前选中的节点
====================================================== */

let selectedNodeId = null;


/* ======================================================
   渲染全部节点
====================================================== */

function renderNodes() {

    if (
        !nodeTree ||
        !currentBook
    ) {
        return;
    }


    nodeTree.innerHTML = "";


    const nodes =
        Array.isArray(currentBook.nodes)
            ? currentBook.nodes
            : [];


    nodes.forEach(
        function (node) {

            createNodeElement(node);

        }
    );


    /* ==================================================
       节点全部生成后
       → 刷新连接线
    ================================================== */

    if (
        typeof refreshConnections ===
        "function"
    ) {

        refreshConnections();

    }

}


/* ======================================================
   创建单个节点
====================================================== */

function createNodeElement(node) {

    if (!nodeTree || !node) {
        return null;
    }


    const element =
        document.createElement("div");


    /* ==================================================
       节点基础样式
    ================================================== */

    element.className =
        "node " +
        node.type;


    /* ==================================================
       节点 ID
    ================================================== */

    element.dataset.id =
        node.id;


    /* ==================================================
       节点名称
    ================================================== */

    element.textContent =
        node.title || "";


    /* ==================================================
       节点位置
    ================================================== */

    element.style.left =
        (
            typeof node.x === "number"
                ? node.x
                : 1500
        ) + "px";


    element.style.top =
        (
            typeof node.y === "number"
                ? node.y
                : 1650
        ) + "px";


    /* ==================================================
       以节点中心定位
    ================================================== */

    element.style.transform =
        "translate(-50%, -50%)";


    /* ==================================================
       当前节点是否已经被选中
    ================================================== */

    if (
        String(selectedNodeId) ===
        String(node.id)
    ) {

        element.classList.add("selected");

    }


    /* ==================================================
       节点点击
    ================================================== */

    element.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            selectNode(node.id);

        }
    );


    /* ==================================================
       加入树
    ================================================== */

    nodeTree.appendChild(
        element
    );


    return element;

}


/* ======================================================
   选择节点
====================================================== */

function selectNode(nodeId) {

    selectedNodeId =
        nodeId;


    updateNodeSelection();

}


/* ======================================================
   更新节点选择状态
====================================================== */

function updateNodeSelection() {

    if (!nodeTree) {
        return;
    }


    const nodeElements =
        nodeTree.querySelectorAll(
            ".node"
        );


    nodeElements.forEach(
        function (element) {

            const isSelected =
                String(
                    element.dataset.id
                ) ===
                String(selectedNodeId);


            element.classList.toggle(
                "selected",
                isSelected
            );

        }
    );

}


/* ======================================================
   清除节点选择
====================================================== */

function clearNodeSelection() {

    selectedNodeId =
        null;


    updateNodeSelection();

}
