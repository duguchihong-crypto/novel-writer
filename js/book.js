/* ==================================================
   全书页面
================================================== */


/* ==================================================
   当前书籍
================================================== */

let currentBook = null;


/* ==================================================
   当前选择
================================================== */

let selectedNodeId = null;

let selectedIsBook = false;


/* ==================================================
   书名自由位置
================================================== */

let bookPosition = {

    x: null,

    y: null

};


/* ==================================================
   拖动状态
================================================== */

let draggingBook = false;

let dragStartX = 0;

let dragStartY = 0;

let dragOriginalX = 0;

let dragOriginalY = 0;


/* ==================================================
   布局参数
================================================== */

const NODE_WIDTH = 155;

const NODE_HEIGHT = 48;

const LEVEL_GAP = 95;

const SIBLING_GAP = 35;


/* ==================================================
   初始化
================================================== */

function init() {

    const currentBookId =
        localStorage.getItem(
            "currentBookId"
        );


    const savedBooks =
        localStorage.getItem(
            "novelBooks"
        );


    const books =
        savedBooks
            ? JSON.parse(savedBooks)
            : [];


    currentBook =
        books.find(
            function(book) {

                return String(book.id) ===
                    String(currentBookId);

            }
        );


    if (!currentBook) {

        alert("没有找到这本书。");

        window.location.href =
            "index.html";

        return;

    }


    /*
       兼容旧数据
    */

    if (
        !Array.isArray(
            currentBook.structure
        )
    ) {

        currentBook.structure = [];

    }


    /*
       恢复书名位置
    */

    if (
        currentBook.rootPosition &&
        typeof currentBook.rootPosition.x === "number" &&
        typeof currentBook.rootPosition.y === "number"
    ) {

        bookPosition.x =
            currentBook.rootPosition.x;

        bookPosition.y =
            currentBook.rootPosition.y;

    }


    document.getElementById(
        "bookTitle"
    ).textContent =
        currentBook.title ||
        "未命名小说";


    setupEvents();

    renderTree();

    updatePrefaceButton();

}


/* ==================================================
   返回
================================================== */

function goBack() {

    window.location.href =
        "index.html";

}


/* ==================================================
   创建 ID
================================================== */

function createId() {

    return Date.now() +
        Math.floor(
            Math.random() * 100000
        );

}


/* ==================================================
   创建节点
================================================== */

function createNode(
    type,
    name
) {

    return {

        id: createId(),

        type: type,

        name: name,

        children: [],

        collapsed: false

    };

}


/* ==================================================
   事件
================================================== */

function setupEvents() {

    document
        .getElementById(
            "backButton"
        )
        .addEventListener(
            "click",
            goBack
        );


    const bookTitle =
        document.getElementById(
            "bookTitle"
        );


    /*
       点击书名
    */

    bookTitle.addEventListener(
        "click",
        function(event) {

            if (draggingBook) {

                return;

            }

            event.stopPropagation();

            selectBook();

        }
    );


    /*
       拖动书名
    */

    bookTitle.addEventListener(
        "pointerdown",
        startBookDrag
    );


    /*
       点击空白
    */

    document
        .getElementById("main")
        .addEventListener(
            "click",
            function(event) {

                const target =
                    event.target;


                if (
                    target ===
                        document.getElementById("main") ||

                    target ===
                        document.getElementById("structureArea") ||

                    target ===
                        document.getElementById("canvas") ||

                    target.id === "tree"
                ) {

                    clearSelection();

                }

            }
        );


    /*
       底部按钮
    */

    document
        .getElementById(
            "addPrefaceButton"
        )
        .addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                addRootPreface();

            }
        );


    document
        .getElementById(
            "addChapterButton"
        )
        .addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                addRootChapter();

            }
        );


    document
        .getElementById(
            "addPartButton"
        )
        .addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                addRootPart();

            }
        );


    document
        .getElementById(
            "addVolumeButton"
        )
        .addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                addRootVolume();

            }
        );

}


/* ==================================================
   选择书名
================================================== */

