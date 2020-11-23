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
  url = 'https://www.youxi369.com/news/2254_4.html'
  /**
   * 传递给组件的参数，可以是桌面 Parameter 数据，也可以是外部如 URLScheme 等传递的数据
   * @param {string} arg 自定义参数
   */
  constructor (arg) {
    super(arg)
    this.name = '蚂蚁庄园'
    this.desc = '今天的题会做么？'
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
        return await this.renderMedium(data)
    }
  }

  /**
   * 渲染中尺寸组件
   */
  async renderMedium (data, num = 4, title = false) {
    let w = new ListWidget()
    // await this.renderHeader(w, data['logo'], data['title'])
    data.slice(0, num * 2).map((d, idx) => {
      if (!title && idx % 2 === 0) return;
      const cell = w.addStack()
      cell.centerAlignContent()
      const cell_text = cell.addText(d)
      cell_text.font = Font.lightSystemFont(16)
      cell.addSpacer()
      w.addSpacer(10)
    })
    w.url = this.actionUrl(this.url)
    w.addSpacer()
    return w
  }
  /**
   * 渲染大尺寸组件
   */
  async renderLarge (data) {
    return await this.renderMedium(data, 5, true)
  }

  /**
   * 获取数据函数，函数名可不固定
   */
  async getData () {
    const html = await this.fetchAPI(this.url, false);
    const tmp = html.split(`<p style="display:none">mryt</p>`)[1].split(`<div class="more-strategy"><i></i></div>`)[0];

    const arr = tmp.split(`</span>​</p>`).slice(0, 20);
    const result = [];
    for (const answer of arr) {
      // console.log(`====answer==`, answer);
      if (!answer) continue;
      const text = answer.replace(/<p>/, '').replace(/\&nbsp;/gi, ' ').replace(/<span style="[^"]+">/gi, '').replace(/小鸡宝宝考考你[,，]?/, '').trim();
      const [ title, an ] = text.split('答案：');
      if (!title) continue;
      const [ day, t] = title.split('月')[1].split('：');
      result.push(t);
      result.push(`答案：${an}  (${day})`);
    }
    return result;
  }

  // http.get
  async fetchAPI (api, json = true) {
    let data = null
    try {
      let req = new Request(api)
      req.headers = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/85.0.4183.102'
      }
      data = await (json ? req.loadJSON() : req.loadString())
    } catch (e) {}
    // 判断数据是否为空（加载失败）
    if (!data) {
      return null
    }
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
