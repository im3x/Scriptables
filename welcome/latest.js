class Im3xWidget {
  // 初始化函数，接收用户输入参数
  constructor (arg) {
    this.arg = arg
  }
  // 渲染组件函数，返回widget
  async render () {
    let widget = new ListWidget()
    let t = "Hello, Scriptable ❤️"
    let u = 'https://github.com/im3x/Scriptables'
    widget.addText(t)
    // widget.addText("arg:" + (this.arg || 'null'))
    widget.url = u
    
    // console.error(this.arg)
    console.log(t)
    console.warn(u)
  
    return widget
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
new Im3xWidget().test()
new Im3xWidget().init()
