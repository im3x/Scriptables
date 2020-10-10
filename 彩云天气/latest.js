console.log("start")
c = await Location.current()
console.log("end:")
console.log(c)

const API = "https://api.caiyunapp.com/v2.5/TAkhjf8d1nlSlspN/" + c["longitude"] + "," + c["latitude"]+ "/weather.json?alert=true"

const res = new Request(API)

const data = await res.loadJSON()


let alert_md = '';
    if (data.result.alert.content.length > 0) {
      alert_md += '天气预警 ⚠\n';
      data.result.alert.content.map(a => {
        alert_md += `${a.title}\n${a.description}`;
      });
    }
let result = `降雨提醒：\n${data.result.minutely.description.trim()}\n\n天气预报：\n${data.result.hourly.description.trim()}\n${alert_md}`;

console.log(result)


let widget = new ListWidget()

let header = widget.addText("🌤 彩云天气")
header.font = Font.boldSystemFont(16)
widget.addSpacer(10)
let t = widget.addText(result)
t.font = Font.lightSystemFont(14)

if (!config.runsInWidget) {
  widget.presentMedium()
}

Script.setWidget(widget)
Script.complete()
