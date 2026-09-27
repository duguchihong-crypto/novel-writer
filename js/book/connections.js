// ==============================
// 全书页面：连接线
// 支持：纵向 / 横向
//
// ★ 最终版
//
// 特点：
// 1. 所有连接点使用节点真实几何中心
// 2. 父节点连接线从正中心出来
// 3. + / − 永远放在父节点主干上
// 4. 多子节点先走主干，再进行分叉
// 5. SVG 与 + / − 使用同一坐标系
// 6. 支持纵向 / 横向
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


    // ==================================================
    // 清空旧线
    // ==================================================

    svg.innerHTML = "";


    // ==================================================
    // 删除旧的 + / −
    // ==================================================

    document
        .querySelectorAll(
            ".line-control"
        )
        .forEach(
            element => {
                element.remove();
            }
        );


    // ==================================================
    // 没有布局
    // ==================================================

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

            if (
                item &&
                item.node &&
                item.node.id != null
            ) {

                nodeMap.set(
                    item.node.id,
                    item
                );
            }
        }
    );



    // ==================================================
    // 书名
    // ==================================================

    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    if (!bookTitle) {
        return;
    }



    // ==================================================
    // 书名位置
    // ==================================================

    const styleLeft =
        parseFloat(
            bookTitle.style.left
        );


    const styleTop =
        parseFloat(
            bookTitle.style.top
        );


    const bookLeft =
        Number.isFinite(
            styleLeft
        )
            ? styleLeft
            : (
                Number(
                    layout.bookLeft
                ) || 0
            );


    const bookTop =
        Number.isFinite(
            styleTop
        )
            ? styleTop
            : (
                Number(
                    layout.bookTop
                ) || 0
            );



    // ==================================================
    // 书名尺寸
    // ==================================================

    const bookWidth =
        bookTitle.offsetWidth ||
        Number(
            layout.bookWidth
        ) ||
        BOOK_MIN_WIDTH;


    const bookHeight =
        bookTitle.offsetHeight ||
        Number(
            layout.bookHeight
        ) ||
        BOOK_MIN_HEIGHT;



    // ==================================================
    // 书名几何中心
    // ==================================================

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
    // 根据方向绘制
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
// 获取节点中心 X
// ==================================================

function getNodeCenterX(
    item
) {

    return (
        Number(item.x) +
        Number(item.width) / 2
    );
}



// ==================================================
// 获取节点中心 Y
// ==================================================

function getNodeCenterY(
    item
) {

    return (
        Number(item.y) +
        Number(item.height) / 2
    );
}



// ==================================================
// 获取节点顶部
// ==================================================

function getNodeTop(
    item
) {

    return Number(
        item.y
    );
}



// ==================================================
// 获取节点底部
// ==================================================

function getNodeBottom(
    item
) {

    return (
        Number(item.y) +
        Number(item.height)
    );
}



// ==================================================
// 获取节点左侧
// ==================================================

function getNodeLeft(
    item
) {

    return Number(
        item.x
    );
}



// ==================================================
// 获取节点右侧
// ==================================================

function getNodeRight(
    item
) {

    return (
        Number(item.x) +
        Number(item.width)
    );
}



// ==================================================
// 纵向连接
//
//          父
//          │
//         [−]
//          │
//          │
//      ────┼────
//       │       │
//      子1     子2
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

    drawVerticalBookConnections(
        roots,
        bookBottom,
        bookCenterX,
        drawPath
    );



    // ==================================================
    // 父节点 → 子节点
    // ==================================================

    nodeMap.forEach(
        parentItem => {

            const parent =
                parentItem.node;


            if (!parent) {
                return;
            }


            // 收起状态不画子节点连接

            if (
                parent.collapsed === true
            ) {

                return;
            }


            if (
                !Array.isArray(
                    parent.children
                )
            ) {

                return;
            }


            if (
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
                    .filter(
                        Boolean
                    );


            if (
                children.length === 0
            ) {

                return;
            }


            drawVerticalParentConnections(
                parentItem,
                children,
                drawPath
            );
        }
    );
}



// ==================================================
// 纵向：书名 → 根节点
// ==================================================

