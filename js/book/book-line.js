/* ======================================================
   全书连接线模块
====================================================== */


/* ======================================================
   基础元素
====================================================== */

const connections =
    document.getElementById("connections");

const workspace =
    document.getElementById("workspace");


/* ======================================================
   整棵书名树的展开状态

   true  = 展开
   false = 收起
====================================================== */

let bookTreeExpanded = true;


/* ======================================================
   普通节点展开状态
====================================================== */

const connectionStates = {};


/* ======================================================
   SVG 坐标转换
====================================================== */

function getSVGPointFromScreen(
    screenX,
    screenY
) {

    if (!connections) {
        return null;
    }


    const point =
        connections.createSVGPoint();


    point.x =
        screenX;

    point.y =
        screenY;


    const matrix =
        connections.getScreenCTM();


    if (!matrix) {
        return null;
    }


    return point.matrixTransform(
        matrix.inverse()
    );

}


/* ======================================================
   获取元素边界
====================================================== */

function getElementBounds(
    element
) {

    if (!element) {
        return null;
    }


    const rect =
        element.getBoundingClientRect();


    const topLeft =
        getSVGPointFromScreen(
            rect.left,
            rect.top
        );


    const bottomRight =
        getSVGPointFromScreen(
            rect.right,
            rect.bottom
        );


    if (
        !topLeft ||
        !bottomRight
    ) {
        return null;
    }


    return {

        left:
            topLeft.x,

        right:
            bottomRight.x,

        top:
            topLeft.y,

        bottom:
            bottomRight.y,

        centerX:
            (
                topLeft.x +
                bottomRight.x
            ) / 2,

        centerY:
            (
                topLeft.y +
                bottomRight.y
            ) / 2

    };

}


/* ======================================================
   创建 SVG 线
====================================================== */

function createLine(
    x1,
    y1,
    x2,
    y2
) {

    if (!connections) {
        return;
    }


    const line =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );


    line.setAttribute(
        "x1",
        x1
    );

    line.setAttribute(
        "y1",
        y1
    );

    line.setAttribute(
        "x2",
        x2
    );

    line.setAttribute(
        "y2",
        y2
    );


    line.setAttribute(
        "stroke",
        "#888888"
    );

    line.setAttribute(
        "stroke-width",
        "3"
    );

    line.setAttribute(
        "stroke-linecap",
        "round"
    );


    line.style.pointerEvents =
        "none";


    connections.appendChild(
        line
    );

}


/* ======================================================
   创建 + / - 按钮
====================================================== */

function createToggleButton(
    stateKey,
    x,
    y,
    isExpanded,
    onToggle
) {

    if (!connections) {
        return;
    }


    /* ==================================================
       点击区域
    ================================================== */

    const hitArea =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );


    hitArea.setAttribute(
        "cx",
        x
    );

    hitArea.setAttribute(
        "cy",
        y
    );

    hitArea.setAttribute(
        "r",
        "24"
    );

    hitArea.setAttribute(
        "fill",
        "transparent"
    );

    hitArea.setAttribute(
        "stroke",
        "transparent"
    );

    hitArea.setAttribute(
        "pointer-events",
        "all"
    );


    hitArea.style.pointerEvents =
        "all";

    hitArea.style.cursor =
        "pointer";


    hitArea.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            if (
                typeof onToggle ===
                "function"
            ) {

                onToggle();

            }

        }
    );


    connections.appendChild(
        hitArea
    );


    /* ==================================================
       白色圆
    ================================================== */

    const circle =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );


    circle.setAttribute(
        "cx",
        x
    );

    circle.setAttribute(
        "cy",
        y
    );

    circle.setAttribute(
        "r",
        "11"
    );

    circle.setAttribute(
        "fill",
        "#ffffff"
    );

    circle.setAttribute(
        "stroke",
        "#888888"
    );

    circle.setAttribute(
        "stroke-width",
        "2"
    );


    circle.style.pointerEvents =
        "none";


    connections.appendChild(
        circle
    );


    /* ==================================================
       横线
       -
    ================================================== */

    const horizontal =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );


    horizontal.setAttribute(
        "x1",
        x - 6
    );

    horizontal.setAttribute(
        "y1",
        y
    );

    horizontal.setAttribute(
        "x2",
        x + 6
    );

    horizontal.setAttribute(
        "y2",
        y
    );

    horizontal.setAttribute(
        "stroke",
        "#222222"
    );

    horizontal.setAttribute(
        "stroke-width",
        "2"
    );

    horizontal.setAttribute(
        "stroke-linecap",
        "round"
    );


    horizontal.style.pointerEvents =
        "none";


    connections.appendChild(
        horizontal
    );


    /* ==================================================
       收起状态显示 +
    ================================================== */

    if (!isExpanded) {

        const vertical =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
            );


        vertical.setAttribute(
            "x1",
            x
        );

        vertical.setAttribute(
            "y1",
            y - 6
        );

        vertical.setAttribute(
            "x2",
            x
        );

        vertical.setAttribute(
            "y2",
            y + 6
        );


        vertical.setAttribute(
            "stroke",
            "#222222"
        );

        vertical.setAttribute(
            "stroke-width",
            "2"
        );

        vertical.setAttribute(
            "stroke-linecap",
            "round"
        );


        vertical.style.pointerEvents =
            "none";


        connections.appendChild(
            vertical
        );

    }

}


