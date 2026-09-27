// ==============================
// 全书页面：事件
// ==============================


// ==================================================
// 获取指针在画布中的坐标
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
// 书名底部操作栏
// ==================================================

function updateBookActions() {

    const actions =
        document.querySelector(
            "#bookActions"
        );


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
// 节点选择 UI
// ==================================================

function updateNodeSelectionUI() {

    document
        .querySelectorAll(".tree-node")
        .forEach(element => {

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

        });
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
// 更新全部选择状态
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


    // 保存当前选择

    setSelectedNode(
        nodeId
    );


    // 找到节点 DOM

    selectedElement =
        document.querySelector(
            `.tree-node[data-node-id="${nodeId}"]`
        );


    // 更新选择状态

    updateSelectionUI();


    // 确保操作栏显示

    if (selectedElement) {

        selectedElement.classList.add(
            "selected"
        );


        const actions =
            selectedElement.querySelector(
                ".node-actions"
            );


        if (actions) {

            actions.style.display =
                "flex";
        }
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


    // 有结构以后书名不能拖动

    if (
        autoLayoutEnabled === true
    ) {

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
}


// ==================================================
// 结束书名拖动
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
// 鼠标：书名
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


function handleBookMouseMove(event) {

    if (!draggingBook) {
        return;
    }


    moveBookDrag(event);
}


function handleBookMouseUp(event) {

    finishBookDrag(event);
}


// ==================================================
// 手机：书名
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


function handleBookTouchEnd(event) {

    if (!touchStarted) {
        return;
    }


    finishBookDrag(event);

    touchStarted =
        false;
}


// ==================================================
// 画布点击空白
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
        target.closest(".node-actions")
    ) {
        return;
    }


    if (
        target.closest &&
        target.closest(".line-control")
    ) {
        return;
    }


    clearSelection();
}


// ==================================================
// 操作按钮
// ==================================================

function handleActionButtonPointerDown(event) {

    actionButtonPressed =
        true;

    event.stopPropagation();
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


    if (!canvas || !bookTitle) {

        console.warn(
            "全书页面事件初始化失败"
        );

        return;
    }


    // 返回

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


    // 书名鼠标

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


    // 书名手机

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


    // 画布空白

    canvas.addEventListener(
        "click",
        handleCanvasClick
    );


    // 书名底部按钮

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
// 启动
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
