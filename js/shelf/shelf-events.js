/* ==================================================
   书架事件
================================================== */


/* ==================================================
   页面元素
================================================== */

const createButton =
    document.getElementById("createButton");

const settingsButton =
    document.getElementById("settingsButton");

const finishSortButton =
    document.getElementById("finishSortButton");

const createBookButton =
    document.getElementById("createBookButton");

const createCollectionButton =
    document.getElementById("createCollectionButton");

const sortBooksButton =
    document.getElementById("sortBooksButton");

const gridButton =
    document.getElementById("gridButton");

const listButton =
    document.getElementById("listButton");

const bookGrid =
    document.getElementById("bookGrid");

const bookMenuOverlay =
    document.getElementById("bookMenuOverlay");

const bookContextMenu =
    document.getElementById("bookContextMenu");

const contextMenuTitle =
    document.getElementById("contextMenuTitle");

const contextEdit =
    document.getElementById("contextEdit");

const contextSort =
    document.getElementById("contextSort");

const contextGroup =
    document.getElementById("contextGroup");

const contextDelete =
    document.getElementById("contextDelete");

const shelfNav =
    document.getElementById("shelfNav");

const toolsNav =
    document.getElementById("toolsNav");

const meNav =
    document.getElementById("meNav");


/* ==================================================
   手机排序状态
================================================== */

let sortingPressTimer = null;

let sortingDraggedCard = null;

let sortingPlaceholder = null;

let sortingDragging = false;

let sortingPointerId = null;

let sortingStartX = 0;

let sortingStartY = 0;


/* ==================================================
   初始化
================================================== */

function initShelf() {

    if (typeof loadBooks === "function") {
        loadBooks();
    }

    if (typeof loadShelfViewMode === "function") {
        loadShelfViewMode();
    }

    if (
        typeof shelfViewMode === "undefined" ||
        !shelfViewMode
    ) {

        shelfViewMode = "grid";
    }

    if (typeof renderBooks === "function") {
        renderBooks();
    }

    if (typeof applyShelfViewMode === "function") {
        applyShelfViewMode();
    }

    applyViewClass();

    bindShelfEvents();
}


/* ==================================================
   应用网格 / 列表 class
================================================== */

function applyViewClass() {

    if (!bookGrid) {
        return;
    }

    bookGrid.classList.remove(
        "grid-view"
    );

    bookGrid.classList.remove(
        "list-view"
    );

    if (shelfViewMode === "list") {

        bookGrid.classList.add(
            "list-view"
        );

    } else {

        bookGrid.classList.add(
            "grid-view"
        );
    }
}


/* ==================================================
   绑定事件
================================================== */

