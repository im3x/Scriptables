widget = new ListWidget()
widget.addText("Hello, Scriptable :)")
widget.url = 'https://github.com/im3x/Scriptables'
if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  widget.presentSmall()
}
Script.complete()
