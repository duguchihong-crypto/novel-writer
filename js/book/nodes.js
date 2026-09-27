// ==============================
// 全书页面：节点
// ==============================


// ==============================
// 创建唯一 ID
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
// 创建结构节点数据
// ==============================

function createNode(
    type,
    title,
    number
) {

    return {

        id: createId(),

        type: type,

        title: title || "",

        number:
            Number.isFinite(Number(number))
                ? Number(number)
                : 0,

        children: [],

        collapsed: false
    };
}


// ==============================
// 获取节点 CSS 类型
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
// 获取节点类型名称
// ==============================

function getNodeTypeName(type) {

    return (
        NODE_TYPE_NAMES[type] ||
        ""
    );
}


// ==============================
// 创建操作按钮
// ==============================

function createActionButton(
    text,
    className,
    callback
) {

    const button =
        document.createElement("button");


    button.type = "button";


    if (className) {

        button.className =
            className;

    } else {

        button.className =
            "node-action-button";
    }


    button.textContent =
        text;


    button.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();

            if (
                typeof callback ===
                "function"
            ) {

                callback();

            }

        }
    );


    return button;
}


// ==============================
// 创建节点 DOM
// ==============================

function createNodeElement(node) {

    if (!node) {
        return null;
    }


    // ==============================
    // 最外层
    // ==============================

    const wrapper =
        document.createElement("div");


    wrapper.className =
        "tree-node";


    wrapper.dataset.nodeId =
        node.id;


    // ==============================
    // 节点框
    // ==============================

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
        getNodeTypeName(node.type);


    box.appendChild(
        title
    );


    // ==============================
    // 折叠状态
    // ==============================

    if (node.collapsed === true) {

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

            selectNode(
                node.id
            );

        }
    );


    wrapper.appendChild(
        box
    );


    // ==============================
    // 操作区域
    // ==============================

    const actions =
        document.createElement("div");


    actions.className =
        "node-actions";


    actions.style.display =
        "none";


    actions.dataset.nodeId =
        node.id;


    // ==============================
    // 删除按钮
    // ==============================

    const deleteButton =
        createActionButton(
            "删除",
            "node-action-delete",
            function() {

                deleteNode(
                    node.id
                );

            }
        );


    actions.appendChild(
        deleteButton
    );


    // ==============================
    // 卷
    // ==============================

    if (
        node.type ===
        NODE_TYPES.VOLUME
    ) {

        const sameButton =
            createActionButton(
                "＋同级",
                "node-action-button",
                function() {

                    addSameLevel(
                        node.id
                    );

                }
            );


        const partButton =
            createActionButton(
                "＋篇",
                "node-action-button",
                function() {

                    addChild(
                        node.id,
                        NODE_TYPES.PART
                    );

                }
            );


        const chapterButton =
            createActionButton(
                "＋章",
                "node-action-button",
                function() {

                    addChild(
                        node.id,
                        NODE_TYPES.CHAPTER
                    );

                }
            );


        actions.appendChild(
            sameButton
        );

        actions.appendChild(
            partButton
        );

        actions.appendChild(
            chapterButton
        );
    }


    // ==============================
    // 篇
    // ==============================

    if (
        node.type ===
        NODE_TYPES.PART
    ) {

        const sameButton =
            createActionButton(
                "＋同级",
                "node-action-button",
                function() {

                    addSameLevel(
                        node.id
                    );

                }
            );


        const chapterButton =
            createActionButton(
                "＋章",
                "node-action-button",
                function() {

                    addChild(
                        node.id,
                        NODE_TYPES.CHAPTER
                    );

                }
            );


        actions.appendChild(
            sameButton
        );

        actions.appendChild(
            chapterButton
        );
    }


    // ==============================
    // 章
    // ==============================

    if (
        node.type ===
        NODE_TYPES.CHAPTER
    ) {

        // 目前只有删除
    }


    // ==============================
    // 序
    // ==============================

    if (
        node.type ===
        NODE_TYPES.PREFACE
    ) {

        // 目前只有删除
    }


    wrapper.appendChild(
        actions
    );


    return wrapper;
}
