/* ======================================================
   全书页面
   全新版本
====================================================== */

"use strict";


/* ======================================================
   全局数据
====================================================== */

const CANVAS_SIZE = 3000;

const CENTER = 1500;

let bookTitleElement = null;

let treeElement = null;

let connectionsElement = null;

let currentBook = null;

let nodes = [];

let selectedNode = null;

let layoutVertical = true;

let bookPosition = {
    x: CENTER,
    y: CENTER
};


/* ======================================================
   初始化
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initialize();

    }
);


/* ======================================================
   初始化
====================================================== */

function initialize() {

    bookTitleElement =
        document.getElementById(
            "bookTitle"
        );


    treeElement =
        document.getElementById(
            "tree"
        );


    connectionsElement =
        document.getElementById(
            "connections"
        );


    loadBook();


    forceBookTitle();


    setupButtons();


    setupBookDrag();


    render();

}


/* ======================================================
   读取小说
====================================================== */

function loadBook() {

    currentBook = null;


    try {

        const currentBookId =
            localStorage.getItem(
                "currentBookId"
            );


        const booksText =
            localStorage.getItem(
                "novelBooks"
            );


        if (
            booksText
        ) {

            const books =
                JSON.parse(
                    booksText
                );


            if (
                Array.isArray(books)
            ) {

                currentBook =
                    books.find(
                        function (book) {

                            return String(
                                book.id
                            ) === String(
                                currentBookId
                            );

                        }
                    );

            }

        }

    } catch (error) {

        console.error(
            "读取小说失败：",
            error
        );

    }


    /* ==================================================
       如果没有找到小说
    ================================================= */

    if (!currentBook) {

        currentBook = {

            id:
                localStorage.getItem(
                    "currentBookId"
                ) ||
                "book",

            title:
                "未命名书籍",

            structure: []

        };

    }


    if (
        typeof currentBook.title !==
        "string" ||
        currentBook.title.trim() === ""
    ) {

        currentBook.title =
            "未命名书籍";

    }


    if (
        !Array.isArray(
            currentBook.structure
        )
    ) {

        currentBook.structure = [];

    }


    nodes =
        currentBook.structure;

}


/* ======================================================
   强制显示书名
====================================================== */

function forceBookTitle() {

    if (!bookTitleElement) {

        return;

    }


    /* ------------------------------------------
       书名
    ------------------------------------------ */

    bookTitleElement.textContent =
        currentBook.title;


    /* ------------------------------------------
       强制显示
    ------------------------------------------ */

    bookTitleElement.hidden =
        false;


    bookTitleElement.style.display =
        "flex";


    bookTitleElement.style.visibility =
        "visible";


    bookTitleElement.style.opacity =
        "1";


    bookTitleElement.style.position =
        "absolute";


    bookTitleElement.style.zIndex =
        "100";


    /* ------------------------------------------
       第一次打开：

       永远放在画布中心
    ------------------------------------------ */

    const width =
        bookTitleElement.offsetWidth ||
        200;


    const height =
        bookTitleElement.offsetHeight ||
        60;


    if (
        currentBook.bookPosition &&
        Number.isFinite(
            currentBook.bookPosition.x
        ) &&
        Number.isFinite(
            currentBook.bookPosition.y
        )
    ) {

        bookPosition.x =
            currentBook.bookPosition.x;

        bookPosition.y =
            currentBook.bookPosition.y;

    } else {

        bookPosition.x =
            CENTER - width / 2;

        bookPosition.y =
            CENTER - height / 2;

    }


    bookTitleElement.style.left =
        bookPosition.x + "px";


    bookTitleElement.style.top =
        bookPosition.y + "px";


    document.title =
        currentBook.title +
        " - 全书";

}


/* ======================================================
   保存小说
====================================================== */

function saveBook() {

    if (!currentBook) {

        return;

    }


    currentBook.bookPosition = {

        x: bookPosition.x,

        y: bookPosition.y

    };


    try {

        const booksText =
            localStorage.getItem(
                "novelBooks"
            );


        if (!booksText) {

            return;

        }


        const books =
            JSON.parse(
                booksText
            );


        if (
            !Array.isArray(books)
        ) {

            return;

        }


        const index =
            books.findIndex(
                function (book) {

                    return String(
                        book.id
                    ) === String(
                        currentBook.id
                    );

                }
            );


        if (index !== -1) {

            books[index] =
                currentBook;

            localStorage.setItem(
                "novelBooks",
                JSON.stringify(
                    books
                )
            );

        }

    } catch (error) {

        console.error(
            "保存小说失败：",
            error
        );

    }

}


/* ======================================================
   设置按钮
====================================================== */

function setupButtons() {

    const backButton =
        document.getElementById(
            "backButton"
        );


    if (backButton) {

        backButton.addEventListener(
            "click",
            function () {

                saveBook();

                window.location.href =
                    "index.html";

            }
        );

    }


    const layoutButton =
        document.getElementById(
            "layoutButton"
        );


    if (layoutButton) {

        layoutButton.addEventListener(
            "click",
            function () {

                layoutVertical =
                    !layoutVertical;

                layoutButton.textContent =
                    layoutVertical
                        ? "↕ 纵向"
                        : "↔ 横向";

                render();

            }
        );

    }


    document
        .querySelectorAll(
            ".action-bar button"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const action =
                            button.dataset.action;

                        addNode(
                            action
                        );

                    }
                );

            }
        );

}


