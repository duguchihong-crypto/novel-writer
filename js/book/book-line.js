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
        connections
            .getScreenCTM();

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
   获取元素边缘连接点
====================================================== */

function getElementBoundaryPoint(
    element,
    target
) {

    if (
        !element ||
        !target
    ) {
        return null;
    }


    const rect =
        element.getBoundingClientRect();


    /* ==================================================
       先把元素四个边界转换成 SVG 坐标
    ================================================== */

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


    const left =
        topLeft.x;

    const right =
        bottomRight.x;

    const top =
        topLeft.y;

    const bottom =
        bottomRight.y;


    /* ==================================================
       中心
    ================================================== */

    const centerX =
        (
            left +
            right
        ) / 2;

    const centerY =
        (
            top +
            bottom
        ) / 2;


    /* ==================================================
       中心 → 目标
    ================================================== */

    const dx =
        target.x -
        centerX;

    const dy =
        target.y -
        centerY;


    if (
        dx === 0 &&
        dy === 0
    ) {

        return {

            x: centerX,
            y: centerY

        };

    }


    /* ==================================================
       半宽 / 半高
    ================================================== */

    const halfWidth =
        (
            right -
            left
        ) / 2;

    const halfHeight =
        (
            bottom -
            top
        ) / 2;


    /* ==================================================
       矩形边缘比例
    ================================================== */

    const scaleX =
        dx === 0
            ? Infinity
            : halfWidth /
              Math.abs(dx);

    const scaleY =
        dy === 0
            ? Infinity
            : halfHeight /
              Math.abs(dy);


    const scale =
        Math.min(
            scaleX,
            scaleY
        );


    return {

        x:
            centerX +
            dx * scale,

        y:
            centerY +
            dy * scale

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
   创建连接线
====================================================== */

function createConnectionLine(
    startElement,
    endElement
) {

    if (
        !connections ||
        !startElement ||
        !endElement
    ) {
        return;
    }


    const nodeId =
        String(
            endElement.dataset.id
        );


    /* ==================================================
       当前状态
    ================================================== */

    const isExpanded =
        connectionStates[nodeId] !== false;


    /* ==================================================
       展开状态
    ================================================== */

    if (isExpanded) {

        const start =
            getElementCenter(
                startElement
            );

        const end =
            getElementCenter(
                endElement
            );


        if (
            !start ||
            !end
        ) {
            return;
        }


        /* ==================================================
           中点
        ================================================== */

        const middleX =
            (
                start.x +
                end.x
            ) / 2;

        const middleY =
            (
                start.y +
                end.y
            ) / 2;


        /* ==================================================
           起点
        ================================================== */

        const startPoint =
            getElementBoundaryPoint(
                startElement,
                end
            );


        /* ==================================================
           终点
        ================================================== */

        const endPoint =
            getElementBoundaryPoint(
                endElement,
                start
            );


        if (
            !startPoint ||
            !endPoint
        ) {
            return;
        }


        /* ==================================================
           保存
        ================================================== */

        connectionPositions[nodeId] = {

            startX:
                startPoint.x,

            startY:
                startPoint.y,

            middleX:
                middleX,

            middleY:
                middleY,

            endX:
                endPoint.x,

            endY:
                endPoint.y

        };


        const position =
            connectionPositions[nodeId];


        /* ==================================================
           完整连接线
        ================================================== */

        createLine(

            position.startX,
            position.startY,

            position.endX,
            position.endY

        );

    }


    /* ==================================================
       收起状态
    ================================================== */

    else {

        const position =
            connectionPositions[nodeId];


        if (!position) {
            return;
        }


        /* ==================================================
           只画：

           书名 → +

           不再读取隐藏节点。
        ================================================== */

        createLine(

            position.startX,
            position.startY,

            position.middleX,
            position.middleY

        );

    }


    /* ==================================================
       获取固定位置
    ================================================== */

    const position =
        connectionPositions[nodeId];


    if (!position) {
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
        position.middleX
    );

    hitArea.setAttribute(
        "cy",
        position.middleY
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
       点击 + / -
    ================================================== */

    hitArea.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            /* ==========================================
               切换状态
            ========================================== */

            connectionStates[nodeId] =
                !isExpanded;


            /* ==========================================
               找到节点
            ========================================== */

            const nodeElement =
                document.querySelector(
                    '.node[data-id="' +
                    nodeId +
                    '"]'
                );


            /* ==========================================
               显示 / 隐藏
            ========================================== */

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


            /* ==========================================
               重新绘制
            ========================================== */

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
        position.middleX
    );

    circle.setAttribute(
        "cy",
        position.middleY
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
    ================================================== */

    const horizontal =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );


    horizontal.setAttribute(
        "x1",
        position.middleX - 6
    );

    horizontal.setAttribute(
        "y1",
        position.middleY
    );

    horizontal.setAttribute(
        "x2",
        position.middleX + 6
    );

    horizontal.setAttribute(
        "y2",
        position.middleY
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
       收起状态：

       + 

       展开状态：

       -
    ================================================== */

    if (!isExpanded) {

        const vertical =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
            );


        vertical.setAttribute(
            "x1",
            position.middleX
        );

        vertical.setAttribute(
            "y1",
            position.middleY - 6
        );

        vertical.setAttribute(
            "x2",
            position.middleX
        );

        vertical.setAttribute(
            "y2",
            position.middleY + 6
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


    const bookElement =
        document.getElementById(
            "bookTitle"
        );


    if (!bookElement) {
        return;
    }


    const nodes =
        Array.isArray(
            currentBook.nodes
        )
            ? currentBook.nodes
            : [];


    nodes.forEach(
        function (node) {

            /* ==========================================
               目前只处理根节点
            ========================================== */

            if (
                node.parentId !== null &&
                node.parentId !== undefined
            ) {
                return;
            }


            const nodeElement =
                document.querySelector(
                    '.node[data-id="' +
                    node.id +
                    '"]'
                );


            if (!nodeElement) {
                return;
            }


            /* ==========================================
               第一次默认展开
            ========================================== */

            if (
                connectionStates[
                    String(node.id)
                ] === undefined
            ) {

                connectionStates[
                    String(node.id)
                ] = true;

            }


            createConnectionLine(

                bookElement,

                nodeElement

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
