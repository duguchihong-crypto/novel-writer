// ==============================
// 全书页面：事件
// ==============================


// ==================================================
// 获取指针位置
// ==================================================

function getPointerPosition(event) {

    const canvas =
        document.querySelector(
            ".tree-canvas"
        );

    if (!canvas) {
        return {
            x: 0,
            y: 0
        };
    }


    let clientX = 0;
    let clientY = 0;


    if (
        event.touches &&
        event.touches.length > 0
    ) {

        clientX =
            event.touches[0].clientX;

        clientY =
            event.touches[0].clientY;

    } else if (
        event.changedTouches &&
        event.changedTouches.length > 0
    ) {

        clientX =
            event.changedTouches[0].clientX;

        clientY =
            event.changedTouches[0].clientY;

    } else {

        clientX =
            event.clientX;

        clientY =
            event.clientY;
    }


    const rect =
        canvas.getBoundingClientRect();


    return {
        x:
            clientX -
            rect.left +
            canvas.scrollLeft,

        y:
            clientY -
            rect.top +
            canvas.scrollTop
    };
}


// ==================================================
// 底部操作栏
// ==================================================

function updateBookActions() {

    const actions =
        document.querySelector(
            "#bookActions"
        );


    if (!actions) {
        return;
    }


    actions.innerHTML = "";


    // ==========================================
    // 没有选择
    // ==========================================

    if (
        !selectedIsBook &&
        !selectedNodeId
    ) {

        actions.style.display =
            "none";

        return;
    }


    // ==========================================
    // 选择书名
    // ==========================================

    if (selectedIsBook) {

        actions.style.display =
            "flex";


        createBookActionButtons(
            actions
        );


        return;
    }


    // ==========================================
    // 选择节点
    // ==========================================

    const node =
        getSelectedNode();


    if (!node) {

        actions.style.display =
            "none";

        return;
    }


    actions.style.display =
        "flex";


    createNodeActionButtons(
        actions,
        node
    );
}


// ==================================================
// 书名底部按钮
// ==================================================

function createBookActionButtons(
    container
) {

    // ＋序
    addBottomButton(
        container,
        "＋序",
        function() {
            addRootPreface();
        },
        "preface"
    );


    // ＋章
    addBottomButton(
        container,
        "＋章",
        function() {
            addRootChapter();
        },
        "chapter"
    );


    // ＋篇
    addBottomButton(
        container,
        "＋篇",
        function() {
            addRootPart();
        },
        "part"
    );


    // ＋卷
    addBottomButton(
        container,
        "＋卷",
        function() {
            addRootVolume();
        },
        "volume"
    );


    updatePrefaceButton();
}


// ==================================================
// 节点底部按钮
// ==================================================

function createNodeActionButtons(
    container,
    node
) {

    // ==========================================
    // 删除
    // ==========================================

    addBottomButton(
        container,
        "删除",
        function() {
            deleteNode(node.id);
        },
        "danger"
    );


    // ==========================================
    // 卷
    // ==========================================

    if (
        node.type ===
        NODE_TYPES.VOLUME
    ) {

        addBottomButton(
            container,
            "＋同级",
            function() {
                addSameLevel(node.id);
            },
            "default"
        );


        addBottomButton(
            container,
            "＋篇",
            function() {
                addChild(
                    node.id,
                    NODE_TYPES.PART
                );
            },
            "part"
        );


        addBottomButton(
            container,
            "＋章",
            function() {
                addChild(
                    node.id,
                    NODE_TYPES.CHAPTER
                );
            },
            "chapter"
        );
    }


    // ==========================================
    // 篇
    // ==========================================

    if (
        node.type ===
        NODE_TYPES.PART
    ) {

        addBottomButton(
            container,
            "＋同级",
            function() {
                addSameLevel(node.id);
            },
            "default"
        );


        addBottomButton(
            container,
            "＋章",
            function() {
                addChild(
                    node.id,
                    NODE_TYPES.CHAPTER
                );
            },
            "chapter"
        );
    }


    // ==========================================
    // 章
    //
    // 只有删除
    // ==========================================


    // ==========================================
    // 序
    //
    // 只有删除
    // ==========================================
}


// ==================================================
// 创建底部按钮
// ==================================================

