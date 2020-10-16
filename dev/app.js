require('colors')
const express = require("express")
const app = express()

app.use(express.static("www"))

// 端口可自定义
app.listen(8023, () => {
  console.log("已开启小组件调试...".green)
  console.log("编写www/latest.js模板。完成编写后，即可将latest.js粘贴到对应的目录上完成最终编写。".cyan)
  console.log("**注意粘贴ip和端口到/debug.js".red)
})