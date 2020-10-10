//
// 通用框架插件模版代码
//

class Im3xWidget {
  // 初始化，接收参数
  constructor (arg) {
    this.arg = arg
  }
  // 渲染组件
  async render () {
    let w = new ListWidget()
    return w
  }
  // 用于测试
  async test () {
    if (config.runsInWidget) return
    let widget = await this.render()
    widget.presentSmall()
  }
  // 单独运行
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
