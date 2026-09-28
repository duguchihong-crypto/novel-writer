// ==============================
// 全书页面：树形布局
// 支持：纵向 / 横向
//
// ★ 目录式布局最终版
//
// 核心原则：
//
// 1. 小说名的位置由 bookPosition / DOM 决定
// 2. calculateLayout() 绝不主动移动小说名
// 3. 树围绕小说名中心展开
// 4. 横向：小说名 → 卷 → 章 → 节
// 5. 纵向：小说名 ↓ 卷 ↓ 章 ↓ 节
// 6. layout.nodes 使用真实节点中心坐标
// 7. 与 connections.js 使用同一坐标系
// 8. 支持小说名自由拖动
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
// 获取小说名真实位置
//
// ★ 非常重要
//
// 优先级：
//
// 1. DOM style.left / top
// 2. bookPosition
// 3. 3000×3000 画布中心
//
// calculateLayout() 本身不会移动 DOM
// ==================================================

function getBookPosition(
    bookWidth,
    bookHeight
) {

    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );

    let left =
        NaN;

    let top =
        NaN;


    // ==================================================
    // 优先读取 DOM
    // ==================================================

    if (bookTitle) {

        left =
            parseFloat(
                bookTitle.style.left
            );

        top =
            parseFloat(
                bookTitle.style.top
            );
    }


    // ==================================================
    // 没有 DOM 位置 → 读取 bookPosition
    // ==================================================

    if (
        !Number.isFinite(left) &&
        typeof bookPosition !==
            "undefined" &&
        bookPosition
    ) {

        const storedX =
            Number(
                bookPosition.x
            );

        if (
            Number.isFinite(
                storedX
            )
        ) {

            left =
                storedX;
        }
    }


    if (
        !Number.isFinite(top) &&
        typeof bookPosition !==
            "undefined" &&
        bookPosition
    ) {

        const storedY =
            Number(
                bookPosition.y
            );

        if (
            Number.isFinite(
                storedY
            )
        ) {

            top =
                storedY;
        }
    }


    // ==================================================
    // 最终没有位置
    //
    // ★ 默认放在 3000×3000 画布中心
    //
    // 不是浏览器左上角
    // ==================================================

    if (
        !Number.isFinite(left)
    ) {

        left =
            1500 -
            bookWidth / 2;
    }


    if (
        !Number.isFinite(top)
    ) {

        top =
            1500 -
            bookHeight / 2;
    }


    // ==================================================
    // 同步保存
    //
    // ★ 只保存数据
    // ★ 不修改 DOM
    // ==================================================

    if (
        typeof bookPosition !==
            "undefined" &&
        bookPosition
    ) {

        bookPosition.x =
            left;

        bookPosition.y =
            top;
    }


    return {
        left: left,
        top: top
    };
}


// ==================================================
// 获取节点真实尺寸
// ==================================================

function getLayoutNodeSize() {

    const sampleNode =
        document.querySelector(
            ".node-box"
        );

    let width =
        NODE_WIDTH;

    let height =
        NODE_HEIGHT;


    if (sampleNode) {

        width =
            sampleNode.offsetWidth ||
            NODE_WIDTH;

        height =
            sampleNode.offsetHeight ||
            NODE_HEIGHT;

    } else {

        if (
            window.innerWidth <=
            600
        ) {

            width =
                135;

            height =
                46;

        } else {

            width =
                155;

            height =
                48;
        }
    }


    return {
        width: width,
        height: height
    };
}


// ==================================================
// 创建布局节点
//
// ★ 所有地方统一使用这个函数
// ==================================================

function createLayoutNode(
    node,
    x,
    y,
    width,
    height,
    level
) {

    return {

        id:
            node.id,

        node:
            node,

        x:
            x,

        y:
            y,

        width:
            width,

        height:
            height,

        level:
            level,

        centerX:
            x +
            width / 2,

        centerY:
            y +
            height / 2
    };
}


// ==================================================
// 收集树的层级
//
// 返回：
//
// levels[0] = 第一层
// levels[1] = 第二层
// levels[2] = 第三层
//
// collapsed 节点不会继续展开
// ==================================================

function collectTreeLevels(
    roots
) {

    const levels =
        [];


    function walk(
        nodes,
        level
    ) {

        if (
            !Array.isArray(nodes)
        ) {

            return;
        }


        if (
            !levels[level]
        ) {

            levels[level] =
                [];
        }


        nodes.forEach(
            node => {

                levels[level].push(
                    node
                );


                if (
                    node.collapsed !== true &&
                    Array.isArray(
                        node.children
                    ) &&
                    node.children.length > 0
                ) {

                    walk(
                        node.children,
                        level + 1
                    );
                }
            }
        );
    }


    walk(
        roots,
        0
    );


    return levels;
}


// ==================================================
// 计算一层所需尺寸
// ==================================================

