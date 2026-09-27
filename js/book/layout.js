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
        document.querySelector(".node-box");


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

        if (window.innerWidth <= 600) {

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

    const PADDING = 60;

    const ROOT_GAP = 70;

    const LEVEL_GAP = 80;

    const SIBLING = 35;


    // ==================================================
    // 获取书名尺寸
    // ==================================================

    const bookTitle =
        document.querySelector("#bookTitle");


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
    // 计算所有根节点总宽度
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
    // 树的最小宽度
    // ==================================================

    const requiredWidth =
        Math.max(
            totalRootWidth,
            bookWidth
        ) +
        PADDING * 2;


    // ==================================================
    // 读取“书名当前中心”
    //
    // 这是整个系统最重要的地方
    //
    // layout 不再自己决定书名中心
    // 而是读取书名真正的位置
    // ==================================================

    let treeCenterX;


    if (bookTitle) {

        const bookLeft =
            parseFloat(
                bookTitle.style.left
            );


        const bookActualWidth =
            bookTitle.offsetWidth ||
            bookWidth;


        if (
            Number.isFinite(
                bookLeft
            )
        ) {

            treeCenterX =
                bookLeft +
                bookActualWidth / 2;

        } else {

            treeCenterX =
                requiredWidth / 2;

        }

    } else {

        treeCenterX =
            requiredWidth / 2;
    }


    // ==================================================
    // 防止树宽度不够
    // ==================================================

    const minimumLeft =
        totalRootWidth / 2 +
        PADDING;


    const minimumRight =
        totalRootWidth / 2 +
        PADDING;


    let treeWidth =
        Math.max(
            requiredWidth,
            treeCenterX +
            minimumRight,
            treeCenterX -
            minimumLeft
        );


    // ==================================================
    // 如果树中心不在合理范围
    // 则扩大画布
    // ==================================================

    if (
        treeCenterX <
        minimumLeft
    ) {

        treeWidth +=
            minimumLeft -
            treeCenterX;

        treeCenterX =
            minimumLeft;

    }


    if (
        treeCenterX >
        treeWidth -
        minimumRight
    ) {

        treeWidth =
            treeCenterX +
            minimumRight;
    }


    // ==================================================
    // 书名顶部
    // ==================================================

    const bookTop =
        Number.isFinite(
            parseFloat(
                bookTitle?.style.top
            )
        )
            ? parseFloat(
                bookTitle.style.top
            )
            : 25;


    // ==================================================
    // 第一层 Y
    // ==================================================

    const rootY =
        bookTop +
        bookHeight +
        ROOT_GAP;


    // ==================================================
    // 第一层起点
    // ==================================================

    const rootStartX =
        treeCenterX -
        totalRootWidth / 2;


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
                // 当前子树中心
                // ------------------------------------------

                const centerX =
                    currentX +
                    subtreeWidth / 2;


                // ------------------------------------------
                // 节点左上角
                // ------------------------------------------

                const x =
                    centerX -
                    NODE_W / 2;


                // ------------------------------------------
                // 节点 Y
                // ------------------------------------------

                const y =
                    rootY +
                    level *
                    (
                        NODE_H +
                        LEVEL_GAP
                    );


                // ------------------------------------------
                // 保存
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
    // 计算高度
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


    // ==================================================
    // 保存这次布局的中心
    // ==================================================

    layout.centerX =
        treeCenterX;


    layout.nodeWidth =
        NODE_W;


    layout.nodeHeight =
        NODE_H;


    return layout;
}
