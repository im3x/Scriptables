// test
let w = new ListWidget()
t = w.addText("im3x")
t.textColor = Color.red()

w.addSpacer()
w.addText(args.widgetParameter || '无参数')

w.url = 'https://im3x.cn'


Script.setWidget(w)
Script.complete()
