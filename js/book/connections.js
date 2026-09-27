// ==============================
// 全书页面：连接线
// 支持：纵向 / 横向
//
// ★ 中心对齐完整最终版
//
// 核心规则：
//
// 横向：
//
// 父节点右侧中心
//        │
//        └──────────────┬──── 子节点左侧中心
//                       │
//                       ├──── 子节点左侧中心
//                       │
//                       └──── 子节点左侧中心
//
//
// 纵向：
//
//          父节点底部中心
//                 │
//                [−]
//                 │
//          ───────┼───────
//                 │
//             子节点顶部中心
//
// 1. 所有连接点使用真实几何中心
// 2. 父节点从中心位置出线
// 3. 子节点从中心位置进线
// 4. 多子节点使用公共主干
// 5. + / − 位于父节点主干
// 6. SVG 与按钮使用相同坐标系
// 7. 支持纵向 / 横向
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


    // ==================================================
    // 清空旧连接线
    // ==================================================

    svg.innerHTML = "";


    // ==================================================
    // 清空旧 + / −
    // ==================================================

    document
        .querySelectorAll(".line-control")
        .forEach(element => {
            element.remove();
        });


    // ==================================================
    // 没有布局
    // ==================================================

    if (
        !layout ||
        !Array.isArray(layout.nodes) ||
        layout.nodes.length === 0
    ) {
        return;
    }



    // ==================================================
    // SVG 画线
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


    layout.nodes.forEach(item => {

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

    });



    // ==================================================
    // 书名节点
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
        Number.isFinite(styleLeft)
            ? styleLeft
            : (
                Number(layout.bookLeft) || 0
            );


    const bookTop =
        Number.isFinite(styleTop)
            ? styleTop
            : (
                Number(layout.bookTop) || 0
            );



    // ==================================================
    // 书名尺寸
    // ==================================================

    const bookWidth =
        bookTitle.offsetWidth ||
        Number(layout.bookWidth) ||
        BOOK_MIN_WIDTH;


    const bookHeight =
        bookTitle.offsetHeight ||
        Number(layout.bookHeight) ||
        BOOK_MIN_HEIGHT;



    // ==================================================
    // 书名几何位置
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


    if (roots.length === 0) {
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
// 节点：中心 X
// ==================================================

function getNodeCenterX(item) {

    return (
        Number(item.x) +
        Number(item.width) / 2
    );

}



// ==================================================
// 节点：中心 Y
// ==================================================

function getNodeCenterY(item) {

    return (
        Number(item.y) +
        Number(item.height) / 2
    );

}



// ==================================================
// 节点：顶部
// ==================================================

function getNodeTop(item) {

    return Number(item.y);

}



// ==================================================
// 节点：底部
// ==================================================

function getNodeBottom(item) {

    return (
        Number(item.y) +
        Number(item.height)
    );

}



// ==================================================
// 节点：左侧
// ==================================================

function getNodeLeft(item) {

    return Number(item.x);

}



// ==================================================
// 节点：右侧
// ==================================================

function getNodeRight(item) {

    return (
        Number(item.x) +
        Number(item.width)
    );

}



// ==================================================
// ==================================================
// 纵向连接
// ==================================================
// ==================================================
//
//        父
//        │
//       [−]
//        │
//        │
//   ─────┼─────
//     │       │
//    子1     子2
//
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

    nodeMap.forEach(parentItem => {

        const parent =
            parentItem.node;


        if (!parent) {
            return;
        }


        // 收起后不画子节点
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
                .filter(Boolean);


        if (children.length === 0) {
            return;
        }


        drawVerticalParentConnections(
            parentItem,
            children,
            drawPath
        );

    });

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
    // 单根节点
    // ==================================================

    if (roots.length === 1) {

        const root =
            roots[0];


        const rootCenterX =
            getNodeCenterX(root);


        const rootTop =
            getNodeTop(root);


        const middleY =
            (
                bookBottom +
                rootTop
            ) / 2;


        drawPath([
            {
                x: bookCenterX,
                y: bookBottom
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
                y: rootTop
            }
        ]);


        return;
    }



    // ==================================================
    // 多根节点
    // ==================================================

    const centerXs =
        roots.map(
            root =>
                getNodeCenterX(root)
        );


    const firstCenterX =
        Math.min(...centerXs);


    const lastCenterX =
        Math.max(...centerXs);


    const rootTop =
        Math.min(
            ...roots.map(
                root =>
                    getNodeTop(root)
            )
        );


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
            x: bookCenterX,
            y: bookBottom
        },

        {
            x: bookCenterX,
            y: branchY
        }
    ]);



    // ==================================================
    // 横向公共主干
    // ==================================================

    drawPath([
        {
            x: firstCenterX,
            y: branchY
        },

        {
            x: lastCenterX,
            y: branchY
        }
    ]);



    // ==================================================
    // 主干 → 根节点中心
    // ==================================================

    roots.forEach(root => {

        const centerX =
            getNodeCenterX(root);


        const top =
            getNodeTop(root);


        drawPath([
            {
                x: centerX,
                y: branchY
            },

            {
                x: centerX,
                y: top
            }
        ]);

    });

}



