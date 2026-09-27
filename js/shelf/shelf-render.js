/* ==================================================
   书架页面渲染
================================================== */


/* ==================================================
   获取页面元素
================================================== */

function getBookGrid() {
    return document.getElementById("bookGrid");
}

function getEmptyShelf() {
    return document.getElementById("emptyShelf");
}


/* ==================================================
   渲染整个书架
================================================== */

function renderBooks() {

    const bookGrid = getBookGrid();
    const emptyShelf = getEmptyShelf();

    if (!bookGrid) {
        return;
    }

    /*
     * 清空旧内容
     */
    bookGrid.innerHTML = "";


    /*
     * 没有书籍
     */
    if (!Array.isArray(books) || books.length === 0) {

        if (emptyShelf) {
            emptyShelf.style.display = "block";
        }

        applyShelfViewMode();

        return;
    }


    /*
     * 有书籍
     */
    if (emptyShelf) {
        emptyShelf.style.display = "none";
    }


    /*
     * 创建书籍卡片
     */
    books.forEach(function(book) {

        const card = createBookCard(book);

        if (card) {
            bookGrid.appendChild(card);
        }
    });


    /*
     * 应用网格 / 列表
     */
    applyShelfViewMode();
}


/* ==================================================
   创建一本书的卡片
================================================== */

function createBookCard(book) {

    const card = document.createElement("div");

    card.className = "book-card";

    card.dataset.bookId = book.id;


    /* ==================================================
       封面
    ================================================== */

    const cover = document.createElement("div");

    cover.className = "book-cover";


    if (book.cover) {

        const image = document.createElement("img");

        image.src = book.cover;

        image.alt = book.title || "小说封面";

        cover.appendChild(image);

    } else {

        const defaultCover = document.createElement("div");

        defaultCover.className = "default-cover";

        defaultCover.textContent = "📖";

        cover.appendChild(defaultCover);
    }


    /* ==================================================
       书籍信息
    ================================================== */

    const info = document.createElement("div");

    info.className = "book-info";


    /*
     * 书名
     */
    const title = document.createElement("div");

    title.className = "book-title";

    title.textContent = book.title || "未命名小说";


    /*
     * 书籍信息
     */
    const meta = document.createElement("div");

    meta.className = "book-meta";

    meta.textContent = "小说";


    info.appendChild(title);

    info.appendChild(meta);


    /* ==================================================
       删除按钮
    ================================================== */

    const deleteButton = document.createElement("button");

    /*
     * 注意：
     * 必须和 shelf-events.js 使用的 class 一致
     */
    deleteButton.className = "delete-book-button";

    deleteButton.type = "button";

    deleteButton.textContent = "×";

    deleteButton.dataset.bookId = book.id;

    deleteButton.setAttribute(
        "aria-label",
        "删除《" + (book.title || "未命名小说") + "》"
    );


    /* ==================================================
       组装
    ================================================== */

    card.appendChild(cover);

    card.appendChild(info);

    card.appendChild(deleteButton);


    return card;
}


/* ==================================================
   应用网格 / 列表模式
================================================== */

function applyShelfViewMode() {

    const bookGrid = getBookGrid();

    if (!bookGrid) {
        return;
    }


    bookGrid.classList.remove(
        "grid-view",
        "list-view"
    );


    /*
     * 列表
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


/* ==================================================
   网格模式
================================================== */

function renderGridView() {

    shelfViewMode = "grid";

    applyShelfViewMode();

    if (typeof saveShelfViewMode === "function") {
        saveShelfViewMode("grid");
    }
}


/* ==================================================
   列表模式
================================================== */

function renderListView() {

    shelfViewMode = "list";

    applyShelfViewMode();

    if (typeof saveShelfViewMode === "function") {
        saveShelfViewMode("list");
    }
}


/* ==================================================
   排序模式
================================================== */

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


/* ==================================================
   刷新书架
================================================== */

function refreshShelf() {

    renderBooks();

    renderSortingMode();
}
