// node服务跑起来之后，将这个脚本粘贴到scriptable以调试组件
// 能访问到的远程脚本url(调试的url)
/**
 * node服务跑起来之后，将这个脚本粘贴到scriptable以调试组件
 * localJsUrl为能访问到的远程脚本url(调试的url)
 * 注意填写自己调试服务器的ip和端口（默认8023）
 * 注意保证调试手机和调试服务在同一个局域网上
 */
const nodeServeUrl = `http://{YOU_IP_ADDRESS}:8023`
const localJsUrl = `${nodeServeUrl}/latest.js?d=${new Date().getTime()}`
let req = new Request(localJsUrl)
let data = await req.loadString()
// 存储脚本的路径
const filePrePath = `${FileManager.local().documentsDirectory()}`

// 存储
await FileManager.local().writeString(`${filePrePath}/latest.js`, data)

const Module = importModule(`${filePrePath}/latest.js`)

const m = new Module()

m.init()