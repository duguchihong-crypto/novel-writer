/* ==================================================
   书架数据存储
================================================== */


/*
 * ==================================================
 * 读取所有书籍
 * ==================================================
 */
function loadBooks() {

    const savedBooks = localStorage.getItem("novelBooks");

    if (!savedBooks) {
        books = [];
        return;
    }

    try {

        const parsedBooks = JSON.parse(savedBooks);

        if (Array.isArray(parsedBooks)) {
            books = parsedBooks;
        } else {
            books = [];
        }

    } catch (error) {

        console.error("读取书籍数据失败：", error);

        books = [];
    }
}


/*
 * ==================================================
 * 保存所有书籍
 * ==================================================
 */
function saveBooks() {

    try {

        localStorage.setItem(
            "novelBooks",
            JSON.stringify(books)
        );

        return true;

    } catch (error) {

        console.error("保存书籍数据失败：", error);

        alert("保存书架失败，请稍后重试。");

        return false;
    }
}


/*
 * ==================================================
 * 读取书架显示模式
 *
 * grid = 网格
 * list = 列表
 * ==================================================
 */
function loadShelfViewMode() {

    const savedMode =
        localStorage.getItem("shelfViewMode");

    if (
        savedMode === "grid" ||
        savedMode === "list"
    ) {

        shelfViewMode = savedMode;

    } else {

        shelfViewMode = "grid";
    }
}


/*
 * ==================================================
 * 保存书架显示模式
 * ==================================================
 */
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
            "shelfViewMode",
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


/*
 * ==================================================
 * 根据 ID 查找书籍
 * ==================================================
 */
function getBookById(bookId) {

    return books.find(function(book) {

        return String(book.id) === String(bookId);

    }) || null;
}