/* ======================================================
   获取节点元素
====================================================== */

function getNodeElement(
    nodeId
) {

    return document.querySelector(
        '.node[data-id="' +
        nodeId +
        '"]'
    );

}


/* ======================================================
   获取子节点
====================================================== */

function getChildren(
    parentId
) {

    if (
        !currentBook ||
        !Array.isArray(
            currentBook.nodes
        )
    ) {

        return [];

    }


    return currentBook.nodes.filter(
        function (node) {

            return (
                String(node.parentId) ===
                String(parentId)
            );

        }
    );

}


/* ======================================================
   获取根节点
====================================================== */

function getRootNodes() {

    if (
        !currentBook ||
        !Array.isArray(
            currentBook.nodes
        )
    ) {

        return [];

    }


    return currentBook.nodes.filter(
        function (node) {

            return (
                node.parentId === null ||
                node.parentId === undefined
            );

        }
    );

}


/* ======================================================
   书名树：纵向

   第一卷固定在书名正下方

   新卷向左增加：

           书名
            │
   第三卷 ─ 第二卷 ─ 第一卷
====================================================== */

function renderBookTreeVertical(
    bookElement,
    rootNodes
) {

    if (
        !bookElement ||
        rootNodes.length === 0
    ) {

        return;

    }


    if (!bookTreeExpanded) {

        return;

    }


    const bookBounds =
        getElementBounds(
            bookElement
        );


    if (!bookBounds) {
        return;
    }


    /* ==================================================
       第一卷 / 最右边根节点
    ================================================== */

    const firstRoot =
        rootNodes[0];


    const firstElement =
        getNodeElement(
            firstRoot.id
        );


    if (!firstElement) {
        return;
    }


    const firstBounds =
        getElementBounds(
            firstElement
        );


    if (!firstBounds) {
        return;
    }


    /* ==================================================
       书名 → 第一卷

       书名永远只连接第一卷
    ================================================== */

    createLine(

        bookBounds.centerX,

        bookBounds.bottom,

        firstBounds.centerX,

        firstBounds.top

    );


    /* ==================================================
       后续根节点

       向左连接
    ================================================== */

    for (
        let index = 1;
        index < rootNodes.length;
        index++
    ) {

        const currentRoot =
            rootNodes[index];


        const previousRoot =
            rootNodes[index - 1];


        const currentElement =
            getNodeElement(
                currentRoot.id
            );


        const previousElement =
            getNodeElement(
                previousRoot.id
            );


        if (
            !currentElement ||
            !previousElement
        ) {

            continue;

        }


        const currentBounds =
            getElementBounds(
                currentElement
            );


        const previousBounds =
            getElementBounds(
                previousElement
            );


        if (
            !currentBounds ||
            !previousBounds
        ) {

            continue;

        }


        /* ==============================================
           第一卷 ← 第二卷 ← 第三卷
        ============================================== */

        createLine(

            currentBounds.right,

            currentBounds.centerY,

            previousBounds.left,

            previousBounds.centerY

        );

    }


    /* ==================================================
       整棵书名树唯一的 + / -
       
       放在书名 → 第一卷的连接线上
    ================================================== */

    const toggleX =
        (
            bookBounds.centerX +
            firstBounds.centerX
        ) / 2;


    const toggleY =
        (
            bookBounds.bottom +
            firstBounds.top
        ) / 2;


    createToggleButton(

        "book-tree",

        toggleX,

        toggleY,

        bookTreeExpanded,

        function () {

            bookTreeExpanded =
                !bookTreeExpanded;


            refreshConnections();

        }

    );

}


/* ======================================================
   书名树：横向

   第一卷固定在书名正右方

   新卷向下增加：

        书名 → 第一卷
                    │
                    ↓
                 第二卷
                    │
                    ↓
                 第三卷

   注意：
   用户要求横向时同级节点上下排列。
====================================================== */