function bindShelfEvents() {

    if (createButton) {

        createButton.addEventListener(
            "click",
            handleCreateButtonClick
        );
    }

    if (settingsButton) {

        settingsButton.addEventListener(
            "click",
            handleSettingsButtonClick
        );
    }

    if (createBookButton) {

        createBookButton.addEventListener(
            "click",
            handleCreateBookClick
        );
    }

    if (createCollectionButton) {

        createCollectionButton.addEventListener(
            "click",
            handleCreateCollectionClick
        );
    }

    if (sortBooksButton) {

        sortBooksButton.addEventListener(
            "click",
            startSorting
        );
    }

    if (finishSortButton) {

        finishSortButton.addEventListener(
            "click",
            finishSorting
        );
    }

    if (gridButton) {

        gridButton.addEventListener(
            "click",
            setGridView
        );
    }

    if (listButton) {

        listButton.addEventListener(
            "click",
            setListView
        );
    }


    /* ==================================================
       书籍区域
    ================================================== */

    if (bookGrid) {

        bookGrid.addEventListener(
            "click",
            handleBookGridClick
        );

        bookGrid.addEventListener(
            "pointerdown",
            handlePointerDown
        );

        bookGrid.addEventListener(
            "pointermove",
            handlePointerMove
        );

        bookGrid.addEventListener(
            "pointerup",
            handlePointerUp
        );

        bookGrid.addEventListener(
            "pointercancel",
            handlePointerCancel
        );

        bookGrid.addEventListener(
            "pointerleave",
            handlePointerLeave
        );

        bookGrid.addEventListener(
            "contextmenu",
            handleContextMenu
        );
    }


    /* ==================================================
       长按菜单
    ================================================== */

    if (contextEdit) {

        contextEdit.addEventListener(
            "click",
            contextEditBook
        );
    }

    if (contextSort) {

        contextSort.addEventListener(
            "click",
            contextSortBook
        );
    }

    if (contextGroup) {

        contextGroup.addEventListener(
            "click",
            contextMoveBook
        );
    }

    if (contextDelete) {

        contextDelete.addEventListener(
            "click",
            contextDeleteBook
        );
    }


    if (bookMenuOverlay) {

        bookMenuOverlay.addEventListener(
            "click",
            closeBookContextMenu
        );
    }


    /* ==================================================
       底部导航
    ================================================== */

    if (shelfNav) {

        shelfNav.addEventListener(
            "click",
            goShelf
        );
    }

    if (toolsNav) {

        toolsNav.addEventListener(
            "click",
            goTools
        );
    }

    if (meNav) {

        meNav.addEventListener(
            "click",
            goMe
        );
    }


    document.addEventListener(
        "click",
        handleDocumentClick
    );
}


/* ==================================================
   新建按钮
================================================== */

function handleCreateButtonClick(event) {

    event.preventDefault();
    event.stopPropagation();

    const createMenu =
        document.getElementById("createMenu");

    const settingsMenu =
        document.getElementById("settingsMenu");

    if (!createMenu) {
        return;
    }

    if (settingsMenu) {

        settingsMenu.classList.remove(
            "show"
        );
    }

    createMenu.classList.toggle(
        "show"
    );
}


/* ==================================================
   设置按钮
================================================== */

function handleSettingsButtonClick(event) {

    event.preventDefault();
    event.stopPropagation();

    const settingsMenu =
        document.getElementById("settingsMenu");

    const createMenu =
        document.getElementById("createMenu");

    if (!settingsMenu) {
        return;
    }

    if (createMenu) {

        createMenu.classList.remove(
            "show"
        );
    }

    settingsMenu.classList.toggle(
        "show"
    );
}


/* ==================================================
   点击页面其他位置
================================================== */

function handleDocumentClick(event) {

    const createMenu =
        document.getElementById(
            "createMenu"
        );

    const settingsMenu =
        document.getElementById(
            "settingsMenu"
        );

    const clickedCreateButton =
        event.target.closest(
            "#createButton"
        );

    const clickedCreateMenu =
        event.target.closest(
            "#createMenu"
        );

    const clickedSettingsButton =
        event.target.closest(
            "#settingsButton"
        );

    const clickedSettingsMenu =
        event.target.closest(
            "#settingsMenu"
        );


    if (
        createMenu &&
        !clickedCreateButton &&
        !clickedCreateMenu
    ) {

        createMenu.classList.remove(
            "show"
        );
    }


    if (
        settingsMenu &&
        !clickedSettingsButton &&
        !clickedSettingsMenu
    ) {

        settingsMenu.classList.remove(
            "show"
        );
    }
}


/* ==================================================
   新建小说
================================================== */

function handleCreateBookClick(event) {

    event.preventDefault();
    event.stopPropagation();

    closeAllMenus();

    window.location.href =
        "create-book.html";
}


/* ==================================================
   新建分组
================================================== */

function handleCreateCollectionClick(event) {

    event.preventDefault();
    event.stopPropagation();

    closeAllMenus();

    alert(
        "分组功能正在开发中。"
    );
}


/* ==================================================
   网格
================================================== */

