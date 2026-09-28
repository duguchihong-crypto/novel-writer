// ==================================================
// 分组系统：存储
// ==================================================


// ==================================================
// LocalStorage Key
// ==================================================

const GROUP_STORAGE_KEY = "novelGroups";


// ==================================================
// 读取分组
// ==================================================

function loadGroups() {

    try {

        const savedGroups =
            localStorage.getItem(
                GROUP_STORAGE_KEY
            );


        if (!savedGroups) {

            groups = [];

            return;

        }


        const parsedGroups =
            JSON.parse(savedGroups);


        if (Array.isArray(parsedGroups)) {

            groups = parsedGroups;

        } else {

            groups = [];

        }


    } catch (error) {

        console.error(
            "读取分组失败：",
            error
        );

        groups = [];

    }

}


// ==================================================
// 保存分组
// ==================================================

function saveGroups() {

    try {

        localStorage.setItem(
            GROUP_STORAGE_KEY,
            JSON.stringify(groups)
        );


        return true;


    } catch (error) {

        console.error(
            "保存分组失败：",
            error
        );


        alert(
            "保存分组失败，请稍后重试。"
        );


        return false;

    }

}
