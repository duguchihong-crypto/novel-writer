// ==============================
// 全书页面：状态
// ==============================


// ==================================================
// 当前书籍
// ==================================================

let currentBook = null;


// ==================================================
// 当前选择
// ==================================================

let selectedNodeId = null;

let selectedIsBook = false;

let selectedElement = null;


// ==================================================
// 书名位置
// ==================================================

let bookPosition = {

    x: null,

    y: null
};


// ==================================================
// 书名拖动状态
// ==================================================

let draggingBook = false;

let bookWasDragged = false;

let bookMoveStarted = false;


// 鼠标 / 触摸开始位置

let dragStartX = 0;

let dragStartY = 0;


// 拖动开始时书名的位置

let dragOriginalX = 0;

let dragOriginalY = 0;


// ==================================================
// 拖动判断
// ==================================================

const DRAG_THRESHOLD = 3;


// ==================================================
// 节点尺寸
// ==================================================

const NODE_WIDTH = 155;

const NODE_HEIGHT = 48;


// ==================================================
// 自动布局
// ==================================================

const LEVEL_GAP = 95;

const SIBLING_GAP = 35;


// ==================================================
// 书名尺寸
// ==================================================

const BOOK_MIN_WIDTH = 180;

const BOOK_MAX_WIDTH = 280;

const BOOK_MIN_HEIGHT = 58;


// ==================================================
// 节点类型
// ==================================================

const NODE_TYPES = {

    PREFACE: "preface",

    VOLUME: "volume",

    PART: "part",

    CHAPTER: "chapter"

};


// ==================================================
// 节点名称
// ==================================================

const NODE_TYPE_NAMES = {

    preface: "序",

    volume: "卷",

    part: "篇",

    chapter: "章"

};


// ==================================================
// 节点颜色 CSS
// ==================================================

const NODE_COLOR_TYPES = {

    preface: "node-preface",

    volume: "node-volume",

    part: "node-part",

    chapter: "node-chapter"

};


// ==================================================
// 页面状态
// ==================================================

let bookPageMode = "normal";

let bookPageInitialized = false;

let bookEventsInitialized = false;

let bookResizeInitialized = false;


// ==================================================
// 当前布局
// ==================================================

let currentLayout = null;


// ==================================================
// 画布尺寸
// ==================================================

let treeCanvasWidth = 0;

let treeCanvasHeight = 0;

let treeWidth = 0;

let treeHeight = 0;


// ==================================================
// 连线
// ==================================================

let connectionsVisible = false;


// ==================================================
// 自动布局状态
// ==================================================

let autoLayoutEnabled = false;

let hasStructure = false;

let hasPreface = false;


// ==================================================
// 操作栏状态
// ==================================================

let actionBarMode = "none";

let actionNodeId = null;

let actionButtonPressed = false;


// ==================================================
// 触摸状态
// ==================================================

let touchStarted = false;

let touchStartX = 0;

let touchStartY = 0;


// ==================================================
// 滚动位置
// ==================================================

let savedScrollX = 0;

let savedScrollY = 0;


// ==================================================
// 重置页面状态
// ==================================================

function resetBookPageState() {

    selectedNodeId = null;

    selectedIsBook = false;

    selectedElement = null;


    bookPosition = {

        x: null,

        y: null

    };


    draggingBook = false;

    bookWasDragged = false;

    bookMoveStarted = false;


    dragStartX = 0;

    dragStartY = 0;

    dragOriginalX = 0;

    dragOriginalY = 0;


    bookPageMode = "normal";


    currentLayout = null;


    treeCanvasWidth = 0;

    treeCanvasHeight = 0;

    treeWidth = 0;

    treeHeight = 0;


    connectionsVisible = false;


    actionBarMode = "none";

    actionNodeId = null;

    actionButtonPressed = false;


    touchStarted = false;

    touchStartX = 0;

    touchStartY = 0;


    autoLayoutEnabled = false;

    hasStructure = false;

    hasPreface = false;
}


// ==================================================
// 更新结构状态
// ==================================================

function updateBookStructureState() {

    if (!currentBook) {

        hasStructure = false;

        hasPreface = false;

        autoLayoutEnabled = false;

        connectionsVisible = false;

        return;
    }


    if (
        !Array.isArray(
            currentBook.structure
        )
    ) {

        currentBook.structure = [];

    }


    hasStructure =
        currentBook.structure.length > 0;


    hasPreface =
        currentBook.structure.some(
            node =>
                node.type ===
                NODE_TYPES.PREFACE
        );


    autoLayoutEnabled =
        hasStructure;


    connectionsVisible =
        hasStructure;
}


// ==================================================
// 查找节点
// ==================================================

