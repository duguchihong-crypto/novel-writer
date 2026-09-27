// ==============================
// 全书页面：自动布局
// ==============================

function calculateLayout() {

    if (!currentBook) {
        return {
            nodes: [],
            width: 0,
            height: 0
        };
    }

    const roots = Array.isArray(currentBook.structure)
        ? currentBook.structure
        : [];

    const layout = {
        nodes: [],
        width: 0,
        height: 0
    };

    // 没有任何结构
    if (roots.length === 0) {
        return layout;
    }


    // ==============================
    // 计算节点下面的叶子数量
    // ==============================

    function getLeafCount(node) {

        if (!node) {
            return 1;
        }

        // 折叠节点本身就是一个叶子
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
    // 计算一个节点子树需要的宽度
    // ==============================

    function getSubtreeWidth(node) {

        const leafCount = getLeafCount(node);

        return (
            leafCount * NODE_WIDTH +
            Math.max(0, leafCount - 1) * SIBLING_GAP
        );
    }


    // ==============================
    // 计算一组节点需要的总宽度
    // ==============================

    function getNodesWidth(nodes) {

        if (!nodes || nodes.length === 0) {
            return 0;
        }

        let width = 0;

        nodes.forEach((node, index) => {

            width += getSubtreeWidth(node);

            if (index < nodes.length - 1) {
                width += SIBLING_GAP;
            }
        });

        return width;
    }


    // ==============================
    // 递归放置节点
    // ==============================

    function placeNodes(
        nodes,
        startX,
        level,
        parentCenterX
    ) {

        if (!nodes || nodes.length === 0) {
            return;
        }

        let currentX = startX;


        nodes.forEach(node => {

            const subtreeWidth = getSubtreeWidth(node);

            // 当前节点位于整个子树的中央
            const centerX =
                currentX +
                subtreeWidth / 2;

            const x =
                centerX -
                NODE_WIDTH / 2;

            const y =
                level *
                (NODE_HEIGHT + LEVEL_GAP);


            // 保存布局信息
            layout.nodes.push({

                id: node.id,

                node: node,

                x: x,

                y: y,

                level: level,

                parentCenterX: parentCenterX,

                centerX: centerX,

                centerY:
                    y +
                    NODE_HEIGHT / 2
            });


            // ==============================
            // 放置子节点
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


            // 下一个同级节点
            currentX +=
                subtreeWidth +
                SIBLING_GAP;
        });
    }


    // ==============================
    // 开始布局
    // ==============================

    const totalWidth = getNodesWidth(roots);

    placeNodes(
        roots,
        0,
        0,
        null
    );


    // ==============================
    // 计算实际画布尺寸
    // ==============================

    let maxX = 0;
    let maxY = 0;

    layout.nodes.forEach(item => {

        maxX = Math.max(
            maxX,
            item.x + NODE_WIDTH
        );

        maxY = Math.max(
            maxY,
            item.y + NODE_HEIGHT
        );

    });


    // 至少留出一点边距
    const PADDING = 40;

    layout.width = Math.max(
        totalWidth,
        maxX
    ) + PADDING * 2;

    layout.height =
        maxY +
        PADDING * 2;


    // ==============================
    // 整棵树整体向右、向下留出边距
    // ==============================

    layout.nodes.forEach(item => {

        item.x += PADDING;
        item.y += PADDING;

        item.centerX += PADDING;
        item.centerY += PADDING;

    });


    return layout;
}
