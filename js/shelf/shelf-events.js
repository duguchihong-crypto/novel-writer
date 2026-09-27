/* ==================================================
   书架页面事件
================================================== */


/* ==================================================
   DOM
================================================== */

const createButton =
    document.getElementById("createButton");

const settingsButton =
    document.getElementById("settingsButton");

const finishSortButton =
    document.getElementById("finishSortButton");

const createMenu =
    document.getElementById("createMenu");

const settingsMenu =
    document.getElementById("settingsMenu");

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
   当前长按的书
================================================== */

let currentBookId = null;


/* ==================================================
   长按菜单计时器
================================================== */

let longPressTimer = null;

let longPressTarget = null;


/* ==================================================
   排序
================================================== */

let desktopDraggedCard = null;

let touchDraggedCard = null;

let touchSorting = false;

let touchPointerId = null;

let touchStartX = 0;

let touchStartY = 0;

let touchSortTimer = null;


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

    renderBooks();

    applyShelfViewMode();

    applyViewClass();

    bindShelfEvents();
}


/* ==================================================
   视图模式
================================================== */

function applyViewClass() {

    if (!bookGrid) return;

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
   菜单
================================================== */

function closeMenus() {

    if (createMenu) {
        createMenu.classList.remove("show");
    }

    if (settingsMenu) {
        settingsMenu.classList.remove("show");
    }
}


function toggleCreateMenu(event) {

    event.stopPropagation();

    if (!createMenu) return;

    const shouldShow =
        !createMenu.classList.contains("show");

    closeMenus();

    if (shouldShow) {
        createMenu.classList.add("show");
    }
}


function toggleSettingsMenu(event) {

    event.stopPropagation();

    if (!settingsMenu) return;

    const shouldShow =
        !settingsMenu.classList.contains("show");

    closeMenus();

    if (shouldShow) {
        settingsMenu.classList.add("show");
    }
}


/* ==================================================
   新建书籍
================================================== */

function createNewBook() {

    closeMenus();

    if (typeof createBook === "function") {

        createBook();

        return;
    }

    const title =
        prompt("请输入小说名称");

    if (!title) return;

    const newBook = {

        id:
            Date.now().toString(),

        title:
            title.trim(),

        cover:
            "",

        createdAt:
            Date.now()
    };

    if (!Array.isArray(books)) {
        books = [];
    }

    books.push(newBook);

    saveBooks();

    renderBooks();

    applyViewClass();
}


/* ==================================================
   新建分组
================================================== */

function createNewCollection() {

    closeMenus();

    if (typeof createCollection === "function") {

        createCollection();

        return;
    }

    alert("分组功能暂未实现");
}


/* ==================================================
   网格
================================================== */

function switchToGrid() {

    closeMenus();

    renderGridView();

    applyViewClass();
}


/* ==================================================
   列表
================================================== */

function switchToList() {

    closeMenus();

    renderListView();

    applyViewClass();
}


/* ==================================================
   打开小说
================================================== */

function openBook(bookId) {

    const book =
        getBookById(bookId);

    if (!book) return;

    if (typeof editBook === "function") {

        editBook(bookId);

        return;
    }

    console.log(
        "打开小说:",
        book
    );
}


/* ==================================================
   编辑小说
================================================== */

function editCurrentBook() {

    const bookId =
        currentBookId;

    closeContextMenu();

    if (!bookId) return;

    if (typeof editBook === "function") {

        editBook(bookId);

        return;
    }

    openBook(bookId);
}


/* ==================================================
   获取书籍
================================================== */

function getBookById(bookId) {

    if (!Array.isArray(books)) {
        return null;
    }

    return books.find(
        function(book) {

            return String(book.id) ===
                String(bookId);

        }
    ) || null;
}


/* ==================================================
   删除书籍
================================================== */

function deleteBook(bookId) {

    const book =
        getBookById(bookId);

    if (!book) return;

    const title =
        book.title ||
        "未命名小说";

    const confirmed =
        confirm(
            "确定要删除《" +
            title +
            "》吗？"
        );

    if (!confirmed) return;

    books =
        books.filter(
            function(item) {

                return String(item.id) !==
                    String(bookId);

            }
        );

    saveBooks();

    closeContextMenu();

    renderBooks();

    applyViewClass();
}


/* ==================================================
   长按菜单
================================================== */

function openContextMenu(bookId) {

    const book =
        getBookById(bookId);

    if (!book) return;

    currentBookId =
        bookId;

    if (contextMenuTitle) {

        contextMenuTitle.textContent =
            book.title ||
            "未命名小说";
    }

    if (bookMenuOverlay) {
        bookMenuOverlay.classList.add("show");
    }

    if (bookContextMenu) {
        bookContextMenu.classList.add("show");
    }
}


function closeContextMenu() {

    currentBookId = null;

    if (bookMenuOverlay) {
        bookMenuOverlay.classList.remove("show");
    }

    if (bookContextMenu) {
        bookContextMenu.classList.remove("show");
    }
}


/* ==================================================
   普通长按
================================================== */

function startLongPress(
    event,
    card
) {

    if (isSorting) return;

    clearTimeout(longPressTimer);

    longPressTarget =
        card;

    card.classList.add(
        "long-pressing"
    );

    longPressTimer =
        setTimeout(
            function() {

                if (!longPressTarget) {
                    return;
                }

                const bookId =
                    longPressTarget.dataset.bookId;

                longPressTarget.classList.remove(
                    "long-pressing"
                );

                openContextMenu(
                    bookId
                );

                longPressTarget =
                    null;

            },
            500
        );
}


function cancelLongPress() {

    clearTimeout(
        longPressTimer
    );

    longPressTimer =
        null;

    if (longPressTarget) {

        longPressTarget.classList.remove(
            "long-pressing"
        );
    }

    longPressTarget =
        null;
}


/* ==================================================
   开始排序
================================================== */

function startSorting() {

    closeMenus();

    closeContextMenu();

    isSorting = true;

    if (bookGrid) {

        bookGrid.classList.add(
            "sorting"
        );
    }

    const sortHint =
        document.getElementById(
            "sortHint"
        );

    if (sortHint) {

        sortHint.style.display =
            "block";
    }

    prepareSortingCards();
}


/* ==================================================
   准备排序卡片
================================================== */

function prepareSortingCards() {

    if (!bookGrid) return;

    const cards =
        bookGrid.querySelectorAll(
            ".book-card"
        );

    cards.forEach(
        function(card) {

            card.draggable = true;

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

            card.addEventListener(
                "pointerdown",
                handleSortPointerDown
            );

            card.addEventListener(
                "pointermove",
                handleSortPointerMove
            );

            card.addEventListener(
                "pointerup",
                handleSortPointerUp
            );

            card.addEventListener(
                "pointercancel",
                handleSortPointerCancel
            );
        }
    );
}


/* ==================================================
   桌面拖动开始
================================================== */

function handleDragStart(event) {

    if (!isSorting) {

        event.preventDefault();

        return;
    }

    /*
       手机不使用 HTML5 drag。
    */

    if (
        event.pointerType &&
        event.pointerType !== "mouse"
    ) {
        event.preventDefault();

        return;
    }

    desktopDraggedCard =
        event.currentTarget;

    event.dataTransfer.effectAllowed =
        "move";

    event.dataTransfer.setData(
        "text/plain",
        desktopDraggedCard.dataset.bookId
    );
}


/* ==================================================
   桌面拖动经过
================================================== */

function handleDragOver(event) {

    if (!isSorting) return;

    event.preventDefault();

    if (!desktopDraggedCard) return;

    const target =
        event.currentTarget;

    if (
        target ===
        desktopDraggedCard
    ) {
        return;
    }

    const rect =
        target.getBoundingClientRect();

    /*
       列表模式
    */

    if (
        bookGrid.classList.contains(
            "list-view"
        )
    ) {

        if (
            event.clientY <
            rect.top +
            rect.height / 2
        ) {

            target.parentNode.insertBefore(
                desktopDraggedCard,
                target
            );

        } else {

            target.parentNode.insertBefore(
                desktopDraggedCard,
                target.nextSibling
            );
        }

        return;
    }


    /*
       网格模式

       根据鼠标距离卡片中心的位置
       判断插入方向。
    */

    const centerX =
        rect.left +
        rect.width / 2;

    const centerY =
        rect.top +
        rect.height / 2;

    const distanceX =
        Math.abs(
            event.clientX -
            centerX
        );

    const distanceY =
        Math.abs(
            event.clientY -
            centerY
        );

    if (distanceX > distanceY) {

        if (
            event.clientX <
            centerX
        ) {

            target.parentNode.insertBefore(
                desktopDraggedCard,
                target
            );

        } else {

            target.parentNode.insertBefore(
                desktopDraggedCard,
                target.nextSibling
            );
        }

    } else {

        if (
            event.clientY <
            centerY
        ) {

            target.parentNode.insertBefore(
                desktopDraggedCard,
                target
            );

        } else {

            target.parentNode.insertBefore(
                desktopDraggedCard,
                target.nextSibling
            );
        }
    }
}


/* ==================================================
   桌面放下
================================================== */

function handleDrop(event) {

    if (!isSorting) return;

    event.preventDefault();
}


/* ==================================================
   桌面拖动结束
================================================== */

function handleDragEnd() {

    if (desktopDraggedCard) {

        desktopDraggedCard.classList.remove(
            "touch-dragging"
        );
    }

    desktopDraggedCard =
        null;

    updateBookOrder();
}


/* ==================================================
   手机排序按下
================================================== */

function handleSortPointerDown(event) {

    if (!isSorting) return;

    /*
       鼠标交给 HTML5 drag。
    */

    if (
        event.pointerType ===
        "mouse"
    ) {
        return;
    }

    const card =
        event.currentTarget;

    touchDraggedCard =
        card;

    touchPointerId =
        event.pointerId;

    touchStartX =
        event.clientX;

    touchStartY =
        event.clientY;

    touchSortTimer =
        setTimeout(
            function() {

                beginTouchSorting(
                    event
                );

            },
            350
        );
}


/* ==================================================
   手机排序移动
================================================== */

function handleSortPointerMove(event) {

    if (!isSorting) return;

    if (
        event.pointerId !==
        touchPointerId
    ) {
        return;
    }

    if (!touchSorting) {

        const dx =
            event.clientX -
            touchStartX;

        const dy =
            event.clientY -
            touchStartY;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (distance > 10) {

            clearTimeout(
                touchSortTimer
            );

            touchSortTimer =
                null;
        }

        return;
    }

    event.preventDefault();

    moveTouchSorting(
        event.clientX,
        event.clientY
    );
}


/* ==================================================
   手机排序抬起
================================================== */

function handleSortPointerUp(event) {

    if (
        event.pointerId !==
        touchPointerId
    ) {
        return;
    }

    clearTimeout(
        touchSortTimer
    );

    touchSortTimer =
        null;

    if (touchSorting) {

        finishTouchSorting();
    }

    touchDraggedCard =
        null;

    touchPointerId =
        null;
}


/* ==================================================
   手机排序取消
================================================== */

function handleSortPointerCancel(event) {

    if (
        event.pointerId !==
        touchPointerId
    ) {
        return;
    }

    clearTimeout(
        touchSortTimer
    );

    touchSortTimer =
        null;

    if (touchSorting) {

        cancelTouchSorting();
    }

    touchDraggedCard =
        null;

    touchPointerId =
        null;
}


/* ==================================================
   开始手机拖动
================================================== */

function beginTouchSorting(event) {

    if (!isSorting) return;

    if (!touchDraggedCard) return;

    touchSorting =
        true;

    touchDraggedCard.classList.add(
        "touch-dragging"
    );

    /*
       不创建 placeholder。
       不改变书架原来的布局。
    */

    touchDraggedCard.style.opacity =
        "0.65";

    touchDraggedCard.style.pointerEvents =
        "none";

    document.body.classList.add(
        "touch-sorting"
    );

    try {

        touchDraggedCard.setPointerCapture(
            event.pointerId
        );

    } catch (error) {
        // 忽略不支持 Pointer Capture 的浏览器
    }

    event.preventDefault();
}


/* ==================================================
   手机移动书籍
================================================== */

function moveTouchSorting(
    clientX,
    clientY
) {

    if (
        !touchSorting ||
        !touchDraggedCard ||
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

                return card !==
                    touchDraggedCard;

            }
        );

    if (cards.length === 0) {
        return;
    }


    /*
       找到手指当前位置
       最接近的卡片。
    */

    let targetCard =
        null;

    let smallestDistance =
        Infinity;

    cards.forEach(
        function(card) {

            const rect =
                card.getBoundingClientRect();

            const centerX =
                rect.left +
                rect.width / 2;

            const centerY =
                rect.top +
                rect.height / 2;

            const dx =
                clientX -
                centerX;

            const dy =
                clientY -
                centerY;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            if (
                distance <
                smallestDistance
            ) {

                smallestDistance =
                    distance;

                targetCard =
                    card;
            }
        }
    );

    if (!targetCard) return;


    /*
       判断插入目标的前面还是后面。
    */

    const rect =
        targetCard.getBoundingClientRect();

    let insertBefore;


    /*
       列表模式
    */

    if (
        bookGrid.classList.contains(
            "list-view"
        )
    ) {

        insertBefore =
            clientY <
            rect.top +
            rect.height / 2;

    } else {

        /*
           网格模式。

           主要根据 X 判断，
           如果 X 差距很小，
           再根据 Y 判断。
        */

        const centerX =
            rect.left +
            rect.width / 2;

        const centerY =
            rect.top +
            rect.height / 2;

        const dx =
            Math.abs(
                clientX -
                centerX
            );

        const dy =
            Math.abs(
                clientY -
                centerY
            );

        if (dx >= dy) {

            insertBefore =
                clientX <
                centerX;

        } else {

            insertBefore =
                clientY <
                centerY;
        }
    }


    /*
       移动真正的卡片。

       不创建占位元素，
       因此不会改变原来的 CSS 布局。
    */

    if (insertBefore) {

        if (
            targetCard.previousSibling !==
            touchDraggedCard
        ) {

            targetCard.parentNode.insertBefore(
                touchDraggedCard,
                targetCard
            );
        }

    } else {

        if (
            targetCard.nextSibling !==
            touchDraggedCard
        ) {

            targetCard.parentNode.insertBefore(
                touchDraggedCard,
                targetCard.nextSibling
            );
        }
    }
}


