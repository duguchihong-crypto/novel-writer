/* ==================================================
   书架页面渲染
================================================== */


/*
 * ==================================================
 * 获取页面元素
 * ==================================================
 */

function getBookGrid() {
    return document.getElementById("bookGrid");
}

function getEmptyShelf() {
    return document.getElementById("emptyShelf");
}


/*
 * ==================================================
 * 渲染整个书架
 * ==================================================
 */

function renderBooks() {

    const bookGrid = getBookGrid();
    const emptyShelf = getEmptyShelf();

    if (!bookGrid) {
        return;
    }

    /*
     * 清空原来的书卡
     */
    bookGrid.innerHTML = "";


    /*
     * 没有书籍
     */
    if (books.length === 0) {

        if (emptyShelf) {
            emptyShelf.style.display = "block";
        }

        return;
    }


    /*
     * 有书籍
     */
    if (emptyShelf) {
        emptyShelf.style.display = "none";
    }


    /*
     * 创建每一本书
     */
    books.forEach(function(book) {

        const card = createBookCard(book);

        bookGrid.appendChild(card);
    });


    /*
     * 应用当前显示模式
     */
    applyShelfViewMode();
}


/*
 * ==================================================
 * 创建一本书的卡片
 * ==================================================
 */

function createBookCard(book) {

    /*
     * 最外层
     */
    const card = document.createElement("div");

    card.className = "book-card";

    /*
     * 给卡片记录书籍 ID
     *
     * HTML：
     * data-book-id="xxxxx"
     *
     * JS：
     * card.dataset.bookId
     */
    card.dataset.bookId = book.id;


    /*
     * ==================================================
     * 封面
     * ==================================================
     */

    const cover = document.createElement("div");

    cover.className = "book-cover";


    /*
     * 有封面
     */
    if (book.cover) {

        const image = document.createElement("img");

        image.src = book.cover;
        image.alt = book.title || "小说封面";

        cover.appendChild(image);

    }

    /*
     * 没有封面
     */
    else {

        cover.textContent = "📖";
    }


    /*
     * ==================================================
     * 书籍信息
     * ==================================================
     */

    const info = document.createElement("div");

    info.className = "book-info";


    /*
     * 书名
     */
    const title = document.createElement("div");

    title.className = "book-title";

    title.textContent = book.title || "未命名小说";


    /*
     * ==================================================
     * 信息区域
     * ==================================================
     */

    const meta = document.createElement("div");

    meta.className = "book-meta";


    /*
     * 如果以后增加章节统计，
     * 可以直接在这里显示。
     *
     * 目前先保持简单。
     */
    meta.textContent = "小说";


    /*
     * 加入信息区域
     */
    info.appendChild(title);
    info.appendChild(meta);


    /*
     * ==================================================
     * 删除按钮
     * ==================================================
     */

    const deleteButton = document.createElement("button");

    deleteButton.className = "book-delete";

    deleteButton.type = "button";

    deleteButton.textContent = "×";

    deleteButton.dataset.bookId = book.id;

    deleteButton.setAttribute(
        "aria-label",
        "删除《" + (book.title || "未命名小说") + "》"
    );


    /*
     * 组装卡片
     */
    card.appendChild(cover);
    card.appendChild(info);
    card.appendChild(deleteButton);


    return card;
}


/*
 * ==================================================
 * 应用网格 / 列表模式
 * ==================================================
 */

function applyShelfViewMode() {

    const bookGrid = getBookGrid();

    if (!bookGrid) {
        return;
    }


    /*
     * 先删除两个模式
     */
    bookGrid.classList.remove(
        "grid-view",
        "list-view"
    );


    /*
     * 当前是列表
     */
    if (shelfViewMode === "list") {

        bookGrid.classList.add("list-view");

    }

    /*
     * 默认网格
     */
    else {

        bookGrid.classList.add("grid-view");
    }
}


/*
 * ==================================================
 * 切换到网格
 * ==================================================
 */

function renderGridView() {

    shelfViewMode = "grid";

    applyShelfViewMode();

    saveShelfViewMode("grid");
}


/*
 * ==================================================
 * 切换到列表
 * ==================================================
 */

function renderListView() {

    shelfViewMode = "list";

    applyShelfViewMode();

    saveShelfViewMode("list");
}


/*
 * ==================================================
 * 显示 / 隐藏排序状态
 * ==================================================
 */

function renderSortingMode() {

    const bookGrid = getBookGrid();

    if (!bookGrid) {
        return;
    }


    if (isSorting) {

        bookGrid.classList.add("sorting");

    } else {

        bookGrid.classList.remove("sorting");
    }
}


/*
 * ==================================================
 * 刷新书架
 *
 * 以后新增、删除、排序后
 * 都可以调用这个函数
 * ==================================================
 */

function refreshShelf() {

    renderBooks();

    renderSortingMode();
}
