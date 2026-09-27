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
    // 获取书名当前位置
    //
    // 注意：
    // 这里只读取。
    //
    // 绝对不修改书名位置。
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
        !Number.isFinite(
            bookLeft
        )
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
        !Number.isFinite(
            bookTop
        )
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
    // 同步状态
    //
    // 只记录当前值。
    // ==================================================

    bookPosition.x =
        bookLeft;

    bookPosition.y =
        bookTop;


    // ==================================================
    // 书名几何信息
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
    // 纵向布局
    //
    //                 小说名
    //                   │
    //             ┌─────┴─────┐
    //             │           │
    //           第一卷       第二卷
    //             │
    //        ┌────┴────┐
    //        │         │
    //      第一篇     第一章
    // ==================================================

    if (
        layout.direction ===
        "vertical"
    ) {

        // ----------------------------------------------
        // 计算所有根节点的总宽度
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
        // 以书名中心为树中心
        // ----------------------------------------------

        const rootStartX =
            bookCenterX -
            totalRootWidth / 2;


        // ----------------------------------------------
        // 第一层节点 Y
        // ----------------------------------------------

        const rootY =
            bookBottom +
            ROOT_GAP;


        // ----------------------------------------------
        // 递归放置节点
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
        // 计算实际范围
        // ==================================================

        let minX =
            bookLeft;

        let maxX =
            bookRight;

        let maxY =
            bookBottom;


        layout.nodes.forEach(
            item => {

                minX =
                    Math.min(
                        minX,
                        item.x
                    );


                maxX =
                    Math.max(
                        maxX,
                        item.x +
                        item.width
                    );


                maxY =
                    Math.max(
                        maxY,
                        item.y +
                        item.height
                    );
            }
        );


        // ==================================================
        // 关键修复
        //
        // 不再修改节点坐标。
        // 不再修改书名坐标。
        //
        // 只扩大画布。
        // ==================================================

        const leftRequired =
            minX < 0
                ? Math.abs(minX)
                : 0;


        const rightRequired =
            maxX +
            CANVAS_PADDING;


        layout.width =
            Math.max(
                rightRequired,
                window.innerWidth +
                leftRequired
            );


        layout.height =
            Math.max(
                maxY +
                CANVAS_PADDING,
                window.innerHeight
            );


        layout.centerX =
            bookCenterX;


        layout.centerY =
            bookCenterY;
    }


    // ==================================================
    // 横向布局
    //
    // 小说名 ── 第一卷 ── 第一篇 ── 第一章
    //                         │
    //                         └── 第二章
    // ==================================================

    else {

        // ----------------------------------------------
        // 计算所有根节点总高度
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
        // 以书名中心为树中心
        // ----------------------------------------------

        const rootStartY =
            bookCenterY -
            totalRootHeight / 2;


        // ----------------------------------------------
        // 递归放置
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
        // 计算实际范围
        // ==================================================

        let minY =
            bookTop;

        let maxX =
            bookRight;

        let maxY =
            bookBottom;


        layout.nodes.forEach(
            item => {

                minY =
                    Math.min(
                        minY,
                        item.y
                    );


                maxX =
                    Math.max(
                        maxX,
                        item.x +
                        item.width
                    );


                maxY =
                    Math.max(
                        maxY,
                        item.y +
                        item.height
                    );
            }
        );


        // ==================================================
        // 关键修复
        //
        // 不移动书名。
        // 不移动节点。
        // 只计算足够大的画布。
        // ==================================================

        const topRequired =
            minY < 0
                ? Math.abs(minY)
                : 0;


        layout.width =
            Math.max(
                maxX +
                CANVAS_PADDING,
                window.innerWidth
            );


        layout.height =
            Math.max(
                maxY +
                CANVAS_PADDING,
                window.innerHeight +
                topRequired
            );


        layout.centerX =
            bookCenterX;


        layout.centerY =
            bookCenterY;
    }


    // ==================================================
    // 公共尺寸
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
