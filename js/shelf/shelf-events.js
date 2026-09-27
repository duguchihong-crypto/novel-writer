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


    /* 默认网格 */

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

    bookGrid.classList.remove(
        "grid-view",
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


    /* 新建分组 */

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


    /* ==================================================
       长按遮罩
    ================================================== */

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


    /* ==================================================
       页面点击
    ================================================== */

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
        document.getElementById(
            "createMenu"
        );

    const settingsMenu =
        document.getElementById(
            "settingsMenu"
        );


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
        document.getElementById(
            "settingsMenu"
        );

    const createMenu =
        document.getElementById(
            "createMenu"
        );


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
   页面其他位置
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

    /* ==================================================
       三个点菜单
    ================================================== */

    const menuButton =
        event.target.closest(
            ".book-menu-button"
        );


    if (menuButton) {

        event.preventDefault();
        event.stopPropagation();

        cancelLongPress();


        const card =
            menuButton.closest(
                ".book-card"
            );


        if (!card) {
            return;
        }


        const bookId =
            card.dataset.bookId;


        showBookContextMenu(
            bookId,
            card
        );


        return;
    }


    /* ==================================================
       旧删除按钮兼容
       
       如果旧 HTML 暂时还存在
       .delete-book-button
       仍然可以删除。
    ================================================== */

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


    /* ==================================================
       长按已经触发
    ================================================== */

    if (longPressTriggered) {

        longPressTriggered =
            false;

        return;
    }


    /* ==================================================
       排序模式
    ================================================== */

    if (isSorting) {
        return;
    }


    /* ==================================================
       获取书籍卡片
    ================================================== */

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


    /* ==================================================
       点击封面
    ================================================== */

    if (
        event.target.closest(
            ".book-cover"
        )
    ) {

        openBook(bookId);

        return;
    }


    /* ==================================================
       点击标题
    ================================================== */

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


    /* ==================================================
       点击三个点时
       不启动长按
    ================================================== */

    if (
        event.target.closest(
            ".book-menu-button"
        )
    ) {
        return;
    }


    /* ==================================================
       兼容旧删除按钮
    ================================================== */

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
   显示书籍菜单
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


    /* ==================================================
       菜单标题
    ================================================== */

    if (contextMenuTitle) {

        contextMenuTitle.textContent =
            book.title ||
            "未命名小说";
    }


    /* ==================================================
       显示遮罩
    ================================================== */

    if (bookMenuOverlay) {

        bookMenuOverlay.classList.add(
            "show"
        );
    }


    /* ==================================================
       显示菜单
    ================================================== */

    if (bookContextMenu) {

        bookContextMenu.classList.add(
            "show"
        );
    }


    document.body.style.overflow =
        "hidden";


    /* ==================================================
       标记当前书籍
    ================================================== */

    if (card) {

        card.classList.add(
            "long-pressed"
        );
    }
}


/* ==================================================
   关闭书籍菜单
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


    /* ==================================================
       清除当前书籍
    ================================================== */

    longPressBookId =
        null;


    document
        .querySelectorAll(
            ".book-card.long-pressed"
        )
        .forEach(
            function(card) {

                card.classList.remove(
                    "long-pressed"
                );
            }
        );
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


    /*
       sorting 加到 bookGrid
    */

    if (bookGrid) {

        bookGrid.classList.add(
            "sorting"
        );
    }


    if (
