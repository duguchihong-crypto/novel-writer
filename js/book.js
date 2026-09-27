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


    const bookTitle =
        document.getElementById(
            "bookTitle"
        );


    if (bookTitle) {

        bookTitle.textContent =
            currentBook.title ||
            "未命名小说";

    }


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

    const backButton =
        document.getElementById(
            "backButton"
        );


    if (backButton) {

        backButton.addEventListener(
            "click",
            goBack
        );

    }


    const bookTitle =
        document.getElementById(
            "bookTitle"
        );


    /*
       点击书名
    */

    if (bookTitle) {

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

    }


    /*
       点击空白
    */

    const main =
        document.getElementById(
            "main"
        );


    if (main) {

        main.addEventListener(
            "click",
            function(event) {

                const target =
                    event.target;


                if (
                    target === main ||
                    target.id === "structureArea" ||
                    target.id === "canvas" ||
                    target.id === "tree"
                ) {

                    clearSelection();

                }

            }
        );

    }


    /*
       底部按钮
    */

    const addPrefaceButton =
        document.getElementById(
            "addPrefaceButton"
        );


    if (addPrefaceButton) {

        addPrefaceButton.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                addRootPreface();

            }
        );

    }


    const addChapterButton =
        document.getElementById(
            "addChapterButton"
        );


    if (addChapterButton) {

        addChapterButton.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                addRootChapter();

            }
        );

    }


    const addPartButton =
        document.getElementById(
            "addPartButton"
        );


    if (addPartButton) {

        addPartButton.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                addRootPart();

            }
        );

    }


    const addVolumeButton =
        document.getElementById(
            "addVolumeButton"
        );


    if (addVolumeButton) {

        addVolumeButton.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                addRootVolume();

            }
        );

    }

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


    const bookTitle =
        document.getElementById(
            "bookTitle"
        );


    if (bookTitle) {

        bookTitle.classList.add(
            "selected"
        );

    }


    const bottomBar =
        document.getElementById(
            "bottomBar"
        );


    if (bottomBar) {

        bottomBar.classList.add(
            "visible"
        );

    }

}


/* ==================================================
   选择节点
================================================== */

