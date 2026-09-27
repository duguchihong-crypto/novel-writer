// ==============================
// 全书页面：连接线
// ==============================

function drawConnections(layout) {

    const svg =
        document.querySelector("#connections");

    const canvas =
        document.querySelector(".tree-canvas");

    if (!svg || !canvas || !layout) {
        return;
    }

    svg.innerHTML = "";

    // 删除旧的 + / -
    canvas
        .querySelectorAll(".line-control")
        .forEach(element => {
            element.remove();
        });


    // ==============================
    // SVG 坐标
    // ==============================

    const canvasRect =
        canvas.getBoundingClientRect();


    function getRect(element) {

        const rect =
            element.getBoundingClientRect();

        return {

            left:
                rect.left -
                canvasRect.left +
                canvas.scrollLeft,

            top:
                rect.top -
                canvasRect.top +
                canvas.scrollTop,

            right:
                rect.right -
                canvasRect.left +
                canvas.scrollLeft,

            bottom:
                rect.bottom -
                canvasRect.top +
                canvas.scrollTop,

            centerX:
                rect.left -
                canvasRect.left +
                canvas.scrollLeft +
                rect.width / 2,

            centerY:
                rect.top -
                canvasRect.top +
                canvas.scrollTop +
                rect.height / 2
        };
    }


    // ==============================
    // 画线
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


    // ==============================
    // 获取书名
    // ==============================

    const bookTitle =
        document.querySelector("#bookTitle");


    if (!bookTitle) {
        return;
    }


    const bookRect =
        getRect(bookTitle);


    // ==============================
    // 根节点
    // ==============================

    const roots =
        layout.nodes.filter(
            item =>
                item.level === 0
        );


    if (!roots.length) {
        return;
    }


    // ==============================
    // 书名 → 根节点
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
                getRect(rootElement);


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
                (
                    start.y +
                    end.y
                ) / 2;


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

    } else {

        /*
         * 多个根节点：
         *
         *                  书名
         *                   │
         *          ─────────┼─────────
         *          │        │        │
         *         序       第一卷    第二卷
         */

        const firstRoot =
            document.querySelector(
                `[data-node-id="${roots[0].node.id}"] .node-box`
            );


        const lastRoot =
            document.querySelector(
                `[data-node-id="${roots[roots.length - 1].node.id}"] .node-box`
            );


        if (
            firstRoot &&
            lastRoot
        ) {

            const firstRect =
                getRect(firstRoot);

            const lastRect =
                getRect(lastRoot);


            const branchY =
                bookRect.bottom +
                35;


            // 书名 → 横向主干

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
                        lastRect.centerX,

                    y:
                        branchY

                }

            ]);


            // 每个根节点 ↓

            roots.forEach(
                root => {

                    const element =
                        document.querySelector(
                            `[data-node-id="${root.node.id}"] .node-box`
                        );


                    if (!element) {
                        return;
                    }


                    const rect =
                        getRect(element);


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

                }
            );
        }
    }


    // ==============================
    // 父节点 → 子节点
    // ==============================

    layout.nodes.forEach(
        item => {

            const parent =
                item.node;


            if (
                !Array.isArray(
                    parent.children
                ) ||
                parent.children.length === 0 ||
                parent.collapsed === true
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
                getRect(parentElement);


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


            // ==============================
            // 一个子节点
            // ==============================

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
                    getRect(childElement);


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
                    (
                        start.y +
                        end.y
                    ) / 2;


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


                addLineControl(

                    parent,

                    middleY,

                    (
                        start.x +
                        end.x
                    ) / 2

                );


                return;
            }


            // ==============================
            // 多个子节点
            // ==============================

            const branchY =
                parentRect.bottom +
                LEVEL_GAP / 2;


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

                }

            ]);


            childItems.forEach(
                child => {

                    const element =
                        document.querySelector(
                            `[data-node-id="${child.node.id}"] .node-box`
                        );


                    if (!element) {
                        return;
                    }


                    const rect =
                        getRect(element);


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

                }
            );


            addLineControl(

                parent,

                branchY,

                parentRect.centerX

            );

        }
    );
}


// ==============================
// 创建 + / −
 // ==============================

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
