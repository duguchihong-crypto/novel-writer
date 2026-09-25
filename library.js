/* ==================================================
   📚 书架模块 library.js
================================================== */


/* ==================================================
   书架数据
================================================== */

let librarySortMode =
    localStorage.getItem("librarySortMode") || "manual";


/* ==================================================
   获取小说总字数
================================================== */

function getNovelWordCount(novel) {

    if (!novel || !novel.chapters) {
        return 0;
    }

    return novel.chapters.reduce((total, chapter) => {

        const content =
            String(chapter.content || "")
                .replace(/\s/g, "");

        return total + content.length;

    }, 0);
}


/* ==================================================
   获取小说显示顺序
================================================== */

function getLibraryNovels() {

    if (typeof novels === "undefined") {
        return [];
    }

    return [...novels];

}


/* ==================================================
   保存手动排序
================================================== */

function saveLibraryOrder() {

    if (typeof novels === "undefined") {
        return;
    }

    localStorage.setItem(
        "novelLibraryOrder",
        JSON.stringify(
            novels.map(novel => novel.id)
        )
    );

}


/* ==================================================
   恢复手动排序
================================================== */

function loadLibraryOrder() {

    if (typeof novels === "undefined") {
        return;
    }

    const saved =
        JSON.parse(
            localStorage.getItem("novelLibraryOrder") || "[]"
        );

    if (!saved.length) {
        return;
    }

    const orderMap = new Map();

    saved.forEach((id, index) => {
        orderMap.set(String(id), index);
    });

    novels.sort((a, b) => {

        const ai =
            orderMap.has(String(a.id))
                ? orderMap.get(String(a.id))
                : 999999;

        const bi =
            orderMap.has(String(b.id))
                ? orderMap.get(String(b.id))
                : 999999;

        return ai - bi;

    });

}


/* ==================================================
   书架模式
================================================== */

function getLibraryMode() {

    return localStorage.getItem("libraryMode") || "grid";

}


function setLibraryMode(mode) {

    localStorage.setItem(
        "libraryMode",
        mode
    );

    renderNovels();

}


/* ==================================================
   打开书架设置
================================================== */

function openLibrarySettings() {

    const menu =
        document.getElementById("librarySettingsMenu");

    if (!menu) return;

    menu.classList.toggle("active");

}


/* ==================================================
   关闭书架设置
================================================== */

function closeLibrarySettings() {

    const menu =
        document.getElementById("librarySettingsMenu");

    if (!menu) return;

    menu.classList.remove("active");

}


/* ==================================================
   设置排序方式
================================================== */

function setLibrarySort(mode) {

    librarySortMode = mode;

    localStorage.setItem(
        "librarySortMode",
        mode
    );

    renderNovels();

}


/* ==================================================
   获取排序后的小说
================================================== */

function getSortedNovels() {

    const list =
        getLibraryNovels();

    /* 手动排序 */

    if (librarySortMode === "manual") {

        return list;

    }


    /* 最近更新 */

    if (librarySortMode === "updated") {

        return list.sort(
            (a, b) =>
                (b.updated || 0) -
                (a.updated || 0)
        );

    }


    /* 创建时间 */

    if (librarySortMode === "created") {

        return list.sort(
            (a, b) =>
                (a.created || a.updated || 0) -
                (b.created || b.updated || 0)
        );

    }


    /* 小说名称 */

    if (librarySortMode === "name") {

        return list.sort(
            (a, b) =>
                String(a.title || a.name || "")
                    .localeCompare(
                        String(b.title || b.name || ""),
                        "zh"
                    )
        );

    }


    /* 字数最多 */

    if (librarySortMode === "words-desc") {

        return list.sort(
            (a, b) =>
                getNovelWordCount(b) -
                getNovelWordCount(a)
        );

    }


    /* 字数最少 */

    if (librarySortMode === "words-asc") {

        return list.sort(
            (a, b) =>
                getNovelWordCount(a) -
                getNovelWordCount(b)
        );

    }


    return list;

}


/* ==================================================
   📚 渲染书架
================================================== */

