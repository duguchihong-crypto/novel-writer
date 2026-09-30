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
   清除连接线
====================================================== */

function clearConnections() {

    if (!connections) {
        return;
    }

    connections.innerHTML = "";

}


/* ======================================================
   获取元素中心
====================================================== */

function getElementCenter(element) {

    if (!element) {
        return null;
    }

    const style =
        window.getComputedStyle(element);

    const x =
        parseFloat(style.left);

    const y =
        parseFloat(style.top);

    if (
        Number.isNaN(x) ||
        Number.isNaN(y)
    ) {
        return null;
    }

    return {
        x: x,
        y: y
    };

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


    /* ==================================================
       获取位置
    ================================================== */

    const start =
        getElementCenter(
            startElement
        );

    const end =
        getElementCenter(
            endElement
        );


    if (!start || !end) {
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
       计算连接线中点
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
       计算实际连接线终点
       
       展开：
       书名 → 节点

       收起：
       书名 → +
    ================================================== */

    let lineEndX =
        end.x;

    let lineEndY =
        end.y;


    if (!isExpanded) {

        lineEndX =
            middleX;

        lineEndY =
            middleY;

    }


    /* ==================================================
       创建连接线
    ================================================== */

    const line =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );


    line.setAttribute(
        "x1",
        start.x
    );

    line.setAttribute(
        "y1",
        start.y
    );

    line.setAttribute(
        "x2",
        lineEndX
    );

    line.setAttribute(
        "y2",
        lineEndY
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


    /* ==================================================
       创建点击区域
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


            /*
             * 切换状态
             */

            connectionStates[nodeId] =
                !isExpanded;


            /*
             * 控制节点
             */

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


            /*
             * 重新绘制
             */

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
       ＋的竖线
       
       收起 = +
       展开 = -
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
               第一次出现时默认展开
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
