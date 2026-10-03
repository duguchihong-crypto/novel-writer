/* ======================================================
   全书数据模块
====================================================== */


/* ======================================================
   全部书籍
====================================================== */

let books = [];


/* ======================================================
   读取本地书籍
====================================================== */

const savedBooks =
    localStorage.getItem(
        "novelBooks"
    );


if (savedBooks) {

    try {

        const parsedBooks =
            JSON.parse(
                savedBooks
            );


        if (
            Array.isArray(parsedBooks)
        ) {

            books =
                parsedBooks;

        }

    } catch (error) {

        console.error(
            "读取小说数据失败：",
            error
        );

        books = [];

    }

}


/* ======================================================
   当前书籍 ID
====================================================== */

let currentBookId =
    localStorage.getItem(
        "currentBookId"
    );


/* ======================================================
   查找当前书籍
====================================================== */

let currentBook =
    books.find(
        function (book) {

            return (
                String(book.id) ===
                String(currentBookId)
            );

        }
    );


/* ======================================================
   没有当前书籍
   → 使用第一本书
====================================================== */

if (
    !currentBook &&
    books.length > 0
) {

    currentBook =
        books[0];


    currentBookId =
        String(
            currentBook.id
        );


    localStorage.setItem(
        "currentBookId",
        currentBookId
    );

}


/* ======================================================
   没有任何书籍
   → 创建默认书籍
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
        String(
            currentBook.id
        );


    localStorage.setItem(
        "currentBookId",
        currentBookId
    );

}


/* ======================================================
   确保书名存在
====================================================== */

if (
    typeof currentBook.title !==
    "string"
) {

    currentBook.title =
        "新书";

}


/* ======================================================
   确保节点数组存在
====================================================== */

if (
    !Array.isArray(
        currentBook.nodes
    )
) {

    currentBook.nodes =
        [];

}


/* ======================================================
   保存数据
====================================================== */

localStorage.setItem(
    "novelBooks",
    JSON.stringify(
        books
    )
);


/* ======================================================
   保存当前书籍 ID
====================================================== */

localStorage.setItem(
    "currentBookId",
    String(
        currentBook.id
    )
);
