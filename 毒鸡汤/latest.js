// 毒鸡汤
// iOS14桌面组件
// 运行于 scriptable
// 编写于 20201004
// 作者是 hack_fish
// https://github.com/im3x/Scriptables
// 更多脚本和精彩教程请关注作者公众号 {古人云}

main()

async function main() {
  let data = await getData()
  let widget = await createWidget(data)
  if (config.runsInWidget) {
    Script.setWidget(widget)
  } else {
    widget.presentLarge()
  }
  Script.complete()
}

// 创建组件
async function createWidget(text) {
  let w = new ListWidget()
  w.backgroundColor = new Color(Device.isUsingDarkAppearance()?"#493131":"#0eb83a", 1)

  let title = w.addText("{ 毒鸡汤 }")
  title.font = Font.boldMonospacedSystemFont(16)
  title.textColor = Color.white()

  w.addSpacer(18)

  let body = w.addText(text)
  body.font = Font.lightMonospacedSystemFont(14)
  body.textColor = Color.white()
  body.textOpacity = 0.88

  return w
}

// 获取数据
async function getData() {
  let t = new Request('https://api.qinor.cn/soup/')
  return t.loadString()
}