function addBottomButton(
    container,
    text,
    callback,
    type = ""
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "book-action-button";


    // ==========================================
    // 按钮类型
    // ==========================================

    if (type) {

        button.classList.add(
            type
        );
    }


    button.textContent =
        text;


    // ==========================================
    // 根据按钮类型设置颜色
    // ==========================================

    applyBottomButtonStyle(
        button,
        type,
        text
    );


    // ==========================================
    // 按下
    // ==========================================

    button.addEventListener(
        "pointerdown",
        function(event) {

            event.stopPropagation();


            actionButtonPressed =
                true;
        }
    );


    // ==========================================
    // 点击
    // ==========================================

    button.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            actionButtonPressed =
                false;


            if (
                typeof callback ===
                "function"
            ) {

                callback();
            }
        }
    );


    container.appendChild(
        button
    );
}


// ==================================================
// 底部按钮颜色
//
// ＋序 → 浅青
// ＋章 → 浅黑
// ＋篇 → 浅白
// ＋卷 → 浅黄
// ==================================================

function applyBottomButtonStyle(
    button,
    type,
    text
) {

    if (!button) {
        return;
    }


    // ==========================================
    // ＋序
    // ==========================================

    if (
        type === "preface" ||
        text === "＋序"
    ) {

        button.style.setProperty(
            "background-color",
            "#f3fbfa",
            "important"
        );


        button.style.setProperty(
            "border",
            "1.5px solid #b7dfdc",
            "important"
        );


        button.style.setProperty(
            "color",
            "#5fa9a3",
            "important"
        );


        return;
    }


    // ==========================================
    // ＋章
    // ==========================================

    if (
        type === "chapter" ||
        text === "＋章"
    ) {

        button.style.setProperty(
            "background-color",
            "#f7f7f7",
            "important"
        );


        button.style.setProperty(
            "border",
            "1.5px solid #c8c8c8",
            "important"
        );


        button.style.setProperty(
            "color",
            "#777777",
            "important"
        );


        return;
    }


    // ==========================================
    // ＋篇
    // ==========================================

    if (
        type === "part" ||
        text === "＋篇"
    ) {

        button.style.setProperty(
            "background-color",
            "#ffffff",
            "important"
        );


        button.style.setProperty(
            "border",
            "1.5px solid #dedede",
            "important"
        );


        button.style.setProperty(
            "color",
            "#999999",
            "important"
        );


        return;
    }


    // ==========================================
    // ＋卷
    // ==========================================

    if (
        type === "volume" ||
        text === "＋卷"
    ) {

        button.style.setProperty(
            "background-color",
            "#fffdf3",
            "important"
        );


        button.style.setProperty(
            "border",
            "1.5px solid #eadf9e",
            "important"
        );


        button.style.setProperty(
            "color",
            "#c8ae55",
            "important"
        );


        return;
    }


    // ==========================================
    // 普通按钮
    // ==========================================

    if (
        type === "default"
    ) {

        button.style.setProperty(
            "background-color",
            "#ffffff",
            "important"
        );


        button.style.setProperty(
            "border",
            "1px solid #dddddd",
            "important"
        );


        button.style.setProperty(
            "color",
            "#666666",
            "important"
        );


        return;
    }


    // ==========================================
    // 删除按钮
    // ==========================================

    if (
        type === "danger"
    ) {

        button.style.setProperty(
            "background-color",
            "#fff5f5",
            "important"
        );


        button.style.setProperty(
            "border",
            "1px solid #efcccc",
            "important"
        );


        button.style.setProperty(
            "color",
            "#d66a6a",
            "important"
        );
    }
}


// ==================================================
// 节点选择 UI
// ==================================================

function updateNodeSelectionUI() {

    document
        .querySelectorAll(
            ".tree-node"
        )
        .forEach(
            element => {

                const id =
                    element.dataset.nodeId;


                if (
                    selectedNodeId &&
                    String(id) ===
                    String(selectedNodeId) &&
                    selectedIsBook === false
                ) {

                    element.classList.add(
                        "selected"
                    );

                } else {

                    element.classList.remove(
                        "selected"
                    );
                }
            }
        );
}


// ==================================================
// 书名选择 UI
// ==================================================

function updateBookSelectionUI() {

    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    if (!bookTitle) {
        return;
    }


    if (
        selectedIsBook === true
    ) {

        bookTitle.classList.add(
            "selected"
        );

    } else {

        bookTitle.classList.remove(
            "selected"
        );
    }
}


// ==================================================
// 总选择 UI
// ==================================================

function updateSelectionUI() {

    updateNodeSelectionUI();

    updateBookSelectionUI();

    updateBookActions();
}


// ==================================================
// 选择书名
// ==================================================

function selectBook() {

    setSelectedBook();

    updateSelectionUI();
}