/* ==================================================
   完成手机拖动
================================================== */

function finishTouchSorting() {

    if (touchDraggedCard) {

        touchDraggedCard.classList.remove(
            "touch-dragging"
        );

        touchDraggedCard.style.opacity =
            "";

        touchDraggedCard.style.pointerEvents =
            "";
    }

    touchSorting =
        false;

    document.body.classList.remove(
        "touch-sorting"
    );

    updateBookOrder();
}


/* ==================================================
   取消手机拖动
================================================== */

function cancelTouchSorting() {

    if (touchDraggedCard) {

        touchDraggedCard.classList.remove(
            "touch-dragging"
        );

        touchDraggedCard.style.opacity =
            "";

        touchDraggedCard.style.pointerEvents =
            "";
    }

    touchSorting =
        false;

    document.body.classList.remove(
        "touch-sorting"
    );
}


/* ==================================================
   更新书籍顺序
================================================== */

function updateBookOrder() {

    if (!bookGrid) return;

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

            const id =
                card.dataset.bookId;

            const book =
                getBookById(id);

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

    if (touchSorting) {

        finishTouchSorting();
    }

    updateBookOrder();

    if (typeof saveBooks === "function") {

        saveBooks();
    }

    isSorting =
        false;

    cancelTouchSorting();

    desktopDraggedCard =
        null;

    if (bookGrid) {

        bookGrid.classList.remove(
            "sorting"
        );
    }

    const sortHint =
        document.getElementById(
            "sortHint"
        );

    if (sortHint) {

        sortHint.style.display =
            "none";
    }

    cleanupSortingCards();

    renderBooks();

    applyViewClass();
}


