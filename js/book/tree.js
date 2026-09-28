// ==================================================
// tree.js
// 全书树状结构系统
//
// 规则：
// 1. 书名是根节点
// 2. 纵向：上 → 下
// 3. 横向：右 → 左
// 4. 第一项永远在最右边
// 5. 新建第二项后，第二项出现在第一项左边
// 6. 一个节点最多两个直接子节点
// 7. 连接线：父节点中央 → 子节点中央
// ==================================================


// ==================================================
// DOM
// ==================================================

const treeWorkspace =
    document.getElementById("workspace");

const treeContainer =
    document.getElementById("tree");

const connectionSvg =
    document.getElementById("connections");

const treeBookTitle =
    document.getElementById("bookTitle");

const treeActionBar =
    document.getElementById("actionBar");


// ==================================================
// 布局参数
// ==================================================

const TREE_CONFIG = {

    nodeWidth: 150,

    nodeHeight: 50,

    horizontalGap: 90,

    verticalGap: 130,

    padding: 300,

    lineWidth: 2

};


// ==================================================
// 节点数据
// ==================================================

const treeNodes = new Map();


// ==================================================
// 根节点
// ==================================================

const treeRoot = {

    id: "book",

    type: "book",

    title: "新书",

    parentId: null,

    children: []

};


treeNodes.set(
    treeRoot.id,
    treeRoot
);


// ==================================================
// 当前选择
// ==================================================

let treeSelectedNodeId = null;


// ==================================================
// ID
// ==================================================

function createTreeId() {

    return (
        "node-" +
        Date.now().toString(36) +
        "-" +
        Math.random()
            .toString(36)
            .slice(2, 9)
    );

}


// ==================================================
// 获取节点
// ==================================================

function getTreeNode(id) {

    return treeNodes.get(id) || null;

}


// ==================================================
// 获取子节点
// ==================================================

function getTreeChildren(node) {

    return node.children
        .map(id => getTreeNode(id))
        .filter(Boolean);

}


// ==================================================
// 获取父节点
// ==================================================

function getTreeParent(node) {

    if (!node || node.parentId === null) {

        return null;

    }


    return getTreeNode(
        node.parentId
    );

}


// ==================================================
// 获取层级
// ==================================================

function getTreeLevel(node) {

    let level = 0;

    let current = node;


    while (
        current &&
        current.parentId !== null
    ) {

        current =
            getTreeParent(current);

        level++;

    }


    return level;

}


// ==================================================
// 类型
// ==================================================

function getTreeChildType(parent) {

    if (parent.type === "book") {

        return "volume";

    }


    if (parent.type === "volume") {

        return "part";

    }


    if (parent.type === "part") {

        return "chapter";

    }


    return null;

}


// ==================================================
// 类型名称
// ==================================================

function getTreeTypeName(type) {

    switch (type) {

        case "preface":
            return "序章";

        case "volume":
            return "卷";

        case "part":
            return "篇";

        case "chapter":
            return "章";

        default:
            return "";

    }

}


// ==================================================
// 创建节点
// ==================================================

function createTreeNode(
    parent,
    type
) {

    // ----------------------------------------------
    // 序章只能有一个
    // ----------------------------------------------

    if (type === "preface") {

        const exists =
            getTreeChildren(parent)
                .some(
                    child =>
                        child.type === "preface"
                );


        if (exists) {

            return null;

        }

    }


    // ----------------------------------------------
    // 普通节点最多两个
    // ----------------------------------------------

    if (
        type !== "preface" &&
        parent.children.length >= 2
    ) {

        return null;

    }


    // ----------------------------------------------
    // 编号
    //
    // 注意：
    // children 数组从左到右保存：
    //
    // 第二、第一
    //
    // 所以新建节点时必须放到最前面。
    // ----------------------------------------------

    const number =
        parent.children.length + 1;


    let title;


    if (type === "preface") {

        title = "序章";

    } else {

        title =
            `第${number}${getTreeTypeName(type)}`;

    }


    const node = {

        id: createTreeId(),

        type: type,

        title: title,

        parentId: parent.id,

        children: []

    };


    treeNodes.set(
        node.id,
        node
    );


    /*
     * 核心规则：
     *
     * 新节点放最前面。
     *
     * 第一次：
     *
     * [第一卷]
     *
     * 第二次：
     *
     * [第二卷, 第一卷]
     *
     * 所以视觉上：
     *
     * 第二卷     第一卷
     */

    parent.children.unshift(
        node.id
    );


    return node;

}