function selectNode(node) {

    selectedNodeId =
        node.id;

    selectedIsBook = false;


    const bottomBar =
        document.getElementById(
            "bottomBar"
        );


    if (bottomBar) {

        bottomBar.classList.remove(
            "visible"
        );

    }


    const bookTitle =
        document.getElementById(
            "bookTitle"
        );


    if (bookTitle) {

        bookTitle.classList.remove(
            "selected"
        );

    }


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


    const bottomBar =
        document.getElementById(
            "bottomBar"
        );


    if (bottomBar) {

        bottomBar.classList.remove(
            "visible"
        );

    }


    const bookTitle =
        document.getElementById(
            "bookTitle"
        );


    if (bookTitle) {

        bookTitle.classList.remove(
            "selected"
        );

    }


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


    const canvas =
        document.getElementById(
            "canvas"
        );


    if (!bookNode || !canvas) {

        return;

    }


    const rect =
        bookNode.getBoundingClientRect();


    const canvasRect =
        canvas.getBoundingClientRect();


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


    try {

        bookNode.setPointerCapture(
            event.pointerId
        );

    } catch (error) {}


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

        } else {

            draggingBook = false;

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


    if (!bookNode) {

        return;

    }


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
            Math.max(
                20,
                (rect.width -
                    book.width) / 2
            );


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
            "序"
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
   渲染整个树
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


    if (
        !canvas ||
        !tree ||
        !svg ||
        !currentBook
    ) {

        return;

    }


    /*
       清除旧节点
    */

    tree.innerHTML = "";


    /*
       清除旧 SVG
    */

    svg.innerHTML = "";


    /*
       清除旧的 + / -
    */

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


    if (bookNode) {

        bookNode.style.left =
            layout.book.x +
            "px";


        bookNode.style.top =
            layout.book.y +
            "px";

    }


    /*
       创建所有节点
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
       浏览器完成 DOM 布局后
       再画线

       这样可以获得节点真实尺寸
    */

    requestAnimationFrame(
        function() {

            drawConnections(
                layout
            );

        }
    );


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
            window.innerWidth,
            600
        );


    const nodes = [];

    const subtreeWidths =
        new Map();


    /*
       计算每棵子树宽度
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
                    calculateWidth(
                        child
                    );


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


    /*
       总宽度
    */

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


    /*
       给左右留空间
    */

    const contentWidth =
        Math.max(
            canvasWidth,
            totalWidth + 100
        );


    /*
       ==================================================
       书名
       ==================================================
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
        (
            contentWidth -
            bookWidth
        ) / 2;


    const bookY =
        50;


    /*
       第一层
    */

    const rootY =
        bookY +
        115;


    let currentX =
        (
            contentWidth -
            totalWidth
        ) / 2;


    /*
       ==================================================
       放置节点
       ==================================================
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
            (
                subtreeWidth -
                NODE_WIDTH
            ) / 2;


        nodes.push({

            node: node,

            x: x,

            y: y

        });


        /*
           收起或没有孩子
        */

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

                    y +
                    LEVEL_GAP

                );


                childX +=
                    childWidth +
                    SIBLING_GAP;

            }
        );

    }


    /*
       放置所有根节点
    */

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


    /*
       计算高度
    */

    let maxY =
        rootY +
        NODE_HEIGHT;


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

        width:
            contentWidth,

        height:
            maxY,

        book: {

            x:
                bookX,

            y:
                bookY

        },

        nodes:
            nodes

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
        x +
        "px";


    wrapper.style.top =
        y +
        "px";


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

            selectNode(
                node
            );

        }
    );


    wrapper.appendChild(
        box
    );


    /*
       ==================================================
       操作区域
       ==================================================
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
       ==================================================
       卷
       ==================================================
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
       ==================================================
       篇
       ==================================================
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
   创建操作按钮
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


    if (!svg || !canvas) {

        return;

    }


    /*
       ==================================================
       SVG 尺寸
       ==================================================
    */

    const canvasWidth =
        Math.max(
            canvas.clientWidth,
            layout.width,
            window.innerWidth
        );


    const svgHeight =
        Math.max(
            layout.height + 140,
            canvas.clientHeight
        );


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
       ==================================================
       获取每一个框的真实位置
       ==================================================
    */

    const positions =
        new Map();


    const canvasRect =
        canvas.getBoundingClientRect();


    layout.nodes.forEach(
        function(info) {

            const wrapper =
                document.querySelector(
                    '[data-node-id="' +
                    info.node.id +
                    '"]'
                );


            if (!wrapper) {

                return;

            }


            const box =
                wrapper.querySelector(
                    ".node-box"
                );


            if (!box) {

                return;

            }


            const rect =
                box.getBoundingClientRect();


            positions.set(

                info.node.id,

                {

                    node:
                        info.node,

                    left:
                        rect.left -
                        canvasRect.left,

                    right:
                        rect.right -
                        canvasRect.left,

                    top:
                        rect.top -
                        canvasRect.top,

                    bottom:
                        rect.bottom -
                        canvasRect.top,

                    centerX:
                        rect.left -
                        canvasRect.left +
                        rect.width / 2,

                    centerY:
                        rect.top -
                        canvasRect.top +
                        rect.height / 2,

                    width:
                        rect.width,

                    height:
                        rect.height

                }

            );

        }
    );


    /*
       ==================================================
       创建线
       ==================================================
    */

    function createPath(
        d
    ) {

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
       ==================================================
       书名真实位置
       ==================================================
    */

    const bookElement =
        document.getElementById(
            "bookTitle"
        );


    if (!bookElement) {

        return;

    }


    const bookRect =
        bookElement.getBoundingClientRect();


    const bookLeft =
        bookRect.left -
        canvasRect.left;


    const bookTop =
        bookRect.top -
        canvasRect.top;


    const bookBottom =
        bookRect.bottom -
        canvasRect.top;


    const bookCenterX =
        bookLeft +
        bookRect.width / 2;


    /*
       ==================================================
       根节点
       ==================================================
    */

    const roots =
        currentBook.structure;


    if (
        roots.length === 0
    ) {

        return;

    }


    /*
       ==================================================
       书名 → 一个根节点
       ==================================================
    */

    if (
        roots.length === 1
    ) {

        const child =
            positions.get(
                roots[0].id
            );


        if (child) {

            const childX =
                child.centerX;


            const childTop =
                child.top;


            const branchY =
                bookBottom +
                (
                    childTop -
                    bookBottom
                ) / 2;


            createPath(

                "M " +
                bookCenterX +
                " " +
                bookBottom +

                " L " +
                bookCenterX +
                " " +
                branchY +

                " L " +
                childX +
                " " +
                branchY +

                " L " +
                childX +
                " " +
                childTop

            );

        }

    }


    /*
       ==================================================
       书名 → 多个根节点
       ==================================================
    */

    if (
        roots.length > 1
    ) {

        const visibleRoots =
            roots
                .map(
                    function(root) {

                        return positions.get(
                            root.id
                        );

                    }
                )
                .filter(
                    function(item) {

                        return !!item;

                    }
                );


        if (
            visibleRoots.length > 0
        ) {

            const first =
                visibleRoots[0];


            const last =
                visibleRoots[
                    visibleRoots.length - 1
                ];


            const firstX =
                first.centerX;


            const lastX =
                last.centerX;


            const branchY =
                bookBottom +
                (
                    first.top -
                    bookBottom
                ) / 2;


            /*
               书名 ↓
            */

            createPath(

                "M " +
                bookCenterX +
                " " +
                bookBottom +

                " L " +
                bookCenterX +
                " " +
                branchY

            );


            /*
               横向总分支
            */

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


            /*
               分别连接根节点
            */

            visibleRoots.forEach(
                function(root) {

                    createPath(

                        "M " +
                        root.centerX +
                        " " +
                        branchY +

                        " L " +
                        root.centerX +
                        " " +
                        root.top

                    );

                }
            );

        }

    }


    /*
       ==================================================
       父节点 → 子节点
       ==================================================
    */

    layout.nodes.forEach(
        function(info) {

            const node =
                info.node;


            /*
               收起的节点不画下级
            */

            if (
                node.collapsed
            ) {

                return;

            }


            if (
                !node.children ||
                node.children.length === 0
            ) {

                return;

            }


            const parent =
                positions.get(
                    node.id
                );


            if (!parent) {

                return;

            }


            /*
               获取实际存在的孩子
            */

            const children =
                node.children
                    .map(
                        function(child) {

                            return positions.get(
                                child.id
                            );

                        }
                    )
                    .filter(
                        function(item) {

                            return !!item;

                        }
                    );


            if (
                children.length === 0
            ) {

                return;

            }


            /*
               父节点底部
            */

            const parentX =
                parent.centerX;


            const parentY =
                parent.bottom;


            /*
               ==================================================
               一个孩子
               ==================================================
            */

            if (
                children.length === 1
            ) {

                const child =
                    children[0];


                const childX =
                    child.centerX;


                const childY =
                    child.top;


                const branchY =
                    parentY +
                    (
                        childY -
                        parentY
                    ) / 2;


                /*
                   父框
                     │
                     │
                     ├────────
                              │
                              │
                            子框
                */

                createPath(

                    "M " +
                    parentX +
                    " " +
                    parentY +

                    " L " +
                    parentX +
                    " " +
                    branchY +

                    " L " +
                    childX +
                    " " +
                    branchY +

                    " L " +
                    childX +
                    " " +
                    childY

                );


                /*
                   ＋ / −
                */

                addLineControl(

                    branchY,

                    parentX,

                    childX,

                    node

                );

            }


            /*
               ==================================================
               多个孩子
               ==================================================
            */

            else {

                const first =
                    children[0];


                const last =
                    children[
                        children.length - 1
                    ];


                const firstX =
                    first.centerX;


                const lastX =
                    last.centerX;


                const childY =
                    first.top;


                const branchY =
                    parentY +
                    (
                        childY -
                        parentY
                    ) / 2;


                /*
                   父框
                     │
                     │
                     │
                 ────┼────────────
                 │   │     │     │
                 ▼   ▼     ▼     ▼
                 子1 子2   子3   子4
                */


                /*
                   父框 → 横向分支
                */

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


                /*
                   横向线
                */

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


                /*
                   横向线 → 每个子框
                */

                children.forEach(
                    function(child) {

                        createPath(

                            "M " +
                            child.centerX +
                            " " +
                            branchY +

                            " L " +
                            child.centerX +
                            " " +
                            child.top

                        );

                    }
                );


                /*
                   ＋ / −
                */

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


    control.type =
        "button";


    control.textContent =
        node.collapsed
            ? "+"
            : "−";


    /*
       放在线的中点
    */

    const x =
        x1 +
        (
            x2 -
            x1
        ) / 2;


    control.style.left =
        (
            x -
            12
        ) +
        "px";


    control.style.top =
        (
            y -
            12
        ) +
        "px";


    control.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

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

    selectNode(
        newNode
    );

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

    selectNode(
        newNode
    );

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

                array:
                    array,

                node:
                    array[i]

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


    if (!button || !currentBook) {

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
