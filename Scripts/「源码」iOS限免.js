// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: apple-alt;
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
  /**
   * 传递给组件的参数，可以是桌面 Parameter 数据，也可以是外部如 URLScheme 等传递的数据
   * @param {string} arg 自定义参数
   */
  constructor (arg) {
    super(arg)
    this.name = 'iOS 限免'
    this.logo = 'https://api.kzddck.com/script/freeapp.png'
    this.desc = 'AppStore 每日限免App速递'

    this.registerAction("关于插件", this.aboutHandler)
  }

  /**
   * 渲染函数，函数名固定
   * 可以根据 this.widgetFamily 来判断小组件尺寸，以返回不同大小的内容
   */
  async render () {
    const data = await this.getData()
    console.log('data=')
    console.log(data)
    switch (this.widgetFamily) {
      case 'large':
        return await this.renderLarge(data)
      case 'medium':
        return await this.renderMedium(data)
      default:
        return await this.renderSmall(data)
    }
  }

  /**
   * 渲染小尺寸组件
   */
  async renderSmall (data) {
    let w = new ListWidget()
    this.renderHeader(w, this.logo, this.name, Color.white())
    // w.addSpacer(10)
    const name = w.addText(data['name'].trim())
    name.font = Font.boldSystemFont(18)
    name.lineLimit = 2
    w.addSpacer(10)
    const c = w.addText(data['class'].trim())
    c.font = Font.lightSystemFont(12)
    w.addSpacer()
    const price = w.addText(data['price'])
    price.font = Font.lightSystemFont(12)
    price.textOpacity = 0.6

    w.backgroundImage = await this.shadowImage(await this.getImageByUrl(data['img']))
    w.url = data['url']

    name.textColor = c.textColor = price.textColor =  Color.white()
    return w
  }
  /**
   * 渲染中尺寸组件
   */
  async renderMedium (data, lineLimit = 3) {
    let w = new ListWidget()
    const body = w.addStack()

    const leftBox = body.addStack()
    leftBox.layoutVertically()
    const icon = leftBox.addImage(await this.getImageByUrl(data['img']))
    icon.imageSize = new Size(60, 60)
    icon.cornerRadius = 5
    leftBox.addSpacer(10)
    const price = leftBox.addText(data['price'])
    price.font = Font.lightSystemFont(10)
    price.textOpacity = 0.8

    body.addSpacer(10)

    const rightBox = body.addStack()
    rightBox.layoutVertically()
    const title = rightBox.addText(data['name'])
    title.font = Font.boldSystemFont(18)
    rightBox.addSpacer(5)

    const c = rightBox.addText(data['class'])
    c.font = Font.lightSystemFont(12)
    c.textOpacity = 0.8
    rightBox.addSpacer(5)

    const desc = rightBox.addText(data['content'])
    desc.lineLimit = lineLimit
    desc.font = Font.lightSystemFont(14)

    w.url = data['url']

    return w
  }
  /**
   * 渲染大尺寸组件
   */
  async renderLarge (data) {
    return await this.renderMedium(data, 15)
  }

  /**
   * 获取数据函数，函数名可不固定
   */
  async getData () {
    return await this.httpGet("https://api.kzddck.com/script/free.json")
  }

  async aboutHandler () {
    const a = new Alert()
    a.title = "关于"
    a.message = "本插件数据来自接口：https://api.kzddck.com/script/free.json\n感谢群友 @你很闹i 分享"
    a.addCancelAction("了解")
    return await a.presentAlert()
  }

}
// @组件代码结束

const { Testing } = require("./「小件件」开发环境")
await Testing(Widget)