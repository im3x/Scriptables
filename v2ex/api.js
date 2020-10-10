//
// v2ex for scriptables
// author:hack_fish
// 项目地址：https://github.com/im3x/Scriptables
// 功能说明：调用v2ex的官方api，展示最新、最热的内容，点击后跳转相应URL
// 参数列表：
// v2ex@api:hot
// v2ex@api:latest（默认）
//

class Im3xWidget {
  // 初始化，接收参数
  constructor (arg) {
    this.arg = 'latest'
    if (arg === 'hot') this.arg = 'hot'
  }
  // 渲染组件
  async render () {
    let w = new ListWidget()
    let data = await this.getData()
    let topic = data[0]
    w = await this.renderHeader(w)
    let content = w.addText(topic['title'])
    content.font = Font.lightSystemFont(16)
    content.textColor = Color.white()

    w.backgroundImage = await this.shadowImage(await this.getImage(topic['member']['avatar_large']))

    w.addSpacer(10)
    let footer = w.addText(`${topic['node']['title']} / @${topic['member']['username']}`)
    footer.font = Font.lightSystemFont(12)
    return w
  }
  async renderHeader (widget) {
    let _icon = await this.getImage("https://www.v2ex.com/static/img/icon_rayps_64.png")
    let _title = "V2EX·" + this.arg.toUpperCase()

    let header = widget.addStack()
    let icon = header.addImage(_icon)
    icon.imageSize = new Size(15, 15)
    header.addSpacer(10)
    let title = header.addText(_title)
    title.textColor = Color.white()
    title.textOpacity = 0.8
    title.font = Font.boldSystemFont(14)
    
    widget.addSpacer(15)

    return widget
  }
  // 获取远程图片
  async getImage (url) {
    let req = new Request(url)
    return await req.loadImage()
  }
  // 给图片加透明遮罩
  async shadowImage (img) {
    let ctx = new DrawContext()
    // 获取图片的尺寸
    ctx.size = img.size
    
    ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
    ctx.setFillColor(new Color("#000000", 0.7))
    ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))
    
    let res = await ctx.getImage()
    return res
  }
  // 加载数据
  async getData () {
    let api = `https://www.v2ex.com/api/topics/${this.arg}.json`
    let req = new Request(api)
    let res = await req.loadJSON()
    return res
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