function getNodeById(
    nodeId,
    nodes = null
) {

    if (!currentBook) {
        return null;
    }


    const list =
        nodes ||
        currentBook.structure ||
        [];


    for (
        let i = 0;
        i < list.length;
        i++
    ) {

        const node =
            list[i];


        if (
            node.id === nodeId
        ) {

            return node;

        }


        if (
            Array.isArray(
                node.children
            ) &&
            node.children.length > 0
        ) {

            const result =
                getNodeById(
                    nodeId,
                    node.children
                );


            if (result) {

                return result;

            }
        }
    }


    return null;
}


// ==================================================
// 获取全部节点
// ==================================================

function getAllNodes(
    nodes = null,
    result = []
) {

    if (!currentBook) {

        return result;

    }


    const list =
        nodes ||
        currentBook.structure ||
        [];


    list.forEach(
        node => {

            result.push(node);


            if (
                Array.isArray(
                    node.children
                ) &&
                node.children.length > 0
            ) {

                getAllNodes(
                    node.children,
                    result
                );

            }

        }
    );


    return result;
}


// ==================================================
// 节点是否存在
// ==================================================

function nodeExists(nodeId) {

    return Boolean(
        getNodeById(nodeId)
    );
}


// ==================================================
// 节点数量
// ==================================================

function getNodeCount() {

    return getAllNodes().length;
}


// ==================================================
// 获取当前选择节点
// ==================================================

function getSelectedNode() {

    if (!selectedNodeId) {

        return null;

    }


    return getNodeById(
        selectedNodeId
    );
}


// ==================================================
// 选择节点
// ==================================================

function setSelectedNode(nodeId) {

    selectedNodeId =
        nodeId;

    selectedIsBook =
        false;

    actionBarMode =
        "node";

    actionNodeId =
        nodeId;
}


// ==================================================
// 选择书名
// ==================================================

function setSelectedBook() {

    selectedNodeId =
        null;

    selectedIsBook =
        true;

    actionBarMode =
        "book";

    actionNodeId =
        null;
}


// ==================================================
// 清除选择
// ==================================================

function resetSelectionState() {

    selectedNodeId =
        null;

    selectedIsBook =
        false;

    selectedElement =
        null;

    actionBarMode =
        "none";

    actionNodeId =
        null;
}


// ==================================================
// 判断是否选择书名
// ==================================================

function isBookSelected() {

    return (
        selectedIsBook === true
    );
}


// ==================================================
// 判断是否选择节点
// ==================================================

function isNodeSelected() {

    return (
        selectedNodeId !== null &&
        selectedNodeId !== undefined
    );
}


// ==================================================
// 获取书名位置
// ==================================================

function getBookPosition() {

    return {

        x: bookPosition.x,

        y: bookPosition.y

    };
}


// ==================================================
// 设置书名位置
// ==================================================

function setBookPosition(
    x,
    y
) {

    bookPosition.x =
        Number(x);

    bookPosition.y =
        Number(y);
}


// ==================================================
// 重置书名位置
// ==================================================

function resetBookPosition() {

    bookPosition = {

        x: null,

        y: null

    };
}


// ==================================================
// 是否存在保存的位置
// ==================================================

function hasSavedBookPosition() {

    return (

        Number.isFinite(
            Number(
                bookPosition.x
            )
        ) &&

        Number.isFinite(
            Number(
                bookPosition.y
            )
        )

    );
}


// ==================================================
// 开始书名拖动
// ==================================================

function beginBookDrag() {

    draggingBook = true;

    bookPageMode =
        "dragging";

    bookMoveStarted =
        false;

    bookWasDragged =
        false;
}


// ==================================================
// 结束书名拖动
// ==================================================

function endBookDrag() {

    draggingBook =
        false;

    bookPageMode =
        "normal";
}


// ==================================================
// 判断拖动距离
// ==================================================

function checkDragDistance(
    x,
    y
) {

    const dx =
        Math.abs(
            x -
            dragStartX
        );


    const dy =
        Math.abs(
            y -
            dragStartY
        );


    if (
        dx > DRAG_THRESHOLD ||
        dy > DRAG_THRESHOLD
    ) {

        bookMoveStarted =
            true;

        bookWasDragged =
            true;

        return true;
    }


    return false;
}


// ==================================================
// 保存滚动位置
// ==================================================

function saveCurrentScrollPosition() {

    savedScrollX =
        window.scrollX || 0;

    savedScrollY =
        window.scrollY || 0;
}


// ==================================================
// 恢复滚动位置
// ==================================================

function restoreScrollPosition() {

    window.scrollTo(
        savedScrollX,
        savedScrollY
    );
}