function selectBook() {

    selectedNodeId = null;

    selectedIsBook = true;


    document
        .querySelectorAll(
            ".node.selected"
        )
        .forEach(
            function(element) {

                element.classList.remove(
                    "selected"
                );

            }
        );


    document
        .getElementById(
            "bookTitle"
        )
        .classList.add(
            "selected"
        );


    document
        .getElementById(
            "bottomBar"
        )
        .classList.add(
            "visible"
        );

}


/* ==================================================
   选择节点
================================================== */

function selectNode(node) {

    selectedNodeId =
        node.id;

    selectedIsBook = false;


    document
        .getElementById(
            "bottomBar"
        )
        .classList.remove(
            "visible"
        );


    document
        .getElementById(
            "bookTitle"
        )
        .classList.remove(
            "selected"
        );


    document
        .querySelectorAll(
            ".node.selected"
        )
        .forEach(
            function(element) {

                element.classList.remove(
                    "selected"
                );

            }
        );


    const element =
        document.querySelector(
            '[data-node-id="' +
            node.id +
            '"]'
        );


    if (element) {

        element.classList.add(
            "selected"
        );

    }

}


/* ==================================================
   清除选择
================================================== */

function clearSelection() {

    selectedNodeId = null;

    selectedIsBook = false;


    document
        .getElementById(
            "bottomBar"
        )
        .classList.remove(
            "visible"
        );


    document
        .getElementById(
            "bookTitle"
        )
        .classList.remove(
            "selected"
        );


    document
        .querySelectorAll(
            ".node.selected"
        )
        .forEach(
            function(element) {

                element.classList.remove(
                    "selected"
                );

            }
        );

}


/* ==================================================
   书名拖动
================================================== */

function startBookDrag(event) {

    /*
       有结构后禁止自由拖动
    */

    if (
        currentBook &&
        currentBook.structure &&
        currentBook.structure.length > 0
    ) {

        return;

    }


    event.preventDefault();

    event.stopPropagation();


    const bookNode =
        document.getElementById(
            "bookNode"
        );


    const rect =
        bookNode.getBoundingClientRect();


    const canvasRect =
        document
            .getElementById("canvas")
            .getBoundingClientRect();


    dragStartX =
        event.clientX;

    dragStartY =
        event.clientY;


    dragOriginalX =
        rect.left -
        canvasRect.left;


    dragOriginalY =
        rect.top -
        canvasRect.top;


    draggingBook = false;


    bookNode.setPointerCapture(
        event.pointerId
    );


    function move(pointerEvent) {

        const dx =
            pointerEvent.clientX -
            dragStartX;


        const dy =
            pointerEvent.clientY -
            dragStartY;


        if (
            Math.abs(dx) > 4 ||
            Math.abs(dy) > 4
        ) {

            draggingBook = true;

        }


        if (!draggingBook) {

            return;

        }


        bookPosition.x =
            dragOriginalX + dx;


        bookPosition.y =
            dragOriginalY + dy;


        applyBookPosition();

    }


    function end(pointerEvent) {

        try {

            bookNode.releasePointerCapture(
                pointerEvent.pointerId
            );

        } catch (error) {}


        document.removeEventListener(
            "pointermove",
            move
        );


        document.removeEventListener(
            "pointerup",
            end
        );


        if (draggingBook) {

            if (
                !currentBook.rootPosition
            ) {

                currentBook.rootPosition = {};

            }


            currentBook.rootPosition.x =
                bookPosition.x;


            currentBook.rootPosition.y =
                bookPosition.y;


            saveBook();


            setTimeout(
                function() {

                    draggingBook = false;

                },
                50
            );

        }

    }


    document.addEventListener(
        "pointermove",
        move
    );


    document.addEventListener(
        "pointerup",
        end
    );

}


/* ==================================================
   应用书名位置
================================================== */

function applyBookPosition() {

    const bookNode =
        document.getElementById(
            "bookNode"
        );


    if (
        currentBook.structure.length > 0
    ) {

        return;

    }


    if (
        bookPosition.x === null ||
        bookPosition.y === null
    ) {

        const canvas =
            document.getElementById(
                "canvas"
            );


        const rect =
            canvas.getBoundingClientRect();


        const book =
            document
                .getElementById(
                    "bookTitle"
                )
                .getBoundingClientRect();


        bookPosition.x =
            (rect.width -
                book.width) / 2;


        bookPosition.y =
            60;

    }


    bookNode.style.left =
        bookPosition.x +
        "px";


    bookNode.style.top =
        bookPosition.y +
        "px";

}


