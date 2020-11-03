// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: comments;
// 
// iOS 桌面组件脚本 @「小件件」
// 开发说明：请从 Widget 类开始编写，注释请勿修改
// https://x.im3x.cn
// 


// 添加require，是为了vscode中可以正确引入包，以获得自动补全等功能
if (typeof require === 'undefined') require = importModule
const { Base } = require("./「小件件」开发环境")

// @组件代码开始
class Widget extends Base {
  constructor (arg) {
    super(arg)
    this.name = '微博热榜'
    this.desc = '实时刷新微博热搜榜事件'
    
    // 注册设置
    this.registerAction('插件设置', this.actionSetting.bind(this))
  }

  async render () {
    if (this.widgetFamily === 'medium') {
      return await this.renderMedium()
    } else if (this.widgetFamily === 'large') {
      return await this.renderLarge()
    } else {
      return await this.renderSmall()
    }
  }

  /**
   * 渲染小尺寸组件
   */
  async renderSmall () {
    let res = await this.httpGet('https://m.weibo.cn/api/container/getIndex?containerid=106003%26filter_type%3Drealtimehot')
    let data = res['data']['cards'][0]['card_group']
    // 去除第一条
    data.shift()
    let topic = data[0]
    console.log(topic)
    // 显示数据
    let w = new ListWidget()
    w = await this.renderHeader(w, 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2225458401,2104443747&fm=26&gp=0.jpg', '微博热搜')
    let body = w.addStack()
    let txt = body.addText(topic['desc'])
    body.addSpacer()
    txt.leftAlignText()
    txt.font = Font.lightSystemFont(14)

    w.addSpacer()
    let footer = w.addStack()
    footer.centerAlignContent()
    let img = footer.addImage(await this.getImageByUrl(topic['pic']))
    img.imageSize = new Size(18, 18)
    footer.addSpacer(5)
    if (topic['icon']) {
      let hot = footer.addImage(await this.getImageByUrl(topic['icon']))
      hot.imageSize = new Size(18, 18)
      footer.addSpacer(5)
    }
    let num = footer.addText(String(topic['desc_extr']))
    num.font = Font.lightSystemFont(10)
    num.textOpacity = 0.5

    w.url = this.actionUrl('open-url', topic['scheme'])
    return w
  }
  /**
   * 渲染中尺寸组件
   */
  async renderMedium (count = 4) {
    let res = await this.httpGet('https://m.weibo.cn/api/container/getIndex?containerid=106003%26filter_type%3Drealtimehot')
    let data = res['data']['cards'][0]['card_group']
    // 去除第一条
    data.shift()
    // 显示数据
    let w = new ListWidget()
    w = await this.renderHeader(w, 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2225458401,2104443747&fm=26&gp=0.jpg', '微博热搜')
    
    // 布局：一行一个，左边顺序排序，中间标题，后边热/新
    const body = w.addStack()
    const bodyLeft = body.addStack()
    bodyLeft.layoutVertically()
    for (let i = 0; i < count; i ++) {
      let topic = data[i];
      let dom = bodyLeft.addStack()
      dom.centerAlignContent()
      let pic = dom.addImage(await this.getImageByUrl(topic['pic']))
      pic.imageSize = new Size(18, 18)
      dom.addSpacer(5)
      let title = dom.addText(topic['desc'])
      title.lineLimit = 1
      title.font = Font.lightSystemFont(14)
      dom.addSpacer(5)
      if (topic['icon']) {
        let iconDom = dom.addStack()
        let icon = iconDom.addImage(await this.getImageByUrl(topic['icon']))
        icon.imageSize = new Size(18, 18)
      }
      dom.addSpacer()
      let extr = dom.addText(String(topic['desc_extr']))
      extr.font = Font.lightSystemFont(12)
      extr.textOpacity = 0.6
      dom.url = this.actionUrl('open-url', topic['scheme'])
      bodyLeft.addSpacer(5)
    }
    body.addSpacer()

    w.url = this.actionUrl("setting")

    return w
  }
  /**
   * 渲染大尺寸组件
   */
  async renderLarge () {
    return await this.renderMedium(11)
  }
  
  async actionSetting () {
    const settings = this.getSettings()
    const arg = settings["type"] || "1"
    let a = new Alert()
    a.title="打开方式"
    a.message="点击小组件浏览热点的方式"
    a.addAction((arg==="0"?"✅ ":"")+"微博客户端")
    a.addAction((arg==="1"?"✅ ":"")+"自带浏览器")
    a.addCancelAction("取消设置")
    let i = await a.presentSheet()
    if (i===-1) return
    this.settings["type"] = String(i)
    this.saveSettings()
  }

  async actionOpenUrl (url) {
    const settings = this.getSettings()
    if (settings['type']==="1"){
      Safari.openInApp(url, false)
    } else {
      let k = decodeURIComponent(url).split('q=')[1].split('&')[0]
      Safari.open('sinaweibo://searchall?q=' + encodeURIComponent(k))
    }
  }

}
// @组件代码结束

const { Testing } = require("./「小件件」开发环境")
await Testing(Widget)