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
// 序 / 章 = 正文
// 卷 / 篇 = 大纲
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

        // 正文内容
        content:
            "",

        // 大纲内容
        outline:
            "",

        children:
            [],

        collapsed:
            false
    };
}


// ==================================================
// 节点颜色
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
// 节点名称
// ==================================================

function getNodeTypeName(type) {

    return NODE_TYPE_NAMES[type] || "";
}


// ==================================================
// 是否为正文节点
//
// 只有：
// 序
// 章
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
// 是否为大纲节点
//
// 卷
// 篇
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
// 进入正文编辑器
// ==================================================

function openChapterEditor(nodeId) {

    if (!currentBook) {

        console.warn(
            "没有当前小说"
        );

        return;
    }


    const node =
        getNodeById(nodeId);


    if (!node) {

        console.warn(
            "找不到章节节点：",
            nodeId
        );

        return;
    }


    // 只有序、章可以进入正文

    if (!isWritingNode(node)) {

        return;
    }


    // 保存当前章节

    localStorage.setItem(
        "currentChapterId",
        String(node.id)
    );


    // 保存当前小说

    saveBook();


    // 进入正文

    window.location.href =
        "./chapter.html";
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
    // 节点标题
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


    // ==================================================
    // 节点点击
    //
    // 统一使用 click。
    //
    // 序 / 章：
    // → chapter.html
    //
    // 卷 / 篇：
    // → 留在全书页面
    // → 显示底部操作栏
    // ==================================================

    box.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            // ------------------------------
            // 序 / 章
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
            // ------------------------------

            if (
                isOutlineNode(node)
            ) {

                selectNode(
                    node.id
                );

                return;
            }

        }
    );


    wrapper.appendChild(
        box
    );


    return wrapper;
}
