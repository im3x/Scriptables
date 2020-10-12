//
// scriptable 加载器
// 用于加载远程 scriptable 桌面组件插件
// author@im3x
// 公众号@古人云
// ver: 202010130310
// https://github.com/im3x/Scriptables
//

class Im3xLoader {
  constructor (git = 'github') {
    // 仓库源
    this.git = git
    // 解析参数
    this.opt = {
      name: 'welcome',
      args: '',
      version: 'latest'
    }
    if (args.widgetParameter) {
      let _args = args.widgetParameter.split(":")
      let _plug = _args[0].split("@")
      if (_plug.length === 2) {
        this.opt['version'] = _plug[1]
      }
      this.opt['name'] = _plug[0]
      if (_args.length === 2) this.opt['args'] = _args[1]
    }
    // 缓存路径
    this.filename = `${this.opt['name']}@${this.opt['version']}.js.im3x`
    this.filepath = FileManager.local().documentsDirectory() + '/' + this.filename
    this.notify()
    this.update()
  }

  async init () {
    // 判断文件是否存在
    let rendered = false
    let widget
    if (FileManager.local().fileExists(this.filepath)) {
      try {
        widget = await this.render()
        rendered = true
      } catch(e){}
    }
    // 加载代码，存储
    try {
      let req = new Request(`https://${this.git}.com/im3x/Scriptables/raw/main/${encodeURIComponent(this.opt['name'])}/${encodeURIComponent(this.opt['version'])}.js?_=${+new Date}`)
      let data = await req.loadString()
      // 如果404
      if (req.response['statusCode'] === 404) {
        return await this.renderFail('插件不存在')
      }
      await FileManager.local().writeString(this.filepath, data)
      if (!rendered) {
        widget = await this.render()
      }
    } catch (e) {
      // 网络加载失败，返回错误提示
      // 如果已经渲染了（有本地缓存，直接返回本地代码）
      if (rendered) return widget
      return await this.renderFail(e.message)
    }

    return widget
  }
  async renderFail (err) {
    let w = new ListWidget()
    let t1 = w.addText("⚠️")
    t1.centerAlignText()
    w.addSpacer(10)
    let t2 = w.addText(err)
    t2.textColor = Color.red()
    t2.font = Font.lightSystemFont(14)
    t2.centerAlignText()
    w.url = 'https://github.com/im3x/Scriptables'
    return w
  }
  async render () {
    let M = importModule(this.filename)
    let m = new M(this.opt['args'])
    if (!config.runsInWidget && m['runActions']) {
      await m.runActions()
      return false
    }
    let w = await m.render()
    return w
  }
  
  async notify () {
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
  async update () {
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
}
const Loader = new Im3xLoader('gitee')
const widget = await Loader.init()
if (config.runsInWidget && widget) {
  Script.setWidget(widget)
}
Script.complete()
