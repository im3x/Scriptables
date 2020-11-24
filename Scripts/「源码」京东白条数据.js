// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: hand-holding-usd;
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
    this.name = '京东白条'
    this.desc = '显示京东白条账号额度和还款数据'
    this.logo = 'https://m.jr.jd.com/statics/logo.jpg'

    this.registerAction("登录京东", this.actionLogin)
  }

  /**
   * 渲染函数，函数名固定
   * 可以根据 this.widgetFamily 来判断小组件尺寸，以返回不同大小的内容
   */
  async render () {
    const data = await this.getData()
    try {
      if (data.resultCode !== 0) {
        return this.renderFail(data['resultMsg'], true);
      }
      if (!data.resultData.data['quota'] || !data.resultData.data['bill']) {
        return this.renderFail("数据获取失败，请联系反馈更新")
      }
    } catch (e) {
      return this.renderFail("数据解析失败")
    }
    switch (this.widgetFamily) {
      case 'large':
        return await this.renderLarge(data['resultData']['data'])
      case 'medium':
        return await this.renderMedium(data['resultData']['data'])
      default:
        return await this.renderSmall(data['resultData']['data'])
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

    const bg = new LinearGradient()
    bg.locations = [0, 1]
    bg.colors = [
      new Color('#f35942', 1),
      new Color('#e92d1d', 1)
    ]
    w.backgroundGradient = bg

    // 判断参数，如果传递1，则显示待还，否则显示额度
    let info = {}
    if (this.arg === "1") {
      info = {
        title: data['bill']['title'],
        data: data['bill']['amount'],
        desc: data['bill']['buttonName']
      }
    } else {
      info = {
        title: '可用额度',
        data: data['quota']['quotaLeft'],
        desc: '总额度：' + data['quota']['quotaAll']
      }
    }

    const box = w.addStack()
    const body = box.addStack()
    body.layoutVertically()

    const title = body.addText(info.title)
    title.font = Font.boldSystemFont(16)

    body.addSpacer(10)

    const num = body.addText(info.data)
    num.font = Font.systemFont(24)

    body.addSpacer()

    const desc = body.addText(info.desc)
    desc.font = Font.lightSystemFont(12)
    desc.textOpacity = 0.8
    desc.lineLimit = 1

    box.addSpacer()

    return w
  }
  /**
   * 渲染中尺寸组件
   */
  async renderMedium (data) {
    let w = new ListWidget()

    w.url = this.actionUrl('open-url')

    // const bg = new LinearGradient()
    // bg.locations = [0, 1]
    // bg.colors = [
    //   new Color('#f35942', 1),
    //   new Color('#e92d1d', 1)
    // ]
    // w.backgroundGradient = bg

    w.backgroundImage = await this.getImageByUrl('https://txc.gtimg.com/data/287371/2020/1124/30e1524a9288442bec9243c9afa40e90.png')

    await this.renderHeader(w, this.logo, this.name, Color.white())

    const VIEW_TOP = w.addStack()
    VIEW_TOP.addSpacer(24)
    const TOP_LEFT = VIEW_TOP.addStack()
    TOP_LEFT.layoutVertically()
    const t11 = TOP_LEFT.addText("可用额度")
    t11.font = Font.boldSystemFont(16)

    TOP_LEFT.addSpacer(10)

    const t12 = TOP_LEFT.addText(data['quota']['quotaLeft'])
    t12.font = Font.systemFont(24)
    
    TOP_LEFT.addSpacer()

    const t13 = TOP_LEFT.addText("总额度：" + data['quota']['quotaAll'])
    t13.font = Font.lightSystemFont(12)
    t13.textOpacity = 0.8

    VIEW_TOP.addSpacer()

    const TOP_RIGHT = VIEW_TOP.addStack()
    TOP_RIGHT.layoutVertically()
    const t21 = TOP_RIGHT.addText(data['bill']['title'])
    t21.font = Font.boldSystemFont(16)

    TOP_RIGHT.addSpacer(10)

    const t22 = TOP_RIGHT.addText(data['bill']['amount'])
    t22.font = Font.systemFont(24)

    TOP_RIGHT.addSpacer()

    const t23 = TOP_RIGHT.addText(data['bill']['buttonName'])
    t23.font = Font.lightSystemFont(12)
    t23.textOpacity = 0.8


    ;[t11, t12, t13, t21, t22, t23].map(t => t.textColor = Color.white())

    VIEW_TOP.addSpacer(20)
    return w
  }
  /**
   * 渲染大尺寸组件
   */
  async renderLarge (data) {
    return await this.renderFail("暂只支持中尺寸小组件")
  }

  async getData () {
    const pt_key = this.settings['pt_key']

    const req = new Request("https://ms.jr.jd.com/gw/generic/bt/h5/m/firstScreenNew")
    req.method = "POST"
    req.body = 'reqData={"clientType":"ios","clientVersion":"13.2.3","deviceId":"","environment":"3"}'
    req.headers = {
      Cookie: 'pt_key=' + pt_key
    }
    const res = await req.loadJSON()
    return res
  }

  async actionLogin () {
    const webView = new WebView()
    webView.loadURL('https://mcr.jd.com/credit_home/pages/index.html?btPageType=BT&channelName=024')

    // 循环，获取cookie
    const tm = new Timer()
    tm.timeInterval = 1000
    tm.repeats = true
    tm.schedule(async () => {
      const req = new Request("https://ms.jr.jd.com/gw/generic/bt/h5/m/firstScreenNew")
      req.method = "POST"
      req.body = 'reqData={"clientType":"ios","clientVersion":"13.2.3","deviceId":"","environment":"3"}'
      
      const res = await req.loadJSON()
      const cookies = req.response.cookies
      cookies.map(cookie => {
        if (cookie['name'] === 'pt_key') {
          // 存储，并通知成功
          this.notify("登录成功", "登录凭证已保存！可以关闭当前登录页面了！")
          tm.invalidate()
          this.settings['pt_key'] = cookie['value']
          this.saveSettings(false)
          return
        }
      })
    })

    await webView.present(true)
    tm.invalidate()
  }

  async actionOpenUrl () {
    Safari.openInApp('https://mcr.jd.com/credit_home/pages/index.html?btPageType=BT', false)
  }

}
// @组件代码结束

const { Testing } = require("./「小件件」开发环境")
await Testing(Widget)