function setGridView(event) {

    if (event) {

        event.preventDefault();
        event.stopPropagation();
    }

    closeAllMenus();

    shelfViewMode =
        "grid";


    applyViewClass();


    if (
        typeof saveShelfViewMode ===
        "function"
    ) {

        saveShelfViewMode(
            "grid"
        );
    }


    if (
        typeof applyShelfViewMode ===
        "function"
    ) {

        applyShelfViewMode();
    }


    applyViewClass();


    if (isSorting) {

        renderSortingMode();
    }
}


/* ==================================================
   列表
================================================== */

function setListView(event) {

    if (event) {

        event.preventDefault();
        event.stopPropagation();
    }

    closeAllMenus();

    shelfViewMode =
        "list";


    applyViewClass();


    if (
        typeof saveShelfViewMode ===
        "function"
    ) {

        saveShelfViewMode(
            "list"
        );
    }


    if (
        typeof applyShelfViewMode ===
        "function"
    ) {

        applyShelfViewMode();
    }


    applyViewClass();


    if (isSorting) {

        renderSortingMode();
    }
}


/* ==================================================
   书籍点击
================================================== */

function handleBookGridClick(event) {

    const deleteButton =
        event.target.closest(
            ".delete-book-button"
        );


    if (deleteButton) {

        event.preventDefault();
        event.stopPropagation();

        cancelLongPress();


        const card =
            deleteButton.closest(
                ".book-card"
            );


        if (!card) {
            return;
        }


        deleteBook(
            card.dataset.bookId
        );

        return;
    }


    if (longPressTriggered) {

        longPressTriggered =
            false;

        return;
    }


    if (isSorting) {
        return;
    }


    const card =
        event.target.closest(
            ".book-card"
        );


    if (!card) {
        return;
    }


    const bookId =
        card.dataset.bookId;


    const book =
        getBookById(bookId);


    if (!book) {
        return;
    }


    if (
        event.target.closest(
            ".book-cover"
        )
    ) {

        openBook(bookId);

        return;
    }


    if (
        event.target.closest(
            ".book-title"
        )
    ) {

        openBook(bookId);
    }
}


/* ==================================================
   打开小说
================================================== */

function openBook(bookId) {

    const book =
        getBookById(bookId);

    if (!book) {
        return;
    }


    localStorage.setItem(
        "currentBookId",
        String(bookId)
    );

    localStorage.removeItem(
        "currentChapterId"
    );


    window.location.href =
        "book.html";
}


/* ==================================================
   编辑小说
================================================== */

function openEditBook(bookId) {

    const book =
        getBookById(bookId);

    if (!book) {
        return;
    }


    localStorage.setItem(
        "currentBookId",
        String(bookId)
    );

    localStorage.removeItem(
        "currentChapterId"
    );


    window.location.href =
        "edit-book.html";
}


/* ==================================================
   删除小说
================================================== */

function deleteBook(bookId) {

    const book =
        getBookById(bookId);

    if (!book) {
        return;
    }


    const title =
        book.title ||
        "未命名小说";


    const confirmed =
        window.confirm(
            "确定要删除《" +
            title +
            "》吗？\n\n" +
            "删除后，这本书及其全书结构将无法恢复。"
        );


    if (!confirmed) {
        return;
    }


    books =
        books.filter(
            function(item) {

                return String(item.id) !==
                    String(bookId);
            }
        );


    if (!saveBooks()) {
        return;
    }


    if (
        typeof renderBooks ===
        "function"
    ) {

        renderBooks();
    }


    if (isSorting) {

        renderSortingMode();
    }


    applyViewClass();
}


/* ==================================================
   指针按下
================================================== */