function renderBookTreeHorizontal(
    bookElement,
    rootNodes
) {

    if (
        !bookElement ||
        rootNodes.length === 0
    ) {

        return;

    }


    if (!bookTreeExpanded) {

        return;

    }


    const bookBounds =
        getElementBounds(
            bookElement
        );


    if (!bookBounds) {
        return;
    }


    const firstRoot =
        rootNodes[0];


    const firstElement =
        getNodeElement(
            firstRoot.id
        );


    if (!firstElement) {
        return;
    }


    const firstBounds =
        getElementBounds(
            firstElement
        );


    if (!firstBounds) {
        return;
    }


    /* ==================================================
       书名 → 第一卷
    ================================================== */

    createLine(

        bookBounds.right,

        bookBounds.centerY,

        firstBounds.left,

        firstBounds.centerY

    );


    /* ==================================================
       后续根节点向下
    ================================================== */

    for (
        let index = 1;
        index < rootNodes.length;
        index++
    ) {

        const currentRoot =
            rootNodes[index];


        const previousRoot =
            rootNodes[index - 1];


        const currentElement =
            getNodeElement(
                currentRoot.id
            );


        const previousElement =
            getNodeElement(
                previousRoot.id
            );


        if (
            !currentElement ||
            !previousElement
        ) {

            continue;

        }


        const currentBounds =
            getElementBounds(
                currentElement
            );


        const previousBounds =
            getElementBounds(
                previousElement
            );


        if (
            !currentBounds ||
            !previousBounds
        ) {

            continue;

        }


        createLine(

            previousBounds.centerX,

            previousBounds.bottom,

            currentBounds.centerX,

            currentBounds.top

        );

    }


    /* ==================================================
       唯一 + / -
    ================================================== */

    const toggleX =
        (
            bookBounds.right +
            firstBounds.left
        ) / 2;


    const toggleY =
        (
            bookBounds.centerY +
            firstBounds.centerY
        ) / 2;


    createToggleButton(

        "book-tree",

        toggleX,

        toggleY,

        bookTreeExpanded,

        function () {

            bookTreeExpanded =
                !bookTreeExpanded;


            refreshConnections();

        }

    );

}


/* ======================================================
   普通节点树
====================================================== */

function renderNormalBranch(
    parentElement,
    children
) {

    if (
        !parentElement ||
        !children ||
        children.length === 0
    ) {

        return;

    }


    const parentBounds =
        getElementBounds(
            parentElement
        );


    if (!parentBounds) {
        return;
    }


    children.forEach(
        function (child) {

            const childElement =
                getNodeElement(
                    child.id
                );


            if (!childElement) {
                return;
            }


            const childBounds =
                getElementBounds(
                    childElement
                );


            if (!childBounds) {
                return;
            }


            const isHorizontal =
                typeof currentLayout !==
                "undefined" &&
                currentLayout ===
                "horizontal";


            if (isHorizontal) {

                createLine(

                    parentBounds.right,

                    parentBounds.centerY,

                    childBounds.left,

                    childBounds.centerY

                );

            } else {

                createLine(

                    parentBounds.centerX,

                    parentBounds.bottom,

                    childBounds.centerX,

                    childBounds.top

                );

            }


            /* ==========================================
               继续子树
            ========================================== */

            const childrenOfChild =
                getChildren(
                    child.id
                );


            if (
                childrenOfChild.length > 0
            ) {

                renderNormalBranch(

                    childElement,

                    childrenOfChild

                );

            }

        }
    );

}


/* ======================================================
   清除连接线
====================================================== */

function clearConnections() {

    if (!connections) {
        return;
    }


    connections.innerHTML = "";

}


/* ======================================================
   绘制全部连接线
====================================================== */

function renderConnections() {

    if (
        !connections ||
        !workspace ||
        !currentBook
    ) {

        return;

    }


    clearConnections();


    /* ==================================================
       SVG
    ================================================== */

    connections.setAttribute(
        "width",
        "3000"
    );


    connections.setAttribute(
        "height",
        "3000"
    );


    connections.setAttribute(
        "viewBox",
        "0 0 3000 3000"
    );


    /* ==================================================
       书名
    ================================================== */

    const bookElement =
        document.getElementById(
            "bookTitle"
        );


    if (!bookElement) {
        return;
    }


    /* ==================================================
       根节点
    ================================================== */

    const rootNodes =
        getRootNodes();


    if (
        rootNodes.length === 0
    ) {

        return;

    }


    /* ==================================================
       书名树
    ================================================== */

    if (
        typeof currentLayout !==
        "undefined" &&
        currentLayout ===
        "horizontal"
    ) {

        renderBookTreeHorizontal(

            bookElement,

            rootNodes

        );

    } else {

        renderBookTreeVertical(

            bookElement,

            rootNodes

        );

    }


    /* ==================================================
       书名树下面的普通子树
    ================================================== */

    if (!bookTreeExpanded) {
        return;
    }


    rootNodes.forEach(
        function (rootNode) {

            const rootElement =
                getNodeElement(
                    rootNode.id
                );


            if (!rootElement) {
                return;
            }


            const children =
                getChildren(
                    rootNode.id
                );


            if (
                children.length === 0
            ) {

                return;

            }


            renderNormalBranch(

                rootElement,

                children

            );

        }
    );

}


/* ======================================================
   刷新连接线
====================================================== */

function refreshConnections() {

    requestAnimationFrame(
        function () {

            renderConnections();

        }
    );

}


/* ======================================================
   页面加载
====================================================== */

requestAnimationFrame(
    function () {

        refreshConnections();

    }
);
