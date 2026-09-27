// ==============================
// 全书页面：事件
// ==============================


// ==============================
// 绑定事件
// ==============================

function setupEvents() {

    const canvas =
        document.querySelector(
            ".tree-canvas"
        );


    if (!canvas) {
        return;
    }


    // 点击空白区域
    canvas.addEventListener(
        "click",
        function(event) {

            if (
                event.target === canvas ||
                event.target.closest(
                    ".tree-empty"
                )
            ) {

                clearSelection();
            }
        }
    );


    // 书名点击
    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    if (bookTitle) {

        bookTitle.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                selectBook();
            }
        );


        bookTitle.addEventListener(
            "mousedown",
            startBookDrag
        );
    }


    // 鼠标移动
    document.addEventListener(
        "mousemove",
        function(event) {

            if (draggingBook) {

                applyBookPosition(
                    event.clientX,
                    event.clientY
                );
            }
        }
    );


    // 鼠标松开
    document.addEventListener(
        "mouseup",
        function() {

            if (draggingBook) {

                draggingBook = false;

                saveBook();
            }
        }
    );


    // 返回
    const backButton =
        document.querySelector(
            "#backButton"
        );


    if (backButton) {

        backButton.addEventListener(
            "click",
            goBack
        );
    }


    // 书级操作
    const prefaceButton =
        document.querySelector(
            "#addPreface"
        );


    if (prefaceButton) {

        prefaceButton.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                addRootPreface();
            }
        );
    }


    const chapterButton =
        document.querySelector(
            "#addChapter"
        );


    if (chapterButton) {

        chapterButton.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                addRootChapter();
            }
        );
    }


    const partButton =
        document.querySelector(
            "#addPart"
        );


    if (partButton) {

        partButton.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                addRootPart();
            }
        );
    }


    const volumeButton =
        document.querySelector(
            "#addVolume"
        );


    if (volumeButton) {

        volumeButton.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                addRootVolume();
            }
        );
    }
}


// ==============================
// 选择书名
// ==============================

function selectBook() {

    selectedNodeId = null;

    selectedIsBook = true;


    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    if (bookTitle) {

        bookTitle.classList.add(
            "selected"
        );
    }


    document
        .querySelectorAll(
            ".tree-node"
        )
        .forEach(
            node =>
                node.classList.remove(
                    "selected"
                )
        );


    document
        .querySelectorAll(
            ".node-actions"
        )
        .forEach(
            actions =>
                actions.style.display =
                    "none"
        );


    const bottomActions =
        document.querySelector(
            "#bookActions"
        );


    if (bottomActions) {

        bottomActions.style.display =
            "flex";
    }
}


// ==============================
// 选择节点
// ==============================

function selectNode(nodeId) {

    selectedNodeId =
        nodeId;

    selectedIsBook =
        false;


    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    if (bookTitle) {

        bookTitle.classList.remove(
            "selected"
        );
    }


    document
        .querySelectorAll(
            ".tree-node"
        )
        .forEach(
            node => {

                node.classList.remove(
                    "selected"
                );

                const actions =
                    node.querySelector(
                        ".node-actions"
                    );


                if (actions) {

                    actions.style.display =
                        "none";
                }
            }
        );


    const selected =
        document.querySelector(
            `[data-node-id="${nodeId}"]`
        );


    if (selected) {

        selected.classList.add(
            "selected"
        );


        const actions =
            selected.querySelector(
                ".node-actions"
            );


        if (actions) {

            actions.style.display =
                "flex";
        }
    }


    const bottomActions =
        document.querySelector(
            "#bookActions"
        );


    if (bottomActions) {

        bottomActions.style.display =
            "none";
    }
}


// ==============================
// 清除选择
// ==============================

function clearSelection() {

    selectedNodeId = null;

    selectedIsBook = false;


    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    if (bookTitle) {

        bookTitle.classList.remove(
            "selected"
        );
    }


    document
        .querySelectorAll(
            ".tree-node"
        )
        .forEach(
            node => {

                node.classList.remove(
                    "selected"
                );


                const actions =
                    node.querySelector(
                        ".node-actions"
                    );


                if (actions) {

                    actions.style.display =
                        "none";
                }
            }
        );


    const bottomActions =
        document.querySelector(
            "#bookActions"
        );


    if (bottomActions) {

        bottomActions.style.display =
            "none";
    }
}


// ==============================
// 书名拖动
// ==============================

function startBookDrag(event) {

    // 点击操作按钮时不拖动
    if (
        event.target.closest(
            "button"
        )
    ) {
        return;
    }


    draggingBook = true;


    dragStartX =
        event.clientX;

    dragStartY =
        event.clientY;


    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    if (!bookTitle) {
        return;
    }


    const rect =
        bookTitle.getBoundingClientRect();


    dragOriginalX =
        rect.left;

    dragOriginalY =
        rect.top;


    selectBook();


    event.preventDefault();
}


// ==============================
// 应用书名位置
// ==============================

function applyBookPosition(
    mouseX,
    mouseY
) {

    if (!draggingBook) {
        return;
    }


    const bookTitle =
        document.querySelector(
            "#bookTitle"
        );


    if (!bookTitle) {
        return;
    }


    const canvas =
        document.querySelector(
            ".tree-canvas"
        );


    if (!canvas) {
        return;
    }


    const canvasRect =
        canvas.getBoundingClientRect();


    const dx =
        mouseX -
        dragStartX;


    const dy =
        mouseY -
        dragStartY;


    const x =
        dragOriginalX -
        canvasRect.left +
        dx;


    const y =
        dragOriginalY -
        canvasRect.top +
        dy;


    bookPosition.x = x;

    bookPosition.y = y;


    bookTitle.style.left =
        x + "px";

    bookTitle.style.top =
        y + "px";
}
