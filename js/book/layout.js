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

    // ==============================
    // 基础参数
    // ==============================

    const PADDING = 40;

    // 书名底部到第一层节点顶部
    const ROOT_GAP = 35;

    // ==============================
    // 获取书名
    // ==============================

    const bookTitle =
        document.querySelector("#bookTitle");

    const bookWidth =
        bookTitle
            ? (bookTitle.offsetWidth || BOOK_MIN_WIDTH)
            : BOOK_MIN_WIDTH;

    const bookHeight =
        bookTitle
            ? (bookTitle.offsetHeight || BOOK_MIN_HEIGHT)
            : BOOK_MIN_HEIGHT;


    // ==============================
    // 计算叶子数量
    // ==============================

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

        node.children.forEach(child => {
            count += getLeafCount(child);
        });

        return Math.max(1, count);
    }


    // ==============================
    // 计算子树宽度
    // ==============================

    function getSubtreeWidth(node) {

        const leafCount =
            getLeafCount(node);

        return (
            leafCount * NODE_WIDTH +
            Math.max(
                0,
                leafCount - 1
            ) * SIBLING_GAP
        );
    }


    // ==============================
    // 第一层总宽度
    // ==============================

    let totalRootWidth = 0;

    roots.forEach((node, index) => {

        totalRootWidth +=
            getSubtreeWidth(node);

        if (
            index <
            roots.length - 1
        ) {
            totalRootWidth +=
                SIBLING_GAP;
        }
    });


    // ==============================
    // 计算整棵树宽度
    // ==============================

    const treeWidth =
        Math.max(
            totalRootWidth,
            bookWidth
        ) +
        PADDING * 2;


    // ==============================
    // 关键：
    // 书名的中心 X
    // ==============================

    const bookCenterX =
        treeWidth / 2;


    // ==============================
    // 第一层节点的起始 X
    // ==============================

    let rootStartX =
        bookCenterX -
        totalRootWidth / 2;


    // ==============================
    // 第一层 Y
    // ==============================

    const bookTop = 25;

    const rootY =
        bookTop +
        bookHeight +
        ROOT_GAP;


    // ==============================
    // 递归放置节点
    // ==============================

    function placeNodes(
        nodes,
        startX,
        level,
        parentCenterX
    ) {

        if (
            !nodes ||
            nodes.length === 0
        ) {
            return;
        }

        let currentX =
            startX;


        nodes.forEach(node => {

            const subtreeWidth =
                getSubtreeWidth(node);


            const centerX =
                currentX +
                subtreeWidth / 2;


            const x =
                centerX -
                NODE_WIDTH / 2;


            let y;


            // 第一层直接放在书名下面
            if (level === 0) {

                y =
                    rootY;

            } else {

                y =
                    rootY +
                    level *
                    (
                        NODE_HEIGHT +
                        LEVEL_GAP
                    );
            }


            layout.nodes.push({

                id:
                    node.id,

                node:
                    node,

                x:
                    x,

                y:
                    y,

                level:
                    level,

                parentCenterX:
                    parentCenterX,

                centerX:
                    centerX,

                centerY:
                    y +
                    NODE_HEIGHT / 2
            });


            // ==============================
            // 子节点
            // ==============================

            if (
                node.collapsed !== true &&
                Array.isArray(node.children) &&
                node.children.length > 0
            ) {

                placeNodes(

                    node.children,

                    currentX,

                    level + 1,

                    centerX

                );
            }


            currentX +=
                subtreeWidth +
                SIBLING_GAP;

        });
    }


    // ==============================
    // 开始布局
    // ==============================

    placeNodes(
        roots,
        rootStartX,
        0,
        bookCenterX
    );


    // ==============================
    // 计算高度
    // ==============================

    let maxY = 0;

    layout.nodes.forEach(item => {

        maxY =
            Math.max(
                maxY,
                item.y +
                NODE_HEIGHT
            );

    });


    layout.width =
        treeWidth;

    layout.height =
        Math.max(
            maxY +
            PADDING,
            bookTop +
            bookHeight +
            ROOT_GAP +
            NODE_HEIGHT +
            PADDING
        );


    return layout;
}
