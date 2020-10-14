/**
 * FileName [支付宝盒子-桌面组件]
 * User: marsper
 * Date: 2020/10/14
 * Time: 12:14
 * 💚：marsperx
 * 📩：marsper@yeah.net
 */
class Zhifubao {
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
            return await this.renderMedium(3)
        } else {
            return await this.renderSmall()
        }
    }
    async renderSmall() { //小组件时默认付款码
            let w = new ListWidget()
            w.url = "alipayqr://platformapi/startapp?saId=10000007"
            w.backgroundImage = await this.getImage("https://img.alicdn.com/imgextra/i2/1985706121/O1CN01zgdasx1v5SweRlu5Y_!!1985706121.png")
            return w
        }
        // 中大尺寸组件
    async renderMedium(count = 1) {
        let w = new ListWidget()
        w.backgroundImage = await this.getImage("https://img.alicdn.com/imgextra/i4/1985706121/O1CN01VIVCO01v5SwpwlW8j_!!1985706121.png")
        w.setPadding(5, 20, 15, 0)
        w.addSpacer(15)
        w = await this.renderHeader(w, false)
        let tools = [{
            name: '扫一扫',
            fontspacer: 25,
            fontsize: 16,
            url: 'alipayqr://platformapi/startapp?saId=10000007',
            pic: 'https://img.alicdn.com/imgextra/i2/1985706121/O1CN01SYU9LP1v5Swpu6q8B_!!1985706121.png'
        }, {
            name: '付款码',
            fontspacer: 25,
            fontsize: 16,
            url: 'alipayqr://platformapi/startapp?saId=20000056',
            pic: 'https://img.alicdn.com/imgextra/i4/1985706121/O1CN01NostPR1v5SwmwHxQV_!!1985706121.png'
        }, {
            name: '健康码',
            fontspacer: 25,
            fontsize: 16,
            url: 'alipayqr://platformapi/startapp?saId=2021001139676873',
            pic: 'https://img.alicdn.com/imgextra/i4/1985706121/O1CN01lOM2DK1v5SwoiJ9Ve_!!1985706121.png'
        }, {
            name: '乘车码',
            fontspacer: 25,
            fontsize: 16,
            url: 'alipayqr://platformapi/startapp?saId=200011235',
            pic: 'https://img.alicdn.com/imgextra/i1/1985706121/O1CN01HTDWBc1v5SwsCWd8v_!!1985706121.png'
        }, {
            name: '收款码',
            fontspacer: 26,
            fontsize: 16,
            url: 'alipayqr://platformapi/startapp?saId=20000123',
            pic: 'https://img.alicdn.com/imgextra/i2/1985706121/O1CN01hOT77V1v5SwmgTJVx_!!1985706121.png'
        }, {
            name: '余额宝',
            fontspacer: 32,
            fontsize: 16,
            url: 'alipays://platformapi/startapp?appId=20000032',
            pic: 'https://img.alicdn.com/imgextra/i2/1985706121/O1CN01f7Ap7M1v5SwkwUWxq_!!1985706121.png'
        }, {
            name: '转账',
            fontspacer: 42,
            fontsize: 16,
            url: 'alipayqr://platformapi/startapp?saId=20000116',
            pic: 'https://img.alicdn.com/imgextra/i4/1985706121/O1CN01MhRJvg1v5SwrMMDu0_!!1985706121.png'
        }, {
            name: '账单',
            fontspacer: 25,
            fontsize: 16,
            url: 'alipayqr://platformapi/startapp?saId=20000076',
            pic: 'https://img.alicdn.com/imgextra/i3/1985706121/O1CN01T0ZIKg1v5SwnmfRuo_!!1985706121.png'
        }, {
            name: '蚂蚁森林',
            fontspacer: 20,
            fontsize: 13,
            url: 'alipays://platformapi/startapp?appId=60000002',
            pic: 'https://img.alicdn.com/imgextra/i1/1985706121/O1CN01XOXwSc1v5SwjefaHD_!!1985706121.png'
        }, {
            name: '蚂蚁庄园',
            fontspacer: 25,
            fontsize: 13,
            url: 'alipayqr://platformapi/startapp?saId=66666674',
            pic: 'https://img.alicdn.com/imgextra/i2/1985706121/O1CN01OzE7AX1v5SwpXrxcI_!!1985706121.png'
        }, ]
        for (var i = 0; i < count; i++) {
            let len = 4;
            len > tools.length ? len = tools.length : len = len;
            let boxs = w.addStack();
            for (var j = 0; j < len; j++) {
                let box = boxs.addStack();
                box.url = tools[j]["url"];
                let icon = await this.getImage(tools[j]["pic"])
                let box_icon = box.addImage(icon)
                box_icon.imageSize = new Size(50, 50)
                box_icon.cornerRadius = 10
                box.addSpacer(24)
            }
            w.addSpacer(5)
            let dom = w.addStack()
            for (var j = 0; j < len; j++) {
                /*标题*/
                let box_text = dom.addText(tools[j]['name'])
                box_text.font = Font.lightSystemFont(tools[j]['fontsize'])
           		box_text.textColor = Color.white()
                dom.addSpacer(tools[j]['fontspacer'])
            }
            //移除
            tools.splice(0, 1)
            tools.splice(0, 1)
            tools.splice(0, 1)
            tools.splice(0, 1)
            if (count > 1) {
                w.addSpacer(15)
            }
        }
        return w
    }

    async renderHeader(widget, customStyle = true) {
            let _icon = await this.getImage("https://img.alicdn.com/imgextra/i2/1985706121/O1CN01uqSsMz1v5SwrCuxAZ_!!1985706121.png")
            let _title = "支付宝盒子"
            let header = widget.addStack()
            header.centerAlignContent()
            let icon = header.addImage(_icon)
            icon.imageSize = new Size(16, 16)
            icon.cornerRadius = 2
            header.addSpacer(10)
            let title = header.addText(_title)
            if (customStyle) title.textColor = Color.white()
            title.leftAlignText()
            title.textOpacity = 0.8
            title.textColor = Color.white()
            title.font = Font.boldSystemFont(16)
            widget.addSpacer(20)
            return widget
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

module.exports = Zhifubao
// 编辑器中测试
// await new Zhifubao().test()
// 插件独立运行
// await new Zhifubao().init()