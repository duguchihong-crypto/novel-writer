// ==================================================
// tree.js
// 全书树状结构
//
// 规则：
// 上 → 下
// 右 → 左
// 第一项在最右边
// 每个节点最多两个子节点
// 连接线：父节点中心 → 子节点中心
// ==================================================

const tree = document.getElementById("tree");
const svg = document.getElementById("connections");
const workspace = document.getElementById("workspace");
const actionBar = document.getElementById("actionBar");

// ==================================================
// 参数
// ==================================================

const CONFIG = {
    nodeWidth: 150,
    nodeHeight: 50,

    horizontalGap: 80,
    verticalGap: 140,

    padding: 300
};


// ==================================================
// 数据
// ==================================================

const nodes = new Map();

const root = {
    id: "book-root",
    type: "book",
    title: "新书",
    parentId: null,
    children: []
};

nodes.set(root.id, root);


// 当前选择
let selectedNodeId = null;


// ==================================================
// ID
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
// 获取孩子
// ==================================================

function getChildren(node) {

    return node.children
        .map(id => nodes.get(id))
        .filter(Boolean);

}


// ==================================================
// 获取父节点
// ==================================================

function getParent(node) {

    if (!node.parentId) {
        return null;
    }

    return nodes.get(node.parentId) || null;
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
// 获取编号
// ==================================================

function getNumber(parent) {

    /*
     * children 的排列方式：
     *
     * [第二, 第一]
     *
     * 所以数组最后一个才是第一。
     */

    return parent.children.length + 1;
}


// ==================================================
// 创建节点
// ==================================================

function createNode(parent, type) {

    // 一个节点最多两个孩子
    if (parent.children.length >= 2) {
        return null;
    }


    const number = getNumber(parent);

    let title;


    if (type === "preface") {

        title = "序章";

    } else {

        title =
            `第${number}${getTypeName(type)}`;

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
     * 因此视觉上：
     *
     * 第二卷       第一卷
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

            if (child.type === "preface") {
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
// 添加
// ==================================================

function addNode(type) {

    let parent =
        selectedNodeId
            ? getNode(selectedNodeId)
            : root;


    if (!parent) {
        parent = root;
    }


    // 序章
    if (type === "preface") {

        if (parent.type !== "book") {
            return;
        }


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


    const childType =
        getChildType(parent);


    if (!childType) {
        return;
    }


    if (type !== childType) {
        return;
    }


    if (parent.children.length >= 2) {
        return;
    }


    createNode(
        parent,
        type
    );


    render();
}


// ==================================================
// 删除
// ==================================================

function deleteNode(id) {

    const node =
        getNode(id);


    if (!node) {
        return;
    }


    // 书名不能删除
    if (node.type === "book") {
        return;
    }


    const parent =
        getParent(node);


    if (parent) {

        parent.children =
            parent.children.filter(
                childId =>
                    childId !== id
            );

    }


    function remove(nodeToRemove) {

        nodeToRemove.children.forEach(
            childId => {

                const child =
                    getNode(childId);

                if (child) {
                    remove(child);
                }

            }
        );


        nodes.delete(
            nodeToRemove.id
        );

    }


    remove(node);


    selectedNodeId = null;


    render();
}


// ==================================================
// 布局
// ==================================================

function calculateLayout() {

    const positions = new Map();

    let cursorX = 0;


    function layout(node, depth) {

        const children =
            getChildren(node);


        // ------------------------------------------
        // 没有孩子
        // ------------------------------------------

        if (children.length === 0) {

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


        // ------------------------------------------
        // 有孩子
        // ------------------------------------------

        const childX = [];


        children.forEach(
            child => {

                childX.push(
                    layout(
                        child,
                        depth + 1
                    )
                );

            }
        );


        const min =
            Math.min(...childX);


        const max =
            Math.max(...childX);


        const x =
            (min + max) / 2;


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


    layout(root, 0);


    // ------------------------------------------
    // 整体向右移动
    // ------------------------------------------

    let minX = Infinity;


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


    return positions;
}


// ==================================================
// 设置尺寸
// ==================================================

function resizeCanvas(positions) {

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
        CONFIG.padding +
        CONFIG.nodeWidth;


    const height =
        maxY +
        CONFIG.padding +
        CONFIG.nodeHeight;


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


    element.dataset.id =
        node.id;


    element.dataset.type =
        node.type;


    element.textContent =
        node.title;


    element.style.left =
        `${position.x - CONFIG.nodeWidth / 2}px`;


    element.style.top =
        `${position.y - CONFIG.nodeHeight / 2}px`;


    element.style.width =
        `${CONFIG.nodeWidth}px`;


    element.style.height =
        `${CONFIG.nodeHeight}px`;


    // ------------------------------------------
    // 选择
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
    // 右键删除
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
// 创建连接线
// ==================================================

function drawLine(
    parentPosition,
    childPosition
) {

    const line =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );


    /*
     * ==================================================
     * 核心：
     *
     * 父节点中心
     *       ●
     *       │
     *       │
     *       ●
     * 子节点中心
     *
     * x1 / y1 = 父节点中心
     * x2 / y2 = 子节点中心
     * ==================================================
     */


    line.setAttribute(
        "x1",
        String(parentPosition.x)
    );


    line.setAttribute(
        "y1",
        String(parentPosition.y)
    );


    line.setAttribute(
        "x2",
        String(childPosition.x)
    );


    line.setAttribute(
        "y2",
        String(childPosition.y)
    );


    line.classList.add(
        "tree-line"
    );


    svg.appendChild(
        line
    );
}


// ==================================================
// 绘制所有线
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


            getChildren(parent)
                .forEach(
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

    // 重新编号
    renumber(root);


    // 清空
    tree.innerHTML = "";
    svg.innerHTML = "";


    // 计算位置
    const positions =
        calculateLayout();


    // 设置尺寸
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
