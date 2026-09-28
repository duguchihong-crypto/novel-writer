// ==================================================
// tree.js
// 全书树状结构
//
// 规则：
// 上 → 下
// 右 → 左
// 第一项永远在最右边
// 每个节点最多两个直接子节点
//
// 连接线：
// 必须从父节点中心
// 连接到子节点中心
//
// ==================================================


// ==================================================
// DOM
// ==================================================

const tree =
    document.getElementById("tree");

const svg =
    document.getElementById("connections");

const workspace =
    document.getElementById("workspace");

const actionBar =
    document.getElementById("actionBar");


// ==================================================
// 检查 DOM
// ==================================================

if (!tree || !svg || !workspace) {

    console.error(
        "tree.js：缺少 #tree、#connections 或 #workspace"
    );

    throw new Error(
        "TreeSystem DOM 初始化失败"
    );

}


// ==================================================
// 参数
// ==================================================

const CONFIG = {

    // 普通节点宽度
    nodeWidth: 150,

    // 普通节点高度
    nodeHeight: 50,

    // 节点横向间距
    horizontalGap: 100,

    // 层级纵向间距
    verticalGap: 160,

    // 工作区边距
    padding: 300,

    // 最小工作区
    minWidth: 3000,

    minHeight: 3000

};


// ==================================================
// 数据
// ==================================================

const nodes =
    new Map();


const root = {

    id: "book-root",

    type: "book",

    title: "新书",

    parentId: null,

    children: []

};


nodes.set(
    root.id,
    root
);


// ==================================================
// 当前选中的节点
// ==================================================

let selectedNodeId = null;


// ==================================================
// 创建 ID
// ==================================================

