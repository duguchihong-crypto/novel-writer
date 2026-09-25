/* ==================================================
   📚 书架模块
================================================== */


/* =========================
   书架模式
========================= */

let libraryMode =
    localStorage.getItem("libraryMode") || "grid";

let librarySortMode =
    localStorage.getItem("librarySortMode") || "manual";


/* =========================
   初始化
========================= */

function initLibrary() {

    libraryMode =
        localStorage.getItem("libraryMode") || "grid";

    librarySortMode =
        localStorage.getItem("librarySortMode") || "manual";

    renderNovels();

}


/* =========================
   书架设置
========================= */

function toggleSettings() {

    const panel =
        document.getElementById("settingsPanel");

    if (!panel) return;

    panel.classList.toggle("show");

}


/* =========================
   切换网格 / 列表
========================= */

function setLibraryMode(mode) {

    libraryMode = mode;

    localStorage.setItem(
        "libraryMode",
        mode
    );

    renderNovels();

}


/* =========================
   选择排序
========================= */

function setLibrarySort(mode) {

    librarySortMode = mode;

    localStorage.setItem(
        "librarySortMode",
        mode
    );

    renderNovels();

}


/* =========================
   获取作品字数
========================= */

function getNovelWordCount(novel) {

    let total = 0;

    (novel.chapters || []).forEach(
        chapter => {

            total +=
                String(
                    chapter.content || ""
                )
                .replace(/\s/g, "")
                .length;

        }
    );

    return total;

}


/* =========================
   获取排序后的作品
========================= */

function getLibraryNovels() {

    const list = [...novels];


    /* 手动排序 */

    if (librarySortMode === "manual") {

        return list;

    }


    /* 最近更新 */

    if (librarySortMode === "updated") {

        return list.sort(
            (a,b) =>
                (b.updated || 0) -
                (a.updated || 0)
        );

    }


    /* 创建时间 */

    if (librarySortMode === "created") {

        return list.sort(
            (a,b) =>
                (a.created || 0) -
                (b.created || 0)
        );

    }


    /* 名称 */

    if (librarySortMode === "name") {

        return list.sort(
            (a,b) =>
                String(a.name || "")
                .localeCompare(
                    String(b.name || ""),
                    "zh-CN"
                )
        );

    }


    /* 字数最多 */

    if (librarySortMode === "words-desc") {

        return list.sort(
            (a,b) =>
                getNovelWordCount(b) -
                getNovelWordCount(a)
        );

    }


    /* 字数最少 */

    if (librarySortMode === "words-asc") {

        return list.sort(
            (a,b) =>
                getNovelWordCount(a) -
                getNovelWordCount(b)
        );

    }


    return list;

}


/* =========================
   保存手动顺序
========================= */

function saveLibraryOrder() {

    localStorage.setItem(
        "novels",
        JSON.stringify(novels)
    );

}


/* =========================
   手动排序：向上
========================= */

function moveNovelUp(id) {

    const index =
        novels.findIndex(
            novel =>
                String(novel.id) === String(id)
        );

    if (index <= 0) return;

    const temp =
        novels[index - 1];

    novels[index - 1] =
        novels[index];

    novels[index] =
        temp;

    saveLibraryOrder();

    renderNovels();

}


/* =========================
   手动排序：向下
========================= */

function moveNovelDown(id) {

    const index =
        novels.findIndex(
            novel =>
                String(novel.id) === String(id)
        );

    if (
        index < 0 ||
        index >= novels.length - 1
    ) {
        return;
    }

    const temp =
        novels[index + 1];

    novels[index + 1] =
        novels[index];

    novels[index] =
        temp;

    saveLibraryOrder();

    renderNovels();

}


/* =========================
   手动排序模式
========================= */

function enterManualSort() {

    librarySortMode = "manual";

    localStorage.setItem(
        "librarySortMode",
        "manual"
    );

    renderNovels();

}


/* =========================
   书架
========================= */

function renderNovels() {

    const container =
        document.getElementById("novels");

    const empty =
        document.getElementById("emptyState");

    if (!container) return;


    const list =
        getLibraryNovels();


    /* 清空 */

    container.innerHTML = "";


    /* 空书架 */

    if (!list.length) {

        empty.style.display = "block";

        updateLibraryButtons();

        return;

    }

    empty.style.display = "none";


    /* =========================
       网格
    ========================= */

    if (libraryMode === "grid") {

        container.className =
            "novels grid-mode";

    }


    /* =========================
       列表
    ========================= */

    else {

        container.className =
            "novels list-mode";

    }


    list.forEach(
        function(novel,index) {

            const card =
                document.createElement("div");

            card.className =
                "novel-card";


            /* =========================
               网格模式
            ========================= */

            if (libraryMode === "grid") {

                card.innerHTML = `

                    <img
                        class="novel-cover"
                        src="${novel.cover}"
                    >

                    <div class="novel-name">
                        ${escapeHTML(novel.name)}
                    </div>

                `;

            }


            /* =========================
               列表模式
            ========================= */

            else {

                const chapterCount =
                    (novel.chapters || [])
                    .length;

                card.innerHTML = `

                    <img
                        class="novel-cover"
                        src="${novel.cover}"
                    >

                    <div class="novel-info">

                        <div class="novel-name">
                            ${escapeHTML(novel.name)}
                        </div>

                        <div class="novel-description">
                            ${escapeHTML(
                                novel.description ||
                                "暂无简介"
                            )}
                        </div>

                        <div class="novel-meta">
                            ${chapterCount} 章
                            · ${formatNumber(
                                getNovelWordCount(novel)
                            )} 字
                        </div>

                    </div>

                `;

            }


            /* =========================
               点击进入作品
            ========================= */

            card.addEventListener(
                "click",
                function() {

                    openWork(novel.id);

                }
            );


            /* =========================
               手动排序按钮
            ========================= */

            if (
                librarySortMode === "manual"
            ) {

                const sortBox =
                    document.createElement("div");

                sortBox.className =
                    "sort-controls";


                const upButton =
                    document.createElement("button");

                upButton.textContent = "↑";

                upButton.title = "向上移动";

                upButton.onclick =
                    function(event) {

                        event.stopPropagation();

                        moveNovelUp(novel.id);

                    };


                const downButton =
                    document.createElement("button");

                downButton.textContent = "↓";

                downButton.title = "向下移动";

                downButton.onclick =
                    function(event) {

                        event.stopPropagation();

                        moveNovelDown(novel.id);

                    };


                sortBox.appendChild(upButton);
                sortBox.appendChild(downButton);

                card.appendChild(sortBox);

            }


            container.appendChild(card);

        }
    );


    updateLibraryButtons();

}


/* =========================
   更新按钮状态
========================= */

function updateLibraryButtons() {

    const grid =
        document.getElementById(
            "gridModeBtn"
        );

    const list =
        document.getElementById(
            "listModeBtn"
        );


    if (grid) {

        grid.classList.toggle(
            "active",
            libraryMode === "grid"
        );

    }


    if (list) {

        list.classList.toggle(
            "active",
            libraryMode === "list"
        );

    }


    const sortButtons =
        document.querySelectorAll(
            ".sort-option"
        );


    sortButtons.forEach(
        button => {

            button.classList.toggle(
                "active",
                button.dataset.sort ===
                librarySortMode
            );

        }
    );

}