function drawVerticalBookConnections(
    roots,
    bookBottom,
    bookCenterX,
    drawPath
) {

    // ==================================================
    // 单个根节点
    // ==================================================

    if (
        roots.length === 1
    ) {

        const root =
            roots[0];


        const rootCenterX =
            getNodeCenterX(
                root
            );


        const rootTop =
            getNodeTop(
                root
            );


        const middleY =
            (
                bookBottom +
                rootTop
            ) / 2;


        // ==================================================
        // 一条连续连接线
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


        return;
    }



    // ==================================================
    // 多个根节点
    // ==================================================

    const firstCenterX =
        getNodeCenterX(
            roots[0]
        );


    const lastCenterX =
        getNodeCenterX(
            roots[
                roots.length - 1
            ]
        );


    const rootTop =
        Math.min(
            ...roots.map(
                root =>
                    getNodeTop(
                        root
                    )
            )
        );


    // ==================================================
    // 分叉高度
    //
    // 不能跑到节点里面
    // ==================================================

    const branchY =
        (
            bookBottom +
            rootTop
        ) / 2;



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
    // 主干 → 根节点
    // ==================================================

    roots.forEach(
        root => {

            const centerX =
                getNodeCenterX(
                    root
                );


            const top =
                getNodeTop(
                    root
                );


            drawPath([
                {
                    x:
                        centerX,

                    y:
                        branchY
                },

                {
                    x:
                        centerX,

                    y:
                        top
                }
            ]);
        }
    );
}



// ==================================================
// 纵向：父节点 → 子节点
// ==================================================

function drawVerticalParentConnections(
    parent,
    children,
    drawPath
) {

    // ==================================================
    // 父节点中心
    // ==================================================

    const parentCenterX =
        getNodeCenterX(
            parent
        );


    const parentBottom =
        getNodeBottom(
            parent
        );



    // ==================================================
    // 一个孩子
    // ==================================================

    if (
        children.length === 1
    ) {

        const child =
            children[0];


        const childCenterX =
            getNodeCenterX(
                child
            );


        const childTop =
            getNodeTop(
                child
            );


        const middleY =
            (
                parentBottom +
                childTop
            ) / 2;



        // ==================================================
        // 一条完整连续的连接线
        //
        //       父
        //       │
        //       │
        //       └─────────┐
        //                 │
        //                 子
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
        // ★ + / −
        //
        // 放在父节点中心向下的主干上
        // ==================================================

        const controlY =
            (
                parentBottom +
                middleY
            ) / 2;


        addLineControl(
            parent,
            parentCenterX,
            controlY
        );


        return;
    }



    // ==================================================
    // 多个孩子
    // ==================================================

    const childCenters =
        children.map(
            child =>
                getNodeCenterX(
                    child
                )
        );


    const firstCenterX =
        Math.min(
            ...childCenters
        );


    const lastCenterX =
        Math.max(
            ...childCenters
        );


    const childTop =
        Math.min(
            ...children.map(
                child =>
                    getNodeTop(
                        child
                    )
            )
        );



    // ==================================================
    // 分叉高度
    // ==================================================

    const branchY =
        (
            parentBottom +
            childTop
        ) / 2;



    // ==================================================
    // 父节点 → 主干
    //
    //       父
    //       │
    //      [−]
    //       │
    //       │
    // ──────┼──────
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
    // 主干 → 每一个孩子
    // ==================================================

    children.forEach(
        child => {

            const childCenterX =
                getNodeCenterX(
                    child
                );


            const childTop =
                getNodeTop(
                    child
                );


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
                        childTop
                }
            ]);
        }
    );



    // ==================================================
    // ★ + / −
    //
    // 放在父节点向下的主干
    //
    // 而不是横向分叉线上
    // ==================================================

    const controlY =
        (
            parentBottom +
            branchY
        ) / 2;


    addLineControl(
        parent,
        parentCenterX,
        controlY
    );
}



// ==================================================
// 横向连接
//
//       父 ──[−]──┬── 子
//                 │
//                 └── 子
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

    drawHorizontalBookConnections(
        roots,
        bookRight,
        bookCenterY,
        drawPath
    );



    // ==================================================
    // 父 → 子
    // ==================================================

    nodeMap.forEach(
        parentItem => {

            const parent =
                parentItem.node;


            if (!parent) {
                return;
            }


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
                    .filter(
                        Boolean
                    );


            if (
                children.length === 0
            ) {

                return;
            }


            drawHorizontalParentConnections(
                parentItem,
                children,
                drawPath
            );
        }
    );
}



// ==================================================
// 横向：书名 → 根节点
// ==================================================

