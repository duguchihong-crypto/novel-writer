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
        (
            currentBook.layoutDirection ===
            "horizontal"
        )
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

            height: 0
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
    // 实际节点尺寸
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
    // 参数
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
    // 计算叶子数量
    //
    // 用于让同级节点自动对齐
    // ==================================================

    function getLeafCount(node) {

        if (!node) {
            return 1;
        }


        if (
            node.collapsed === true ||
            !Array.isArray(
                node.children
            ) ||
            node.children.length === 0
        ) {

            return 1;
        }


        let count = 0;


        node.children.forEach(
            child => {

                count +=
                    getLeafCount(
                        child
                    );
            }
        );


        return Math.max(
            1,
            count
        );
    }


    // ==================================================
    // 纵向布局：
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
    // 横向布局：
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
    // ==================================================
    // 纵向布局
    // ==================================================
    // ==================================================

    if (
        layout.direction ===
        "vertical"
    ) {

        let totalRootWidth = 0;


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
        // 树的中心就是书名中心
        // ------------------------------------------

        const treeCenterX =
            bookCenterX;


        const rootStartX =
            treeCenterX -
            totalRootWidth / 2;


        // ------------------------------------------
        // 第一层 Y
        // ------------------------------------------

        const rootY =
            bookBottom +
            ROOT_GAP;


        // ------------------------------------------
        // 递归放置
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


                    // 子节点

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


        // ------------------------------------------
        // 计算画布尺寸
        // ------------------------------------------

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


        // ------------------------------------------
        // 如果节点跑到左边
        // 整体增加左侧空间
        // ------------------------------------------

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


            // 书名也一起移动
            // 保证线永远对齐

            if (bookTitle) {

                const newLeft =
                    bookLeft +
                    leftShift;


                bookTitle.style.left =
                    newLeft + "px";


                bookPosition.x =
                    newLeft;
            }


            bookLeft +=
                leftShift;

            bookCenterX +=
                leftShift;

            bookRight +=
                leftShift;

            maxX +=
                leftShift;
        }


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
    // ==================================================
    // 横向布局
    // ==================================================
    // ==================================================

    else {

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


        // ------------------------------------------
        // 第一层 X
        // ------------------------------------------

        const rootX =
            bookRight +
            ROOT_GAP;


        // ------------------------------------------
        // 树中心 Y
        // ------------------------------------------

        const rootStartY =
            bookCenterY -
            totalRootHeight / 2;


        // ------------------------------------------
        // 递归放置
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


                    // 子节点

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


        // ------------------------------------------
        // 计算画布尺寸
        // ------------------------------------------

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


        // ------------------------------------------
        // 防止节点跑到顶部
        // ------------------------------------------

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


            // 书名一起移动
            // 保证连接线对齐

            if (bookTitle) {

                const newTop =
                    bookTop +
                    topShift;


                bookTitle.style.top =
                    newTop + "px";


                bookPosition.y =
                    newTop;
            }


            bookTop +=
                topShift;

            bookCenterY +=
                topShift;

            bookBottom +=
                topShift;

            maxY +=
                topShift;
        }


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
