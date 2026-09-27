// ==============================
// 全书页面：事件处理
// ==============================


// ==================================================
// 通用：获取鼠标 / 触摸在画布中的位置
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


    // 触摸事件
    if (
        event.touches &&
        event.touches.length > 0
    ) {

        clientX =
            event.touches[0].clientX;

        clientY =
            event.touches[0].clientY;

    }

    // touchend 使用 changedTouches
    else if (
        event.changedTouches &&
        event.changedTouches.length > 0
    ) {

        clientX =
            event.changedTouches[0].clientX;

        clientY =
            event.changedTouches[0].clientY;

    }

    // 鼠标事件
    else {

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
// 显示 / 隐藏书籍操作栏
// ==================================================

function updateBookActions() {

    const actions =
        document.querySelector(
            "#bookActions"
        );

    if (!actions) {
        return;
    }


    if (
        selectedIsBook === true
    ) {

        actions.style.display =
            "flex";

        return;

    }


    actions.style.display =
        "none";
}


// ==================================================
// 更新所有节点的选中状态
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
                    id === selectedNodeId &&
                    !selectedIsBook
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
// 更新书名选中状态
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
// 统一刷新选择界面
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
// 选择结构节点
// ==================================================

function selectNode(nodeId) {

    if (
        !nodeId
    ) {

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
            `[data-node-id="${nodeId}"]`
        );


    updateSelectionUI();

}


// ==================================================
// 清除所有选择
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


    // 有结构时，书名由自动布局控制
    // 不允许手动拖动
    if (
        autoLayoutEnabled === true
    ) {

        selectBook();

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

    if (
        !draggingBook
    ) {

        return;

    }


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


    const moved =
        checkDragDistance(
            position.x,
            position.y
        );


    if (!moved) {

        return;

    }


    // 防止 iPhone 页面跟着手指滚动
    if (
        event.cancelable
    ) {

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


    // 最小边界
    newX =
        Math.max(
            0,
            newX
        );


    newY =
        Math.max(
            0,
            newY
        );


    // 不允许把书名拖到树画布之外
    const canvas =
        document.querySelector(
            ".tree-canvas"
        );


    if (canvas) {

        const bookWidth =
            bookTitle.offsetWidth;

        const bookHeight =
            bookTitle.offsetHeight;


        const maxX =
            Math.max(
                0,
                treeWidth -
                bookWidth
            );


        const maxY =
            Math.max(
                0,
                treeHeight -
                bookHeight
            );


        newX =
            Math.min(
                newX,
                maxX
            );


        newY =
            Math.min(
                newY,
                maxY
            );

    }


    bookTitle.style.left =
        newX + "px";

    bookTitle.style.top =
        newY + "px";


    setBookPosition(
        newX,
        newY
    );

}


// ==================================================
// 结束书名拖动
// ==================================================

function finishBookDrag(event) {

    if (
        !draggingBook
    ) {

        return;

    }


    endBookDrag();


    if (
        bookWasDragged
    ) {

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


    // 清理拖动状态
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
// 书名鼠标按下
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


// ==================================================
// 书名鼠标移动
// ==================================================

function handleBookMouseMove(event) {

    if (
        !draggingBook
    ) {

        return;

    }


    moveBookDrag(
        event
    );

}


// ==================================================
// 书名鼠标松开
// ==================================================

function handleBookMouseUp(event) {

    finishBookDrag(
        event
    );

}


// ==================================================
// 书名触摸开始
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


// ==================================================
// 书名触摸移动
// ==================================================

function handleBookTouchMove(event) {

    if (
        !touchStarted ||
        !draggingBook
    ) {

        return;

    }


    moveBookDrag(
        event
    );

}


// ==================================================
// 书名触摸结束
// ==================================================

function handleBookTouchEnd(event) {

    if (
        !touchStarted
    ) {

        return;

    }


    finishBookDrag(
        event
    );


    touchStarted =
        false;

}


// ==================================================
// 画布点击
// ==================================================

function handleCanvasClick(event) {

    if (
        actionButtonPressed
    ) {

        actionButtonPressed =
            false;

        return;

    }


    // 如果刚刚拖动了书名
    // 不把拖动结束当成空白点击
    if (
        bookWasDragged
    ) {

        bookWasDragged =
            false;

        return;

    }


    const target =
        event.target;


    // 点击书名
    if (
        target.closest &&
        target.closest(
            "#bookTitle"
        )
    ) {

        return;

    }


    // 点击结构框
    if (
        target.closest &&
        target.closest(
            ".node-box"
        )
    ) {

        return;

    }


    // 点击结构操作按钮
    if (
        target.closest &&
        target.closest(
            ".node-actions"
        )
    ) {

        return;

    }


    // 点击连线上的 +/- 按钮
    if (
        target.closest &&
        target.closest(
            ".line-control"
        )
    ) {

        return;

    }


    // 其他空白区域
    clearSelection();

}


// ==================================================
// 阻止操作按钮冒泡
// ==================================================

function handleActionButtonPointerDown(
    event
) {

    actionButtonPressed =
        true;

    event.stopPropagation();

}


// ==================================================
// 初始化事件
// ==================================================

function setupEvents() {

    if (
        bookEventsInitialized
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


    const bookActions =
        document.querySelector(
            "#bookActions"
        );


    if (!canvas) {

        console.warn(
            "找不到 .tree-canvas"
        );

        return;

    }


    if (!bookTitle) {

        console.warn(
            "找不到 #bookTitle"
        );

        return;

    }


    // ==================================================
    // 返回按钮
    // ==================================================

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


    // ==================================================
    // 书名：鼠标
    // ==================================================

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


    // ==================================================
    // 书名：iPhone 触摸
    // ==================================================

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


    // ==================================================
    // 画布点击
    // ==================================================

    canvas.addEventListener(
        "click",
        handleCanvasClick
    );


    // ==================================================
    // 操作栏
    // ==================================================

    if (bookActions) {

        bookActions.addEventListener(
            "pointerdown",
            handleActionButtonPointerDown
        );

        bookActions.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

            }
        );

    }


    // ==================================================
    // 设置事件已初始化
    // ==================================================

    bookEventsInitialized =
        true;

    bookPageInitialized =
        true;

}


// ==================================================
// 初始化
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
