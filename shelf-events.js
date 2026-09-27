/* ==================================================
   书架事件
================================================== */


/*
 * ==================================================
 * 页面元素
 * ==================================================
 */

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

const gridViewButton =
    document.getElementById("gridViewButton");

const listViewButton =
    document.getElementById("listViewButton");

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

const shelfNavButton =
    document.getElementById("shelfNavButton");

const toolsNavButton =
    document.getElementById("toolsNavButton");

const meNavButton =
    document.getElementById("meNavButton");


/*
 * ==================================================
 * 页面初始化
 * ==================================================
 */

function initShelf() {

    /*
     * 读取书籍
     */
    loadBooks();

    /*
     * 读取网格 / 列表模式
     */
    loadShelfViewMode();

    /*
     * 显示书籍
     */
    renderBooks();

    /*
     * 应用显示模式
     */
    applyShelfViewMode();

    /*
     * 绑定所有事件
     */
    bindShelfEvents();
}


/*
 * ==================================================
 * 绑定所有事件
 * ==================================================
 */

function bindShelfEvents() {

    /*
     * 新建按钮
     */
    if (createButton) {

        createButton.addEventListener(
            "click",
            toggleCreateMenu
        );
    }


    /*
     * 设置按钮
     */
    if (settingsButton) {

        settingsButton.addEventListener(
            "click",
            toggleSettingsMenu
        );
    }


    /*
     * 新建书籍
     */
    if (createBookButton) {

        createBookButton.addEventListener(
            "click",
            createNewBook
        );
    }


    /*
     * 新建组合
     */
    if (createCollectionButton) {

        createCollectionButton.addEventListener(
            "click",
            createCollection
        );
    }


    /*
     * 排序
     */
    if (sortBooksButton) {

        sortBooksButton.addEventListener(
            "click",
            startSorting
        );
    }


    /*
     * 完成排序
     */
    if (finishSortButton) {

        finishSortButton.addEventListener(
            "click",
            finishSorting
        );
    }


    /*
     * 网格
     */
    if (gridViewButton) {

        gridViewButton.addEventListener(
            "click",
            setGridView
        );
    }


    /*
     * 列表
     */
    if (listViewButton) {

        listViewButton.addEventListener(
            "click",
            setListView
        );
    }


    /*
     * 书架事件
     */
    if (bookGrid) {

        bookGrid.addEventListener(
            "click",
            handleBookGridClick
        );

        /*
         * 长按
         */
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

        /*
         * 防止手机长按出现系统菜单
         */
        bookGrid.addEventListener(
            "contextmenu",
            handleContextMenu
        );
    }


    /*
     * 长按菜单
     */
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


    /*
     * 遮罩
     */
    if (bookMenuOverlay) {

        bookMenuOverlay.addEventListener(
            "click",
            closeBookContextMenu
        );
    }


    /*
     * 底部导航
     */
    if (shelfNavButton) {

        shelfNavButton.addEventListener(
            "click",
            function() {

                window.location.href =
                    "index.html";
            }
        );
    }


    if (toolsNavButton) {

        toolsNavButton.addEventListener(
            "click",
            function() {

                alert("工具功能正在开发中。");
            }
        );
    }


    if (meNavButton) {

        meNavButton.addEventListener(
            "click",
            function() {

                alert("我的功能正在开发中。");
            }
        );
    }


    /*
     * 点击页面其他地方
     */
    document.addEventListener(
        "click",
        handleDocumentClick
    );
}


/*
 * ==================================================
 * 新建菜单
 * ==================================================
 */

function toggleCreateMenu(event) {

    event.stopPropagation();

    const menu =
        document.getElementById("createMenu");

    if (!menu) {
        return;
    }

    menu.classList.toggle("show");

    /*
     * 关闭设置菜单
     */
    const settingsMenu =
        document.getElementById("settingsMenu");

    if (settingsMenu) {
        settingsMenu.classList.remove("show");
    }
}


/*
 * ==================================================
 * 设置菜单
 * ==================================================
 */

