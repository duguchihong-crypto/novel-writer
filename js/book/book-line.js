/* ======================================================
   全书连接线测试
====================================================== */

const connections =
    document.getElementById("connections");

const workspace =
    document.getElementById("workspace");


function refreshConnections() {

    if (!connections) {

        alert("❌ 找不到 connections");

        return;

    }

    if (!workspace) {

        alert("❌ 找不到 workspace");

        return;

    }

    const bookElement =
        document.getElementById("bookTitle");

    if (!bookElement) {

        alert("❌ 找不到 bookTitle");

        return;

    }

    connections.innerHTML = "";

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
       直接画一条固定测试线
       1500,1500 → 1500,1650
    ================================================== */

    const line =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

    line.setAttribute(
        "x1",
        "1500"
    );

    line.setAttribute(
        "y1",
        "1500"
    );

    line.setAttribute(
        "x2",
        "1500"
    );

    line.setAttribute(
        "y2",
        "1650"
    );

    line.setAttribute(
        "stroke",
        "red"
    );

    line.setAttribute(
        "stroke-width",
        "8"
    );

    connections.appendChild(
        line
    );

    alert("✅ 测试线已经创建");

}
