// ==============================
// 全书页面：主程序
// ==============================


// ==================================================
// 初始化
// ==================================================

function init() {

    // ==================================================
    // 当前书籍
    // ==================================================

    currentBook =
        loadCurrentBook();


    if (!currentBook) {

        console.warn(
            "没有找到当前书籍"
        );

        return;

    }


    // ==================================================
    // 确保书名有效
    //
    // 这里直接使用 localStorage 中
    // 当前书籍的真实 title。
    // ==================================================

    if (
        typeof currentBook.title !==
        "string"
    ) {

        currentBook.title =
            "未命名书籍";

    }


    currentBook.title =
        currentBook.title.trim();


    if (
        currentBook.title === ""
    ) {

        currentBook.title =
            "未命名书籍";

    }


    // ==================================================
    // 更新浏览器页面标题
    // ==================================================

    document.title =
        currentBook.title +
        " - 全书";


    // ==================================================
    // 确保 structure 存在
    // ==================================================

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
    // 恢复书名位置
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
            Number.isFinite(savedX) &&
            Number.isFinite(savedY)
        ) {

            bookPosition.x =
                savedX;

            bookPosition.y =
                savedY;

        }

    }


    // ==================================================
    // 更新结构状态
    // ==================================================

    updateBookStructureState();


    // ==================================================
    // 渲染书名
    // ==================================================

    renderBookTitle();


    // ==================================================
    // 初始化事件
    // ==================================================

    if (
        typeof setupEvents ===
        "function"
    ) {

        setupEvents();

    } else {

        console.warn(
            "setupEvents 尚未加载"
        );

    }


    // ==================================================
    // 布局切换
    // ==================================================

    setupLayoutToggle();

    updateLayoutToggle();


    // ==================================================
    // 序按钮状态
    // ==================================================

    updatePrefaceButton();


    // ==================================================
    // 第一次渲染
    // ==================================================

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
// 获取当前书名
//
// 所有全书页面书名显示统一从
// currentBook.title 获取。
// ==================================================

function getCurrentBookTitle() {

    if (
        !currentBook ||
        typeof currentBook.title !==
        "string"
    ) {

        return "未命名书籍";

    }


    const title =
        currentBook.title.trim();


    if (
        title === ""
    ) {

        return "未命名书籍";

    }


    return title;

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


    // ==================================================
    // 读取真实书名
    // ==================================================

    const title =
        getCurrentBookTitle();


    // ==================================================
    // 写入书名
    // ==================================================

    titleElement.textContent =
        title;


    // ==================================================
    // 同步浏览器标题
    // ==================================================

    document.title =
        title +
        " - 全书";


    // ==================================================
    // 基础样式
    // ==================================================

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
    // 恢复已有位置
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
// 确保书名拥有有效位置
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


    // ==================================================
    // 获取尺寸
    // ==================================================

    const width =
        bookTitle.offsetWidth ||
        BOOK_MIN_WIDTH;


    const height =
        bookTitle.offsetHeight ||
        BOOK_MIN_HEIGHT;


    // ==================================================
    // 当前 DOM 位置
    // ==================================================

    let left =
        parseFloat(
            bookTitle.style.left
        );


    let top =
        parseFloat(
            bookTitle.style.top
        );


    // ==================================================
    // 使用 state 中保存的位置
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

    }


    // ==================================================
    // 没有 X → 自动居中
    // ==================================================

    if (
        !Number.isFinite(left)
    ) {

        left =
            (
                BOOK_CANVAS_SIZE -
                width
            ) / 2;

    }


    // ==================================================
    // 没有 Y → 自动居中
    // ==================================================

    if (
        !Number.isFinite(top)
    ) {

        top =
            (
                BOOK_CANVAS_SIZE -
                height
            ) / 2;

    }


    // ==================================================
    // 限制范围
    // ==================================================

    const maxLeft =
        Math.max(
            0,
            BOOK_CANVAS_SIZE -
            width
        );


    const maxTop =
        Math.max(
            0,
            BOOK_CANVAS_SIZE -
            height
        );


    left =
        Math.max(
            0,
            Math.min(
                left,
                maxLeft
            )
        );


    top =
        Math.max(
            0,
            Math.min(
                top,
                maxTop
            )
        );


    // ==================================================
    // 写入 DOM
    // ==================================================

    bookTitle.style.left =
        left + "px";


    bookTitle.style.top =
        top + "px";


    // ==================================================
    // 同步 state
    // ==================================================

    bookPosition.x =
        left;

    bookPosition.y =
        top;

}


