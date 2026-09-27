// ==============================
// 全书页面：操作
// ==============================


// ==================================================
// 清除当前选择
// ==================================================

function clearActionSelection() {

    selectedNodeId = null;

    selectedIsBook = false;

    selectedElement = null;

    actionBarMode = "none";

    actionNodeId = null;

    actionButtonPressed = false;

    if (
        typeof updateSelectionUI ===
        "function"
    ) {
        updateSelectionUI();
    }
}


// ==================================================
// 底部操作按钮颜色
//
// ＋序 → 浅青
// ＋章 → 浅黑
// ＋篇 → 浅白
// ＋卷 → 浅黄
// ==================================================

function applyActionButtonColors() {

    const buttonStyles = {

        addPreface: {
            background: "#f3fbfa",
            border: "#b7dfdc",
            color: "#5fa9a3"
        },

        addChapter: {
            background: "#f7f7f7",
            border: "#c8c8c8",
            color: "#777777"
        },

        addPart: {
            background: "#ffffff",
            border: "#dedede",
            color: "#b0b0b0"
        },

        addVolume: {
            background: "#fffdf3",
            border: "#eadf9e",
            color: "#c8ae55"
        }
    };


    Object.keys(buttonStyles).forEach(
        function(id) {

            const button =
                document.getElementById(id);


            if (!button) {
                return;
            }


            const style =
                buttonStyles[id];


            /*
             * 直接设置按钮自身样式。
             *
             * 使用 !important，
             * 确保不会被其他普通 CSS 覆盖。
             */

            button.style.setProperty(
                "background-color",
                style.background,
                "important"
            );


            button.style.setProperty(
                "border-color",
                style.border,
                "important"
            );


            button.style.setProperty(
                "color",
                style.color,
                "important"
            );
        }
    );
}


// ==================================================
// 监控底部操作栏
//
// bookActions 中的按钮可能由其他 JS 动态生成。
// 一旦生成：
//
// ＋序
// ＋章
// ＋篇
// ＋卷
//
// 自动重新套用颜色。
// ==================================================

function startActionButtonColorObserver() {

    if (
        window.bookActionButtonColorObserver
    ) {
        return;
    }


    if (!document.body) {
        return;
    }


    const observer =
        new MutationObserver(
            function() {

                applyActionButtonColors();
            }
        );


    observer.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );


    window.bookActionButtonColorObserver =
        observer;


    // 立即执行一次

    applyActionButtonColors();
}


// ==================================================
// 根节点：序
// ==================================================

function addRootPreface() {

    if (!currentBook) {
        return;
    }


    if (
        !Array.isArray(
            currentBook.structure
        )
    ) {

        currentBook.structure = [];
    }


    const exists =
        currentBook.structure.some(
            node =>
                node.type ===
                NODE_TYPES.PREFACE
        );


    if (exists) {
        return;
    }


    const node =
        createNode(
            NODE_TYPES.PREFACE,
            "序",
            1
        );


    currentBook.structure.unshift(
        node
    );


    saveBook();


    // ==========================================
    // 不自动选中新节点
    // ==========================================

    clearActionSelection();


    renderTree();

    updatePrefaceButton();
}


// ==================================================
// 根节点：章
// ==================================================

function addRootChapter() {

    addRootNode(
        NODE_TYPES.CHAPTER
    );
}


// ==================================================
// 根节点：篇
// ==================================================

function addRootPart() {

    addRootNode(
        NODE_TYPES.PART
    );
}


// ==================================================
// 根节点：卷
// ==================================================

function addRootVolume() {

    addRootNode(
        NODE_TYPES.VOLUME
    );
}


// ==================================================
// 添加根节点
// ==================================================

