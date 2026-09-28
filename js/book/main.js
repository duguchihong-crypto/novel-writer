/* ======================================================
   读取书籍
====================================================== */

const books = JSON.parse(
    localStorage.getItem("novelBooks") || "[]"
);


const currentBookId =
    localStorage.getItem("currentBookId");


const currentBook = books.find(
    book => String(book.id) === String(currentBookId)
);


/* ======================================================
   基础元素
====================================================== */

const bookTitle =
    document.getElementById("bookTitle");

const actionBar =
    document.getElementById("actionBar");

const tree =
    document.getElementById("tree");


/* ======================================================
   显示书名
====================================================== */

if (bookTitle) {

    bookTitle.textContent =
        currentBook?.title || "新书";

}


/* ======================================================
   点击书名
====================================================== */

if (bookTitle && actionBar) {

    bookTitle.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            actionBar.classList.toggle("show");

        }
    );

}


/* ======================================================
   点击操作栏
   防止点击按钮时操作栏关闭
====================================================== */

if (actionBar) {

    actionBar.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

        }
    );

}


/* ======================================================
   点击空白区域
====================================================== */

document.addEventListener(
    "click",
    function () {

        if (actionBar) {

            actionBar.classList.remove("show");

        }

    }
);


/* ======================================================
   书名拖动
====================================================== */

if (bookTitle) {

    let dragging = false;

    let startX = 0;
    let startY = 0;

    let startLeft = 0;
    let startTop = 0;


    bookTitle.addEventListener(
        "pointerdown",
        function (event) {

            dragging = true;

            bookTitle.setPointerCapture(
                event.pointerId
            );


            startX =
                event.clientX;

            startY =
                event.clientY;


            startLeft =
                bookTitle.offsetLeft;

            startTop =
                bookTitle.offsetTop;


            bookTitle.style.cursor =
                "grabbing";


            event.preventDefault();

        }
    );


    bookTitle.addEventListener(
        "pointermove",
        function (event) {

            if (!dragging) {
                return;
            }


            const moveX =
                event.clientX - startX;

            const moveY =
                event.clientY - startY;


            bookTitle.style.left =
                (
                    startLeft + moveX
                ) + "px";


            bookTitle.style.top =
                (
                    startTop + moveY
                ) + "px";


            updateActionBarPosition();

        }
    );


    bookTitle.addEventListener(
        "pointerup",
        function () {

            dragging = false;

            bookTitle.style.cursor =
                "grab";

        }
    );


    bookTitle.addEventListener(
        "pointercancel",
        function () {

            dragging = false;

            bookTitle.style.cursor =
                "grab";

        }
    );

}


/* ======================================================
   操作栏跟随书名
====================================================== */

function updateActionBarPosition() {

    if (
        !bookTitle ||
        !actionBar
    ) {
        return;
    }


    const left =
        bookTitle.offsetLeft;


    const top =
        bookTitle.offsetTop;


    const height =
        bookTitle.offsetHeight;


    actionBar.style.left =
        left + "px";


    actionBar.style.top =
        (
            top +
            height / 2 +
            25
        ) + "px";

}


/* ======================================================
   初始位置
====================================================== */

updateActionBarPosition();


/* ======================================================
   窗口变化
====================================================== */

window.addEventListener(
    "resize",
    function () {

        updateActionBarPosition();

    }
);


/* ======================================================
   ＋序 ＋卷 ＋篇 ＋章
====================================================== */

if (actionBar) {

    const actionButtons =
        actionBar.querySelectorAll(
            "button[data-action]"
        );


    actionButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const action =
                        button.dataset.action;


                    addRootNode(action);

                }
            );

        }
    );

}


/* ======================================================
   新增根节点
====================================================== */

function addRootNode(type) {

    if (!currentBook) {
        return;
    }


    if (!Array.isArray(currentBook.nodes)) {

        currentBook.nodes = [];

    }


    /* ==============================================
       序只能有一个
    ============================================== */

    if (type === "preface") {

        const exists =
            currentBook.nodes.some(
                node =>
                    node.type === "preface"
            );


        if (exists) {

            return;

        }

    }


    const node = {

        id:
            Date.now().toString(),

        type:
            type,

        parentId:
            null,

        title:
            getNodeTitle(
                type,
                currentBook.nodes
            ),

        x:
            1500,

        y:
            1650 +
            currentBook.nodes.length * 100

    };


    currentBook.nodes.push(node);


    saveBooks();


    renderNodes();

}


/* ======================================================
   生成节点名称
====================================================== */

function getNodeTitle(
    type,
    nodes
) {

    const count =
        nodes.filter(
            node =>
                node.type === type
        ).length + 1;


    if (type === "preface") {

        return "序章";

    }


    if (type === "volume") {

        return "第" +
            toChineseNumber(count) +
            "卷";

    }


    if (type === "part") {

        return "第" +
            toChineseNumber(count) +
            "篇";

    }


    if (type === "chapter") {

        return "第" +
            toChineseNumber(count) +
            "章";

    }


    return "新节点";

}


/* ======================================================
   中文数字
====================================================== */

function toChineseNumber(number) {

    const numbers = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十"
    ];


    if (number <= 10) {

        return numbers[number];

    }


    if (number < 20) {

        return "十" +
            numbers[number - 10];

    }


    if (number < 100) {

        const tens =
            Math.floor(
                number / 10
            );

        const ones =
            number % 10;


        return numbers[tens] +
            "十" +
            (
                ones === 0
                    ? ""
                    : numbers[ones]
            );

    }


    return String(number);

}


/* ======================================================
   保存
====================================================== */

function saveBooks() {

    localStorage.setItem(
        "novelBooks",
        JSON.stringify(books)
    );

}


/* ======================================================
   渲染节点
====================================================== */

function renderNodes() {

    if (!tree || !currentBook) {
        return;
    }


    tree.innerHTML = "";


    const nodes =
        Array.isArray(currentBook.nodes)
            ? currentBook.nodes
            : [];


    nodes.forEach(
        function (node) {

            const element =
                document.createElement("div");


            element.className =
                "node " +
                node.type;


            element.dataset.id =
                node.id;


            element.textContent =
                node.title;


            element.style.left =
                node.x + "px";


            element.style.top =
                node.y + "px";


            element.style.transform =
                "translate(-50%, -50%)";


            tree.appendChild(
                element
            );

        }
    );

}


/* ======================================================
   初始渲染
====================================================== */

renderNodes();
