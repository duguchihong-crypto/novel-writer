// ==============================
// 全书页面：树形布局
// 支持：纵向 / 横向
// ==============================


// ==================================================
// 获取当前布局方向
//
// vertical   = 纵向
// horizontal = 横向
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

            direction:
                "vertical"
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
    // 获取实际节点尺寸
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

            NODE_W =
                135;

            NODE_H =
                46;

        } else {

            NODE_W =
                155;

            NODE_H =
                48;
        }
    }


    // ==================================================
    // 布局参数
    // ==================================================

    const PADDING =
        80;


    // 父子之间的距离

    const LEVEL_GAP =
        90;


    // 同级之间的距离

    const SIBLING_GAP =
        35;


    // 书名与第一层之间

    const ROOT_GAP =
        90;


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
    // 这里非常重要：
    //
    // layout.js 只读取书名位置，
    // 不负责改变书名位置。
    // ==================================================

    let bookLeft =
        parseFloat(
            bookTitle?.style.left
        );


    let bookTop =
        parseFloat(
            bookTitle?.style.top
        );


    // ==================================================
    // 如果没有位置，使用 state 中的位置
    // ==================================================

    if (
        !Number.isFinite(
            bookLeft
        ) &&
        Number.isFinite(
            Number(bookPosition.x)
        )
    ) {

        bookLeft =
            Number(
                bookPosition.x
            );
    }


    if (
        !Number.isFinite(
            bookTop
        ) &&
        Number.isFinite(
            Number(bookPosition.y)
        )
    ) {

        bookTop =
            Number(
                bookPosition.y
            );
    }


    // ==================================================
    // 第一次没有任何位置
    // 才使用默认位置
    // ==================================================

    if (
        !Number.isFinite(
            bookLeft
        )
    ) {

        bookLeft =
            Math.max(
                0,
                (
                    window.innerWidth -
                    bookWidth
                ) / 2
            );
    }


    if (
        !Number.isFinite(
            bookTop
        )
    ) {

        bookTop =
            80;
    }


    // ==================================================
    // 同步书名位置
    //
    // 只记录，不移动。
    // ==================================================

    if (bookTitle) {

        bookTitle.style.left =
            bookLeft + "px";

        bookTitle.style.top =
            bookTop + "px";
    }


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
    // 计算纵向子树宽度
    //
    // 父 → 下
    // 同级 → 左右
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
    // 计算横向子树高度
    //
    // 父 → 右
    // 同级 → 上下
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
    //        小说名
    //          │
    //     ┌────┴────┐
    //    第一卷   第二卷
    //       │
    //   ┌───┴───┐
    //  第一篇  第一章
    // ==================================================

    if (
        layout.direction ===
        "vertical"
    ) {

        let totalRootWidth =
            0;


        // ------------------------------------------
        // 计算所有根节点占用的总宽度
        // ------------------------------------------

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


        // ------------------------------------------
        // 树整体以书名中心为中心
        // ------------------------------------------

        const treeCenterX =
            bookCenterX;


        const rootStartX =
            treeCenterX -
            totalRootWidth / 2;


        // ------------------------------------------
        // 第一层节点 Y
        // ------------------------------------------

        const rootY =
            bookBottom +
            ROOT_GAP;


        // ------------------------------------------
        // 递归放置节点
        // ------------------------------------------

        function placeVerticalNodes(
            nodes,
            startX,
            level
        ) {

            if (
                !Array.isArray(
                    nodes
                ) ||
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


                    // ----------------------------------
                    // 子节点
                    // ----------------------------------

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
            Math.min(
                bookLeft,
                ...layout.nodes.map(
                    item => item.x
                )
            );


        let maxX =
            Math.max(
                bookRight,
                ...layout.nodes.map(
                    item =>
                        item.x +
                        item.width
                )
            );


        let maxY =
            Math.max(
                bookBottom,
                ...layout.nodes.map(
                    item =>
                        item.y +
                        item.height
                )
            );


        // ==================================================
        // 如果节点跑到左边
        //
        // 只移动节点。
        //
        // ❌ 不移动书名
        // ==================================================

        const leftShift =
            minX < PADDING
                ? PADDING - minX
                : 0;


        if (
            leftShift > 0
        ) {

            layout.nodes.forEach(
                item => {

                    item.x +=
                        leftShift;

                    item.centerX +=
                        leftShift;
                }
            );


            // 重新计算节点范围
            // 但不修改书名

            maxX +=
                leftShift;


            minX =
                Math.min(
                    bookLeft,
                    PADDING
                );
        }


        // ==================================================
        // 如果书名本身在左侧
        //
        // 不移动书名。
        //
        // 允许画布扩大。
        // ==================================================

        if (
            bookLeft < 0
        ) {

            minX =
                Math.min(
                    minX,
                    bookLeft
                );
        }


        // ==================================================
        // 画布尺寸
        // ==================================================

        layout.width =
            Math.max(
                maxX +
                PADDING,

                window.innerWidth
            );


        layout.height =
            Math.max(
                maxY +
                PADDING,

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

        let totalRootHeight =
            0;


        // ------------------------------------------
        // 计算根节点总高度
        // ------------------------------------------

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


        // ------------------------------------------
        // 第一层 X
        // ------------------------------------------

        const rootX =
            bookRight +
            ROOT_GAP;


        // ------------------------------------------
        // 以书名中心为树中心
        // ------------------------------------------

        const rootStartY =
            bookCenterY -
            totalRootHeight / 2;


        // ------------------------------------------
        // 递归放置节点
        // ------------------------------------------

        function placeHorizontalNodes(
            nodes,
            startY,
            level
        ) {

            if (
                !Array.isArray(
                    nodes
                ) ||
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


                    // ----------------------------------
                    // 子节点
                    // ----------------------------------

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
            Math.min(
                bookTop,
                ...layout.nodes.map(
                    item => item.y
                )
            );


        let maxX =
            Math.max(
                bookRight,
                ...layout.nodes.map(
                    item =>
                        item.x +
                        item.width
                )
            );


        let maxY =
            Math.max(
                bookBottom,
                ...layout.nodes.map(
                    item =>
                        item.y +
                        item.height
                )
            );


        // ==================================================
        // 如果节点跑到顶部
        //
        // 只移动节点。
        //
        // ❌ 不移动书名
        // ==================================================

        const topShift =
            minY < PADDING
                ? PADDING - minY
                : 0;


        if (
            topShift > 0
        ) {

            layout.nodes.forEach(
                item => {

                    item.y +=
                        topShift;

                    item.centerY +=
                        topShift;
                }
            );


            // 重新计算节点范围
            // 但