function handlePointerDown(event) {

    if (event.isPrimary === false) {
        return;
    }


    const card =
        event.target.closest(
            ".book-card"
        );


    if (!card) {
        return;
    }


    /* ==================================================
       排序模式
    ================================================== */

    if (isSorting) {

        if (
            event.target.closest(
                ".delete-book-button"
            )
        ) {

            return;
        }


        event.preventDefault();


        sortingPointerId =
            event.pointerId;


        sortingDraggedCard =
            card;


        sortingStartX =
            event.clientX;


        sortingStartY =
            event.clientY;


        sortingDragging =
            false;


        clearTimeout(
            sortingPressTimer
        );


        sortingPressTimer =
            setTimeout(
                function() {

                    startTouchSorting(
                        event
                    );

                },
                350
            );


        return;
    }


    /* ==================================================
       普通模式
    ================================================== */

    if (
        event.pointerType === "mouse" &&
        event.button !== 0
    ) {

        return;
    }


    if (
        event.target.closest(
            ".delete-book-button"
        )
    ) {

        return;
    }


    cancelLongPress();


    pressedCard =
        card;


    pressStartX =
        event.clientX;

    pressStartY =
        event.clientY;


    longPressTriggered =
        false;


    card.classList.add(
        "long-pressing"
    );


    longPressTimer =
        setTimeout(
            function() {

                if (!pressedCard) {
                    return;
                }


                const bookId =
                    pressedCard.dataset.bookId;


                longPressBookId =
                    bookId;


                longPressTriggered =
                    true;


                pressedCard.classList.remove(
                    "long-pressing"
                );


                showBookContextMenu(
                    bookId,
                    pressedCard
                );


                longPressTimer =
                    null;

            },
            LONG_PRESS_TIME
        );
}


/* ==================================================
   指针移动
================================================== */

function handlePointerMove(event) {

    /* ==================================================
       排序模式
    ================================================== */

    if (
        isSorting &&
        sortingDraggedCard &&
        event.pointerId ===
            sortingPointerId
    ) {

        const distanceX =
            Math.abs(
                event.clientX -
                sortingStartX
            );


        const distanceY =
            Math.abs(
                event.clientY -
                sortingStartY
            );


        /*
         * 长按还没有开始
         */

        if (
            !sortingDragging &&
            (
                distanceX > 10 ||
                distanceY > 10
            )
        ) {

            clearTimeout(
                sortingPressTimer
            );

            sortingPressTimer =
                null;

            return;
        }


        /*
         * 正在拖动
         */

        if (sortingDragging) {

            event.preventDefault();


            moveTouchSorting(
                event.clientX,
                event.clientY
            );


            return;
        }


        return;
    }


    /* ==================================================
       普通长按
    ================================================== */

    if (
        !longPressTimer ||
        !pressedCard
    ) {

        return;
    }


    const distanceX =
        Math.abs(
            event.clientX -
            pressStartX
        );


    const distanceY =
        Math.abs(
            event.clientY -
            pressStartY
        );


    if (
        distanceX >
            MOVE_CANCEL_DISTANCE ||
        distanceY >
            MOVE_CANCEL_DISTANCE
    ) {

        cancelLongPress();
    }
}


/* ==================================================
   指针抬起
================================================== */

function handlePointerUp(event) {

    /* ==================================================
       手机排序
    ================================================== */

    if (
        isSorting &&
        event.pointerId ===
            sortingPointerId
    ) {

        clearTimeout(
            sortingPressTimer
        );

        sortingPressTimer =
            null;


        if (sortingDragging) {

            finishTouchSorting();

        } else {

            cancelTouchSorting();
        }


        return;
    }


    /* ==================================================
       普通模式
    ================================================== */

    if (longPressTimer) {

        clearTimeout(
            longPressTimer
        );

        longPressTimer =
            null;
    }


    if (!longPressTriggered) {

        if (pressedCard) {

            pressedCard.classList.remove(
                "long-pressing"
            );
        }

        pressedCard =
            null;
    }
}


/* ==================================================
   指针取消
================================================== */

function handlePointerCancel(event) {

    if (
        isSorting &&
        event.pointerId ===
            sortingPointerId
    ) {

        cancelTouchSorting();

        return;
    }


    cancelLongPress();
}


