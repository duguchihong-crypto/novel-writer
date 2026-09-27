// ==============================
// 全书页面：连接线
// ==============================

function drawConnections(layout) {

    const svg = document.querySelector("#connections");

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


    const bookTitle =
        document.querySelector("#bookTitle");


    // ==============================
    // 书名 → 第一层
    // ==============================

    if (bookTitle && layout.nodes.length) {

        const roots =
            layout.nodes.filter(
                item => item.level === 0
            );


        const bookRect =
            getBoxRect(bookTitle);


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
                    x: bookRect.centerX,
                    y: bookRect.bottom
                };


                const end = {
                    x: rootRect.centerX,
                    y: rootRect.top
                };


                const middleY =
                    (start.y + end.y) / 2;


                drawPath([
                    start,

                    {
                        x: start.x,
                        y: middleY
                    },

                    {
                        x: end.x,
                        y: middleY
                    },

                    end
                ]);
            }

        } else {

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
                    getBoxRect(firstRootElement);

                const lastRect =
                    getBoxRect(lastRootElement);


                const branchY =
                    Math.max(
                        bookRect.bottom + 35,
                        firstRect.top - 35
                    );


                drawPath([
                    {
                        x: bookRect.centerX,
                        y: bookRect.bottom
                    },

                    {
                        x: bookRect.centerX,
                        y: branchY
                    },

                    {
                        x: firstRect.centerX,
                        y: branchY
                    }
                ]);


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
                            x: rect.centerX,
                            y: branchY
                        },

                        {
                            x: rect.centerX,
                            y: rect.top
                        }
                    ]);
                });
            }
        }
    }


    // ==============================
    // 父节点 → 子节点
    // ==============================

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


        const childItems =
            layout.nodes.filter(
                child =>
                    parent.children.some(
                        childNode =>
                            childNode.id === child.node.id
                    )
            );


        if (!childItems.length) {
            return;
        }


        // 一个孩子
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
                x: parentRect.centerX,
                y: parentRect.bottom
            };


            const end = {
                x: childRect.centerX,
                y: childRect.top
            };


            const middleY =
                (start.y + end.y) / 2;


            drawPath([
                start,

                {
                    x: start.x,
                    y: middleY
                },

                {
                    x: end.x,
                    y: middleY
                },

                end
            ]);


            addLineControl(
                middleY,
                (start.x + end.x) / 2,
                parent.collapsed
            );

        }

        // 多个孩子
        else {

            const firstElement =
                document.querySelector(
                    `[data-node-id="${childItems[0].node.id}"] .node-box`
                );


            const lastElement =
                document.querySelector(
                    `[data-node-id="${childItems[childItems.length - 1].node.id}"] .node-box`
                );


            if (
                !firstElement ||
                !lastElement
            ) {
                return;
            }


            const firstRect =
                getBoxRect(firstElement);

            const lastRect =
                getBoxRect(lastElement);


            const branchY =
                parentRect.bottom +
                LEVEL_GAP / 2;


            drawPath([
                {
                    x: parentRect.centerX,
                    y: parentRect.bottom
                },

                {
                    x: parentRect.centerX,
                    y: branchY
                },

                {
                    x: firstRect.centerX,
                    y: branchY
                }
            ]);


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
                        x: rect.centerX,
                        y: branchY
                    },

                    {
                        x: rect.centerX,
                        y: rect.top
                    }
                ]);
            });


            addLineControl(
                branchY,
                parentRect.centerX,
                parent.collapsed
            );
        }
    });
}


// 在线中间添加 + / -
function addLineControl(
    top,
    left,
    collapsed
) {

    const control =
        document.createElement("button");

    control.type = "button";

    control.className =
        "line-control";


    control.textContent =
        collapsed ? "+" : "−";


    control.style.left =
        left + "px";


    control.style.top =
        top + "px";


    const parentNode =
        findNodeByConnectionPosition(
            left,
            top
        );


    if (parentNode) {

        control.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                toggleNode(
                    parentNode.id
                );
            }
        );
    }


    const canvas =
        document.querySelector(".tree-canvas");

    if (canvas) {
        canvas.appendChild(control);
    }
}


// 根据连接位置寻找对应父节点
function findNodeByConnectionPosition(
    left,
    top
) {

    if (!currentBook) {
        return null;
    }


    let result = null;


    function search(nodes) {

        if (!nodes || result) {
            return;
        }


        nodes.forEach(node => {

            if (result) {
                return;
            }


            const element =
                document.querySelector(
                    `[data-node-id="${node.id}"] .node-box`
                );


            if (element) {

                const rect =
                    element.getBoundingClientRect();

                const canvas =
                    document.querySelector(
                        ".tree-canvas"
                    );


                if (canvas) {

                    const canvasRect =
                        canvas.getBoundingClientRect();


                    const centerX =
                        rect.left -
                        canvasRect.left +
                        rect.width / 2;


                    const bottomY =
                        rect.bottom -
                        canvasRect.top;


                    if (
                        Math.abs(centerX - left) < 2 &&
                        Math.abs(
                            bottomY +
                            LEVEL_GAP / 2 -
                            top
                        ) < 10
                    ) {

                        result = node;

                        return;
                    }
                }
            }


            search(node.children);
        });
    }


    search(currentBook.structure);

    return result;
}
