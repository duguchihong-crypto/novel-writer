// ==============================
// 全书页面：数据存储
// ==============================


// ==================================================
// 读取当前书籍
// ==================================================

function loadCurrentBook() {

    const bookId =
        localStorage.getItem(
            "currentBookId"
        );


    if (!bookId) {

        return null;

    }


    const savedBooks =
        localStorage.getItem(
            "novelBooks"
        );


    if (!savedBooks) {

        return null;

    }


    try {

        const books =
            JSON.parse(
                savedBooks
            );


        if (
            !Array.isArray(books)
        ) {

            return null;

        }


        const book =
            books.find(
                book =>
                    String(book.id) ===
                    String(bookId)
            );


        if (!book) {

            return null;

        }


        // 旧书籍没有 structure
        // 自动补齐
        if (
            !Array.isArray(
                book.structure
            )
        ) {

            book.structure = [];

        }


        return book;


    } catch (error) {

        console.error(
            "读取书籍失败：",
            error
        );

        return null;

    }
}


// ==================================================
// 保存当前书籍
// ==================================================

function saveBook() {

    if (!currentBook) {

        return false;

    }


    // 确保 structure 存在
    if (
        !Array.isArray(
            currentBook.structure
        )
    ) {

        currentBook.structure = [];

    }


    const savedBooks =
        localStorage.getItem(
            "novelBooks"
        );


    let books = [];


    try {

        books =
            savedBooks
                ? JSON.parse(
                    savedBooks
                )
                : [];


        if (
            !Array.isArray(books)
        ) {

            books = [];

        }

    } catch (error) {

        console.error(
            "读取书架数据失败：",
            error
        );

        books = [];

    }


    // ==================================================
    // 查找当前书籍
    // ==================================================

    const index =
        books.findIndex(
            book =>
                String(book.id) ===
                String(currentBook.id)
        );


    // ==================================================
    // 更新
    // ==================================================

    if (index !== -1) {

        books[index] =
            currentBook;

    } else {

        books.push(
            currentBook
        );

    }


    // ==================================================
    // 写回 localStorage
    // ==================================================

    try {

        localStorage.setItem(
            "novelBooks",
            JSON.stringify(
                books
            )
        );


        return true;


    } catch (error) {

        console.error(
            "保存书籍失败：",
            error
        );


        return false;

    }
}