/* ==================================================
   清除排序事件
================================================== */

function cleanupSortingCards() {

    if (!bookGrid) return;

    const cards =
        bookGrid.querySelectorAll(
            ".book-card"
        );

    cards.forEach(
        function(card) {

            card.draggable =
                false;

            card.removeEventListener(
                "dragstart",
                handleDragStart
            );

            card.removeEventListener(
                "dragover",
                handleDragOver
            );

            card.removeEventListener(
                "drop",
                handleDrop
            );

            card.removeEventListener(
                "dragend",
                handleDragEnd
            );

            card.removeEventListener(
                "pointerdown",
                handleSortPointerDown
            );

            card.removeEventListener(
                "pointermove",
                handleSortPointerMove
            );

            card.removeEventListener(
                "pointerup",
                handleSortPointerUp
            );

            card.removeEventListener(
                "pointercancel",
                handleSortPointerCancel
            );
        }
    );
}


/* ==================================================
   绑定书架事件
================================================== */

function bindShelfEvents() {

    if (createButton) {

        createButton.addEventListener(
            "click",
            toggleCreateMenu
        );
    }


    if (settingsButton) {

        settingsButton.addEventListener(
            "click",
            toggleSettingsMenu
        );
    }


    if (createBookButton) {

        createBookButton.addEventListener(
            "click",
            createNewBook
        );
    }


    if (createCollectionButton) {

        createCollectionButton.addEventListener(
            "click",
            createNewCollection
        );
    }


    if (gridButton) {

        gridButton.addEventListener(
            "click",
            switchToGrid
        );
    }


    if (listButton) {

        listButton.addEventListener(
            "click",
            switchToList
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


    if (bookMenuOverlay) {

        bookMenuOverlay.addEventListener(
            "click",
            closeContextMenu
        );
    }


    if (contextEdit) {

        contextEdit.addEventListener(
            "click",
            editCurrentBook
        );
    }


    if (contextSort) {

        contextSort.addEventListener(
            "click",
            function() {

                closeContextMenu();

                startSorting();
            }
        );
    }


    if (contextGroup) {

        contextGroup.addEventListener(
            "click",
            function() {

                /*
                   先保存 ID。
                   因为 closeContextMenu()
                   会把 currentBookId 清空。
                */

                const id =
                    currentBookId;

                closeContextMenu();

                if (
                    typeof moveBookToGroup ===
                    "function"
                ) {

                    moveBookToGroup(id);

                } else {

                    alert(
                        "分组功能暂未实现"
                    );
                }
            }
        );
    }


    if (contextDelete) {

        contextDelete.addEventListener(
            "click",
            function() {

                const id =
                    currentBookId;

                closeContextMenu();

                if (id) {

                    deleteBook(id);
                }
            }
        );
    }


    document.addEventListener(
        "click",
        function(event) {

            if (
                !event.target.closest(
                    ".menu"
                ) &&
                !event.target.closest(
                    ".create-button"
                ) &&
                !event.target.closest(
                    ".settings-button"
                )
            ) {

                closeMenus();
            }
        }
    );


    if (bookGrid) {

        bookGrid.addEventListener(
            "click",
            handleBookClick
        );

        bookGrid.addEventListener(
            "pointerdown",
            handleBookPointerDown
        );

        bookGrid.addEventListener(
            "pointermove",
            handleBookPointerMove
        );

        bookGrid.addEventListener(
            "pointerup",
            handleBookPointerUp
        );

        bookGrid.addEventListener(
            "pointercancel",
            handleBookPointerCancel
        );
    }
}


/* ==================================================
   书籍点击
================================================== */

function handleBookClick(event) {

    if (isSorting) {
        return;
    }

    const deleteButton =
        event.target.closest(
            ".delete-book-button"
        );

    if (deleteButton) {

        const id =
            deleteButton.dataset.bookId;

        deleteBook(id);

        return;
    }

    const card =
        event.target.closest(
            ".book-card"
        );

    if (!card) return;

    const bookId =
        card.dataset.bookId;

    openBook(bookId);
}


/* ==================================================
   普通书籍触摸
================================================== */

function handleBookPointerDown(event) {

    if (isSorting) return;

    if (
        event.target.closest(
            ".delete-book-button"
        )
    ) {
        return;
    }

    const card =
        event.target.closest(
            ".book-card"
        );

    if (!card) return;

    startLongPress(
        event,
        card
    );
}


function handleBookPointerMove(event) {

    if (isSorting) return;

    cancelLongPress();
}


function handleBookPointerUp(event) {

    if (isSorting) return;

    cancelLongPress();
}


function handleBookPointerCancel(event) {

    if (isSorting) return;

    cancelLongPress();
}


/* ==================================================
   底部导航
================================================== */

if (shelfNav) {

    shelfNav.addEventListener(
        "click",
        function() {

            console.log(
                "书架"
            );
        }
    );
}


if (toolsNav) {

    toolsNav.addEventListener(
        "click",
        function() {

            console.log(
                "工具"
            );
        }
    );
}


if (meNav) {

    meNav.addEventListener(
        "click",
        function() {

            console.log(
                "我的"
            );
        }
    );
}


/* ==================================================
   启动
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initShelf
);
