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

    bindShelfEvents();

    if (
        typeof loadBooks ===
        "function"
    ) {

        loadBooks();
    }

    if (
        typeof loadShelfViewMode ===
        "function"
    ) {

        loadShelfViewMode();
    }

    if (
        typeof shelfViewMode ===
        "undefined" ||
        !shelfViewMode
    ) {

        shelfViewMode =
            "grid";
    }

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

    renderSortingMode();
}


/* ==================================================
   应用网格 / 列表
================================================== */

function applyViewClass() {

    if (!bookGrid) {

        return;
    }

    bookGrid.classList.remove(
        "grid-view",
        "list-view"
    );

    if (
        shelfViewMode === "list"
    ) {

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

    /* ==================================================
       顶部
    ================================================== */

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

    if (finishSortButton) {

        finishSortButton.addEventListener(
            "click",
            finishSorting
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
       书籍菜单
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
       遮罩
    ================================================== */

    if (bookMenuOverlay) {

        bookMenuOverlay.addEventListener(
            "click",
            closeBookContextMenu
        );
    }


    /* ==================================================
       底部
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
   新建菜单
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

    createMenu.classList.toggle(
        "show"
    );
}


/* ==================================================
   设置菜单
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
   新建书籍
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

    shelfViewMode =
        "grid";

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

    closeAllMenus();
}


/* ==================================================
   列表
================================================== */

function setListView(event) {

    if (event) {

        event.preventDefault();
        event.stopPropagation();
    }

    shelfViewMode =
        "list";

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

    closeAllMenus();
}


/* ==================================================
   书籍点击
================================================== */

function handleBookGridClick(event) {

    /* ==================================================
       三个点
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

        showBookContextMenu(
            card.dataset.bookId,
            card
        );

        return;
    }


    /* ==================================================
       长按触发后的点击
    ================================================== */

    if (longPressTriggered) {

        longPressTriggered =
            false;

        return;
    }


    /* ==================================================
       排序中
    ================================================== */

    if (isSorting) {

        return;
    }


    /* ==================================================
       获取卡片
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
       点击书名
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

    /* ==================================================
       1. 找到书籍
    ================================================== */

    const book =
        getBookById(bookId);

    if (!book) {

        return;
    }


    /* ==================================================
       2. 获取书名
    ================================================== */

    const title =
        book.title ||
        "未命名小说";


    /* ==================================================
       3. 确认删除
    ================================================== */

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


    /* ==================================================
       4. 获取书籍位置
    ================================================== */

    const index =
        getBookIndex(bookId);

    if (index === -1) {

        return;
    }


    /* ==================================================
       5. 从内存删除
    ================================================== */

    books.splice(
        index,
        1
    );


    /* ==================================================
       6. 保存到 localStorage
    ================================================== */

    try {

        localStorage.setItem(
            "novelBooks",
            JSON.stringify(books)
        );

    } catch (error) {

        /* 保存失败则恢复 */

        books.splice(
            index,
            0,
            book
        );

        console.error(
            "删除书籍保存失败：",
            error
        );

        alert(
            "删除失败，请稍后重试。"
        );

        return;
    }


    /* ==================================================
       7. 删除当前书籍记录
    ================================================== */

    const currentBookId =
        localStorage.getItem(
            "currentBookId"
        );


    if (
        String(currentBookId) ===
        String(bookId)
    ) {

        localStorage.removeItem(
            "currentBookId"
        );
    }


    /* ==================================================
       8. 直接找到页面上的书卡
    ================================================== */

    let deletedCard =
        null;


    if (bookGrid) {

        const cards =
            bookGrid.querySelectorAll(
                ".book-card"
            );


        cards.forEach(
            function(card) {

                if (
                    String(
                        card.dataset.bookId
                    ) ===
                    String(bookId)
                ) {

                    deletedCard =
                        card;
                }

            }
        );
    }


    /* ==================================================
       9. 立即从页面删除书卡
    ================================================== */

    if (deletedCard) {

        deletedCard.remove();
    }


    /* ==================================================
       10. 关闭书籍菜单
    ================================================== */

    closeBookContextMenu();


    /* ==================================================
       11. 清除长按状态
    ================================================== */

    cancelLongPress();


    /* ==================================================
       12. 如果没有书籍了
    ================================================== */

    if (
        Array.isArray(books) &&
        books.length === 0
    ) {

        const emptyShelf =
            document.getElementById(
                "emptyShelf"
            );

        if (emptyShelf) {

            emptyShelf.style.display =
                "block";
        }
    }


    /* ==================================================
       13. 清除选中状态
    ================================================== */

    if (
        typeof selectedBookId !==
        "undefined"
    ) {

        if (
            String(selectedBookId) ===
            String(bookId)
        ) {

            selectedBookId =
                null;
        }
    }


    /* ==================================================
       14. 如果删除的是最后一本
    ================================================== */

    if (
        Array.isArray(books) &&
        books.length === 0
    ) {

        if (bookGrid) {

            bookGrid.innerHTML =
                "";
        }
    }
}


/* ==================================================
   长按开始
================================================== */

function handlePointerDown(event) {

    if (isSorting) {

        return;
    }

    if (
        event.isPrimary === false
    ) {

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
            ".book-menu-button"
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

    if (pressedCard) {

        pressedCard.classList.remove(
            "long-pressing"
        );
    }

    pressedCard =
        null;
}


/* ==================================================
   鼠标离开
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
   编辑
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
   排序
================================================== */

function contextSortBook() {

    closeBookContextMenu();

    startSorting();
}


/* ==================================================
   分组
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
   删除
================================================== */

function contextDeleteBook() {

    const bookId =
        longPressBookId;

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

    draggingCard =
        null;

    isDraggingBook =
        false;

    if (bookGrid) {

        bookGrid.classList.add(
            "sorting"
        );
    }

    document.body.classList.add(
        "sorting"
    );

    if (
        typeof renderSortingMode ===
        "function"
    ) {

        renderSortingMode();
    }

    enableBookDragging();
}


/* ==================================================
   开启拖动
================================================== */

function enableBookDragging() {

    if (!bookGrid) {

        return;
    }

    const cards =
        bookGrid.querySelectorAll(
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

    if (
        !target ||
        target === draggingCard
    ) {

        return;
    }

    const rect =
        target.getBoundingClientRect();

    if (
        bookGrid.classList.contains(
            "list-view"
        )
    ) {

        const middleY =
            rect.top +
            rect.height / 2;

        if (
            event.clientY <
            middleY
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

    } else {

        const middleX =
            rect.left +
            rect.width / 2;

        const middleY =
            rect.top +
            rect.height / 2;

        const offsetX =
            event.clientX -
            middleX;

        const offsetY =
            event.clientY -
            middleY;

        if (
            Math.abs(offsetX) >
            Math.abs(offsetY)
        ) {

            if (
                event.clientX <
                middleX
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

        } else {

            if (
                event.clientY <
                middleY
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
        }
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

    draggingCard =
        null;

    isDraggingBook =
        false;
}


/* ==================================================
   更新书籍顺序
================================================== */

function updateBookOrder() {

    if (!bookGrid) {

        return;
    }

    if (!Array.isArray(books)) {

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

    updateBookOrder();

    if (
        typeof saveBooks ===
        "function"
    ) {

        saveBooks();
    }

    isSorting =
        false;

    draggingCard =
        null;

    isDraggingBook =
        false;

    document.body.classList.remove(
        "sorting"
    );

    if (bookGrid) {

        bookGrid.classList.remove(
            "sorting"
        );
    }

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

                card.classList.remove(
                    "long-pressed"
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

    renderSortingMode();
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
