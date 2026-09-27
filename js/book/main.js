// ==============================
// 全书页面：主程序
// ==============================


// ==================================================
// 初始化
// ==================================================

function init() {

    currentBook =
        loadCurrentBook();


    if (!currentBook) {

        console.warn(
            "没有找到当前书籍"
        );

        return;
    }


    // ==================================================
    // 确保书籍结构存在
    // ==================================================

    if (
        !Array.isArray(
            currentBook.structure
        )
    ) {

        currentBook.structure = [];
    }


    // ==================================================
    // 初始化状态
    // ==================================================

    resetBookPageState();

    updateBookStructureState();


    // ==================================================
    // 渲染书名
    // ==================================================

    renderBookTitle();


    // ==================================================
    // 初始化事件
    // ==================================================

    setupEvents();


    // ==================================================
    // 更新序按钮
    // ==================================================

    updatePrefaceButton();


    // ==================================================
    // 第一次渲染
    // ==================================================

    renderTree();


    // ==================================================
    // 窗口大小变化
    // ==================================================

    if (!bookResizeInitialized) {

        window.addEventListener(
            "resize",
            function() {

                renderTree();

            }
        );

        bookResizeInitialized =
            true;
    }
}


// ==================================================
// 返回书架
// ==================================================

function goBack() {

    saveBook();

    window.location.href =
        "index.html";
}


// ==================================================
// 渲染书名
// ==================================================

function renderBookTitle() {

    const titleElement =
        document.querySelector(
            "#bookTitle"
        );


    if (
        !titleElement ||
        !currentBook
    ) {

        return;
    }


    titleElement.textContent =
        currentBook.title ||
        "未命名书籍";


    titleElement.style.position =
        "absolute";


    titleElement.style.margin =
        "0";


    titleElement.style.userSelect =
        "none";


    titleElement.style.webkitUserSelect =
        "none";
}


// ==================================================
// 渲染整棵树
// ==================================================

function renderTree() {

    if (!currentBook) {
        return;
    }


    const canvas =
        document.querySelector(
            ".tree-canvas"
        );


    const tree =
        document.querySelector(
            "#tree"
        );


    const svg =
        document.querySelector(
            "#connections"
        );


    if (
        !canvas ||
        !tree
    ) {

        console.warn(
            "找不到 tree-canvas 或 #tree"
        );

        return;
    }


    // ==================================================
    // 更新结构状态
    // ==================================================

    updateBookStructureState();


    // ==================================================
    // 清空旧结构
    // ==================================================

    tree.innerHTML = "";


    if (svg) {

        svg.innerHTML = "";
    }


    // ==================================================
    // 删除旧的 + / − 控制点
    // ==================================================

    document
        .querySelectorAll(
            ".line-control"
        )
        .forEach(
            element => {

                element.remove();

            }
        );


    // ==================================================
    // 没有结构
    // ==================================================

    if (!hasStructure) {

        autoLayoutEnabled =
            false;

        connectionsVisible =
            false;

        currentLayout =
            null;


        const canvasWidth =
            canvas.clientWidth ||
            window.innerWidth;


        const canvasHeight =
            canvas.clientHeight ||
            (
                window.innerHeight -
                56
            );


        treeWidth =
            canvasWidth;

        treeHeight =
            canvasHeight;


        treeCanvasWidth =
            canvasWidth;

        treeCanvasHeight =
            canvasHeight;


        tree.style.width =
            "100%";

        tree.style.height =
            "100%";


        canvas.scrollLeft =
            0;

        canvas.scrollTop =
            0;


        if (svg) {

            svg.setAttribute(
                "width",
                canvasWidth
            );

            svg.setAttribute(
                "height",
                canvasHeight
            );

            svg.setAttribute(
                "viewBox",
                `0 0 ${canvasWidth} ${canvasHeight}`
            );
        }


        const hint =
            document.createElement(
                "div"
            );


        hint.className =
            "tree-empty";


        hint.textContent =
            "点击书名开始添加序、章、篇或卷";


        tree.appendChild(
            hint
        );


        requestAnimationFrame(
            function() {

                centerBookTitle();

            }
        );


        return;
    }


    // ==================================================
    // 有结构
    // ==================================================

    autoLayoutEnabled =
        true;

    connectionsVisible =
        true;


    // ==================================================
    // 先计算布局
    // ==================================================

    const layout =
        calculateLayout();


    // ==================================================
    // 获取画布尺寸
    // ==================================================

    const canvasWidth =
        canvas.clientWidth ||
        window.innerWidth;


    const canvasHeight =
        canvas.clientHeight ||
        (
            window.innerHeight -
            56
        );


    // ==================================================
    // 计算最终画布尺寸
    // ==================================================

    treeWidth =
        Math.max(
            layout.width + 200,
            canvasWidth + 200
        );


    treeHeight =
        Math.max(
            layout.height + 300,
            canvasHeight + 300
        );


    treeCanvasWidth =
        treeWidth;

    treeCanvasHeight =
        treeHeight;


    tree.style.width =
        treeWidth + "px";


    tree.style.height =
        treeHeight + "px";


    // ==================================================
    // 统一布局中心
    // ==================================================

    const layoutCenter =
        layout.width / 2;


    const canvasCenter =
        treeWidth / 2;


    const layoutOffset =
        canvasCenter -
        layoutCenter;


    // ==================================================
    // 所有节点向真正的画布中心移动
    // ==================================================

    layout.nodes.forEach(
        item => {

            item.x +=
                layoutOffset;

            item.centerX +=
                layoutOffset;

        }
    );


    // ==================================================
    // 保存最终布局
    // ==================================================

    currentLayout =
        layout;


    // ==================================================
    // SVG 尺寸
    // ==================================================

    if (svg) {

        svg.setAttribute(
            "width",
            treeWidth
        );

        svg.setAttribute(
            "height",
            treeHeight
        );

        svg.setAttribute(
            "viewBox",
            `0 0 ${treeWidth} ${treeHeight}`
        );
    }


    // ==================================================
    // 书名：
    // 永远位于整个树的真正中心上方
    // ==================================================

    positionBookAutomatically(
        layout
    );


    // ==================================================
    // 创建所有结构节点
    // ==================================================

    layout.nodes.forEach(
        item => {

            const element =
                createNodeElement(
                    item.node
                );


            if (!element) {

                console.warn(
                    "创建节点失败：",
                    item.node
                );

                return;
            }


            element.style.position =
                "absolute";


            element.style.left =
                item.x + "px";


            element.style.top =
                item.y + "px";


            element.dataset.nodeId =
                item.node.id;


            tree.appendChild(
                element
            );

        }
    );


    // ==================================================
    // 下一帧绘制连接线
    // ==================================================

    requestAnimationFrame(
        function() {

            if (
                connectionsVisible &&
                currentLayout
            ) {

                drawConnections(
                    currentLayout
                );
            }


            restoreSelection();

        }
    );
}


