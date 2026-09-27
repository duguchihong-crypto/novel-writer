// ==============================
// 全书页面：自动布局
// ==============================

function calculateLayout() {

    const roots = currentBook.structure || [];

    const layout = {
        nodes: [],
        width: 0,
        height: 0
    };


    if (!roots.length) {
        return layout;
    }


    // 计算某个节点下面有多少个叶子
    function getLeafCount(node) {

        if (
            node.collapsed ||
            !node.children ||
            node.children.length === 0
        ) {
            return 1;
        }

        let count = 0;

        node.children.forEach(child => {
            count += getLeafCount(child);
        });

        return count;
    }


    // 第一遍：计算宽度
    function calculateWidth(nodes) {

        let total = 0;

        nodes.forEach(node => {

            const leaves = getLeafCount(node);

            total +=
                leaves * NODE_WIDTH +
                Math.max(0, leaves - 1) * SIBLING_GAP;

        });

        if (nodes.length > 1) {
            total +=
                (nodes.length - 1) * SIBLING_GAP;
        }

        return total;
    }


    const totalWidth = calculateWidth(roots);


    // 递归放置
    function placeNodes(
        nodes,
        startX,
        level,
        parentCenterX
    ) {

        let currentX = startX;


        nodes.forEach(node => {

            const leafCount = getLeafCount(node);

            const subtreeWidth =
                leafCount * NODE_WIDTH +
                Math.max(0, leafCount - 1) * SIBLING_GAP;


            const centerX =
                currentX +
                subtreeWidth / 2 -
                NODE_WIDTH / 2;


            const y =
                level *
                (NODE_HEIGHT + LEVEL_GAP);


            layout.nodes.push({
                node: node,
                x: centerX,
                y: y,
                level: level,
                parentCenterX: parentCenterX
            });


            if (
                !node.collapsed &&
                node.children &&
                node.children.length
            ) {

                placeNodes(
                    node.children,
                    currentX,
                    level + 1,
                    centerX + NODE_WIDTH / 2
                );
            }


            currentX +=
                subtreeWidth +
                SIBLING_GAP;
        });
    }


    placeNodes(
        roots,
        0,
        0,
        null
    );


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


    layout.width = Math.max(
        totalWidth,
        maxX
    );

    layout.height = maxY;


    return layout;
}
