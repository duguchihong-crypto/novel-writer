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
   手机排序
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

    /*
       如果项目已经有新建书籍函数，
       优先调用。
    */

    if (
        typeof createBook ===
        "function"
    ) {
        createBook();
        return;
    }

    /*
       如果没有，
       使用最基础的方式创建一本书。
    */

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

    if (
        typeof createCollection ===
        "function"
    ) {
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

    /*
       如果项目以后有编辑页面，
       可以在这里跳转。

       当前暂时使用已有函数。
    */

    if (
        typeof editBook ===
        "function"
    ) {
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

    closeContextMenu();

    if (!currentBookId) return;

    if (
        typeof editBook ===
        "function"
    ) {
        editBook(currentBookId);
        return;
    }

    openBook(currentBookId);
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

    clearTimeout(
        longPressTimer
    );

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
   排序
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

    /*
       排序开始时，
       给每本书绑定排序功能。
    */

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

            card.classList.add(
                "sorting-card"
            );

            /*
               电脑鼠标排序
            */

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

            /*
               手机触摸排序
            */

            card.addEventListener(
                "pointerdown",
                handlePointerDown
            );

            card.addEventListener(
                "pointermove",
                handlePointerMove
            );

            card.addEventListener(
                "pointerup",
                handlePointerUp
            );

            card.addEventListener(
                "pointercancel",
                handlePointerCancel
            );

        }
    );
}


/* ==================================================
   电脑鼠标排序
================================================== */

let desktopDraggedCard = null;


function handleDragStart(event) {

    if (!isSorting) {
        event.preventDefault();
        return;
    }

    desktopDraggedCard =
        event.currentTarget;

    desktopDraggedCard.classList.add(
        "touch-dragging"
    );

    event.dataTransfer.effectAllowed =
        "move";

    event.dataTransfer.setData(
        "text/plain",
        desktopDraggedCard.dataset.bookId
    );
}


