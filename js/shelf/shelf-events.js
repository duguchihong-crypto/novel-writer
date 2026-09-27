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
   初始化
================================================== */

function initShelf() {

    /* 读取书籍 */

    if (typeof loadBooks === "function") {
        loadBooks();
    }

    /* 读取书架显示模式 */

    if (typeof loadShelfViewMode === "function") {
        loadShelfViewMode();
    }

    /* 没有保存过模式时，默认使用网格 */

    if (
        typeof shelfViewMode === "undefined" ||
        !shelfViewMode
    ) {

        shelfViewMode = "grid";
    }

    /* 渲染书籍 */

    if (typeof renderBooks === "function") {
        renderBooks();
    }

    /* 应用显示模式 */

    if (typeof applyShelfViewMode === "function") {
        applyShelfViewMode();
    }

    /* 强制确保当前模式正确 */

    applyViewClass();

    /* 绑定事件 */

    bindShelfEvents();
}


/* ==================================================
   应用网格 / 列表 class
================================================== */

function applyViewClass() {

    if (!bookGrid) {
        return;
    }

    /* 先清除 */

    bookGrid.classList.remove(
        "grid-view"
    );

    bookGrid.classList.remove(
        "list-view"
    );

    /* 根据当前模式添加 */

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

    /* 新建 */

    if (createButton) {

        createButton.addEventListener(
            "click",
            handleCreateButtonClick
        );
    }

    /* 设置 */

    if (settingsButton) {

        settingsButton.addEventListener(
            "click",
            handleSettingsButtonClick
        );
    }

    /* 新建书籍 */

    if (createBookButton) {

        createBookButton.addEventListener(
            "click",
            handleCreateBookClick
        );
    }

    /* 新建组合 */

    if (createCollectionButton) {

        createCollectionButton.addEventListener(
            "click",
            handleCreateCollectionClick
        );
    }

    /* 排序 */

    if (sortBooksButton) {

        sortBooksButton.addEventListener(
            "click",
            startSorting
        );
    }

    /* 完成排序 */

    if (finishSortButton) {

        finishSortButton.addEventListener(
            "click",
            finishSorting
        );
    }

    /* 网格 */

    if (gridButton) {

        gridButton.addEventListener(
            "click",
            setGridView
        );
    }

    /* 列表 */

    if (listButton) {

        listButton.addEventListener(
            "click",
            setListView
        );
    }

    /* 书籍区域 */

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
            cancelLongPress
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

    /* 长按菜单 */

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

    /* 长按遮罩 */

    if (bookMenuOverlay) {

        bookMenuOverlay.addEventListener(
            "click",
            closeBookContextMenu
        );
    }

    /* 底部导航 */

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

    /* 页面点击 */

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

    if (
        createMenu.classList.contains(
            "show"
        )
    ) {

        createMenu.classList.remove(
            "show"
        );

    } else {

        createMenu.classList.add(
            "show"
        );
    }
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

    if (
        settingsMenu.classList.contains(
            "show"
        )
    ) {

        settingsMenu.classList.remove(
            "show"
        );

    } else {

        settingsMenu.classList.add(
            "show"
        );
    }
}


/* ==================================================
   点击页面其他位置
================================================== */

