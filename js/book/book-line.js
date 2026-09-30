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
            element.offsetLeft +
            element.offsetWidth / 2,

        y:
            element.offsetTop +
            element.offsetHeight / 2

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
        "2"
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
        !workspace
    ) {

        return;

    }


    clearConnections();


    if (!currentBook) {
        return;
    }


    const nodes =
        Array.isArray(
            currentBook.nodes
        )
            ? currentBook.nodes
            : [];


    /* ==================================================
       书名元素
    ================================================== */

    const bookElement =
        document.getElementById(
            "bookTitle"
        );


    if (!bookElement) {
        return;
    }


    /* ==================================================
       每个根节点连接到书名
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
   节点渲染完成后重新绘制连接线
====================================================== */

function refreshConnections() {

    requestAnimationFrame(
        function () {

            renderConnections();

        }
    );

}
