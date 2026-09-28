// ==================================================
// tree.js
// 全书树状结构
//
// 规则：
// 上 → 下
// 右 → 左
// 第一项永远在最右边
// 每个普通节点最多两个直接子节点
//
// 连接线：
// 父节点中心 → 子节点中心
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

const canvas =
    document.getElementById("canvas");


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

    // 普通节点尺寸
    nodeWidth: 150,
    nodeHeight: 50,

    // 书名节点尺寸
    bookWidth: 180,
    bookHeight: 58,

    // 同级节点之间的间距
    horizontalGap: 100,

    // 上下层级之间的距离
    verticalGap: 160,

    // 工作区四周安全距离
    padding: 300,

    // 工作区最小尺寸
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
// 当前选中节点
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
// 获取普通子节点
//
// 「序」单独处理
// 不占用卷/篇/章的两个名额
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

    return (
        getChildren(node)
            .find(
                child =>
                    child.type === "preface"
            ) ||
        null
    );

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

        case "preface":
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
// 获取节点实际尺寸
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

    // ------------------------------------------
    // 序
    // ------------------------------------------

    if (type === "preface") {

        // 序只能挂在书名下面
        if (
            parent.type !== "book"
        ) {

            return null;

        }


        // 序只能有一个
        if (
            getPreface(parent)
        ) {

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


        /*
         * 序也放入 children。
         *
         * 但布局和普通子节点
         * 会单独处理。
         */

        parent.children.unshift(
            node.id
        );


        return node;

    }


    // ------------------------------------------
    // 普通节点最多两个
    // ------------------------------------------

    const normalChildren =
        getNormalChildren(parent);


    if (
        normalChildren.length >= 2
    ) {

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


    /*
     * 新节点放在数组最前面。
     *
     * 第一次：
     *
     * [第一卷]
     *
     * 第二次：
     *
     * [第二卷, 第一卷]
     *
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


    // ------------------------------------------
    // 普通节点
    // ------------------------------------------

    const normalChildren =
        children.filter(
            child =>
                child.type !== "preface"
        );


    /*
     * children 顺序：
     *
     * [第二卷, 第一卷]
     *
     * index 0 → 第二卷
     * index 1 → 第一卷
     */

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


    // ------------------------------------------
    // 序
    // ------------------------------------------

    children.forEach(
        child => {

            if (
                child.type === "preface"
            ) {

                child.title =
                    "序章";

            }


            renumber(child);

        }
    );

}


// ==================================================
// 判断节点是否允许添加指定类型
// ==================================================

function canAdd(parent, type) {

    if (!parent) {

        return false;

    }


    // ------------------------------------------
    // 序
    // ------------------------------------------

    if (type === "preface") {

        return (
            parent.type === "book" &&
            !getPreface(parent)
        );

    }


    // ------------------------------------------
    // 普通节点
    // ------------------------------------------

    const childType =
        getChildType(parent);


    if (
        !childType
    ) {

        return false;

    }


    if (
        type !== childType
    ) {

        return false;

    }


    return (
        getNormalChildren(parent).length < 2
    );

}


// ==================================================
// 添加节点
// ==================================================

function addNode(type) {

    let parent = null;


    // ------------------------------------------
    // 有选中的节点
    // ------------------------------------------

    if (selectedNodeId) {

        parent =
            getNode(
                selectedNodeId
            );

    }


    // ------------------------------------------
    // 没有选中
    // 默认挂在书名下面
    // ------------------------------------------

    if (!parent) {

        parent = root;

    }


    // ------------------------------------------
    // 检查
    // ------------------------------------------

    if (
        !canAdd(
            parent,
            type
        )
    ) {

        return;

    }


    // ------------------------------------------
    // 创建
    // ------------------------------------------

    const node =
        createNode(
            parent,
            type
        );


    if (!node) {

        return;

    }


    // 添加完成后取消选择
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


    // ------------------------------------------
    // 从父节点移除
    // ------------------------------------------

    if (parent) {

        parent.children =
            parent.children.filter(
                childId =>
                    childId !== id
            );

    }


    // ------------------------------------------
    // 删除整个子树
    // ------------------------------------------

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


    // ==================================================
    // 递归布局
    // ==================================================

    function layout(
        node,
        depth
    ) {

        /*
         * 序不参与普通二叉树布局。
         *
         * 也就是说：
         *
         * 书名
         * ├── 序
         * ├── 第二卷
         * └── 第一卷
         *
         * 这里的“卷”仍然是普通子节点。
         */

        const normalChildren =
            getNormalChildren(node);


        // ==========================================
        // 没有普通子节点
        // ==========================================

        if (
            normalChildren.length === 0
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


        // ==========================================
        // 有普通子节点
        // ==========================================

        const childX = [];


        normalChildren.forEach(
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
            Math.min(
                ...childX
            );


        const maxX =
            Math.max(
                ...childX
            );


        /*
         * 父节点严格位于
         * 子节点中心。
         */

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


    // ------------------------------------------
    // 从根开始
    // ------------------------------------------

    layout(
        root,
        0
    );


    // ==================================================
    // 找到树的边界
    // ==================================================

    let minX =
        Infinity;

    let maxX =
        -Infinity;


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

        }
    );


    if (
        !Number.isFinite(minX) ||
        !Number.isFinite(maxX)
    ) {

        return positions;

    }


    // ==================================================
    // 计算最终工作区宽度
    // ==================================================

    const treeWidth =
        maxX -
        minX;


    const workspaceWidth =
        Math.max(
            CONFIG.minWidth,
            treeWidth +
            CONFIG.padding * 2
        );


    // ==================================================
    // 让整棵树位于工作区中央
    // ==================================================

    const workspaceCenterX =
        workspaceWidth / 2;


    const treeCenterX =
        (
            minX +
            maxX
        ) / 2;


    const offset =
        workspaceCenterX -
        treeCenterX;


    positions.forEach(
        position => {

            position.x +=
                offset;

            position.y +=
                CONFIG.padding;

        }
    );


    return {

        positions: positions,

        width: workspaceWidth

    };

}


// ==================================================
// 调整工作区
// ==================================================

function resizeCanvas(
    layoutResult
) {

    const positions =
        layoutResult.positions;


    const width =
        layoutResult.width;


    let maxY = 0;


    positions.forEach(
        position => {

            maxY =
                Math.max(
                    maxY,
                    position.y
                );

        }
    );


    const height =
        Math.max(
            CONFIG.minHeight,
            maxY +
            CONFIG.padding
        );


    // ------------------------------------------
    // workspace
    // ------------------------------------------

    workspace.style.width =
        `${width}px`;

    workspace.style.height =
        `${height}px`;


    // ------------------------------------------
    // tree
    // ------------------------------------------

    tree.style.width =
        `${width}px`;

    tree.style.height =
        `${height}px`;


    // ------------------------------------------
    // SVG
    // ------------------------------------------

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


    // ------------------------------------------
    // 获取尺寸
    // ------------------------------------------

    const size =
        getNodeSize(node);


    // ------------------------------------------
    // 位置
    // ------------------------------------------

    element.style.left =
        `${position.x - size.width / 2}px`;


    element.style.top =
        `${position.y - size.height / 2}px`;


    element.style.width =
        `${size.width}px`;


    element.style.height =
        `${size.height}px`;


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

    const path =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );


    // ------------------------------------------
    // 父节点中心
    // ------------------------------------------

    const x1 =
        parentPosition.x;


    const y1 =
        parentPosition.y;


    // ------------------------------------------
    // 子节点中心
    // ------------------------------------------

    const x2 =
        childPosition.x;


    const y2 =
        childPosition.y;


    // ------------------------------------------
    // 中间水平线
    // ------------------------------------------

    const middleY =
        y1 +
        (y2 - y1) / 2;


    // ------------------------------------------
    // 正交连接
    // ------------------------------------------

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


            /*
             * 序仍然属于父节点 children，
             * 但这里正常连接。
             */

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
// 自动滚动到树中心
// ==================================================

function centerViewport() {

    if (!canvas) {

        return;

    }


    const workspaceWidth =
        workspace.offsetWidth;


    const workspaceHeight =
        workspace.offsetHeight;


    const viewportWidth =
        canvas.clientWidth;


    const viewportHeight =
        canvas.clientHeight;


    if (
        workspaceWidth <= viewportWidth &&
        workspaceHeight <= viewportHeight
    ) {

        return;

    }


    /*
     * 根节点在工作区水平中央。
     *
     * 因此直接把 viewport
     * 滚动到工作区中心。
     */

    const targetLeft =
        Math.max(
            0,
            (
                workspaceWidth -
                viewportWidth
            ) / 2
        );


    const targetTop =
        Math.max(
            0,
            (
                CONFIG.padding -
                viewportHeight / 2
            )
        );


    canvas.scrollLeft =
        targetLeft;


    canvas.scrollTop =
        targetTop;

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
    // 计算布局
    // ------------------------------------------

    const layoutResult =
        calculateLayout();


    const positions =
        layoutResult.positions;


    // ------------------------------------------
    // 调整工作区
    // ------------------------------------------

    resizeCanvas(
        layoutResult
    );


    // ------------------------------------------
    // 先画连接线
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


            // 恢复当前选择
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


    // ------------------------------------------
    // 第一次渲染后居中
    // ------------------------------------------

    requestAnimationFrame(
        function() {

            centerViewport();

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

            selectedNodeId =
                null;


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