// ==================================================
// 创建指定类型
// ==================================================

function addTreeNode(type) {

    let parent;


    // ----------------------------------------------
    // 有选择节点
    // ----------------------------------------------

    if (treeSelectedNodeId) {

        parent =
            getTreeNode(
                treeSelectedNodeId
            );

    }


    // ----------------------------------------------
    // 没选择
    // ----------------------------------------------

    if (!parent) {

        parent = treeRoot;

    }


    // ----------------------------------------------
    // 序章
    // ----------------------------------------------

    if (type === "preface") {

        if (parent.type !== "book") {

            return;

        }


        const node =
            createTreeNode(
                parent,
                "preface"
            );


        if (!node) {

            return;

        }


        renderTree();


        return;

    }


    // ----------------------------------------------
    // 确定合法子类型
    // ----------------------------------------------

    const childType =
        getTreeChildType(parent);


    if (!childType) {

        return;

    }


    // ----------------------------------------------
    // 防止跨级创建
    // ----------------------------------------------

    if (type !== childType) {

        return;

    }


    // ----------------------------------------------
    // 创建
    // ----------------------------------------------

    const node =
        createTreeNode(
            parent,
            type
        );


    if (!node) {

        return;

    }


    renderTree();

}


// ==================================================
// 删除节点
// ==================================================

function deleteTreeNode(id) {

    const node =
        getTreeNode(id);


    if (!node) {

        return;

    }


    // 不能删除书名

    if (node.type === "book") {

        return;

    }


    const parent =
        getTreeParent(node);


    if (parent) {

        parent.children =
            parent.children.filter(
                childId =>
                    childId !== node.id
            );

    }


    // ----------------------------------------------
    // 递归删除全部子节点
    // ----------------------------------------------

    function removeChildren(current) {

        current.children.forEach(
            childId => {

                const child =
                    getTreeNode(
                        childId
                    );


                if (child) {

                    removeChildren(
                        child
                    );

                }

            }
        );


        treeNodes.delete(
            current.id
        );

    }


    removeChildren(node);


    if (
        treeSelectedNodeId === id
    ) {

        treeSelectedNodeId = null;

    }


    renderTree();

}


// ==================================================
// 重新编号
// ==================================================
//
// 删除后：
//
// 第二卷
// 第一卷
//
// 如果删除第一卷：
//
// 第二卷
//
// 此时第二卷应该重新成为第一卷。
// ==================================================

function renumberChildren(parent) {

    const children =
        getTreeChildren(parent);


    /*
     * children 顺序：
     *
     * [第二, 第一]
     *
     * 实际编号应该根据从右到左的位置计算。
     *
     * 最右边 = 第一
     * 左边 = 第二
     */

    const count =
        children.length;


    children.forEach(
        (child, index) => {

            if (
                child.type === "preface"
            ) {

                child.title = "序章";

                return;

            }


            const number =
                count - index;


            child.title =
                `第${number}${getTreeTypeName(child.type)}`;

        }
    );


    children.forEach(
        child => {

            renumberChildren(
                child
            );

        }
    );

}


// ==================================================
// 计算树布局
// ==================================================

function calculateTreeLayout() {

    const positions =
        new Map();


    let cursorX = 0;


    // ----------------------------------------------
    // 递归布局
    // ----------------------------------------------

    function layoutNode(
        node,
        depth
    ) {

        const children =
            getTreeChildren(node);


        // ------------------------------------------
        // 叶节点
        // ------------------------------------------

        if (
            children.length === 0
        ) {

            const x =
                cursorX;


            cursorX +=
                TREE_CONFIG.nodeWidth +
                TREE_CONFIG.horizontalGap;


            const y =
                depth *
                TREE_CONFIG.verticalGap;


            positions.set(
                node.id,
                {
                    x,
                    y
                }
            );


            return x;

        }


        // ------------------------------------------
        // 子节点
        // ------------------------------------------

        const childPositions =
            [];


        children.forEach(
            child => {

                const childX =
                    layoutNode(
                        child,
                        depth + 1
                    );


                childPositions.push(
                    childX
                );

            }
        );


        // ------------------------------------------
        // 父节点位于子节点整体中央
        // ------------------------------------------

        const minX =
            Math.min(
                ...childPositions
            );


        const maxX =
            Math.max(
                ...childPositions
            );


        const x =
            (minX + maxX) / 2;


        const y =
            depth *
            TREE_CONFIG.verticalGap;


        positions.set(
            node.id,
            {
                x,
                y
            }
        );


        return x;

    }


    layoutNode(
        treeRoot,
        0
    );


    return positions;

}