function renderNovels() {

    const container =
        document.getElementById("novelList");

    if (!container) return;


    const list =
        getSortedNovels();

    const mode =
        getLibraryMode();


    container.innerHTML = "";


    /* 没有小说 */

    if (!list.length) {

        container.innerHTML = `
            <div class="empty-library">
                <div class="empty-library-icon">📚</div>
                <div>还没有作品</div>
                <button onclick="openNewNovelModal()">
                    ＋ 新建作品
                </button>
            </div>
        `;

        return;

    }


    /* ==================================================
       网格模式
    ================================================== */

    if (mode === "grid") {

        container.className =
            "novel-list novel-grid";

        list.forEach(novel => {

            const card =
                document.createElement("div");

            card.className =
                "novel-card-grid";

            card.dataset.id =
                novel.id;


            const cover =
                novel.cover ||
                "";


            card.innerHTML = `

                <div class="novel-cover">

                    ${
                        cover
                        ?
                        `<img src="${cover}" alt="">`
                        :
                        `<div class="default-cover">
                            📖
                        </div>`
                    }

                </div>

                <div class="novel-name">
                    ${
                        novel.title ||
                        novel.name ||
                        "未命名作品"
                    }
                </div>

            `;


            card.addEventListener(
                "click",
                () => {

                    if (
                        typeof openNovel ===
                        "function"
                    ) {

                        openNovel(novel.id);

                    }

                }
            );


            container.appendChild(card);

        });


        return;

    }


    /* ==================================================
       列表模式
    ================================================== */

    container.className =
        "novel-list novel-list-mode";


    list.forEach(novel => {

        const item =
            document.createElement("div");

        item.className =
            "novel-list-item";


        const cover =
            novel.cover ||
            "";


        item.innerHTML = `

            <div class="novel-list-cover">

                ${
                    cover
                    ?
                    `<img src="${cover}" alt="">`
                    :
                    `<div class="default-cover">
                        📖
                    </div>`
                }

            </div>

            <div class="novel-list-info">

                <div class="novel-list-title">
                    ${
                        novel.title ||
                        novel.name ||
                        "未命名作品"
                    }
                </div>

                <div class="novel-list-words">
                    ${getNovelWordCount(novel)} 字
                </div>

            </div>

        `;


        item.addEventListener(
            "click",
            () => {

                if (
                    typeof openNovel ===
                    "function"
                ) {

                    openNovel(novel.id);

                }

            }
        );


        container.appendChild(item);

    });

}


/* ==================================================
   手动排序模式
================================================== */

function enterManualSort() {

    librarySortMode = "manual";

    localStorage.setItem(
        "librarySortMode",
        "manual"
    );

    renderManualSort();

}


/* ==================================================
   显示可拖动排序列表
================================================== */

function renderManualSort() {

    const container =
        document.getElementById("novelList");

    if (!container) return;


    if (typeof novels === "undefined") {
        return;
    }


    container.className =
        "novel-list novel-grid manual-sort";


    container.innerHTML = "";


    novels.forEach((novel, index) => {

        const card =
            document.createElement("div");

        card.className =
            "novel-card-grid sortable-novel";

        card.draggable = true;

        card.dataset.id =
            novel.id;


        const cover =
            novel.cover ||
            "";


        card.innerHTML = `

            <div class="sort-number">
                ${index + 1}
            </div>

            <div class="novel-cover">

                ${
                    cover
                    ?
                    `<img src="${cover}" alt="">`
                    :
                    `<div class="default-cover">
                        📖
                    </div>`
                }

            </div>

            <div class="novel-name">
                ${
                    novel.title ||
                    novel.name ||
                    "未命名作品"
                }
            </div>

            <div class="drag-hint">
                ☰ 拖动
            </div>

        `;


        card.addEventListener(
            "dragstart",
            () => {

                card.classList.add(
                    "dragging"
                );

            }
        );


        card.addEventListener(
            "dragend",
            () => {

                card.classList.remove(
                    "dragging"
                );

                saveLibraryOrder();

                renderManualSort();

            }
        );


        card.addEventListener(
            "dragover",
            event => {

                event.preventDefault();

                const dragging =
                    document.querySelector(
                        ".sortable-novel.dragging"
                    );

                if (!dragging ||
                    dragging === card) {

                    return;

                }


                const cards =
                    [
                        ...container
                            .querySelectorAll(
                                ".sortable-novel"
                            )
                    ];


                const draggingIndex =
                    cards.indexOf(dragging);

                const targetIndex =
                    cards.indexOf(card);


                if (
                    draggingIndex <
                    targetIndex
                ) {

                    container.insertBefore(
                        dragging,
                        card.nextSibling
                    );

                } else {

                    container.insertBefore(
                        dragging,
                        card
                    );

                }


                const newOrder =
                    [
                        ...container
                            .querySelectorAll(
                                ".sortable-novel"
                            )
                    ]
                    .map(
                        element =>
                            String(
                                element.dataset.id
                            )
                    );


                novels.sort(
                    (a, b) =>
                        newOrder.indexOf(
                            String(a.id)
                        )
                        -
                        newOrder.indexOf(
                            String(b.id)
                        )
                );

            }
        );


        container.appendChild(card);

    });

}


/* ==================================================
   初始化书架
================================================== */

function initLibrary() {

    loadLibraryOrder();

    renderNovels();

}


/* ==================================================
   页面加载完成
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initLibrary();

    }
);
