// ==============================
// 全书页面：连接线
// ==============================

function drawConnections(layout) {

    const svg =
        document.querySelector("#connections");

    if (!svg) return;

    svg.innerHTML = "";

    if (
        !layout ||
        !Array.isArray(layout.nodes) ||
        layout.nodes.length === 0
    ) {
        return;
    }


    // ==============================
    // 创建折线
    // ==============================

    function drawPath(points) {

        if (!points || points.length < 2) {
            return;
        }

        const path =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );

        let d =
            "M " +
            points[0].x +
            " " +
            points[0].y;

        for (let i = 1; i < points.length; i++) {

            d +=
                " L " +
                points[i].x +
                " " +
                points[i].y;
        }

        path.setAttribute(
            "d",
            d
        );

        path.setAttribute(
            "class",
            "connection-line"
        );

        svg.appendChild(path);
    }


    // ==============================
    // 节点快速查找
    // ==============================

    const nodeMap =
        new Map();

    layout.nodes.forEach(item => {

        nodeMap.set(
            item.node.id,
            item
        );

    });


    // ==============================
    // 书名
    // ==============================

    const bookTitle =
        document.querySelector("#bookTitle");

    if (!bookTitle) return;


    const bookX =
        parseFloat(bookTitle.style.left) || 0;

    const bookY =
        parseFloat(bookTitle.style.top) || 0;

    const bookWidth =
        bookTitle.offsetWidth ||
        BOOK_MIN_WIDTH;

    const bookHeight =
        bookTitle.offsetHeight ||
        BOOK_MIN_HEIGHT;


    const bookCenterX =
        bookX +
        bookWidth / 2;

    const bookBottomY =
        bookY +
        bookHeight;


    // ==============================
    // 根节点
    // ==============================

    const roots =
        layout.nodes.filter(
            item => item.level === 0
        );


    if (roots.length === 0) {
        return;
    }


    // ==============================
    // 书名 → 根节点
    // ==============================

    if (roots.length === 1) {

        const root =
            roots[0];

        const rootCenterX =
            root.centerX;

        const rootTopY =
            root.y;

        const middleY =
            (
                bookBottomY +
                rootTopY
            ) / 2;


        // 书名正中央
        // ↓
        // 根节点正中央

        drawPath([
            {
                x: bookCenterX,
                y: bookBottomY
            },

            {
                x: bookCenterX,
                y: middleY
            },

            {
                x: rootCenterX,
                y: middleY
            },

            {
                x: rootCenterX,
                y: rootTopY
            }
        ]);

    } else {

        // ==============================
        // 多个根节点
        // ==============================

        const firstRoot =
            roots[0];

        const lastRoot =
            roots[roots.length - 1];


        const branchY =
            Math.max(
                bookBottomY + 35,
                firstRoot.y - 35
            );


        // 书名中心
        // ↓
        // 横向主干

        drawPath([
            {
                x: bookCenterX,
                y: bookBottomY
            },

            {
                x: bookCenterX,
                y: branchY
            }
        ]);


        drawPath([
            {
                x: firstRoot.centerX,
                y: branchY
            },

            {
                x: lastRoot.centerX,
                y: branchY
            }
        ]);


        roots.forEach(root => {

            drawPath([
                {
                    x: root.centerX,
                    y: branchY
                },

                {
                    x: root.centerX,
                    y: root.y
                }
            ]);

        });
    }


    // ==============================
    // 父节点 → 子节点
    // ==============================

    layout.nodes.forEach(
        parentItem => {

            const parent =
                parentItem.node;


            if (
                parent.collapsed === true
            ) {
                return;
            }


            if (
                !Array.isArray(parent.children) ||
                parent.children.length === 0
            ) {
                return;
            }


            const children =
                parent.children
                    .map(
                        child =>
                            nodeMap.get(child.id)
                    )
                    .filter(Boolean);


            if (children.length === 0) {
                return;
            }


            const parentBottomY =
                parentItem.y +
                parentItem.height;


            const parentCenterX =
                parentItem.centerX;


            // ==============================
            // 一个孩子
            // ==============================

            if (children.length === 1) {

                const child =
                    children[0];


                const childTopY =
                    child.y;

                const childCenterX =
                    child.centerX;


                const middleY =
                    (
                        parentBottomY +
                        childTopY
                    ) / 2;


                drawPath([
                    {
                        x: parentCenterX,
                        y: parentBottomY
                    },

                    {
                        x: parentCenterX,
                        y: middleY
                    },

                    {
                        x: childCenterX,
                        y: middleY
                    },

                    {
                        x: childCenterX,
                        y: childTopY
                    }
                ]);


                addLineControl(
                    parent,
                    (
                        parentCenterX +
                        childCenterX
                    ) / 2,
                    middleY
                );

                return;
            }


            // ==============================
            // 多个孩子
            // ==============================

            const branchY =
                parentBottomY +
                LEVEL_GAP / 2;


            const firstChild =
                children[0];

            const lastChild =
                children[children.length - 1];


            // 父节点中心
            // ↓
            // 横向主干

            drawPath([
                {
                    x: parentCenterX,
                    y: parentBottomY
                },

                {
                    x: parentCenterX,
                    y: branchY
                }
            ]);


            drawPath([
                {
                    x: firstChild.centerX,
                    y: branchY
                },

                {
                    x: lastChild.centerX,
                    y: branchY
                }
            ]);


            children.forEach(
                child => {

                    drawPath([
                        {
                            x: child.centerX,
                            y: branchY
                        },

                        {
                            x: child.centerX,
                            y: child.y
                        }
                    ]);

                }
            );


            addLineControl(
                parent,
                (
                    firstChild.centerX +
                    lastChild.centerX
                ) / 2,
                branchY
            );
        }
    );
}


// ==============================
// 创建 + / − 控制按钮
// ==============================

function addLineControl(
    parentNode,
    left,
    top
) {

    const control =
        document.createElement("button");


    control.type = "button";

    control.className =
        "line-control";


    control.textContent =
        parentNode.collapsed
            ? "+"
            : "−";


    // 让按钮中心正好位于连线位置

    const size = 24;

    control.style.left =
        (
            left -
            size / 2
        ) + "px";

    control.style.top =
        (
            top -
            size / 2
        ) + "px";


    control.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();

            toggleNode(
                parentNode.id
            );

        }
    );


    const canvas =
        document.querySelector(
            ".tree-canvas"
        );


    if (canvas) {

        canvas.appendChild(
            control
        );

    }
}