/* ======================================================
   书名拖动
====================================================== */

function setupBookDrag() {

    if (!bookTitleElement) {

        return;

    }


    let dragging = false;

    let startX = 0;

    let startY = 0;

    let startLeft = 0;

    let startTop = 0;


    bookTitleElement.addEventListener(
        "pointerdown",
        function (event) {

            dragging = true;

            bookTitleElement.setPointerCapture(
                event.pointerId
            );


            startX =
                event.clientX;

            startY =
                event.clientY;


            startLeft =
                bookPosition.x;

            startTop =
                bookPosition.y;

        }
    );


    bookTitleElement.addEventListener(
        "pointermove",
        function (event) {

            if (!dragging) {

                return;

            }


            const dx =
                event.clientX -
                startX;


            const dy =
                event.clientY -
                startY;


            bookPosition.x =
                startLeft + dx;


            bookPosition.y =
                startTop + dy;


            bookTitleElement.style.left =
                bookPosition.x + "px";


            bookTitleElement.style.top =
                bookPosition.y + "px";

        }
    );


    bookTitleElement.addEventListener(
        "pointerup",
        function () {

            dragging = false;

            saveBook();

        }
    );


    bookTitleElement.addEventListener(
        "pointercancel",
        function () {

            dragging = false;

        }
    );

}


/* ======================================================
   新增节点
====================================================== */

function addNode(type) {

    let title = "";

    let number = 1;


    if (type === "preface") {

        const exists =
            nodes.some(
                function (node) {

                    return node.type ===
                        "preface";

                }
            );


        if (exists) {

            alert(
                "序只能创建一次"
            );

            return;

        }


        title = "序";


    } else if (type === "volume") {

        number =
            getNextNumber(
                "volume"
            );

        title =
            "第" +
            chineseNumber(number) +
            "卷";


    } else if (type === "part") {

        number =
            getNextNumber(
                "part"
            );

        title =
            "第" +
            chineseNumber(number) +
            "篇";


    } else if (type === "chapter") {

        number =
            getNextNumber(
                "chapter"
            );

        title =
            "第" +
            chineseNumber(number) +
            "章";

    }


    const node = {

        id:
            "node_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .slice(2),

        type:
            type,

        title:
            title,

        number:
            number,

        children: []

    };


    nodes.push(
        node
    );


    currentBook.structure =
        nodes;


    saveBook();


    render();

}


/* ======================================================
   编号
====================================================== */

function getNextNumber(type) {

    let max = 0;


    nodes.forEach(
        function (node) {

            if (
                node.type === type &&
                Number.isFinite(
                    node.number
                )
            ) {

                max =
                    Math.max(
                        max,
                        node.number
                    );

            }

        }
    );


    return max + 1;

}


/* ======================================================
   中文数字
====================================================== */

function chineseNumber(number) {

    const map = [
        "",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
        "十一",
        "十二",
        "十三",
        "十四",
        "十五",
        "十六",
        "十七",
        "十八",
        "十九",
        "二十"
    ];


    if (
        number >= 1 &&
        number <= 20
    ) {

        return map[number];

    }


    return String(
        number
    );

}


/* ======================================================
   渲染
====================================================== */

function render() {

    if (!treeElement) {

        return;

    }


    treeElement.innerHTML =
        "";


    if (
        connectionsElement
    ) {

        connectionsElement.innerHTML =
            "";

    }


    forceBookTitle();


    renderNodes();

}


/* ======================================================
   渲染节点
====================================================== */

function renderNodes() {

    const gap = 180;


    nodes.forEach(
        function (node, index) {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "node " +
                node.type;


            element.dataset.id =
                node.id;


            element.textContent =
                node.title;


            let x;
            let y;


            if (layoutVertical) {

                x =
                    CENTER -
                    75;

                y =
                    CENTER +
                    120 +
                    index * gap;

            } else {

                x =
                    CENTER +
                    120 +
                    index * gap;

                y =
                    CENTER -
                    25;

            }


            element.style.left =
                x + "px";


            element.style.top =
                y + "px";


            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.className =
                "node-delete";


            deleteButton.textContent =
                "×";


            deleteButton.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    deleteNode(
                        node.id
                    );

                }
            );


            element.appendChild(
                deleteButton
            );


            element.addEventListener(
                "click",
                function () {

                    selectedNode =
                        node.id;

                    document
                        .querySelector(
                            ".action-bar"
                        )
                        .classList.add(
                            "show"
                        );

                }
            );


            treeElement.appendChild(
                element
            );

        }
    );

}


/* ======================================================
   删除节点
====================================================== */

function deleteNode(id) {

    const index =
        nodes.findIndex(
            function (node) {

                return node.id === id;

            }
        );


    if (index === -1) {

        return;

    }


    nodes.splice(
        index,
        1
    );


    currentBook.structure =
        nodes;


    selectedNode =
        null;


    document
        .querySelector(
            ".action-bar"
        )
        .classList.remove(
            "show"
        );


    saveBook();


    render();

}
