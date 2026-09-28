/* ==================================================
   书架页面渲染
================================================== */


/* ==================================================
   获取页面元素
================================================== */

function getBookGrid() {

    return document.getElementById(
        "bookGrid"
    );
}


function getEmptyShelf() {

    return document.getElementById(
        "emptyShelf"
    );
}


function getSortHint() {

    return document.getElementById(
        "sortHint"
    );
}


/* ==================================================
   渲染书架
================================================== */

function renderBooks() {

    const bookGrid =
        getBookGrid();

    const emptyShelf =
        getEmptyShelf();


    if (!bookGrid) {

        return;
    }


    /* ==================================================
       清空旧内容
    ================================================== */

    bookGrid.innerHTML = "";


    /* ==================================================
       没有书
    ================================================== */

    if (
        !Array.isArray(books) ||
        books.length === 0
    ) {

        if (emptyShelf) {

            emptyShelf.style.display =
                "block";
        }


        applyShelfViewMode();

        renderSortingMode();

        return;
    }


    /* ==================================================
       有书
    ================================================== */

    if (emptyShelf) {

        emptyShelf.style.display =
            "none";
    }


    /* ==================================================
       创建所有书籍
    ================================================== */

    books.forEach(
        function(book) {

            const card =
                createBookCard(book);


            bookGrid.appendChild(
                card
            );

        }
    );


    /* ==================================================
       应用显示模式
    ================================================== */

    applyShelfViewMode();


    /* ==================================================
       应用排序模式
    ================================================== */

    renderSortingMode();
}


/* ==================================================
   创建书籍卡片
================================================== */

function createBookCard(book) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "book-card";


    card.dataset.bookId =
        book.id;


    /* ==================================================
       排序状态
    ================================================== */

    if (
        isSorting &&
        String(draggingCard) ===
        String(book.id)
    ) {

        card.classList.add(
            "dragging"
        );
    }


    /* ==================================================
       封面
    ================================================== */

    const cover =
        document.createElement(
            "div"
        );


    cover.className =
        "book-cover";


    if (book.cover) {

        const image =
            document.createElement(
                "img"
            );


        image.src =
            book.cover;


        image.alt =
            book.title ||
            "小说封面";


        image.draggable =
            false;


        cover.appendChild(
            image
        );

    } else {

        cover.classList.add(
            "default-cover"
        );


        cover.textContent =
            "📖";
    }


    /* ==================================================
       书籍信息
    ================================================== */

    const info =
        document.createElement(
            "div"
        );


    info.className =
        "book-info";


    /* ==================================================
       书名
    ================================================== */

    const title =
        document.createElement(
            "div"
        );


    title.className =
        "book-title";


    title.textContent =
        book.title ||
        "未命名小说";


    title.title =
        book.title ||
        "未命名小说";


    info.appendChild(
        title
    );


    /* ==================================================
       三个点菜单按钮
    ================================================== */

    const menuButton =
        document.createElement(
            "button"
        );


    menuButton.className =
        "book-menu-button";


    menuButton.type =
        "button";


    menuButton.textContent =
        "⋮";


    menuButton.dataset.bookId =
        book.id;


    menuButton.setAttribute(
        "aria-label",
        "打开《" +
        (
            book.title ||
            "未命名小说"
        ) +
        "》菜单"
    );


    menuButton.setAttribute(
        "aria-haspopup",
        "true"
    );


    /* ==================================================
       组合卡片
    ================================================== */

    card.appendChild(
        cover
    );


    card.appendChild(
        info
    );


    card.appendChild(
        menuButton
    );


    return card;
}


/* ==================================================
   应用网格 / 列表模式
================================================== */

function applyShelfViewMode() {

    const bookGrid =
        getBookGrid();


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
   网格模式
================================================== */

function renderGridView() {

    shelfViewMode =
        "grid";


    applyShelfViewMode();


    if (
        typeof saveShelfViewMode ===
        "function"
    ) {

        saveShelfViewMode(
            "grid"
        );
    }
}


/* ==================================================
   列表模式
================================================== */

function renderListView() {

    shelfViewMode =
        "list";


    applyShelfViewMode();


    if (
        typeof saveShelfViewMode ===
        "function"
    ) {

        saveShelfViewMode(
            "list"
        );
    }
}


/* ==================================================
   排序模式
================================================== */

function renderSortingMode() {

    const bookGrid =
        getBookGrid();


    const sortHint =
        getSortHint();


    if (!bookGrid) {

        return;
    }


    /*
     * 排序状态主要由 body 控制
     *
     * CSS：
     * .sorting .book-menu-button
     * .sorting .settings-button
     * .sorting .finish-sort-button
     */

    if (isSorting) {

        document.body.classList.add(
            "sorting"
        );


        if (sortHint) {

            sortHint.style.display =
                "block";
        }

    } else {

        document.body.classList.remove(
            "sorting"
        );


        if (sortHint) {

            sortHint.style.display =
                "none";
        }
    }
}


/* ==================================================
   当前选中书籍
================================================== */

function renderSelectedBook() {

    const bookGrid =
        getBookGrid();


    if (!bookGrid) {

        return;
    }


    const cards =
        bookGrid.querySelectorAll(
            ".book-card"
        );


    cards.forEach(
        function(card) {

            card.classList.remove(
                "selected"
            );


            if (
                selectedBookId !== null &&
                String(
                    card.dataset.bookId
                ) ===
                String(selectedBookId)
            ) {

                card.classList.add(
                    "selected"
                );
            }

        }
    );
}


/* ==================================================
   刷新书架
================================================== */

function refreshShelf() {

    renderBooks();

    renderSortingMode();

    renderSelectedBook();
}