function createId() {

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

function getNode(id) {

    return nodes.get(id);

}


// ==================================================
// 获取子节点
// ==================================================

function getChildren(node) {

    return node.children

        .map(
            id => nodes.get(id)
        )

        .filter(Boolean);

}


// ==================================================
// 获取父节点
// ==================================================

function getParent(node) {

    if (!node.parentId) {

        return null;

    }

    return (
        nodes.get(node.parentId) ||
        null
    );

}


// ==================================================
// 获取下一层类型
// ==================================================

function getChildType(node) {

    switch (node.type) {

        case "book":
            return "volume";

        case "volume":
            return "part";

        case "part":
            return "chapter";

        case "chapter":
            return null;

        default:
            return null;

    }

}


// ==================================================
// 类型名称
// ==================================================

function getTypeName(type) {

    switch (type) {

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

function createNode(parent, type) {

    // 最多两个直接子节点
    if (
        parent.children.length >= 2
    ) {

        return null;

    }


    let title;


    if (type === "preface") {

        title = "序章";

    } else {

        title =
            `第${parent.children.length + 1}${getTypeName(type)}`;

    }


    const node = {

        id: createId(),

        type: type,

        title: title,

        parentId: parent.id,

        children: []

    };


    nodes.set(
        node.id,
        node
    );


    /*
     * 新节点放到数组最前面。
     *
     * 第一次：
     *
     * [第一卷]
     *
     * 第二次：
     *
     * [第二卷, 第一卷]
     *
     * 布局从左到右，
     * 所以第一卷永远在最右。
     */

    parent.children.unshift(
        node.id
    );


    return node;

}


// ==================================================
// 重新编号
// ==================================================

function renumber(parent) {

    const children =
        getChildren(parent);

    const normalChildren =
        children.filter(
            child =>
                child.type !== "preface"
        );


    const count =
        normalChildren.length;


    normalChildren.forEach(
        (child, index) => {

            const number =
                count - index;


            child.title =
                `第${number}${getTypeName(child.type)}`;

        }
    );


    children.forEach(
        child => {

            if (
                child.type === "preface"
            ) {

                child.title = "序章";

            }

            renumber(child);

        }
    );

}


// ==================================================
// 添加节点
// ==================================================

function addNode(type) {

    let parent = null;


    // ------------------------------------------
    // 有选中节点
    // ------------------------------------------

    if (selectedNodeId) {

        parent =
            getNode(
                selectedNodeId
            );

    }


    // ------------------------------------------
    // 没有选中节点
    // 默认书名
    // ------------------------------------------

    if (!parent) {

        parent = root;

    }


    // ==================================================
    // 序章
    // ==================================================

    if (type === "preface") {

        // 只能挂在书名
        if (
            parent.type !== "book"
        ) {

            return;

        }


        const exists =
            getChildren(parent)
                .some(
                    child =>
                        child.type === "preface"
                );


        // 已经存在
        if (exists) {

            return;

        }


        /*
         * 序章也必须有自己的位置。
         */

        createNode(
            parent,
            "preface"
        );


        selectedNodeId = null;

        render();

        return;

    }


    // ==================================================
    // 普通节点
    // ==================================================

    const childType =
        getChildType(parent);


    // 没有下一层
    if (!childType) {

        return;

    }


    // 类型不匹配
    if (
        type !== childType
    ) {

        return;

    }


    // 最多两个
    if (
        parent.children.length >= 2
    ) {

        return;

    }


    createNode(
        parent,
        type
    );


    selectedNodeId = null;


    render();

}


// ==================================================
// 删除节点
// ==================================================

function deleteNode(id) {

    const node =
        getNode(id);


    if (!node) {

        return;

    }


    // 书名不能删除
    if (
        node.type === "book"
    ) {

        return;

    }


    const parent =
        getParent(node);


    // 从父节点中删除
    if (parent) {

        parent.children =
            parent.children.filter(
                childId =>
                    childId !== id
            );

    }


    // 删除整棵子树
    function removeSubtree(
        currentNode
    ) {

        currentNode.children.forEach(
            childId => {

                const child =
                    getNode(childId);


                if (child) {

                    removeSubtree(
                        child
                    );

                }

            }
        );


        nodes.delete(
            currentNode.id
        );

    }


    removeSubtree(node);


    selectedNodeId = null;


    render();

}


// ==================================================
// 计算树布局
// ==================================================

function calculateLayout() {

    const positions =
        new Map();


    let cursorX = 0;


    // ------------------------------------------
    // 递归
    // ------------------------------------------

    function layout(
        node,
        depth
    ) {

        const children =
            getChildren(node);


        // ==========================================
        // 叶子节点
        // ==========================================

        if (
            children.length === 0
        ) {

            const x =
                cursorX;


            const y =
                depth *
                CONFIG.verticalGap;


            positions.set(
                node.id,
                {
                    x,
                    y
                }
            );


            cursorX +=
                CONFIG.nodeWidth +
                CONFIG.horizontalGap;


            return x;

        }


        // ==========================================
        // 有子节点
        // ==========================================

        const childX = [];


        children.forEach(
            child => {

                const x =
                    layout(
                        child,
                        depth + 1
                    );


                childX.push(x);

            }
        );


        const minX =
            Math.min(...childX);


        const maxX =
            Math.max(...childX);


        // 父节点正好位于子节点中心
        const x =
            (minX + maxX) / 2;


        const y =
            depth *
            CONFIG.verticalGap;


        positions.set(
            node.id,
            {
                x,
                y
            }
        );


        return x;

    }


    layout(
        root,
        0
    );


    // ==================================================
    // 整体向右移动
    // ==================================================

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


    const offset =
        CONFIG.padding -
        minX;


    positions.forEach(
        position => {

            position.x += offset;

        }
    );


    // ==================================================
    // 整体向下移动
    // ==================================================

    positions.forEach(
        position => {

            position.y +=
                CONFIG.padding;

        }
    );


    return positions;

}


// ==================================================
// 调整工作区
// ==================================================

function resizeCanvas(
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
        Math.max(
            CONFIG.minWidth,
            maxX +
            CONFIG.padding
        );


    const height =
        Math.max(
            CONFIG.minHeight,
            maxY +
            CONFIG.padding
        );


    // ==========================================
    // 工作区
    // ==========================================

    workspace.style.width =
        `${width}px`;


    workspace.style.height =
        `${height}px`;


    // ==========================================
    // 树
    // ==========================================

    tree.style.width =
        `${width}px`;

    tree.style.height =
        `${height}px`;


    // ==========================================
    // SVG
    // ==========================================

    svg.style.width =
        `${width}px`;

    svg.style.height =
        `${height}px`;


    svg.setAttribute(
        "width",
        width
    );


    svg.setAttribute(
        "height",
        height
    );


    svg.setAttribute(
        "viewBox",
        `0 0 ${width} ${height}`
    );

}


// ==================================================
// 创建节点 DOM
// ==================================================

function createNodeElement(
    node,
    position
) {

    const element =
        document.createElement("div");


    element.className =
        "tree-node";


    element.classList.add(
        `node-${node.type}`
    );


    element.dataset.id =
        node.id;


    element.dataset.type =
        node.type;


    element.textContent =
        node.title;


    // ==========================================
    // 位置
    // ==========================================

    element.style.left =
        `${position.x - CONFIG.nodeWidth / 2}px`;


    element.style.top =
        `${position.y - CONFIG.nodeHeight / 2}px`;


    element.style.width =
        `${CONFIG.nodeWidth}px`;


    element.style.height =
        `${CONFIG.nodeHeight}px`;


    // ==========================================
    // 点击选择
    // ==========================================

    element.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();


            selectedNodeId =
                node.id;


            document
                .querySelectorAll(
                    ".tree-node"
                )
                .forEach(
                    item => {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


            element.classList.add(
                "selected"
            );

        }
    );


    // ==========================================
    // 右键删除
    // ==========================================

    element.addEventListener(
        "contextmenu",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            deleteNode(
                node.id
            );

        }
    );


    return element;

}


// ==================================================
// 创建连接线
// ==================================================

function drawLine(
    parentPosition,
    childPosition
) {

    const path =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );


    // ==========================================
    // 父节点中心
    // ==========================================

    const x1 =
        parentPosition.x;


    const y1 =
        parentPosition.y;


    // ==========================================
    // 子节点中心
    // ==========================================

    const x2 =
        childPosition.x;


    const y2 =
        childPosition.y;


    // ==========================================
    // 中间水平线
    // ==========================================

    const middleY =
        y1 +
        (y2 - y1) / 2;


    /*
     * 从父节点中心开始：
     *
     * M x1 y1
     *
     * 垂直向下：
     *
     * V middleY
     *
     * 水平：
     *
     * H x2
     *
     * 垂直向下：
     *
     * V y2
     */

    const d =
        [
            `M ${x1} ${y1}`,
            `V ${middleY}`,
            `H ${x2}`,
            `V ${y2}`
        ].join(" ");


    path.setAttribute(
        "d",
        d
    );


    path.setAttribute(
        "fill",
        "none"
    );


    path.setAttribute(
        "stroke",
        "#222"
    );


    path.setAttribute(
        "stroke-width",
        "4"
    );


    path.setAttribute(
        "stroke-linecap",
        "round"
    );


    path.setAttribute(
        "stroke-linejoin",
        "round"
    );


    path.style.pointerEvents =
        "none";


    svg.appendChild(
        path
    );

}


// ==================================================
// 绘制全部连接线
// ==================================================

function drawConnections(
    positions
) {

    // 清空 SVG
    svg.innerHTML = "";


    nodes.forEach(
        parent => {

            const parentPosition =
                positions.get(
                    parent.id
                );


            if (!parentPosition) {

                return;

            }


            const children =
                getChildren(parent);


            children.forEach(
                child => {

                    const childPosition =
                        positions.get(
                            child.id
                        );


                    if (!childPosition) {

                        return;

                    }


                    drawLine(
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

function render() {

    // ==========================================
    // 重新编号
    // ==========================================

    renumber(root);


    // ==========================================
    // 清空
    // ==========================================

    tree.innerHTML = "";

    svg.innerHTML = "";


    // ==========================================
    // 计算位置
    // ==========================================

    const positions =
        calculateLayout();


    // ==========================================
    // 调整工作区
    // ==========================================

    resizeCanvas(
        positions
    );


    // ==========================================
    // 先画线
    // ==========================================

    drawConnections(
        positions
    );


    // ==========================================
    // 再画节点
    // ==========================================

    nodes.forEach(
        node => {

            const position =
                positions.get(
                    node.id
                );


            if (!position) {

                return;

            }


            const element =
                createNodeElement(
                    node,
                    position
                );


            if (
                selectedNodeId ===
                node.id
            ) {

                element.classList.add(
                    "selected"
                );

            }


            tree.appendChild(
                element
            );

        }
    );

}


// ==================================================
// 操作栏
// ==================================================

if (actionBar) {

    actionBar.classList.add(
        "show"
    );


    actionBar
        .querySelectorAll(
            "button[data-action]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.stopPropagation();


                        addNode(
                            button.dataset.action
                        );

                    }
                );

            }
        );

}


// ==================================================
// 点击空白
// ==================================================

workspace.addEventListener(
    "click",
    function(event) {

        if (
            event.target === workspace ||
            event.target === tree
        ) {

            selectedNodeId = null;


            document
                .querySelectorAll(
                    ".tree-node"
                )
                .forEach(
                    node => {

                        node.classList.remove(
                            "selected"
                        );

                    }
                );

        }

    }
);


// ==================================================
// 初始化
// ==================================================

render();


// ==================================================
// 对外接口
// ==================================================

window.TreeSystem = {

    add: addNode,

    delete: deleteNode,

    render: render,

    root: root,

    nodes: nodes

};
