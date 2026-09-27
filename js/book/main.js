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


    if (
        !Array.isArray(
            currentBook.structure
        )
    ) {

        currentBook.structure = [];

    }


    // ==================================================
    // 初始化布局方向
    // ==================================================

    if (
        currentBook.layoutDirection !==
            "vertical" &&
        currentBook.layoutDirection !==
            "horizontal"
    ) {

        currentBook.layoutDirection =
            "vertical";
    }


    // ==================================================
    // 重置页面状态
    // ==================================================

    resetBookPageState();


    // ==================================================
    // 恢复布局方向
    // ==================================================

    if (
        currentBook.layoutDirection ===
        "horizontal"
    ) {

        currentBook.layoutDirection =
            "horizontal";

    } else {

        currentBook.layoutDirection =
            "vertical";
    }


    // ==================================================
    // 恢复书名位置
    //
    // 如果之前保存过位置，
    // 就继续使用。
    // ==================================================

    if (
        currentBook.bookPosition &&
        typeof currentBook.bookPosition ===
            "object"
    ) {

        const savedX =
            Number(
                currentBook.bookPosition.x
            );

        const savedY =
            Number(
                currentBook.bookPosition.y
            );


        if (
            Number.isFinite(savedX)
        ) {

            bookPosition.x =
                savedX;
        }


        if (
            Number.isFinite(savedY)
        ) {

            bookPosition.y =
                savedY;
        }
    }


    updateBookStructureState();


    renderBookTitle();


    setupEvents();


    setupLayoutToggle();


    updateLayoutToggle();


    updatePrefaceButton();


    renderTree();


    // ==================================================
    // 窗口尺寸变化
    // ==================================================

    if (
        !bookResizeInitialized
    ) {

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
// 返回
// ==================================================

function goBack() {

    saveBook();

    window.location.href =
        "index.html";
}


// ==================================================
// 布局切换按钮
// ==================================================

function setupLayoutToggle() {

    const button =
        document.querySelector(
            "#layoutToggle"
        );


    if (!button) {
        return;
    }


    if (
        button.dataset.initialized ===
        "true"
    ) {

        return;
    }


    button.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            toggleBookLayoutDirection();

        }
    );


    button.dataset.initialized =
        "true";
}


// ==================================================
// 更新布局切换按钮文字
// ==================================================

function updateLayoutToggle() {

    const button =
        document.querySelector(
            "#layoutToggle"
        );


    if (!button) {
        return;
    }


    const direction =
        getBookLayoutDirection();


    if (
        direction ===
        "horizontal"
    ) {

        button.textContent =
            "↔ 横向";

        button.setAttribute(
            "aria-label",
            "当前为横向布局，点击切换为纵向"
        );

    } else {

        button.textContent =
            "↕ 纵向";

        button.setAttribute(
            "aria-label",
            "当前为纵向布局，点击切换为横向"
        );
    }
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

    titleElement.style.transform =
        "none";


    // ==================================================
    // 恢复已经保存的书名位置
    // ==================================================

    if (
        Number.isFinite(
            Number(bookPosition.x)
        )
    ) {

        titleElement.style.left =
            Number(bookPosition.x) +
            "px";
    }


    if (
        Number.isFinite(
            Number(bookPosition.y)
        )
    ) {

        titleElement.style.top =
            Number(bookPosition.y) +
            "px";
    }
}


// ==================================================
// 确保书名拥有位置
//
// 注意：
// 这里只负责第一次定位。
// 一旦已经有位置，就绝不重新居中。
// ==================================================

function ensureBookTitlePosition() {

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


    let left =
        parseFloat(
            bookTitle.style.left
        );


    let top =
        parseFloat(
            bookTitle.style.top
        );


    // ==================================================
    // 已经有保存的位置
    // ==================================================

    if (
        !Number.isFinite(left) &&
        Number.isFinite(
            Number(bookPosition.x)
        )
    ) {

        left =
            Number(
                bookPosition.x
            );


        bookTitle.style.left =
            left + "px";
    }


    if (
        !Number.isFinite(top) &&
        Number.isFinite(
            Number(bookPosition.y)
        )
    ) {

        top =
            Number(
                bookPosition.y
            );


        bookTitle.style.top =
            top + "px";
    }


    // ==================================================
    // 第一次打开
    //
    // 没有保存位置时才居中。
    // ==================================================

    if (
        !Number.isFinite(left)
    ) {

        const width =
            bookTitle.offsetWidth ||
            BOOK_MIN_WIDTH;


        left =
            Math.max(
                0,
                (
                    canvas.clientWidth -
                    width
                ) / 2
            );


        bookTitle.style.left =
            left + "px";


        bookPosition.x =
            left;
    }


    if (
        !Number.isFinite(top)
    ) {

        const height =
            bookTitle.offsetHeight ||
            BOOK_MIN_HEIGHT;


        top =
            Math.max(
                20,
                (
                    canvas.clientHeight -
                    height
                ) / 2
            );


        bookTitle.style.top =
            top + "px";


        bookPosition.y =
            top;
    }


    // ==================================================
    // 同步状态
    // ==================================================

    bookPosition.x =
        left;

    bookPosition.y =
        top;
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


    updateBookStructureState();


    // ==================================================
    // 先确保书名位置
    //
    // 非常重要：
    // calculateLayout 会读取书名当前位置。
    // ==================================================

    ensureBookTitlePosition();


    // ==================================================
    // 清理旧内容
    // ==================================================

    tree.innerHTML = "";


    if (svg) {

        svg.innerHTML = "";

    }


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


        // ==================================================
        // 没有结构时：
        // 只有完全没有位置时才居中。
        //
        // 绝不覆盖用户已经拖动的位置。
        // ==================================================

        requestAnimationFrame(
            function() {

                ensureBookTitlePosition();

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


    // ==================================================
    // 当前画布尺寸
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
    // 保存布局
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


// ==================================================
// 没有结构时：书名居中
//
// 只有第一次没有位置时使用。
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


    // ==================================================
    // 如果已经存在位置
    // 直接保留
    // ==================================================

    const currentLeft =
        parseFloat(
            bookTitle.style.left
        );


    const currentTop =
        parseFloat(
            bookTitle.style.top
        );


    if (
        Number.isFinite(
            currentLeft
        ) &&
        Number.isFinite(
            currentTop
        )
    ) {

        bookPosition.x =
            currentLeft;

        bookPosition.y =
            currentTop;

        return;
    }


    // ==================================================
    // 第一次才居中
    // ==================================================

    const canvasWidth =
        canvas.clientWidth;


    const canvasHeight =
        canvas.clientHeight;


    if (
        canvasWidth <= 0 ||
        canvasHeight <= 0
    ) {

        requestAnimationFrame(
            centerBookTitle
        );

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
        Math.max(
            0,
            (
                canvasWidth -
                bookWidth
            ) / 2
        );


    const y =
        Math.max(
            0,
            (
                canvasHeight -
                bookHeight
            ) / 2
        );


    bookTitle.style.left =
        x + "px";


    bookTitle.style.top =
        y + "px";


    bookPosition.x =
        x;

    bookPosition.y =
        y;
}


// ==================================================
// 恢复选择状态
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
