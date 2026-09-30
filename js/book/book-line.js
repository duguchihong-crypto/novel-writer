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
   清除全部连接线
====================================================== */

function clearConnections() {

    if (!connections) {
        return;
    }

    connections.innerHTML = "";

}


/* ======================================================
   获取元素中心位置
====================================================== */

function getElementCenter(element) {

    if (!element) {
        return null;
    }

    const style =
        window.getComputedStyle(
            element
        );

    const x =
        parseFloat(
            style.left
        );

    const y =
        parseFloat(
            style.top
        );

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
   创建一条连接线
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


    if (
        !start ||
        !end
    ) {

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

    line.setAttribute(
        "fill",
        "none"
    );


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
       创建 ＋
    ================================================== */

    const plusGroup =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );


    plusGroup.setAttribute(
        "transform",
        "translate(" +
        middleX +
        " " +
        middleY +
        ")"
    );


    plusGroup.setAttribute(
        "pointer-events",
        "none"
    );


    /* ==================================================
       ＋ 背景
    ================================================== */

    const plusCircle =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );


    plusCircle.setAttribute(
        "cx",
        "0"
    );

    plusCircle.setAttribute(
        "cy",
        "0"
    );

    plusCircle.setAttribute(
        "r",
        "12"
    );

    plusCircle.setAttribute(
        "fill",
        "#ffffff"
    );

    plusCircle.setAttribute(
        "stroke",
        "#888888"
    );

    plusCircle.setAttribute(
        "stroke-width",
        "2"
    );


    plusGroup.appendChild(
        plusCircle
    );


    /* ==================================================
       ＋ 横线
    ================================================== */

    const horizontal =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );


    horizontal.setAttribute(
        "x1",
        "-6"
    );

    horizontal.setAttribute(
        "y1",
        "0"
    );

    horizontal.setAttribute(
        "x2",
        "6"
    );

    horizontal.setAttribute(
        "y2",
        "0"
    );


    horizontal.setAttribute(
        "stroke",
        "#333333"
    );

    horizontal.setAttribute(
        "stroke-width",
        "2"
    );

    horizontal.setAttribute(
        "stroke-linecap",
        "round"
    );


    plusGroup.appendChild(
        horizontal
    );


    /* ==================================================
       ＋ 竖线
    ================================================== */

    const vertical =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );


    vertical.setAttribute(
        "x1",
        "0"
    );

    vertical.setAttribute(
        "y1",
        "-6"
    );

    vertical.setAttribute(
        "x2",
        "0"
    );

    vertical.setAttribute(
        "y2",
        "6"
    );


    vertical.setAttribute(
        "stroke",
        "#333333"
    );

    vertical.setAttribute(
        "stroke-width",
        "2"
    );

    vertical.setAttribute(
        "stroke-linecap",
        "round"
    );


    plusGroup.appendChild(
        vertical
    );


    connections.appendChild(
        plusGroup
    );

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


    const nodes =
        Array.isArray(
            currentBook.nodes
        )
            ? currentBook.nodes
            : [];


    const bookElement =
        document.getElementById(
            "bookTitle"
        );


    if (!bookElement) {
        return;
    }


    /* ==============================================
       书名 → 根节点
    ============================================== */

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
   节点渲染完成后重新绘制
====================================================== */

function refreshConnections() {

    requestAnimationFrame(
        function () {

            renderConnections();

        }
    );

}