/* ==================================================
   ＋序
================================================== */

function addRootPreface() {

    if (!currentBook) {

        return;

    }


    const exists =
        currentBook.structure.some(
            function(item) {

                return item.type === "序";

            }
        );


    if (exists) {

        return;

    }


    currentBook.structure.push(

        createNode(
            "序",
            "序章："
        )

    );


    saveBook();

    renderTree();

    updatePrefaceButton();

    selectBook();

}


/* ==================================================
   ＋章
================================================== */

function addRootChapter() {

    addRootNode(

        "章",

        getNextRootNumber("章")
        + "章："

    );

}


/* ==================================================
   ＋篇
================================================== */

function addRootPart() {

    addRootNode(

        "篇",

        getNextRootNumber("篇")
        + "篇："

    );

}


/* ==================================================
   ＋卷
================================================== */

function addRootVolume() {

    addRootNode(

        "卷",

        getNextRootNumber("卷")
        + "卷："

    );

}


/* ==================================================
   添加根节点
================================================== */

function addRootNode(
    type,
    name
) {

    if (!currentBook) {

        return;

    }


    currentBook.structure.push(

        createNode(
            type,
            name
        )

    );


    saveBook();

    renderTree();

    updatePrefaceButton();

    selectBook();

}


/* ==================================================
   根节点编号
================================================== */

function getNextRootNumber(type) {

    let count = 0;


    currentBook.structure.forEach(
        function(item) {

            if (
                item.type === type
            ) {

                count++;

            }

        }
    );


    return "第" +
        (count + 1);

}


/* ==================================================
   子节点编号
================================================== */

function getNextNumberFromArray(
    array,
    type
) {

    let count = 0;


    array.forEach(
        function(item) {

            if (
                item.type === type
            ) {

                count++;

            }

        }
    );


    return "第" +
        (count + 1);

}


/* ==================================================
   渲染
================================================== */

function renderTree() {

    const canvas =
        document.getElementById(
            "canvas"
        );


    const tree =
        document.getElementById(
            "tree"
        );


    const svg =
        document.getElementById(
            "connectionLayer"
        );


    /*
       清除旧内容
    */

    tree.innerHTML = "";

    svg.innerHTML = "";

    document
        .querySelectorAll(
            ".line-control"
        )
        .forEach(
            function(element) {

                element.remove();

            }
        );


    /*
       没有结构
    */

    if (
        !currentBook.structure ||
        currentBook.structure.length === 0
    ) {

        const hint =
            document.createElement(
                "div"
            );


        hint.className =
            "empty-hint";


        hint.textContent =
            "点击书名或拖动书名开始建立全书目录";


        tree.appendChild(
            hint
        );


        applyBookPosition();


        canvas.style.height =
            "600px";


        return;

    }


    /*
       自动布局
    */

    const layout =
        calculateLayout();


    canvas.style.height =
        Math.max(
            layout.height + 160,
            600
        ) +
        "px";


    /*
       书名
    */

    const bookNode =
        document.getElementById(
            "bookNode"
        );


    bookNode.style.left =
        layout.book.x +
        "px";


    bookNode.style.top =
        layout.book.y +
        "px";


    /*
       节点
    */

    layout.nodes.forEach(
        function(info) {

            tree.appendChild(

                createNodeElement(

                    info.node,

                    info.x,

                    info.y

                )

            );

        }
    );


    /*
       连线
    */

    drawConnections(layout);


    /*
       恢复选中
    */

    if (selectedNodeId) {

        const selectedElement =
            document.querySelector(
                '[data-node-id="' +
                selectedNodeId +
                '"]'
            );


        if (selectedElement) {

            selectedElement.classList.add(
                "selected"
            );

        }

    }

}


/* ==================================================
   自动布局
================================================== */

