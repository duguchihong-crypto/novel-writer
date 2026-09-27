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


    // ==================================================
    // 画线
    // ==================================================

    function drawPath(points) {

        if (
            !Array.isArray(points) ||
            points.length < 2
        ) {
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


        for (
            let i = 1;
            i < points.length;
            i++
        ) {

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


        svg.appendChild(
            path
        );
    }


    // ==================================================
    // 节点 Map
    // ==================================================

    const nodeMap =
        new Map();


    layout.nodes.forEach(
        item => {

            nodeMap.set(
                item.node.id,
                item
            );

        }
    );


    // ==================================================
    // 书名
    //
    // 不再使用 bookTitle.style.left
    //
    // 直接使用 layout.centerX
    // ==================================================

    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    if (!bookTitle) {
        return;
    }


    const bookCenterX =
        layout.centerX;


    const bookY =
        parseFloat(
            bookTitle.style.top
        ) || 25;


    const bookHeight =
        bookTitle.offsetHeight ||
        BOOK_MIN_HEIGHT;


    const bookBottomY =
        bookY +
        bookHeight;


    // ==================================================
    // 根节点
    // ==================================================

    const roots =
        layout.nodes.filter(
            item =>
                item.level === 0
        );


    if (roots.length === 0) {
        return;
    }


    // ==================================================
    // 书名 → 根节点
    // ==================================================

    if (
        roots.length === 1
    ) {

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


        // 书名中央
        // ↓
        // 根节点中央

        drawPath([
            {
                x:
                    bookCenterX,

                y:
                    bookBottomY
            },

            {
                x:
                    bookCenterX,

                y:
                    middleY
            },

            {
                x:
                    rootCenterX,

                y:
                    middleY
            },

            {
                x:
                    rootCenterX,

                y:
                    rootTopY
            }
        ]);

    } else {

        // ==================================================
        // 多个根节点
        // ==================================================

        const firstRoot =
            roots[0];


        const lastRoot =
            roots[
                roots.length - 1
            ];


        const branchY =
            Math.max(
                bookBottomY + 35,
                firstRoot.y - 35
            );


        // 书名中心
        // ↓
        // 主干

        drawPath([
            {
                x:
                    bookCenterX,

                y:
                    bookBottomY
            },

            {
                x:
                    bookCenterX,

                y:
                    branchY
            }
        ]);


        // 横向主干

        drawPath([
            {
                x:
                    firstRoot.centerX,

                y:
                    branchY
            },

            {
                x:
                    lastRoot.centerX,

                y:
                    branchY
            }
        ]);


        // 每一个根节点

        roots.forEach(
            root => {

                drawPath([
                    {
                        x:
                            root.centerX,

                        y:
                            branchY
                    },

                    {
                        x:
                            root.centerX,

                        y:
                            root.y
                    }
                ]);

            }
        );
    }


    // ==================================================
    // 父节点 → 子节点
    // ==================================================

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
                !Array.isArray(
                    parent.children
                ) ||
                parent.children.length === 0
            ) {
                return;
            }


            const children =
                parent.children
                    .map(
                        child =>
                            nodeMap.get(
                                child.id
                            )
                    )
                    .filter(Boolean);


            if (
                children.length === 0
            ) {
                return;
            }


            const parentCenterX =
                parentItem.centerX;


            const parentBottomY =
                parentItem.y +
                parentItem.height;


            // ==================================================
            // 一个子节点
            // ==================================================

            if (
                children.length === 1
            ) {

                const child =
                    children[0];


                const childCenterX =
                    child.centerX;


                const childTopY =
                    child.y;


                const middleY =
                    (
                        parentBottomY +
                        childTopY
                    ) / 2;


                drawPath([
                    {
                        x:
                            parentCenterX,

                        y:
                            parentBottomY
                    },

                    {
                        x:
                            parentCenterX,

                        y:
                            middleY
                    },

                    {
                        x:
                            childCenterX,

                        y:
                            middleY
                    },

                    {
                        x:
                            childCenterX,

                        y:
                            childTopY
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


            // ==================================================
            // 多个子节点
            // ==================================================

            const branchY =
                parentBottomY +
                LEVEL_GAP / 2;


            const firstChild =
                children[0];


            const lastChild =
                children[
                    children.length - 1
                ];


            // 父节点向下

            drawPath([
                {
                    x:
                        parentCenterX,

                    y:
                        parentBottomY
                },

                {
                    x:
                        parentCenterX,

                    y:
                        branchY
                }
            ]);


            // 横向主干

            drawPath([
                {
                    x:
                        firstChild.centerX,

                    y:
                        branchY
                },

                {
                    x:
                        lastChild.centerX,

                    y:
                        branchY
                }
            ]);


            // 各子节点向上连接

            children.forEach(
                child => {

                    drawPath([
                        {
                            x:
                                child.centerX,

                            y:
                                branchY
                        },

                        {
                            x:
                                child.centerX,

                            y:
                                child.y
                        }
                    ]);

                }
            );


            // ==================================================
            // + / −
            // ==================================================

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


// ==================================================
// + / − 控制按钮
// ==================================================

function addLineControl(
    parentNode,
    left,
    top
) {

    const control =
        document.createElement(
            "button"
        );


    control.type =
        "button";


    control.className =
        "line-control";


    control.textContent =
        parentNode.collapsed
            ? "+"
            : "−";


    // ==================================================
    // 控制按钮中心对准连线
    // ==================================================

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
