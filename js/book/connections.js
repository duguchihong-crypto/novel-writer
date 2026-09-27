// ==============================
// 全书页面：连接线
// ==============================


function drawConnections(layout) {

    const svg =
        document.querySelector("#connections");

    if (!svg) {
        return;
    }


    svg.innerHTML = "";


    const canvas =
        document.querySelector(".tree-canvas");

    if (!canvas) {
        return;
    }


    const canvasRect =
        canvas.getBoundingClientRect();


    // ==============================
    // 获取元素相对于画布的位置
    // ==============================

    function getBoxRect(element) {

        const rect =
            element.getBoundingClientRect();


        return {

            left:
                rect.left -
                canvasRect.left,

            top:
                rect.top -
                canvasRect.top,

            right:
                rect.right -
                canvasRect.left,

            bottom:
                rect.bottom -
                canvasRect.top,

            centerX:
                rect.left -
                canvasRect.left +
                rect.width / 2,

            centerY:
                rect.top -
                canvasRect.top +
                rect.height / 2
        };
    }


    // ==============================
    // 绘制折线
    // ==============================

    function drawPath(points) {

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


        svg.appendChild(path);
    }


    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    // ==========================================================
    // 书名 → 第一层
    // ==========================================================

    if (
        bookTitle &&
        layout.nodes.length
    ) {

        const roots =
            layout.nodes.filter(
                item =>
                    item.level === 0
            );


        const bookRect =
            getBoxRect(bookTitle);


        // ==============================
        // 一个根节点
        // ==============================

        if (roots.length === 1) {

            const root =
                roots[0];


            const rootElement =
                document.querySelector(
                    `[data-node-id="${root.node.id}"] .node-box`
                );


            if (rootElement) {

                const rootRect =
                    getBoxRect(rootElement);


                const start = {

                    x:
                        bookRect.centerX,

                    y:
                        bookRect.bottom
                };


                const end = {

                    x:
                        rootRect.centerX,

                    y:
                        rootRect.top
                };


                const middleY =
                    (start.y + end.y) / 2;


                drawPath([

                    start,

                    {
                        x:
                            start.x,

                        y:
                            middleY
                    },

                    {
                        x:
                            end.x,

                        y:
                            middleY
                    },

                    end
                ]);
            }
        }


        // ==============================
        // 多个根节点
        // ==============================

        else {

            const firstRootElement =
                document.querySelector(
                    `[data-node-id="${roots[0].node.id}"] .node-box`
                );


            const lastRootElement =
                document.querySelector(
                    `[data-node-id="${roots[roots.length - 1].node.id}"] .node-box`
                );


            if (
                firstRootElement &&
                lastRootElement
            ) {

                const firstRect =
                    getBoxRect(
                        firstRootElement
                    );


                const branchY =
                    Math.max(
                        bookRect.bottom + 35,
                        firstRect.top - 35
                    );


                // 书名 → 总分支
                drawPath([

                    {
                        x:
                            bookRect.centerX,

                        y:
                            bookRect.bottom
                    },

                    {
                        x:
                            bookRect.centerX,

                        y:
                            branchY
                    },

                    {
                        x:
                            firstRect.centerX,

                        y:
                            branchY
                    }
                ]);


                // 总分支 → 所有根节点
                roots.forEach(root => {

                    const element =
                        document.querySelector(
                            `[data-node-id="${root.node.id}"] .node-box`
                        );


                    if (!element) {
                        return;
                    }


                    const rect =
                        getBoxRect(element);


                    drawPath([

                        {
                            x:
                                rect.centerX,

                            y:
                                branchY
                        },

                        {
                            x:
                                rect.centerX,

                            y:
                                rect.top
                        }
                    ]);
                });
            }
        }
    }


    // ==========================================================
    // 父节点 → 子节点
    // ==========================================================

    layout.nodes.forEach(item => {

        const parent =
            item.node;


        if (
            !parent.children ||
            !parent.children.length ||
            parent.collapsed
        ) {
            return;
        }


        const parentElement =
            document.querySelector(
                `[data-node-id="${parent.id}"] .node-box`
            );


        if (!parentElement) {
            return;
        }


        const parentRect =
            getBoxRect(parentElement);


        // 当前父节点的实际子节点
        const childItems =
            layout.nodes.filter(
                child =>
                    parent.children.some(
                        childNode =>
                            childNode.id ===
                            child.node.id
                    )
            );


        if (!childItems.length) {
            return;
        }


        // ======================================================
        // 一个孩子
        // ======================================================

        if (childItems.length === 1) {

            const child =
                childItems[0];


            const childElement =
                document.querySelector(
                    `[data-node-id="${child.node.id}"] .node-box`
                );


            if (!childElement) {
                return;
            }


            const childRect =
                getBoxRect(childElement);


            const start = {

                x:
                    parentRect.centerX,

                y:
                    parentRect.bottom
            };


            const end = {

                x:
                    childRect.centerX,

                y:
                    childRect.top
            };


            const middleY =
                (start.y + end.y) / 2;


            drawPath([

                start,

                {
                    x:
                        start.x,

                    y:
                        middleY
                },

                {
                    x:
                        end.x,

                    y:
                        middleY
                },

                end
            ]);


            // 直接把父节点传进去
            addLineControl(
                parent,
                middleY,
                (start.x + end.x) / 2
            );
        }


        // ======================================================
        // 多个孩子
        // ======================================================

        else {

            const firstElement =
                document.querySelector(
                    `[data-node-id="${childItems[0].node.id}"] .node-box`
                );


            if (!firstElement) {
                return;
            }


            const firstRect =
                getBoxRect(firstElement);


            const branchY =
                parentRect.bottom +
                LEVEL_GAP / 2;


            // 父节点 → 横向分支
            drawPath([

                {
                    x:
                        parentRect.centerX,

                    y:
                        parentRect.bottom
                },

                {
                    x:
                        parentRect.centerX,

                    y:
                        branchY
                },

                {
                    x:
                        firstRect.centerX,

                    y:
                        branchY
                }
            ]);


            // 横向分支 → 每一个孩子
            childItems.forEach(child => {

                const element =
                    document.querySelector(
                        `[data-node-id="${child.node.id}"] .node-box`
                    );


                if (!element) {
                    return;
                }


                const rect =
                    getBoxRect(element);


                drawPath([

                    {
                        x:
                            rect.centerX,

                        y:
                            branchY
                    },

                    {
                        x:
                            rect.centerX,

                        y:
                            rect.top
                    }
                ]);
            });


            // 直接把父节点传进去
            addLineControl(
                parent,
                branchY,
                parentRect.centerX
            );
        }
    });
}


// ==========================================================
// 在线中间添加 + / −
// ==========================================================

function addLineControl(
    parentNode,
    top,
    left
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


    control.style.left =
        left + "px";


    control.style.top =
        top + "px";


    // 点击 + / −
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