// ==================================================
// 获取书名中心
// ==================================================

function getBookTitleCenter() {

    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    if (!bookTitle) {

        return null;

    }


    const left =
        parseFloat(
            bookTitle.style.left
        );


    const top =
        parseFloat(
            bookTitle.style.top
        );


    const width =
        bookTitle.offsetWidth ||
        BOOK_MIN_WIDTH;


    const height =
        bookTitle.offsetHeight ||
        BOOK_MIN_HEIGHT;


    if (
        !Number.isFinite(left) ||
        !Number.isFinite(top)
    ) {

        return null;

    }


    return {

        x:
            left +
            width / 2,

        y:
            top +
            height / 2

    };

}


// ==================================================
// 将视口移动到书名中心
// ==================================================

function centerViewportOnBookTitle(
    smooth = false
) {

    const canvas =
        document.querySelector(
            ".tree-canvas"
        );


    if (!canvas) {

        return;

    }


    const center =
        getBookTitleCenter();


    if (!center) {

        return;

    }


    let targetLeft =
        center.x -
        canvas.clientWidth / 2;


    let targetTop =
        center.y -
        canvas.clientHeight / 2;


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


    targetLeft =
        Math.max(
            0,
            Math.min(
                targetLeft,
                maxScrollLeft
            )
        );


    targetTop =
        Math.max(
            0,
            Math.min(
                targetTop,
                maxScrollTop
            )
        );


    if (smooth) {

        canvas.scrollTo({

            left:
                targetLeft,

            top:
                targetTop,

            behavior:
                "smooth"

        });

    } else {

        canvas.scrollLeft =
            targetLeft;

        canvas.scrollTop =
            targetTop;

    }

}


// ==================================================
// 是否需要第一次视口居中
// ==================================================

function shouldCenterViewportOnOpen() {

    const canvas =
        document.querySelector(
            ".tree-canvas"
        );


    if (!canvas) {

        return false;

    }


    return (
        canvas.dataset.initialViewportCentered !==
        "true"
    );

}


// ==================================================
// 第一次打开时居中
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


    requestAnimationFrame(
        function() {

            requestAnimationFrame(
                function() {

                    ensureBookTitlePosition();

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


    // ==================================================
    // 更新结构状态
    // ==================================================

    updateBookStructureState();


    // ==================================================
    // 确保书名位置
    // ==================================================

    ensureBookTitlePosition();


    // ==================================================
    // 清理旧节点
    // ==================================================

    tree.innerHTML =
        "";


    // ==================================================
    // 清理 SVG
    // ==================================================

    if (svg) {

        svg.innerHTML =
            "";

    }


    // ==================================================
    // 清理旧的 + / −
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


        // ==================================================
        // 空树提示
        // ==================================================

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


        centerViewportOnOpen();


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


    if (!layout) {

        return;

    }


    // ==================================================
    // 当前视口
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
    // 画布尺寸
    // ==================================================

    treeWidth =
        Math.max(
            layout.width || 0,
            BOOK_CANVAS_SIZE,
            canvasWidth
        );


    treeHeight =
        Math.max(
            layout.height || 0,
            BOOK_CANVAS_SIZE,
            canvasHeight
        );


    treeCanvasWidth =
        treeWidth;

    treeCanvasHeight =
        treeHeight;


    // ==================================================
    // 设置 tree
    // ==================================================

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
    // 创建节点
    // ==================================================

    if (
        Array.isArray(
            layout.nodes
        )
    ) {

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

    }


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

            centerViewportOnOpen();

        }
    );

}


// ==================================================
// 兼容旧代码：确保书名居中
// ==================================================

function centerBookTitle() {

    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    if (!bookTitle) {

        return;

    }


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


    const width =
        bookTitle.offsetWidth ||
        BOOK_MIN_WIDTH;


    const height =
        bookTitle.offsetHeight ||
        BOOK_MIN_HEIGHT;


    const x =
        (
            BOOK_CANVAS_SIZE -
            width
        ) / 2;


    const y =
        (
            BOOK_CANVAS_SIZE -
            height
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
// 页面启动
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

    setTimeout(
        init,
        0
    );

}
