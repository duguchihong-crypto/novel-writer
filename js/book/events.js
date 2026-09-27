// ==============================
// 全书页面：状态
// ==============================


// ==============================
// 当前书籍
// ==============================

let currentBook = null;


// ==============================
// 当前选择状态
// ==============================

// 当前选中的结构节点 ID
let selectedNodeId = null;


// 是否选中了书名
let selectedIsBook = false;


// ==============================
// 书名位置
// ==============================

// 没有结构时，书名可以自由移动
// 有结构后，由布局系统自动控制位置
let bookPosition = {
    x: null,
    y: null
};


// ==============================
// 书名拖动状态
// ==============================

let draggingBook = false;


// 是否真的发生了拖动
// 用来区分「点击书名」和「拖动书名」
let bookWasDragged = false;


// 鼠标 / 手指开始位置
let dragStartX = 0;
let dragStartY = 0;


// 书名开始拖动时的原始位置
let dragOriginalX = 0;
let dragOriginalY = 0;


// ==============================
// 节点布局尺寸
// ==============================

// 普通结构框宽度
const NODE_WIDTH = 155;


// 普通结构框高度
const NODE_HEIGHT = 48;


// 上下层级之间的距离
const LEVEL_GAP = 95;


// 同级节点之间的间距
const SIBLING_GAP = 35;


// ==============================
// 书名尺寸
// ==============================

// 书名不是普通结构框
// 所以单独设置尺寸

const BOOK_MIN_WIDTH = 180;
const BOOK_MAX_WIDTH = 280;
const BOOK_MIN_HEIGHT = 58;


// ==============================
// 节点类型
// ==============================

const NODE_TYPES = {

    PREFACE: "preface",

    VOLUME: "volume",

    PART: "part",

    CHAPTER: "chapter"

};


// ==============================
// 节点显示名称
// ==============================

const NODE_TYPE_NAMES = {

    preface: "序",

    volume: "卷",

    part: "篇",

    chapter: "章"

};


// ==============================
// 节点颜色类型
// ==============================

// 这里只保存类型名称。
// 实际颜色由 book.css 控制。

const NODE_COLOR_TYPES = {

    preface: "node-preface",

    volume: "node-volume",

    part: "node-part",

    chapter: "node-chapter"

};


// ==============================
// 当前页面模式
// ==============================

// normal
// 正常查看

// dragging
// 正在拖动书名

// selecting
// 正在选择节点

let bookPageMode = "normal";


// ==============================
// 防止重复初始化
// ==============================

let bookPageInitialized = false;


// ==============================
// 防止重复绑定事件
// ==============================

let bookEventsInitialized = false;


// ==============================
// 防止重复 resize
// ==============================

let bookResizeInitialized = false;


// ==============================
// 当前布局缓存
// ==============================

// main.js 每次 renderTree()
// 都会重新生成

let currentLayout = null;


// ==============================
// 当前画布尺寸
// ==============================

let treeCanvasWidth = 0;
let treeCanvasHeight = 0;


// ==============================
// 当前树尺寸
// ==============================

let treeWidth = 0;
let treeHeight = 0;


// ==============================
// 选择节点辅助状态
// ==============================

// 当前选择的 DOM 元素
// 主要用于状态记录，不作为数据保存

let selectedElement = null;


// ==============================
// 连接线状态
// ==============================

// 当前是否正在显示连接线
let connectionsVisible = false;


// ==============================
// 页面滚动状态
// ==============================

// 记录进入页面时的滚动位置
// 防止某些浏览器重新渲染后跳动

let savedScrollX = 0;
let savedScrollY = 0;


// ==============================
// 当前操作栏状态
// ==============================

// none
// book
// node

let actionBarMode = "none";


// ==============================
// 当前操作节点
// ==============================

// 用于记录当前显示操作按钮的节点

let actionNodeId = null;


// ==============================
// 防止按钮点击冒泡
// ==============================

let actionButtonPressed = false;


// ==============================
// 触摸状态
// ==============================

let touchStarted = false;

let touchStartX = 0;
let touchStartY = 0;


// ==============================
// 当前是否正在移动书名
// ==============================

let bookMoveStarted = false;


// ==============================
// 移动阈值
// ==============================

// 超过这个距离才算真正拖动
const DRAG_THRESHOLD = 3;


// ==============================
// 自动布局状态
// ==============================

// false
// 没有结构，可以自由移动书名

// true
// 已经存在结构，启用树状自动布局

let autoLayoutEnabled = false;


// ==============================
// 当前是否有结构
// ==============================

let hasStructure = false;


// ==============================
// 当前是否有序
// ==============================

let hasPreface = false;


// ==============================
// 初始化状态
// ==============================