function addRootNode(type) {

    if (!currentBook) {
        return;
    }


    if (
        !Array.isArray(
            currentBook.structure
        )
    ) {

        currentBook.structure = [];
    }


    const number =
        getNextRootNumber(type);


    let title = "";


    switch (type) {

        case NODE_TYPES.VOLUME:

            title =
                "第" +
                number +
                "卷：";

            break;


        case NODE_TYPES.PART:

            title =
                "第" +
                number +
                "篇：";

            break;


        case NODE_TYPES.CHAPTER:

            title =
                "第" +
                number +
                "章：";

            break;
    }


    const node =
        createNode(
            type,
            title,
            number
        );


    currentBook.structure.push(
        node
    );


    saveBook();


    // ==========================================
    // 生成以后不自动选中
    // ==========================================

    clearActionSelection();


    renderTree();

    updatePrefaceButton();
}


// ==================================================
// 根节点编号
// ==================================================

function getNextRootNumber(type) {

    if (!currentBook) {
        return 1;
    }


    const nodes =
        Array.isArray(
            currentBook.structure
        )
            ? currentBook.structure
            : [];


    return getNextNumberFromArray(
        nodes,
        type
    );
}


// ==================================================
// 获取数组中某类型的下一个编号
// ==================================================

function getNextNumberFromArray(
    nodes,
    type
) {

    if (!Array.isArray(nodes)) {
        return 1;
    }


    const sameType =
        nodes.filter(
            node =>
                node.type === type
        );


    if (!sameType.length) {
        return 1;
    }


    let max = 0;


    sameType.forEach(
        node => {

            const number =
                Number(node.number) ||
                0;


            max =
                Math.max(
                    max,
                    number
                );
        }
    );


    return max + 1;
}


// ==================================================
// 查找父节点数组
// ==================================================

function findParentArray(
    nodeId,
    nodes = null
) {

    if (!currentBook) {
        return null;
    }


    const list =
        nodes ||
        currentBook.structure ||
        [];


    for (
        let i = 0;
        i < list.length;
        i++
    ) {

        const node =
            list[i];


        if (
            node.id === nodeId
        ) {

            return {

                array:
                    list,

                index:
                    i,

                node:
                    node
            };
        }


        if (
            Array.isArray(
                node.children
            ) &&
            node.children.length > 0
        ) {

            const result =
                findParentArray(
                    nodeId,
                    node.children
                );


            if (result) {
                return result;
            }
        }
    }


    return null;
}


// ==================================================
// 添加同级
// ==================================================

function addSameLevel(nodeId) {

    const result =
        findParentArray(
            nodeId
        );


    if (!result) {
        return;
    }


    const node =
        result.node;


    // 序不能添加同级

    if (
        node.type ===
        NODE_TYPES.PREFACE
    ) {

        return;
    }


    const number =
        getNextNumberFromArray(
            result.array,
            node.type
        );


    let title = "";


    switch (node.type) {

        case NODE_TYPES.VOLUME:

            title =
                "第" +
                number +
                "卷：";

            break;


        case NODE_TYPES.PART:

            title =
                "第" +
                number +
                "篇：";

            break;


        case NODE_TYPES.CHAPTER:

            title =
                "第" +
                number +
                "章：";

            break;
    }


    const newNode =
        createNode(
            node.type,
            title,
            number
        );


    result.array.splice(
        result.index + 1,
        0,
        newNode
    );


    saveBook();


    // ==========================================
    // 添加同级以后不自动选中
    // ==========================================

    clearActionSelection();


    renderTree();

    updatePrefaceButton();
}


// ==================================================
// 添加子节点
// ==================================================