function drawHorizontalBookConnections(
    roots,
    bookRight,
    bookCenterY,
    drawPath
) {

    // ==================================================
    // 单根
    // ==================================================

    if (
        roots.length === 1
    ) {

        const root =
            roots[0];


        const rootLeft =
            getNodeLeft(
                root
            );


        const rootCenterY =
            getNodeCenterY(
                root
            );


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


        return;
    }



    // ==================================================
    // 多根
    // ==================================================

    const firstCenterY =
        getNodeCenterY(
            roots[0]
        );


    const lastCenterY =
        getNodeCenterY(
            roots[
                roots.length - 1
            ]
        );


    const rootLeft =
        Math.min(
            ...roots.map(
                root =>
                    getNodeLeft(
                        root
                    )
            )
        );


    const branchX =
        (
            bookRight +
            rootLeft
        ) / 2;



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
    // 主干 → 根节点
    // ==================================================

    roots.forEach(
        root => {

            const centerY =
                getNodeCenterY(
                    root
                );


            const left =
                getNodeLeft(
                    root
                );


            drawPath([
                {
                    x:
                        branchX,

                    y:
                        centerY
                },

                {
                    x:
                        left,

                    y:
                        centerY
                }
            ]);
        }
    );
}



// ==================================================
// 横向：父 → 子
// ==================================================

function drawHorizontalParentConnections(
    parent,
    children,
    drawPath
) {

    const parentRight =
        getNodeRight(
            parent
        );


    const parentCenterY =
        getNodeCenterY(
            parent
        );



    // ==================================================
    // 一个孩子
    // ==================================================

    if (
        children.length === 1
    ) {

        const child =
            children[0];


        const childLeft =
            getNodeLeft(
                child
            );


        const childCenterY =
            getNodeCenterY(
                child
            );


        const middleX =
            (
                parentRight +
                childLeft
            ) / 2;



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



        // ==================================================
        // + / −
        //
        // 放在父节点向右的主干
        // ==================================================

        const controlX =
            (
                parentRight +
                middleX
            ) / 2;


        addLineControl(
            parent,
            controlX,
            parentCenterY
        );


        return;
    }



    // ==================================================
    // 多个孩子
    // ==================================================

    const childCenters =
        children.map(
            child =>
                getNodeCenterY(
                    child
                )
        );


    const firstCenterY =
        Math.min(
            ...childCenters
        );


    const lastCenterY =
        Math.max(
            ...childCenters
        );


    const childLeft =
        Math.min(
            ...children.map(
                child =>
                    getNodeLeft(
                        child
                    )
            )
        );


    const branchX =
        (
            parentRight +
            childLeft
        ) / 2;



    // ==================================================
    // 父节点 → 主干
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
    // 主干 → 子节点
    // ==================================================

    children.forEach(
        child => {

            const centerY =
                getNodeCenterY(
                    child
                );


            const left =
                getNodeLeft(
                    child
                );


            drawPath([
                {
                    x:
                        branchX,

                    y:
                        centerY
                },

                {
                    x:
                        left,

                    y:
                        centerY
                }
            ]);
        }
    );



    // ==================================================
    // ★ + / −
    //
    // 放在父节点 → 主干
    // 而不是纵向分叉线上
    // ==================================================

    const controlX =
        (
            parentRight +
            branchX
        ) / 2;


    addLineControl(
        parent,
        controlX,
        parentCenterY
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

    // ==================================================
    // #tree
    //
    // ★ SVG 和按钮使用同一个坐标系
    // ==================================================

    const tree =
        document.querySelector(
            "#tree"
        );


    if (!tree) {
        return;
    }



    // ==================================================
    // 创建按钮
    // ==================================================

    const control =
        document.createElement(
            "button"
        );


    control.type =
        "button";


    control.className =
        "line-control";



    // ==================================================
    // + / −
    // ==================================================

    control.textContent =
        parentNode.collapsed === true
            ? "+"
            : "−";



    // ==================================================
    // ★ 统一尺寸
    //
    // CSS 也是 26px
    // ==================================================

    const size =
        26;



    // ==================================================
    // ★ 以真正中心定位
    // ==================================================

    control.style.left =
        (
            Number(centerX) -
            size / 2
        ) + "px";


    control.style.top =
        (
            Number(centerY) -
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


            if (
                !parentNode
            ) {

                return;
            }


            if (
                typeof toggleNode ===
                "function"
            ) {

                toggleNode(
                    parentNode.id
                );
            }
        }
    );



    // ==================================================
    // 防止拖动画布
    // ==================================================

    control.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            event.stopPropagation();
        }
    );



    // ==================================================
    // ★ 加入 #tree
    //
    // 不再加入 .tree-canvas
    // ==================================================

    tree.appendChild(
        control
    );
}
