/**
 * FileName [彩票开奖-桌面组件]
 * User: marsper
 * Date: 2020/10/12
 * Time: 15:43
 * 💚：marsperx
 * 📩：marsper@yeah.net
 */
class Caipiao {
    /**
     * 初始化
     * @param arg 外部传递过来的参数
     */
    constructor(arg) {
            this.arg = arg
            this.widgetSize = config.widgetFamily
        }
        /**
         * 渲染组件
         */
    async render() {
        if (this.widgetSize === 'medium') {
            return await this.renderMedium()
        } else if (this.widgetSize === 'large') {
            return await this.renderLarge()
        } else {
            return await this.renderSmall()
        }
    }

    async shadowImage(img) {
        let ctx = new DrawContext()
            // 把画布的尺寸设置成图片的尺寸
        ctx.size = img.size
            // 把图片绘制到画布中
        ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
            // 设置绘制的图层颜色，为半透明的黑色
        ctx.setFillColor(new Color('#000000', 0.5))
            // 绘制图层
        ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))

        // 导出最终图片
        return await ctx.getImage()
    }


    async randomBackImg() {
        let arr = [
            "https://img.alicdn.com/imgextra/i4/1985706121/O1CN01zuq8RI1v5SwXkWgiw_!!1985706121.png",
            "https://img.alicdn.com/imgextra/i3/1985706121/O1CN0112oB771v5Swfilgp6_!!1985706121.jpg",
            "https://img.alicdn.com/imgextra/i1/1985706121/O1CN01xmFp6v1v5Swdv3tNH_!!1985706121.jpg",
            "https://img.alicdn.com/imgextra/i3/1985706121/O1CN012JF7ji1v5Swft4RTD_!!1985706121.jpg"
        ]
        return arr[Math.floor((Math.random() * arr.length))]
    }

    /**
     * 渲染小尺寸组件
     */
    async renderSmall() {
            let orange_balls = [];
            for (var i = 0; i < 5; i++) {
                let randomnumber = Math.floor(Math.random() * 35);
                if (randomnumber == 0) {
                    i--;
                } else {
                    orange_balls.push(randomnumber)
                }
            }
            let solida_balls = [];
            for (var i = 0; i < 2; i++) {
                let randomnumber = Math.floor(Math.random() * 12);
                if (randomnumber == 0) {
                    i--;
                } else {
                    solida_balls.push(randomnumber)
                }
            }
            // 显示数据
            let w = new ListWidget()
            w = await this.renderHeader(w, 'https://img.alicdn.com/imgextra/i4/1985706121/O1CN01ZiOOy01v5SwlkK0dx_!!1985706121.jpg', '超级大乐透')
            let body = w.addStack()
            let txt = body.addText('幸运随机号码')
            txt.leftAlignText()
            txt.textColor = Color.white()
            txt.font = Font.lightSystemFont(14)
            w.addSpacer(10)
            let dom = w.addStack()
            for (var r = 0; r < orange_balls.length; r++) {
                var redball = dom.addText(String(await this.convertNumber(orange_balls[r])))
                redball.font = Font.lightSystemFont(16)
                redball.textColor = Color.red()
                dom.addSpacer(5)
            }
            w.addSpacer(10)
            let dom2 = w.addStack()
            for (var b = 0; b < solida_balls.length; b++) {
                var blueball = dom2.addText(String(await this.convertNumber(solida_balls[b])))
                blueball.font = Font.lightSystemFont(16)
                blueball.textColor = Color.blue()
                dom2.addSpacer(5)
            }
            w.backgroundImage = await this.shadowImage(await this.getImage(await this.randomBackImg()))
            w.url = "https://m.500.com/info/kaijiang/"
            return w
        }
        /**
         * 渲染中尺寸组件
         */
    async renderMedium(count = 2) {
            let res = await this.getData('http://api.bluebuff.ddtool.cn/LotteryQuery/kaijiang')
            let data = res['data'];
            // 显示数据
            let w = new ListWidget()
            w = await this.renderHeader(w, 'https://img.alicdn.com/imgextra/i4/1985706121/O1CN01ZiOOy01v5SwlkK0dx_!!1985706121.jpg', '彩票开奖')
            for (let i = 0; i < count; i++) {
                var typeName;
                switch (i) {
                case 0:
                    typeName = "dlt"
                    break;
                case 1:
                    typeName = "ssq"
                    break;
                case 2:
                    typeName = "fcsd"
                    break;
                case 3:
                    typeName = "pls"
                    break;
                case 4:
                    typeName = "plw"
                    break;
                case 5:
                    typeName = "qxc"
                    break;
                case 6:
                    typeName = "qlc"
                    break;
                }
                let dom = w.addStack()
                dom.centerAlignContent()
                let title = dom.addText(data[typeName]['title'])
                title.lineLimit = 1
                title.font = Font.lightSystemFont(14)
                title.textColor = Color.white()
                dom.addSpacer(10)
                let number = dom.addText(`(${String(data[typeName]['number'])}期)`)
                number.font = Font.lightSystemFont(14)
                number.textColor = Color.white()
                number.textOpacity = 0.6
                dom.addSpacer(10)
                let extr = dom.addText(data[typeName]['date'])
                extr.textColor = Color.white()
                extr.font = Font.lightSystemFont(14)
                extr.textOpacity = 0.6
                dom.addSpacer(10)
                w.addSpacer(3)
                if (i == 0) { //大乐透
                    let dom = w.addStack()
                    dom.centerAlignContent()
                    for (var r = 0; r < data[typeName]['orange_ball'].length; r++) {
                        var redball = dom.addText(String(await this.convertNumber(data[typeName]['orange_ball'][r])))
                        redball.font = Font.lightSystemFont(16)
                        redball.textColor = Color.red()
                        dom.addSpacer(15)
                    }
                    for (var b = 0; b < data[typeName]['solida_ball'].length; b++) {
                        var blueball = dom.addText(String(await this.convertNumber(data[typeName]['solida_ball'][b])))
                        blueball.font = Font.lightSystemFont(16)
                        blueball.textColor = Color.blue()
                        dom.addSpacer(15)
                    }
                    w.addSpacer(3)
                }
                if (i == 2) { //福彩3D
                    let dom = w.addStack()
                    dom.centerAlignContent()
                    for (var r = 0; r < data[typeName]['red_ball'].length; r++) {
                        var redball = dom.addText(String(data[typeName]['red_ball'][r]))
                        redball.font = Font.lightSystemFont(16)
                        redball.textColor = Color.red()
                        dom.addSpacer(15)
                    }
                    var sjh = dom.addText(data[typeName]['sjh'])
                    sjh.font = Font.lightSystemFont(14)
                    sjh.textColor = Color.white()
                    w.addSpacer(3)
                }
                if (i == 1 || i == 6) { //双色球、七乐彩
                    let dom = w.addStack()
                    dom.centerAlignContent()
                    for (var r = 0; r < data[typeName]['red_ball'].length; r++) {
                        var redball = dom.addText(String(await this.convertNumber(data[typeName]['red_ball'][r])))
                        redball.font = Font.lightSystemFont(16)
                        redball.textColor = Color.red()
                        dom.addSpacer(15)
                    }
                    for (var b = 0; b < data[typeName]['blue_ball'].length; b++) {
                        var blueball = dom.addText(String(await this.convertNumber(data[typeName]['blue_ball'][b])))
                        blueball.font = Font.lightSystemFont(16)
                        blueball.textColor = Color.blue()
                        dom.addSpacer(15)
                    }
                    w.addSpacer(3)
                }
                if (i == 3 || i == 4 || i == 5) { //排列3、排列5、七星彩
                    let dom = w.addStack()
                    dom.centerAlignContent()
                    for (var r = 0; r < data[typeName]['orange_ball'].length; r++) {
                        var redball = dom.addText(String(data[typeName]['orange_ball'][r]))
                        redball.font = Font.lightSystemFont(16)
                        redball.textColor = Color.red()
                        dom.addSpacer(15)
                    }
                    w.addSpacer(3)
                }
            }
            w.backgroundImage = await this.shadowImage(await this.getImage(await this.randomBackImg()))
            w.url = "https://m.500.com/info/kaijiang/"
            return w
        }
        /**
         * 渲染大尺寸组件
         */
    async renderLarge() {
        return await this.renderMedium(7)
    }

    /**
     * 渲染标题
     * @param widget 组件对象
     * @param icon 图标url地址
     * @param title 标题
     */
    async renderHeader(widget, icon, title) {
        let header = widget.addStack()
        header.centerAlignContent()
        let _icon = header.addImage(await this.getImage(icon))
        _icon.imageSize = new Size(14, 14)
        _icon.cornerRadius = 4
        header.addSpacer(10)
        let _title = header.addText(title)
        _title.textOpacity = 0.7
        _title.font = Font.boldSystemFont(14)
        _title.textColor = Color.white()
        widget.addSpacer(10)
        return widget
    }

    /**
     * 获取api数据
     * @param api api地址
     */
    async getData(api) {
            let req = new Request(api)
            return await req.loadJSON()
        }
        /**
         * 加载远程图片
         * @param url string 图片地址
         * @return image
         */
    async getImage(url) {
        let req = new Request(url)
        return await req.loadImage()
    }

    /**
     * [数字转换]
     * @param  {[type]} number [description]
     * @return {[type]}        [description]
     */
    async convertNumber(number) {
        let newnumber
        number >= 10 ? newnumber = number : newnumber = `0${number}`
        return newnumber
    }

    /**
     * 给图片加上半透明遮罩
     * @param img 要处理的图片对象
     * @return image
     */
    async shadowImage(img) {
        let ctx = new DrawContext()
        ctx.size = img.size
        ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
            // 图片遮罩颜色、透明度设置
        ctx.setFillColor(new Color("#000000", 0.7))
        ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))
        let res = await ctx.getImage()
        return res
    }

    /**
     * 编辑测试使用
     */
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

    /**
     * 组件单独在桌面运行时调用
     */
    async init() {
        if (!config.runsInWidget) return
        let widget = await this.render()
        Script.setWidget(widget)
        Script.complete()
    }
}

module.exports = Caipiao

// 如果是在编辑器内编辑、运行、测试，则取消注释这行，便于调试：
// await new Caipiao().test()

// 如果是组件单独使用（桌面配置选择这个组件使用，则取消注释这一行：
// await new Caipiao(args.widgetParameter).init()