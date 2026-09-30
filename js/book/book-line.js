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

   每一条连接线都会保存：

   startX / startY
   书名或父节点的连接起点

   middleX / middleY
   + / - 的位置

   endX / endY
   子节点连接终点

   收起以后完全使用这里保存的位置。

   不再根据隐藏节点重新计算。
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

   所以必须使用实际渲染后的矩形。
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
       实际边界
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
       实际中心
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
       矩形半宽 / 半高
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
       计算边缘交点
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
       当前状态
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
       保存的连接位置
    ================================================== */

    let position =
        connectionPositions[nodeId];


    /* ==================================================
       展开状态
       
       只有这里允许重新计算。
    ================================================== */

    if (isExpanded) {

        const end =
            getElementCenter(
                endElement
            );


        if (!end) {
            return;
        }


        /* ==================================================
           计算中点
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
           计算书名边缘
        ================================================== */

        const startPoint =
            getElementBoundaryPoint(
                startElement,
                end
            );


        /* ==================================================
           计算节点边缘
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
           完整保存

           起点
           中点
           终点

           后面收起时全部使用这里的数据。
        ================================================== */

        position = {

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


        connectionPositions[nodeId] =
            position;


        /* ==================================================
           绘制完整连接线
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
       
       完全禁止重新计算位置。
       
       直接使用展开时保存的数据。
    ================================================== */

    else {

        if (!position) {

            return;

        }


        /* ==================================================
           只绘制：

           书名边缘 → +

           不碰隐藏节点。
        ================================================== */

        createLine(

            position.startX,

            position.startY,

            position.middleX,

            position.middleY

        );

    }


    /* ==================================================
       没有位置就停止
    ================================================== */

    if (!position) {
        return;
    }


    /* ==================================================
       + / - 点击区域
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
               当前是展开状态
               
               此时 position 已经保存。
               
               直接切换状态即可。
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
               
               收起状态不会重新计算位置。
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
       收起状态显示 +

       展开状态显示 -
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

            /* ==========================================
               现在只处理根节点
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
               第一次出现默认展开
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
   页面加载完成后绘制
====================================================== */

requestAnimationFrame(
    function () {

        refreshConnections();

    }
);