function handleDragOver(event) {

    if (!isSorting) return;

    event.preventDefault();

    const target =
        event.currentTarget;

    if (
        !desktopDraggedCard ||
        target === desktopDraggedCard
    ) {
        return;
    }

    const rect =
        target.getBoundingClientRect();

    const x =
        event.clientX -
        rect.left;

    const y =
        event.clientY -
        rect.top;

    const centerX =
        rect.width / 2;

    const centerY =
        rect.height / 2;

    /*
       网格模式：
       根据鼠标所在位置决定前后。
    */

    if (
        bookGrid.classList.contains(
            "grid-view"
        )
    ) {

        /*
           如果鼠标在卡片上半区域，
           插到前面。
        */

        if (
            y < centerY
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
       列表模式
    */

    if (
        y < centerY
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


function handleDrop(event) {

    if (!isSorting) return;

    event.preventDefault();
}


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
   手机 / 触摸排序
================================================== */

function handlePointerDown(event) {

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

    sortingPointerId =
        event.pointerId;

    sortingStartX =
        event.clientX;

    sortingStartY =
        event.clientY;

    sortingPressTimer =
        setTimeout(
            function() {

                startTouchSorting(
                    event
                );

            },
            350
        );
}


function handlePointerMove(event) {

    if (!isSorting) return;

    if (
        sortingPointerId !==
        event.pointerId
    ) {
        return;
    }

    /*
       长按尚未开始时，
       如果手指移动太多，
       取消长按。
    */

    if (
        !sortingDragging
    ) {

        const dx =
            event.clientX -
            sortingStartX;

        const dy =
            event.clientY -
            sortingStartY;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (distance > 10) {

            clearTimeout(
                sortingPressTimer
            );

            sortingPressTimer =
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


function handlePointerUp(event) {

    if (
        sortingPointerId !==
        event.pointerId
    ) {
        return;
    }

    clearTimeout(
        sortingPressTimer
    );

    sortingPressTimer =
        null;

    if (sortingDragging) {

        finishTouchSorting();
    }

    sortingPointerId =
        null;
}


function handlePointerCancel(event) {

    if (
        sortingPointerId !==
        event.pointerId
    ) {
        return;
    }

    clearTimeout(
        sortingPressTimer
    );

    sortingPressTimer =
        null;

    if (sortingDragging) {

        cancelTouchSorting();
    }

    sortingPointerId =
        null;
}


/* ==================================================
   开始手机拖动
================================================== */

function startTouchSorting(event) {

    if (!isSorting) return;

    const card =
        event.currentTarget;

    if (!card) return;

    sortingDraggedCard =
        card;

    sortingDragging =
        true;

    /*
       记录原尺寸
    */

    const rect =
        card.getBoundingClientRect();

    /*
       创建占位卡片
    */

    sortingPlaceholder =
        document.createElement(
            "div"
        );

    sortingPlaceholder.className =
        "book-card sorting-placeholder";

    sortingPlaceholder.style.width =
        rect.width + "px";

    sortingPlaceholder.style.height =
        rect.height + "px";

    /*
       把占位卡片放在原来的位置
    */

    card.parentNode.insertBefore(
        sortingPlaceholder,
        card
    );

    /*
       当前卡片进入拖动状态
    */

    card.classList.add(
        "touch-dragging"
    );

    /*
       防止页面滚动
    */

    document.body.classList.add(
        "touch-sorting"
    );

    /*
       禁止当前卡片影响目标检测
    */

    card.style.pointerEvents =
        "none";

    event.preventDefault();

    /*
       捕获 pointer
    */

    try {

        card.setPointerCapture(
            event.pointerId
        );

    } catch (error) {

        // 某些浏览器不支持时忽略
    }
}


/* ==================================================
   移动手机书籍
================================================== */

function moveTouchSorting(
    clientX,
    clientY
) {

    if (
        !sortingDragging ||
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
                    sortingDraggedCard &&
                    card !==
                    sortingPlaceholder
                );

            }
        );

    if (cards.length === 0) {
        return;
    }

    /*
       找到手指当前最接近的书。
    */

    let nearestCard =
        null;

    let nearestDistance =
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
                nearestDistance
            ) {

                nearestDistance =
                    distance;

                nearestCard =
                    card;
            }

        }
    );

    if (!nearestCard) {
        return;
    }

    const rect =
        nearestCard.getBoundingClientRect();

    /*
       判断应该放在目标前面还是后面。
    */

    let insertBefore =
        false;

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

           同一行优先判断 X。
           不同行判断 Y。
        */

        const centerY =
            rect.top +
            rect.height / 2;

        const centerX =
            rect.left +
            rect.width / 2;

        const rowThreshold =
            rect.height * 0.45;

        if (
            Math.abs(
                clientY -
                centerY
            ) <
            rowThreshold
        ) {

            insertBefore =
                clientX <
                centerX;

        } else {

            insertBefore =
                clientY <
                centerY;
        }
    }

    if (insertBefore) {

        if (
            sortingPlaceholder !==
            nearestCard.previousSibling
        ) {

            nearestCard.parentNode.insertBefore(
                sortingPlaceholder,
                nearestCard
            );
        }

    } else {

        if (
            nearestCard.nextSibling !==
            sortingPlaceholder
        ) {

            nearestCard.parentNode.insertBefore(
                sortingPlaceholder,
                nearestCard.nextSibling
            );
        }
    }
}


/* ==================================================
   完成手机拖动
================================================== */

function finishTouchSorting() {

    if (
        !sortingDraggedCard ||
        !sortingPlaceholder
    ) {
        cleanupTouchSorting();
        return;
    }

    /*
       把真正的书放回占位位置
    */

    sortingPlaceholder.parentNode.insertBefore(
        sortingDraggedCard,
        sortingPlaceholder
    );

    /*
       删除占位
    */

    sortingPlaceholder.remove();

    sortingPlaceholder =
        null;

    /*
       恢复书籍状态
    */

    sortingDraggedCard.classList.remove(
        "touch-dragging"
    );

    sortingDraggedCard.style.pointerEvents =
        "";

    /*
       更新 books 数组
    */

    updateBookOrder();

    cleanupTouchSorting();
}


function cancelTouchSorting() {

    if (
        sortingDraggedCard &&
        sortingPlaceholder
    ) {

        /*
           取消时，
           把书放回占位位置。
        */

        sortingPlaceholder.parentNode.insertBefore(
            sortingDraggedCard,
            sortingPlaceholder
        );

        sortingPlaceholder.remove();
    }

    cleanupTouchSorting();
}


/* ==================================================
   清理手机排序状态
================================================== */

function cleanupTouchSorting() {

    clearTimeout(
        sortingPressTimer
    );

    sortingPressTimer =
        null;

    if (sortingDraggedCard) {

        sortingDraggedCard.classList.remove(
            "touch-dragging"
        );

        sortingDraggedCard.style.pointerEvents =
            "";
    }

    if (sortingPlaceholder) {

        sortingPlaceholder.remove();
    }

    sortingDraggedCard =
        null;

    sortingPlaceholder =
        null;

    sortingDragging =
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
                newBooks.push(book);
            }

        }
    );

    /*
       只有顺序发生变化时才替换。
    */

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

    /*
       如果此时仍然有手机拖动，
       先结束拖动。
    */

    if (sortingDragging) {
        finishTouchSorting();
    }

    /*
       再次读取 DOM 顺序。
    */

    updateBookOrder();

    /*
       保存。
    */

    if (
        typeof saveBooks ===
        "function"
    ) {
        saveBooks();
    }

    /*
       退出排序状态。
    */

    isSorting = false;

    cleanupTouchSorting();

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

    /*
       清除排序事件。
    */

    cleanupSortingCards();

    /*
       重新渲染。
    */

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

            card.classList.remove(
                "sorting-card"
            );

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
                handlePointerDown
            );

            card.removeEventListener(
                "pointermove",
                handlePointerMove
            );

            card.removeEventListener(
                "pointerup",
                handlePointerUp
            );

            card.removeEventListener(
                "pointercancel",
                handlePointerCancel
            );

        }
    );
}