function calculateLayout() {

    const canvas =
        document.getElementById(
            "canvas"
        );


    const canvasWidth =
        Math.max(
            canvas.clientWidth,
            window.innerWidth
        );


    const nodes = [];

    const subtreeWidths =
        new Map();


    /*
       计算子树宽度
    */

    function calculateWidth(node) {

        if (
            node.collapsed ||
            !node.children ||
            node.children.length === 0
        ) {

            subtreeWidths.set(
                node.id,
                NODE_WIDTH
            );


            return NODE_WIDTH;

        }


        let width = 0;


        node.children.forEach(
            function(child, index) {

                width +=
                    calculateWidth(child);


                if (
                    index <
                    node.children.length - 1
                ) {

                    width +=
                        SIBLING_GAP;

                }

            }
        );


        width =
            Math.max(
                width,
                NODE_WIDTH
            );


        subtreeWidths.set(
            node.id,
            width
        );


        return width;

    }


    currentBook.structure.forEach(
        calculateWidth
    );


    let totalWidth = 0;


    currentBook.structure.forEach(
        function(node, index) {

            totalWidth +=
                subtreeWidths.get(
                    node.id
                );


            if (
                index <
                currentBook.structure.length - 1
            ) {

                totalWidth +=
                    SIBLING_GAP;

            }

        }
    );


    totalWidth =
        Math.max(
            totalWidth,
            NODE_WIDTH
        );


    const contentWidth =
        Math.max(
            canvasWidth,
            totalWidth + 120
        );


    /*
       书名
    */

    const bookElement =
        document.getElementById(
            "bookTitle"
        );


    const bookWidth =
        Math.max(
            190,
            Math.min(
                360,
                bookElement.offsetWidth || 190
            )
        );


    const bookX =
        (contentWidth -
            bookWidth) / 2;


    const bookY = 50;


    /*
       第一层
    */

    const rootY =
        bookY + 115;


    let currentX =
        (contentWidth -
            totalWidth) / 2;


    /*
       放置节点
    */

    function placeNode(
        node,
        subtreeX,
        y
    ) {

        const subtreeWidth =
            subtreeWidths.get(
                node.id
            );


        const x =
            subtreeX +
            (subtreeWidth -
                NODE_WIDTH) / 2;


        nodes.push({

            node: node,

            x: x,

            y: y

        });


        if (
            node.collapsed ||
            !node.children ||
            node.children.length === 0
        ) {

            return;

        }


        let childX =
            subtreeX;


        node.children.forEach(
            function(child) {

                const childWidth =
                    subtreeWidths.get(
                        child.id
                    );


                placeNode(

                    child,

                    childX,

                    y + LEVEL_GAP

                );


                childX +=
                    childWidth +
                    SIBLING_GAP;

            }
        );

    }


    currentBook.structure.forEach(
        function(node) {

            const width =
                subtreeWidths.get(
                    node.id
                );


            placeNode(

                node,

                currentX,

                rootY

            );


            currentX +=
                width +
                SIBLING_GAP;

        }
    );


    let maxY =
        rootY + NODE_HEIGHT;


    nodes.forEach(
        function(item) {

            maxY =
                Math.max(
                    maxY,
                    item.y +
                    NODE_HEIGHT
                );

        }
    );


    return {

        width: contentWidth,

        height: maxY,

        book: {

            x: bookX,

            y: bookY

        },

        nodes: nodes

    };

}


/* ==================================================
   创建节点
================================================== */

