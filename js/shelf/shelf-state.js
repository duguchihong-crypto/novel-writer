/* ==================================================
   书架状态
================================================== */


/*
 * 所有书籍
 */
let books = [];


/*
 * 当前书架显示模式
 *
 * grid = 网格
 * list = 列表
 */
let shelfViewMode = "grid";


/*
 * 是否正在排序
 */
let isSorting = false;


/*
 * 当前长按相关状态
 */
let longPressTimer = null;

let longPressBookId = null;

let longPressTriggered = false;

let pressedCard = null;


/*
 * 长按开始位置
 */
let pressStartX = 0;

let pressStartY = 0;


/*
 * 长按时间
 *
 * 600ms 后触发
 */
const LONG_PRESS_TIME = 600;


/*
 * 手指移动超过这个距离
 * 就取消长按
 */
const MOVE_CANCEL_DISTANCE = 10;


/*
 * 当前正在拖动排序的书卡
 */
let draggingCard = null;


/*
 * 当前是否正在拖动排序
 */
let isDraggingBook = false;


/* ==================================================
   当前操作状态
================================================== */


/*
 * 当前选中的书籍
 */
let selectedBookId = null;


/*
 * 当前是否打开新建菜单
 */
let isCreateMenuOpen = false;


/*
 * 当前是否打开设置菜单
 */
let isSettingsMenuOpen = false;


/*
 * 当前是否打开书籍菜单
 */
let isBookContextMenuOpen = false;


/* ==================================================
   排序状态
================================================== */


/*
 * 排序开始前的书籍顺序
 *
 * 用于取消排序时恢复
 */
let sortingOriginalBooks = [];


/*
 * 当前排序目标位置
 */
let sortingTargetIndex = -1;


/* ==================================================
   默认设置
================================================== */


/*
 * 默认书架显示方式
 */
const DEFAULT_SHELF_VIEW_MODE = "grid";


/*
 * 默认长按时间
 */
const DEFAULT_LONG_PRESS_TIME = 600;


/*
 * 默认移动取消距离
 */
const DEFAULT_MOVE_CANCEL_DISTANCE = 10;


/* ==================================================
   初始化状态
================================================== */


/*
 * 确保状态变量有效
 */
function resetShelfState() {

    shelfViewMode =
        DEFAULT_SHELF_VIEW_MODE;

    isSorting = false;

    longPressTimer = null;

    longPressBookId = null;

    longPressTriggered = false;

    pressedCard = null;

    pressStartX = 0;

    pressStartY = 0;

    draggingCard = null;

    isDraggingBook = false;

    selectedBookId = null;

    isCreateMenuOpen = false;

    isSettingsMenuOpen = false;

    isBookContextMenuOpen = false;

    sortingOriginalBooks = [];

    sortingTargetIndex = -1;
}


/* ==================================================
   长按状态清除
================================================== */


/*
 * 清除长按状态
 */
function clearLongPressState() {

    if (longPressTimer !== null) {

        clearTimeout(longPressTimer);

        longPressTimer = null;
    }

    longPressBookId = null;

    longPressTriggered = false;

    pressedCard = null;

    pressStartX = 0;

    pressStartY = 0;
}


/* ==================================================
   拖动状态清除
================================================== */


/*
 * 清除拖动状态
 */
function clearDraggingState() {

    draggingCard = null;

    isDraggingBook = false;

    sortingTargetIndex = -1;
}


/* ==================================================
   所有临时状态清除
================================================== */


/*
 * 清除当前操作状态
 */
function clearTemporaryState() {

    clearLongPressState();

    clearDraggingState();

    selectedBookId = null;
}


/* ==================================================
   排序开始
================================================== */


/*
 * 开始书架排序
 */
function startSorting() {

    if (isSorting) {

        return;
    }


    /*
     * 保存当前顺序
     */
    sortingOriginalBooks =
        books.map(function(book) {

            return {
                ...book
            };

        });


    isSorting = true;

    clearTemporaryState();
}


/* ==================================================
   完成排序
================================================== */


/*
 * 完成当前排序
 */
function finishSorting() {

    if (!isSorting) {

        return;
    }


    isSorting = false;

    sortingOriginalBooks = [];

    clearDraggingState();

    clearLongPressState();
}


/* ==================================================
   取消排序
================================================== */


/*
 * 恢复排序之前的顺序
 */
function cancelSorting() {

    if (!isSorting) {

        return;
    }


    books =
        sortingOriginalBooks.map(function(book) {

            return {
                ...book
            };

        });


    isSorting = false;

    sortingOriginalBooks = [];

    clearDraggingState();

    clearLongPressState();
}


/* ==================================================
   设置书架显示模式
================================================== */


/*
 * 设置：
 *
 * grid
 * list
 */
