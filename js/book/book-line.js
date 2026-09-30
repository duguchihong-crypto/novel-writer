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


    /* ==================================================
       线条样式
    ================================================== */

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


    /* ==================================================
       清除旧线
    ================================================== */

    clearConnections();


    /* ==================================================
       确保 SVG 覆盖整个工作区
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
       获取节点数据
    ================================================== */

    const nodes =
        Array.isArray(
            currentBook.nodes
        )
            ? currentBook.nodes
            : [];


    /* ==================================================
       获取书名
    ================================================== */

    const bookElement =
        document.getElementById(
            "bookTitle"
        );


    if (!bookElement) {
        return;
    }


    /* ==================================================
       根节点连接到书名
    ================================================== */

    nodes.forEach(
        function (node) {

            /* ==========================================
               只处理根节点
            ========================================== */

            if (
                node.parentId !== null &&
                node.parentId !== undefined
            ) {

                return;

            }


            /* ==========================================
               找到对应的节点元素
            ========================================== */

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
               创建连接
            ========================================== */

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
