/* ======================================================
   全书数据模块
====================================================== */


/* ======================================================
   读取全部书籍
====================================================== */

let books = [];

try {

    books =
        JSON.parse(
            localStorage.getItem("novelBooks") || "[]"
        );

} catch (error) {

    books = [];

}


/* ======================================================
   确保 books 是数组
====================================================== */

if (!Array.isArray(books)) {

    books = [];

}


/* ======================================================
   读取当前书籍 ID
====================================================== */

let currentBookId =
    localStorage.getItem("currentBookId");


/* ======================================================
   获取当前书籍
====================================================== */

let currentBook =
    books.find(
        book =>
            String(book.id) ===
            String(currentBookId)
    );


/* ======================================================
   如果没有当前书籍
   → 尝试使用第一本书
====================================================== */

if (!currentBook && books.length > 0) {

    currentBook = books[0];

    currentBookId =
        String(currentBook.id);

    localStorage.setItem(
        "currentBookId",
        currentBookId
    );

}


/* ======================================================
   如果连一本书都没有
   → 创建一本默认书
====================================================== */

if (!currentBook) {

    currentBook = {

        id:
            Date.now().toString(),

        title:
            "新书",

        nodes:
            []

    };


    books.push(
        currentBook
    );


    currentBookId =
        String(currentBook.id);


    localStorage.setItem(
        "currentBookId",
        currentBookId
    );


    localStorage.setItem(
        "novelBooks",
        JSON.stringify(books)
    );

}


/* ======================================================
   确保当前书籍拥有节点数组
====================================================== */

if (
    !Array.isArray(currentBook.nodes)
) {

    currentBook.nodes = [];

}


/* ======================================================
   保存当前书籍
====================================================== */

localStorage.setItem(
    "novelBooks",
    JSON.stringify(books)
);