function calculateLevelSize(
    count,
    nodeSize,
    siblingGap
) {

    if (
        count <= 0
    ) {

        return 0;
    }


    return (
        count *
        nodeSize
    ) +
    (
        count - 1
    ) *
    siblingGap;
}


// ==================================================
// 计算所有节点范围
// ==================================================

function calculateNodeBounds(
    nodes
) {

    if (
        !Array.isArray(nodes) ||
        nodes.length === 0
    ) {

        return {

            minX: 0,

            maxX: 0,

            minY: 0,

            maxY: 0
        };
    }


    let minX =
        Infinity;

    let maxX =
        -Infinity;

    let minY =
        Infinity;

    let maxY =
        -Infinity;


    nodes.forEach(
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

            minY =
                Math.min(
                    minY,
                    item.y
                );

            maxY =
                Math.max(
                    maxY,
                    item.y +
                    item.height
                );
        }
    );


    return {

        minX:
            minX,

        maxX:
            maxX,

        minY:
            minY,

        maxY:
            maxY
    };
}


// ==================================================
// 主布局函数
// ==================================================

function calculateLayout() {

    // ==================================================
    // 没有当前书
    // ==================================================

    if (!currentBook) {

        return {

            nodes: [],

            width: 0,

            height: 0,

            direction:
                "vertical"
        };
    }


    // ==================================================
    // 根节点
    // ==================================================

    const roots =
        Array.isArray(
            currentBook.structure
        )
            ? currentBook.structure
            : [];


    // ==================================================
    // 基础布局
    // ==================================================

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

    const nodeSize =
        getLayoutNodeSize();

    const NODE_W =
        nodeSize.width;

    const NODE_H =
        nodeSize.height;


    // ==================================================
    // 布局参数
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
    // 小说名 DOM
    // ==================================================

    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    // ==================================================
    // 小说名尺寸
    // ==================================================

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
    // 小说名位置
    //
    // ★ 不移动
    // ==================================================

    const bookPositionData =
        getBookPosition(
            bookWidth,
            bookHeight
        );


    const bookLeft =
        bookPositionData.left;

    const bookTop =
        bookPositionData.top;


    // ==================================================
    // 小说名中心
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
    // 获取所有层级
    // ==================================================

    const levels =
        collectTreeLevels(
            roots
        );


    // ==================================================
    // ==================================================
    //
    // 横向布局
    //
    // 小说名 ───── 卷
    //                 │
    //                 ├──── 章
    //                 │
    //                 └──── 章
    //
    // ==================================================
    // ==================================================

    if (
        layout.direction ===
        "horizontal"
    ) {

        // ==================================================
        // 每一级需要的高度
        // ==================================================

        const levelHeights =
            [];


        levels.forEach(
            (nodes, level) => {

                levelHeights[level] =
                    calculateLevelSize(
                        nodes.length,
                        NODE_H,
                        SIBLING_GAP
                    );
            }
        );


        // ==================================================
        // 整棵树的最大高度
        // ==================================================

        let treeHeight =
            0;


        levelHeights.forEach(
            height => {

                treeHeight =
                    Math.max(
                        treeHeight,
                        height || 0
                    );
            }
        );


        // ==================================================
        // 第一层 X
        //
        // 小说名 → 卷
        // ==================================================

        const firstLevelX =
            bookRight +
            ROOT_GAP;


        // ==================================================
        // 树整体 Y 中心
        //
        // ★ 与小说名中心完全对齐
        // ==================================================

        const treeStartY =
            bookCenterY -
            treeHeight / 2;


        // ==================================================
        // 放置每一级
        // ==================================================

        levels.forEach(
            (nodes, level) => {

                if (
                    !Array.isArray(nodes) ||
                    nodes.length === 0
                ) {

                    return;
                }


                const levelHeight =
                    levelHeights[level];


                const levelStartY =
                    treeStartY +
                    (
                        treeHeight -
                        levelHeight
                    ) / 2;


                const x =
                    firstLevelX +
                    level *
                    (
                        NODE_W +
                        LEVEL_GAP
                    );


                nodes.forEach(
                    (
                        node,
                        index
                    ) => {

                        const y =
                            levelStartY +
                            index *
                            (
                                NODE_H +
                                SIBLING_GAP
                            );


                        layout.nodes.push(
                            createLayoutNode(
                                node,
                                x,
                                y,
                                NODE_W,
                                NODE_H,
                                level
                            )
                        );
                    }
                );
            }
        );


        // ==================================================
        // 计算范围
        // ==================================================

        let bounds =
            calculateNodeBounds(
                layout.nodes
            );


        // ==================================================
        // 节点不能跑到左侧
        //
        // ★ 只移动树
        // ★ 绝不移动小说名
        // ==================================================

        if (
            bounds.minX <
            CANVAS_PADDING
        ) {

            const shiftX =
                CANVAS_PADDING -
                bounds.minX;


            layout.nodes.forEach(
                item => {

                    item.x +=
                        shiftX;

                    item.centerX +=
                        shiftX;
                }
            );


            bounds =
                calculateNodeBounds(
                    layout.nodes
                );
        }


        // ==================================================
        // 节点不能跑到顶部
        //
        // ★ 只移动树
        // ==================================================

        if (
            bounds.minY <
            CANVAS_PADDING
        ) {

            const shiftY =
                CANVAS_PADDING -
                bounds.minY;


            layout.nodes.forEach(
                item => {

                    item.y +=
                        shiftY;

                    item.centerY +=
                        shiftY;
                }
            );


            bounds =
                calculateNodeBounds(
                    layout.nodes
                );
        }


        // ==================================================
        // 横向画布尺寸
        //
        // ★ 至少保持 3000 × 3000
        //
        // 这样可以自由拖动
        // ==================================================

        layout.width =
            Math.max(
                3000,
                bounds.maxX +
                CANVAS_PADDING,
                window.innerWidth
            );


        layout.height =
            Math.max(
                3000,
                bounds.maxY +
                CANVAS_PADDING,
                window.innerHeight
            );
    }


    // ==================================================
    // ==================================================
    //
    // 纵向布局
    //
    //       小说名
    //          │
    //      ┌───┼───┐
    //      卷   卷   卷
    //
    // ==================================================
    // ==================================================

    else {

        // ==================================================
        // 每一级需要的宽度
        // ==================================================

        const levelWidths =
            [];


        levels.forEach(
            (nodes, level) => {

                levelWidths[level] =
                    calculateLevelSize(
                        nodes.length,
                        NODE_W,
                        SIBLING_GAP
                    );
            }
        );


        // ==================================================
        // 整棵树最大宽度
        // ==================================================

        let treeWidth =
            0;


        levelWidths.forEach(
            width => {

                treeWidth =
                    Math.max(
                        treeWidth,
                        width || 0
                    );
            }
        );


        // ==================================================
        // 第一层 Y
        // ==================================================

        const firstLevelY =
            bookBottom +
            ROOT_GAP;


        // ==================================================
        // 树整体 X 中心
        //
        // ★ 与小说名中心完全对齐
        // ==================================================

        const treeStartX =
            bookCenterX -
            treeWidth / 2;


        // ==================================================
        // 放置每一级
        // ==================================================

        levels.forEach(
            (nodes, level) => {

                if (
                    !Array.isArray(nodes) ||
                    nodes.length === 0
                ) {

                    return;
                }


                const levelWidth =
                    levelWidths[level];


                const levelStartX =
                    treeStartX +
                    (
                        treeWidth -
                        levelWidth
                    ) / 2;


                const y =
                    firstLevelY +
                    level *
                    (
                        NODE_H +
                        LEVEL_GAP
                    );


                nodes.forEach(
                    (
                        node,
                        index
                    ) => {

                        const x =
                            levelStartX +
                            index *
                            (
                                NODE_W +
                                SIBLING_GAP
                            );


                        layout.nodes.push(
                            createLayoutNode(
                                node,
                                x,
                                y,
                                NODE_W,
                                NODE_H,
                                level
                            )
                        );
                    }
                );
            }
        );


        // ==================================================
        // 计算范围
        // ==================================================

        let bounds =
            calculateNodeBounds(
                layout.nodes
            );


        // ==================================================
        // 左边界
        //
        // ★ 只移动树
        // ==================================================

        if (
            bounds.minX <
            CANVAS_PADDING
        ) {

            const shiftX =
                CANVAS_PADDING -
                bounds.minX;


            layout.nodes.forEach(
                item => {

                    item.x +=
                        shiftX;

                    item.centerX +=
                        shiftX;
                }
            );


            bounds =
                calculateNodeBounds(
                    layout.nodes
                );
        }


        // ==================================================
        // 上边界
        //
        // ★ 只移动树
        // ==================================================

        if (
            bounds.minY <
            CANVAS_PADDING
        ) {

            const shiftY =
                CANVAS_PADDING -
                bounds.minY;


            layout.nodes.forEach(
                item => {

                    item.y +=
                        shiftY;

                    item.centerY +=
                        shiftY;
                }
            );


            bounds =
                calculateNodeBounds(
                    layout.nodes
                );
        }


        // ==================================================
        // 纵向画布尺寸
        //
        // ★ 至少 3000 × 3000
        // ==================================================

        layout.width =
            Math.max(
                3000,
                bounds.maxX +
                CANVAS_PADDING,
                window.innerWidth
            );


        layout.height =
            Math.max(
                3000,
                bounds.maxY +
                CANVAS_PADDING,
                window.innerHeight
            );
    }


    // ==================================================
    // 公共布局信息
    //
    // connections.js 会直接使用
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
