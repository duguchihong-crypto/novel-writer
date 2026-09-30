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
   连接线中点位置

   记录每条连接线自己的 + / - 位置。

   这样节点隐藏以后，
   + / - 不会因为隐藏节点而跳走。
====================================================== */

const connectionPositions = {};


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
   获取元素实际中心
====================================================== */

function getElementCenter(element) {

    if (
        !element ||
        !workspace
    ) {
        return null;
    }


    const elementRect =
        element.getBoundingClientRect();

    const workspaceRect =
        workspace.getBoundingClientRect();


    return {

        x:
            elementRect.left -
            workspaceRect.left +
            elementRect.width / 2,

        y:
            elementRect.top -
            workspaceRect.top +
            elementRect.height / 2

    };

}


/* ======================================================
   获取元素边缘连接点

   直接读取元素实际显示出来的矩形边界。

   节点使用：

   transform:
   translate(-50%, -50%);

   所以使用实际渲染后的矩形计算。
====================================================== */

function getElementBoundaryPoint(
    element,
    target
) {

    if (
        !element ||
        !workspace ||
        !target
    ) {
        return null;
    }


    const elementRect =
        element.getBoundingClientRect();

    const workspaceRect =
        workspace.getBoundingClientRect();


    /* ==================================================
       节点实际边界
    ================================================== */

    const left =
        elementRect.left -
        workspaceRect.left;

    const right =
        elementRect.right -
        workspaceRect.left;

    const top =
        elementRect.top -
        workspaceRect.top;

    const bottom =
        elementRect.bottom -
        workspaceRect.top;


    /* ==================================================
       节点实际中心
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
       中心 → 目标方向
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
       计算与矩形边缘的交点
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
        !workspace ||
        !startElement ||
        !endElement
    ) {
        return;
    }


    /* ==================================================
       节点 ID
    ================================================== */

    const nodeId =
        String(
            endElement.dataset.id
        );


    /* ==================================================
       当前展开状态
    ================================================== */

    const isExpanded =
        connectionStates[nodeId] !== false;


    /* ==================================================
       获取书名中心
    ================================================== */

    const start =
        getElementCenter(
            startElement
        );


    if (!start) {
        return;
    }


    /* ==================================================
       获取节点中心

       只有节点显示时才重新读取。

       如果节点已经隐藏，
       使用之前保存的连接线中点。
    ================================================== */

    let end = null;

    if (isExpanded) {

        end =
            getElementCenter(
                endElement
            );

    }


    /* ==================================================
       计算连接线中点
    ================================================== */

    let middleX;
    let middleY;


    /* ==================================================
       展开状态

       节点存在，所以根据当前实际位置计算。

       同时保存中点。
    ================================================== */

    if (
        isExpanded &&
        end
    ) {

        middleX =
            (
                start.x +
                end.x
            ) / 2;

        middleY =
            (
                start.y +
                end.y
            ) / 2;


        connectionPositions[nodeId] = {

            x: middleX,
            y: middleY

        };

    }


    /* ==================================================
       收起状态

       不再读取隐藏节点的位置。

       直接使用之前保存的中点。
    ================================================== */

    else {

        const savedPosition =
            connectionPositions[nodeId];


        if (savedPosition) {

            middleX =
                savedPosition.x;

            middleY =
                savedPosition.y;

        }

        else {

            /*
             * 理论上只有第一次就处于隐藏状态
             * 才会进入这里。
             *
             * 为了防止异常，
             * 使用书名中心作为备用位置。
             */

            middleX =
                start.x;

            middleY =
                start.y;

        }

    }


    /* ==================================================
       展开状态

       书名边缘
          ↓
       节点边缘

       连接线不会进入节点内部。
    ================================================== */

    if (isExpanded && end) {

        const startPoint =
            getElementBoundaryPoint(
                startElement,
                end
            );

        const endPoint =
            getElementBoundaryPoint(
                endElement,
                start
            );


        if (
            startPoint &&
            endPoint
        ) {

            createLine(
                startPoint.x,
                startPoint.y,
                endPoint.x,
                endPoint.y
            );

        }

    }


    /* ==================================================
       收起状态

       书名边缘
          ↓
          +
       
       + 的位置使用保存的中点。
    ================================================== */

    else {

        const startPoint =
            getElementBoundaryPoint(
                startElement,
                {
                    x: middleX,
                    y: middleY
                }
            );


        if (startPoint) {

            createLine(
                startPoint.x,
                startPoint.y,
                middleX,
                middleY
            );

        }

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
        middleX
    );

    hitArea.setAttribute(
        "cy",
        middleY
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
        middleX
    );

    circle.setAttribute(
        "cy",
        middleY
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
        middleX - 6
    );

    horizontal.setAttribute(
        "y1",
        middleY
    );

    horizontal.setAttribute(
        "x2",
        middleX + 6
    );

    horizontal.setAttribute(
        "y2",
        middleY
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
       ＋竖线
    ================================================== */

    if (!isExpanded) {

        const vertical =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
            );


        vertical.setAttribute(
            "x1",
            middleX
        );

        vertical.setAttribute(
            "y1",
            middleY - 6
        );

        vertical.setAttribute(
            "x2",
            middleX
        );

        vertical.setAttribute(
            "y2",
            middleY + 6
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


            /* ==================================================
               第一次出现默认展开
            ================================================== */

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
   页面加载完成后绘制
====================================================== */

requestAnimationFrame(
    function () {

        refreshConnections();

    }
);
