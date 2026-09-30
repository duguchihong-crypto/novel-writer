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
   连接线展开状态
====================================================== */

const connectionStates = {};


/* ======================================================
   连接线固定位置
====================================================== */

const connectionPositions = {};


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

    point.x = screenX;
    point.y = screenY;

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
   获取元素中心
====================================================== */

function getElementCenter(element) {

    if (!element) {
        return null;
    }

    const rect =
        element.getBoundingClientRect();

    return getSVGPointFromScreen(

        rect.left +
        rect.width / 2,

        rect.top +
        rect.height / 2

    );
}


/* ======================================================
   获取元素边界
====================================================== */

function getElementBounds(element) {

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

        left: topLeft.x,

        right: bottomRight.x,

        top: topLeft.y,

        bottom: bottomRight.y,

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
   创建展开 / 收起按钮
====================================================== */

function createToggleButton(
    nodeId,
    x,
    y,
    isExpanded
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
        "22"
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


    /* ==================================================
       点击
    ================================================== */

    hitArea.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            connectionStates[nodeId] =
                !isExpanded;


            const nodeElement =
                document.querySelector(
                    '.node[data-id="' +
                    nodeId +
                    '"]'
                );


            if (nodeElement) {

                if (
                    connectionStates[nodeId]
                ) {

                    nodeElement.style.display =
                        "flex";

                } else {

                    nodeElement.style.display =
                        "none";

                }

            }


            refreshConnections();

        }
    );


    connections.appendChild(
        hitArea
    );


    /* ==================================================
       背景圆
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
       +
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
   获取节点
====================================================== */

function getNodeElement(nodeId) {

    return document.querySelector(
        '.node[data-id="' +
        nodeId +
        '"]'
    );

}


/* ======================================================
   获取子节点
====================================================== */

function getChildren(parentId) {

    if (
        !currentBook ||
        !Array.isArray(currentBook.nodes)
    ) {
        return [];
    }

    return currentBook.nodes.filter(
        function (node) {

            return String(node.parentId) ===
                String(parentId);

        }
    );

}


/* ======================================================
   绘制一个父节点的树状分支
====================================================== */

function renderBranch(
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


    /* ==================================================
       父节点位置
    ================================================== */

    const parentBounds =
        getElementBounds(
            parentElement
        );

    if (!parentBounds) {
        return;
    }


    /* ==================================================
       获取所有子节点位置
    ================================================== */

    const childData = [];


    children.forEach(
        function (child) {

            const nodeId =
                String(child.id);

            const element =
                getNodeElement(
                    nodeId
                );


            /* ==========================================
               第一次默认展开
            ========================================== */

            if (
                connectionStates[nodeId] ===
                undefined
            ) {

                connectionStates[nodeId] =
                    true;

            }


            const isExpanded =
                connectionStates[nodeId];


            const bounds =
                element
                    ? getElementBounds(
                        element
                    )
                    : null;


            /* ==========================================
               可见节点
            ========================================== */

            if (bounds) {

                childData.push({

                    node: child,

                    element: element,

                    bounds: bounds,

                    visible: true,

                    expanded: isExpanded

                });

                return;

            }


            /* ==========================================
               隐藏节点

               使用之前保存的位置
            ========================================== */

            const saved =
                connectionPositions[
                    nodeId
                ];


            if (saved) {

                childData.push({

                    node: child,

                    element: null,

                    bounds: {

                        left:
                            saved.endX,

                        right:
                            saved.endX,

                        top:
                            saved.endY,

                        bottom:
                            saved.endY,

                        centerX:
                            saved.endX,

                        centerY:
                            saved.endY

                    },

                    visible: false,

                    expanded: false

                });

            }

        }
    );


    if (childData.length === 0) {
        return;
    }


    /* ==================================================
       子节点横向位置
    ================================================== */

    const childXs =
        childData.map(
            function (item) {

                return item.bounds.centerX;

            }
        );


    const minX =
        Math.min.apply(
            null,
            childXs
        );

    const maxX =
        Math.max.apply(
            null,
            childXs
        );


    /* ==================================================
       分支横线高度

       父节点下面留出空间
    ================================================== */

    const branchY =
        parentBounds.bottom + 70;


    /* ==================================================
       父节点 → 横向分支中心
    ================================================== */

    const centerX =
        (
            minX +
            maxX
        ) / 2;


    createLine(

        parentBounds.centerX,

        parentBounds.bottom,

        parentBounds.centerX,

        branchY

    );


    /* ==================================================
       横向分支线
    ================================================== */

    if (childData.length > 1) {

        createLine(

            minX,

            branchY,

            maxX,

            branchY

        );

    }


    /* ==================================================
       每个子节点的竖线
    ================================================== */

    childData.forEach(
        function (item) {

            const node =
                item.node;

            const nodeId =
                String(node.id);

            const bounds =
                item.bounds;

            const childX =
                bounds.centerX;


            /* ==========================================
               横线 → 子节点
            ========================================== */

            const childTop =
                item.visible
                    ? bounds.top
                    : branchY;


            if (
                Math.abs(
                    childX -
                    centerX
                ) < 0.5 &&
                childData.length === 1
            ) {

                /* ======================================
                   只有一个子节点

                   直接连接
                ====================================== */

                createLine(

                    parentBounds.centerX,

                    parentBounds.bottom,

                    childX,

                    childTop

                );

            } else {

                createLine(

                    childX,

                    branchY,

                    childX,

                    childTop

                );

            }


            /* ==========================================
               保存连接位置
            ========================================== */

            const toggleY =
                branchY +
                (
                    childTop -
                    branchY
                ) / 2;


            connectionPositions[nodeId] = {

                startX:
                    parentBounds.centerX,

                startY:
                    parentBounds.bottom,

                middleX:
                    childX,

                middleY:
                    toggleY,

                endX:
                    childX,

                endY:
                    childTop

            };


            /* ==========================================
               显示 +/- 
            ========================================== */

            createToggleButton(

                nodeId,

                childX,

                toggleY,

                item.expanded

            );

        }
    );


    /* ==================================================
       递归绘制子节点
    ================================================== */

    childData.forEach(
        function (item) {

            if (!item.visible) {
                return;
            }

            const childrenOfChild =
                getChildren(
                    item.node.id
                );


            if (
                childrenOfChild.length === 0
            ) {
                return;
            }


            renderBranch(

                item.element,

                childrenOfChild

            );

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
       SVG 尺寸
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
        currentBook.nodes.filter(
            function (node) {

                return (
                    node.parentId === null ||
                    node.parentId === undefined
                );

            }
        );


    if (rootNodes.length === 0) {
        return;
    }


    /* ==================================================
       书名 → 根节点

       使用统一树状分支
    ================================================== */

    renderBranch(

        bookElement,

        rootNodes

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
