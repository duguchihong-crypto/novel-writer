// ==============================
// 全书页面：节点
// ==============================


function createId() {

    return (
        Date.now().toString(36) +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 10)
    );
}


// ==============================
// 创建节点
//
// 序 / 章：正文节点
// 卷 / 篇：大纲节点
//
// content 用来保存正文。
// 卷、篇以后也可以增加 outline 保存大纲。
// ==============================

function createNode(type, title, number) {

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


// ==============================
// 节点颜色
// ==============================

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


// ==============================
// 节点类型名称
// ==============================

function getNodeTypeName(type) {

    return NODE_TYPE_NAMES[type] || "";
}


// ==============================
// 判断是否为正文节点
//
// 只有：
// 序
// 章
//
// 可以进入正文编辑器。
// ==============================

function isWritingNode(node) {

    if (!node) {
        return false;
    }

    return (
        node.type === NODE_TYPES.PREFACE ||
        node.type === NODE_TYPES.CHAPTER
    );
}


// ==============================
// 判断是否为大纲节点
//
// 卷
// 篇
// ==============================

function isOutlineNode(node) {

    if (!node) {
        return false;
    }

    return (
        node.type === NODE_TYPES.VOLUME ||
        node.type === NODE_TYPES.PART
    );
}


// ==============================
// 进入正文编辑器
// ==============================

function openChapterEditor(nodeId) {

    if (!currentBook) {
        return;
    }


    const node =
        getNodeById(nodeId);


    if (!node) {
        return;
    }


    // 只有序和章可以进入正文

    if (!isWritingNode(node)) {
        return;
    }


    // 保存当前章节

    localStorage.setItem(
        "currentChapterId",
        node.id
    );


    // 进入正文页面

    window.location.href =
        "chapter.html";
}


// ==============================
// 创建节点
// ==============================

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
        getNodeClass(node.type);


    if (nodeClass) {

        box.classList.add(
            nodeClass
        );
    }


    box.dataset.nodeId =
        node.id;

    box.dataset.nodeType =
        node.type;


    // ==============================
    // 节点文字
    // ==============================

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


    // ==============================
    // 折叠状态
    // ==============================

    if (
        node.collapsed === true
    ) {

        box.classList.add(
            "is-collapsed"
        );
    }


    // ==============================
    // 点击节点
    // ==============================

    box.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            // ------------------------------
            // 序 / 章
            //
            // 直接进入正文
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
            // 仍然留在全书页面
            // 用底部操作栏处理
            // ------------------------------

            selectNode(
                node.id
            );
        }
    );


    // ==============================
    // 手机触摸
    // ==============================

    box.addEventListener(
        "pointerup",
        function(event) {

            if (
                event.pointerType !==
                "touch"
            ) {

                return;
            }


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

            selectNode(
                node.id
            );
        }
    );


    wrapper.appendChild(
        box
    );


    // 注意：
    //
    // 这里故意不创建右侧 node-actions。
    //
    // 卷 / 篇的操作：
    // 删除
    // ＋同级
    // ＋篇
    // ＋章
    //
    // 统一由底部操作栏处理。


    return wrapper;
}
