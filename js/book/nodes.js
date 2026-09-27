// ==============================
// 全书页面：节点
// ==============================

function createId() {
    return Date.now().toString() + Math.random().toString(16).slice(2);
}


// 创建一个结构节点
function createNode(type, title, number) {

    return {
        id: createId(),

        type: type,

        title: title || "",

        number: number || 0,

        children: [],

        collapsed: false
    };
}


// 获取节点 CSS 类型
function getNodeClass(type) {

    switch (type) {

        case "preface":
            return "node-preface";

        case "volume":
            return "node-volume";

        case "part":
            return "node-part";

        case "chapter":
            return "node-chapter";

        default:
            return "";
    }
}


// 创建操作按钮
function createActionButton(text, className, callback) {

    const button = document.createElement("button");

    button.type = "button";

    button.className = className;

    button.textContent = text;

    button.addEventListener("click", function(event) {

        event.stopPropagation();

        callback();

    });

    return button;
}


// 创建节点 DOM
function createNodeElement(node) {

    const wrapper = document.createElement("div");

    wrapper.className = "tree-node";

    wrapper.dataset.nodeId = node.id;


    // 节点框
    const box = document.createElement("div");

    box.className =
        "node-box " +
        getNodeClass(node.type);

    box.dataset.nodeId = node.id;


    // 节点文字
    const title = document.createElement("div");

    title.className = "node-title";

    title.textContent = node.title;

    box.appendChild(title);


    // 点击节点
    box.addEventListener("click", function(event) {

        event.stopPropagation();

        selectNode(node.id);

    });


    wrapper.appendChild(box);


    // 节点操作按钮
    const actions = document.createElement("div");

    actions.className = "node-actions";

    actions.style.display = "none";


    // 删除
    const deleteButton = createActionButton(
        "删除",
        "node-action-delete",
        function() {
            deleteNode(node.id);
        }
    );

    actions.appendChild(deleteButton);


    // 卷
    if (node.type === "volume") {

        const sameButton = createActionButton(
            "＋同级",
            "",
            function() {
                addSameLevel(node.id);
            }
        );

        const partButton = createActionButton(
            "＋篇",
            "",
            function() {
                addChild(node.id, "part");
            }
        );

        const chapterButton = createActionButton(
            "＋章",
            "",
            function() {
                addChild(node.id, "chapter");
            }
        );

        actions.appendChild(sameButton);
        actions.appendChild(partButton);
        actions.appendChild(chapterButton);
    }


    // 篇
    if (node.type === "part") {

        const sameButton = createActionButton(
            "＋同级",
            "",
            function() {
                addSameLevel(node.id);
            }
        );

        const chapterButton = createActionButton(
            "＋章",
            "",
            function() {
                addChild(node.id, "chapter");
            }
        );

        actions.appendChild(sameButton);
        actions.appendChild(chapterButton);
    }


    // 章
    if (node.type === "chapter") {

        // 章目前只有删除
    }


    // 序
    if (node.type === "preface") {

        // 序目前只有删除
    }


    wrapper.appendChild(actions);

    return wrapper;
}
