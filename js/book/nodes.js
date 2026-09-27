// ==============================
// 全书页面：节点
// ==============================


// ==================================================
// 创建 ID
// ==================================================

function createId() {

    return (
        Date.now().toString(36) +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 10)
    );
}


// ==================================================
// 创建节点
//
// 序 / 章
// → 正文
//
// 卷 / 篇
// → 大纲
// ==================================================

function createNode(
    type,
    title,
    number
) {

    return {

        id:
            createId(),

        type:
            type,

        title:
            title || "",

        number:
            Number.isFinite(
                Number(number)
            )
                ? Number(number)
                : 0,

        // 正文
        content:
            "",

        // 大纲
        outline:
            "",

        children:
            [],

        collapsed:
            false
    };
}


// ==================================================
// 获取节点颜色
// ==================================================

function getNodeClass(type) {

    switch (type) {

        case NODE_TYPES.PREFACE:

            return NODE_COLOR_TYPES.PREFACE;


        case NODE_TYPES.VOLUME:

            return NODE_COLOR_TYPES.VOLUME;


        case NODE_TYPES.PART:

            return NODE_COLOR_TYPES.PART;


        case NODE_TYPES.CHAPTER:

            return NODE_COLOR_TYPES.CHAPTER;


        default:

            return "";
    }
}


// ==================================================
// 获取节点名称
// ==================================================

function getNodeTypeName(type) {

    return NODE_TYPE_NAMES[type] || "";
}


// ==================================================
// 是否是正文节点
//
// 只有序、章进入正文。
// ==================================================

function isWritingNode(node) {

    if (!node) {
        return false;
    }

    return (
        node.type === NODE_TYPES.PREFACE ||
        node.type === NODE_TYPES.CHAPTER
    );
}


// ==================================================
// 是否是大纲节点
//
// 卷、篇只负责大纲。
// ==================================================

function isOutlineNode(node) {

    if (!node) {
        return false;
    }

    return (
        node.type === NODE_TYPES.VOLUME ||
        node.type === NODE_TYPES.PART
    );
}


// ==================================================
// 进入正文
// ==================================================

function openChapterEditor(nodeId) {

    if (!currentBook) {
        return;
    }


    const node =
        getNodeById(nodeId);


    if (!node) {
        return;
    }


    // 安全检查
    //
    // 卷、篇不能进入正文。

    if (!isWritingNode(node)) {
        return;
    }


    // 保存当前章节 ID

    localStorage.setItem(
        "currentChapterId",
        String(node.id)
    );


    // 保存当前小说

    saveBook();


    // 进入正文编辑器

    window.location.href =
        "chapter.html";
}


// ==================================================
// 创建节点 DOM
// ==================================================

function createNodeElement(node) {

    if (!node) {
        return null;
    }


    const wrapper =
        document.createElement("div");


    wrapper.className =
        "tree-node";


    wrapper.dataset.nodeId =
        node.id;


    const box =
        document.createElement("div");


    box.className =
        "node-box";


    const nodeClass =
        getNodeClass(
            node.type
        );


    if (nodeClass) {

        box.classList.add(
            nodeClass
        );
    }


    box.dataset.nodeId =
        node.id;


    box.dataset.nodeType =
        node.type;


    // ==================================================
    // iPhone / 触摸点击
    //
    // 使用 pointerup 作为统一入口。
    //
    // 不再同时在这里绑定 click。
    // ==================================================

    box.addEventListener(
        "pointerup",
        function(event) {

            event.stopPropagation();


            // 防止拖动书名等操作误触

            if (
                event.pointerType ===
                "touch"
            ) {

                event.preventDefault();
            }


            // ------------------------------
            // 序 / 章
            //
            // 进入正文
            // ------------------------------

            if (
                isWritingNode(node)
            ) {

                openChapterEditor(
                    node.id
                );

                return;
            }


            // ------------------------------
            // 卷 / 篇
            //
            // 留在全书页面
            // ------------------------------

            selectNode(
                node.id
            );
        }
    );


    // ==================================================
    // 鼠标
    //
    // pointerup 已经可以处理鼠标，
    // 不需要再绑定 click。
    // ==================================================

    // 节点文字
    // ==================================================

    const title =
        document.createElement("div");


    title.className =
        "node-title";


    title.textContent =
        node.title ||
        getNodeTypeName(
            node.type
        );


    box.appendChild(
        title
    );


    // ==================================================
    // 折叠状态
    // ==================================================

    if (
        node.collapsed === true
    ) {

        box.classList.add(
            "is-collapsed"
        );
    }


    wrapper.appendChild(
        box
    );


    return wrapper;
}