// ==================================================
// 调整 X
// ==================================================

function normalizeTreePositions(
    positions
) {

    let minX =
        Infinity;


    positions.forEach(
        position => {

            minX =
                Math.min(
                    minX,
                    position.x
                );

        }
    );


    if (
        !Number.isFinite(minX)
    ) {

        return;

    }


    const offset =
        TREE_CONFIG.padding -
        minX;


    positions.forEach(
        position => {

            position.x +=
                offset;

        }
    );

}


// ==================================================
// 设置画布尺寸
// ==================================================

function resizeTreeCanvas(
    positions
) {

    let maxX = 0;

    let maxY = 0;


    positions.forEach(
        position => {

            maxX =
                Math.max(
                    maxX,
                    position.x
                );


            maxY =
                Math.max(
                    maxY,
                    position.y
                );

        }
    );


    const width =
        maxX +
        TREE_CONFIG.padding +
        TREE_CONFIG.nodeWidth;


    const height =
        maxY +
        TREE_CONFIG.padding +
        TREE_CONFIG.nodeHeight;


    treeContainer.style.width =
        `${width}px`;


    treeContainer.style.height =
        `${height}px`;


    connectionSvg.setAttribute(
        "width",
        width
    );


    connectionSvg.setAttribute(
        "height",
        height
    );


    connectionSvg.setAttribute(
        "viewBox",
        `0 0 ${width} ${height}`
    );

}


// ==================================================
// 创建节点 DOM
// ==================================================

function createTreeElement(
    node,
    position
) {

    const element =
        document.createElement("div");


    element.className =
        "book-node";


    element.dataset.id =
        node.id;


    element.dataset.type =
        node.type;


    element.textContent =
        node.title;


    element.style.width =
        `${TREE_CONFIG.nodeWidth}px`;


    element.style.height =
        `${TREE_CONFIG.nodeHeight}px`;


    element.style.left =
        `${position.x - TREE_CONFIG.nodeWidth / 2}px`;


    element.style.top =
        `${position.y - TREE_CONFIG.nodeHeight / 2}px`;


    // ----------------------------------------------
    // 点击
    // ----------------------------------------------

    element.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();


            selectTreeNode(
                node.id
            );

        }
    );


    // ----------------------------------------------
    // 右键删除
    // ----------------------------------------------

    element.addEventListener(
        "contextmenu",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            if (
                node.type !== "book"
            ) {

                deleteTreeNode(
                    node.id
                );

            }

        }
    );


    if (
        treeSelectedNodeId === node.id
    ) {

        element.classList.add(
            "selected"
        );

    }


    return element;

}


// ==================================================
// 选择节点
// ==================================================

function selectTreeNode(id) {

    treeSelectedNodeId =
        id;


    document
        .querySelectorAll(
            ".book-node"
        )
        .forEach(
            element => {

                element.classList.remove(
                    "selected"
                );

            }
        );


    const element =
        document.querySelector(
            `.book-node[data-id="${id}"]`
        );


    if (element) {

        element.classList.add(
            "selected"
        );

    }

}


// ==================================================
// 清除选择
// ==================================================

function clearTreeSelection() {

    treeSelectedNodeId =
        null;


    document
        .querySelectorAll(
            ".book-node"
        )
        .forEach(
            element => {

                element.classList.remove(
                    "selected"
                );

            }
        );

}


// ==================================================
// 创建 SVG 连接线
// ==================================================

