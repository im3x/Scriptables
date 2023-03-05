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
  /**
   * 传递给组件的参数，可以是桌面 Parameter 数据，也可以是外部如 URLScheme 等传递的数据
   * @param {string} arg 自定义参数
   */
  constructor (arg) {
    super(arg)
    this.name = '彩云天气-温度'
    this.desc = '「小件件」—— 原创精美实用小组件'
    this.logo = 'https://docs.caiyunapp.com/img/favicon.ico'
  }

  /**
   * 渲染函数，函数名固定
   * 可以根据 this.widgetFamily 来判断小组件尺寸，以返回不同大小的内容
   */
  async render () {
    const gps = await Location.current() // 获取当前位置
    const dataOfTempature = await this.getDataOfTempature(gps)
    const dataOfWeather = await this.getDataOfWeather(gps)

    // try {
    //     if (data["status"] !== "ok") {
    //       return this.renderFail(data['error'], true);
    //     }
    // } catch (e) {
    //     return this.renderFail("数据解析失败")
    // }
    switch (this.widgetFamily) {
      case 'large':
        return await this.renderLarge(dataOfTempature["result"], dataOfWeather["result"])
      case 'medium':
        return await this.renderMedium(dataOfTempature["result"], dataOfWeather["result"])
      default:
        return await this.renderSmall(dataOfTempature["result"])
    }
  }

  async renderFail (msg, login = false) {
    const w = new ListWidget()
    w.addText("⚠️")
    w.addSpacer(10)
    const t = w.addText(msg)
    t.textColor = Color.red()
    t.font = Font.boldSystemFont(14)
    w.url = login ? this.actionUrl('login') : this.actionUrl()
    return w
  }

  /**
   * 渲染小尺寸组件
   */
  async renderSmall (data) {
    let w = new ListWidget()
    w.url = this.actionUrl('open-url')
    await this.renderHeader(w, this.logo, this.name)
    const t1 = w.addText("平均温度：" + data["daily"]["temperature"][0]['avg'].toString())
    t1.font = Font.lightSystemFont(16)
    const t2 = w.addText("最高温度：" + data["daily"]["temperature"][0]['max'].toString())
    t2.font = Font.lightSystemFont(16)
    t2.textColor = Color.red()
    const t3 = w.addText("最低温度：" + data["daily"]["temperature"][0]['min'].toString())
    t3.font = Font.lightSystemFont(16)
    t3.textColor = Color.blue()
    w.addSpacer()
    return w
  }
  /**
   * 渲染中尺寸组件
   */
  async renderMedium (data1, data2) {
    let w = new ListWidget()
    w.url = this.actionUrl('open-url')
    await this.renderHeader(w, this.logo, this.name)

    const tempatureResult = `温度：${data1["daily"]["temperature"][0]['max'].toString()}~${data1["daily"]["temperature"][0]['min'].toString()} 平均：${data1["daily"]["temperature"][0]['avg'].toString()}`
    const tempatureText = w.addText(tempatureResult)
    tempatureText.font = Font.lightSystemFont(14)
    tempatureText.textColor = Color.blue()

    let alert_md = '';
    if (data2.alert.content.length > 0) {
      alert_md += '天气预警 ⚠\n';
      data2.alert.content.map(a => {
        alert_md += `${a.title}\n${a.description}`;
      });
    }
    let result = `提醒：${data2.minutely.description.trim()}；${data2.hourly.description.trim()}。\n${alert_md}`;

    w.addSpacer(10)
    let t = w.addText(result)
    t.font = Font.lightSystemFont(14)
    return w
  }
  /**
   * 渲染大尺寸组件
   */
  async renderLarge (data1, data2) {
    return await this.renderMedium(data1, data2)
  }

  /**
   * 获取近两天天气数据
   */
  async getDataOfTempature (gps) {
    const api = `https://api.caiyunapp.com/v2.6/TAkhjf8d1nlSlspN/${gps["longitude"]},${gps["latitude"]}/daily?dailysteps=1`
    console.log(api)
    return await this.httpGet(api)
  }

  /**
   * 获取天气综合数据
   * @returns JSON对象
   */
  async getDataOfWeather (gps) {
    let api = `https://api.caiyunapp.com/v2.5/TAkhjf8d1nlSlspN/${gps["longitude"]},${gps["latitude"]}/weather.json?alert=true`
    let req = new Request(api)
    let res = await req.loadJSON()
    return res
  }

  /**
   * 自定义注册点击事件，用 actionUrl 生成一个触发链接，点击后会执行下方对应的 action
   * @param {string} url 打开的链接
   */
  async actionOpenUrl () {
    Safari.openInApp("https://h5.caiyunapp.com/h5", false)
  }

}
// @组件代码结束

const { Testing } = require("./「小件件」开发环境")
await Testing(Widget)