// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: angle-double-right;
// 
// iOS 桌面组件脚本 @「小件件」
// 开发说明：请从 Widget 类开始编写，注释请勿修改
// https://x.im3x.cn
// 

// 添加require，是为了vscode中可以正确引入包，以获得自动补全等功能
if (typeof require === 'undefined') require = importModule
const { Base } = require("./「小件件」开发环境")

// @组件代码开始
class Widget extends Base {
  constructor (arg) {
    super(arg)
    this.logo = "https://www.v2ex.com/static/img/icon_rayps_64.png"
    this.name = "V2EX"
    this.desc = "创意工作者们的社区"
    // 请求数据接口列表（收集整理中）
    this.API = [
      // api
      [
        {
          id: 'latest',
          name: '最新'
        }, {
          id: 'hot',
          name: '最热'
        }
      ],
      // tab
      [
        {
          id: 'all',
          name: '全部'
        }, {
          id: 'hot',
          name: '最热'
        }, {
          id: 'tech',
          name: '技术'
        }, {
          id: 'creative',
          name: '创意'
        }, {
          id: 'playplay',
          name: '好玩'
        }, {
          id: 'apple',
          name: 'Apple'
        }, {
          id: 'jobs',
          name: '酷工作'
        }, {
          id: 'deals',
          name: '交易'
        }, {
          id: 'city',
          name: '城市'
        }, {
          id: 'qna',
          name: '问与答'
        }
      ],
      // go
      [],
    ]
    // 当前设置的存储key（提示：可通过桌面设置不同参数，来保存多个设置）
    let _md5 = this.md5(module.filename)
    this.CACHE_KEY = `cache_${_md5}`
    // 获取设置
    // 格式：type@name，比如 go@create、api@hot、tab@all
    this.SETTINGS = this.settings['node'] || 'tab@all'

    // 注册操作菜单
    this.registerAction("节点设置", this.actionSettings)
  }

  // 渲染组件
  async render () {
    // 加载节点列表
    await this._loadNodes()
    const data = await this.getData()
    console.log(data)
    if (this.widgetFamily === 'medium') {
      return await this.renderMedium(data)
    } else if (this.widgetFamily === 'large') {
      return await this.renderLarge(data)
    } else {
      return await this.renderSmall(data)
    }
  }
  async renderSmall (data) {
    let w = new ListWidget()
    let topic = data[0]
    w.url = this.actionUrl('open-url', topic['url'])
    w = await this.renderHeader(w, this.logo, this.name + ' / ' + this.SETTINGS.split('@')[0], Color.white())
    let content = w.addText(topic['title'])
    content.font = Font.lightSystemFont(16)
    content.textColor = Color.white()
    content.lineLimit = 3

    w.backgroundImage = await this.shadowImage(await this.getImageByUrl(topic['member']['avatar_large'].replace('mini', 'large')))

    w.addSpacer()
    let footer = w.addText(`@${topic['member']['username']} / ${topic['node']['title']}`)
    footer.font = Font.lightSystemFont(10)
    footer.textColor = Color.white()
    footer.textOpacity = 0.5
    footer.lineLimit = 1
    return w
  }
  // 中尺寸组件
  async renderMedium (data) {
    let w = new ListWidget()
    // w.addSpacer(10)
    // 设置名称
    let tmp = this.SETTINGS.split('@')
    let tid = tmp[0] === 'api' ? 0 : (tmp[0] === 'tab' ? 1 : 2)
    let current = ''
    this.API[tid].map(a => {
      if (a['id'] === tmp[1]) current = a['name']
    })
    await this.renderHeader(w, this.logo, this.name + ' / ' + current)
    w.addSpacer()
    
    let body = w.addStack()
    let bodyleft= body.addStack()
    bodyleft.layoutVertically()
    for (let i = 0; i < 2; i ++) {
      bodyleft = await this.renderCell(bodyleft, data[i])
      bodyleft.addSpacer()
    }
    // body.addSpacer()
    w.url = this.actionUrl("settings")

    return w
  }
  // 大尺寸组件
  async renderLarge (data) {
    let w = new ListWidget()
    // w.addSpacer(10)
    // 设置名称
    let tmp = this.SETTINGS.split('@')
    let tid = tmp[0] === 'api' ? 0 : (tmp[0] === 'tab' ? 1 : 2)
    let current = ''
    this.API[tid].map(a => {
      if (a['id'] === tmp[1]) current = a['name']
    })
    await this.renderHeader(w, this.logo, this.name + ' / ' + current)
    w.addSpacer()
    
      
    let body = w.addStack()
    let bodyleft= body.addStack()
    bodyleft.layoutVertically()
    for (let i = 0; i < 5; i ++) {
      bodyleft = await this.renderCell(bodyleft, data[i])
      bodyleft.addSpacer()
    }
    // body.addSpacer()
    
    // w.addSpacer()
    w.url = this.actionUrl("settings")

    return w
  }
  async renderCell (widget, topic) {
    let body = widget.addStack()
    body.url = this.actionUrl('open-url', topic['url'])

    let left = body.addStack()
    let avatar = left.addImage(await this.getImageByUrl(topic['member']['avatar_large'].replace('mini', 'large')))
    avatar.imageSize = new Size(35, 35)
    avatar.cornerRadius = 5

    body.addSpacer(10)

    let right = body.addStack()
    right.layoutVertically()
    let content = right.addText(topic['title'])
    content.font = Font.lightSystemFont(14)
    content.lineLimit = 1

    right.addSpacer(5)

    let info = right.addText(`@${topic['member']['username']} / ${topic['node']['title']}`)
    info.font = Font.lightSystemFont(10)
    info.textOpacity = 0.6
    info.lineLimit = 2

    widget.addSpacer()

    return widget
  }

