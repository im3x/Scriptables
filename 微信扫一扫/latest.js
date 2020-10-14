/**
 * FileName [微信扫一扫-桌面组件]
 * User: marsper
 * Date: 2020/10/14
 * Time: 14:55
 * 💚：marsperx
 * ✉：marsper@yeah.net
 */
class Wechat {
    // 初始化，接收参数
    constructor(arg = '0') {
            this.arg = 0
            try {
                this.arg = parseInt(arg)
            } catch (e) {}
            if (!Number.isInteger(this.arg) || this.arg < 0 || this.arg > 50) this.arg = 0
            this.widgetSize = config.widgetFamily
        }
        // 渲染组件
    async render() {
        if (this.widgetSize === 'medium') {
            return await this.renderMedium()
        } else if (this.widgetSize === 'large') {
            return await this.renderSmall()
        } else {
            return await this.renderSmall()
        }
    }
    async renderSmall() { //小组件时默认付款码
            let w = new ListWidget()
            w.url = "weixin://scanqrcode"
            w.backgroundImage = await this.getImage("https://img.alicdn.com/imgextra/i3/1985706121/O1CN01HrkaX71v5SwkyauEx_!!1985706121.png")
            return w
        }
        // 中大尺寸组件
    async renderMedium() {
        let w = new ListWidget()
        w.url = "weixin://scanqrcode"
        w.backgroundImage = await this.getImage("https://img.alicdn.com/imgextra/i4/1985706121/O1CN01Y76rzw1v5SwjQvF7M_!!1985706121.png")
        return w
    }

    // 获取远程图片
    async getImage(url) {
            console.log('get-image')
            console.log(url)
            let req = new Request(url)
            let img = await req.loadImage()
            console.log('get.image.done')
            return img
        }
        // 用于测试
    async test() {
            if (config.runsInWidget) return
            this.widgetSize = 'small'
            let w1 = await this.render()
            await w1.presentSmall()
            this.widgetSize = 'medium'
            let w2 = await this.render()
            await w2.presentMedium()
            this.widgetSize = 'large'
            let w3 = await this.render()
            await w3.presentLarge()
        }
        // 单独运行
    async init() {
        if (!config.runsInWidget) return
        let widget = await this.render()
        Script.setWidget(widget)
        Script.complete()
    }
}

module.exports = Wechat

// 编辑器中测试
// await new Wechat().test()
// 插件独立运行
// await new Wechat().init()