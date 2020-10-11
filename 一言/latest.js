//
// 一言
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
    let w = new ListWidget()
    w = await this.renderHeader(w)
    let data = await this.getData()
    let content = w.addText(data['hitokoto'])
    content.font = Font.lightSystemFont(14)
    w.addSpacer(10)
    let footer = w.addText("—— " + data['from'])
    footer.font = Font.lightSystemFont(10)
    footer.textOpacity = 0.5
    footer.rightAlignText()
    return w
  }
  /**
   * 渲染中尺寸组件
   */
  async renderMedium () {
    return await this.renderSmall()
  }
  /**
   * 渲染大尺寸组件
   */
  async renderLarge () {
    let w = new ListWidget()
    w.addText("不支持尺寸")
    return w
  }

  async renderHeader (widget) {
    let header = widget.addStack()
    let icon = header.addImage(await this.getImage('https://developer.hitokoto.cn/logo.png'))
    icon.imageSize = new Size(15, 15)
    header.addSpacer(10)
    let title = header.addText("一言")
    title.font = Font.boldSystemFont(14)
    title.textOpacity = 0.7
    widget.addSpacer(20)
    return widget
  }

  async getData () {
    // 句子类型，参考：https://developer.hitokoto.cn/sentence/#%E8%AF%B7%E6%B1%82%E5%8F%82%E6%95%B0
    // 备注：l 类型无法返回数据，故取消
    let args = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k']
    if (args.indexOf(this.arg) === -1) this.arg = 'k'
    let api = `https://v1.hitokoto.cn/?c=${this.arg}&encode=json`
    let req = new Request(api)
    let res = await req.loadJSON()
    return res
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
