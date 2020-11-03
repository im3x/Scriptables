// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: comment-alt;
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
    this.name = '一言'
    this.desc = '在茫茫句海中寻找能感动你的句子'
    this.settings = this.getSettings(true, true)
    if (this.settings && this.settings['arg']) {
      this.arg = this.settings['arg']
    }
    console.log('arg=' + this.arg)
    // 注册设置
    this.registerAction('插件设置', this.actionSetting)
  }

  async render () {
    let w = new ListWidget()
    await this.renderHeader(
      w,
      'https://txc.gtimg.com/data/285778/2020/1012/f9cf50f08ebb8bd391a7118c8348f5d8.png',
      '一言'
    )
    let data = await this._getData()
    let content = w.addText(data['hitokoto'])
    content.font = Font.lightSystemFont(16)
    w.addSpacer()
    let footer = w.addText(data['from'])
    footer.font = Font.lightSystemFont(12)
    footer.textOpacity = 0.5
    footer.rightAlignText()
    footer.lineLimit = 1

    w.url = this.actionUrl("menus", JSON.stringify(data));

    return w
  }

  async _getData () {
    let args = 'abcdefghijk'
    const types = this.arg.split('')
                    .filter(c => args.indexOf(c) > -1)
                    .map(c => `c=${c}`)
                    .join('&') || 'c=k'
    let api = `https://v1.hitokoto.cn/?${types}&encode=json`
    return await this.httpGet(api)
  }
  async actionSetting () {
    let a = new Alert()
    a.title = "插件设置"
    a.message = "桌面组件的个性化设置"
    a.addAction("句子类型")
    a.addCancelAction("取消设置")
    let id = await a.presentSheet()
    if (id === 0) {
      return await this.actionSetting1()
    }
  }
  /**
   * 句子类型设置
   */
  async actionSetting1 () {
    console.warn('setting--->' + this.arg)
    // 设置句子类型
    // 1. 获取本地存储（如果有）
    let caches = {}
    if (this.arg) {
      this.arg.split('').map(a => {
        caches[a] = true
      })
    }
    let a1 = new Alert()
    let keys = [
      ['a',	'动画'],
      ['b',	'漫画'],
      ['c',	'游戏'],
      ['d',	'文学'],
      ['e',	'原创'],
      ['g',	'其他'],
      ['h',	'影视'],
      ['i',	'诗词'],
      ['k',	'哲学'],
      ['j',	'网易云'],
      ['f',	'来自网络'],
    ]
    a1.title = "句子类型"
    a1.message = "桌面组件显示的语句内容类型"
    keys.map(k => {
      let _id = k[0]
      let _name = k[1]
      if (caches[_id]) {
        _name = `✅ ${_name}`
      }
      a1.addAction(_name)
    })
    a1.addCancelAction("完成设置")
    let id1 = await a1.presentSheet()
    if (id1 === -1) return this.saveSettings()
    console.log(id1)
    let arg = keys[id1]
    // 本地存储
    if (caches[arg[0]]) {
      // 已经有了，那么就取消
      caches[arg[0]] = false
    } else {
      caches[arg[0]] = true
    }
    // 重新获取设置
    let _caches = []
    for (let k in caches) {
      if (caches[k]) {
        _caches.push(k)
      }
    }
    this.arg = _caches.join('');
    this.settings["arg"] = this.arg;
    // this.saveSettings(false);
    // console.log('save-setting:' + this.arg)
    // Keychain.set(this.SETTING_KEY, this.arg)
    return await this.actionSetting1()
  }

  // 用户点击组件，触发的 action
  async actionMenus (content) {
    // this.settings = this.getSettings()
    const data = JSON.parse(content)
    const alert = new Alert()
    alert.title = "一言"
    alert.message = data['hitokoto']
    alert.addAction("复制内容")
    alert.addAction("内容设置")
    alert.addAction("关于一言")
    alert.addCancelAction("取消操作")
    const idx = await alert.presentSheet()
    if (idx === 0) {
      Pasteboard.copyString(data['hitokoto'] + "\n" + "—— " + data['from'])
    } else if (idx === 1) {
      return await this.actionSetting1()
    } else if (idx === 2) {
      Safari.openInApp('https://hitokoto.cn/about', false)
    }
  }
}
// @组件代码结束

const { Testing } = require("./「小件件」开发环境")
await Testing(Widget)