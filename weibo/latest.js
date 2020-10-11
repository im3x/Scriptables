//
// 微博热搜榜
// 作者：hack_fish @ 古人云
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
    let res = await this.getData('https://m.weibo.cn/api/container/getIndex?containerid=106003%26filter_type%3Drealtimehot')
    let data = res['data']['cards'][0]['card_group']
    // 去除第一条
    data.shift()
    // 获取随机一条
    let idx = parseInt(Math.random()*data.length)
    if (idx >= data.length) idx = 0
    let topic = data[idx]
    console.log(topic)
    // 显示数据
    let w = new ListWidget()
    w = await this.renderHeader(w, 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2225458401,2104443747&fm=26&gp=0.jpg', '微博热搜')
    let body = w.addStack()
    let txt = body.addText(topic['desc'])
    txt.leftAlignText()
    txt.font = Font.lightSystemFont(14)

    w.addSpacer(10)
    let footer = w.addStack()
    footer.centerAlignContent()
    let img = footer.addImage(await this.getImage(topic['pic']))
    img.imageSize = new Size(18, 18)
    footer.addSpacer(5)
    if (topic['icon']) {
      let hot = footer.addImage(await this.getImage(topic['icon']))
      hot.imageSize = new Size(18, 18)
      footer.addSpacer(5)
    }
    let num = footer.addText(String(topic['desc_extr']))
    num.font = Font.lightSystemFont(10)
    num.textOpacity = 0.5

    w.url = topic['scheme']
    return w
  }
  /**
   * 渲染中尺寸组件
   */
  async renderMedium (count = 4) {
    let res = await this.getData('https://m.weibo.cn/api/container/getIndex?containerid=106003%26filter_type%3Drealtimehot')
    let data = res['data']['cards'][0]['card_group']
    // 去除第一条
    data.shift()
    // 显示数据
    let w = new ListWidget()
    w = await this.renderHeader(w, 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2225458401,2104443747&fm=26&gp=0.jpg', '微博热搜')
    
    // 布局：一行一个，左边顺序排序，中间标题，后边热/新
    for (let i = 0; i < count; i ++) {
      let topic = data[i];
      let dom = w.addStack()
      dom.centerAlignContent()
      let pic = dom.addImage(await this.getImage(topic['pic']))
      pic.imageSize = new Size(18, 18)
      dom.addSpacer(5)
      let title = dom.addText(topic['desc'])
      title.lineLimit = 1
      title.font = Font.lightSystemFont(14)
      dom.addSpacer(5)
      let extr = dom.addText(String(topic['desc_extr']))
      extr.font = Font.lightSystemFont(12)
      extr.textOpacity = 0.6
      dom.addSpacer(5)
      if (topic['icon']) {
        let iconDom = dom.addStack()
        let icon = iconDom.addImage(await this.getImage(topic['icon']))
        icon.imageSize = new Size(18, 18)
      }
      dom.url = topic['scheme']
      w.addSpacer(5)
    }

    return w
  }
  /**
   * 渲染大尺寸组件
   */
  async renderLarge () {
    return await this.renderMedium(11)
  }

  /**
   * 渲染标题
   * @param widget 组件对象
   * @param icon 图标url地址
   * @param title 标题
   */
  async renderHeader (widget, icon, title) {
    let header = widget.addStack()
    header.centerAlignContent()
    let _icon = header.addImage(await this.getImage(icon))
    _icon.imageSize = new Size(14, 14)
    _icon.cornerRadius = 4
    header.addSpacer(10)
    let _title = header.addText(title)
    // _title.textColor = Color.white()
    _title.textOpacity = 0.7
    _title.font = Font.boldSystemFont(14)
    widget.addSpacer(15)
    return widget
  }

  /**
   * 获取api数据
   * @param api api地址
   */
  async getData (api) {
    let req = new Request(api)
    return await req.loadJSON()
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