// ==================================================
// 纵向：父 → 子
// ==================================================

function drawVerticalParentConnections(
    parent,
    children,
    drawPath
) {


    // ==================================================
    // 父节点
    // ==================================================

    const parentCenterX =
        getNodeCenterX(parent);


    const parentBottom =
        getNodeBottom(parent);



    // ==================================================
    // 单子节点
    // ==================================================

    if (children.length === 1) {

        const child =
            children[0];


        const childCenterX =
            getNodeCenterX(child);


        const childTop =
            getNodeTop(child);


        const middleY =
            (
                parentBottom +
                childTop
            ) / 2;



        // ==================================================
        // 父底部中心
        // ↓
        // 子顶部中心
        // ==================================================

        drawPath([
            {
                x: parentCenterX,
                y: parentBottom
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
                y: childTop
            }
        ]);



        // ==================================================
        // + / −
        // ==================================================

        const controlY =
            (
                parentBottom +
                middleY
            ) / 2;


        addLineControl(
            parent.node,
            parentCenterX,
            controlY
        );


        return;
    }



    // ==================================================
    // 多子节点
    // ==================================================

    const childCenterXs =
        children.map(
            child =>
                getNodeCenterX(child)
        );


    const firstCenterX =
        Math.min(
            ...childCenterXs
        );


    const lastCenterX =
        Math.max(
            ...childCenterXs
        );


    const childTop =
        Math.min(
            ...children.map(
                child =>
                    getNodeTop(child)
            )
        );


    const branchY =
        (
            parentBottom +
            childTop
        ) / 2;



    // ==================================================
    // 父节点底部中心 → 分叉位置
    // ==================================================

    drawPath([
        {
            x: parentCenterX,
            y: parentBottom
        },

        {
            x: parentCenterX,
            y: branchY
        }
    ]);



    // ==================================================
    // 横向公共主干
    // ==================================================

    drawPath([
        {
            x: firstCenterX,
            y: branchY
        },

        {
            x: lastCenterX,
            y: branchY
        }
    ]);



    // ==================================================
    // 公共主干 → 子节点顶部中心
    // ==================================================

    children.forEach(child => {

        const centerX =
            getNodeCenterX(child);


        const top =
            getNodeTop(child);


        drawPath([
            {
                x: centerX,
                y: branchY
            },

            {
                x: centerX,
                y: top
            }
        ]);

    });



    // ==================================================
    // + / −
    // ==================================================

    const controlY =
        (
            parentBottom +
            branchY
        ) / 2;


    addLineControl(
        parent.node,
        parentCenterX,
        controlY
    );

}



// ==================================================
// ==================================================
// 横向连接
// ==================================================
// ==================================================
//
// 小说名 ───────── 卷
//
//                   │
//                   ├──────── 章
//                   │
//                   ├──────── 章
//                   │
//                   └──────── 章
//
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
    // 父节点 → 子节点
    // ==================================================

    nodeMap.forEach(parentItem => {

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
                .filter(Boolean);


        if (children.length === 0) {
            return;
        }


        drawHorizontalParentConnections(
            parentItem,
            children,
            drawPath
        );

    });

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

    if (roots.length === 1) {

        const root =
            roots[0];


        const rootLeft =
            getNodeLeft(root);


        const rootCenterY =
            getNodeCenterY(root);


        const middleX =
            (
                bookRight +
                rootLeft
            ) / 2;



        // ==================================================
        // 书名右侧中心
        // → 根节点左侧中心
        // ==================================================

        drawPath([
            {
                x: bookRight,
                y: bookCenterY
            },

            {
                x: middleX,
                y: bookCenterY
            },

            {
                x: middleX,
                y: rootCenterY
            },

            {
                x: rootLeft,
                y: rootCenterY
            }
        ]);


        return;
    }



    // ==================================================
    // 多根
    // ==================================================

    const centerYs =
        roots.map(
            root =>
                getNodeCenterY(root)
        );


    const firstCenterY =
        Math.min(...centerYs);


    const lastCenterY =
        Math.max(...centerYs);


    const rootLeft =
        Math.min(
            ...roots.map(
                root =>
                    getNodeLeft(root)
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
            x: bookRight,
            y: bookCenterY
        },

        {
            x: branchX,
            y: bookCenterY
        }
    ]);



    // ==================================================
    // 公共竖向主干
    //
    // ★ 必须经过书名中心
    // ★ 必须覆盖所有根节点中心
    // ==================================================

    const branchTopY =
        Math.min(
            bookCenterY,
            firstCenterY
        );


    const branchBottomY =
        Math.max(
            bookCenterY,
            lastCenterY
        );


    drawPath([
        {
            x: branchX,
            y: branchTopY
        },

        {
            x: branchX,
            y: branchBottomY
        }
    ]);



    // ==================================================
    // 主干 → 根节点左侧中心
    // ==================================================

    roots.forEach(root => {

        const centerY =
            getNodeCenterY(root);


        const left =
            getNodeLeft(root);


        drawPath([
            {
                x: branchX,
                y: centerY
            },

            {
                x: left,
                y: centerY
            }
        ]);

    });

}



