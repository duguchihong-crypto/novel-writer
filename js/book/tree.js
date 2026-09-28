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
// 父节点中心
//      │
//      ├────────┐
//      │        │
// 子节点中心  子节点中心
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
// 参数
// ==================================================

const CONFIG = {

    // 普通节点宽度
    nodeWidth: 150,

    // 普通节点高度
    nodeHeight: 50,

    // 节点之间的水平距离
    horizontalGap: 80,

    // 上下层之间的距离
    verticalGap: 140,

    // 画布边距
    padding: 300

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
            .substring(2, 9)
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

    if (node.type === "book") {

        return "volume";

    }


    if (node.type === "volume") {

        return "part";

    }


    if (node.type === "part") {

        return "chapter";

    }


    return null;

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
     * 新节点永远放到数组最前面。
     *
     * 第一次：
     *
     * [第一卷]
     *
     *
     * 第二次：
     *
     * [第二卷, 第一卷]
     *
     *
     * 布局时数组从左到右，
     * 因此：
     *
     * 第二卷在左
     * 第一卷在右
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
                `第${number}${getTypeName(child.type)}`;

        }
    );


    children.forEach(
        child => {

            renumber(child);

        }
    );

}


// ==================================================
// 添加节点
// ==================================================

function addNode(type) {

    let parent;


    // 如果有选中的节点
    if (selectedNodeId) {

        parent =
            getNode(
                selectedNodeId
            );

    }


    // 没有选中节点时默认书名
    if (!parent) {

        parent = root;

    }


    // ==================================================
    // 添加序章
    // ==================================================

    if (type === "preface") {

        // 序只能挂在书名下面
        if (
            parent.type !== "book"
        ) {

            return;

        }


        // 序只能有一个
        const exists =
            getChildren(parent)
                .some(
                    child =>
                        child.type === "preface"
                );


        if (exists) {

            return;

        }


        createNode(
            parent,
            "preface"
        );


        render();

        return;

    }


    // ==================================================
    // 普通层级
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


    // 从父节点移除
    if (parent) {

        parent.children =
            parent.children.filter(
                childId =>
                    childId !== id
            );

    }


    // 删除整个子树
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
// 计算布局
// ==================================================

function calculateLayout() {

    const positions =
        new Map();


    let cursorX = 0;


    // ==================================================
    // 递归布局
    // ==================================================

    function layout(
        node,
        depth
    ) {

        const children =
            getChildren(node);


        // ------------------------------------------
        // 没有孩子
        // ------------------------------------------

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
                    x: x,
                    y: y
                }
            );


            cursorX +=
                CONFIG.nodeWidth +
                CONFIG.horizontalGap;


            return x;

        }


        // ------------------------------------------
        // 有孩子
        // ------------------------------------------

        const childPositions = [];


        children.forEach(
            child => {

                const childX =
                    layout(
                        child,
                        depth + 1
                    );


                childPositions.push(
                    childX
                );

            }
        );


        const minX =
            Math.min(
                ...childPositions
            );


        const maxX =
            Math.max(
                ...childPositions
            );


        /*
         * 父节点永远位于
         * 所有孩子中心的正中间。
         */

        const x =
            (minX + maxX) / 2;


        const y =
            depth *
            CONFIG.verticalGap;


        positions.set(
            node.id,
            {
                x: x,
                y: y
            }
        );


        return x;

    }


    layout(
        root,
        0
    );


    // ==================================================
    // 整体移动
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

            position.x +=
                offset;

        }
    );


    return positions;

}


// ==================================================
// 调整画布尺寸
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
            3000,
            maxX +
            CONFIG.padding +
            CONFIG.nodeWidth
        );


    const height =
        Math.max(
            3000,
            maxY +
            CONFIG.padding +
            CONFIG.nodeHeight
        );


    tree.style.width =
        `${width}px`;


    tree.style.height =
        `${height}px`;


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


    // 类型 class
    element.classList.add(
        `node-${node.type}`
    );


    element.dataset.id =
        node.id;


    element.dataset.type =
        node.type;


    element.textContent =
        node.title;


    // ------------------------------------------
    // 节点位置
    // ------------------------------------------

    element.style.left =
        `${position.x - CONFIG.nodeWidth / 2}px`;


    element.style.top =
        `${position.y - CONFIG.nodeHeight / 2}px`;


    element.style.width =
        `${CONFIG.nodeWidth}px`;


    element.style.height =
        `${CONFIG.nodeHeight}px`;


    // ------------------------------------------
    // 点击选择
    // ------------------------------------------

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


    // ------------------------------------------
    // 长按 / 右键删除
    // ------------------------------------------

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
// 创建树状连接线
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


    /*
     * ==================================================
     *
     * 父节点中心
     *
     *             ●
     *             │
     *             │
     *       ┌─────┴─────┐
     *       │           │
     *       │           │
     *       ●           ●
     *
     * ==================================================
     *
     * 起点：
     * 父节点中心
     *
     * 终点：
     * 子节点中心
     *
     * ==================================================
     */


    const x1 =
        parentPosition.x;


    const y1 =
        parentPosition.y;


    const x2 =
        childPosition.x;


    const y2 =
        childPosition.y;


    /*
     * 中间水平线的 Y
     */

    const middleY =
        y1 +
        (y2 - y1) / 2;


    /*
     * SVG路径：
     *
     * M = 移动到父节点中心
     *
     * V = 垂直向下
     *
     * H = 水平移动
     *
     * V = 垂直向下到子节点中心
     */

    const d =
        `
        M ${x1} ${y1}
        V ${middleY}
        H ${x2}
        V ${y2}
        `;


    path.setAttribute(
        "d",
        d
    );


    path.classList.add(
        "tree-line"
    );


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

    // ------------------------------------------
    // 重新编号
    // ------------------------------------------

    renumber(root);


    // ------------------------------------------
    // 清空
    // ------------------------------------------

    tree.innerHTML = "";

    svg.innerHTML = "";


    // ------------------------------------------
    // 计算位置
    // ------------------------------------------

    const positions =
        calculateLayout();


    // ------------------------------------------
    // 调整画布
    // ------------------------------------------

    resizeCanvas(
        positions
    );


    // ------------------------------------------
    // 先画线
    // ------------------------------------------

    drawConnections(
        positions
    );


    // ------------------------------------------
    // 再画节点
    // ------------------------------------------

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

    /*
     * 你的 CSS 默认：
     *
     * display: none;
     *
     * 所以必须主动显示。
     */

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
// 点击空白区域
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
