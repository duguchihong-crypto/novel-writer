// ==============================
// 全书页面：树形布局
// ==============================

function calculateLayout() {

    if (!currentBook) {
        return {
            nodes: [],
            width: 0,
            height: 0
        };
    }


    const roots =
        Array.isArray(currentBook.structure)
            ? currentBook.structure
            : [];


    const layout = {
        nodes: [],
        width: 0,
        height: 0
    };


    if (roots.length === 0) {
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

        // 手机 CSS 下的实际尺寸
        if (window.innerWidth <= 600) {

            NODE_W = 135;
            NODE_H = 46;

        } else {

            NODE_W = 155;
            NODE_H = 48;
        }
    }


    // ==================================================
    // 基础参数
    // ==================================================

    const PADDING = 60;

    // 书名底部 → 第一层节点顶部
    const ROOT_GAP = 70;

    // 父节点 → 子节点之间的垂直距离
    const LEVEL_GAP = 80;

    // 同级节点之间的距离
    const SIBLING = 35;


    // ==================================================
    // 获取书名尺寸
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
    // 计算叶子数量
    // ==================================================

    function getLeafCount(node) {

        if (!node) {
            return 1;
        }


        if (
            node.collapsed === true ||
            !Array.isArray(node.children) ||
            node.children.length === 0
        ) {

            return 1;
        }


        let count = 0;


        node.children.forEach(
            child => {

                count +=
                    getLeafCount(child);

            }
        );


        return Math.max(
            1,
            count
        );
    }


    // ==================================================
    // 计算子树宽度
    // ==================================================

    function getSubtreeWidth(node) {

        const leaves =
            getLeafCount(node);


        return (
            leaves * NODE_W +
            Math.max(
                0,
                leaves - 1
            ) * SIBLING
        );
    }


    // ==================================================
    // 第一层总宽度
    // ==================================================

    let totalRootWidth = 0;


    roots.forEach(
        (node, index) => {

            totalRootWidth +=
                getSubtreeWidth(node);


            if (
                index <
                roots.length - 1
            ) {

                totalRootWidth +=
                    SIBLING;
            }
        }
    );


    // ==================================================
    // 整棵树宽度
    // ==================================================

    const treeWidth =
        Math.max(
            totalRootWidth,
            bookWidth
        ) +
        PADDING * 2;


    // ==================================================
    // 书名中央
    // ==================================================

    const bookCenterX =
        treeWidth / 2;


    // ==================================================
    // 第一层节点起点
    // ==================================================

    const rootStartX =
        bookCenterX -
        totalRootWidth / 2;


    // ==================================================
    // 书名位置
    // ==================================================

    const bookTop =
        25;


    // ==================================================
    // 第一层节点 Y
    // ==================================================

    const rootY =
        bookTop +
        bookHeight +
        ROOT_GAP;


    // ==================================================
    // 递归布局
    // ==================================================

    function placeNodes(
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
                    getSubtreeWidth(node);


                // ------------------------------------------
                // 当前子树中央
                // ------------------------------------------

                const centerX =
                    currentX +
                    subtreeWidth / 2;


                // ------------------------------------------
                // 当前节点左上角
                // ------------------------------------------

                const x =
                    centerX -
                    NODE_W / 2;


                // ------------------------------------------
                // 当前节点 Y
                // ------------------------------------------

                const y =
                    rootY +
                    level *
                    (
                        NODE_H +
                        LEVEL_GAP
                    );


                // ------------------------------------------
                // 保存布局
                // ------------------------------------------

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


                // ------------------------------------------
                // 子节点
                // ------------------------------------------

                if (
                    node.collapsed !== true &&
                    Array.isArray(node.children) &&
                    node.children.length > 0
                ) {

                    placeNodes(

                        node.children,

                        currentX,

                        level + 1
                    );
                }


                // ------------------------------------------
                // 下一个同级节点
                // ------------------------------------------

                currentX +=
                    subtreeWidth +
                    SIBLING;

            }
        );
    }


    // ==================================================
    // 开始布局
    // ==================================================

    placeNodes(
        roots,
        rootStartX,
        0
    );


    // ==================================================
    // 计算树高度
    // ==================================================

    let maxY = 0;


    layout.nodes.forEach(
        item => {

            maxY =
                Math.max(
                    maxY,
                    item.y +
                    item.height
                );
        }
    );


    // ==================================================
    // 最终尺寸
    // ==================================================

    layout.width =
        treeWidth;


    layout.height =
        Math.max(
            maxY +
            PADDING,
            bookTop +
            bookHeight +
            ROOT_GAP +
            NODE_H +
            PADDING
        );


    return layout;
}