// ==================================================
// 选择节点
// ==================================================

function selectNode(nodeId) {

    if (!nodeId) {

        clearSelection();

        return;
    }


    const node =
        getNodeById(nodeId);


    if (!node) {

        clearSelection();

        return;
    }


    setSelectedNode(
        nodeId
    );


    selectedElement =
        document.querySelector(
            `.tree-node[data-node-id="${nodeId}"]`
        );


    updateSelectionUI();


    if (selectedElement) {

        selectedElement.classList.add(
            "selected"
        );
    }
}


// ==================================================
// 清除选择
// ==================================================

function clearSelection() {

    resetSelectionState();

    updateSelectionUI();
}


// ==================================================
// 开始拖动书名
// ==================================================

function startBookDrag(event) {

    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    if (!bookTitle) {
        return;
    }


    const position =
        getPointerPosition(
            event
        );


    const currentX =
        parseFloat(
            bookTitle.style.left
        ) || 0;


    const currentY =
        parseFloat(
            bookTitle.style.top
        ) || 0;


    dragStartX =
        position.x;


    dragStartY =
        position.y;


    dragOriginalX =
        currentX;


    dragOriginalY =
        currentY;


    bookWasDragged =
        false;


    bookMoveStarted =
        false;


    beginBookDrag();
}


// ==================================================
// 移动书名
// ==================================================

function moveBookDrag(event) {

    if (!draggingBook) {
        return;
    }


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


    const position =
        getPointerPosition(
            event
        );


    const moved =
        checkDragDistance(
            position.x,
            position.y
        );


    if (!moved) {
        return;
    }


    if (event.cancelable) {
        event.preventDefault();
    }


    const dx =
        position.x -
        dragStartX;


    const dy =
        position.y -
        dragStartY;


    let newX =
        dragOriginalX +
        dx;


    let newY =
        dragOriginalY +
        dy;


    const bookWidth =
        bookTitle.offsetWidth ||
        BOOK_MIN_WIDTH;


    const bookHeight =
        bookTitle.offsetHeight ||
        BOOK_MIN_HEIGHT;


    const availableWidth =
        Math.max(
            canvas.clientWidth,
            canvas.scrollWidth,
            window.innerWidth
        );


    const availableHeight =
        Math.max(
            canvas.clientHeight,
            canvas.scrollHeight,
            window.innerHeight
        );


    const maxX =
        Math.max(
            0,
            availableWidth -
            bookWidth -
            10
        );


    const maxY =
        Math.max(
            0,
            availableHeight -
            bookHeight -
            10
        );


    newX =
        Math.max(
            0,
            Math.min(
                newX,
                maxX
            )
        );


    newY =
        Math.max(
            0,
            Math.min(
                newY,
                maxY
            )
        );


    bookTitle.style.left =
        newX + "px";


    bookTitle.style.top =
        newY + "px";


    setBookPosition(
        newX,
        newY
    );


    updateTreePositionFromBook();
}


// ==================================================
// 根据书名当前位置更新树
// ==================================================

function updateTreePositionFromBook() {

    if (
        !hasStructure ||
        !currentBook
    ) {
        return;
    }


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
        !bookTitle ||
        !currentLayout
    ) {
        return;
    }


    const newLayout =
        calculateLayout();


    currentLayout =
        newLayout;


    const tree =
        document.querySelector(
            "#tree"
        );


    if (tree) {

        tree.style.width =
            Math.max(
                newLayout.width,
                canvas.clientWidth
            ) + "px";


        tree.style.height =
            Math.max(
                newLayout.height,
                canvas.clientHeight
            ) + "px";
    }


    newLayout.nodes.forEach(
        item => {

            const element =
                document.querySelector(
                    `.tree-node[data-node-id="${item.node.id}"]`
                );


            if (!element) {
                return;
            }


            element.style.left =
                item.x + "px";


            element.style.top =
                item.y + "px";
        }
    );


    const svg =
        document.querySelector(
            "#connections"
        );


    if (svg) {

        const width =
            Math.max(
                newLayout.width,
                canvas.clientWidth
            );


        const height =
            Math.max(
                newLayout.height,
                canvas.clientHeight
            );


        svg.setAttribute(
            "width",
            width
        );


        svg.setAttribute(
            "height",
            height
        );


        svg.setAttribute(
            "viewBox",
            `0 0 ${width} ${height}`
        );
    }


    drawConnections(
        newLayout
    );
}


// ==================================================
// 结束拖动
// ==================================================

