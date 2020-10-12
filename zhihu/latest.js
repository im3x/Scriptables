//
// 知乎热榜 for scriptables
// author:hack_fish
// 项目地址：https://github.com/im3x/Scriptables
// 参数列表：
// zhihu@billboard
// 或者：zhihu@latest
// 或：zhihu:1
// 后边的参数为显示第几条数据（仅对小尺寸生效）
// 

class Im3xWidget {
  // 初始化，接收参数
  constructor (arg = '0') {
    this.arg = 0
    try {
      this.arg = parseInt(arg)
    } catch (e) {}
    if (this.arg === NaN || this.arg < 0 || this.arg > 50) this.arg = 0
    this.widgetSize = config.widgetFamily
  }
  // 渲染组件
  async render () {
    let datas = await this.getData()
    if (this.widgetSize === 'medium') {
      return await this.renderMedium(datas)
    } else if (this.widgetSize === 'large') {
      return await this.renderLarge(datas)
    } else {
      return await this.renderSmall(datas[this.arg])
    }
  }
  async renderSmall (topic) {
    let w = new ListWidget()
    w.url = topic['target']['link']['url']
    w = await this.renderHeader(w)
    let content = w.addText(topic['target']['titleArea']['text'])
    content.font = Font.lightSystemFont(16)
    content.textColor = Color.white()
    content.lineLimit = 3

    let _bg = topic['target']['imageArea']['url']
    if (_bg) {
      w.backgroundImage = await this.shadowImage(await this.getImage(_bg))
    } else {
      w.backgroundColor = Color.black()
    }

    w.addSpacer(10)
    let footer = w.addText(topic['target']['metricsArea']['text'])
    footer.font = Font.lightSystemFont(10)
    footer.textColor = Color.white()
    footer.textOpacity = 0.5
    footer.lineLimit = 1
    return w
  }
  // 中尺寸组件
  async renderMedium (datas) {
    let w = new ListWidget()
    w.addSpacer(10)
    w = await this.renderHeader(w, false)
    for (let i = 0; i < 2; i ++) {
      w = await this.renderCell(w, datas[i])
      w.addSpacer(5)
    }

    return w
  }
  // 大尺寸组件
  async renderLarge (datas) {
    let w = new ListWidget()
    w.addSpacer(10)
    w = await this.renderHeader(w, false)
    for (let i = 0; i < 5; i ++) {
      w = await this.renderCell(w, datas[i])
      w.addSpacer(10)
    }

    return w
  }
  async renderCell (widget, topic) {
    let body = widget.addStack()
    body.url = topic['target']['link']['url']

    let left = body.addStack()
    let avatar = left.addImage(await this.getImage(topic['target']['imageArea']['url']))
    avatar.imageSize = new Size(35, 35)
    avatar.cornerRadius = 5

    body.addSpacer(10)

    let right = body.addStack()
    right.layoutVertically()
    let content = right.addText(topic['target']['titleArea']['text'])
    content.font = Font.lightSystemFont(14)
    content.lineLimit = 2

    right.addSpacer(5)

    let info = right.addText(topic['target']['metricsArea']['text'])
    info.font = Font.lightSystemFont(10)
    info.textOpacity = 0.6
    info.lineLimit = 2

    widget.addSpacer(10)

    return widget
  }
  async renderHeader (widget, customStyle = true) {
    let _icon = await this.getImage("https://static.zhihu.com/heifetz/assets/apple-touch-icon-60.a4a761d4.png")
    let _title = "知乎热榜"

    let header = widget.addStack()
    header.centerAlignContent()
    let icon = header.addImage(_icon)
    icon.imageSize = new Size(14, 14)
    icon.cornerRadius = 2
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
    console.log('[get.data.start]')
    let req = new Request('https://www.zhihu.com/billboard')
    let res = await req.loadString()
    console.log('[get.data.end]')
    console.log('[parse data..]')
    let tmp = res.split('<script id="js-initialData" type="text/json">')[1].split('</script>')[0]
    let datas = JSON.parse(tmp)
    console.log('[parse data ok]')
    return datas['initialState']['topstory']['hotList']
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
// 编辑器中测试
// await new Im3xWidget().test()
// 插件独立运行
// await new Im3xWidget().init()