function toggleSettingsMenu(event) {

    event.stopPropagation();

    const menu =
        document.getElementById("settingsMenu");

    if (!menu) {
        return;
    }

    menu.classList.toggle("show");

    /*
     * 关闭新建菜单
     */
    const createMenu =
        document.getElementById("createMenu");

    if (createMenu) {
        createMenu.classList.remove("show");
    }
}


/*
 * ==================================================
 * 点击页面其他地方
 * ==================================================
 */

function handleDocumentClick(event) {

    const createMenu =
        document.getElementById("createMenu");

    const settingsMenu =
        document.getElementById("settingsMenu");

    const createArea =
        document.getElementById("createArea");

    const settingsArea =
        document.getElementById("settingsArea");


    /*
     * 关闭新建菜单
     */
    if (
        createMenu &&
        createArea &&
        !createArea.contains(event.target)
    ) {

        createMenu.classList.remove("show");
    }


    /*
     * 关闭设置菜单
     */
    if (
        settingsMenu &&
        settingsArea &&
        !settingsArea.contains(event.target)
    ) {

        settingsMenu.classList.remove("show");
    }
}


/*
 * ==================================================
 * 新建小说
 * ==================================================
 */

function createNewBook() {

    closeAllMenus();

    window.location.href =
        "create-book.html";
}


/*
 * ==================================================
 * 新建组合
 * ==================================================
 */

function createCollection() {

    closeAllMenus();

    alert("组合功能正在开发中。");
}


/*
 * ==================================================
 * 网格模式
 * ==================================================
 */

function setGridView() {

    closeAllMenus();

    shelfViewMode = "grid";

    saveShelfViewMode("grid");

    applyShelfViewMode();

    renderSortingMode();
}


/*
 * ==================================================
 * 列表模式
 * ==================================================
 */

function setListView() {

    closeAllMenus();

    shelfViewMode = "list";

    saveShelfViewMode("list");

    applyShelfViewMode();

    renderSortingMode();
}


/*
 * ==================================================
 * 书籍点击
 * ==================================================
 */

function handleBookGridClick(event) {

    /*
     * 删除按钮
     */
    const deleteButton =
        event.target.closest(".book-delete");

    if (deleteButton) {

        event.stopPropagation();

        const bookId =
            deleteButton.dataset.bookId;

        deleteBook(bookId);

        return;
    }


    /*
     * 如果刚刚触发过长按
     * 不再执行点击
     */
    if (longPressTriggered) {

        longPressTriggered = false;

        return;
    }


    /*
     * 排序模式下
     * 点击不打开书籍
     */
    if (isSorting) {
        return;
    }


    /*
     * 找到书卡
     */
    const card =
        event.target.closest(".book-card");

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


    /*
     * 点击封面
     * → 编辑书籍
     */
    if (
        event.target.closest(".book-cover")
    ) {

        openEditBook(bookId);

        return;
    }


    /*
     * 点击书名 / 信息
     * → 打开书籍
     */
    openBook(bookId);
}


/*
 * ==================================================
 * 打开小说
 * ==================================================
 */

function openBook(bookId) {

    const book =
        getBookById(bookId);

    if (!book) {
        return;
    }


    /*
     * 记录当前小说
     */
    localStorage.setItem(
        "currentBookId",
        bookId
    );


    /*
     * 进入小说结构页
     */
    window.location.href =
        "book.html";
}


/*
 * ==================================================
 * 编辑小说
 * ==================================================
 */

function openEditBook(bookId) {

    const book =
        getBookById(bookId);

    if (!book) {
        return;
    }


    localStorage.setItem(
        "currentBookId",
        bookId
    );


    /*
     * 编辑页面
     */
    window.location.href =
        "edit-book.html";
}


/*
 * ==================================================
 * 删除小说
 * ==================================================
 */

function deleteBook(bookId) {

    const book =
        getBookById(bookId);

    if (!book) {
        return;
    }


    const title =
        book.title || "未命名小说";


    const confirmed =
        confirm(
            "确定要删除《" +
            title +
            "》吗？\n\n删除后无法恢复。"
        );


    if (!confirmed) {
        return;
    }


    books =
        books.filter(function(item) {

            return String(item.id) !==
                   String(bookId);
        });


    saveBooks();

    renderBooks();

    renderSortingMode();
}