function createNodeElement(
    node,
    x,
    y
) {

    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "node";


    wrapper.dataset.nodeId =
        node.id;


    wrapper.style.left =
        x + "px";


    wrapper.style.top =
        y + "px";


    /*
       节点框
    */

    const box =
        document.createElement(
            "div"
        );


    box.className =
        "node-box " +
        getNodeClass(
            node.type
        );


    box.textContent =
        node.name;


    box.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            selectNode(node);

        }
    );


    wrapper.appendChild(
        box
    );


    /*
       操作区域
    */

    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "node-actions";


    /*
       删除
    */

    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.className =
        "action-button delete-button";


    deleteButton.textContent =
        "🗑";


    deleteButton.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            deleteNode(
                node.id
            );

        }
    );


    actions.appendChild(
        deleteButton
    );


    /*
       卷
    */

    if (
        node.type === "卷"
    ) {

        actions.appendChild(

            createActionButton(
                "＋同级",
                function(event) {

                    event.stopPropagation();

                    addSameLevel(
                        node,
                        "卷"
                    );

                }
            )

        );


        actions.appendChild(

            createActionButton(
                "＋篇",
                function(event) {

                    event.stopPropagation();

                    addChild(
                        node,
                        "篇"
                    );

                }
            )

        );


        actions.appendChild(

            createActionButton(
                "＋章",
                function(event) {

                    event.stopPropagation();

                    addChild(
                        node,
                        "章"
                    );

                }
            )

        );

    }


    /*
       篇
    */

    if (
        node.type === "篇"
    ) {

        actions.appendChild(

            createActionButton(
                "＋同级",
                function(event) {

                    event.stopPropagation();

                    addSameLevel(
                        node,
                        "篇"
                    );

                }
            )

        );


        actions.appendChild(

            createActionButton(
                "＋章",
                function(event) {

                    event.stopPropagation();

                    addChild(
                        node,
                        "章"
                    );

                }
            )

        );

    }


    wrapper.appendChild(
        actions
    );


    return wrapper;

}


/* ==================================================
   节点颜色
================================================== */

function getNodeClass(type) {

    switch (type) {

        case "序":

            return "node-preface";


        case "卷":

            return "node-volume";


        case "篇":

            return "node-part";


        case "章":

            return "node-chapter";


        default:

            return "node-chapter";

    }

}


/* ==================================================
   创建按钮
================================================== */

function createActionButton(
    text,
    callback
) {

    const button =
        document.createElement(
            "button"
        );


    button.className =
        "action-button";


    button.textContent =
        text;


    button.addEventListener(
        "click",
        callback
    );


    return button;

}


/* ==================================================
   画连接线
================================================== */