function addChild(
    parentId,
    type
) {

    const result =
        findParentArray(
            parentId
        );


    if (!result) {
        return;
    }


    const parent =
        result.node;


    // 序不能添加子节点

    if (
        parent.type ===
        NODE_TYPES.PREFACE
    ) {

        return;
    }


    if (
        !Array.isArray(
            parent.children
        )
    ) {

        parent.children = [];
    }


    // ==========================================
    // 层级限制
    //
    // 卷 → 篇 / 章
    // 篇 → 章
    // ==========================================

    if (
        parent.type ===
        NODE_TYPES.VOLUME
    ) {

        if (
            type !== NODE_TYPES.PART &&
            type !== NODE_TYPES.CHAPTER
        ) {

            return;
        }

    } else if (
        parent.type ===
        NODE_TYPES.PART
    ) {

        if (
            type !==
            NODE_TYPES.CHAPTER
        ) {

            return;
        }

    } else {

        return;
    }


    const number =
        getNextNumberFromArray(
            parent.children,
            type
        );


    let title = "";


    if (
        type ===
        NODE_TYPES.PART
    ) {

        title =
            "第" +
            number +
            "篇：";

    } else if (
        type ===
        NODE_TYPES.CHAPTER
    ) {

        title =
            "第" +
            number +
            "章：";
    }


    const newNode =
        createNode(
            type,
            title,
            number
        );


    parent.children.push(
        newNode
    );


    // 添加孩子以后自动展开

    parent.collapsed =
        false;


    saveBook();


    // ==========================================
    // 添加子节点以后不自动选中
    // ==========================================

    clearActionSelection();


    renderTree();

    updatePrefaceButton();
}


// ==================================================
// 展开 / 收起
// ==================================================

function toggleNode(nodeId) {

    const result =
        findParentArray(
            nodeId
        );


    if (!result) {
        return;
    }


    result.node.collapsed =
        !result.node.collapsed;


    saveBook();


    // 展开/收起不改变选择

    renderTree();

    updatePrefaceButton();
}


// ==================================================
// 删除
// ==================================================

function deleteNode(nodeId) {

    const result =
        findParentArray(
            nodeId
        );


    if (!result) {
        return;
    }


    const node =
        result.node;


    const confirmed =
        window.confirm(
            `确定要删除「${node.title}」吗？`
        );


    if (!confirmed) {
        return;
    }


    result.array.splice(
        result.index,
        1
    );


    saveBook();


    // 删除以后取消选择

    clearActionSelection();


    renderTree();

    updatePrefaceButton();
}


// ==================================================
// 序按钮状态
// ==================================================

function updatePrefaceButton() {

    const button =
        document.querySelector(
            "#addPreface"
        );


    if (!button) {

        applyActionButtonColors();

        return;
    }


    const exists =
        currentBook &&
        Array.isArray(
            currentBook.structure
        ) &&
        currentBook.structure.some(
            node =>
                node.type ===
                NODE_TYPES.PREFACE
        );


    button.disabled =
        Boolean(exists);


    if (exists) {

        button.classList.add(
            "disabled"
        );

    } else {

        button.classList.remove(
            "disabled"
        );
    }


    // 状态变化后重新套用颜色

    applyActionButtonColors();
}


// ==================================================
// 绑定书籍底部操作按钮
// ==================================================

function setupActionButtons() {

    /*
     * 即使其他文件已经初始化过，
     * 这里仍然重新检查颜色。
     */

    applyActionButtonColors();


    // ==========================================
    // ＋序
    // ==========================================

    const addPreface =
        document.querySelector(
            "#addPreface"
        );


    if (addPreface) {

        addPreface.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();

                addRootPreface();
            }
        );
    }


    // ==========================================
    // ＋章
    // ==========================================

    const addChapter =
        document.querySelector(
            "#addChapter"
        );


    if (addChapter) {

        addChapter.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();

                addRootChapter();
            }
        );
    }


    // ==========================================
    // ＋篇
    // ==========================================

    const addPart =
        document.querySelector(
            "#addPart"
        );


    if (addPart) {

        addPart.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();

                addRootPart();
            }
        );
    }


    // ==========================================
    // ＋卷
    // ==========================================

    const addVolume =
        document.querySelector(
            "#addVolume"
        );


    if (addVolume) {

        addVolume.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();

                addRootVolume();
            }
        );
    }


    window.bookActionButtonsInitialized =
        true;


    // ==========================================
    // 开始监听动态按钮
    // ==========================================

    startActionButtonColorObserver();


    // ==========================================
    // 最后再执行一次
    // ==========================================

    applyActionButtonColors();
}


// ==================================================
// 页面加载后绑定按钮
// ==================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        setupActionButtons
    );

} else {

    setupActionButtons();
}
