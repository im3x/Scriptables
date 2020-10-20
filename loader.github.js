//
// scriptable 加载器
// 用于加载远程 scriptable 桌面组件插件
// author@im3x
// 公众号@古人云
// https://github.com/im3x/Scriptables
//

class Im3xLoader {
  constructor(git = 'github') {
    this.testMode = false
    // 仓库源
    this.git = git
    this.ver = 202010191700
    // 解析参数
    this.opt = {
      name: 'welcome',
      args: '',
      version: 'latest',
      developer: 'im3x'
    }
    let arg = args.widgetParameter || args['queryParameters']['__widget__']
    // widget@version:params
    // 第三方开发者源：user-name/widget@version:params
    if (arg) {
      let _args = arg.split(":")
      let _plug = _args[0].split("@")
      if (_plug.length === 2) {
        this.opt['version'] = _plug[1]
      }
      let _name = _plug[0].split('/')
      if (_name.length === 2) {
        this.opt['name'] = _name[1]
        this.opt['developer'] = _name[0]
      } else {
        this.opt['name'] = _name[0]
      }
      if (_args.length === 2) this.opt['args'] = _args[1]
    }
    // 缓存路径
    this.workspace = FileManager.local().documentsDirectory()
    this.filename = `${this.opt['developer']}_${this.opt['name']}@${this.opt['version']}.js.im3x`
    this.filepath = this.workspace + '/' + this.filename
    this.notify()
    this.update()
  }

  // 下载代码
  async download() {
    const url = `https://${this.git}.com/${this.opt['developer']}/Scriptables/raw/main/${encodeURIComponent(this.opt['name'])}/${encodeURIComponent(this.opt['version'])}.js?_=${+new Date}`
    console.log(url)
    let req = new Request(url)
    let data = await req.loadString()
    // 如果404
    if (req.response['statusCode'] === 404) {
      throw new Error('插件不存在')
    }
    await FileManager.local().writeString(this.filepath, data)
  }

  async init() {
    // 判断文件是否存在
    let rendered = false
    let widget
    if (FileManager.local().fileExists(this.filepath)) {
      try {
        rendered = true
        widget = await this.render()
      } catch (e) {
        console.warn(e)
        rendered = false
      }
    }
    // 加载代码，存储
    try {
      // 下载代码
      await this.download()
      if (!rendered) {
        widget = await this.render()
      }
    } catch (e) {
      console.warn(e)
      // 网络加载失败，返回错误提示
      // 如果已经渲染了（有本地缓存，直接返回本地代码）
      if (rendered) return widget
      return await this.renderFail(e.message)
    }

    return widget
  }
  // 加载失败提示
  async renderFail(err) {
    let w = new ListWidget()
    let t1 = w.addText("⚠️")
    t1.centerAlignText()
    w.addSpacer(10)
    let t2 = w.addText(err)
    t2.textColor = Color.red()
    t2.font = Font.lightSystemFont(14)
    t2.centerAlignText()
    w.url = `https://github.com/${this.opt['developer']}/Scriptables`
    return w
  }
  // 初始化组件并渲染
  async render() {
    let M = importModule(this.filename)
    let m = new M(this.opt['args'], this)
    // 执行组件自定义方法操作
    if (!config.runsInWidget && typeof m['runActions'] === 'function') {
      try {
        let func = m.runActions.bind(m)
        await func()
      } catch (e) {
        let alert = new Alert()
        alert.title = "执行失败"
        alert.message = e.message
        alert.presentAlert()
      }
      return false
    }
    // 测试模式
    console.log('testMode: ' + this.testMode)
    if (this.testMode && typeof m['test'] === 'function') {
      return await m.test()
    }
    let w = await m.render()
    return w
  }

  // 通知
  async notify() {
    let req = new Request(`https://${this.git}.com/im3x/Scriptables/raw/main/update.notify.json?_=${+new Date}`)
    let res = await req.loadJSON()
    if (!res || !res['id']) return
    // 判断是否已经通知过
    let key = 'im3x_loader_notify'
    if (Keychain.contains(key)) {
      let cache = Keychain.get(key)
      if (cache === res['id']) return
    }
    // 通知
    let n = new Notification()
    n = Object.assign(n, res)
    n.schedule()
    // 设置已通知
    Keychain.set(key, res['id'])
  }
  // 更新加载器
  async update() {
    let req = new Request(`https://gitee.com/api/v5/repos/im3x/Scriptables/commits?path=loader.${this.git}.js&page=1&per_page=1`)
    let res = await req.loadJSON()
    let commit = res[0]
    let key = 'im3x_loader_update'
    if (Keychain.contains(key)) {
      let cache = Keychain.get(key)
      if (cache === commit['sha']) return
    }
    // 加载远程代码内容
    let req1 = new Request(`https://gitee.com/im3x/Scriptables/raw/main/loader.${this.git}.js`)
    let res1 = await req1.loadString()
    // 当前脚本的路径
    let self = module.filename
    // 读取前三行代码（包含图标信息）
    let selfContent = FileManager.local().readString(self)
    let tmp = selfContent.split("\n")
    // 放到前三行
    let new_code = `${tmp[0]}\n${tmp[1]}\n${tmp[2]}\n${res1}`
    // 写入文件
    FileManager.local().writeString(self, new_code)
    Keychain.set(key, commit['sha'])
  }

  // 加载器入口
  async main() {
    if (!config.runsInWidget) {
      // App内运行
      let position = await generatAlert('选项', ['Welcome', '管理已下载组件'], '取消')
      if (position === 1) {
        return await this.manageModule()
      }
    }

    // 运行
    return await this.init()
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

    let actionPosition = await generatAlert('选项', ['运行', '测试', '更新', '删除'], '取消')
    // 删除
    if (actionPosition === 3) {
      if (0 === await generatAlert('确定删除', ['确定'], '取消')) {
        await FileManager.local().remove(this.filepath)
      }
      return
    }

    // 解析文件名称
    // `${this.opt['developer']}_${this.opt['name']}@${this.opt['version']}.js.im3x`
    let _args = this.filename.split('@')
    let _name = _args[0].split('_')
    this.opt['developer'] = _name[0]
    this.opt['name'] = _name[1]
    this.opt['version'] = _args[1].replace('.js.im3x', '')

    // 更新
    if (actionPosition === 2) {
      try {
        // 下载组件
        await this.download()
        await generatAlert('更新成功', null, '关闭')
      } catch (e) {
        await generatAlert(e.message, null, '取消')
      }
      return
    }

    this.testMode = actionPosition === 1
    // 运行 or test
    return await this.init()
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


const Loader = new Im3xLoader()
const widget = await Loader.main()
if (config.runsInWidget && widget) {
  Script.setWidget(widget)
}
Script.complete()