function drawConnections(layout) {

    const svg =
        document.getElementById(
            "connectionLayer"
        );


    const canvas =
        document.getElementById(
            "canvas"
        );


    const canvasWidth =
        Math.max(
            canvas.clientWidth,
            layout.width
        );


    const svgHeight =
        layout.height + 100;


    svg.setAttribute(
        "width",
        canvasWidth
    );


    svg.setAttribute(
        "height",
        svgHeight
    );


    svg.setAttribute(
        "viewBox",
        "0 0 " +
        canvasWidth +
        " " +
        svgHeight
    );


    /*
       位置表
    */

    const positions =
        new Map();


    layout.nodes.forEach(
        function(info) {

            positions.set(
                info.node.id,
                info
            );

        }
    );


    /*
       SVG 路径
    */

    function createPath(d) {

        const path =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );


        path.setAttribute(
            "d",
            d
        );


        path.setAttribute(
            "class",
            "connection-line"
        );


        svg.appendChild(
            path
        );

    }


    /*
       书名尺寸
    */

    const bookElement =
        document.getElementById(
            "bookTitle"
        );


    const bookWidth =
        bookElement.offsetWidth;


    const bookHeight =
        bookElement.offsetHeight;


    const bookCenterX =
        layout.book.x +
        bookWidth / 2;


    const bookBottomY =
        layout.book.y +
        bookHeight;


    /*
       根节点
    */

    const roots =
        currentBook.structure;


    /*
       书名 → 根节点
    */

    if (
        roots.length === 1
    ) {

        const child =
            positions.get(
                roots[0].id
            );


        if (child) {

            const childCenterX =
                child.x +
                NODE_WIDTH / 2;


            const childTopY =
                child.y;


            const midY =
                bookBottomY +
                (childTopY -
                    bookBottomY) / 2;


            createPath(

                "M " +
                bookCenterX +
                " " +
                bookBottomY +

                " L " +
                bookCenterX +
                " " +
                midY +

                " L " +
                childCenterX +
                " " +
                midY +

                " L " +
                childCenterX +
                " " +
                childTopY

            );

        }

    }


    /*
       多个根节点
    */

    if (
        roots.length > 1
    ) {

        const first =
            positions.get(
                roots[0].id
            );


        const last =
            positions.get(
                roots[
                    roots.length - 1
                ].id
            );


        if (
            first &&
            last
        ) {

            const firstX =
                first.x +
                NODE_WIDTH / 2;


            const lastX =
                last.x +
                NODE_WIDTH / 2;


            const branchY =
                bookBottomY +
                (first.y -
                    bookBottomY) / 2;


            createPath(

                "M " +
                bookCenterX +
                " " +
                bookBottomY +

                " L " +
                bookCenterX +
                " " +
                branchY

            );


            createPath(

                "M " +
                firstX +
                " " +
                branchY +

                " L " +
                lastX +
                " " +
                branchY

            );


            roots.forEach(
                function(root) {

                    const info =
                        positions.get(
                            root.id
                        );


                    if (!info) {

                        return;

                    }


                    const centerX =
                        info.x +
                        NODE_WIDTH / 2;


                    createPath(

                        "M " +
                        centerX +
                        " " +
                        branchY +

                        " L " +
                        centerX +
                        " " +
                        info.y

                    );

                }
            );

        }

    }


    /*
       节点 → 子节点
    */

    layout.nodes.forEach(
        function(info) {

            const node =
                info.node;


            if (
                node.collapsed ||
                !node.children ||
                node.children.length === 0
            ) {

                return;

            }


            const parentX =
                info.x +
                NODE_WIDTH / 2;


            const parentY =
                info.y +
                NODE_HEIGHT;


            const children =
                node.children;


            const first =
                positions.get(
                    children[0].id
                );


            const last =
                positions.get(
                    children[
                        children.length - 1
                    ].id
                );


            if (
                !first ||
                !last
            ) {

                return;

            }


            const firstX =
                first.x +
                NODE_WIDTH / 2;


            const lastX =
                last.x +
                NODE_WIDTH / 2;


            const childY =
                first.y;


            /*
               单个孩子
            */

            if (
                children.length === 1
            ) {

                const childX =
                    firstX;


                const midY =
                    parentY +
                    (childY -
                        parentY) / 2;


                createPath(

                    "M " +
                    parentX +
                    " " +
                    parentY +

                    " L " +
                    parentX +
                    " " +
                    midY +

                    " L " +
                    childX +
                    " " +
                    midY +

                    " L " +
                    childX +
                    " " +
                    childY

                );


                addLineControl(

                    midY,

                    parentX,

                    childX,

                    node

                );

            }


            /*
               多个孩子
            */

            else {

                const branchY =
                    parentY +
                    (childY -
                        parentY) / 2;


                createPath(

                    "M " +
                    parentX +
                    " " +
                    parentY +

                    " L " +
                    parentX +
                    " " +
                    branchY

                );


                createPath(

                    "M " +
                    firstX +
                    " " +
                    branchY +

                    " L " +
                    lastX +
                    " " +
                    branchY

                );


                children.forEach(
                    function(child) {

                        const childInfo =
                            positions.get(
                                child.id
                            );


                        if (!childInfo) {

                            return;

                        }


                        const childX =
                            childInfo.x +
                            NODE_WIDTH / 2;


                        createPath(

                            "M " +
                            childX +
                            " " +
                            branchY +

                            " L " +
                            childX +
                            " " +
                            childInfo.y

                        );

                    }
                );


                addLineControl(

                    branchY,

                    firstX,

                    lastX,

                    node

                );

            }

        }
    );

}


/* ==================================================
   连线 + / -
================================================== */

function addLineControl(
    y,
    x1,
    x2,
    node
) {

    if (!node) {

        return;

    }


    if (
        !node.children ||
        node.children.length === 0
    ) {

        return;

    }


    const control =
        document.createElement(
            "button"
        );


    control.className =
        "line-control";


    control.textContent =
        node.collapsed
            ? "+"
            : "−";


    const x =
        x1 +
        (x2 - x1) / 2;


    control.style.left =
        (x - 12) +
        "px";


    control.style.top =
        (y - 12) +
        "px";


    control.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            toggleNode(
                node.id
            );

        }
    );


    document
        .getElementById(
            "canvas"
        )
        .appendChild(
            control
        );

}


