// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: magic;
//
// 即刻是周五吗
// 作者：hushenghao
// 项目地址：https://github.com/im3x/Scriptables
//

class Im3xWidget {

  currentDate() {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var week = date.getDay()
    var weekArr = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    return {
      'MM年dd日': month + "月" + day + "日",
      'yyyy年MM年dd日': year + "年" + month + "月" + day + "日",
      'week': weekArr[week],
      'isFriday': week == 5,
      'nextFriday': (5 - week + 7) % 7
    }
  }

  /**
   * 初始化
   * @param arg 外部传递过来的参数
   */
  constructor(arg) {
    this.arg = arg
    this.widgetSize = config.widgetFamily
  }

  /**
   * 渲染组件
   */
  async render() {
    if (this.widgetSize === 'medium') {
      return await this.renderMedium()
    } else if (this.widgetSize === 'large') {
      return await this.renderLarge()
    } else {
      return await this.renderSmall()
    }
  }

  async createBasicWidget(dateStr, week) {
    let widget = new ListWidget()
    widget.url = 'https://m.okjike.com/topics/565ac9dd4b715411006b5ecd?s=ewoidSI6ICI1YzlmM2Q1MjdhN2FhMzAwMGY3MjhkNjgiCn0='
    widget.setPadding(0, 10, 0, 10)

    // 背景图
    var img = await this.getImage('https://area.sinaapp.com/bingImg/')
    if (img == null) {
      let ctx = new DrawContext()
      ctx.size = new Size(100, 100)
      ctx.setFillColor(Color.yellow())
      ctx.fillRect(new Rect(0, 0, 100, 100))
      img = await ctx.getImage()
    } else {
      img = await this.shadowImage(img)
    }
    widget.backgroundImage = img

    // 时间
    var date = widget.addStack()
    var dateText = date.addText(dateStr)
    dateText.font = Font.lightSystemFont(14)
    date.addSpacer(3)
    var weekText = date.addText(week)
    weekText.font = Font.boldSystemFont(14)
    weekText.textColor = Color.red()

    widget.addSpacer(2)

    var question = widget.addText("今天是周五吗")
    question.font = Font.headline()
    return widget
  }

  /**
   * 渲染小尺寸组件
   */
  async renderSmall() {
    var current = this.currentDate()
    let widget = await this.createBasicWidget(current['MM年dd日'], current['week'])

    widget.addSpacer(35)

    var answer
    if (current['isFriday']) {
      answer = widget.addText('是😏')
      answer.textColor = new Color("#F79709")
    } else {
      answer = widget.addText('不是😶')
    }
    answer.font = Font.boldSystemFont(40)
    return widget
  }

  /**
   * 渲染中尺寸组件
   */
  async renderMedium() {
    var current = this.currentDate()
    let widget = await this.createBasicWidget(current['yyyy年MM年dd日'], current['week'])

    widget.addSpacer(35)

    var answer
    if (current['isFriday']) {
      answer = widget.addText('是😏')
      answer.textColor = new Color("#F79709")
      answer.font = Font.boldSystemFont(40)
    } else {
      answer = widget.addText('不是😶，还差' + current['nextFriday'] + '天')
      answer.font = Font.boldSystemFont(35)
    }
    return widget
  }

  /**
   * 渲染大尺寸组件
   */
  async renderLarge() {
    return await this.renderMedium()
  }

  /**
   * 加载远程图片
   * @param url string 图片地址
   * @return image
   */
  async getImage(url) {
    try {
      let req = new Request(url)
      return await req.loadImage()
    } catch (e) {
      return null
    }
  }

  /**
   * 给图片加上半透明遮罩
   * @param img 要处理的图片对象
   * @return image
   */
  async shadowImage(img) {
    let ctx = new DrawContext()
    ctx.size = img.size
    ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
    // 图片遮罩颜色、透明度设置
    ctx.setFillColor(new Color("#000000", 0.2))
    ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))
    return await ctx.getImage()
  }

  /**
   * 编辑测试使用
   */
  async test() {
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
  async init() {
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