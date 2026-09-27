/* ==================================================
   书架状态
================================================== */


/*
 * 所有书籍
 */
let books = [];


/*
 * 当前书架显示模式
 *
 * grid = 网格
 * list = 列表
 */
let shelfViewMode = "grid";


/*
 * 是否正在排序
 */
let isSorting = false;


/*
 * 当前长按相关状态
 */
let longPressTimer = null;

let longPressBookId = null;

let longPressTriggered = false;

let pressedCard = null;


/*
 * 长按开始位置
 */
let pressStartX = 0;

let pressStartY = 0;


/*
 * 长按时间
 *
 * 600ms 后触发
 */
const LONG_PRESS_TIME = 600;


/*
 * 手指移动超过这个距离
 * 就取消长按
 */
const MOVE_CANCEL_DISTANCE = 10;


/*
 * 当前正在拖动排序的书卡
 */
let draggingCard = null;


/*
 * 当前是否正在拖动排序
 */
let isDraggingBook = false;
