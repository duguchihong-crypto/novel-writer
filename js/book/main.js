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
   显示 / 隐藏操作栏
====================================================== */

function toggleActionBar() {

    if (!actionBar) {
        return;
    }

    actionBar.classList.toggle("show");

}


function hideActionBar() {

    if (!actionBar) {
        return;
    }

    actionBar.classList.remove("show");

}


/* ======================================================
   书名：点击 + 拖动
====================================================== */

if (bookTitle) {

    let pointerDown = false;

    let dragging = false;

    let startX = 0;
    let startY = 0;

    let startLeft = 0;
    let startTop = 0;


    /* ==================================================
       按下
    ================================================== */

    bookTitle.addEventListener(
        "pointerdown",
        function (event) {

            pointerDown = true;

            dragging = false;

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

            bookTitle.setPointerCapture(
                event.pointerId
            );

        }
    );


    /* ==================================================
       移动
    ================================================== */

    bookTitle.addEventListener(
        "pointermove",
        function (event) {

            if (!pointerDown) {
                return;
            }

            const moveX =
                event.clientX - startX;

            const moveY =
                event.clientY - startY;

            const distance =
                Math.sqrt(
                    moveX * moveX +
                    moveY * moveY
                );


            /* ==========================================
               移动超过 6px 才算拖动
            ========================================== */

            if (distance > 6) {

                dragging = true;

            }


            if (!dragging) {
                return;
            }


            /* ==========================================
               拖动书名
            ========================================== */

            bookTitle.style.left =
                (
                    startLeft +
                    moveX
                ) + "px";

            bookTitle.style.top =
                (
                    startTop +
                    moveY
                ) + "px";

        }
    );


    /* ==================================================
       抬起
    ================================================== */

    bookTitle.addEventListener(
        "pointerup",
        function (event) {

            if (!pointerDown) {
                return;
            }

            pointerDown = false;

            bookTitle.style.cursor =
                "grab";


            /* ==========================================
               没有拖动
               → 视为点击
            ========================================== */

            if (!dragging) {

                toggleActionBar();

            }


            dragging = false;


            try {

                bookTitle.releasePointerCapture(
                    event.pointerId
                );

            } catch (error) {

            }

        }
    );


    /* ==================================================
       取消
    ================================================== */

    bookTitle.addEventListener(
        "pointercancel",
        function () {

            pointerDown = false;

            dragging = false;

            bookTitle.style.cursor =
                "grab";

        }
    );

}


/* ======================================================
   操作栏
====================================================== */

if (actionBar) {

    /* ==================================================
       防止点击操作栏触发空白关闭
    ================================================== */

    actionBar.addEventListener(
        "pointerdown",
        function (event) {

            event.stopPropagation();

        }
    );


    actionBar.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

        }
    );


    /* ==================================================
       ＋序 ＋章 ＋篇 ＋卷
    ================================================== */

    const actionButtons =
        actionBar.querySelectorAll(
            "button[data-action]"
        );


    actionButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();


                    const action =
                        button.dataset.action;


                    /* ==================================
                       新增节点
                    ================================== */

                    addRootNode(action);


                    /* ==================================
                       新增完成后关闭操作栏
                    ================================== */

                    hideActionBar();

                }
            );

        }
    );

}


/* ======================================================
   点击空白区域
====================================================== */

document.addEventListener(
    "click",
    function (event) {

        if (!actionBar) {
            return;
        }


        /* ==============================================
           点击书名
           → 不关闭
        ============================================== */

        if (
            event.target === bookTitle ||
            bookTitle?.contains(event.target)
        ) {

            return;

        }


        /* ==============================================
           点击操作栏
           → 不关闭
        ============================================== */

        if (
            event.target === actionBar ||
            actionBar.contains(event.target)
        ) {

            return;

        }


        /* ==============================================
           其他地方
           → 关闭
        ============================================== */

        hideActionBar();

    }
);


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


    /* ==================================================
       序只能有一个
    ================================================== */

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


    /* ==================================================
       创建节点
    ================================================== */

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


    currentBook.nodes.push(
        node
    );


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

    if (
        !tree ||
        !currentBook
    ) {
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
   初始化
====================================================== */

renderNodes();
