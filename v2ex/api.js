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
    this.widgetSize = config.widgetFamily
    if (arg === 'hot') this.arg = 'hot'
  }
  // 渲染组件
  async render () {
    if (this.widgetSize === 'medium') {
      return await this.renderMedium()
    } else if (this.widgetSize === 'large') {
      return await this.renderLarge()
    } else {
      return await this.renderSmall()
    }
  }
  async renderSmall () {
    let w = new ListWidget()
    let data = await this.getData()
    let topic = data[0]
    w.url = topic['url']
    w = await this.renderHeader(w)
    let content = w.addText(topic['title'])
    content.font = Font.lightSystemFont(16)
    content.textColor = Color.white()

    w.backgroundImage = await this.shadowImage(await this.getImage(topic['member']['avatar_large'].replace('mini', 'large')))

    w.addSpacer(10)
    let footer = w.addText(`@${topic['member']['username']} / ${topic['node']['title']}`)
    footer.font = Font.lightSystemFont(10)
    footer.textColor = Color.white()
    footer.textOpacity = 0.5
    return w
  }
  // 中尺寸组件
  async renderMedium () {
    let w = new ListWidget()
    let data = await this.getData()
    w = await this.renderHeader(w, false)
    for (let i = 0; i < 2; i ++) {
      w = await this.renderCell(w, data[i])
      w.addSpacer(5)
    }

    return w
  }
  // 大尺寸组件
  async renderLarge () {
    let w = new ListWidget()
    let data = await this.getData()
    w = await this.renderHeader(w, false)
    for (let i = 0; i < 5; i ++) {
      w = await this.renderCell(w, data[i])
      w.addSpacer(7)
    }

    return w
  }
  async renderCell (widget, topic) {
    let body = widget.addStack()
    body.url = topic['url']

    let left = body.addStack()
    let avatar = left.addImage(await this.getImage(topic['member']['avatar_large']))
    avatar.imageSize = new Size(35, 35)
    avatar.cornerRadius = 5

    body.addSpacer(10)

    let right = body.addStack()
    right.layoutVertically()
    let content = right.addText(topic['title'])
    content.font = Font.lightSystemFont(14)
    content.lineLimit = 2

    right.addSpacer(5)

    let info = right.addText(`@${topic['member']['username']} / ${topic['node']['title']}`)
    info.font = Font.lightSystemFont(10)
    info.textOpacity = 0.6
    info.lineLimit = 2

    widget.addSpacer(10)

    return widget
  }
  async renderHeader (widget, customStyle = true) {
    let _icon = await this.getImage("https://www.v2ex.com/static/img/icon_rayps_64.png")
    let _title = "V2EX·" + (this.arg === 'hot' ? '最热' : '最新')

    let header = widget.addStack()
    header.centerAlignContent()
    let icon = header.addImage(_icon)
    icon.imageSize = new Size(14, 14)
    header.addSpacer(10)
    let title = header.addText(_title)
    if (customStyle) title.textColor = Color.white()
    title.textOpacity = 0.7
    title.font = Font.boldSystemFont(14)
    
    widget.addSpacer(15)
    return widget
  }
  // 获取远程图片
  async getImage (url) {
    console.log('get-image')
    console.log(url)
    let req = new Request(url)
    let img = await req.loadImage()
    console.log('get.image.done')
    return img
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
    this.widgetSize = 'small'
    let w1 = await this.render()
    await w1.presentSmall()
    this.widgetSize = 'medium'
    let w2 = await this.render()
    await w2.presentMedium()
    this.widgetSize = 'large'
    let w3 = await this.render()
    await w3.presentLarge()
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
// await new Im3xWidget().test()
