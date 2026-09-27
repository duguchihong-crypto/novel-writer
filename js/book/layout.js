// ==============================
// 全书页面：树形布局
// 支持：纵向 / 横向
// ==============================


// ==================================================
// 获取当前布局方向
// ==================================================

function getBookLayoutDirection() {

    if (
        currentBook &&
        currentBook.layoutDirection ===
            "horizontal"
    ) {

        return "horizontal";
    }

    return "vertical";
}


// ==================================================
// 设置布局方向
// ==================================================

function setBookLayoutDirection(
    direction
) {

    if (!currentBook) {
        return;
    }

    if (
        direction !== "vertical" &&
        direction !== "horizontal"
    ) {

        direction =
            "vertical";
    }

    currentBook.layoutDirection =
        direction;

    saveBook();

    renderTree();

    if (
        typeof updateLayoutToggle ===
        "function"
    ) {

        updateLayoutToggle();
    }
}


// ==================================================
// 切换布局方向
// ==================================================

function toggleBookLayoutDirection() {

    const current =
        getBookLayoutDirection();

    if (
        current ===
        "vertical"
    ) {

        setBookLayoutDirection(
            "horizontal"
        );

    } else {

        setBookLayoutDirection(
            "vertical"
        );
    }
}


// ==================================================
// 主布局函数
// ==================================================

