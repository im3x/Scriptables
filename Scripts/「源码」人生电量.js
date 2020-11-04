// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: battery-half;
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
    this.name = '人生电量'
    this.desc = '预计一下余生还剩多少电量'
    this.logo = 'https://txc.gtimg.com/data/287371/2020/1105/a8d2e9e19644b244b7a2307bdf2609c0.png'

    this.registerAction("设置信息", this.actionSettings)
    this.registerAction("透明背景", this.actionSettings3)
    this.BG_FILE = this.getBackgroundImage()
    if (this.BG_FILE) this.registerAction("移除背景", this.actionSettings4)
  }

  /**
   * 渲染函数，函数名固定
   * 可以根据 this.widgetFamily 来判断小组件尺寸，以返回不同大小的内容
   */
  async render () {
    if (!this.settings || !this.settings['name'] || !this.settings['date'] || !this.settings['gender']) {
      return await this.renderConfigure()
    }
    switch (this.widgetFamily) {
      case 'large':
        return await this.renderLarge()
      case 'medium':
        return await this.renderMedium()
      default:
        return await this.renderSmall()
    }
  }

  /**
   * 手工绘制电量图标
   * @param {int} num 0-100 电量
   */
  async renderBattery (stack, num = 100, size = 'small') {

    const SIZES = {
      small: {
        width: 40,
        height: 20,
        borderWidth: 3,
        cornerRadius: 3,
        rightWidth: 2,
        rightHeight: 8,
        spacer: 3
      },
      medium: {
        width: 80,
        height: 40,
        borderWidth: 5,
        cornerRadius: 10,
        rightWidth: 5,
        rightHeight: 15,
        spacer: 5
      },
      large: {}
    }

    const SIZE = SIZES[size]

    // 电池颜色
    let color = new Color("#CCCCCC", 1)
      if (num < 40) color = Color.yellow()
      if (num > 80) color = Color.green()

    const box = stack.addStack()
    box.centerAlignContent()
    const boxLeft = box.addStack()
    boxLeft.size = new Size(SIZE['width'], SIZE['height'])
    boxLeft.borderColor = new Color('#CCCCCC', 0.8)
    boxLeft.borderWidth = SIZE['borderWidth']
    boxLeft.cornerRadius = SIZE['cornerRadius']

    // 中间电量
    // 根据电量，计算电量矩形的长（总长80-边距10）
    // 算法：70/100 * 电量
    const BATTERY_WIDTH = parseInt((SIZE['width'] - (SIZE['spacer']*2)) / 100 * num)
    boxLeft.addSpacer(SIZE['spacer'])
    boxLeft.setPadding(SIZE['spacer'], 0, SIZE['spacer'], 0)
    const boxCenter = boxLeft.addStack()
    boxCenter.backgroundColor = color
    boxCenter.size = new Size(BATTERY_WIDTH, SIZE['height'] - SIZE['spacer']*2)
    boxCenter.cornerRadius = SIZE['cornerRadius'] / 2

    boxLeft.addSpacer((SIZE['width'] - SIZE['spacer']*2) - BATTERY_WIDTH + SIZE['spacer'])

    box.addSpacer(2)

    const boxRight = box.addStack()
    boxRight.backgroundColor = new Color('#CCCCCC', 0.8)
    boxRight.cornerRadius = 5
    boxRight.size = new Size(SIZE['rightWidth'], SIZE['rightHeight'])

    return box
  }

  // 提示配置
  async renderConfigure () {
    const w = new ListWidget()
    w.addText("请点击组件进行设置信息")
    w.url = this.actionUrl("settings")
    return w
  }

  // 获取电量值
  getPricNum () {
    // 电量
    // 男：75，女：78（预计寿命
    const SM = this.settings['gender'] === '男' ? 75 : 78
    // 1. 已经过了多少天
    const DAY_TO_NOW = Math.floor((+new Date() - (+new Date(this.settings['date']))) / (24*60*60*1000))
    // 2. 百分比
    const PRIC_NUM = parseFloat(1-(DAY_TO_NOW / (75*365))).toFixed(2) * 100

    return PRIC_NUM
  }

  /**
   * 渲染小尺寸组件
   */
  async renderSmall () {
    let w = new ListWidget()
    // 名称
    await this.renderHeader(w, this.logo, this.name, this.BG_FILE ? Color.white() : null)


    const PRIC_NUM = this.getPricNum()

    const battery = w.addStack()
    battery.addSpacer()
    await this.renderBattery(battery, PRIC_NUM)
    battery.addSpacer()
    w.addSpacer(5)

    const num = w.addText(` ${PRIC_NUM} %`)
    num.centerAlignText()
    num.font = Font.systemFont(36)


    // 生日
    w.addSpacer()
    const _date = new DateFormatter()
    _date.dateFormat = "yyyy/MM/dd"
    const date = w.addText(this.settings['name'] + ' @ ' + _date.string(new Date(this.settings['date'])))
    date.font = Font.lightSystemFont(10)
    date.textOpacity = 0.8
    date.centerAlignText()

    if (this.BG_FILE) {
      w.backgroundImage = this.BG_FILE
      num.textColor = date.textColor = Color.white()
    }

    w.url = this.actionUrl("settings")

    return w
  }
  /**
   * 渲染中尺寸组件
   */
  async renderMedium () {
    let w = new ListWidget()
    await this.renderHeader(w, this.logo, this.name, this.BG_FILE ? Color.white() : null)
    w.addSpacer()

    const name = w.addText(this.settings['name'])
    name.centerAlignText()
    name.font = Font.systemFont(14)
    name.textOpacity = 0.8
    w.addSpacer(10)

    const box = w.addStack()
    box.centerAlignContent()
    box.addSpacer()
    // 中间电量
    const PRIC_NUM = this.getPricNum()
    const num = box.addText(`${PRIC_NUM} %`)
    num.font = Font.boldSystemFont(34)

    box.addSpacer(10)

    await this.renderBattery(box, PRIC_NUM, 'medium')

    box.addSpacer()
    w.addSpacer()

    w.addSpacer(5)

    const _date = new DateFormatter()
    _date.dateFormat = "yyyy / MM / dd"
    const date = w.addText(_date.string(new Date(this.settings['date'])))
    date.font = Font.lightSystemFont(12)
    date.textOpacity = 0.8
    date.rightAlignText()

    if (this.BG_FILE) {
      w.backgroundImage = this.BG_FILE
      name.textColor = num.textColor = date.textColor = Color.white()
    }

    w.url = this.actionUrl("settings")
    return w
  }
  /**
   * 渲染大尺寸组件
   */
  async renderLarge () {
    return await this.renderMedium()
  }

  /**
   * 获取数据函数，函数名可不固定
   */
  async getData () {
    return false
  }

  /**
   * 自定义注册点击事件，用 actionUrl 生成一个触发链接，点击后会执行下方对应的 action
   * @param {string} url 打开的链接
   */
  async actionOpenUrl (url) {
    Safari.openInApp(url, false)
  }

  async actionSettings () {
    const a = new Alert()
    a.title = "设置信息"
    a.message = "配置您的信息，以便小组件进行计算展示"
    
    const menus = ['输入名称', '选择生日', '选择性别'];
    ;[{
      name:'name',
      text: '输入名称'
    }, {
      name: 'date',
      text: '选择生日'
    }, {
      name: 'gender',
      text: '选择性别'
    }].map(item => {
      a.addAction((this.settings[item.name] ? '✅ ' : '❌ ') + item.text)
    })

    a.addCancelAction('取消设置')
    const id = await a.presentSheet()
    if (id === -1) return
    await this['actionSettings' + id]()
  }

  // 设置名称
  async actionSettings0 () {
    const a = new Alert()
    a.title = "输入名称"
    a.message = "请输入小组件显示的用户名称"
    a.addTextField("名称", this.settings['name'])
    a.addAction("确定")
    a.addCancelAction("取消")

    const id = await a.presentAlert()
    if (id === -1) return await this.actionSettings()
    const n = a.textFieldValue(0)
    if (!n) return await this.actionSettings0()

    this.settings['name'] = n
    this.saveSettings()

    return await this.actionSettings()
  }

  // 选择生日
  async actionSettings1 () {
    const dp = new DatePicker()
    if (this.settings['date']) {
      dp.initialDate = new Date(this.settings['date'])
    }
    let date
    try {
      date = await dp.pickDate()
    } catch (e) {
      return await this.actionSettings()
    }
    this.settings['date'] = date
    this.saveSettings()

    return await this.actionSettings()
  }

  // 选择性别
  async actionSettings2 () {
    const a = new Alert()
    a.title = "选择性别"
    a.message = "性别可用于预计寿命"
    const genders = ['男', '女']
    genders.map(n => {
      a.addAction((this.settings['gender'] === n ? '✅ ' : '') + n)
    })
    a.addCancelAction('取消选择')
    const i = await a.presentSheet()
    if (i !== -1) {
      this.settings['gender'] = genders[i]
      this.saveSettings()
    }
    return await this.actionSettings()
  }

  // 透明背景
  async actionSettings3 () {
    const img = await this.getWidgetScreenShot()
    if (!img) return
    this.setBackgroundImage(img)
  }

  // 移除背景
  async actionSettings4 () {
    this.setBackgroundImage(null)
  }

}
// @组件代码结束

const { Testing } = require("./「小件件」开发环境")
await Testing(Widget)