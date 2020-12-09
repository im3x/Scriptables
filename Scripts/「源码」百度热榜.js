// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: fire;
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
    this.name = '百度热榜'
    this.logo = 'https://www.baidu.com/cache/icon/favicon.ico'
    this.desc = '百度搜索风云榜，实时更新网络热点'
  }

  /**
   * 渲染函数，函数名固定
   * 可以根据 this.widgetFamily 来判断小组件尺寸，以返回不同大小的内容
   */
  async render () {
    const data = await this.getData()
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
    await this.renderHeader(w, this.logo, this.name)
    const t = w.addText(data['hotsearch'][0]['pure_title'])
    t.font = Font.lightSystemFont(16)
    w.addSpacer()
    w.url = this.actionUrl('open-url', decodeURIComponent(data['hotsearch'][0]['linkurl']))
    return w
  }
  /**
   * 渲染中尺寸组件
   */
  async renderMedium (data, num = 4) {
    let w = new ListWidget()
    await this.renderHeader(w, this.logo, this.name)
    data['hotsearch'].slice(0, num).map((d, i) => {
      const cell = w.addStack()
      cell.centerAlignContent()
      const idx = cell.addText(String(i+1))
      idx.font = Font.boldSystemFont(14)
      if (i === 0) {
        idx.textColor = new Color('#fe2d46', 1)
      } else if (i === 1) {
        idx.textColor = new Color('#ff6600', 1)
      } else if (i === 2) {
        idx.textColor = new Color('#faa90e', 1)
      } else {
        idx.textColor = new Color('#9195a3', 1)
      }
      cell.addSpacer(10)
      let _title = d['pure_title']
      _title = _title.replace(/&quot;/g, '"')
      const cell_text = cell.addText(_title)
      cell_text.font = Font.lightSystemFont(14)
      cell_text.lineLimit = 1
      let _url = decodeURIComponent(d['linkurl'])
      _url = _url.replace("://www.", "://m.")
      cell.url = this.actionUrl("open-url", _url)
      cell.addSpacer()
      w.addSpacer()
    })
    // w.addSpacer()

    // let lbg = new LinearGradient()
    // lbg.locations = [0, 1]
    // lbg.colors = [
    //   Color.dynamic(new Color('#cfd9df', 1), new Color('#09203f', 1)),
    //   Color.dynamic(new Color('#e2ebf0', 1), new Color('#537895', 1))
    // ]
    // w.backgroundGradient = lbg
    return w
  }
  /**
   * 渲染大尺寸组件
   */
  async renderLarge (data) {
    return await this.renderMedium(data, 11)
  }

  /**
   * 获取数据函数，函数名可不固定
   */
  async getData () {
    const req = new Request("https://www.baidu.com/")
    req.method = "GET"
    req.headers = {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36 Edg/87.0.664.55"
    }
    const res = await req.loadString()
    // console.log(res)
    const tmp = res.split(`<textarea id="hotsearch_data" style="display:none;">`)[1].split(`</textarea>`)[0]
    console.log(tmp)
    const data = eval(`(${tmp})`)
    console.log(data)
    // const data = JSON.parse(tmp)
    // console.log(data['hotsearch'].length)

    return data
  }

  /**
   * 自定义注册点击事件，用 actionUrl 生成一个触发链接，点击后会执行下方对应的 action
   * @param {string} url 打开的链接
   */
  async actionOpenUrl (url) {
    Safari.openInApp(url, false)
  }

}
// @组件代码结束

const { Testing } = require("./「小件件」开发环境")
await Testing(Widget)