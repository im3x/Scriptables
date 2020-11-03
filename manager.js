// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: magic;
//
// scriptable 管理器
// 用于管理已经加载过得远程 scriptable 桌面组件插件
// author@hushenghao
class Im3xManager {

    constructor() {
        this.workspace = FileManager.local().documentsDirectory()
    }

    // 管理已下载组件
    async manageModule() {
        let list = FileManager.local().listContents(this.workspace)
            .filter(path => path.endWith('.im3x'))// 返回的是相对路径
        list = list.map(path => FileManager.local().fileName(path, true))
        let selectedPosition = await generatTable(list)
        if (selectedPosition === -1) {
            return
        }
        this.filename = list[selectedPosition]// 选择的文件名
        this.filepath = this.workspace + '/' + this.filename
        console.log(this.filepath)

        // let actionPosition = await generatAlert('选项', ['运行', '测试', '更新', '删除'], '取消')
        // // 删除
        // if (actionPosition === 3) {
        if (0 === await generatAlert('确定删除', ['确定'], '取消')) {
            await FileManager.local().remove(this.filepath)
        }
        return
        // }

        // 解析文件名称
        // `${this.opt['developer']}_${this.opt['name']}@${this.opt['version']}.js.im3x`
        let _args = this.filename.split('@')
        let _name = _args[0].split('_')
        this.opt['developer'] = _name[0]
        this.opt['name'] = _name[1]
        this.opt['version'] = _args[1].replace('.js.im3x', '')

        // // 更新
        // if (actionPosition === 2) {
        //     try {
        //         // 下载组件
        //         await this.download()
        //         await generatAlert('更新成功', null, '关闭')
        //     } catch (e) {
        //         await generatAlert(e.message, null, '取消')
        //     }
        //     return
        // }

        // this.testMode = actionPosition === 1
        // // 运行 or test
        // return await this.init()
    }
}

// String.endWith扩展函数
String.prototype.endWith = function (endStr) {
    var d = this.length - endStr.length;
    return (d >= 0 && this.lastIndexOf(endStr) == d)
}

// UITable
async function generatTable(items) {
    let table = new UITable()
    let selectedPosition = -1;
    for (item of items) {
        let row = new UITableRow()
        let rowText = row.addText(item)
        row.onSelect = (p) => {
            selectedPosition = p
        }
        table.addRow(row)
    }
    await QuickLook.present(table)
    return selectedPosition
}

// 弹窗
async function generatAlert(message, options, cancel) {
    let alert = new Alert()
    alert.message = message

    if (options) {
        for (option of options) {
            alert.addAction(option)
        }
    }
    if (cancel) {
        alert.addCancelAction(cancel)
    }
    return await alert.presentAlert()
}

const manager = new Im3xManager()
if (!config.runsInWidget) {
    // App内运行
    var weight = await manager.manageModule()
    if (weight) {
        Script.setWeight(weight)
    }
}
Script.complete()
