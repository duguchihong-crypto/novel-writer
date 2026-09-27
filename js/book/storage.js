// ==============================
// 全书页面：数据存储
// ==============================

function loadCurrentBook() {
    const bookId = localStorage.getItem("currentBookId");

    if (!bookId) {
        return null;
    }

    const savedBooks = localStorage.getItem("novelBooks");

    if (!savedBooks) {
        return null;
    }

    try {
        const books = JSON.parse(savedBooks);

        return books.find(book => String(book.id) === String(bookId)) || null;

    } catch (error) {
        console.error("读取书籍失败：", error);
        return null;
    }
}


function saveBook() {
    if (!currentBook) {
        return;
    }

    const savedBooks = localStorage.getItem("novelBooks");

    let books = [];

    try {
        books = savedBooks ? JSON.parse(savedBooks) : [];
    } catch (error) {
        books = [];
    }

    const index = books.findIndex(
        book => String(book.id) === String(currentBook.id)
    );

    if (index !== -1) {
        books[index] = currentBook;
    } else {
        books.push(currentBook);
    }

    localStorage.setItem(
        "novelBooks",
        JSON.stringify(books)
    );
}