function resetBookPageState() {

    selectedNodeId = null;

    selectedIsBook = false;

    bookPosition = {
        x: null,
        y: null
    };


    draggingBook = false;

    bookWasDragged = false;


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


    selectedElement = null;


    connectionsVisible = false;


    actionBarMode = "none";

    actionNodeId = null;

    actionButtonPressed = false;


    touchStarted = false;

    touchStartX = 0;
    touchStartY = 0;


    bookMoveStarted = false;


    autoLayoutEnabled = false;

    hasStructure = false;

    hasPreface = false;
}


// ==============================
// 更新结构状态
// ==============================

function updateBookStructureState() {

    if (!currentBook) {

        hasStructure = false;

        hasPreface = false;

        autoLayoutEnabled = false;

        return;
    }


    if (
        !currentBook.structure ||
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
                node.type === "preface"
        );


    /*
     * 只要存在至少一个结构，
     * 就启用自动树状布局。
     */

    autoLayoutEnabled =
        hasStructure;


    /*
     * 有结构以后才显示连接线。
     */

    connectionsVisible =
        hasStructure;
}


// ==============================
// 获取节点
// ==============================

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
            node.children &&
            node.children.length
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


// ==============================
// 获取所有节点
// ==============================

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


    list.forEach(node => {

        result.push(node);


        if (
            node.children &&
            node.children.length
        ) {

            getAllNodes(
                node.children,
                result
            );
        }
    });


    return result;
}


// ==============================
// 判断节点是否存在
// ==============================

function nodeExists(nodeId) {

    return Boolean(
        getNodeById(nodeId)
    );
}


// ==============================
// 获取节点数量
// ==============================

function getNodeCount() {

    return getAllNodes().length;
}


// ==============================
// 获取当前选中节点
// ==============================

function getSelectedNode() {

    if (!selectedNodeId) {
        return null;
    }


    return getNodeById(
        selectedNodeId
    );
}


// ==============================
// 设置当前选择
// ==============================

function setSelectedNode(
    nodeId
) {

    selectedNodeId =
        nodeId;

    selectedIsBook =
        false;

    actionBarMode =
        "node";

    actionNodeId =
        nodeId;
}


// ==============================
// 设置选中书名
// ==============================

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


// ==============================
// 清除当前选择状态
// ==============================

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


// ==============================
// 判断当前是否选中书名
// ==============================

function isBookSelected() {

    return (
        selectedIsBook === true
    );
}


// ==============================
// 判断当前是否选中节点
// ==============================

function isNodeSelected() {

    return (
        selectedNodeId !== null &&
        selectedNodeId !== undefined
    );
}


// ==============================
// 获取书名位置
// ==============================

function getBookPosition() {

    return {
        x: bookPosition.x,
        y: bookPosition.y
    };
}


// ==============================
// 设置书名位置
// ==============================

function setBookPosition(
    x,
    y
) {

    bookPosition.x =
        Number(x);

    bookPosition.y =
        Number(y);
}


// ==============================
// 清除书名自由位置
// ==============================

function resetBookPosition() {

    bookPosition = {
        x: null,
        y: null
    };
}


// ==============================
// 判断是否存在自由位置
// ==============================

function hasSavedBookPosition() {

    return (
        Number.isFinite(
            Number(bookPosition.x)
        ) &&
        Number.isFinite(
            Number(bookPosition.y)
        )
    );
}


// ==============================
// 判断是否正在拖动
// ==============================

function isDraggingBook() {

    return draggingBook === true;
}


// ==============================
// 开始拖动
// ==============================

function beginBookDrag() {

    draggingBook = true;

    bookPageMode =
        "dragging";

    bookMoveStarted = false;
}


// ==============================
// 结束拖动
// ==============================

function endBookDrag() {

    draggingBook = false;

    bookPageMode =
        "normal";
}


// ==============================
// 判断是否达到拖动距离
// ==============================

function checkDragDistance(
    x,
    y
) {

    const dx =
        Math.abs(
            x - dragStartX
        );


    const dy =
        Math.abs(
            y - dragStartY
        );


    if (
        dx > DRAG_THRESHOLD ||
        dy > DRAG_THRESHOLD
    ) {

        bookMoveStarted = true;

        bookWasDragged = true;

        return true;
    }


    return false;
}


// ==============================
// 保存滚动位置
// ==============================

function saveCurrentScrollPosition() {

    savedScrollX =
        window.scrollX || 0;

    savedScrollY =
        window.scrollY || 0;
}


// ==============================
// 恢复滚动位置
// ==============================

function restoreScrollPosition() {

    window.scrollTo(
        savedScrollX,
        savedScrollY
    );
}