/*
 * ==================================================
 * 长按：开始
 * ==================================================
 */

function handlePointerDown(event) {

    /*
     * 排序模式不使用长按菜单
     */
    if (isSorting) {
        return;
    }


    /*
     * 鼠标右键不触发长按
     */
    if (
        event.pointerType === "mouse" &&
        event.button !== 0
    ) {

        return;
    }


    const card =
        event.target.closest(".book-card");

    if (!card) {
        return;
    }


    /*
     * 删除按钮不触发长按
     */
    if (
        event.target.closest(".book-delete")
    ) {

        return;
    }


    /*
     * 记录状态
     */
    pressedCard = card;

    pressStartX = event.clientX;
    pressStartY = event.clientY;

    longPressTriggered = false;


    /*
     * 取消之前的计时器
     */
    clearTimeout(longPressTimer);


    /*
     * 600ms 后触发长按
     */
    longPressTimer =
        setTimeout(function() {

            if (!pressedCard) {
                return;
            }


            const bookId =
                pressedCard.dataset.bookId;


            /*
             * 记录当前长按的书
             */
            longPressBookId =
                bookId;


            /*
             * 标记已经触发
             */
            longPressTriggered = true;


            /*
             * 显示菜单
             */
            showBookContextMenu(
                bookId,
                pressedCard
            );


            /*
             * 轻微震动
             *
             * iPhone Safari 是否执行
             * 取决于浏览器环境
             */
            if (
                navigator.vibrate
            ) {

                navigator.vibrate(30);
            }


            /*
             * 清除
             */
            longPressTimer = null;

        }, LONG_PRESS_TIME);
}


/*
 * ==================================================
 * 长按：移动
 * ==================================================
 */

function handlePointerMove(event) {

    if (!pressedCard) {
        return;
    }


    const distanceX =
        Math.abs(
            event.clientX - pressStartX
        );

    const distanceY =
        Math.abs(
            event.clientY - pressStartY
        );


    /*
     * 手指移动太远
     * 说明用户是在滑动
     */
    if (
        distanceX > MOVE_CANCEL_DISTANCE ||
        distanceY > MOVE_CANCEL_DISTANCE
    ) {

        cancelLongPress();
    }
}


/*
 * ==================================================
 * 长按：结束
 * ==================================================
 */

function handlePointerUp() {

    clearTimeout(longPressTimer);

    longPressTimer = null;

    pressedCard = null;
}


/*
 * ==================================================
 * 长按：离开
 * ==================================================
 */

function handlePointerLeave(event) {

    /*
     * 鼠标离开时取消
     *
     * touch / pen 不在这里强制取消
     */
    if (
        event.pointerType === "mouse"
    ) {

        cancelLongPress();
    }
}


/*
 * ==================================================
 * 取消长按
 * ==================================================
 */

function cancelLongPress() {

    clearTimeout(longPressTimer);

    longPressTimer = null;

    pressedCard = null;
}


/*
 * ==================================================
 * 系统右键 / 长按菜单
 * ==================================================
 */

function handleContextMenu(event) {

    /*
     * 阻止浏览器自己的菜单
     */
    event.preventDefault();
}


/*
 * ==================================================
 * 显示书籍长按菜单
 * ==================================================
 */

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


    /*
     * 菜单标题
     */
    if (contextMenuTitle) {

        contextMenuTitle.textContent =
            book.title || "未命名小说";
    }


    /*
     * 显示遮罩
     */
    if (bookMenuOverlay) {

        bookMenuOverlay.classList.add(
            "show"
        );
    }


    /*
     * 显示菜单
     */
    if (bookContextMenu) {

        bookContextMenu.classList.add(
            "show"
        );
    }


    /*
     * 防止当前卡片继续保持按压状态
     */
    if (card) {

        card.classList.add(
            "long-pressed"
        );

        setTimeout(function() {

            card.classList.remove(
                "long-pressed"
            );

        }, 300);
    }
}


