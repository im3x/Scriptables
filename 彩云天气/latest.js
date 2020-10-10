// 
// 彩云天气，iOS14 桌面组件脚本 for Scriptables
// 测试demo版本
// https://github.com/im3x/Scriptables
// 


class Im3xWidget {
  // 初始化，接收参数
  constructor (arg) {
    this.arg = arg
  }
  // 渲染组件
  async render () {
    let w = new ListWidget()

    let data = await this.getData()
    let alert_md = '';
    if (data.result.alert.content.length > 0) {
      alert_md += '天气预警 ⚠\n';
      data.result.alert.content.map(a => {
        alert_md += `${a.title}\n${a.description}`;
      });
    }
    let result = `降雨提醒：\n${data.result.minutely.description.trim()}\n\n${data.result.hourly.description.trim()}\n${alert_md}`;

    let header = w.addText("🌤 彩云天气")
    header.font = Font.boldSystemFont(16)
    w.addSpacer(10)
    let t = w.addText(result)
    t.font = Font.lightSystemFont(14)

    return w
  }

  async getData () {
    let gps = await Location.current()
    let api = `https://api.caiyunapp.com/v2.5/TAkhjf8d1nlSlspN/${gps["longitude"]},${gps["latitude"]}/weather.json?alert=true`
    let req = new Request(api)
    let res = await req.loadJSON()
    return res
  }
  // 用于测试
  async test () {
    if (config.runsInWidget) return
    let widget = await this.render()
    widget.presentSmall()
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
