/* ==================================================
   书架页面渲染
================================================== */

function getBookGrid() {
    return document.getElementById("bookGrid");
}

function getEmptyShelf() {
    return document.getElementById("emptyShelf");
}

function renderBooks() {

    const bookGrid = getBookGrid();
    const emptyShelf = getEmptyShelf();

    if (!bookGrid) {
        return;
    }

    bookGrid.innerHTML = "";

    if (!Array.isArray(books) || books.length === 0) {

        if (emptyShelf) {
            emptyShelf.style.display = "block";
        }

        return;
    }

    if (emptyShelf) {
        emptyShelf.style.display = "none";
    }

    books.forEach(function(book) {

        const card = createBookCard(book);

        bookGrid.appendChild(card);
    });

    applyShelfViewMode();
}

function createBookCard(book) {

    const card = document.createElement("div");

    card.className = "book-card";

    card.dataset.bookId = book.id;


    /* ==============================
       封面
    ============================== */

    const cover = document.createElement("div");

    cover.className = "book-cover";


    if (book.cover) {

        const image = document.createElement("img");

        image.src = book.cover;

        image.alt =
            book.title || "小说封面";

        cover.appendChild(image);

    } else {

        cover.className += " default-cover";

        cover.textContent = "📖";
    }


    /* ==============================
       书名
    ============================== */

    const info = document.createElement("div");

    info.className = "book-info";


    const title = document.createElement("div");

    title.className = "book-title";

    title.textContent =
        book.title || "未命名小说";


    info.appendChild(title);


    /* ==============================
       删除按钮
    ============================== */

    const deleteButton =
        document.createElement("button");

    deleteButton.className =
        "delete-book-button";

    deleteButton.type = "button";

    deleteButton.textContent = "×";

    deleteButton.dataset.bookId = book.id;

    deleteButton.setAttribute(
        "aria-label",
        "删除《" +
        (book.title || "未命名小说") +
        "》"
    );


    /* ==============================
       组合卡片
    ============================== */

    card.appendChild(cover);

    card.appendChild(info);

    card.appendChild(deleteButton);


    return card;
}

function applyShelfViewMode() {

    const bookGrid = getBookGrid();

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

function renderGridView() {

    shelfViewMode = "grid";

    applyShelfViewMode();

    if (
        typeof saveShelfViewMode === "function"
    ) {

        saveShelfViewMode("grid");
    }
}

function renderListView() {

    shelfViewMode = "list";

    applyShelfViewMode();

    if (
        typeof saveShelfViewMode === "function"
    ) {

        saveShelfViewMode("list");
    }
}

function renderSortingMode() {

    const bookGrid = getBookGrid();

    if (!bookGrid) {
        return;
    }

    if (isSorting) {

        bookGrid.classList.add(
            "sorting"
        );

    } else {

        bookGrid.classList.remove(
            "sorting"
        );
    }
}

function refreshShelf() {

    renderBooks();

    renderSortingMode();
}
