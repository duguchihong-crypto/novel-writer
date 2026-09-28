// ==============================
// 全书页面：数据存储
// ==============================


// ==================================================
// 数据键
// ==================================================

const NOVEL_BOOKS_KEY =
    "novelBooks";


const CURRENT_BOOK_ID_KEY =
    "currentBookId";


// ==================================================
// 读取全部书籍
// ==================================================

function loadAllBooks() {

    const savedBooks =
        localStorage.getItem(
            NOVEL_BOOKS_KEY
        );


    if (!savedBooks) {

        return [];

    }


    try {

        const books =
            JSON.parse(
                savedBooks
            );


        if (
            !Array.isArray(books)
        ) {

            console.error(
                "novelBooks 不是数组。"
            );

            return [];

        }


        return books;

    } catch (error) {

        console.error(
            "读取 novelBooks 失败：",
            error
        );

        return [];

    }

}


// ==================================================
// 标准化书籍数据
//
// 用来兼容旧书
// ==================================================

function normalizeBook(book) {

    if (
        !book ||
        typeof book !== "object"
    ) {

        return null;

    }


    /*
     * 没有 ID 的数据不是有效书籍
     */

    if (
        book.id === undefined ||
        book.id === null ||
        String(book.id).trim() === ""
    ) {

        return null;

    }


    /*
     * 书名
     */

    if (
        typeof book.title !== "string"
    ) {

        book.title =
            "未命名书籍";

    }


    /*
     * 封面
     */

    if (
        typeof book.cover !== "string"
    ) {

        book.cover =
            "";

    }


    /*
     * 目录结构
     */

    if (
        !Array.isArray(
            book.structure
        )
    ) {

        book.structure =
            [];

    }


    /*
     * 布局方向
     */

    if (
        book.layoutDirection !==
        "horizontal" &&
        book.layoutDirection !==
        "vertical"
    ) {

        book.layoutDirection =
            "vertical";

    }


    /*
     * 书名位置
     *
     * null 表示：
     * 尚未由用户手动移动。
     *
     * 全书页面第一次打开时，
     * 会自动放到 3000 × 3000 中心。
     */

    if (
        !book.bookPosition ||
        typeof book.bookPosition !==
        "object"
    ) {

        book.bookPosition = {

            x: null,

            y: null

        };

    } else {

        if (
            typeof book.bookPosition.x !==
            "number" ||
            !Number.isFinite(
                book.bookPosition.x
            )
        ) {

            book.bookPosition.x =
                null;

        }


        if (
            typeof book.bookPosition.y !==
            "number" ||
            !Number.isFinite(
                book.bookPosition.y
            )
        ) {

            book.bookPosition.y =
                null;

        }

    }


    return book;

}


// ==================================================
// 读取当前小说 ID
// ==================================================

function getCurrentBookId() {

    return localStorage.getItem(
        CURRENT_BOOK_ID_KEY
    );

}


// ==================================================
// 设置当前小说 ID
// ==================================================

function setCurrentBookId(bookId) {

    if (
        bookId === undefined ||
        bookId === null ||
        String(bookId).trim() === ""
    ) {

        return false;

    }


    try {

        localStorage.setItem(
            CURRENT_BOOK_ID_KEY,
            String(bookId)
        );


        return true;

    } catch (error) {

        console.error(
            "设置当前小说 ID 失败：",
            error
        );


        return false;

    }

}


// ==================================================
// 删除当前章节
//
// 新书创建时使用
// ==================================================

function clearCurrentChapter() {

    try {

        localStorage.removeItem(
            "currentChapterId"
        );


        return true;

    } catch (error) {

        console.error(
            "清除当前章节失败：",
            error
        );


        return false;

    }

}


// ==================================================
// 根据 ID 查找书籍
// ==================================================

function findBookById(bookId) {

    if (
        bookId === undefined ||
        bookId === null
    ) {

        return null;

    }


    const books =
        loadAllBooks();


    const book =
        books.find(
            item =>
                item &&
                String(item.id) ===
                String(bookId)
        );


    if (!book) {

        return null;

    }


    return normalizeBook(
        book
    );

}


// ==================================================
// 读取当前书籍
// ==================================================

function loadCurrentBook() {

    const bookId =
        getCurrentBookId();


    /*
     * 没有 currentBookId
     */

    if (!bookId) {

        console.warn(
            "没有找到 currentBookId。"
        );

        return null;

    }


    const book =
        findBookById(
            bookId
        );


    /*
     * 找不到当前书
     */

    if (!book) {

        console.warn(
            "找不到当前小说：",
            bookId
        );

        return null;

    }


    return book;

}


// ==================================================
// 保存全部书籍
// ==================================================

function saveAllBooks(
    books
) {

    if (
        !Array.isArray(books)
    ) {

        return false;

    }


    /*
     * 标准化
     */

    const normalizedBooks =
        [];


    for (
        let i = 0;
        i < books.length;
        i++
    ) {

        const book =
            normalizeBook(
                books[i]
            );


        if (book) {

            normalizedBooks.push(
                book
            );

        }

    }


    /*
     * 保存
     */

    try {

        localStorage.setItem(
            NOVEL_BOOKS_KEY,
            JSON.stringify(
                normalizedBooks
            )
        );


        return true;

    } catch (error) {

        console.error(
            "保存全部书籍失败：",
            error
        );


        return false;

    }

}