// ==================================================
// 没有结构时：真正居中书名
// ==================================================

function centerBookTitle() {

    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    const canvas =
        document.querySelector(
            ".tree-canvas"
        );


    if (
        !bookTitle ||
        !canvas
    ) {

        return;
    }


    bookTitle.style.position =
        "absolute";


    bookTitle.style.margin =
        "0";


    bookTitle.style.transform =
        "none";


    const canvasWidth =
        canvas.clientWidth;


    const canvasHeight =
        canvas.clientHeight;


    if (
        canvasWidth <= 0 ||
        canvasHeight <= 0
    ) {

        return;
    }


    const bookWidth =
        bookTitle.offsetWidth;


    const bookHeight =
        bookTitle.offsetHeight;


    if (
        bookWidth <= 0 ||
        bookHeight <= 0
    ) {

        requestAnimationFrame(
            centerBookTitle
        );

        return;
    }


    const x =
        (
            canvasWidth -
            bookWidth
        ) / 2;


    const y =
        (
            canvasHeight -
            bookHeight
        ) / 2;


    bookTitle.style.left =
        Math.max(
            0,
            x
        ) + "px";


    bookTitle.style.top =
        Math.max(
            0,
            y
        ) + "px";


    bookPosition.x =
        Math.max(
            0,
            x
        );

    bookPosition.y =
        Math.max(
            0,
            y
        );
}


// ==================================================
// 有结构时：自动放置书名
// ==================================================

function positionBookAutomatically(layout) {

    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    if (!bookTitle) {
        return;
    }


    bookTitle.style.position =
        "absolute";


    bookTitle.style.margin =
        "0";


    bookTitle.style.transform =
        "none";


    const bookWidth =
        bookTitle.offsetWidth ||
        BOOK_MIN_WIDTH;


    const bookHeight =
        bookTitle.offsetHeight ||
        BOOK_MIN_HEIGHT;


    // ==================================================
    // 使用最终 treeWidth
    // ==================================================

    const centerX =
        treeWidth / 2;


    const x =
        centerX -
        bookWidth / 2;


    // ==================================================
    // 书名固定在最顶部
    // ==================================================

    const y =
        25;


    bookTitle.style.left =
        Math.max(
            20,
            x
        ) + "px";


    bookTitle.style.top =
        y + "px";


    bookPosition.x =
        Math.max(
            20,
            x
        );


    bookPosition.y =
        y;
}


// ==================================================
// 恢复书名位置
// ==================================================

function restoreBookPosition() {

    if (!hasStructure) {

        centerBookTitle();

        return;
    }


    positionBookAutomatically(
        currentLayout
    );
}


// ==================================================
// 恢复选择
// ==================================================

function restoreSelection() {

    if (selectedIsBook) {

        selectBook();

        return;
    }


    if (selectedNodeId) {

        const element =
            document.querySelector(
                `[data-node-id="${selectedNodeId}"]`
            );


        if (element) {

            selectNode(
                selectedNodeId
            );

            return;
        }
    }


    clearSelection();
}


// ==================================================
// 启动
// ==================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        init
    );

} else {

    init();
}
