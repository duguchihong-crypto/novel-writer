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


    return {

        x:
            parseFloat(
                element.style.left
            ),

        y:
            parseFloat(
                element.style.top
            )

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
        !end ||
        Number.isNaN(start.x) ||
        Number.isNaN(start.y) ||
        Number.isNaN(end.x) ||
        Number.isNaN(end.y)
    ) {

        return;

    }


    /* ==================================================
       创建 SVG 线
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
        "#999999"
    );


    line.setAttribute(
        "stroke-width",
        "3"
    );


    line.setAttribute(
        "stroke-linecap",
        "round"
    );


    connections.appendChild(
        line
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


    const nodes =
        Array.isArray(
            currentBook.nodes
        )
            ? currentBook.nodes
            : [];


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
       根节点 → 书名
    ================================================== */

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