/* ==================================================
   绑定书架事件
================================================== */

function bindShelfEvents() {

    /* ------------------------------
       新建
    ------------------------------ */

    if (createButton) {

        createButton.addEventListener(
            "click",
            toggleCreateMenu
        );
    }


    /* ------------------------------
       设置
    ------------------------------ */

    if (settingsButton) {

        settingsButton.addEventListener(
            "click",
            toggleSettingsMenu
        );
    }


    /* ------------------------------
       新建书籍
    ------------------------------ */

    if (createBookButton) {

        createBookButton.addEventListener(
            "click",
            createNewBook
        );
    }


    /* ------------------------------
       新建分组
    ------------------------------ */

    if (createCollectionButton) {

        createCollectionButton.addEventListener(
            "click",
            createNewCollection
        );
    }


    /* ------------------------------
       网格
    ------------------------------ */

    if (gridButton) {

        gridButton.addEventListener(
            "click",
            switchToGrid
        );
    }


    /* ------------------------------
       列表
    ------------------------------ */

    if (listButton) {

        listButton.addEventListener(
            "click",
            switchToList
        );
    }


    /* ------------------------------
       排序
    ------------------------------ */

    if (sortBooksButton) {

        sortBooksButton.addEventListener(
            "click",
            function() {

                startSorting();

            }
        );
    }


    /* ------------------------------
       完成排序
    ------------------------------ */

    if (finishSortButton) {

        finishSortButton.addEventListener(
            "click",
            finishSorting
        );
    }


    /* ------------------------------
       遮罩
    ------------------------------ */

    if (bookMenuOverlay) {

        bookMenuOverlay.addEventListener(
            "click",
            closeContextMenu
        );
    }


    /* ------------------------------
       编辑
    ------------------------------ */

    if (contextEdit) {

        contextEdit.addEventListener(
            "click",
            editCurrentBook
        );
    }


    /* ------------------------------
       长按菜单排序
    ------------------------------ */

    if (contextSort) {

        contextSort.addEventListener(
            "click",
            function() {

                closeContextMenu();

                startSorting();

            }
        );
    }


    /* ------------------------------
       移至分组
    ------------------------------ */

    if (contextGroup) {

        contextGroup.addEventListener(
            "click",
            function() {

                closeContextMenu();

                if (
                    typeof moveBookToGroup ===
                    "function"
                ) {

                    moveBookToGroup(
                        currentBookId
                    );

                } else {

                    alert(
                        "分组功能暂未实现"
                    );
                }

            }
        );
    }


    /* ------------------------------
       删除
    ------------------------------ */

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


    /* ------------------------------
       页面点击
    ------------------------------ */

    document.addEventListener(
        "click",
        function(event) {

            /*
               如果点击的不是菜单，
               关闭顶部菜单。
            */

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


    /* ------------------------------
       书籍事件
    ------------------------------ */

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

    /*
       删除按钮
    */

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


    /*
       封面 / 书名 / 卡片
    */

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

    /*
       点击删除按钮时，
       不启动长按。
    */

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
