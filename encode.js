// 加密压缩打包后的小组件代码
// 方便隐藏敏感信息，减少组件体积和保护小组件不被随意修改

// 用法：
// node encode.js Dist/「小件件」你的小组件.js


const process = require('process')
const os = require('os')
const fs = require('fs')
const path = require('path')

var JB = require('javascript-obfuscator');

if (process.argv.length !== 3) {
  console.log('[!] 用法：node encode.js Dist/「小件件」xxx.js')
  process.exit(0)
}

const file_name = process.argv[2]
const out_name = file_name.replace(".js", ".enc.js")

// 读取源文件
const widget_file = fs.readFileSync(path.join(__dirname, file_name))

let widget_code = widget_file.toString("utf-8")
widget_code = widget_code.split("await Running(Widget)")[0];


var result = JB.obfuscate(widget_code.toString("utf-8"), {
  "rotateStringArray": true,
  "selfDefending": true,
  "stringArray": true,
  splitStringsChunkLength: 100,
  "stringArrayEncoding": ["rc4", "base64"]
}).getObfuscatedCode()

let result_header = widget_code.split("// icon-color:")[0]
result_header += "// icon-color:"
result_header += widget_code.split("// icon-color:")[1].split("\n")[0]
result_header += "\n// " + file_name
result_header += "\n// https://github.com/im3x/Scriptables"

let result_code = `${result_header}\n${result};await Running(Widget);`

fs.writeFileSync(path.join(__dirname, out_name), result_code);

console.log("[*] 文件已压缩混淆至：", out_name)