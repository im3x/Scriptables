// 毒鸡汤
// iOS14桌面组件
// 运行于 scriptable
// 编写于 20201004
// 作者是 hack_fish
// https://github.com/im3x/Scriptables
// 更多脚本和精彩教程请关注作者公众号 {古人云}

class Im3xWidget {
  constructor () {}
  async render () {
    let text = await this._loadData()
    let w = new ListWidget()
    w.backgroundColor = new Color("#0eb83a", 1)
  
    let title = w.addText("{ 毒鸡汤  }")
    title.font = Font.boldMonospacedSystemFont(16)
    title.textColor = Color.white()
  
    w.addSpacer(18)
  
    let body = w.addText(text)
    body.font = Font.lightMonospacedSystemFont(14)
    body.textColor = Color.white()
    body.textOpacity = 0.88
  
    return w
  }
  async _loadData () {
    let req = new Request('https://api.qinor.cn/soup/')
    let data = await req.loadString()
    return data
  }
  // 用于测试
  async test () {
    if (config.runsInWidget) return
    let widget = await this.render()
    widget.presentSmall()
  }
  // 用户单独使用
  async init () {
    if (!config.runsInWidget) return
    let widget = await this.render()
    Script.setWidget(widget)
    Script.complete()
  }
}

module.exports = Im3xWidget