/*
 * ==================================================
 * 关闭长按菜单
 * ==================================================
 */

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


    longPressBookId = null;
}


/*
 * ==================================================
 * 长按菜单：编辑
 * ==================================================
 */

function contextEditBook() {

    const bookId =
        longPressBookId;

    closeBookContextMenu();

    if (!bookId) {
        return;
    }

    openEditBook(bookId);
}


/*
 * ==================================================
 * 长按菜单：书架排序
 * ==================================================
 */

function contextSortBook() {

    const bookId =
        longPressBookId;

    closeBookContextMenu();

    if (!bookId) {
        return;
    }


    /*
     * 进入排序模式
     */
    startSorting();


    /*
     * 让这本书进入视觉上的
     * 当前拖动状态
     */
    const card =
        document.querySelector(
            '.book-card[data-book-id="' +
            CSS.escape(String(bookId)) +
            '"]'
        );


    if (card) {

        card.classList.add(
            "sorting-target"
        );

        setTimeout(function() {

            card.classList.remove(
                "sorting-target"
            );

        }, 600);
    }
}


/*
 * ==================================================
 * 长按菜单：移至分组
 * ==================================================
 */

function contextMoveBook() {

    const bookId =
        longPressBookId;

    closeBookContextMenu();

    if (!bookId) {
        return;
    }


    /*
     * 分组系统以后再接入
     */
    alert(
        "移动到分组功能正在开发中。"
    );
}


/*
 * ==================================================
 * 长按菜单：删除
 * ==================================================
 */

function contextDeleteBook() {

    const bookId =
        longPressBookId;

    closeBookContextMenu();

    if (!bookId) {
        return;
    }


    deleteBook(bookId);
}


/*
 * ==================================================
 * 关闭所有菜单
 * ==================================================
 */

function closeAllMenus() {

    const createMenu =
        document.getElementById("createMenu");

    const settingsMenu =
        document.getElementById("settingsMenu");


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


/*
 * ==================================================
 * 开始排序
 * ==================================================
 */

function startSorting() {

    closeAllMenus();

    closeBookContextMenu();


    isSorting = true;

    renderSortingMode();


    /*
     * 设置卡片可以拖动
     */
    const cards =
        document.querySelectorAll(
            ".book-card"
        );


    cards.forEach(function(card) {

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
    });
}


/*
 * ==================================================
 * 完成排序
 * ==================================================
 */

function finishSorting() {

    isSorting = false;

    draggingCard = null;

    isDraggingBook = false;


    /*
     * 移除拖动属性
     */
    const cards =
        document.querySelectorAll(
            ".book-card"
        );


    cards.forEach(function(card) {

        card.removeAttribute(
            "draggable"
        );

        card.classList.remove(
            "dragging"
        );

        card.classList.remove(
            "drag-over"
        );
    });


    /*
     * 保存最终顺序
     */
    saveBooks();


    renderBooks();

    renderSortingMode();
}


/*
 * ==================================================
 * 开始拖动
 * ==================================================
 */

function handleDragStart(event) {

    if (!isSorting) {

        event.preventDefault();

        return;
    }


    draggingCard =
        event.currentTarget;

    isDraggingBook = true;


    draggingCard.classList.add(
        "dragging"
    );


    /*
     * 设置拖动数据
     */
    if (event.dataTransfer) {

        event.dataTransfer.effectAllowed =
            "move";

        event.dataTransfer.setData(
            "text/plain",
            draggingCard.dataset.bookId
        );
    }
}


/*
 * ==================================================
 * 拖动经过另一张书卡
 * ==================================================
 */

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
        target === draggingCard
    ) {

        return;
    }


    /*
     * 允许放置
     */
    if (event.dataTransfer) {

        event.dataTransfer.dropEffect =
            "move";
    }


    /*
     * 清除其他提示
     */
    document
        .querySelectorAll(
            ".book-card.drag-over"
        )
        .forEach(function(card) {

            card.classList.remove(
                "drag-over"
            );
        });


    target.classList.add(
        "drag-over"
    );
}


/*
 * ==================================================
 * 放置
 *