/* ==================================================
   展开 / 收起
================================================== */

function toggleNode(id) {

    const result =
        findParentArray(
            currentBook.structure,
            id
        );


    if (!result) {

        return;

    }


    result.node.collapsed =
        !result.node.collapsed;


    saveBook();

    renderTree();

}


/* ==================================================
   添加同级
================================================== */

function addSameLevel(
    node,
    type
) {

    const result =
        findParentArray(
            currentBook.structure,
            node.id
        );


    if (!result) {

        return;

    }


    const newNode =
        createNode(

            type,

            getNextNumberFromArray(
                result.array,
                type
            )
            +
            type
            +
            "："

        );


    const index =
        result.array.findIndex(
            function(item) {

                return item.id ===
                    node.id;

            }
        );


    result.array.splice(

        index + 1,

        0,

        newNode

    );


    saveBook();

    renderTree();

    selectNode(newNode);

}


/* ==================================================
   添加下级
================================================== */

function addChild(
    parent,
    type
) {

    if (
        !Array.isArray(
            parent.children
        )
    ) {

        parent.children = [];

    }


    const number =
        getNextNumberFromArray(

            parent.children,

            type

        );


    const newNode =
        createNode(

            type,

            number +
            type +
            "："

        );


    parent.children.push(
        newNode
    );


    /*
       自动展开
    */

    parent.collapsed =
        false;


    saveBook();

    renderTree();

    selectNode(newNode);

}


/* ==================================================
   查找节点
================================================== */

function findParentArray(
    array,
    id
) {

    for (
        let i = 0;
        i < array.length;
        i++
    ) {

        if (
            String(array[i].id) ===
            String(id)
        ) {

            return {

                array: array,

                node: array[i]

            };

        }


        if (
            array[i].children &&
            array[i].children.length
        ) {

            const result =
                findParentArray(

                    array[i].children,

                    id

                );


            if (result) {

                return result;

            }

        }

    }


    return null;

}


/* ==================================================
   删除
================================================== */

function deleteNode(id) {

    const result =
        findParentArray(

            currentBook.structure,

            id

        );


    if (!result) {

        return;

    }


    const node =
        result.node;


    let message =
        "确定删除「" +
        node.name +
        "」吗？";


    if (
        node.children &&
        node.children.length > 0
    ) {

        message +=
            "\n\n此结构下面还有 " +
            node.children.length +
            " 个直接下级结构，它们也会一起删除。";

    }


    if (
        !confirm(message)
    ) {

        return;

    }


    const index =
        result.array.findIndex(
            function(item) {

                return String(item.id) ===
                    String(id);

            }
        );


    if (
        index !== -1
    ) {

        result.array.splice(
            index,
            1
        );

    }


    selectedNodeId = null;

    selectedIsBook = false;


    saveBook();

    renderTree();

    updatePrefaceButton();

}


/* ==================================================
   序按钮
================================================== */

function updatePrefaceButton() {

    const button =
        document.getElementById(
            "addPrefaceButton"
        );


    if (!currentBook) {

        return;

    }


    const exists =
        currentBook.structure.some(
            function(item) {

                return item.type ===
                    "序";

            }
        );


    if (exists) {

        button.classList.add(
            "disabled"
        );


        button.textContent =
            "序 ✓";

    } else {

        button.classList.remove(
            "disabled"
        );


        button.textContent =
            "＋序";

    }

}


/* ==================================================
   保存
================================================== */

function saveBook() {

    const savedBooks =
        localStorage.getItem(
            "novelBooks"
        );


    const books =
        savedBooks
            ? JSON.parse(savedBooks)
            : [];


    const index =
        books.findIndex(
            function(book) {

                return String(book.id) ===
                    String(currentBook.id);

            }
        );


    if (
        index !== -1
    ) {

        books[index] =
            currentBook;


        localStorage.setItem(

            "novelBooks",

            JSON.stringify(
                books
            )

        );

    }

}


/* ==================================================
   窗口变化
================================================== */

window.addEventListener(
    "resize",
    function() {

        renderTree();

    }
);


/* ==================================================
   启动
================================================== */

init();
