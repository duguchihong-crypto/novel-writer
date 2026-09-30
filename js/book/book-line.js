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
        end.x
    );

    line.setAttribute(
        "y2",
        end.y
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
        "20"
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
       点击展开按钮
    ================================================== */

    hitArea.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            const nodeId =
                String(
                    endElement.dataset.id
                );


            if (
                connectionStates[nodeId] === true
            ) {

                connectionStates[nodeId] =
                    false;

            } else {

                connectionStates[nodeId] =
                    true;

            }


            refreshConnections();

        }
    );


    connections.appendChild(
        hitArea
    );


    /* ==================================================
       创建背景圆
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
       当前状态
    ================================================== */

    const nodeId =
        String(
            endElement.dataset.id
        );

    const isExpanded =
        connectionStates[nodeId] === true;


    /* ==================================================
       创建横线
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
