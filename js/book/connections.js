// ==============================
// 全书页面：连接线
// ==============================


// ==================================================
// 绘制所有连接线
// ==================================================

function drawConnections(layout) {

    const svg =
        document.querySelector("#connections");


    if (!svg) {
        return;
    }


    // 清空旧线

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
    // 建立节点 Map
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
    // 获取小说名字真实位置
    // ==================================================

    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    if (!bookTitle) {
        return;
    }


    // 直接使用书名真实的 left
    //
    // 这是画布坐标
    // 与节点 layout.x 使用同一个坐标系

    const bookLeft =
        parseFloat(
            bookTitle.style.left
        ) || 0;


    const bookTop =
        parseFloat(
            bookTitle.style.top
        ) || 0;


    const bookWidth =
        bookTitle.offsetWidth ||
        BOOK_MIN_WIDTH;


    const bookHeight =
        bookTitle.offsetHeight ||
        BOOK_MIN_HEIGHT;


    // ==================================================
    // 书名真正中心
    // ==================================================

    const bookCenterX =
        bookLeft +
        bookWidth / 2;


    const bookBottomY =
        bookTop +
        bookHeight;


    // ==================================================
    // 根节点
    // ==================================================

    const roots =
        layout.nodes.filter(
            item =>
                item.level === 0
        );


    if (
        roots.length === 0
    ) {
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


        // 两个节点之间的中央位置

        const middleY =
            (
                bookBottomY +
                rootTopY
            ) / 2;


        // ------------------------------
        // 书名中央
        //       │
        //       │
        //       └────
        //            │
        //          根节点中央
        // ------------------------------

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


        // 主干高度

        const branchY =
            Math.max(
                bookBottomY + 35,
                firstRoot.y - 35
            );


        // ------------------------------
        // 书名
        //   │
        //   │
        //   ├──────────────┐
        //   │              │
        // 第一卷          第二卷
        // ------------------------------

        // 书名向下

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


        // 每个根节点向下

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


            // 已折叠
            // 不画子节点连接

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


            // 找到当前父节点的实际子节点

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


            // ==================================================
            // 父节点位置
            // ==================================================

            const parentCenterX =
                parentItem.centerX;


            const parentBottomY =
                parentItem.y +
                parentItem.height;


            // ==================================================
            // 只有一个孩子
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


                // + / − 放在线中央

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
            // 多个孩子
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


            // 每一个孩子向上

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


            // + / −

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
// 创建 + / − 控制按钮
// ==================================================

function addLineControl(
    parentNode,
    centerX,
    centerY
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
    // 控制按钮中心
    // ==================================================

    const size = 24;


    control.style.left =
        (
            centerX -
            size / 2
        ) + "px";


    control.style.top =
        (
            centerY -
            size / 2
        ) + "px";


    // ==================================================
    // 点击
    // ==================================================

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


    // ==================================================
    // 放进画布
    // ==================================================

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
