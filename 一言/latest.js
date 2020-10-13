//
// 一言
// 项目地址：https://github.com/im3x/Scriptables
//

class Im3xWidget {
  /**
   * 初始化
   * @param arg 外部传递过来的参数
   */
  constructor (arg = 'k', loader) {
    this.arg = arg
    this.loader = loader
    this.fileName = module.filename.split('Documents/')[1]
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
    w = await this.renderHeader(w, 'https://txc.gtimg.com/data/285778/2020/1012/f9cf50f08ebb8bd391a7118c8348f5d8.png', '一言')
    let data = await this.getData()
    let content = w.addText(data['hitokoto'])
    content.font = Font.lightSystemFont(14)
    w.addSpacer(10)
    let footer = w.addText("—— " + data['from'])
    footer.font = Font.lightSystemFont(10)
    footer.textOpacity = 0.5
    footer.rightAlignText()
    if (this.loader) w.url = this.getURIScheme("do", data['hitokoto'])
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
    return await this.renderSmall()
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
    _title.font = Font.boldSystemFont(12)
    widget.addSpacer(15)
    return widget
  }

  async getData () {
    // 句子类型，参考：https://developer.hitokoto.cn/sentence/#%E8%AF%B7%E6%B1%82%E5%8F%82%E6%95%B0
    // 备注：l 类型无法返回数据，故取消
    let args = 'abcdefghijk'
    const types = this.arg.split('')
                    .filter(c => args.indexOf(c) > -1)
                    .map(c => `c=${c}`)
                    .join('&') || 'c=k'
    let api = `https://v1.hitokoto.cn/?${types}&encode=json`
    return await this.fetchAPI(api)
  }
  /**
   * 获取api数据
   * @param api api地址
   * @param json 接口数据是否是 json 格式，如果不是（纯text)，则传递 false
   * @return 数据 || null
   */
  async fetchAPI (api, json = true) {
    let data = null
    const cacheKey = `${this.fileName}_cache`
    try {
      let req = new Request(api)
      data = await (json ? req.loadJSON() : req.loadString())
    } catch (e) {}
    // 判断数据是否为空（加载失败）
    if (!data) {
      // 判断是否有缓存
      if (Keychain.contains(cacheKey)) {
        let cache = Keychain.get(cacheKey)
        return json ? JSON.parse(cache) : cache
      } else {
        // 刷新
        return null
      }
    }
    // 存储缓存
    Keychain.set(cacheKey, json ? JSON.stringify(data) : data)
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

  async runActions () {
    let { act, data } = this.parseQuery()
    if (!act) return
    if (act !== 'do') return
    const alert = new Alert()
    alert.title = "一言"
    alert.message = data
    alert.addAction("复制内容")
    alert.addAction("查看源码")
    alert.addCancelAction("取消操作")

    let idx = await alert.presentSheet()
    switch (idx) {
      case 0:
        Pasteboard.copyString(data)
        break
      case 1:
        Safari.openInApp("https://github.com/im3x/Scriptables/tree/main/%E4%B8%80%E8%A8%80", false)
        break
    }
  }

  // 获取跳转自身 urlscheme
  // w.url = this.getURIScheme("copy", "data-to-copy")
  getURIScheme (act, data) {
    let _raw = typeof data === 'object' ? JSON.stringify(data) : data
    let _data = Data.fromString(_raw)
    let _b64 = _data.toBase64String()
    return `scriptable:///run?scriptName=${encodeURIComponent(Script.name())}&act=${act}&data=${_b64}&__widget__=${encodeURIComponent(args['widgetParameter'])}`
  }
  // 解析 urlscheme 参数
  // { act: "copy", data: "copy" }
  parseQuery () {
    const { act, data } = args['queryParameters']
    if (!act) return { act }
    let _data = Data.fromBase64String(data)
    let _raw = _data.toRawString()
    let result = _raw
    try {
      result = JSON.parse(_raw)
    } catch (e) {}
    return {
      act,
      data: result
    }
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
    if (!config.runsInWidget) return await this.runActions()
    let widget = await this.render()
    Script.setWidget(widget)
    Script.complete()
  }
}

module.exports = Im3xWidget

// 如果是在编辑器内编辑、运行、测试，则取消注释这行，便于调试：
// await new Im3xWidget('').test()

// 如果是组件单独使用（桌面配置选择这个组件使用，则取消注释这一行：
// await new Im3xWidget(args.widgetParameter, true).init()