  async getData () {
    // 解析设置，判断类型，获取对应数据
    const tmp = this.SETTINGS.split('@')
    switch (tmp[0]) {
      case 'tab':
        return await this.getDataForTab(tmp[1])
      case 'go':
        return await this.getDataForGo(tmp[1])
      case 'api':
        return await this.getDataForApi(tmp[1])
    }
  }

  /**
   * 获取首页tab数据
   * @param {string} tab tab首页名称
   */
  async getDataForTab (tab = 'all') {
    let url = `https://www.v2ex.com/?tab=${tab}`
    let html = await this.fetchAPI(url, false)

    // 解析html
    let tmp = html.split(`<div id="Wrapper">`)[1].split(`<div class="inner" style="text-align: right;">`)[0]
    let arr = tmp.split('<div class="cell item">')
    arr.shift()

    let datas = []
    for (let i = 0; i < arr.length; i ++) {
      let t = arr[i]
      let title = t.split(`class="topic-link">`)[1].split('</a')[0]
      let avatar = t.split(`<img src="`)[1].split('"')[0]
      let node = t.split(`<a class="node"`)[1].split('</a>')[0].split('>')[1]
      let user = t.split(`<a class="node" href="`)[1].split('</strong>')[0].split('<strong>')[1].split('>')[1].split('</')[0]
      let link = t.split(`<span class="item_title">`)[1].split('class="')[0].split('"')[1]
      datas.push({
        title,
        url: `https://www.v2ex.com${link}`,
        member: {
          username: user,
          'avatar_large': avatar
        },
        node: {
          title: node
        }
      })
    }

    return datas
  }

  async getDataForApi (api) {
    return await this.httpGet(`https://www.v2ex.com/api/topics/${api}.json`)
  }

  /**
   * 加载数据
   * 节点列表
   */
  async getDataForGo (arg = 'create') {
    let url = `https://www.v2ex.com/go/${arg}`
    let html = await this.fetchAPI(url, false)

    // 解析html
    let tmp = html.split(`<div id="Wrapper">`)[1].split(`<div class="sidebar_units">`)[0]
    let arr = tmp.split(`<table cellpadding="0" cellspacing="0" border="0" width="100%">`)

    let node_title = html.split('<title>')[1].split('</')[0]
    arr.shift()
    arr.pop()

    let datas = []
    for (let i = 0; i < arr.length; i ++) {
      let t = arr[i]
      let title = t.split(`class="topic-link">`)[1].split('</a')[0]
      let avatar = t.split(`<img src="`)[1].split('"')[0]
      let user = t.split(`class="small fade"><strong>`)[1].split('</')[0]
      let link = t.split(`<span class="item_title"><a href="`)[1].split('"')[0]
      datas.push({
        title,
        url: `https://www.v2ex.com${link}`,
        member: {
          username: user,
          'avatar_large': avatar
        },
        node: {
          title: node_title
        }
      })
    }

    return datas
  }

  // http.get
  async fetchAPI (api, json = true) {
    let data = null
    try {
      let req = new Request(api)
      req.headers = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/85.0.4183.102'
      }
      data = await (json ? req.loadJSON() : req.loadString())
    } catch (e) {}
    // 判断数据是否为空（加载失败）
    if (!data) {
      // 判断是否有缓存
      if (Keychain.contains(this.CACHE_KEY)) {
        let cache = Keychain.get(this.CACHE_KEY)
        return json ? JSON.parse(cache) : cache
      } else {
        // 刷新
        return null
      }
    }
    // 存储缓存
    Keychain.set(this.CACHE_KEY, json ? JSON.stringify(data) : data)
    return data
  }

  // 加载节点列表
  async _loadNodes () {
    let s2 = await this.httpGet("https://www.v2ex.com/api/nodes/s2.json")
    // 排序，通过topic
    let nodes = s2.sort((a,b) => b['topics']-a['topics'])
    this.API[2] = nodes.map(n => ({
      id: n['id'],
      name: n['text'],
      topic: n['topic']
    }))
    return this.API[2]
  }
  async actionOpenUrl (url) {
    Safari.openInApp(url, false)
  }

  async actionSettings () {
    const tmp = this.SETTINGS.split('@')
    const a = new Alert()
    a.title = "内容设置"
    a.message = "设置组件展示的内容来自哪里"
    a.addAction((tmp[0]==='api'?'✅ ':'')+"API接口")
    a.addAction((tmp[0]==='tab'?'✅ ':'')+"首页目录")
    a.addAction((tmp[0]==='go'?'✅ ':'')+"指定节点")
    a.addCancelAction("取消设置")
    const i = await a.presentSheet()
    if (i === -1) return
    const table = new UITable()
    // 如果是节点，则先远程获取
    if (i === 2 && this.API[2].length === 0) {
      await this._loadNodes()
    }
    this.API[i].map(t => {
      const r = new UITableRow()
      r.addText((tmp[1]===t.id?'✅ ':'')+t['name'])
      r.onSelect = (n) => {
        // 保存设置
        let _t = 'api';
        _t = i === 1 ? 'tab' : _t;
        _t = i === 2 ? 'go' : _t;
        let v = `${_t}@${t['id']}`
        this.SETTINGS = v
        this.settings['node'] = v
        this.saveSettings()
      }
      table.addRow(r)
    })
    table.present(false)
  }

}
// @组件代码结束

const { Testing } = require("./「小件件」开发环境")
await Testing(Widget)