function createTreeConnection(
    parentPosition,
    childPosition
) {

    /*
     * ==================================================
     * 最重要的规则
     * ==================================================
     *
     * x1 / y1：
     *
     * 父节点的【正中央】
     *
     *
     * x2 / y2：
     *
     * 子节点的【正中央】
     *
     *
     * 所以：
     *
     * 中央 ●
     *      │
     *      │
     *      ● 中央
     *
     * ==================================================
     */


    const line =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );


    line.setAttribute(
        "x1",
        parentPosition.x
    );


    line.setAttribute(
        "y1",
        parentPosition.y
    );


    line.setAttribute(
        "x2",
        childPosition.x
    );


    line.setAttribute(
        "y2",
        childPosition.y
    );


    line.classList.add(
        "tree-connection"
    );


    line.setAttribute(
        "vector-effect",
        "non-scaling-stroke"
    );


    connectionSvg.appendChild(
        line
    );

}


// ==================================================
// 绘制全部连接线
// ==================================================

function renderTreeConnections(
    positions
) {

    connectionSvg.innerHTML =
        "";


    treeNodes.forEach(
        parent => {

            const parentPosition =
                positions.get(
                    parent.id
                );


            if (!parentPosition) {

                return;

            }


            const children =
                getTreeChildren(
                    parent
                );


            children.forEach(
                child => {

                    const childPosition =
                        positions.get(
                            child.id
                        );


                    if (!childPosition) {

                        return;

                    }


                    createTreeConnection(
                        parentPosition,
                        childPosition
                    );

                }
            );

        }
    );

}


// ==================================================
// 渲染
// ==================================================

function renderTree() {

    // ----------------------------------------------
    // 删除旧 DOM
    // ----------------------------------------------

    treeContainer.innerHTML =
        "";


    connectionSvg.innerHTML =
        "";


    // ----------------------------------------------
    // 重新编号
    // ----------------------------------------------

    renumberChildren(
        treeRoot
    );


    // ----------------------------------------------
    // 计算布局
    // ----------------------------------------------

    const positions =
        calculateTreeLayout();


    // ----------------------------------------------
    // 整体向右移动
    // ----------------------------------------------

    normalizeTreePositions(
        positions
    );


    // ----------------------------------------------
    // 设置尺寸
    // ----------------------------------------------

    resizeTreeCanvas(
        positions
    );


    // ----------------------------------------------
    // 创建节点
    // ----------------------------------------------

    treeNodes.forEach(
        node => {

            const position =
                positions.get(
                    node.id
                );


            if (!position) {

                return;

            }


            const element =
                createTreeElement(
                    node,
                    position
                );


            treeContainer.appendChild(
                element
            );

        }
    );


    // ----------------------------------------------
    // 最后画线
    // ----------------------------------------------

    renderTreeConnections(
        positions
    );

}


// ==================================================
// 操作栏
// ==================================================

if (treeActionBar) {

    treeActionBar
        .querySelectorAll(
            "button[data-action]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.stopPropagation();


                        const type =
                            button.dataset.action;


                        addTreeNode(
                            type
                        );

                    }
                );

            }
        );

}


// ==================================================
// 点击空白
// ==================================================

if (treeWorkspace) {

    treeWorkspace.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                    treeWorkspace ||
                event.target ===
                    treeContainer
            ) {

                clearTreeSelection();

            }

        }
    );

}


// ==================================================
// 书名
// ==================================================

if (treeBookTitle) {

    treeBookTitle.textContent =
        treeRoot.title;


    treeBookTitle.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();


            selectTreeNode(
                treeRoot.id
            );

        }
    );

}


// ==================================================
// 初始化
// ==================================================

renderTree();


// ==================================================
// 对外接口
// ==================================================
//
// 以后其他 JS 如果需要调用：
//
// addTreeNode("volume");
// addTreeNode("part");
// addTreeNode("chapter");
// addTreeNode("preface");
//
// deleteTreeNode(id);
//
// renderTree();
//
// ==================================================

window.TreeSystem = {

    root: treeRoot,

    nodes: treeNodes,

    add: addTreeNode,

    delete: deleteTreeNode,

    render: renderTree,

    select: selectTreeNode,

    clearSelection: clearTreeSelection

};
