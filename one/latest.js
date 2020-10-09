// ONE 一个图文
// iOS14桌面组件
// 公众号：古人云
// 参数：int，用于展示第几条数据，默认0（第一条）

// 获取数据
let data = await getData()
// 初始化组件ui
let widget = await createWidget(data)

// 如果不是在组件执行，则显示预览
if (!config.runsInWidget) {
  await widget.presentLarge()
} else {
  // 设置桌面组件
  Script.setWidget(widget)
}

// 获取参数
var IDX = 0
if (PLUGIN) {
  try {
    IDX = parseInt(PLUGIN["args"])
  } catch (e) {}
} else {
  try {
    IDX = parseInt(args.widgetParams)
  } catch (e) {}
}
if (!Number.isInteger(IDX)) IDX = 0

Script.complete()

// 创建组件
async function createWidget(one) {
  let w = new ListWidget()
  
  if (!one){
    let err = w.addText("💔 加载失败 (/ω＼)")
    err.textColor = Color.red()
    err.centerAlignText()
    return w
  }
  w.url = one["url"]
  w.backgroundColor = new Color("#2193B0", 1)
  
//   时间
  const dates = one["date"].split(" / ")
  let date1 = w.addText(dates[2])
  date1.font = Font.lightSystemFont(60)
  date1.centerAlignText()
  date1.textColor = Color.white()
  
  let line = w.addText("————".repeat(2))
  line.textOpacity = 0.5
  line.centerAlignText()
  line.textColor = Color.white()
  
  let date2 = w.addText(dates[0] + " / " + dates[1])
  date2.font = Font.lightMonospacedSystemFont(30)
  date2.centerAlignText()
  date2.textColor = Color.white()
  date2.textOpacity = 0.7

//   换行
  w.addSpacer(20)
//   内容
  let body = w.addText(one["content"])
  body.font = Font.lightSystemFont(22)
  body.textColor = Color.white()
  
  w.addSpacer(50)
  
  let author = w.addText("—— " + one["text_authors"])
  author.rightAlignText()
  author.font = Font.lightSystemFont(14)
  author.textColor = Color.white()
  author.textOpacity = 0.8

// 加载背景图片
  let bg = await getImage(one["img_url"])

  w.backgroundImage = await shadowImage(bg)
//   记得最后返回组件
  return w
}

// 获取数据
async function getData() {
  const API = "http://m.wufazhuce.com/one";
  const req1 = new Request(API)
  await req1.load()
  const body1 = await req1.loadString()
  const token = body1.split("One.token = '")[1].split("'")[0]
  console.log(token)
  
  const API2 = "http://m.wufazhuce.com/one/ajaxlist/0?_token=" + token
  const req2 = new Request(API2)
  const res2 = await req2.loadJSON()
  
  const data = res2["data"]
  
  return data ? data[IDX] : false
}

async function getImage (url) {
  let r = new Request(url)
  return await r.loadImage()
}

async function shadowImage (img) {
  let ctx = new DrawContext()
  // 获取图片的尺寸
  ctx.size = img.size
  
  ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
  ctx.setFillColor(new Color("#000000", 0.7))
  ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))
  
  let res = await ctx.getImage()
  return res
}
