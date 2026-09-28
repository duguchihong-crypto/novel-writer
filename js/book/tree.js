// ==================================================
// tree.js
// 全书树状结构
// ==================================================


// ==================================================
// DOM
// ==================================================

const tree = document.getElementById("tree");
const svg = document.getElementById("connections");
const workspace = document.getElementById("workspace");
const actionBar = document.getElementById("actionBar");
const canvas = document.getElementById("canvas");


// ==================================================
// DOM检查
// ==================================================

if (!tree || !svg || !workspace) {

    throw new Error(
        "TreeSystem：缺少 #tree、#connections 或 #workspace"
    );

}


// ==================================================
// 配置
// ==================================================

const CONFIG = {

    nodeWidth: 150,
    nodeHeight: 50,

    bookWidth: 180,
    bookHeight: 58,

    horizontalGap: 100,
    verticalGap: 160,

    padding: 300,

    minWidth: 3000,
    minHeight: 3000

};


// ==================================================
// SVG
// ==================================================

const SVG_NS =
    "http://www.w3.org/2000/svg";


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


nodes.set(
    root.id,
    root
);


// ==================================================
// 当前选择
// ==================================================

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
            .slice(2, 9)
    );

}


// ==================================================
// 获取节点
// ==================================================

function getNode(id) {

    return nodes.get(id) || null;

}


// ==================================================
// 获取子节点
// ==================================================

function getChildren(node) {

    if (!node) {
        return [];
    }

    return node.children
        .map(id => nodes.get(id))
        .filter(Boolean);

}


// ==================================================
// 获取普通子节点
// ==================================================

function getNormalChildren(node) {

    return getChildren(node)
        .filter(
            child =>
                child.type !== "preface"
        );

}


// ==================================================
// 获取序
// ==================================================

function getPreface(node) {

    return getChildren(node)
        .find(
            child =>
                child.type === "preface"
        ) || null;

}


// ==================================================
// 获取父节点
// ==================================================

function getParent(node) {

    if (!node || !node.parentId) {
        return null;
    }

    return nodes.get(node.parentId) || null;

}


// ==================================================
// 获取允许的下一层
// ==================================================

