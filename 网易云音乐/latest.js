//
// 网易云音乐@热评
// 作者：hack_fish
// 公众号：古人云
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
    this.cacheKey = 'im3x_widget_music_126_data'
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
    let data = await this.getData()
    if (!data) {
      w.addText("数据加载失败")
      return w
    }
    w = await this.renderHeader(w)
    w.addSpacer(20)
    let content = w.addText(data["comments"])
    content.textColor = Color.white()
    content.font = Font.lightSystemFont(16)
    w.backgroundColor = Color.black()
    w.backgroundImage = await this.shadowImage(await this.getImage(data['music_pic']))

    w.addSpacer(10)
    let footer = w.addText("—— 《" + data['name'] + '》')
    footer.rightAlignText()
    footer.font = Font.lightSystemFont(10)
    footer.textColor = Color.white()
    footer.textOpacity = 0.5

    let music_id = data['music_url'].split('id=')[1].split('.')[0]
    w.url = 'orpheus://song/' + music_id
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
    w.addText("暂不支持该尺寸组件")
    return w
  }

  async renderHeader (widget) {
    let header = widget.addStack()
    let icon = header.addImage(await this.getImage('https://s1.music.126.net/style/favicon.ico'))
    icon.imageSize = new Size(15, 15)
    icon.cornerRadius = 2
    header.addSpacer(10)
    let title = header.addText("网易云热评")
    title.textColor = Color.white()
    title.textOpacity = 0.7
    title.font = Font.lightSystemFont(14)

    return widget
  }

  async getData () {
    let data = null
    try {
      let api = 'https://api.66mz8.com/api/music.163.php?format=json'
      let req = new Request(api)
      data = await req.loadJSON()
    } catch (e) {}
    // 判断数据是否为空
    if (!data || !data['comments']) {
      // 判断是否有缓存
      if (Keychain.contains(this.cacheKey)) {
        let cache = JSON.parse(Keychain.get(this.cacheKey))
        return cache
      } else {
        // 刷新
        return false
      }
    }
    // 存储缓存
    Keychain.set(this.cacheKey, JSON.stringify(data))
    return data
  }

  /**
   * 加载远程图片
   * @param url string 图片地址
   * @return image
   */
  async getImage (url) {
    try {
      let req = new Request(url)
      return await req.loadImage()
    } catch (e) {
      let ctx = new DrawContext()
      ctx.size = new Size(100, 100)
      ctx.setFillColor(Color.red())
      ctx.fillRect(new Rect(0, 0, 100, 100))
      return await ctx.getImage()
    }
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
