// ==============================
// 全书页面：状态
// ==============================

let currentBook = null;

let selectedNodeId = null;
let selectedIsBook = false;

// 书名位置
let bookPosition = {
    x: null,
    y: null
};

// 书名拖动状态
let draggingBook = false;

let dragStartX = 0;
let dragStartY = 0;

let dragOriginalX = 0;
let dragOriginalY = 0;

// 节点尺寸
const NODE_WIDTH = 155;
const NODE_HEIGHT = 48;

// 自动布局参数
const LEVEL_GAP = 95;
const SIBLING_GAP = 35;
