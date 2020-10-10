
//
// scriptable 加载器
// 用于加载远程 scriptable 桌面组件插件
// author@im3x
// 公众号@古人云
//

class Im3xLoader {
  constructor () {
    // 仓库源
    this.git = "github"
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
  }

  async init () {
    // 判断文件是否存在
    let rendered = false
    if (FileManager.local().fileExists(this.filepath)) {
      try {
        await this.render()
        rendered = true
      } catch(e){}
    }
    // 加载代码，存储
    let req = new Request(`https://${this.git}.com/im3x/Scriptables/raw/main/${encodeURIComponent(this.opt['name'])}/${this.opt['version']}.js?_=${+new Date}`)
    let res = await req.loadString()
    console.log(res)
    await FileManager.local().writeString(this.filepath, res)
    if (!rendered) await this.render()

    Script.complete()
  }
  async render () {
    let M = importModule(this.filename)
    let m = new M(this.opt['args'])
    if (!config.runsInWidget) return await m.test()
    let w = await m.render()
    Script.setWidget(w)
  }
}
new Im3xLoader().init()
