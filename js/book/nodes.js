// ==================================================
// 节点创建
// ==================================================

function createNode(type, title, number) {

    return {
        id:
            "node_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 9),

        type: type,

        title: title || "",

        number: number || 1,

        outline: "",

        content: "",

        collapsed: false,

        children: []
    };
}


// ==================================================
// 创建节点 DOM
// ==================================================

function createNodeElement(node) {

    if (!node) {
        return null;
    }


    const element =
        document.createElement("div");


    // ------------------------------
    // 基础 class
    // ------------------------------

    element.className =
        "tree-node";


    const nodeBox =
        document.createElement("div");


    nodeBox.className =
        "node-box";


    // ------------------------------
    // 节点颜色
    // ------------------------------

    if (
        NODE_COLOR_TYPES &&
        NODE_COLOR_TYPES[node.type]
    ) {

        nodeBox.classList.add(
            NODE_COLOR_TYPES[node.type]
        );
    }


    // ------------------------------
    // 节点标题
    // ------------------------------

    const title =
        document.createElement("div");


    title.className =
        "node-title";


    title.textContent =
        node.title ||
        NODE_TYPE_NAMES[node.type] ||
        "未命名";


    nodeBox.appendChild(title);


    element.appendChild(nodeBox);


    // ------------------------------
    // 节点 ID
    // ------------------------------

    element.dataset.nodeId =
        node.id;


    nodeBox.dataset.nodeId =
        node.id;


    // ==================================================
    // 点击节点
    // ==================================================

    nodeBox.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            handleNodeClick(
                node.id
            );
        }
    );


    // ==================================================
    // 触摸节点
    // ==================================================

    nodeBox.addEventListener(
        "touchend",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            handleNodeClick(
                node.id
            );
        },
        {
            passive: false
        }
    );


    // ==================================================
    // 双击
    //
    // 暂时不进入编辑器。
    // 后面可以做重命名。
    // ==================================================

    nodeBox.addEventListener(
        "dblclick",
        function(event) {

            event.preventDefault();

            event.stopPropagation();
        }
    );


    return element;
}


// ==================================================
// 节点点击处理
// ==================================================

function handleNodeClick(nodeId) {

    const node =
        getNodeById(nodeId);


    if (!node) {

        console.warn(
            "找不到节点：",
            nodeId
        );

        return;
    }


    // ==================================================
    // 序
    //
    // 序是真正的正文节点
    // → 进入 chapter.html
    // ==================================================

    if (
        node.type ===
        NODE_TYPES.PREFACE
    ) {

        openChapterEditor(
            node.id
        );

        return;
    }


    // ==================================================
    // 章
    //
    // 章是真正的正文节点
    // → 进入 chapter.html
    // ==================================================

    if (
        node.type ===
        NODE_TYPES.CHAPTER
    ) {

        openChapterEditor(
            node.id
        );

        return;
    }


    // ==================================================
    // 卷
    //
    // 只是大纲
    // → 不进入正文
    // → 选择卷
    // → 显示底部操作栏
    // ==================================================

    if (
        node.type ===
        NODE_TYPES.VOLUME
    ) {

        selectNode(
            node.id
        );

        return;
    }


    // ==================================================
    // 篇
    //
    // 只是大纲
    // → 不进入正文
    // → 选择篇
    // → 显示底部操作栏
    // ==================================================

    if (
        node.type ===
        NODE_TYPES.PART
    ) {

        selectNode(
            node.id
        );

        return;
    }
}


// ==================================================
// 打开正文编辑器
// ==================================================

function openChapterEditor(nodeId) {

    const node =
        getNodeById(nodeId);


    if (!node) {

        console.warn(
            "无法打开正文：找不到节点",
            nodeId
        );

        return;
    }


    // ------------------------------
    // 保存当前选择
    // ------------------------------

    localStorage.setItem(
        "currentChapterId",
        String(node.id)
    );


    // ------------------------------
    // 确保正文字段存在
    // ------------------------------

    if (
        typeof node.content !==
        "string"
    ) {

        node.content = "";
    }


    // ------------------------------
    // 序 / 章
    // 都可以拥有正文
    // ------------------------------

    if (
        typeof node.outline !==
        "string"
    ) {

        node.outline = "";
    }


    // ------------------------------
    // 先保存小说
    // ------------------------------

    saveBook();


    // ------------------------------
    // 进入正文编辑器
    // ------------------------------

    window.location.href =
        "./chapter.html";
}
