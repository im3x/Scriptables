//
// 知乎日报
// by:hack_fish
// 项目地址：https://github.com/im3x/Scriptables
//

class Im3xWidget {
  /**
   * 初始化
   * @param arg 外部传递过来的参数
   */
  constructor (arg) {
    this.arg = arg
    this.widgetSize = config.widgetFamily
    this.cache_idx_key = 'im3x_zhrb_idx'
    this.logo = "https://txc.gtimg.com/data/285778/2020/1012/21d6a07d471112e25bebf555f1a155d4.jpeg"
    this.title = "知乎日报"
  }
  /**
   * 渲染组件
   */
  async render () {
    if (this.widgetSize === 'medium') {
      return await this.renderMedium()
    } else if (this.widgetSize === 'large') {
      return await this.renderLarge()
    } else {
      return await this.renderSmall()
    }
  }

  /**
   * 渲染小尺寸组件
   */
  async renderSmall () {
    let w = new ListWidget()
    let data = await this.getOneData()
    w = await this.renderHeader(w, this.logo, this.title)
    let content = w.addText(data['title'])
    content.font = Font.lightSystemFont(16)
    content.textColor = Color.white()
    content.lineLimit = 3

    w.addSpacer(10)
    let footer = w.addText(data['hint'])
    footer.font = Font.lightSystemFont(10)
    footer.textColor = Color.white()
    footer.textOpacity = 0.5
    footer.lineLimit = 1

    w.backgroundImage = await this.shadowImage(await this.getImage(data['images'][0]))
    w.url = data['url']
    return w
  }
  /**
   * 渲染中尺寸组件
   */
  async renderMedium () {
    let w = new ListWidget()
    w = await this.renderHeader(w, this.logo, this.title, false)

    let data = await this.getAllData()

    for (let i = 0; i < 2; i ++) {
      let topic = data[i];
      w = await this.renderCell(w, topic)
      w.addSpacer(2)
    }

    return w
  }
  /**
   * 渲染大尺寸组件
   */
  async renderLarge () {
    let w = new ListWidget()
    w = await this.renderHeader(w, this.logo, this.title, false)

    let data = await this.getAllData()

    for (let i = 0; i < 5; i ++) {
      let topic = data[i];
      w = await this.renderCell(w, topic)
      w.addSpacer(8)
    }

    return w
  }

  async renderCell (widget, topic) {
    let body = widget.addStack()
    body.url = topic['url']

    let left = body.addStack()
    let avatar = left.addImage(await this.getImage(topic['images'][0]))
    avatar.imageSize = new Size(35, 35)
    avatar.cornerRadius = 5

    body.addSpacer(10)

    let right = body.addStack()
    right.layoutVertically()
    let content = right.addText(topic['title'])
    content.font = Font.lightSystemFont(14)
    content.lineLimit = 1

    right.addSpacer(5)

    let info = right.addText(topic['hint'])
    info.font = Font.lightSystemFont(10)
    info.textOpacity = 0.6
    info.lineLimit = 2

    widget.addSpacer(10)

    return widget
  }

  /**
   * 获取数据，接口的数据有 6 条，每次调用这个方法，顺序返回1条
   */
  async getOneData () {
    let data = await this.getAllData()
    // 获取index
    let idx = 0
    try {
      let cache = Keychain.get(this.cache_idx_key)
      if (cache) {
        idx = parseInt(cache)
      }
    } catch (e) {}
    if (!Number.isInteger(idx)) idx = 0
    if (idx >= data.length) idx = 0

    let daily = data[idx]

    // 存储index
    idx += 1
    Keychain.set(this.cache_idx_key, String(idx))

    return daily
  }

  /**
   * 获取所有数据
   */
  async getAllData () {
    let api = 'https://news-at.zhihu.com/api/4/news/latest'
    let req = new Request(api)
    let res = await req.loadJSON()
    let data = res['stories']
    return data
  }

  /**
   * 加载远程图片
   * @param url string 图片地址
   * @return image
   */
  async getImage (url) {
    let req = new Request(url)
    return await req.loadImage()
  }

  /**
   * 给图片加上半透明遮罩
   * @param img 要处理的图片对象
   * @return image
   */
  async shadowImage (img) {
    let ctx = new DrawContext()
    ctx.size = img.size
    ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
    // 图片遮罩颜色、透明度设置
    ctx.setFillColor(new Color("#000000", 0.7))
    ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))
    let res = await ctx.getImage()
    return res
  }

  /**
   * 渲染标题
   * @param widget 组件对象
   * @param icon 图标url地址
   * @param title 标题
   */
  async renderHeader (widget, icon, title, customStyle = true) {
    let header = widget.addStack()
    header.centerAlignContent()
    let _icon = header.addImage(await this.getImage(icon))
    _icon.imageSize = new Size(14, 14)
    _icon.cornerRadius = 4
    header.addSpacer(10)
    let _title = header.addText(title)
    if (customStyle) _title.textColor = Color.white()
    _title.textOpacity = 0.7
    _title.font = Font.boldSystemFont(14)
    widget.addSpacer(15)
    return widget
  }

  /**
   * 编辑测试使用
   */
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

  /**
   * 组件单独在桌面运行时调用
   */
  async init () {
    if (!config.runsInWidget) return
    let widget = await this.render()
    Script.setWidget(widget)
    Script.complete()
  }
}

module.exports = Im3xWidget

// 如果是在编辑器内编辑、运行、测试，则取消注释这行，便于调试：
// await new Im3xWidget().test()

// 如果是组件单独使用（桌面配置选择这个组件使用，则取消注释这一行：
// await new Im3xWidget(args.widgetParameter).init()
