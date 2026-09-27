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
    // 第一层与书名之间的距离
    // ==============================

    const ROOT_GAP = 35;


    // ==============================
    // 获取书名高度
    // ==============================

    const bookTitle =
        document.querySelector("#bookTitle");


    let bookHeight =
        BOOK_MIN_HEIGHT;


    if (bookTitle) {

        bookHeight =
            bookTitle.offsetHeight ||
            BOOK_MIN_HEIGHT;
    }


    // ==============================
    // 书名顶部位置
    // 与 main.js 保持一致
    // ==============================

    const BOOK_TOP = 25;


    // ==============================
    // 第一层节点 Y 坐标
    // ==============================

    const ROOT_Y =
        BOOK_TOP +
        bookHeight +
        ROOT_GAP;


    // ==============================
    // 计算叶子节点数量
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

            count +=
                getLeafCount(child);

        });


        return Math.max(
            1,
            count
        );
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
    // 计算一组节点总宽度
    // ==============================

    function getNodesWidth(nodes) {

        if (
            !nodes ||
            nodes.length === 0
        ) {
            return 0;
        }


        let width = 0;


        nodes.forEach(
            (node, index) => {

                width +=
                    getSubtreeWidth(node);


                if (
                    index <
                    nodes.length - 1
                ) {

                    width +=
                        SIBLING_GAP;
                }

            }
        );


        return width;
    }


    // ==============================
    // 放置节点
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


            // ==========================================
            // 第一层：
            // 直接放在书名下面
            // ==========================================

            let y;


            if (level === 0) {

                y =
                    ROOT_Y;

            } else {

                // ======================================
                // 第二层及以后：
                // 正常层级间距
                // ======================================

                y =
                    ROOT_Y +
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
    // 总宽度
    // ==============================

    const totalWidth =
        getNodesWidth(roots);


    // ==============================
    // 开始布局
    // ==============================

    placeNodes(
        roots,
        0,
        0,
        null
    );


    // ==============================
    // 计算实际尺寸
    // ==============================

    let maxX = 0;
    let maxY = 0;


    layout.nodes.forEach(item => {

        maxX =
            Math.max(
                maxX,
                item.x +
                NODE_WIDTH
            );


        maxY =
            Math.max(
                maxY,
                item.y +
                NODE_HEIGHT
            );

    });


    // ==============================
    // 画布内边距
    // ==============================

    const PADDING = 40;


    layout.width =
        Math.max(
            totalWidth,
            maxX
        ) +
        PADDING * 2;


    layout.height =
        maxY +
        PADDING * 2;


    // ==============================
    // 加上内部边距
    // ==============================

    layout.nodes.forEach(item => {

        item.x +=
            PADDING;

        item.y +=
            PADDING;

        item.centerX +=
            PADDING;

        item.centerY +=
            PADDING;

    });


    return layout;
}
