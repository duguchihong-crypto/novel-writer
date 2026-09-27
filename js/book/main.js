// ==============================
// 全书页面：主程序
// ==============================


// ==============================
// 初始化
// ==============================

function init() {

    currentBook =
        loadCurrentBook();


    if (!currentBook) {

        console.warn(
            "没有找到当前书籍"
        );

        return;
    }


    if (
        !Array.isArray(
            currentBook.structure
        )
    ) {

        currentBook.structure = [];

    }


    resetBookPageState();

    updateBookStructureState();

    renderBookTitle();

    setupEvents();

    updatePrefaceButton();

    renderTree();


    if (!bookResizeInitialized) {

        window.addEventListener(
            "resize",
            function() {

                renderTree();

            }
        );

        bookResizeInitialized = true;
    }
}


// ==============================
// 返回
// ==============================

function goBack() {

    saveBook();

    window.location.href =
        "index.html";
}


// ==============================
// 渲染书名
// ==============================

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


// ==============================
// 渲染整棵树
// ==============================

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


    if (!canvas || !tree) {

        console.warn(
            "找不到 tree-canvas 或 #tree"
        );

        return;
    }


    updateBookStructureState();


    tree.innerHTML = "";


    if (svg) {

        svg.innerHTML = "";

    }


    // 删除旧的 + / − 控制按钮

    document
        .querySelectorAll(
            ".line-control"
        )
        .forEach(
            element =>
                element.remove()
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


        // 没有结构时，
        // 书名才自动居中

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
    // 计算布局
    // ==================================================

    const layout =
        calculateLayout();


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
    // 树尺寸
    // ==================================================

    treeWidth =
        Math.max(
            layout.width,
            canvasWidth
        );


    treeHeight =
        Math.max(
            layout.height,
            canvasHeight
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
    // 非常重要
    //
    // layout.js 已经完成全部节点定位。
    //
    // 这里绝对不能再次给节点 X 坐标做偏移。
    // ==================================================

    currentLayout =
        layout;


    // ==================================================
    // SVG
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
    // 书名
    //
    // 有结构以后：
    // 不重新居中
    // 不重新计算 X
    // 不因为新增节点而移动
    // ==================================================

    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    if (bookTitle) {

        bookTitle.style.position =
            "absolute";

        bookTitle.style.margin =
            "0";

        bookTitle.style.transform =
            "none";


        // 如果书名还没有位置，
        // 只在第一次设置一次。

        const currentLeft =
            parseFloat(
                bookTitle.style.left
            );


        const currentTop =
            parseFloat(
                bookTitle.style.top
            );


        if (
            !Number.isFinite(
                currentLeft
            )
        ) {

            const width =
                bookTitle.offsetWidth ||
                BOOK_MIN_WIDTH;


            const x =
                Math.max(
                    10,
                    canvasWidth / 2 -
                    width / 2
                );


            bookTitle.style.left =
                x + "px";


            bookPosition.x =
                x;

        }


        if (
            !Number.isFinite(
                currentTop
            )
        ) {

            const y =
                25;


            bookTitle.style.top =
                y + "px";


            bookPosition.y =
                y;

        }

    }


    // ==================================================
    // 创建节点
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


// ==============================
// 没有结构时：书名居中
// ==============================

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


// ==============================
// 恢复选择状态
// ==============================

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


// ==============================
// 启动
// ==============================

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
