
//
// ONE·一个图文
// iOS14 桌面组件插件 for Scriptable
// author@古人云
// https://github.com/im3x/Scriptables
//

class Im3xWidget {
  // 初始化，接收参数
  constructor (arg) {
    this.arg = parseInt(arg)
    if (!Number.isInteger(this.arg)) this.arg = 0
  }
  // 渲染组件
  async render () {
    let data = await this.getData()
    let widget = await (config.widgetFamily === 'large') ? this.renderLarge(data) : this.renderSmall(data)
    return widget
  }

  async renderLarge (one) {
    let w = new ListWidget()
  
    if (!one) return await this.renderErr(w)
  
    w.url = one["url"]
    
  //   时间
    const dates = one["date"].split(" / ")
    let date1 = w.addText(dates[2])
    date1.font = Font.lightSystemFont(60)
    date1.centerAlignText()
    date1.textColor = Color.white()
    
    let line = w.addText("————".repeat(2))
    line.textOpacity = 0.5
    line.centerAlignText()
    line.textColor = Color.white()
    
    let date2 = w.addText(dates[0] + " / " + dates[1])
    date2.font = Font.lightMonospacedSystemFont(30)
    date2.centerAlignText()
    date2.textColor = Color.white()
    date2.textOpacity = 0.7
  
  //   换行
    w.addSpacer(20)
  //   内容
    let body = w.addText(one["content"])
    body.font = Font.lightSystemFont(22)
    body.textColor = Color.white()
    
    w.addSpacer(50)
    
    let author = w.addText("—— " + one["text_authors"])
    author.rightAlignText()
    author.font = Font.lightSystemFont(14)
    author.textColor = Color.white()
    author.textOpacity = 0.8
  
  // 加载背景图片
    let bg = await this.getImage(one["img_url"])
  
    w.backgroundImage = await this.shadowImage(bg)
  //   记得最后返回组件
    return w
  }

  async renderSmall (one) {
    console.log('create.small.widget')
    let w = new ListWidget()
    
    if (!one) return await this.renderErr(w)
    
    w.url = one["url"]
    console.log(w.url)
  
    w = await this.renderHeader(w)
    console.log('render.header.done')
  
    let body = w.addText(one['content'])
    body.textColor = Color.white()
    body.font = Font.lightSystemFont(config.widgetFamily === 'small' ? 14 : 16)
    w.addSpacer(10)
    let footer = w.addText('—— ' + one['text_authors'])
    footer.rightAlignText()
    footer.textColor = Color.white()
    footer.textOpacity = 0.8
    footer.font = Font.lightSystemFont(12)
  
    // 加载背景图片
    let bg = await this.getImage(one["img_url"])
  
    w.backgroundImage = await this.shadowImage(bg)
    console.log('create.small.widget.done')
    return w
  }

  async renderErr (widget) {
    let err = widget.addText("💔 加载失败，稍后重试..")
    err.textColor = Color.red()
    err.centerAlignText()
    return widget
  }
  async renderHeader (widget) {
    let header = widget.addStack()
    let icon = header.addImage(await this.getImage("http://image.wufazhuce.com/apple-touch-icon.png"))
    icon.imageSize = new Size(15, 15)
    icon.cornerRadius = 4
    let title = header.addText("「ONE · 一个」")
    title.font = Font.mediumSystemFont(13)
    title.textColor = Color.white()
    title.textOpacity = 0.7
    widget.addSpacer(20)
    return widget
  }
  async getData () {
    const API = "http://m.wufazhuce.com/one";
    const req1 = new Request(API)
    await req1.load()
    const body1 = await req1.loadString()
    const token = body1.split("One.token = '")[1].split("'")[0]
    console.log(token)
    
    const API2 = "http://m.wufazhuce.com/one/ajaxlist/0?_token=" + token
    const req2 = new Request(API2)
    const res2 = await req2.loadJSON()
    
    const data = res2["data"]

    return data ? data[this.idx] : false
  }
  async getImage (url) {
    let r = new Request(url)
    return await r.loadImage()
  }
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
  // 用于测试
  async test () {
    if (config.runsInWidget) return
    let widget = await this.render()
    widget.presentSmall()
  }
  // 单独运行
  async init () {
    if (!config.runsInWidget) return
    try {
      this.arg = parseInt(args.widgetParameter)
      if (!Number.isInteger(this.arg)) this.arg = 0
    } catch (e) {}
    let widget = await this.render()
    Script.setWidget(widget)
    Script.complete()
  }
}

if (!Script.loader) {
  new Im3xWidget().test()
  new Im3xWidget().init()
}
module.exports = Im3xWidget