function handleDocumentClick(event) {

    const createMenu =
        document.getElementById("createMenu");

    const settingsMenu =
        document.getElementById("settingsMenu");

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
   新建组合
================================================== */

function handleCreateCollectionClick(event) {

    event.preventDefault();
    event.stopPropagation();

    closeAllMenus();

    alert(
        "组合功能正在开发中。"
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

    shelfViewMode = "grid";

    /* 立即修改 CSS class */

    applyViewClass();

    /* 保存 */

    if (
        typeof saveShelfViewMode ===
        "function"
    ) {

        saveShelfViewMode("grid");
    }

    /* 使用原来的显示模式系统 */

    if (
        typeof applyShelfViewMode ===
        "function"
    ) {

        applyShelfViewMode();
    }

    /* 再次确保 class 正确 */

    applyViewClass();

    /* 排序模式 */

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

    shelfViewMode = "list";

    /* 立即修改 CSS class */

    applyViewClass();

    /* 保存 */

    if (
        typeof saveShelfViewMode ===
        "function"
    ) {

        saveShelfViewMode("list");
    }

    /* 使用原来的显示模式系统 */

    if (
        typeof applyShelfViewMode ===
        "function"
    ) {

        applyShelfViewMode();
    }

    /* 再次确保 class 正确 */

    applyViewClass();

    /* 排序模式 */

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

        longPressTriggered = false;

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

        return;
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
   长按开始
================================================== */

function handlePointerDown(event) {

    if (isSorting) {
        return;
    }

    if (event.isPrimary === false) {
        return;
    }

    if (
        event.pointerType === "mouse" &&
        event.button !== 0
    ) {
        return;
    }

    const card =
        event.target.closest(
            ".book-card"
        );

    if (!card) {
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

    pressedCard = card;

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
   长按移动
================================================== */

function handlePointerMove(event) {

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
   长按结束
================================================== */

function handlePointerUp() {

    if (longPressTimer) {

        clearTimeout(
            longPressTimer
        );

        longPressTimer = null;
    }

    if (!longPressTriggered) {

        if (pressedCard) {

            pressedCard.classList.remove(
                "long-pressing"
            );
        }

        pressedCard = null;
    }
}


/* ==================================================
   长按离开
================================================== */

function handlePointerLeave(event) {

    if (
        event.pointerType === "mouse"
    ) {

        cancelLongPress();
    }
}


/* ==================================================
   取消长按
================================================== */

function cancelLongPress() {

    if (longPressTimer) {

        clearTimeout(
            longPressTimer
        );

        longPressTimer = null;
    }

    if (pressedCard) {

        pressedCard.classList.remove(
            "long-pressing"
        );
    }

    pressedCard = null;
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

    isSorting = true;

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

            card.setAttribute(
                "draggable",
                "true"
            );

            card.addEventListener(
                "dragstart",
                handleDragStart
            );

            card.addEventListener(
                "dragover",
                handleDragOver
            );

            card.addEventListener(
                "drop",
                handleDrop
            );

            card.addEventListener(
                "dragend",
                handleDragEnd
            );
        }
    );
}


/* ==================================================
   拖动开始
================================================== */

function handleDragStart(event) {

    if (!isSorting) {
        return;
    }

    draggingCard =
        event.currentTarget;

    isDraggingBook =
        true;

    draggingCard.classList.add(
        "dragging"
    );

    if (event.dataTransfer) {

        event.dataTransfer.effectAllowed =
            "move";

        event.dataTransfer.setData(
            "text/plain",
            draggingCard.dataset.bookId
        );
    }
}


/* ==================================================
   拖动经过
================================================== */

function handleDragOver(event) {

    if (
        !isSorting ||
        !draggingCard
    ) {
        return;
    }

    event.preventDefault();

    const target =
        event.currentTarget;

    if (target === draggingCard) {
        return;
    }

    const rect =
        target.getBoundingClientRect();

    const middle =
        rect.top +
        rect.height / 2;

    if (
        event.clientY <
        middle
    ) {

        bookGrid.insertBefore(
            draggingCard,
            target
        );

    } else {

        bookGrid.insertBefore(
            draggingCard,
            target.nextSibling
        );
    }

    document
        .querySelectorAll(
            ".book-card.drag-over"
        )
        .forEach(
            function(card) {

                card.classList.remove(
                    "drag-over"
                );
            }
        );

    target.classList.add(
        "drag-over"
    );
}


/* ==================================================
   放置
================================================== */

function handleDrop(event) {

    event.preventDefault();

    updateBookOrder();
}


/* ==================================================
   拖动结束
================================================== */

function handleDragEnd() {

    if (draggingCard) {

        draggingCard.classList.remove(
            "dragging"
        );
    }

    document
        .querySelectorAll(
            ".book-card.drag-over"
        )
        .forEach(
            function(card) {

                card.classList.remove(
                    "drag-over"
                );
            }
        );

    updateBookOrder();

    draggingCard = null;

    isDraggingBook = false;
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

                newBooks.push(book);
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

    updateBookOrder();

    if (!saveBooks()) {
        return;
    }

    isSorting = false;

    draggingCard = null;

    isDraggingBook = false;

    document.body.classList.remove(
        "sorting"
    );

    document
        .querySelectorAll(
            ".book-card"
        )
        .forEach(
            function(card) {

                card.removeAttribute(
                    "draggable"
                );

                card.classList.remove(
                    "dragging"
                );

                card.classList.remove(
                    "drag-over"
                );
            }
        );

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