function calculateLayout() {

    if (!currentBook) {

        return {
            nodes: [],
            width: 0,
            height: 0,
            direction: "vertical"
        };
    }


    const roots =
        Array.isArray(
            currentBook.structure
        )
            ? currentBook.structure
            : [];


    const layout = {

        nodes: [],

        width: 0,

        height: 0,

        direction:
            getBookLayoutDirection()
    };


    if (
        roots.length === 0
    ) {

        return layout;
    }


    // ==================================================
    // 节点尺寸
    // ==================================================

    const sampleNode =
        document.querySelector(
            ".node-box"
        );


    let NODE_W =
        NODE_WIDTH;

    let NODE_H =
        NODE_HEIGHT;


    if (sampleNode) {

        NODE_W =
            sampleNode.offsetWidth ||
            NODE_WIDTH;

        NODE_H =
            sampleNode.offsetHeight ||
            NODE_HEIGHT;

    } else {

        if (
            window.innerWidth <=
            600
        ) {

            NODE_W = 135;
            NODE_H = 46;

        } else {

            NODE_W = 155;
            NODE_H = 48;
        }
    }


    // ==================================================
    // 参数
    // ==================================================

    const LEVEL_GAP =
        90;

    const SIBLING_GAP =
        35;

    const ROOT_GAP =
        90;

    const CANVAS_PADDING =
        80;


    // ==================================================
    // 获取书名
    // ==================================================

    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    const bookWidth =
        bookTitle
            ? (
                bookTitle.offsetWidth ||
                BOOK_MIN_WIDTH
            )
            : BOOK_MIN_WIDTH;


    const bookHeight =
        bookTitle
            ? (
                bookTitle.offsetHeight ||
                BOOK_MIN_HEIGHT
            )
            : BOOK_MIN_HEIGHT;


    // ==================================================
    // 获取书名位置
    //
    // 这里只读取。
    //
    // ★ 绝对不在这里修改书名位置。
    // ==================================================

    let bookLeft =
        parseFloat(
            bookTitle?.style.left
        );


    let bookTop =
        parseFloat(
            bookTitle?.style.top
        );


    if (
        !Number.isFinite(bookLeft)
    ) {

        if (
            Number.isFinite(
                Number(bookPosition.x)
            )
        ) {

            bookLeft =
                Number(
                    bookPosition.x
                );

        } else {

            bookLeft =
                Math.max(
                    0,
                    (
                        window.innerWidth -
                        bookWidth
                    ) / 2
                );
        }
    }


    if (
        !Number.isFinite(bookTop)
    ) {

        if (
            Number.isFinite(
                Number(bookPosition.y)
            )
        ) {

            bookTop =
                Number(
                    bookPosition.y
                );

        } else {

            bookTop =
                Math.max(
                    20,
                    (
                        window.innerHeight -
                        bookHeight
                    ) / 2
                );
        }
    }


    // ==================================================
    // 书名状态只读取
    //
    // 注意：
    // 不改变 style.left
    // 不改变 style.top
    // ==================================================

    bookPosition.x =
        bookLeft;

    bookPosition.y =
        bookTop;


    // ==================================================
    // 书名几何
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
    // 纵向子树宽度
    // ==================================================

    function getVerticalSubtreeWidth(
        node
    ) {

        if (!node) {
            return NODE_W;
        }


        if (
            node.collapsed === true ||
            !Array.isArray(
                node.children
            ) ||
            node.children.length === 0
        ) {

            return NODE_W;
        }


        let width = 0;


        node.children.forEach(
            (child, index) => {

                width +=
                    getVerticalSubtreeWidth(
                        child
                    );


                if (
                    index <
                    node.children.length - 1
                ) {

                    width +=
                        SIBLING_GAP;
                }
            }
        );


        return Math.max(
            NODE_W,
            width
        );
    }


    // ==================================================
    // 横向子树高度
    // ==================================================

    function getHorizontalSubtreeHeight(
        node
    ) {

        if (!node) {
            return NODE_H;
        }


        if (
            node.collapsed === true ||
            !Array.isArray(
                node.children
            ) ||
            node.children.length === 0
        ) {

            return NODE_H;
        }


        let height = 0;


        node.children.forEach(
            (child, index) => {

                height +=
                    getHorizontalSubtreeHeight(
                        child
                    );


                if (
                    index <
                    node.children.length - 1
                ) {

                    height +=
                        SIBLING_GAP;
                }
            }
        );


        return Math.max(
            NODE_H,
            height
        );
    }


    // ==================================================
    // 纵向
    //
    //                 小说名
    //                   │
    //             ┌─────┴─────┐
    //             │           │
    //           第一卷       第二卷
    // ==================================================

    if (
        layout.direction ===
        "vertical"
    ) {

        // ----------------------------------------------
        // 所有根节点总宽度
        // ----------------------------------------------

        let totalRootWidth =
            0;


        roots.forEach(
            (root, index) => {

                totalRootWidth +=
                    getVerticalSubtreeWidth(
                        root
                    );


                if (
                    index <
                    roots.length - 1
                ) {

                    totalRootWidth +=
                        SIBLING_GAP;
                }
            }
        );


        // ----------------------------------------------
        // 以书名中心作为树中心
        // ----------------------------------------------

        const rootStartX =
            bookCenterX -
            totalRootWidth / 2;


        const rootY =
            bookBottom +
            ROOT_GAP;


        // ----------------------------------------------
        // 放置节点
        // ----------------------------------------------

        function placeVerticalNodes(
            nodes,
            startX,
            level
        ) {

            if (
                !Array.isArray(nodes) ||
                nodes.length === 0
            ) {

                return;
            }


            let currentX =
                startX;


            nodes.forEach(
                node => {

                    const subtreeWidth =
                        getVerticalSubtreeWidth(
                            node
                        );


                    const centerX =
                        currentX +
                        subtreeWidth / 2;


                    const x =
                        centerX -
                        NODE_W / 2;


                    const y =
                        rootY +
                        level *
                        (
                            NODE_H +
                            LEVEL_GAP
                        );


                    layout.nodes.push({

                        id:
                            node.id,

                        node:
                            node,

                        x:
                            x,

                        y:
                            y,

                        width:
                            NODE_W,

                        height:
                            NODE_H,

                        level:
                            level,

                        centerX:
                            centerX,

                        centerY:
                            y +
                            NODE_H / 2
                    });


                    if (
                        node.collapsed !== true &&
                        Array.isArray(
                            node.children
                        ) &&
                        node.children.length > 0
                    ) {

                        placeVerticalNodes(
                            node.children,
                            currentX,
                            level + 1
                        );
                    }


                    currentX +=
                        subtreeWidth +
                        SIBLING_GAP;
                }
            );
        }


        placeVerticalNodes(
            roots,
            rootStartX,
            0
        );


        // ==================================================
        // 找到节点最左边
        // ==================================================

        let minNodeX =
            Infinity;

        let maxNodeX =
            -Infinity;

        let maxNodeY =
            -Infinity;


        layout.nodes.forEach(
            item => {

                minNodeX =
                    Math.min(
                        minNodeX,
                        item.x
                    );


                maxNodeX =
                    Math.max(
                        maxNodeX,
                        item.x +
                        item.width
                    );


                maxNodeY =
                    Math.max(
                        maxNodeY,
                        item.y +
                        item.height
                    );
            }
        );


        // ==================================================
        // ★ 关键修复
        //
        // 如果节点跑到 0 左边：
        //
        // 只移动节点。
        //
        // 绝对不移动书名。
        // ==================================================

        if (
            minNodeX < CANVAS_PADDING
        ) {

            const shift =
                CANVAS_PADDING -
                minNodeX;


            layout.nodes.forEach(
                item => {

                    item.x +=
                        shift;

                    item.centerX +=
                        shift;
                }
            );


            maxNodeX +=
                shift;
        }


        // ==================================================
        // 计算画布尺寸
        // ==================================================

        layout.width =
            Math.max(
                maxNodeX +
                CANVAS_PADDING,

                window.innerWidth
            );


        layout.height =
            Math.max(
                maxNodeY +
                CANVAS_PADDING,

                window.innerHeight
            );
    }


    // ==================================================
    // 横向
    //
    // 小说名 ── 第一卷 ── 第一篇 ── 第一章
    //              │
    //              └── 第一章
    // ==================================================

    else {

        // ----------------------------------------------
        // 根节点总高度
        // ----------------------------------------------

        let totalRootHeight =
            0;


        roots.forEach(
            (root, index) => {

                totalRootHeight +=
                    getHorizontalSubtreeHeight(
                        root
                    );


                if (
                    index <
                    roots.length - 1
                ) {

                    totalRootHeight +=
                        SIBLING_GAP;
                }
            }
        );


        // ----------------------------------------------
        // 第一层 X
        // ----------------------------------------------

        const rootX =
            bookRight +
            ROOT_GAP;


        // ----------------------------------------------
        // 以书名中心为 Y 中心
        // ----------------------------------------------

        const rootStartY =
            bookCenterY -
            totalRootHeight / 2;


        // ----------------------------------------------
        // 放置节点
        // ----------------------------------------------

        function placeHorizontalNodes(
            nodes,
            startY,
            level
        ) {

            if (
                !Array.isArray(nodes) ||
                nodes.length === 0
            ) {

                return;
            }


            let currentY =
                startY;


            nodes.forEach(
                node => {

                    const subtreeHeight =
                        getHorizontalSubtreeHeight(
                            node
                        );


                    const centerY =
                        currentY +
                        subtreeHeight / 2;


                    const x =
                        rootX +
                        level *
                        (
                            NODE_W +
                            LEVEL_GAP
                        );


                    const y =
                        centerY -
                        NODE_H / 2;


                    layout.nodes.push({

                        id:
                            node.id,

                        node:
                            node,

                        x:
                            x,

                        y:
                            y,

                        width:
                            NODE_W,

                        height:
                            NODE_H,

                        level:
                            level,

                        centerX:
                            x +
                            NODE_W / 2,

                        centerY:
                            centerY
                    });


                    if (
                        node.collapsed !== true &&
                        Array.isArray(
                            node.children
                        ) &&
                        node.children.length > 0
                    ) {

                        placeHorizontalNodes(
                            node.children,
                            currentY,
                            level + 1
                        );
                    }


                    currentY +=
                        subtreeHeight +
                        SIBLING_GAP;
                }
            );
        }


        placeHorizontalNodes(
            roots,
            rootStartY,
            0
        );


        // ==================================================
        // 节点范围
        // ==================================================

        let minNodeY =
            Infinity;

        let maxNodeX =
            -Infinity;

        let maxNodeY =
            -Infinity;


        layout.nodes.forEach(
            item => {

                minNodeY =
                    Math.min(
                        minNodeY,
                        item.y
                    );


                maxNodeX =
                    Math.max(
                        maxNodeX,
                        item.x +
                        item.width
                    );


                maxNodeY =
                    Math.max(
                        maxNodeY,
                        item.y +
                        item.height
                    );
            }
        );


        // ==================================================
        // ★ 关键修复
        //
        // 节点跑到顶部时：
        //
        // 只移动节点。
        //
        // 书名完全不动。
        // ==================================================

        if (
            minNodeY < CANVAS_PADDING
        ) {

            const shift =
                CANVAS_PADDING -
                minNodeY;


            layout.nodes.forEach(
                item => {

                    item.y +=
                        shift;

                    item.centerY +=
                        shift;
                }
            );


            maxNodeY +=
                shift;
        }


        // ==================================================
        // 画布尺寸
        // ==================================================

        layout.width =
            Math.max(
                maxNodeX +
                CANVAS_PADDING,

                window.innerWidth
            );


        layout.height =
            Math.max(
                maxNodeY +
                CANVAS_PADDING,

                window.innerHeight
            );
    }


    // ==================================================
    // 公共信息
    // ==================================================

    layout.nodeWidth =
        NODE_W;

    layout.nodeHeight =
        NODE_H;


    layout.bookLeft =
        bookLeft;

    layout.bookTop =
        bookTop;

    layout.bookWidth =
        bookWidth;

    layout.bookHeight =
        bookHeight;

    layout.bookCenterX =
        bookCenterX;

    layout.bookCenterY =
        bookCenterY;

    layout.bookRight =
        bookRight;

    layout.bookBottom =
        bookBottom;


    return layout;
}