function getChildType(node) {

    switch (node.type) {

        case "book":
            return "volume";

        case "volume":
            return "part";

        case "part":
            return "chapter";

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
// 节点尺寸
// ==================================================

function getNodeSize(node) {

    if (node.type === "book") {

        return {

            width: CONFIG.bookWidth,

            height: CONFIG.bookHeight

        };

    }

    return {

        width: CONFIG.nodeWidth,

        height: CONFIG.nodeHeight

    };

}


// ==================================================
// 创建节点
// ==================================================

function createNode(parent, type) {

    if (!parent) {
        return null;
    }


    // ==================================================
    // 序
    // ==================================================

    if (type === "preface") {

        if (parent.type !== "book") {
            return null;
        }

        if (getPreface(parent)) {
            return null;
        }

        const node = {

            id: createId(),

            type: "preface",

            title: "序章",

            parentId: parent.id,

            children: []

        };

        nodes.set(
            node.id,
            node
        );

        parent.children.unshift(
            node.id
        );

        return node;

    }


    // ==================================================
    // 普通节点
    // ==================================================

    const children =
        getNormalChildren(parent);


    if (children.length >= 2) {
        return null;
    }


    const expectedType =
        getChildType(parent);


    if (expectedType !== type) {
        return null;
    }


    const node = {

        id: createId(),

        type: type,

        title: "",

        parentId: parent.id,

        children: []

    };


    nodes.set(
        node.id,
        node
    );


    // 新节点放左边
    parent.children.unshift(
        node.id
    );


    return node;

}


// ==================================================
// 编号
// ==================================================

function renumber(parent) {

    if (!parent) {
        return;
    }


    const children =
        getChildren(parent);


    const normal =
        children.filter(
            child =>
                child.type !== "preface"
        );


    const count =
        normal.length;


    normal.forEach(
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
// 能否添加
// ==================================================

function canAdd(parent, type) {

    if (!parent) {
        return false;
    }


    if (type === "preface") {

        return (
            parent.type === "book" &&
            !getPreface(parent)
        );

    }


    const expected =
        getChildType(parent);


    if (!expected) {
        return false;
    }


    if (expected !== type) {
        return false;
    }


    return (
        getNormalChildren(parent).length < 2
    );

}


// ==================================================
// 添加
// ==================================================

function addNode(type) {

    let parent = null;


    if (selectedNodeId) {

        parent =
            getNode(
                selectedNodeId
            );

    }


    if (!parent) {
        parent = root;
    }


    if (!canAdd(parent, type)) {
        return;
    }


    const node =
        createNode(
            parent,
            type
        );


    if (!node) {
        return;
    }


    selectedNodeId = null;

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

        const children =
            getChildren(nodeToRemove);


        children.forEach(
            child =>
                remove(child)
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
// 计算布局
// ==================================================

function calculateLayout() {

    const positions = new Map();

    let cursorX = 0;


    function layout(node, depth) {

        const children =
            getChildren(node);


        // ------------------------------------------
        // 没有子节点
        // ------------------------------------------

        if (children.length === 0) {

            const x = cursorX;

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
        // 有子节点
        // ------------------------------------------

        const childPositions = [];


        children.forEach(
            child => {

                const x =
                    layout(
                        child,
                        depth + 1
                    );

                childPositions.push(x);

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


        const x =
            (
                minX +
                maxX
            ) / 2;


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


    layout(root, 0);


    // ==================================================
    // 计算边界
    // ==================================================

    let minX = Infinity;
    let maxX = -Infinity;
    let maxY = 0;


    positions.forEach(
        position => {

            minX =
                Math.min(
                    minX,
                    position.x
                );

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


    const treeWidth =
        maxX - minX;


    const width =
        Math.max(
            CONFIG.minWidth,
            treeWidth +
            CONFIG.padding * 2
        );


    const center =
        width / 2;


    const treeCenter =
        (
            minX +
            maxX
        ) / 2;


    const offset =
        center -
        treeCenter;


    positions.forEach(
        position => {

            position.x += offset;

            position.y +=
                CONFIG.padding;

        }
    );


    const height =
        Math.max(
            CONFIG.minHeight,
            maxY +
            CONFIG.padding * 2
        );


    return {

        positions,

        width,

        height

    };

}


// ==================================================
// 调整工作区
// ==================================================

function resizeWorkspace(
    layout
) {

    const width =
        layout.width;

    const height =
        layout.height;


    workspace.style.width =
        `${width}px`;

    workspace.style.height =
        `${height}px`;


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
// 设置节点基础颜色
// ==================================================

function applyNodeStyle(
    element,
    node
) {

    // 强制基础尺寸
    const size =
        getNodeSize(node);


    element.style.position =
        "absolute";

    element.style.boxSizing =
        "border-box";

    element.style.width =
        `${size.width}px`;

    element.style.height =
        `${size.height}px`;

    element.style.display =
        "flex";

    element.style.alignItems =
        "center";

    element.style.justifyContent =
        "center";

    element.style.padding =
        "6px 10px";

    element.style.borderRadius =
        node.type === "book"
            ? "14px"
            : "12px";

    element.style.fontFamily =
        "-apple-system, BlinkMacSystemFont, " +
        "\"Segoe UI\", \"Microsoft YaHei\", sans-serif";

    element.style.textAlign =
        "center";

    element.style.wordBreak =
        "break-word";

    element.style.overflowWrap =
        "anywhere";

    element.style.userSelect =
        "none";

    element.style.cursor =
        "pointer";

    element.style.zIndex =
        "10";


    // ==================================================
    // 书名
    // ==================================================

    if (node.type === "book") {

        element.style.background =
            "#ff4d4d";

        element.style.border =
            "3px solid #d90000";

        element.style.color =
            "#ffffff";

        element.style.fontSize =
            "22px";

        element.style.fontWeight =
            "bold";

        element.style.boxShadow =
            "0 4px 12px rgba(0,0,0,0.18)";

        return;

    }


    // ==================================================
    // 序
    // ==================================================

    if (node.type === "preface") {

        element.style.background =
            "#d9f7f5";

        element.style.border =
            "2px solid #9adbd7";

        element.style.color =
            "#087f78";

    }


    // ==================================================
    // 卷
    // ==================================================

    else if (node.type === "volume") {

        element.style.background =
            "#fff4c7";

        element.style.border =
            "2px solid #e5ca63";

        element.style.color =
            "#9a7800";

    }


    // ==================================================
    // 篇
    // ==================================================

    else if (node.type === "part") {

        element.style.background =
            "#ffffff";

        element.style.border =
            "2px solid #d6d6d6";

        element.style.color =
            "#555555";

    }


    // ==================================================
    // 章
    // ==================================================

    else if (node.type === "chapter") {

        element.style.background =
            "#eeeeee";

        element.style.border =
            "2px solid #bdbdbd";

        element.style.color =
            "#222222";

    }


    element.style.fontSize =
        "16px";

    element.style.fontWeight =
        "500";

    element.style.boxShadow =
        "0 3px 8px rgba(0,0,0,0.12)";

}


// ==================================================
// 创建节点DOM
// ==================================================

function createNodeElement(
    node,
    position
) {

    const element =
        document.createElement(
            "div"
        );


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


    // ==================================================
    // 强制样式
    // ==================================================

    applyNodeStyle(
        element,
        node
    );


    // ==================================================
    // 位置
    // ==================================================

    const size =
        getNodeSize(node);


    element.style.left =
        `${
            position.x -
            size.width / 2
        }px`;


    element.style.top =
        `${
            position.y -
            size.height / 2
        }px`;


    // ==================================================
    // 选中
    // ==================================================

    if (
        selectedNodeId === node.id
    ) {

        element.style.boxShadow =
            node.type === "book"

                ? "0 0 0 3px rgba(224,173,0,0.55), 0 4px 12px rgba(0,0,0,0.18)"

                : "0 0 0 3px rgba(224,173,0,0.55), 0 3px 8px rgba(0,0,0,0.12)";

    }


    // ==================================================
    // 删除按钮
    // ==================================================

    if (node.type !== "book") {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";

        button.className =
            "node-delete";

        button.textContent =
            "×";


        // 强制删除按钮样式
        button.style.position =
            "absolute";

        button.style.top =
            "-9px";

        button.style.right =
            "-9px";

        button.style.width =
            "24px";

        button.style.height =
            "24px";

        button.style.padding =
            "0";

        button.style.margin =
            "0";

        button.style.border =
            "none";

        button.style.borderRadius =
            "50%";

        button.style.background =
            "#111111";

        button.style.color =
            "#ffffff";

        button.style.fontSize =
            "14px";

        button.style.lineHeight =
            "24px";

        button.style.display =
            "flex";

        button.style.alignItems =
            "center";

        button.style.justifyContent =
            "center";

        button.style.zIndex =
            "50";

        button.style.cursor =
            "pointer";


        button.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();

                deleteNode(
                    node.id
                );

            }
        );


        element.appendChild(
            button
        );

    }


    // ==================================================
    // 点击节点
    // ==================================================

    element.addEventListener(
        "click",
        function(event) {

            if (
                event.target.closest(
                    ".node-delete"
                )
            ) {

                return;

            }


            event.stopPropagation();


            selectedNodeId =
                node.id;


            render();

        }
    );


    // ==================================================
    // 右键删除
    // ==================================================

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
// 绘制连接线
// ==================================================

function drawLine(
    parent,
    child
) {

    const x1 =
        parent.x;

    const y1 =
        parent.y;

    const x2 =
        child.x;

    const y2 =
        child.y;


    // 父子之间的垂直中点
    const middleY =
        y1 +
        (
            y2 - y1
        ) / 2;


    const path =
        document.createElementNS(
            SVG_NS,
            "path"
        );


    path.setAttribute(
        "class",
        "tree-line"
    );


    path.setAttribute(
        "d",
        [
            `M ${x1} ${y1}`,
            `V ${middleY}`,
            `H ${x2}`,
            `V ${y2}`
        ].join(" ")
    );


    path.setAttribute(
        "fill",
        "none"
    );


    path.setAttribute(
        "stroke",
        "#222222"
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
// 绘制所有连接线
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
// 自动居中
// ==================================================

function centerViewport() {

    if (!canvas) {
        return;
    }


    const width =
        workspace.offsetWidth;

    const height =
        workspace.offsetHeight;


    const viewportWidth =
        canvas.clientWidth;

    const viewportHeight =
        canvas.clientHeight;


    canvas.scrollLeft =
        Math.max(
            0,
            (
                width -
                viewportWidth
            ) / 2
        );


    canvas.scrollTop =
        Math.max(
            0,
            CONFIG.padding -
            40
        );

}


// ==================================================
// 渲染
// ==================================================

function render() {

    // ------------------------------------------
    // 编号
    // ------------------------------------------

    renumber(root);


    // ------------------------------------------
    // 清空
    // ------------------------------------------

    tree.innerHTML = "";

    svg.innerHTML = "";


    // ------------------------------------------
    // 布局
    // ------------------------------------------

    const layout =
        calculateLayout();


    // ------------------------------------------
    // 工作区
    // ------------------------------------------

    resizeWorkspace(
        layout
    );


    // ------------------------------------------
    // 连接线
    // ------------------------------------------

    drawConnections(
        layout.positions
    );


    // ------------------------------------------
    // 节点
    // ------------------------------------------

    nodes.forEach(
        node => {

            const position =
                layout.positions.get(
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


            tree.appendChild(
                element
            );

        }
    );


    // ------------------------------------------
    // 调整视口
    // ------------------------------------------

    requestAnimationFrame(
        () => {

            centerViewport();

        }
    );

}


// ==================================================
// 底部操作栏
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

                        event.preventDefault();

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

            selectedNodeId =
                null;


            render();

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

    add:
        addNode,

    delete:
        deleteNode,

    render:
        render,

    root:
        root,

    nodes:
        nodes

};