// ==================================================
// 横向：父 → 子
// ==================================================
//
// 父 ───── [−] ─────┬──── 子1
//                   │
//                   ├──── 子2
//                   │
//                   └──── 子3
//
// ==================================================

function drawHorizontalParentConnections(
    parent,
    children,
    drawPath
) {


    // ==================================================
    // 父节点右侧中心
    // ==================================================

    const parentRight =
        getNodeRight(parent);


    const parentCenterY =
        getNodeCenterY(parent);



    // ==================================================
    // 单子节点
    // ==================================================

    if (children.length === 1) {

        const child =
            children[0];


        const childLeft =
            getNodeLeft(child);


        const childCenterY =
            getNodeCenterY(child);


        const middleX =
            (
                parentRight +
                childLeft
            ) / 2;



        // ==================================================
        // 父节点右侧中心
        // ↓
        // 子节点左侧中心
        // ==================================================

        drawPath([
            {
                x: parentRight,
                y: parentCenterY
            },

            {
                x: middleX,
                y: parentCenterY
            },

            {
                x: middleX,
                y: childCenterY
            },

            {
                x: childLeft,
                y: childCenterY
            }
        ]);



        // ==================================================
        // + / −
        //
        // ★ 父节点中心水平线上
        // ==================================================

        const controlX =
            (
                parentRight +
                middleX
            ) / 2;


        addLineControl(
            parent.node,
            controlX,
            parentCenterY
        );


        return;
    }



    // ==================================================
    // 多子节点
    // ==================================================

    const childCenterYs =
        children.map(
            child =>
                getNodeCenterY(child)
        );


    const firstCenterY =
        Math.min(
            ...childCenterYs
        );


    const lastCenterY =
        Math.max(
            ...childCenterYs
        );


    const childLeft =
        Math.min(
            ...children.map(
                child =>
                    getNodeLeft(child)
            )
        );


    const branchX =
        (
            parentRight +
            childLeft
        ) / 2;



    // ==================================================
    // 父节点右侧中心
    // → 公共竖线
    // ==================================================

    drawPath([
        {
            x: parentRight,
            y: parentCenterY
        },

        {
            x: branchX,
            y: parentCenterY
        }
    ]);



    // ==================================================
    // ★ 公共竖线
    //
    // 从父节点中心开始
    // 一直覆盖所有子节点中心
    // ==================================================

    const branchTopY =
        Math.min(
            parentCenterY,
            firstCenterY
        );


    const branchBottomY =
        Math.max(
            parentCenterY,
            lastCenterY
        );


    drawPath([
        {
            x: branchX,
            y: branchTopY
        },

        {
            x: branchX,
            y: branchBottomY
        }
    ]);



    // ==================================================
    // 公共竖线
    // → 每个子节点左侧中心
    // ==================================================

    children.forEach(child => {

        const centerY =
            getNodeCenterY(child);


        const left =
            getNodeLeft(child);


        drawPath([
            {
                x: branchX,
                y: centerY
            },

            {
                x: left,
                y: centerY
            }
        ]);

    });



    // ==================================================
    // + / −
    //
    // ★ 只放在父节点主干
    // ==================================================

    const controlX =
        (
            parentRight +
            branchX
        ) / 2;


    addLineControl(
        parent.node,
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
    // 按钮尺寸
    // ==================================================

    const size =
        26;



    // ==================================================
    // ★ 中心定位
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


            if (!parentNode) {
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
    // 加入 #tree
    // ==================================================

    tree.appendChild(
        control
    );

}