function finishBookDrag(event) {

    if (!draggingBook) {
        return;
    }


    const wasDragged =
        bookWasDragged;


    endBookDrag();


    if (wasDragged) {

        const bookTitle =
            document.querySelector(
                "#bookTitle"
            );


        if (bookTitle) {

            const x =
                parseFloat(
                    bookTitle.style.left
                ) || 0;


            const y =
                parseFloat(
                    bookTitle.style.top
                ) || 0;


            setBookPosition(
                x,
                y
            );
        }


        saveBook();
    }


    touchStarted =
        false;


    bookMoveStarted =
        false;


    dragStartX =
        0;


    dragStartY =
        0;
}


// ==================================================
// 鼠标
// ==================================================

function handleBookMouseDown(event) {

    if (
        event.button !== undefined &&
        event.button !== 0
    ) {
        return;
    }


    event.preventDefault();


    selectBook();


    startBookDrag(
        event
    );
}


function handleBookMouseMove(event) {

    if (!draggingBook) {
        return;
    }


    moveBookDrag(
        event
    );
}


function handleBookMouseUp(event) {

    finishBookDrag(
        event
    );
}


// ==================================================
// 手机
// ==================================================

function handleBookTouchStart(event) {

    if (
        !event.touches ||
        event.touches.length === 0
    ) {
        return;
    }


    event.preventDefault();


    touchStarted =
        true;


    selectBook();


    startBookDrag(
        event
    );
}


function handleBookTouchMove(event) {

    if (
        !touchStarted ||
        !draggingBook
    ) {
        return;
    }


    if (event.cancelable) {
        event.preventDefault();
    }


    moveBookDrag(
        event
    );
}


function handleBookTouchEnd(event) {

    if (!touchStarted) {
        return;
    }


    finishBookDrag(
        event
    );


    touchStarted =
        false;
}


// ==================================================
// 点击空白
// ==================================================

function handleCanvasClick(event) {

    if (actionButtonPressed) {

        actionButtonPressed =
            false;

        return;
    }


    if (bookWasDragged) {

        bookWasDragged =
            false;

        return;
    }


    const target =
        event.target;


    if (
        target.closest &&
        target.closest("#bookTitle")
    ) {
        return;
    }


    if (
        target.closest &&
        target.closest(".node-box")
    ) {
        return;
    }


    if (
        target.closest &&
        target.closest(".line-control")
    ) {
        return;
    }


    if (
        target.closest &&
        target.closest("#bookActions")
    ) {
        return;
    }


    clearSelection();
}


// ==================================================
// 初始化
// ==================================================

function setupEvents() {

    if (bookEventsInitialized) {
        return;
    }


    const canvas =
        document.querySelector(
            ".tree-canvas"
        );


    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    const bookActions =
        document.querySelector(
            "#bookActions"
        );


    if (
        !canvas ||
        !bookTitle
    ) {

        console.warn(
            "全书页面事件初始化失败"
        );

        return;
    }


    // ==========================================
    // 返回
    // ==========================================

    const backButton =
        document.querySelector(
            "#backButton"
        );


    if (backButton) {

        backButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();


                saveBook();

                goBack();
            }
        );
    }


    // ==========================================
    // 书名鼠标拖动
    // ==========================================

    bookTitle.addEventListener(
        "mousedown",
        handleBookMouseDown
    );


    document.addEventListener(
        "mousemove",
        handleBookMouseMove
    );


    document.addEventListener(
        "mouseup",
        handleBookMouseUp
    );


    // ==========================================
    // 手机拖动
    // ==========================================

    bookTitle.addEventListener(
        "touchstart",
        handleBookTouchStart,
        {
            passive: false
        }
    );


    document.addEventListener(
        "touchmove",
        handleBookTouchMove,
        {
            passive: false
        }
    );


    document.addEventListener(
        "touchend",
        handleBookTouchEnd,
        {
            passive: false
        }
    );


    document.addEventListener(
        "touchcancel",
        handleBookTouchEnd,
        {
            passive: false
        }
    );


    // ==========================================
    // 空白点击
    // ==========================================

    canvas.addEventListener(
        "click",
        handleCanvasClick
    );


    // ==========================================
    // 底部操作栏
    // ==========================================

    if (bookActions) {

        bookActions.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();
            }
        );
    }


    bookEventsInitialized =
        true;


    bookPageInitialized =
        true;
}


// ==================================================
// 页面初始化
// ==================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        setupEvents
    );

} else {

    setupEvents();
}
