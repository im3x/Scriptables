//
// scriptable 加载器
// 用于加载远程 scriptable 桌面组件插件
// author@im3x
// 公众号@古人云
//

// 解析 & 替换桌面组件传递过来的参数，比如 welcome@latest:hello
Script.im3x = Script.debug || {
  name: "welcome",
  args: "",
  version: "latest"
}
if (args.widgetParameter) {
  let _args = args.widgetParameter.split(":")
  let _plug = _args[0].split("@")
  if (_plug.length === 2) {
    Script.im3x["version"] = _plug[1]
  } else {
    Script.im3x["version"] = "latest"
  }
  Script.im3x["name"] = _plug[0]
  if (_args.length === 2) Script.im3x["args"] = _args[1]
}

// 先读取本地是否有缓存代码，如果有，则直接导入
const PATH = FileManager.local().documentsDirectory()
const FILE_NAME = Script.im3x['name'] + '@' + Script['im3x']['version'] + '.js.im3x'
const FILE = PATH + "/" + FILE_NAME
if (FileManager.local().fileExists(FILE)) {
  _init(FILE_NAME)
  _load(FILE)
} else {
  await _load(FILE)
  _init(FILE_NAME)
}
async function _load (FILE) {
  // 加载远程插件代码
  console.log('load.start')
  console.log(FILE)
  const _REMOTE_CODE_REQ = new Request("https://gitee.com/im3x/Scriptables/raw/main/" + encodeURIComponent(Script.im3x["name"]) + "/" + Script.im3x["version"] + ".js?_=" + (+new Date))
  const _REMOTE_CODE_JS = await _REMOTE_CODE_REQ.loadString()
  console.log('load.end')
  console.log('write.start')
  FileManager.local().writeString(FILE, _REMOTE_CODE_JS)
  console.log('write.end')
  return _REMOTE_CODE_JS
}
async function _init (FILE) {
  let M = importModule(FILE)
  let m = new M(Script.im3x['args'])
  let w = await m.render()
  if (!config.runsInWidget) return
  Script.setWidget(w)
  Script.complete()
}
