// ==============================
// 全书页面：操作
// ==============================


// ==============================
// 根节点
// ==============================

function addRootPreface() {

    if (!currentBook.structure) {
        currentBook.structure = [];
    }


    const exists =
        currentBook.structure.some(
            node => node.type === "preface"
        );


    if (exists) {
        return;
    }


    const node =
        createNode(
            "preface",
            "序",
            1
        );


    currentBook.structure.unshift(node);


    saveBook();


    // 自动选中新创建的「序」
    selectedNodeId =
        node.id;

    selectedIsBook =
        false;


    renderTree();

    updatePrefaceButton();
}


function addRootChapter() {

    addRootNode("chapter");
}


function addRootPart() {

    addRootNode("part");
}


function addRootVolume() {

    addRootNode("volume");
}


function addRootNode(type) {

    if (!currentBook.structure) {
        currentBook.structure = [];
    }


    const number =
        getNextRootNumber(type);


    let title = "";


    switch (type) {

        case "volume":

            title =
                "第" +
                number +
                "卷：";

            break;


        case "part":

            title =
                "第" +
                number +
                "篇：";

            break;


        case "chapter":

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


    currentBook.structure.push(node);


    saveBook();


    // 自动选中新创建的节点
    selectedNodeId =
        node.id;

    selectedIsBook =
        false;


    renderTree();


    updatePrefaceButton();
}


// ==============================
// 编号
// ==============================

function getNextRootNumber(type) {

    const nodes =
        currentBook.structure || [];


    return getNextNumberFromArray(
        nodes,
        type
    );
}


function getNextNumberFromArray(
    nodes,
    type
) {

    const sameType =
        nodes.filter(
            node => node.type === type
        );


    if (!sameType.length) {
        return 1;
    }


    let max = 0;


    sameType.forEach(node => {

        const number =
            Number(node.number) || 0;


        max =
            Math.max(
                max,
                number
            );
    });


    return max + 1;
}


// ==============================
// 查找父节点
// ==============================

function findParentArray(
    nodeId,
    nodes = currentBook.structure
) {

    for (
        let i = 0;
        i < nodes.length;
        i++
    ) {

        if (
            nodes[i].id === nodeId
        ) {

            return {

                array: nodes,

                index: i,

                node: nodes[i]
            };
        }


        if (
            nodes[i].children &&
            nodes[i].children.length
        ) {

            const result =
                findParentArray(
                    nodeId,
                    nodes[i].children
                );


            if (result) {
                return result;
            }
        }
    }


    return null;
}


// ==============================
// 添加同级
// ==============================

function addSameLevel(nodeId) {

    const result =
        findParentArray(nodeId);


    if (!result) {
        return;
    }


    const node =
        result.node;


    const number =
        getNextNumberFromArray(
            result.array,
            node.type
        );


    let title = "";


    if (node.type === "volume") {

        title =
            "第" +
            number +
            "卷：";

    }

    else if (node.type === "part") {

        title =
            "第" +
            number +
            "篇：";

    }

    else if (node.type === "chapter") {

        title =
            "第" +
            number +
            "章：";
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


    selectedNodeId =
        newNode.id;

    selectedIsBook =
        false;


    renderTree();


    updatePrefaceButton();
}


// ==============================
// 添加子节点
// ==============================

function addChild(
    parentId,
    type
) {

    const result =
        findParentArray(parentId);


    if (!result) {
        return;
    }


    const parent =
        result.node;


    if (!parent.children) {

        parent.children = [];
    }


    const number =
        getNextNumberFromArray(
            parent.children,
            type
        );


    let title = "";


    if (type === "part") {

        title =
            "第" +
            number +
            "篇：";

    }

    else if (type === "chapter") {

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


    // 添加孩子后自动展开父节点
    parent.collapsed = false;


    saveBook();


    selectedNodeId =
        newNode.id;

    selectedIsBook =
        false;


    renderTree();


    updatePrefaceButton();
}


// ==============================
// 展开 / 收起
// ==============================

function toggleNode(nodeId) {

    const result =
        findParentArray(nodeId);


    if (!result) {
        return;
    }


    result.node.collapsed =
        !result.node.collapsed;


    saveBook();


    renderTree();


    updatePrefaceButton();
}


// ==============================
// 删除
// ==============================

function deleteNode(nodeId) {

    const result =
        findParentArray(nodeId);


    if (!result) {
        return;
    }


    const node =
        result.node;


    const confirmed =
        confirm(
            `确定要删除「${node.title}」吗？`
        );


    if (!confirmed) {
        return;
    }


    result.array.splice(
        result.index,
        1
    );


    selectedNodeId =
        null;

    selectedIsBook =
        false;


    saveBook();


    renderTree();


    updatePrefaceButton();
}


// ==============================
// 序按钮状态
// ==============================

function updatePrefaceButton() {

    const button =
        document.querySelector(
            "#addPreface"
        );


    if (!button) {
        return;
    }


    const exists =
        currentBook &&
        currentBook.structure &&
        currentBook.structure.some(
            node =>
                node.type === "preface"
        );


    button.disabled =
        Boolean(exists);


    if (exists) {

        button.classList.add(
            "disabled"
        );

    }

    else {

        button.classList.remove(
            "disabled"
        );
    }
}