function setShelfViewMode(mode) {

    if (
        mode !== "grid" &&
        mode !== "list"
    ) {

        return;
    }


    shelfViewMode = mode;
}


/* ==================================================
   书籍查询
================================================== */


/*
 * 根据 ID 查找书籍
 */
function getBookById(bookId) {

    return books.find(function(book) {

        return String(book.id) ===
            String(bookId);

    }) || null;
}


/*
 * 获取书籍位置
 */
function getBookIndex(bookId) {

    return books.findIndex(function(book) {

        return String(book.id) ===
            String(bookId);

    });
}


/* ==================================================
   设置当前书籍
================================================== */


/*
 * 设置当前选中的书籍
 */
function setSelectedBook(bookId) {

    selectedBookId = bookId;
}


/*
 * 清除当前选中的书籍
 */
function clearSelectedBook() {

    selectedBookId = null;
}


/* ==================================================
   菜单状态
================================================== */


/*
 * 打开新建菜单
 */
function openCreateMenu() {

    isCreateMenuOpen = true;

    isSettingsMenuOpen = false;

    isBookContextMenuOpen = false;
}


/*
 * 关闭新建菜单
 */
function closeCreateMenu() {

    isCreateMenuOpen = false;
}


/*
 * 打开设置菜单
 */
function openSettingsMenu() {

    isSettingsMenuOpen = true;

    isCreateMenuOpen = false;

    isBookContextMenuOpen = false;
}


/*
 * 关闭设置菜单
 */
function closeSettingsMenu() {

    isSettingsMenuOpen = false;
}


/*
 * 关闭所有顶部菜单
 */
function closeTopMenus() {

    isCreateMenuOpen = false;

    isSettingsMenuOpen = false;
}


/* ==================================================
   书籍菜单状态
================================================== */


/*
 * 打开书籍操作菜单
 */
function openBookContextMenu(bookId) {

    selectedBookId = bookId;

    isBookContextMenuOpen = true;

    closeTopMenus();
}


/*
 * 关闭书籍操作菜单
 */
function closeBookContextMenu() {

    isBookContextMenuOpen = false;

    selectedBookId = null;
}


/* ==================================================
   排序移动
================================================== */


/*
 * 移动书籍
 *
 * fromIndex
 * → 原位置
 *
 * toIndex
 * → 新位置
 */
function moveBook(fromIndex, toIndex) {

    if (
        fromIndex < 0 ||
        fromIndex >= books.length
    ) {

        return;
    }


    if (
        toIndex < 0 ||
        toIndex >= books.length
    ) {

        return;
    }


    if (fromIndex === toIndex) {

        return;
    }


    const movedBook =
        books.splice(fromIndex, 1)[0];


    books.splice(
        toIndex,
        0,
        movedBook
    );


    sortingTargetIndex = toIndex;
}


/* ==================================================
   创建临时书籍 ID
================================================== */


/*
 * 创建唯一 ID
 */
function createBookId() {

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .slice(2, 8)
    );
}


/* ==================================================
   创建书籍
================================================== */


/*
 * 添加一本书
 */
function addBook(bookData) {

    const newBook = {

        id:
            bookData &&
            bookData.id
                ? bookData.id
                : createBookId(),

        title:
            bookData &&
            bookData.title
                ? bookData.title
                : "未命名书籍",

        intro:
            bookData &&
            bookData.intro
                ? bookData.intro
                : "",

        cover:
            bookData &&
            bookData.cover
                ? bookData.cover
                : "",

        createdAt:
            bookData &&
            bookData.createdAt
                ? bookData.createdAt
                : Date.now(),

        updatedAt:
            Date.now()
    };


    books.push(newBook);


    return newBook;
}


/* ==================================================
   删除书籍
================================================== */


/*
 * 根据 ID 删除书籍
 */
function removeBook(bookId) {

    const index =
        getBookIndex(bookId);


    if (index === -1) {

        return false;
    }


    books.splice(index, 1);


    if (
        String(selectedBookId) ===
        String(bookId)
    ) {

        selectedBookId = null;
    }


    return true;
}


/* ==================================================
   更新书籍
================================================== */


/*
 * 更新书籍资料
 */
function updateBook(bookId, data) {

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


    return true;
}


/* ==================================================
   状态检查
================================================== */


/*
 * 是否存在书籍
 */
function hasBooks() {

    return books.length > 0;
}


/*
 * 获取书籍数量
 */
function getBookCount() {

    return books.length;
}


/*
 * 是否有选中的书籍
 */
function hasSelectedBook() {

    return selectedBookId !== null;
}


/*
 * 是否处于排序状态
 */
function isSortingMode() {

    return isSorting;
}


/* ==================================================
   初始化
================================================== */

resetShelfState();
