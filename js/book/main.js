// ==============================
// 全书页面：主程序
// ==============================


// ==============================
// 初始化
// ==============================

function init() {

    currentBook = loadCurrentBook();

    if (!currentBook) {

        console.warn("没有找到当前书籍");

        return;
    }


    // ==============================
    // 确保书籍结构存在
    // ==============================

    if (
        !Array.isArray(currentBook.structure)
    ) {

        currentBook.structure = [];
    }


    // ==============================
    // 初始化状态
    // ==============================

    resetBookPageState();

    updateBookStructureState();


    // ==============================
    // 渲染书名
    // ==============================

    renderBookTitle();


    // ==============================
    // 初始化事件
    // ==============================

    setupEvents();


    // ==============================
    // 更新序按钮状态
    // ==============================

    updatePrefaceButton();


    // ==============================
    // 第一次渲染
    // ==============================

    renderTree();


    // ==============================
    // 窗口大小变化
    // ==============================

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
// 返回书架
// ==============================

function goBack() {

    saveBook();

    window.location.href = "index.html";
}


// ==============================
// 渲染书名
// ==============================

function renderBookTitle() {

    const titleElement =
        document.querySelector("#bookTitle");


    if (!titleElement || !currentBook) {
        return;
    }


    titleElement.textContent =
        currentBook.title ||
        "未命名书籍";


    // 必须保证书名可以自由定位
    titleElement.style.position = "absolute";


    // 防止文字选择影响拖动
    titleElement.style.userSelect = "none";
    titleElement.style.webkitUserSelect = "none";
}


// ==============================
// 渲染整棵树
// ==============================

function renderTree() {

    if (!currentBook) {
        return;
    }


    const canvas =
        document.querySelector(".tree-canvas");

    const tree =
        document.querySelector("#tree");

    const svg =
        document.querySelector("#connections");


    if (!canvas || !tree) {

        console.warn(
            "找不到 tree-canvas 或 #tree"
        );

        return;
    }


    // ==============================
    // 更新结构状态
    // ==============================

    updateBookStructureState();


    // ==============================
    // 清空旧结构
    // ==============================

    tree.innerHTML = "";


    if (svg) {

        svg.innerHTML = "";

    }


    // 删除旧的 + / − 控制点
    document
        .querySelectorAll(".line-control")
        .forEach(element => {

            element.remove();

        });


    // ==============================
    // 没有结构
    // ==============================

    if (!hasStructure) {

        const hint =
            document.createElement("div");


        hint.className =
            "tree-empty";


        hint.textContent =
            "点击书名开始添加序、章、篇或卷";


        tree.appendChild(hint);


        // 书名保持自由移动
        restoreBookPosition();


        // 没有结构时不需要连线
        connectionsVisible = false;


        return;
    }


    // ==============================
    // 有结构
    // ==============================

    autoLayoutEnabled = true;
    connectionsVisible = true;


    // ==============================
    // 计算自动布局
    // ==============================

    const layout =
        calculateLayout();


    currentLayout = layout;


    // ==============================
    // 计算画布尺寸
    // ==============================

    const canvasWidth =
        canvas.clientWidth || window.innerWidth;

    const canvasHeight =
        canvas.clientHeight || window.innerHeight;


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


    // ==============================
    // SVG 尺寸
    // ==============================

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


    // ==============================
    // 书名位置
    // ==============================

    positionBookAutomatically(layout);


    // ==============================
    // 创建所有结构框
    // ==============================

    layout.nodes.forEach(item => {

        const element =
            createNodeElement(item.node);


        if (!element) {

            console.warn(
                "创建节点失败：",
                item.node
            );

            return;
        }


        // 确保绝对定位
        element.style.position =
            "absolute";


        element.style.left =
            item.x + "px";


        element.style.top =
            item.y + "px";


        // 保存布局坐标
        element.dataset.nodeId =
            item.node.id;


        tree.appendChild(element);

    });


    // ==============================
    // 下一帧画连线
    // ==============================

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
// 自动放置书名
// ==============================

function positionBookAutomatically(layout) {

    const bookTitle =
        document.querySelector("#bookTitle");


    if (!bookTitle) {
        return;
    }


    // ==============================
    // 如果用户已经手动移动
    // ==============================

    if (hasSavedBookPosition()) {

        bookTitle.style.position =
            "absolute";

        bookTitle.style.left =
            bookPosition.x + "px";

        bookTitle.style.top =
            bookPosition.y + "px";

        return;
    }


    // ==============================
    // 自动计算书名位置
    // ==============================

    const bookWidth =
        bookTitle.offsetWidth ||
        BOOK_MIN_WIDTH;


    const bookHeight =
        bookTitle.offsetHeight ||
        BOOK_MIN_HEIGHT;


    let x;
    let y;


    if (
        layout &&
        layout.width > 0
    ) {

        x =
            layout.width / 2 -
            bookWidth / 2;

    } else {

        x =
            window.innerWidth / 2 -
            bookWidth / 2;

    }


    y = 25;


    // 防止跑到左边界之外
    x = Math.max(
        20,
        x
    );


    bookTitle.style.position =
        "absolute";


    bookTitle.style.left =
        x + "px";


    bookTitle.style.top =
        y + "px";


    // 记录当前位置
    bookPosition.x = x;
    bookPosition.y = y;
}


// ==============================
// 恢复书名位置
// ==============================

function restoreBookPosition() {

    const bookTitle =
        document.querySelector("#bookTitle");


    if (!bookTitle) {
        return;
    }


    bookTitle.style.position =
        "absolute";


    if (hasSavedBookPosition()) {

        bookTitle.style.left =
            bookPosition.x + "px";

        bookTitle.style.top =
            bookPosition.y + "px";

        return;
    }


    // 第一次打开时
    // 没有结构也要让书名出现在屏幕中央附近

    const width =
        bookTitle.offsetWidth ||
        BOOK_MIN_WIDTH;


    const x =
        Math.max(
            20,
            window.innerWidth / 2 -
            width / 2
        );


    const y = 25;


    bookTitle.style.left =
        x + "px";

    bookTitle.style.top =
        y + "px";


    bookPosition.x = x;
    bookPosition.y = y;
}


// ==============================
// 恢复选择
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
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        init
    );

} else {

    init();

}
