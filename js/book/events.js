// ==============================
// 全书页面：事件
// ==============================


// ==================================================
// 获取指针位置
//
// 返回的是：
// 3000 × 3000 画布坐标
//
// 不是浏览器屏幕坐标。
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


    // ------------------------------------------
    // 触摸
    // ------------------------------------------

    if (
        event.touches &&
        event.touches.length > 0
    ) {

        clientX =
            event.touches[0].clientX;

        clientY =
            event.touches[0].clientY;

    }


    // ------------------------------------------
    // touchend / touchcancel
    // ------------------------------------------

    else if (
        event.changedTouches &&
        event.changedTouches.length > 0
    ) {

        clientX =
            event.changedTouches[0].clientX;

        clientY =
            event.changedTouches[0].clientY;

    }


    // ------------------------------------------
    // 鼠标 / Pointer
    // ------------------------------------------

    else {

        clientX =
            event.clientX || 0;

        clientY =
            event.clientY || 0;

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


    // ------------------------------------------
    // 没有选择
    // ------------------------------------------

    if (
        !selectedIsBook &&
        !selectedNodeId
    ) {

        actions.style.display =
            "none";

        return;

    }


    // ------------------------------------------
    // 选择书名
    // ------------------------------------------

    if (selectedIsBook) {

        actions.style.display =
            "flex";


        createBookActionButtons(
            actions
        );


        return;

    }


    // ------------------------------------------
    // 选择节点
    // ------------------------------------------

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

    // ------------------------------------------
    // 删除
    // ------------------------------------------

    addBottomButton(
        container,
        "删除",
        function() {

            deleteNode(
                node.id
            );

        },
        "danger"
    );


    // ------------------------------------------
    // 卷
    // ------------------------------------------

    if (
        node.type ===
        NODE_TYPES.VOLUME
    ) {

        addBottomButton(
            container,
            "＋同级",
            function() {

                addSameLevel(
                    node.id
                );

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


    // ------------------------------------------
    // 篇
    // ------------------------------------------

    if (
        node.type ===
        NODE_TYPES.PART
    ) {

        addBottomButton(
            container,
            "＋同级",
            function() {

                addSameLevel(
                    node.id
                );

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


    // ------------------------------------------
    // 章
    //
    // 目前只有删除。
    // ------------------------------------------


    // ------------------------------------------
    // 序
    //
    // 目前只有删除。
    // ------------------------------------------

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


    if (type) {

        button.classList.add(
            type
        );

    }


    button.textContent =
        text;


    applyBottomButtonStyle(
        button,
        type,
        text
    );


    // ------------------------------------------
    // 按下
    // ------------------------------------------

    button.addEventListener(
        "pointerdown",
        function(event) {

            event.stopPropagation();

            actionButtonPressed =
                true;

        }
    );


    // ------------------------------------------
    // 点击
    // ------------------------------------------

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
// ==================================================

function applyBottomButtonStyle(
    button,
    type,
    text
) {

    if (!button) {

        return;

    }


    // ------------------------------------------
    // ＋序
    // ------------------------------------------

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


    // ------------------------------------------
    // ＋章
    // ------------------------------------------

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


    // ------------------------------------------
    // ＋篇
    // ------------------------------------------

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


    // ------------------------------------------
    // ＋卷
    // ------------------------------------------

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


    // ------------------------------------------
    // 普通
    // ------------------------------------------

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


    // ------------------------------------------
    // 删除
    // ------------------------------------------

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
        getNodeById(
            nodeId
        );


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
//
// 非常重要：
//
// dragStartX / dragStartY
// = 鼠标/手指按下时的“画布坐标”
//
// dragOriginalX / dragOriginalY
// = 书名按下时的“左上角坐标”
//
// 两者不能混在一起。
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


    // ------------------------------------------
    // 当前书名坐标
    // ------------------------------------------

    let currentX =
        parseFloat(
            bookTitle.style.left
        );


    let currentY =
        parseFloat(
            bookTitle.style.top
        );


    // ------------------------------------------
    // 如果 DOM 没有位置
    // 从保存的位置读取
    // ------------------------------------------

    if (
        !Number.isFinite(
            currentX
        ) &&
        hasSavedBookPosition()
    ) {

        currentX =
            Number(
                bookPosition.x
            );

    }


    if (
        !Number.isFinite(
            currentY
        ) &&
        hasSavedBookPosition()
    ) {

        currentY =
            Number(
                bookPosition.y
            );

    }


    // ------------------------------------------
    // 如果仍然没有位置
    // 使用 3000 × 3000 中心
    // ------------------------------------------

    const bookWidth =
        bookTitle.offsetWidth ||
        BOOK_MIN_WIDTH;


    const bookHeight =
        bookTitle.offsetHeight ||
        BOOK_MIN_HEIGHT;


    if (
        !Number.isFinite(
            currentX
        )
    ) {

        currentX =
            1500 -
            bookWidth / 2;

    }


    if (
        !Number.isFinite(
            currentY
        )
    ) {

        currentY =
            1500 -
            bookHeight / 2;

    }


    // ------------------------------------------
    // 指针开始位置
    //
    // 这里一定保存 pointer。
    // ------------------------------------------

    dragStartX =
        position.x;


    dragStartY =
        position.y;


    // ------------------------------------------
    // 书名开始位置
    //
    // 这里保存 book。
    // ------------------------------------------

    dragOriginalX =
        currentX;


    dragOriginalY =
        currentY;


    // ------------------------------------------
    // 重置拖动状态
    // ------------------------------------------

    bookWasDragged =
        false;


    bookMoveStarted =
        false;


    // ------------------------------------------
    // 确保 DOM 使用正确位置
    // ------------------------------------------

    bookTitle.style.left =
        currentX + "px";


    bookTitle.style.top =
        currentY + "px";


    setBookPosition(
        currentX,
        currentY
    );


    // ------------------------------------------
    // 开始拖动
    // ------------------------------------------

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


    // ------------------------------------------
    // 判断是否真正开始移动
    // ------------------------------------------

    const moved =
        checkDragDistance(
            position.x,
            position.y
        );


    if (!moved) {

        return;

    }


    if (
        event.cancelable
    ) {

        event.preventDefault();

    }


    // ------------------------------------------
    // 指针移动距离
    //
    // 注意：
    // dragStartX/Y 是指针起点。
    // ------------------------------------------

    const dx =
        position.x -
        dragStartX;


    const dy =
        position.y -
        dragStartY;


    // ------------------------------------------
    // 书名新位置
    // ------------------------------------------

    let newX =
        dragOriginalX +
        dx;


    let newY =
        dragOriginalY +
        dy;


    // ------------------------------------------
    // 书名尺寸
    // ------------------------------------------

    const bookWidth =
        bookTitle.offsetWidth ||
        BOOK_MIN_WIDTH;


    const bookHeight =
        bookTitle.offsetHeight ||
        BOOK_MIN_HEIGHT;


    // ------------------------------------------
    // 3000 × 3000 画布
    // ------------------------------------------

    const canvasWidth =
        Math.max(
            3000,
            canvas.scrollWidth,
            canvas.clientWidth
        );


    const canvasHeight =
        Math.max(
            3000,
            canvas.scrollHeight,
            canvas.clientHeight
        );


    // ------------------------------------------
    // 限制书名不能拖出画布
    // ------------------------------------------

    const maxX =
        Math.max(
            0,
            canvasWidth -
            bookWidth
        );


    const maxY =
        Math.max(
            0,
            canvasHeight -
            bookHeight
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


    // ------------------------------------------
    // 写入 DOM
    // ------------------------------------------

    bookTitle.style.left =
        newX + "px";


    bookTitle.style.top =
        newY + "px";


    // ------------------------------------------
    // 保存状态
    // ------------------------------------------

    setBookPosition(
        newX,
        newY
    );


    bookWasDragged =
        true;


    bookMoveStarted =
        true;


    // ------------------------------------------
    // 更新树
    //
    // 书名移动后，
    // 树跟着书名重新计算。
    // ------------------------------------------

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
        !bookTitle
    ) {

        return;

    }


    // ------------------------------------------
    // 重新计算布局
    // ------------------------------------------

    const newLayout =
        calculateLayout();


    if (!newLayout) {

        return;

    }


    currentLayout =
        newLayout;


    // ------------------------------------------
    // 更新树尺寸
    // ------------------------------------------

    const tree =
        document.querySelector(
            "#tree"
        );


    if (tree) {

        tree.style.width =
            Math.max(
                3000,
                newLayout.width,
                canvas.clientWidth
            ) + "px";


        tree.style.height =
            Math.max(
                3000,
                newLayout.height,
                canvas.clientHeight
            ) + "px";

    }


    // ------------------------------------------
    // 更新节点位置
    // ------------------------------------------

    if (
        Array.isArray(
            newLayout.nodes
        )
    ) {

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

    }


    // ------------------------------------------
    // 更新 SVG
    // ------------------------------------------

    const svg =
        document.querySelector(
            "#connections"
        );


    if (svg) {

        const width =
            Math.max(
                3000,
                newLayout.width,
                canvas.clientWidth
            );


        const height =
            Math.max(
                3000,
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


    // ------------------------------------------
    // 重画连接线
    // ------------------------------------------

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


    // ------------------------------------------
    // 真正发生拖动
    // 才保存位置
    // ------------------------------------------

    if (wasDragged) {

        const bookTitle =
            document.querySelector(
                "#bookTitle"
            );


        if (bookTitle) {

            const x =
                parseFloat(
                    bookTitle.style.left
                );


            const y =
                parseFloat(
                    bookTitle.style.top
                );


            if (
                Number.isFinite(x) &&
                Number.isFinite(y)
            ) {

                setBookPosition(
                    x,
                    y
                );

            }

        }


        // 保存书籍

        if (
            typeof saveBook ===
            "function"
        ) {

            saveBook();

        }

    }


    // ------------------------------------------
    // 重置拖动状态
    // ------------------------------------------

    touchStarted =
        false;


    bookMoveStarted =
        false;


    dragStartX =
        0;


    dragStartY =
        0;


    dragOriginalX =
        0;


    dragOriginalY =
        0;

}


// ==================================================
// 鼠标按下
// ==================================================

function handleBookMouseDown(event) {

    if (
        event.button !== undefined &&
        event.button !== 0
    ) {

        return;

    }


    event.preventDefault();

    event.stopPropagation();


    selectBook();


    startBookDrag(
        event
    );

}


// ==================================================
// 鼠标移动
// ==================================================

function handleBookMouseMove(event) {

    if (!draggingBook) {

        return;

    }


    moveBookDrag(
        event
    );

}


// ==================================================
// 鼠标松开
// ==================================================

function handleBookMouseUp(event) {

    finishBookDrag(
        event
    );

}


// ==================================================
// 手机触摸开始
// ==================================================

function handleBookTouchStart(event) {

    if (
        !event.touches ||
        event.touches.length === 0
    ) {

        return;

    }


    event.preventDefault();

    event.stopPropagation();


    touchStarted =
        true;


    selectBook();


    startBookDrag(
        event
    );

}


// ==================================================
// 手机触摸移动
// ==================================================

function handleBookTouchMove(event) {

    if (
        !touchStarted ||
        !draggingBook
    ) {

        return;

    }


    if (
        event.cancelable
    ) {

        event.preventDefault();

    }


    moveBookDrag(
        event
    );

}


// ==================================================
// 手机触摸结束
// ==================================================

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
// 点击画布空白
// ==================================================

function handleCanvasClick(event) {

    // ------------------------------------------
    // 操作按钮
    // ------------------------------------------

    if (actionButtonPressed) {

        actionButtonPressed =
            false;

        return;

    }


    // ------------------------------------------
    // 刚刚拖动过书名
    //
    // 防止拖动结束后又触发一次“空白点击”。
    // ------------------------------------------

    if (bookWasDragged) {

        bookWasDragged =
            false;

        return;

    }


    const target =
        event.target;


    // ------------------------------------------
    // 书名
    // ------------------------------------------

    if (
        target.closest &&
        target.closest(
            "#bookTitle"
        )
    ) {

        return;

    }


    // ------------------------------------------
    // 节点
    // ------------------------------------------

    if (
        target.closest &&
        target.closest(
            ".node-box"
        )
    ) {

        return;

    }


    // ------------------------------------------
    // 连线控制
    // ------------------------------------------

    if (
        target.closest &&
        target.closest(
            ".line-control"
        )
    ) {

        return;

    }


    // ------------------------------------------
    // 底部操作栏
    // ------------------------------------------

    if (
        target.closest &&
        target.closest(
            "#bookActions"
        )
    ) {

        return;

    }


    // ------------------------------------------
    // 空白
    // ------------------------------------------

    clearSelection();

}


// ==================================================
// 初始化事件
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


                if (
                    typeof saveBook ===
                    "function"
                ) {

                    saveBook();

                }


                if (
                    typeof goBack ===
                    "function"
                ) {

                    goBack();

                }

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
    // 手机触摸拖动
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
    // 点击空白
    // ==========================================

    canvas.addEventListener(
        "click",
        handleCanvasClick
    );


    // ==========================================
    // 操作栏
    // ==========================================

    if (bookActions) {

        bookActions.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

            }
        );

    }


    // ==========================================
    // 初始化完成
    // ==========================================

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
