/* ==================================================
   书架数据存储
================================================== */


/* ==================================================
   存储键
================================================== */

const BOOKS_STORAGE_KEY = "novelBooks";

const SHELF_VIEW_MODE_STORAGE_KEY =
    "shelfViewMode";


/* ==================================================
   读取所有书籍
================================================== */

function loadBooks() {

    try {

        const savedBooks =
            localStorage.getItem(
                BOOKS_STORAGE_KEY
            );


        if (!savedBooks) {

            books = [];

            return;
        }


        const parsedBooks =
            JSON.parse(savedBooks);


        if (Array.isArray(parsedBooks)) {

            books = parsedBooks;

        } else {

            books = [];
        }


    } catch (error) {

        console.error(
            "读取书籍数据失败：",
            error
        );

        books = [];
    }
}


/* ==================================================
   保存所有书籍
================================================== */

function saveBooks() {

    try {

        localStorage.setItem(
            BOOKS_STORAGE_KEY,
            JSON.stringify(books)
        );


        return true;


    } catch (error) {

        console.error(
            "保存书架失败：",
            error
        );


        alert(
            "保存书架失败，请稍后重试。"
        );


        return false;
    }
}


/* ==================================================
   读取书架显示模式
================================================== */

function loadShelfViewMode() {

    try {

        const savedMode =
            localStorage.getItem(
                SHELF_VIEW_MODE_STORAGE_KEY
            );


        if (
            savedMode === "grid" ||
            savedMode === "list"
        ) {

            shelfViewMode =
                savedMode;

        } else {

            shelfViewMode =
                DEFAULT_SHELF_VIEW_MODE;
        }


    } catch (error) {

        console.error(
            "读取书架显示模式失败：",
            error
        );


        shelfViewMode =
            DEFAULT_SHELF_VIEW_MODE;
    }
}


/* ==================================================
   保存书架显示模式
================================================== */

function saveShelfViewMode(mode) {

    if (
        mode !== "grid" &&
        mode !== "list"
    ) {

        return false;
    }


    shelfViewMode = mode;


    try {

        localStorage.setItem(
            SHELF_VIEW_MODE_STORAGE_KEY,
            mode
        );


        return true;


    } catch (error) {

        console.error(
            "保存书架显示模式失败：",
            error
        );


        return false;
    }
}


/* ==================================================
   根据 ID 查找书籍
================================================== */

function getBookById(bookId) {

    if (!Array.isArray(books)) {

        return null;
    }


    return books.find(function(book) {

        return String(book.id) ===
            String(bookId);

    }) || null;
}


/* ==================================================
   根据 ID 获取书籍位置
================================================== */

function getBookIndex(bookId) {

    if (!Array.isArray(books)) {

        return -1;
    }


    return books.findIndex(function(book) {

        return String(book.id) ===
            String(bookId);

    });

}


/* ==================================================
   保存后更新书籍
================================================== */

function saveBook(book) {

    if (!book || book.id === undefined) {

        return false;
    }


    const index =
        getBookIndex(book.id);


    if (index === -1) {

        books.push(book);

    } else {

        books[index] = book;
    }


    return saveBooks();
}


/* ==================================================
   保存书籍数据
==================================================

   注意：
   这里不再定义 deleteBook()。

   删除书籍的完整操作由
   shelf-events.js 负责。

================================================== */


/* ==================================================
   更新书籍
================================================== */

function saveUpdatedBook(
    bookId,
    data
) {

    const book =
        getBookById(bookId);


    if (!book) {

        return false;
    }


    Object.assign(
        book,
        data || {}
    );


    book.updatedAt =
        Date.now();


    return saveBooks();
}


/* ==================================================
   保存排序后的书籍
================================================== */

function saveBookOrder() {

    return saveBooks();
}


/* ==================================================
   清空书架
================================================== */

function clearAllBooks() {

    books = [];


    return saveBooks();
}
