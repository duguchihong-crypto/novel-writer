// ==============================
// 全书页面：树形布局
// 支持：纵向 / 横向
//
// ★ 目录式布局版
//
// 核心结构：
//
// 小说名 ─────── 卷
//                 │
//                 ├──── 章
//                 │
//                 ├──── 章
//                 │
//                 └──── 章
//
// 更深层：
//
// 小说名 ─────── 卷
//                 │
//                 ├──── 章
//                 │       │
//                 │       ├──── 节
//                 │       └──── 节
//                 │
//                 └──── 章
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

    // ==================================================
    // 没有书
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
    // 基础布局对象
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
    // 获取节点真实尺寸
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
    // 布局参数
    // ==================================================

    // 父子节点之间的横向距离

    const LEVEL_GAP =
        90;


    // 同级节点之间的纵向距离

    const SIBLING_GAP =
        35;


    // 小说名与第一层节点之间的距离

    const ROOT_GAP =
        90;


    // 画布边缘留白

    const CANVAS_PADDING =
        80;



    // ==================================================
    // 获取小说名
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
    // 获取小说名位置
    //
    // ★ 这里只读取
    // ★ 不移动小说名
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
    // 没有 left 时
    // ==================================================

    if (
        !Number.isFinite(
            bookLeft
        )
    ) {

        if (
            Number.isFinite(
                Number(
                    bookPosition.x
                )
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



    // ==================================================
    // 没有 top 时
    // ==================================================

    if (
        !Number.isFinite(
            bookTop
        )
    ) {

        if (
            Number.isFinite(
                Number(
                    bookPosition.y
                )
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
    // 保存小说名位置
    //
    // ★ 不修改 DOM
    // ==================================================

    bookPosition.x =
        bookLeft;


    bookPosition.y =
        bookTop;



    // ==================================================
    // 小说名几何信息
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
    // ==================================================
    //
    // 横向目录布局
    //
    // ★ 这就是你现在想要的布局
    //
    // 小说名 ───── 卷
    //                │
    //                ├──── 章
    //                │
    //                └──── 章
    //
    // ==================================================
    // ==================================================

    if (
        layout.direction ===
        "horizontal"
    ) {

        // ==================================================
        // 找到树的最大深度
        // ==================================================

        let maxLevel =
            0;


        function findMaxLevel(
            nodes,
            level
        ) {

            if (
                !Array.isArray(nodes)
            ) {

                return;
            }


            nodes.forEach(
                node => {

                    maxLevel =
                        Math.max(
                            maxLevel,
                            level
                        );


                    if (
                        node.collapsed !== true &&
                        Array.isArray(
                            node.children
                        ) &&
                        node.children.length > 0
                    ) {

                        findMaxLevel(
                            node.children,
                            level + 1
                        );
                    }
                }
            );
        }


        findMaxLevel(
            roots,
            0
        );



        // ==================================================
        // 按层级收集节点
        // ==================================================

        const levels =
            [];


        function collectLevels(
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

                levels[level] = [];
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

                        collectLevels(
                            node.children,
                            level + 1
                        );
                    }
                }
            );
        }


        collectLevels(
            roots,
            0
        );



        // ==================================================
        // 计算每一级需要的高度
        // ==================================================

        const levelHeights =
            [];


        levels.forEach(
            (nodes, level) => {

                if (
                    !Array.isArray(nodes) ||
                    nodes.length === 0
                ) {

                    return;
                }


                levelHeights[level] =
                    nodes.length *
                    NODE_H +
                    Math.max(
                        0,
                        nodes.length - 1
                    ) *
                    SIBLING_GAP;
            }
        );



        // ==================================================
        // 找最大高度
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
        // 整个树以小说名中心为 Y 中心
        // ==================================================

        const treeStartY =
            bookCenterY -
            treeHeight / 2;



        // ==================================================
        // 每一级节点的 Y
        //
        // 同一级从上到下排列
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



                // ==================================================
                // 同一级节点依次向下
                // ==================================================

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
                                y +
                                NODE_H / 2
                        });
                    }
                );
            }
        );



        // ==================================================
        // 计算范围
        // ==================================================

        let minNodeX =
            Infinity;


        let maxNodeX =
            -Infinity;


        let minNodeY =
            Infinity;


        let maxNodeY =
            -Infinity;


        layout.nodes.forEach(
            item => {

                minNodeX =
                    Math.min(
                        minNodeX,
                        item.x
                    );


                maxNodeX =
                    Math.max(
                        maxNodeX,
                        item.x +
                        item.width
                    );


                minNodeY =
                    Math.min(
                        minNodeY,
                        item.y
                    );


                maxNodeY =
                    Math.max(
                        maxNodeY,
                        item.y +
                        item.height
                    );
            }
        );



        // ==================================================
        // 节点不能跑出左边
        //
        // ★ 小说名不移动
        // ==================================================

        if (
            minNodeX <
            CANVAS_PADDING
        ) {

            const shiftX =
                CANVAS_PADDING -
                minNodeX;


            layout.nodes.forEach(
                item => {

                    item.x +=
                        shiftX;


                    item.centerX +=
                        shiftX;
                }
            );


            maxNodeX +=
                shiftX;


            minNodeX +=
                shiftX;
        }



        // ==================================================
        // 节点不能跑出顶部
        //
        // ★ 小说名不移动
        // ==================================================

        if (
            minNodeY <
            CANVAS_PADDING
        ) {

            const shiftY =
                CANVAS_PADDING -
                minNodeY;


            layout.nodes.forEach(
                item => {

                    item.y +=
                        shiftY;


                    item.centerY +=
                        shiftY;
                }
            );


            maxNodeY +=
                shiftY;


            minNodeY +=
                shiftY;
        }



        // ==================================================
        // 画布尺寸
        // ==================================================

        layout.width =
            Math.max(
                maxNodeX +
                CANVAS_PADDING,

                window.innerWidth
            );


        layout.height =
            Math.max(
                maxNodeY +
                CANVAS_PADDING,

                window.innerHeight
            );
    }



    // ==================================================
    // ==================================================
    //
    // 纵向布局
    //
    // 小说名
    //    │
    //    ├──── 卷1
    //    │
    //    ├──── 卷2
    //    │
    //    └──── 卷3
    //
    // ==================================================
    // ==================================================

    else {

        // ==================================================
        // 找最大深度
        // ==================================================

        let maxLevel =
            0;


        function findVerticalMaxLevel(
            nodes,
            level
        ) {

            if (
                !Array.isArray(nodes)
            ) {

                return;
            }


            nodes.forEach(
                node => {

                    maxLevel =
                        Math.max(
                            maxLevel,
                            level
                        );


                    if (
                        node.collapsed !== true &&
                        Array.isArray(
                            node.children
                        ) &&
                        node.children.length > 0
                    ) {

                        findVerticalMaxLevel(
                            node.children,
                            level + 1
                        );
                    }
                }
            );
        }


        findVerticalMaxLevel(
            roots,
            0
        );



        // ==================================================
        // 每一级节点
        // ==================================================

        const levels =
            [];


        function collectVerticalLevels(
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

                levels[level] = [];
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

                        collectVerticalLevels(
                            node.children,
                            level + 1
                        );
                    }
                }
            );
        }


        collectVerticalLevels(
            roots,
            0
        );



        // ==================================================
        // 每一级宽度
        // ==================================================

        const levelWidths =
            [];


        levels.forEach(
            (nodes, level) => {

                if (
                    !Array.isArray(nodes) ||
                    nodes.length === 0
                ) {

                    return;
                }


                levelWidths[level] =
                    nodes.length *
                    NODE_W +
                    Math.max(
                        0,
                        nodes.length - 1
                    ) *
                    SIBLING_GAP;
            }
        );



        // ==================================================
        // 最大宽度
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
        // 树整体以小说名中心为 X 中心
        // ==================================================

        const treeStartX =
            bookCenterX -
            treeWidth / 2;



        // ==================================================
        // 每一级节点
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
                                y +
                                NODE_H / 2
                        });
                    }
                );
            }
        );



        // ==================================================
        // 计算范围
        // ==================================================

        let minNodeX =
            Infinity;


        let maxNodeX =
            -Infinity;


        let minNodeY =
            Infinity;


        let maxNodeY =
            -Infinity;


        layout.nodes.forEach(
            item => {

                minNodeX =
                    Math.min(
                        minNodeX,
                        item.x
                    );


                maxNodeX =
                    Math.max(
                        maxNodeX,
                        item.x +
                        item.width
                    );


                minNodeY =
                    Math.min(
                        minNodeY,
                        item.y
                    );


                maxNodeY =
                    Math.max(
                        maxNodeY,
                        item.y +
                        item.height
                    );
            }
        );



        // ==================================================
        // 左边界
        // ==================================================

        if (
            minNodeX <
            CANVAS_PADDING
        ) {

            const shiftX =
                CANVAS_PADDING -
                minNodeX;


            layout.nodes.forEach(
                item => {

                    item.x +=
                        shiftX;


                    item.centerX +=
                        shiftX;
                }
            );


            maxNodeX +=
                shiftX;


            minNodeX +=
                shiftX;
        }



        // ==================================================
        // 上边界
        // ==================================================

        if (
            minNodeY <
            CANVAS_PADDING
        ) {

            const shiftY =
                CANVAS_PADDING -
                minNodeY;


            layout.nodes.forEach(
                item => {

                    item.y +=
                        shiftY;


                    item.centerY +=
                        shiftY;
                }
            );


            maxNodeY +=
                shiftY;


            minNodeY +=
                shiftY;
        }



        // ==================================================
        // 画布尺寸
        // ==================================================

        layout.width =
            Math.max(
                maxNodeX +
                CANVAS_PADDING,

                window.innerWidth
            );


        layout.height =
            Math.max(
                maxNodeY +
                CANVAS_PADDING,

                window.innerHeight
            );
    }



    // ==================================================
    // 公共信息
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
