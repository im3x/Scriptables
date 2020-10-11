//
// v2ex for scriptables
// author:hack_fish
// 项目地址：https://github.com/im3x/Scriptables
// 功能说明：解析v2ex网站的源码并展示数据（首页tab页面）
// 参数列表：
// v2ex@tab
// v2ex@tab:all（默认）
// v2ex@tab:hot
// ...
//

class Im3xWidget {
  // 初始化，接收参数
  constructor (arg = 'all') {
    this.arg = arg
    this.widgetSize = config.widgetFamily
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
    footer.lineLimit = 1
    return w
  }
  // 中尺寸组件
  async renderMedium () {
    let w = new ListWidget()
    let data = await this.getData()
    let topic = data[0]
    w.url = topic['url']
    w = await this.renderHeader(w)
    w = await this.renderMediumBody(w, topic)
    let bg = new LinearGradient()
    bg.locations = [0, 1]
    bg.colors = [new Color('141414'), new Color('13233F')]

    w.backgroundGradient = bg

    return w
  }
  // 大尺寸组件
  async renderLarge () {
    let w = new ListWidget()
    let data = await this.getData()
    let topic = data[0]
    // w.url = topic['url']
    w = await this.renderHeader(w)
    w = await this.renderMediumBody(w, topic)
    w.addSpacer(15)
    w = await this.renderMediumBody(w, data[1])
    w.addSpacer(15)
    w = await this.renderMediumBody(w, data[2])
    let bg = new LinearGradient()
    bg.locations = [0, 1]
    bg.colors = [new Color('141414'), new Color('13233F')]

    w.backgroundGradient = bg

    return w
  }
  async renderMediumBody (widget, topic) {
    // 左侧，用户头像
    let body = widget.addStack()
    body.url = topic['url']
    let avatar = body.addStack()
    body.addSpacer(20)
    let content = body.addStack()
    content.layoutVertically()
    let _avatar = avatar.addImage(await this.getImage(topic['member']['avatar_large'].split('?')[0]))
    _avatar.imageSize = new Size(80, 80)
    _avatar.cornerRadius = 40

    let title = content.addText(topic['title'])
    title.font = Font.lightSystemFont(16)
    title.textColor = Color.white()
    content.addSpacer(10)
    let footer = content.addText(`@${topic['member']['username']} / ${topic['node']['title']}`)
    footer.font = Font.lightSystemFont(10)
    footer.textColor = Color.white()
    footer.textOpacity = 0.5

    return widget
  }
  async renderHeader (widget) {
    let _icon = await this.getImage("https://www.v2ex.com/static/img/icon_rayps_64.png")
    let _title = "V2EX / TAB"

    let header = widget.addStack()
    let icon = header.addImage(_icon)
    icon.imageSize = new Size(13, 13)
    header.addSpacer(10)
    let title = header.addText(_title)
    title.textColor = Color.white()
    title.textOpacity = 0.7
    title.font = Font.boldSystemFont(12)
    
    widget.addSpacer(15)

    return widget
  }
  // 获取远程图片
  async getImage (url) {
    let req = new Request(url)
    return await req.loadImage()
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
    let url = `https://www.v2ex.com/?tab=${this.arg}`
    let req = new Request(url)
    req.headers = {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/85.0.4183.102'
    }
    let html = await req.loadString()

    // 解析html
    let tmp = html.split(`<div id="Wrapper">`)[1].split(`<div class="inner" style="text-align: right;">`)[0]
    let arr = tmp.split('<div class="cell item">')
    arr.shift()

    let datas = []
    for (let i = 0; i < arr.length; i ++) {
      let t = arr[i]
      let title = t.split(`class="topic-link">`)[1].split('</a')[0]
      let avatar = t.split(`<img src="`)[1].split('"')[0]
      let node = t.split(`<a class="node"`)[1].split('</a>')[0].split('>')[1]
      let user = t.split(`<a class="node" href="`)[1].split('</strong>')[0].split('<strong>')[1].split('>')[1].split('</')[0]
      let link = t.split(`<span class="item_title">`)[1].split('class="')[0].split('"')[1]
      datas.push({
        title,
        url: `https://www.v2ex.com${link}`,
        member: {
          username: user,
          'avatar_large': avatar
        },
        node: {
          title: node
        }
      })
    }

    return datas
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

// test
// await new Im3xWidget().test()