/* ==================================================
   指针离开
================================================== */

function handlePointerLeave(event) {

    if (
        event.pointerType ===
        "mouse"
    ) {

        cancelLongPress();
    }
}


/* ==================================================
   取消普通长按
================================================== */

function cancelLongPress() {

    if (longPressTimer) {

        clearTimeout(
            longPressTimer
        );

        longPressTimer =
            null;
    }


    if (pressedCard) {

        pressedCard.classList.remove(
            "long-pressing"
        );
    }


    pressedCard =
        null;
}


/* ==================================================
   右键
================================================== */

function handleContextMenu(event) {

    event.preventDefault();
}


/* ==================================================
   显示长按菜单
================================================== */

function showBookContextMenu(
    bookId,
    card
) {

    const book =
        getBookById(bookId);


    if (!book) {
        return;
    }


    longPressBookId =
        bookId;


    if (contextMenuTitle) {

        contextMenuTitle.textContent =
            book.title ||
            "未命名小说";
    }


    if (bookMenuOverlay) {

        bookMenuOverlay.classList.add(
            "show"
        );
    }


    if (bookContextMenu) {

        bookContextMenu.classList.add(
            "show"
        );
    }


    document.body.style.overflow =
        "hidden";


    if (card) {

        card.classList.add(
            "long-pressed"
        );
    }
}


/* ==================================================
   关闭长按菜单
================================================== */

function closeBookContextMenu() {

    if (bookMenuOverlay) {

        bookMenuOverlay.classList.remove(
            "show"
        );
    }


    if (bookContextMenu) {

        bookContextMenu.classList.remove(
            "show"
        );
    }


    document.body.style.overflow =
        "";


    longPressBookId =
        null;
}


/* ==================================================
   长按菜单：编辑
================================================== */

function contextEditBook() {

    const bookId =
        longPressBookId;


    closeBookContextMenu();


    if (!bookId) {
        return;
    }


    openEditBook(bookId);
}


/* ==================================================
   长按菜单：排序
================================================== */

function contextSortBook() {

    closeBookContextMenu();

    startSorting();
}


/* ==================================================
   长按菜单：分组
================================================== */

function contextMoveBook() {

    const bookId =
        longPressBookId;


    closeBookContextMenu();


    if (!bookId) {
        return;
    }


    moveBookToGroup(bookId);
}


/* ==================================================
   长按菜单：删除
================================================== */

function contextDeleteBook() {

    const bookId =
        longPressBookId;


    closeBookContextMenu();


    if (!bookId) {
        return;
    }


    deleteBook(bookId);
}


/* ==================================================
   关闭顶部菜单
================================================== */

function closeAllMenus() {

    const createMenu =
        document.getElementById(
            "createMenu"
        );


    const settingsMenu =
        document.getElementById(
            "settingsMenu"
        );


    if (createMenu) {

        createMenu.classList.remove(
            "show"
        );
    }


    if (settingsMenu) {

        settingsMenu.classList.remove(
            "show"
        );
    }
}


/* ==================================================
   开始排序
================================================== */

function startSorting() {

    closeAllMenus();

    closeBookContextMenu();


    if (isSorting) {
        return;
    }


    isSorting =
        true;


    document.body.classList.add(
        "sorting"
    );


    if (
        typeof renderSortingMode ===
        "function"
    ) {

        renderSortingMode();
    }


    const cards =
        document.querySelectorAll(
            ".book-card"
        );


    cards.forEach(
        function(card) {

            card.classList.add(
                "sorting-card"
            );
        }
    );
}


/* ==================================================
   开始手机拖动
================================================== */

