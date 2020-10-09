widget = new ListWidget()
t = "Hello, Scriptable ❤️"
u = 'https://github.com/im3x/Scriptables'
widget.addText(t)
widget.url = u

console.log(t)
console.warn(u)

if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  widget.presentSmall()
}
Script.complete()
