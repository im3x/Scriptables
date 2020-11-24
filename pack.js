/**
 * 打包成单独小组件
 * 用法：
 * node pack.js Scripts/「源码」小组件示例.js
 * 将会在`Dist`目录生成「小件件」小组件示例.js 文件，这个文件可以发送给用户单独使用
 */

 const process = require('process')
 const os = require('os')
 const fs = require('fs')
 const path = require('path')

if (process.argv.length !== 3) {
  console.log('[!] 用法：node pack Scripts/「源码」xxx.js')
  process.exit(0)
}

const SAVE_PATH = path.join(__dirname, "Dist")
const file_name = process.argv[2]
const out_name = file_name.replace("「源码」", "「小件件」").replace("Scripts", "Dist")

// 创建目录
if (!fs.existsSync(SAVE_PATH)) {
  fs.mkdirSync(SAVE_PATH)
}
// 组合文件
const runtime_file = fs.readFileSync(path.join(__dirname, "Scripts", "「小件件」开发环境.js"))

const runtime_code = runtime_file.toString("utf-8").split("// @running.end")[0]
const widget_file = fs.readFileSync(path.join(__dirname, file_name))

const widget_code = widget_file.toString("utf-8");
const widget_class = widget_code.split("// @组件代码开始")[1].split("// @组件代码结束")[0]
const widget_header = widget_code.split('// icon-color:')[1].split('\n')[0];

let result_code = `// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color:${widget_header}
${runtime_code}
${widget_class}
await Running(Widget)`

// 写入文件
fs.writeFileSync(path.join(__dirname, out_name), result_code)
console.log('[*] 文件已经保存到：' + out_name)