function startTouchSorting(event) {

    if (
        !isSorting ||
        !sortingDraggedCard
    ) {

        return;
    }


    sortingDragging =
        true;


    document.body.classList.add(
        "touch-sorting"
    );


    sortingDraggedCard.classList.add(
        "touch-dragging"
    );


    /*
     * 创建占位卡片
     */

    sortingPlaceholder =
        document.createElement(
            "div"
        );


    sortingPlaceholder.className =
        "book-card sorting-placeholder";


    const rect =
        sortingDraggedCard.getBoundingClientRect();


    sortingPlaceholder.style.width =
        rect.width + "px";


    sortingPlaceholder.style.height =
        rect.height + "px";


    sortingDraggedCard.parentNode.insertBefore(
        sortingPlaceholder,
        sortingDraggedCard
    );


    /*
     * 让原卡片浮在上面
     */

    sortingDraggedCard.style.width =
        rect.width + "px";


    sortingDraggedCard.style.height =
        rect.height + "px";


    sortingDraggedCard.style.zIndex =
        "999";


    sortingDraggedCard.style.position =
        "relative";


    sortingDraggedCard.style.touchAction =
        "none";


    /*
     * 防止浏览器滚动
     */

    document.body.style.overflow =
        "hidden";
}


/* ==================================================
   移动手机排序
================================================== */

function moveTouchSorting(
    clientX,
    clientY
) {

    if (
        !sortingDraggedCard ||
        !sortingPlaceholder ||
        !bookGrid
    ) {

        return;
    }


    const cards =
        Array.from(
            bookGrid.querySelectorAll(
                ".book-card"
            )
        ).filter(
            function(card) {

                return (
                    card !==
                    sortingDraggedCard
                );
            }
        );


    let targetCard =
        null;


    /*
     * 找到手指下面的卡片
     */

    for (
        let i = 0;
        i < cards.length;
        i++
    ) {

        const card =
            cards[i];


        const rect =
            card.getBoundingClientRect();


        if (
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom
        ) {

            targetCard =
                card;

            break;
        }
    }


    if (!targetCard) {
        return;
    }


    const rect =
        targetCard.getBoundingClientRect();


    const centerX =
        rect.left +
        rect.width / 2;


    const centerY =
        rect.top +
        rect.height / 2;


    /*
     * 判断插入位置
     */

    if (
        clientY < centerY ||
        (
            Math.abs(
                clientY -
                centerY
            ) <
            rect.height * 0.25 &&
            clientX < centerX
        )
    ) {

        if (
            sortingPlaceholder !==
            targetCard.previousSibling
        ) {

            bookGrid.insertBefore(
                sortingPlaceholder,
                targetCard
            );
        }

    } else {

        if (
            sortingPlaceholder !==
            targetCard.nextSibling
        ) {

            bookGrid.insertBefore(
                sortingPlaceholder,
                targetCard.nextSibling
            );
        }
    }
}


/* ==================================================
   完成手机拖动
================================================== */

function finishTouchSorting() {

    clearTimeout(
        sortingPressTimer
    );


    sortingPressTimer =
        null;


    if (!sortingDraggedCard) {

        cancelTouchSorting();

        return;
    }


    /*
     * 把书籍放到占位位置
     */

    if (sortingPlaceholder) {

        sortingPlaceholder.parentNode.insertBefore(
            sortingDraggedCard,
            sortingPlaceholder
        );


        sortingPlaceholder.remove();


        sortingPlaceholder =
            null;
    }


    /*
     * 清除拖动状态
     */

    sortingDraggedCard.classList.remove(
        "touch-dragging"
    );


    sortingDraggedCard.classList.remove(
        "sorting-card"
    );


    sortingDraggedCard.style.width =
        "";

    sortingDraggedCard.style.height =
        "";

    sortingDraggedCard.style.zIndex =
        "";

    sortingDraggedCard.style.position =
        "";

    sortingDraggedCard.style.touchAction =
        "";


    /*
     * 根据 DOM 顺序
     * 更新 books
     */

    updateBookOrder();


    sortingDraggedCard =
        null;


    sortingDragging =
        false;


    sortingPointerId =
        null;


    document.body.classList.remove(
        "touch-sorting"
    );


    document.body.style.overflow =
        "";
}


