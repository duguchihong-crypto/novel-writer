// ==============================
// 全书页面：连接线
// 支持：纵向 / 横向
// ==============================


// ==================================================
// 绘制所有连接线
// ==================================================

function drawConnections(layout) {

    const svg =
        document.querySelector(
            "#connections"
        );


    if (!svg) {
        return;
    }


    // 清空旧线

    svg.innerHTML = "";


    // 删除旧的 + / −

    document
        .querySelectorAll(
            ".line-control"
        )
        .forEach(
            element =>
                element.remove()
        );


    if (
        !layout ||
        !Array.isArray(
            layout.nodes
        ) ||
        layout.nodes.length === 0
    ) {

        return;
    }


    // ==================================================
    // SVG 画线
    // ==================================================

    function drawPath(
        points
    ) {

        if (
            !Array.isArray(
                points
            ) ||
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
    // 书名位置
    // ==================================================

    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    if (!bookTitle) {
        return;
    }


    const bookLeft =
        Number.isFinite(
            parseFloat(
                bookTitle.style.left
            )
        )
            ? parseFloat(
                bookTitle.style.left
            )
            : layout.bookLeft || 0;


    const bookTop =
        Number.isFinite(
            parseFloat(
                bookTitle.style.top
            )
        )
            ? parseFloat(
                bookTitle.style.top
            )
            : layout.bookTop || 0;


    const bookWidth =
        bookTitle.offsetWidth ||
        layout.bookWidth ||
        BOOK_MIN_WIDTH;


    const bookHeight =
        bookTitle.offsetHeight ||
        layout.bookHeight ||
        BOOK_MIN_HEIGHT;


    const bookCenterX =
        bookLeft +
        bookWidth / 2;


    const bookCenterY =
        bookTop +
        bookHeight / 2;


    const bookRight =
        bookLeft +
        bookWidth;


    const bookBottom =
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
    // 根据布局方向绘制
    // ==================================================

    if (
        layout.direction ===
        "horizontal"
    ) {

        drawHorizontalConnections(
            roots,
            nodeMap,
            bookRight,
            bookCenterY,
            drawPath
        );

    } else {

        drawVerticalConnections(
            roots,
            nodeMap,
            bookBottom,
            bookCenterX,
            drawPath
        );
    }
}


// ==================================================
// 纵向连接
//
// 书名
//   │
//   │
//  卷
//   │
//   │
//  篇
//   │
//   │
//  章
//
// 所有连接点均为节点正中央
// ==================================================

function drawVerticalConnections(
    roots,
    nodeMap,
    bookBottom,
    bookCenterX,
    drawPath
) {

    // ==================================================
    // 书名 → 根节点
    // ==================================================

    if (
        roots.length === 1
    ) {

        const root =
            roots[0];


        // 节点顶部

        const rootTop =
            root.y;


        // 节点真正的水平中心
        // 不再依赖预先保存的 centerX

        const rootCenterX =
            root.x +
            root.width / 2;


        const middleY =
            (
                bookBottom +
                rootTop
            ) / 2;


        drawPath([
            {
                x:
                    bookCenterX,

                y:
                    bookBottom
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
                    rootTop
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


        const firstCenterX =
            firstRoot.x +
            firstRoot.width / 2;


        const lastCenterX =
            lastRoot.x +
            lastRoot.width / 2;


        const branchY =
            Math.min(
                ...roots.map(
                    root =>
                        root.y
                )
            ) -
            35;


        // ==================================================
        // 书名 → 主干
        // ==================================================

        drawPath([
            {
                x:
                    bookCenterX,

                y:
                    bookBottom
            },

            {
                x:
                    bookCenterX,

                y:
                    branchY
            }
        ]);


        // ==================================================
        // 横向主干
        // ==================================================

        drawPath([
            {
                x:
                    firstCenterX,

                y:
                    branchY
            },

            {
                x:
                    lastCenterX,

                y:
                    branchY
            }
        ]);


        // ==================================================
        // 主干 → 每个根节点
        // ==================================================

        roots.forEach(
            root => {

                const rootCenterX =
                    root.x +
                    root.width / 2;


                drawPath([
                    {
                        x:
                            rootCenterX,

                        y:
                            branchY
                    },

                    {
                        x:
                            rootCenterX,

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

    nodeMap.forEach(
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


            // ==================================================
            // 父节点真正的水平中心
            // ==================================================

            const parentCenterX =
                parentItem.x +
                parentItem.width / 2;


            const parentBottom =
                parentItem.y +
                parentItem.height;


            // ==================================================
            // 一个孩子
            // ==================================================

            if (
                children.length === 1
            ) {

                const child =
                    children[0];


                // 孩子真正的水平中心

                const childCenterX =
                    child.x +
                    child.width / 2;


                const childTop =
                    child.y;


                const middleY =
                    (
                        parentBottom +
                        childTop
                    ) / 2;


                // ==================================================
                // 父节点底部中心
                // →
                // 中间点
                // →
                // 孩子顶部中心
                // ==================================================

                drawPath([
                    {
                        x:
                            parentCenterX,

                        y:
                            parentBottom
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
                            childTop
                    }
                ]);


                // ==================================================
                // + / −
                //
                // 放在横向连接段的正中央
                // ==================================================

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

            const firstChild =
                children[0];


            const lastChild =
                children[
                    children.length - 1
                ];


            const firstCenterX =
                firstChild.x +
                firstChild.width / 2;


            const lastCenterX =
                lastChild.x +
                lastChild.width / 2;


            const branchY =
                parentBottom +
                (
                    LEVEL_GAP /
                    2
                );


            // ==================================================
            // 父节点 → 分叉主干
            // ==================================================

            drawPath([
                {
                    x:
                        parentCenterX,

                    y:
                        parentBottom
                },

                {
                    x:
                        parentCenterX,

                    y:
                        branchY
                }
            ]);


            // ==================================================
            // 子节点横向主干
            // ==================================================

            drawPath([
                {
                    x:
                        firstCenterX,

                    y:
                        branchY
                },

                {
                    x:
                        lastCenterX,

                    y:
                        branchY
                }
            ]);


            // ==================================================
            // 横向主干 → 每个孩子
            // ==================================================

            children.forEach(
                child => {

                    const childCenterX =
                        child.x +
                        child.width / 2;


                    drawPath([
                        {
                            x:
                                childCenterX,

                            y:
                                branchY
                        },

                        {
                            x:
                                childCenterX,

                            y:
                                child.y
                        }
                    ]);
                }
            );


            // ==================================================
            // + / −
            //
            // 放在整个分叉主干的正中央
            // ==================================================

            addLineControl(
                parent,
                (
                    firstCenterX +
                    lastCenterX
                ) / 2,
                branchY
            );
        }
    );
}


// ==================================================
// 横向连接
//
// 书名 ── 卷 ── 篇 ── 章
//             │
//             ├── 章
//             │
//             └── 篇
//
// 所有连接点均为节点正中央
// ==================================================

function drawHorizontalConnections(
    roots,
    nodeMap,
    bookRight,
    bookCenterY,
    drawPath
) {

    // ==================================================
    // 书名 → 根节点
    // ==================================================

    if (
        roots.length === 1
    ) {

        const root =
            roots[0];


        const rootLeft =
            root.x;


        // 节点真正的垂直中心

        const rootCenterY =
            root.y +
            root.height / 2;


        const middleX =
            (
                bookRight +
                rootLeft
            ) / 2;


        drawPath([
            {
                x:
                    bookRight,

                y:
                    bookCenterY
            },

            {
                x:
                    middleX,

                y:
                    bookCenterY
            },

            {
                x:
                    middleX,

                y:
                    rootCenterY
            },

            {
                x:
                    rootLeft,

                y:
                    rootCenterY
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


        const firstCenterY =
            firstRoot.y +
            firstRoot.height / 2;


        const lastCenterY =
            lastRoot.y +
            lastRoot.height / 2;


        const branchX =
            Math.min(
                ...roots.map(
                    root =>
                        root.x
                )
            ) -
            35;


        // ==================================================
        // 书名 → 主干
        // ==================================================

        drawPath([
            {
                x:
                    bookRight,

                y:
                    bookCenterY
            },

            {
                x:
                    branchX,

                y:
                    bookCenterY
            }
        ]);


        // ==================================================
        // 纵向主干
        // ==================================================

        drawPath([
            {
                x:
                    branchX,

                y:
                    firstCenterY
            },

            {
                x:
                    branchX,

                y:
                    lastCenterY
            }
        ]);


        // ==================================================
        // 主干 → 每个根节点
        // ==================================================

        roots.forEach(
            root => {

                const rootCenterY =
                    root.y +
                    root.height / 2;


                drawPath([
                    {
                        x:
                            branchX,

                        y:
                            rootCenterY
                    },

                    {
                        x:
                            root.x,

                        y:
                            rootCenterY
                    }
                ]);
            }
        );
    }


    // ==================================================
    // 父节点 → 子节点
    // ==================================================

    nodeMap.forEach(
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


            // ==================================================
            // 父节点真正的垂直中心
            // ==================================================

            const parentCenterY =
                parentItem.y +
                parentItem.height / 2;


            const parentRight =
                parentItem.x +
                parentItem.width;


            // ==================================================
            // 一个孩子
            // ==================================================

            if (
                children.length === 1
            ) {

                const child =
                    children[0];


                const childLeft =
                    child.x;


                // 孩子真正的垂直中心

                const childCenterY =
                    child.y +
                    child.height / 2;


                const middleX =
                    (
                        parentRight +
                        childLeft
                    ) / 2;


                // ==================================================
                // 父节点右侧中心
                // →
                // 中间点
                // →
                // 孩子左侧中心
                // ==================================================

                drawPath([
                    {
                        x:
                            parentRight,

                        y:
                            parentCenterY
                    },

                    {
                        x:
                            middleX,

                        y:
                            parentCenterY
                    },

                    {
                        x:
                            middleX,

                        y:
                            childCenterY
                    },

                    {
                        x:
                            childLeft,

                        y:
                            childCenterY
                    }
                ]);


                // + / −

                addLineControl(
                    parent,
                    middleX,
                    (
                        parentCenterY +
                        childCenterY
                    ) / 2
                );


                return;
            }


            // ==================================================
            // 多个孩子
            // ==================================================

            const firstChild =
                children[0];


            const lastChild =
                children[
                    children.length - 1
                ];


            const firstCenterY =
                firstChild.y +
                firstChild.height / 2;


            const lastCenterY =
                lastChild.y +
                lastChild.height / 2;


            const branchX =
                parentRight +
                (
                    LEVEL_GAP /
                    2
                );


            // ==================================================
            // 父节点 → 分叉主干
            // ==================================================

            drawPath([
                {
                    x:
                        parentRight,

                    y:
                        parentCenterY
                },

                {
                    x:
                        branchX,

                    y:
                        parentCenterY
                }
            ]);


            // ==================================================
            // 子节点纵向主干
            // ==================================================

            drawPath([
                {
                    x:
                        branchX,

                    y:
                        firstCenterY
                },

                {
                    x:
                        branchX,

                    y:
                        lastCenterY
                }
            ]);


            // ==================================================
            // 纵向主干 → 每个孩子
            // ==================================================

            children.forEach(
                child => {

                    const childCenterY =
                        child.y +
                        child.height / 2;


                    drawPath([
                        {
                            x:
                                branchX,

                            y:
                                childCenterY
                        },

                        {
                            x:
                                child.x,

                            y:
                                childCenterY
                        }
                    ]);
                }
            );


            // ==================================================
            // + / −
            //
            // 放在分叉主干中央
            // ==================================================

            addLineControl(
                parent,
                branchX,
                (
                    firstCenterY +
                    lastCenterY
                ) / 2
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
    // 尺寸
    // ==================================================

    const size =
        window.innerWidth <= 600
            ? 26
            : 24;


    // ==================================================
    // 精确定位
    //
    // centerX / centerY
    // 是连接线真正的中心坐标
    //
    // CSS 中 margin 必须保持 0
    // ==================================================

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
    // 防止点击按钮触发画布取消选择
    // ==================================================

    control.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            event.stopPropagation();
        }
    );


    // ==================================================
    // 放入画布
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
