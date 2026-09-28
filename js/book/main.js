// ==============================
// 全书页面：主程序
// ==============================


// ==================================================
// 画布默认尺寸
//
// ★ 与 layout.js 保持一致
// ==================================================

const BOOK_CANVAS_SIZE =
    3000;


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

        currentBook.structure =
            [];
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
    // ★ 如果以前保存过，就继续使用
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
// ★ 核心修改
//
// 第一次没有位置：
//
// 3000 × 3000
//       ↓
// 书名放在真正的画布中心
//
// 不是手机当前视口中心
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
    // 已经有 DOM 位置
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
    // ★ 真正放到 3000×3000 中央
    // ==================================================

    if (
        !Number.isFinite(left)
    ) {

        const width =
            bookTitle.offsetWidth ||
            BOOK_MIN_WIDTH;


        left =
            (
                BOOK_CANVAS_SIZE -
                width
            ) / 2;


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
            (
                BOOK_CANVAS_SIZE -
                height
            ) / 2;


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
// 将视口移动到书名中心
//
// ★ 第一次打开时使用
//
// 例如：
//
// 画布：3000 × 3000
//
// 书名：
// left = 1430
// top  = 1470
//
// 那么：
//
// scrollLeft
// = 1500 - 视口宽度 / 2
//
// scrollTop
// = 1500 - 视口高度 / 2
//
// ==================================================

function centerViewportOnBookTitle(
    smooth = false
) {

    const canvas =
        document.querySelector(
            ".tree-canvas"
        );


    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    if (
        !canvas ||
        !bookTitle
    ) {

        return;
    }


    // ==================================================
    // 书名中心
    // ==================================================

    const bookLeft =
        parseFloat(
            bookTitle.style.left
        );


    const bookTop =
        parseFloat(
            bookTitle.style.top
        );


    const bookWidth =
        bookTitle.offsetWidth ||
        BOOK_MIN_WIDTH;


    const bookHeight =
        bookTitle.offsetHeight ||
        BOOK_MIN_HEIGHT;


    if (
        !Number.isFinite(bookLeft) ||
        !Number.isFinite(bookTop)
    ) {

        return;
    }


    const bookCenterX =
        bookLeft +
        bookWidth / 2;


    const bookCenterY =
        bookTop +
        bookHeight / 2;


    // ==================================================
    // 目标滚动位置
    // ==================================================

    const targetLeft =
        Math.max(
            0,
            bookCenterX -
            canvas.clientWidth / 2
        );


    const targetTop =
        Math.max(
            0,
            bookCenterY -
            canvas.clientHeight / 2
        );


    // ==================================================
    // 不要超过最大滚动范围
    // ==================================================

    const maxScrollLeft =
        Math.max(
            0,
            canvas.scrollWidth -
            canvas.clientWidth
        );


    const maxScrollTop =
        Math.max(
            0,
            canvas.scrollHeight -
            canvas.clientHeight
        );


    const finalLeft =
        Math.min(
            targetLeft,
            maxScrollLeft
        );


    const finalTop =
        Math.min(
            targetTop,
            maxScrollTop
        );


    // ==================================================
    // 执行滚动
    // ==================================================

    if (smooth) {

        canvas.scrollTo({

            left:
                finalLeft,

            top:
                finalTop,

            behavior:
                "smooth"
        });

    } else {

        canvas.scrollLeft =
            finalLeft;

        canvas.scrollTop =
            finalTop;
    }
}


// ==================================================
// 判断是否需要首次居中视口
//
// ★ 只有第一次打开页面时执行
// ★ 用户已经滚动过以后不自动拉回去
// ==================================================

function shouldCenterViewportOnOpen() {

    const canvas =
        document.querySelector(
            ".tree-canvas"
        );


    if (!canvas) {
        return false;
    }


    // ==================================================
    // 本次页面是否已经处理过
    // ==================================================

    if (
        canvas.dataset.initialViewportCentered ===
        "true"
    ) {

        return false;
    }


    return true;
}


// ==================================================
// 执行首次视口定位
// ==================================================

function centerViewportOnOpen() {

    if (
        !shouldCenterViewportOnOpen()
    ) {

        return;
    }


    const canvas =
        document.querySelector(
            ".tree-canvas"
        );


    if (!canvas) {
        return;
    }


    // ==================================================
    // 等 DOM 尺寸完成
    // ==================================================

    requestAnimationFrame(
        function() {

            requestAnimationFrame(
                function() {

                    centerViewportOnBookTitle(
                        false
                    );


                    canvas.dataset.initialViewportCentered =
                        "true";
                }
            );
        }
    );
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
    // calculateLayout 会读取书名当前位置
    // ==================================================

    ensureBookTitlePosition();


    // ==================================================
    // 清理旧内容
    // ==================================================

    tree.innerHTML =
        "";


    if (svg) {

        svg.innerHTML =
            "";
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


        // ==================================================
        // ★ 空树也保持 3000×3000
        // ==================================================

        treeWidth =
            Math.max(
                BOOK_CANVAS_SIZE,
                canvas.clientWidth ||
                window.innerWidth
            );


        treeHeight =
            Math.max(
                BOOK_CANVAS_SIZE,
                canvas.clientHeight ||
                (
                    window.innerHeight -
                    56
                )
            );


        treeCanvasWidth =
            treeWidth;

        treeCanvasHeight =
            treeHeight;


        tree.style.width =
            treeWidth + "px";


        tree.style.height =
            treeHeight + "px";


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
        // 下一帧：
        //
        // 1. 确保书名
        // 2. 首次滚动到书名
        // ==================================================

        requestAnimationFrame(
            function() {

                ensureBookTitlePosition();

                centerViewportOnOpen();

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
    // 当前视口尺寸
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
            BOOK_CANVAS_SIZE,
            canvasWidth
        );


    treeHeight =
        Math.max(
            layout.height,
            BOOK_CANVAS_SIZE,
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


            // ==================================================
            // ★ 第一次打开自动定位
            // ==================================================

            centerViewportOnOpen();

        }
    );
}


// ==================================================
// 没有结构时：书名居中
//
// ★ 这里只是兼容旧代码
//
// 如果已经存在位置，绝对不改变。
// 如果没有位置，则放到 3000×3000 中心。
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
    // 已经存在位置
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
    // 第一次才放到 3000×3000 中心
    // ==================================================

    const bookWidth =
        bookTitle.offsetWidth ||
        BOOK_MIN_WIDTH;


    const bookHeight =
        bookTitle.offsetHeight ||
        BOOK_MIN_HEIGHT;


    const x =
        (
            BOOK_CANVAS_SIZE -
            bookWidth
        ) / 2;


    const y =
        (
            BOOK_CANVAS_SIZE -
            bookHeight
        ) / 2;


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
