// ==================================================
// 全书页面：书名强制显示
// ==================================================

(function () {

    "use strict";

    const CANVAS_SIZE = 3000;
    const DEFAULT_X = 1500;
    const DEFAULT_Y = 1500;

    // --------------------------------------------------
    // 强制创建书名
    // --------------------------------------------------

    function forceShowBookTitle() {

        let titleElement = document.getElementById("bookTitle");

        // 如果不存在，直接重新创建
        if (!titleElement) {

            titleElement = document.createElement("div");

            titleElement.id = "bookTitle";
            titleElement.className = "book-title";

            const canvas = document.querySelector(".tree-canvas");

            if (canvas) {
                canvas.appendChild(titleElement);
            } else {
                document.body.appendChild(titleElement);
            }
        }

        // --------------------------------------------------
        // 获取书名
        // --------------------------------------------------

        let title = "未命名书籍";

        try {

            if (
                typeof currentBook !== "undefined" &&
                currentBook &&
                typeof currentBook.title === "string" &&
                currentBook.title.trim() !== ""
            ) {
                title = currentBook.title.trim();
            }

        } catch (error) {
            console.error("读取书名失败：", error);
        }

        // --------------------------------------------------
        // 写入书名
        // --------------------------------------------------

        titleElement.textContent = title;

        // --------------------------------------------------
        // 强制显示
        // --------------------------------------------------

        titleElement.hidden = false;

        titleElement.removeAttribute("hidden");

        titleElement.style.display = "flex";
        titleElement.style.visibility = "visible";
        titleElement.style.opacity = "1";

        titleElement.style.position = "absolute";

        titleElement.style.zIndex = "99999";

        titleElement.style.pointerEvents = "auto";

        titleElement.style.transform = "none";

        // --------------------------------------------------
        // 强制尺寸
        // --------------------------------------------------

        titleElement.style.minWidth = "180px";
        titleElement.style.minHeight = "58px";

        titleElement.style.width = "auto";
        titleElement.style.height = "auto";

        // --------------------------------------------------
        // 强制位置
        // --------------------------------------------------

        let x = null;
        let y = null;

        // 优先读取当前 DOM 位置
        const domLeft = parseFloat(titleElement.style.left);
        const domTop = parseFloat(titleElement.style.top);

        if (Number.isFinite(domLeft)) {
            x = domLeft;
        }

        if (Number.isFinite(domTop)) {
            y = domTop;
        }

        // 再读取小说保存的位置
        if (
            (!Number.isFinite(x) || !Number.isFinite(y)) &&
            typeof currentBook !== "undefined" &&
            currentBook &&
            currentBook.bookPosition
        ) {

            if (Number.isFinite(currentBook.bookPosition.x)) {
                x = currentBook.bookPosition.x;
            }

            if (Number.isFinite(currentBook.bookPosition.y)) {
                y = currentBook.bookPosition.y;
            }
        }

        // --------------------------------------------------
        // 如果没有位置，直接放到画布正中央
        // --------------------------------------------------

        if (!Number.isFinite(x)) {
            x = DEFAULT_X - 100;
        }

        if (!Number.isFinite(y)) {
            y = DEFAULT_Y - 30;
        }

        // --------------------------------------------------
        // 防止书名跑出 3000 × 3000 画布
        // --------------------------------------------------

        const width = titleElement.offsetWidth || 200;
        const height = titleElement.offsetHeight || 60;

        if (
            x < 0 ||
            x > CANVAS_SIZE ||
            y < 0 ||
            y > CANVAS_SIZE
        ) {

            x = DEFAULT_X - width / 2;
            y = DEFAULT_Y - height / 2;
        }

        // 最终限制
        x = Math.max(
            0,
            Math.min(x, CANVAS_SIZE - width)
        );

        y = Math.max(
            0,
            Math.min(y, CANVAS_SIZE - height)
        );

        // --------------------------------------------------
        // 写入最终位置
        // --------------------------------------------------

        titleElement.style.left = x + "px";
        titleElement.style.top = y + "px";

        // --------------------------------------------------
        // 同步状态
        // --------------------------------------------------

        try {

            if (
                typeof bookPosition !== "undefined" &&
                bookPosition
            ) {
                bookPosition.x = x;
                bookPosition.y = y;
            }

        } catch (error) {
            console.error("同步书名位置失败：", error);
        }

        // --------------------------------------------------
        // 同步小说数据
        // --------------------------------------------------

        try {

            if (
                typeof currentBook !== "undefined" &&
                currentBook
            ) {

                if (!currentBook.bookPosition) {
                    currentBook.bookPosition = {
                        x: null,
                        y: null
                    };
                }

                currentBook.bookPosition.x = x;
                currentBook.bookPosition.y = y;
            }

        } catch (error) {
            console.error("保存书名位置失败：", error);
        }

        return titleElement;
    }


    // ==================================================
    // 多次强制检查
    // ==================================================

    function startForceTitle() {

        forceShowBookTitle();

        requestAnimationFrame(function () {

            forceShowBookTitle();

            requestAnimationFrame(function () {

                forceShowBookTitle();

            });

        });

        setTimeout(forceShowBookTitle, 50);
        setTimeout(forceShowBookTitle, 200);
        setTimeout(forceShowBookTitle, 500);
        setTimeout(forceShowBookTitle, 1000);
    }


    // ==================================================
    // DOM 加载
    // ==================================================

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            startForceTitle
        );

    } else {

        startForceTitle();

    }


    // ==================================================
    // 暴露函数
    // ==================================================

    window.forceShowBookTitle = forceShowBookTitle;

})();