// ==================================================
// 保存当前书籍
// ==================================================

function saveBook() {

    if (
        !currentBook
    ) {

        console.error(
            "saveBook：currentBook 不存在。"
        );

        return false;

    }


    /*
     * 标准化当前书
     */

    const normalizedBook =
        normalizeBook(
            currentBook
        );


    if (
        !normalizedBook
    ) {

        console.error(
            "saveBook：当前书籍数据无效。"
        );

        return false;

    }


    /*
     * 让全局 currentBook
     * 也同步标准化后的数据
     */

    currentBook =
        normalizedBook;


    /*
     * 读取现有书架
     */

    const books =
        loadAllBooks();


    /*
     * 查找当前书
     */

    const index =
        books.findIndex(
            book =>
                book &&
                String(book.id) ===
                String(currentBook.id)
        );


    /*
     * 已存在
     */

    if (
        index !== -1
    ) {

        books[index] =
            currentBook;

    }

    /*
     * 不存在
     *
     * 理论上不应该发生，
     * 但可以自动补进去。
     */

    else {

        books.push(
            currentBook
        );

    }


    /*
     * 保存
     */

    const success =
        saveAllBooks(
            books
        );


    /*
     * 保存成功后，
     * 确保 currentBookId 正确。
     */

    if (
        success
    ) {

        setCurrentBookId(
            currentBook.id
        );

    }


    return success;

}


// ==================================================
// 保存书籍位置
//
// 给全书页面拖动书名使用
// ==================================================

function saveBookPosition(
    x,
    y
) {

    if (
        !currentBook
    ) {

        return false;

    }


    if (
        typeof x !== "number" ||
        !Number.isFinite(x) ||
        typeof y !== "number" ||
        !Number.isFinite(y)
    ) {

        return false;

    }


    if (
        !currentBook.bookPosition ||
        typeof currentBook.bookPosition !==
        "object"
    ) {

        currentBook.bookPosition = {};

    }


    currentBook.bookPosition.x =
        x;


    currentBook.bookPosition.y =
        y;


    return saveBook();

}


// ==================================================
// 清除书籍位置
//
// 测试首次居中时可以使用
// ==================================================

function clearBookPosition() {

    if (
        !currentBook
    ) {

        return false;

    }


    currentBook.bookPosition = {

        x: null,

        y: null

    };


    return saveBook();

}


// ==================================================
// 保存布局方向
// ==================================================

function saveBookLayoutDirection(
    direction
) {

    if (
        !currentBook
    ) {

        return false;

    }


    if (
        direction !==
        "vertical" &&
        direction !==
        "horizontal"
    ) {

        return false;

    }


    currentBook.layoutDirection =
        direction;


    return saveBook();

}


// ==================================================
// 创建新书
//
// 虽然 create-book.html
// 已经有自己的创建逻辑，
// 但这里保留统一接口。
// ==================================================

function addBook(
    book
) {

    if (
        !book ||
        typeof book !== "object"
    ) {

        return null;

    }


    const newBook =
        normalizeBook(
            book
        );


    if (
        !newBook
    ) {

        return null;

    }


    const books =
        loadAllBooks();


    /*
     * 防止重复 ID
     */

    const exists =
        books.some(
            item =>
                item &&
                String(item.id) ===
                String(newBook.id)
        );


    if (
        exists
    ) {

        console.error(
            "创建小说失败：ID 已存在。",
            newBook.id
        );

        return null;

    }


    books.push(
        newBook
    );


    const success =
        saveAllBooks(
            books
        );


    if (
        !success
    ) {

        return null;

    }


    /*
     * 自动设为当前书
     */

    setCurrentBookId(
        newBook.id
    );


    clearCurrentChapter();


    return newBook;

}


// ==================================================
// 删除书籍
//
// 当前项目暂时没有使用，
// 保留给书架页面。
// ==================================================

function deleteBook(
    bookId
) {

    if (
        bookId === undefined ||
        bookId === null
    ) {

        return false;

    }


    const books =
        loadAllBooks();


    const newBooks =
        books.filter(
            book =>
                !book ||
                String(book.id) !==
                String(bookId)
        );


    /*
     * 没有变化
     */

    if (
        newBooks.length ===
        books.length
    ) {

        return false;

    }


    const success =
        saveAllBooks(
            newBooks
        );


    if (
        !success
    ) {

        return false;

    }


    /*
     * 如果删除的是当前书，
     * 清除当前书 ID。
     */

    const currentId =
        getCurrentBookId();


    if (
        currentId &&
        String(currentId) ===
        String(bookId)
    ) {

        try {

            localStorage.removeItem(
                CURRENT_BOOK_ID_KEY
            );

            localStorage.removeItem(
                "currentChapterId"
            );

        } catch (error) {

            console.error(
                "清除当前书籍状态失败：",
                error
            );

        }

    }


    return true;

}


// ==================================================
// 初始化当前书
//
// 如果旧书缺少字段，
// 这里会自动补齐并保存。
// ==================================================

function normalizeCurrentBook() {

    if (
        !currentBook
    ) {

        return false;

    }


    const normalized =
        normalizeBook(
            currentBook
        );


    if (
        !normalized
    ) {

        return false;

    }


    currentBook =
        normalized;


    return true;

}
