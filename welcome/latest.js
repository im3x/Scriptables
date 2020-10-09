widget = new ListWidget()
widget.addText("Hello, Scriptable :)")
if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  widget.presentSmall()
}
Script.complete()
