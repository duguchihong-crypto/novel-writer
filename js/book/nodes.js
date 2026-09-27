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

function createNode(type, title, number) {
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

function getNodeTypeName(type) {
    return NODE_TYPE_NAMES[type] || "";
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
        box.classList.add(nodeClass);
    }

    box.dataset.nodeId =
        node.id;

    box.dataset.nodeType =
        node.type;


    // 节点文字

    const title =
        document.createElement("div");

    title.className =
        "node-title";

    title.textContent =
        node.title ||
        getNodeTypeName(node.type);

    box.appendChild(title);


    // 折叠状态

    if (node.collapsed === true) {

        box.classList.add(
            "is-collapsed"
        );
    }


    // 点击节点

    box.addEventListener(
        "click",
        function(event) {

            event.preventDefault();
            event.stopPropagation();

            selectNode(node.id);
        }
    );


    // 手机触摸

    box.addEventListener(
        "pointerup",
        function(event) {

            if (
                event.pointerType === "touch"
            ) {

                event.preventDefault();
                event.stopPropagation();

                selectNode(node.id);
            }
        }
    );


    wrapper.appendChild(box);


    // 注意：
    // 这里故意不再创建右侧 node-actions。
    // 所有操作统一移动到底部固定操作栏。


    return wrapper;
}
