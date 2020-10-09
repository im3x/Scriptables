// ONE 一个图文
// iOS14桌面组件
// 公众号：古人云
// 参数：int，用于展示第几条数据，默认0（第一条）

if (typeof Script.im3x === 'undefined') {
  let data = await getData()
  let widget = await (config.widgetFamily === 'large' ? createWidget(data) : createSmallWidget(data))
  if (config.runsInWidget) {
    Script.setWidget(widget)
  } else {
    widget.presentLarge()
  }
  Script.complete()
} else {
  getData().then(data => {
    new Promise(RES => {
      if (config.widgetFamily === 'large') {
        createWidget(data).then(RES)
      } else {
        createSmallWidget(data).then(RES)
      }
    }).then(widget => {
      if (config.runsInWidget) {
        Script.setWidget(widget)
      } else {
        widget.presentLarge()
      }
      Script.complete()
    })
  })
}


// 加载失败
async function errWidget (widget) {
  err = widget.addText("💔 加载失败，稍后重试..")
  err.textColor = Color.red()
  err.centerAlignText()
  return widget
}
// 头部标题
async function im3xCreateHeader (widget) {
  console.log("create.header.start")
  header = widget.addStack()
  icon = header.addImage(await getImage("http://image.wufazhuce.com/apple-touch-icon.png"))
  icon.imageSize = new Size(15, 15)
  icon.cornerRadius = 4
  title = header.addText("「ONE · 一个」")
  title.font = Font.mediumSystemFont(13)
  title.textColor = Color.white()
  title.textOpacity = 0.7
  widget.addSpacer(20)
  console.log('create.header.done')
  return widget
}

// 小组件
async function createSmallWidget (one) {
  console.log('create.small.widget')
  let w = new ListWidget()
  
  if (!one) return await errWidget(w)
  
  w.url = one["url"]

  w = await im3xCreateHeader(w)

  body = w.addText(one['content'])
  body.textColor = Color.white()
  body.font = Font.lightSystemFont(config.widgetFamily === 'small' ? 14 : 16)
  w.addSpacer(10)
  footer = w.addText('—— ' + one['text_authors'])
  footer.rightAlignText()
  footer.textColor = Color.white()
  footer.textOpacity = 0.8
  footer.font = Font.lightSystemFont(12)

  // 加载背景图片
  let bg = await getImage(one["img_url"])

  w.backgroundImage = await shadowImage(bg)
  console.log('create.small.widget.done')

  return w
}

// 创建组件，大
async function createWidget(one) {
  let w = new ListWidget()
  
  if (!one) return await errWidget(w)

  w.url = one["url"]
  
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

  // 获取参数
  var IDX = 0
  if (typeof PLUGIN === "object") {
    try {
      IDX = parseInt(PLUGIN["args"])
    } catch (e) {}
  } else {
    try {
      IDX = parseInt(args.widgetParameter)
    } catch (e) {}
  }
  if (!Number.isInteger(IDX)) IDX = 0
    
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
