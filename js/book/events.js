// ==============================
// 全书页面：事件处理
// ==============================


// ==================================================
// 获取手指 / 鼠标在画布中的位置
// ==================================================

function getPointerPosition(event) {

    const canvas =
        document.querySelector(".tree-canvas");

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
// 更新书籍操作栏
// ==================================================

function updateBookActions() {

    const actions =
        document.querySelector("#bookActions");

    if (!actions) {
        return;
    }

    if (selectedIsBook === true) {

        actions.style.display =
            "flex";

    } else {

        actions.style.display =
            "none";
    }
}


// ==================================================
// 更新节点选择状态
// ==================================================

function updateNodeSelectionUI() {

    document
        .querySelectorAll(".tree-node")
        .forEach(element => {

            const id =
                element.dataset.nodeId;

            if (
                selectedNodeId &&
                id === selectedNodeId &&
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
        });
}


// ==================================================
// 更新书名选择状态
// ==================================================

function updateBookSelectionUI() {

    const bookTitle =
        document.querySelector("#bookTitle");

    if (!bookTitle) {
        return;
    }

    if (selectedIsBook === true) {

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
// 更新全部选择 UI
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

    setSelectedNode(nodeId);

    selectedElement =
        document.querySelector(
            `[data-node-id="${nodeId}"]`
        );

    updateSelectionUI();
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
        document.querySelector("#bookTitle");

    if (!bookTitle) {
        return;
    }


    // 有结构以后进入自动布局
    // 不允许手动移动书名
    if (autoLayoutEnabled === true) {

        selectBook();

        return;
    }


    const position =
        getPointerPosition(event);


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
        document.querySelector("#bookTitle");

    const canvas =
        document.querySelector(".tree-canvas");

    if (
        !bookTitle ||
        !canvas
    ) {
        return;
    }


    const position =
        getPointerPosition(event);


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


    // ==========================================
    // 关键修复：
    // 没有结构时不能使用 treeWidth/treeHeight
    // 因为它们此时可能还是 0
    // ==========================================

    const bookWidth =
        bookTitle.offsetWidth || 180;

    const bookHeight =
        bookTitle.offsetHeight || 58;


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

    selectBook();

    startBookDrag(event);
}


// ==================================================
// 鼠标移动
// ==================================================

function handleBookMouseMove(event) {

    if (!draggingBook) {
        return;
    }

    moveBookDrag(event);
}


// ==================================================
// 鼠标松开
// ==================================================

function handleBookMouseUp(event) {

    finishBookDrag(event);
}


// ==================================================
// 手机手指按下
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


    startBookDrag(event);
}


// ==================================================
// 手机手指移动
// ==================================================

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


    moveBookDrag(event);
}


// ==================================================
// 手机手指抬起
// ==================================================

function handleBookTouchEnd(event) {

    if (!touchStarted) {
        return;
    }


    finishBookDrag(event);


    touchStarted =
        false;
}


// ==================================================
// 点击画布空白
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


    // 书名
    if (
        target.closest &&
        target.closest("#bookTitle")
    ) {
        return;
    }


    // 节点
    if (
        target.closest &&
        target.closest(".node-box")
    ) {
        return;
    }


    // 节点按钮
    if (
        target.closest &&
        target.closest(".node-actions")
    ) {
        return;
    }


    // 连线按钮
    if (
        target.closest &&
        target.closest(".line-control")
    ) {
        return;
    }


    // 空白
    clearSelection();
}


// ==================================================
// 操作按钮按下
// ==================================================

function handleActionButtonPointerDown(event) {

    actionButtonPressed =
        true;

    event.stopPropagation();
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
    // 书名
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


    bookEventsInitialized =
        true;

    bookPageInitialized =
        true;
}


// ==================================================
// 页面加载
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
