// ==================================================
// 分组系统：事件
// ==================================================


// ==================================================
// DOM
// ==================================================

let createGroupOverlay = null;

let groupNameInput = null;

let closeCreateGroupButton = null;

let cancelCreateGroupButton = null;

let confirmCreateGroupButton = null;


// ==================================================
// 初始化 DOM
// ==================================================

function initGroupDOM() {

    createGroupOverlay =
        document.getElementById(
            "createGroupOverlay"
        );


    groupNameInput =
        document.getElementById(
            "groupNameInput"
        );


    closeCreateGroupButton =
        document.getElementById(
            "closeCreateGroupButton"
        );


    cancelCreateGroupButton =
        document.getElementById(
            "cancelCreateGroupButton"
        );


    confirmCreateGroupButton =
        document.getElementById(
            "confirmCreateGroupButton"
        );

}


// ==================================================
// 打开新建分组
// ==================================================

function openCreateGroupModal() {

    if (!createGroupOverlay) {

        return;

    }


    createGroupOverlay.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";


    if (groupNameInput) {

        groupNameInput.value = "";


        setTimeout(function() {

            groupNameInput.focus();

        }, 50);

    }

}


// ==================================================
// 关闭新建分组
// ==================================================

function closeCreateGroupModal() {

    if (createGroupOverlay) {

        createGroupOverlay.classList.remove(
            "show"
        );

    }


    document.body.style.overflow = "";

}


// ==================================================
// 创建分组
// ==================================================

function confirmCreateGroup() {

    if (!groupNameInput) {

        return;

    }


    const name =
        groupNameInput.value.trim();


    // ----------------------------------------------
    // 空名称
    // ----------------------------------------------

    if (!name) {

        alert(
            "请输入分组名称。"
        );


        groupNameInput.focus();


        return;

    }


    // ----------------------------------------------
    // 名称长度
    // ----------------------------------------------

    if (name.length > 30) {

        alert(
            "分组名称不能超过30个字。"
        );


        groupNameInput.focus();


        return;

    }


    // ----------------------------------------------
    // 检查重复
    // ----------------------------------------------

    const duplicated =
        groups.some(function(group) {

            return (
                String(group.name)
                    .trim()
                    .toLowerCase()
                ===
                name
                    .toLowerCase()
            );

        });


    if (duplicated) {

        alert(
            "已经存在同名分组。"
        );


        groupNameInput.focus();


        return;

    }


    // ----------------------------------------------
    // 创建
    // ----------------------------------------------

    const newGroup =
        createGroup(name);


    // ----------------------------------------------
    // 保存
    // ----------------------------------------------

    const saved =
        saveGroups();


    if (!saved) {

        return;

    }


    // ----------------------------------------------
    // 关闭
    // ----------------------------------------------

    closeCreateGroupModal();


    // ----------------------------------------------
    // 刷新显示
    // ----------------------------------------------

    renderGroups();


    console.log(
        "创建分组：",
        newGroup
    );

}


// ==================================================
// 初始化事件
// ==================================================

function initGroupEvents() {

    initGroupDOM();


    // ----------------------------------------------
    // 关闭按钮
    // ----------------------------------------------

    if (closeCreateGroupButton) {

        closeCreateGroupButton.addEventListener(
            "click",
            closeCreateGroupModal
        );

    }


    // ----------------------------------------------
    // 取消按钮
    // ----------------------------------------------

    if (cancelCreateGroupButton) {

        cancelCreateGroupButton.addEventListener(
            "click",
            closeCreateGroupModal
        );

    }


    // ----------------------------------------------
    // 创建按钮
    // ----------------------------------------------

    if (confirmCreateGroupButton) {

        confirmCreateGroupButton.addEventListener(
            "click",
            confirmCreateGroup
        );

    }


    // ----------------------------------------------
    // 点击遮罩关闭
    // ----------------------------------------------

    if (createGroupOverlay) {

        createGroupOverlay.addEventListener(
            "click",
            function(event) {

                if (
                    event.target ===
                    createGroupOverlay
                ) {

                    closeCreateGroupModal();

                }

            }
        );

    }


    // ----------------------------------------------
    // 输入框快捷键
    // ----------------------------------------------

    if (groupNameInput) {

        groupNameInput.addEventListener(
            "keydown",
            function(event) {

                if (event.key === "Enter") {

                    confirmCreateGroup();

                }


                if (event.key === "Escape") {

                    closeCreateGroupModal();

                }

            }
        );

    }

}
