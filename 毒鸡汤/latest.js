//
// 心灵毒鸡汤
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
    let content = w.addText(data)
    content.font = Font.lightSystemFont(14)
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
    header.centerAlignContent()
    let icon = header.addImage(await this.getImage('https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=4088892283,480370796&fm=26&gp=0.jpg'))
    icon.imageSize = new Size(14, 14)
    icon.cornerRadius = 4
    header.addSpacer(10)
    let title = header.addText("毒鸡汤")
    title.font = Font.boldSystemFont(14)
    title.textOpacity = 0.7
    widget.addSpacer(15)
    return widget
  }

  async getData () {
    let api = 'https://api.qinor.cn/soup/'
    let req = new Request(api)
    let res = await req.loadString()
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
