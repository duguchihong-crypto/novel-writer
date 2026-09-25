/* =========================
   编辑器
========================= */

let currentChapterId = null;
let currentChapterOriginalWordCount = 0;


/* =========================
   新建章节
========================= */

function newChapter() {

    currentChapterId = null;

    currentChapterOriginalWordCount = 0;

    document.getElementById("workPage")
        .classList.remove("active");

    document.getElementById("editorPage")
        .classList.add("active");

    document.getElementById("chapterTitle")
        .value = "";

    document.getElementById("chapterContent")
        .value = "";

    updateWordCount();
}


/* =========================
   打开章节
========================= */

function openChapter(id) {

    const novel =
        novels.find(n => n.id === currentNovelId);

    if (!novel) return;

    const chapter =
        novel.chapters.find(c => c.id === id);

    if (!chapter) return;

    currentChapterId = id;

    currentChapterOriginalWordCount =
        countWords(chapter.content || "");

    document.getElementById("workPage")
        .classList.remove("active");

    document.getElementById("editorPage")
        .classList.add("active");

    document.getElementById("chapterTitle")
        .value = chapter.title || "";

    document.getElementById("chapterContent")
        .value = chapter.content || "";

    updateWordCount();
}


/* =========================
   保存章节
========================= */

function saveChapter() {

    const novel =
        novels.find(n => n.id === currentNovelId);

    if (!novel) return;

    const title =
        document.getElementById("chapterTitle")
            .value
            .trim();

    const content =
        document.getElementById("chapterContent")
            .value;

    if (!title) {

        alert("请输入章节标题");

        return;
    }

    if (!novel.chapters) {

        novel.chapters = [];

    }


    /* 当前字数 */

    const newWordCount =
        countWords(content);


    /* 新增加的字数 */

    const addedWords =
        Math.max(
            0,
            newWordCount -
            currentChapterOriginalWordCount
        );


    /* =========================
       修改已有章节
    ========================= */

    if (currentChapterId) {

        const chapter =
            novel.chapters.find(
                c => c.id === currentChapterId
            );

        if (chapter) {

            chapter.title = title;

            chapter.content = content;

            chapter.updated = Date.now();

        }

    }

    /* =========================
       新建章节
    ========================= */

    else {

        novel.chapters.push({

            id: Date.now().toString(),

            title: title,

            content: content,

            updated: Date.now()

        });

    }


    /* =========================
       记录今日新增字数
    ========================= */

    if (addedWords > 0) {

        recordDailyWords(addedWords);

    }


    novel.updated = Date.now();

    saveNovels();

    backToWork();

}


/* =========================
   返回作品页面
========================= */

function backToWork() {

    document.getElementById("editorPage")
        .classList.remove("active");

    document.getElementById("workPage")
        .classList.add("active");

    renderChapters();

}


/* =========================
   编辑器实时字数
========================= */

function updateWordCount() {

    const textarea =
        document.getElementById("chapterContent");

    if (!textarea) return;

    const count =
        countWords(textarea.value);

    document.getElementById("wordCount")
        .textContent =
        count + " 字";

}


/* =========================
   字数计算
========================= */

function countWords(text) {

    return String(text || "")
        .replace(/\s/g, "")
        .length;

}


/* =========================
   今日码字记录
========================= */

function recordDailyWords(words) {

    if (!words || words <= 0) return;

    if (typeof writingStats === "undefined") {

        window.writingStats = {};

    }

    const today =
        getDateKey(new Date());

    writingStats[today] =
        (writingStats[today] || 0) +
        words;

    localStorage.setItem(
        "writingStats",
        JSON.stringify(writingStats)
    );

}
