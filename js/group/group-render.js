// ==================================================
// 分组系统：显示
// ==================================================


// ==================================================
// 获取分组容器
// ==================================================

function getGroupContainer() {

    return document.getElementById(
        "groupContainer"
    );

}


// ==================================================
// 创建分组卡片
// ==================================================

function createGroupCard(group) {

    const card =
        document.createElement("div");


    card.className = "group-card";


    card.dataset.groupId =
        group.id;


    // ----------------------------------------------
    // 图标
    // ----------------------------------------------

    const icon =
        document.createElement("div");


    icon.className =
        "group-icon";


    icon.textContent = "📁";


    // ----------------------------------------------
    // 信息
    // ----------------------------------------------

    const info =
        document.createElement("div");


    info.className =
        "group-info";


    // ----------------------------------------------
    // 名称
    // ----------------------------------------------

    const name =
        document.createElement("div");


    name.className =
        "group-name";


    name.textContent =
        group.name;


    // ----------------------------------------------
    // 数量
    // ----------------------------------------------

    const count =
        document.createElement("div");


    count.className =
        "group-count";


    count.textContent =
        "0 本";


    // ----------------------------------------------
    // 组合
    // ----------------------------------------------

    info.appendChild(name);

    info.appendChild(count);


    card.appendChild(icon);

    card.appendChild(info);


    return card;

}


// ==================================================
// 显示全部分组
// ==================================================

function renderGroups() {

    const container =
        getGroupContainer();


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (
        !Array.isArray(groups) ||
        groups.length === 0
    ) {

        return;

    }


    groups.forEach(function(group) {

        const card =
            createGroupCard(group);


        container.appendChild(card);

    });

}