/* ==================================================
   取消手机拖动
================================================== */

function cancelTouchSorting() {

    clearTimeout(
        sortingPressTimer
    );


    sortingPressTimer =
        null;


    if (sortingPlaceholder) {

        sortingPlaceholder.remove();

        sortingPlaceholder =
            null;
    }


    if (sortingDraggedCard) {

        sortingDraggedCard.classList.remove(
            "touch-dragging"
        );

        sortingDraggedCard.classList.remove(
            "sorting-card"
        );


        sortingDraggedCard.style.width =
            "";

        sortingDraggedCard.style.height =
            "";

        sortingDraggedCard.style.zIndex =
            "";

        sortingDraggedCard.style.position =
            "";

        sortingDraggedCard.style.touchAction =
            "";
    }


    sortingDraggedCard =
        null;


    sortingDragging =
        false;


    sortingPointerId =
        null;


    document.body.classList.remove(
        "touch-sorting"
    );


    document.body.style.overflow =
        "";
}


/* ==================================================
   更新书籍顺序
================================================== */

function updateBookOrder() {

    if (!bookGrid) {
        return;
    }


    const cards =
        Array.from(
            bookGrid.querySelectorAll(
                ".book-card"
            )
        );


    const newBooks = [];


    cards.forEach(
        function(card) {

            const bookId =
                card.dataset.bookId;


            const book =
                getBookById(bookId);


            if (book) {

                newBooks.push(
                    book
                );
            }
        }
    );


    if (
        newBooks.length ===
        books.length
    ) {

        books =
            newBooks;
    }
}


/* ==================================================
   完成排序
================================================== */

function finishSorting() {

    if (!isSorting) {
        return;
    }


    /*
     * 如果正在手机拖动，
     * 先完成当前拖动
     */

    if (sortingDragging) {

        finishTouchSorting();

    } else {

        cancelTouchSorting();
    }


    /*
     * 更新最终顺序
     */

    updateBookOrder();


    /*
     * 保存
     */

    if (!saveBooks()) {
        return;
    }


    /*
     * 退出排序
     */

    isSorting =
        false;


    draggingCard =
        null;


    isDraggingBook =
        false;


    document.body.classList.remove(
        "sorting"
    );


    document.body.classList.remove(
        "touch-sorting"
    );


    document.body.style.overflow =
        "";


    /*
     * 清理排序样式
     */

    document
        .querySelectorAll(
            ".book-card"
        )
        .forEach(
            function(card) {

                card.classList.remove(
                    "sorting-card"
                );

                card.classList.remove(
                    "dragging"
                );

                card.classList.remove(
                    "drag-over"
                );

                card.classList.remove(
                    "touch-dragging"
                );


                card.removeAttribute(
                    "draggable"
                );
            }
        );


    /*
     * 重新渲染
     */

    if (
        typeof renderBooks ===
        "function"
    ) {

        renderBooks();
    }


    if (
        typeof applyShelfViewMode ===
        "function"
    ) {

        applyShelfViewMode();
    }


    applyViewClass();


    if (
        typeof renderSortingMode ===
        "function"
    ) {

        renderSortingMode();
    }
}


/* ==================================================
   移至分组
================================================== */

function moveBookToGroup(bookId) {

    const book =
        getBookById(bookId);


    if (!book) {
        return;
    }


    alert(
        "准备将《" +
        (
            book.title ||
            "未命名书籍"
        ) +
        "》移动到分组。\n\n" +
        "分组系统下一步加入。"
    );
}


/* ==================================================
   底部导航
================================================== */

function goShelf() {

    window.location.href =
        "index.html";
}


function goTools() {

    alert(
        "工具功能正在开发中。"
    );
}


function goMe() {

    alert(
        "我的功能正在开发中。"
    );
}


/* ==================================================
   启动
================================================== */

initShelf();
