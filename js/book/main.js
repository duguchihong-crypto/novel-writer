// ==============================
// 全书页面：主程序
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


    // 确保结构存在
    if (!currentBook.structure) {

        currentBook.structure = [];
    }


    renderBookTitle();

    setupEvents();

    updatePrefaceButton();

    renderTree();


    window.addEventListener(
        "resize",
        function() {

            renderTree();
        }
    );
}


// ==============================
// 返回书架
// ==============================

function goBack() {

    window.location.href =
        "index.html";
}


// ==============================
// 书名
// ==============================

function renderBookTitle() {

    const title =
        document.querySelector(
            "#bookTitle"
        );


    if (!title) {
        return;
    }


    title.textContent =
        currentBook.title ||
        "未命名书籍";
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
        return;
    }


    tree.innerHTML = "";


    if (svg) {
        svg.innerHTML = "";
    }


    // 删除旧的 + / -
    document
        .querySelectorAll(
            ".line-control"
        )
        .forEach(
            element =>
                element.remove()
        );


    // 没有结构
    if (
        !currentBook.structure ||
        !currentBook.structure.length
    ) {

        const hint =
            document.createElement(
                "div"
            );


        hint.className =
            "tree-empty";


        hint.textContent =
            "点击书名开始添加序、章、篇或卷";


        tree.appendChild(hint);


        restoreBookPosition();

        clearSelection();

        return;
    }


    // 自动布局
    const layout =
        calculateLayout();


    // 设置画布尺寸
    tree.style.width =
        Math.max(
            layout.width + 100,
            canvas.clientWidth
        ) + "px";


    tree.style.height =
        Math.max(
            layout.height + 200,
            canvas.clientHeight
        ) + "px";


    // 书名位置
    positionBookAutomatically(
        layout
    );


    // 创建节点
    layout.nodes.forEach(
        item => {

            const element =
                createNodeElement(
                    item.node
                );


            element.style.position =
                "absolute";


            element.style.left =
                item.x + "px";


            element.style.top =
                item.y + "px";


            tree.appendChild(
                element
            );
        }
    );


    // 等 DOM 真正完成布局以后画线
    requestAnimationFrame(
        function() {

            drawConnections(
                layout
            );


            restoreSelection();
        }
    );
}


// ==============================
// 书名自动位置
// ==============================

function positionBookAutomatically(
    layout
) {

    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    if (!bookTitle) {
        return;
    }


    // 用户已经手动移动过
    if (
        bookPosition.x !== null &&
        bookPosition.y !== null
    ) {

        bookTitle.style.left =
            bookPosition.x + "px";

        bookTitle.style.top =
            bookPosition.y + "px";

        return;
    }


    // 第一次自动放置
    const centerX =
        layout.width / 2;


    const bookWidth =
        bookTitle.offsetWidth || 170;


    const bookHeight =
        bookTitle.offsetHeight || 60;


    const x =
        centerX -
        bookWidth / 2;


    const y =
        25;


    bookTitle.style.left =
        x + "px";


    bookTitle.style.top =
        y + "px";
}


// ==============================
// 恢复书名位置
// ==============================

function restoreBookPosition() {

    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    if (!bookTitle) {
        return;
    }


    if (
        bookPosition.x !== null &&
        bookPosition.y !== null
    ) {

        bookTitle.style.left =
            bookPosition.x + "px";

        bookTitle.style.top =
            bookPosition.y + "px";
    }
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

        const exists =
            document.querySelector(
                `[data-node-id="${selectedNodeId}"]`
            );


        if (exists) {

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
