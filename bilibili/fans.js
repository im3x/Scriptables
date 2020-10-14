// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: magic;
//
// 哔哩哔哩粉丝数
// 作者：azoon
// 调用参数 bilibili@fans:446791792

class Im3xWidget {
	/**
	* 初始化
	* @param arg 外部传递过来的参数
	*/
	constructor (arg) {
		this.arg = arg
		this.widgetSize = config.widgetFamily
	}
	
	//渲染组件
	async render () {
		if (this.widgetSize === 'medium') {
			return await this.renderSmall()
		} else if (this.widgetSize === 'large') {
			return await this.renderLarge()
		} else {
			return await this.renderSmall()
		}
	}

	//渲染小尺寸组件
	async renderSmall () {
		let data = await this.getData()
		let colors = this.getColor()
		let w = new ListWidget()
		
		w.backgroundColor = colors.bgColor
		
		let header = w.addStack()
		let icon = header.addImage(await this.getImage('https://www.bilibili.com/favicon.ico'))
		icon.imageSize = new Size(15, 15)
		header.addSpacer(10)
		let title = header.addText("哔哩哔哩粉丝")
		title.textColor = colors.textColor
		title.textOpacity = 0.9
		title.font = Font.systemFont(14)
		w.addSpacer(20)
		
		if(data.code !=0){
			var flTxt = w.addText('请填写B站MID')
			flTxt.textColor = new Color("#fb7299")
			flTxt.font = Font.systemFont(14)
		}else{
			var flTxt = w.addText(this.toThousands(data.data['follower']))
			flTxt.textColor = new Color("#fb7299")
			flTxt.font = Font.boldRoundedSystemFont(this.getFontsize(data.data['follower']))
		}
		flTxt.centerAlignText()
		w.addSpacer(20)
		
		let utTxt = w.addText('更新于:'+this.nowTime())
		utTxt.textColor = colors.textColor
		utTxt.font = Font.systemFont(12)
		utTxt.centerAlignText()
		utTxt.textOpacity = 0.5
		
		w.url = 'bilibili://'
		return w
	}
	
	//渲染中尺寸组件
		async renderMedium () {
		let w = new ListWidget()
		w.addText("暂不支持该尺寸组件")
		return w
	}
	
	//渲染大尺寸组件
		async renderLarge () {
		let w = new ListWidget()
		w.addText("暂不支持该尺寸组件")
		return w
	}

	//加载B站数据
	async getData () {
		let api = 'http://api.bilibili.com/x/relation/stat?vmid='+this.arg
		let req = new Request(api)
		let res = await req.loadJSON()
		return res
	}
  
	//加载远程图片
	async getImage (url) {
		let req = new Request(url)
		return await req.loadImage()
	}
	
	//格式化粉丝数量，加入千分号
	toThousands(num) {
		return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
	}

	//返回脚本运行时的时间，作为更新时间
	nowTime(){
		let date = new Date()
		return date.toLocaleTimeString('chinese', { hour12: false })
	}
	
	//根据粉丝数量返回不同的字体大小
	getFontsize(num){
		if(num<99){
			return 38
		}else if(num<9999 && num>100){
			return 30
		}else if(num<99999 && num>10000){
			return 28
		}else if(num<999999 && num>100000){
			return 24
		}else if(num<9999999 && num>1000000){
			return 22
		}else{
			return 20
		}
	}
	
	//根据是否黑暗模式返回背景和字体颜色，貌似有bug，切换成黑暗模式后，要重新添加组件才会变回浅色模式
	getColor(){
		const [bgColor, textColor] = Device.isUsingDarkAppearance()?[new Color('#1A1B1E', 1), new Color('#FFFFFF')]:[new Color('#FFFFFF', 1), new Color('#000000')];
		return {
			bgColor: bgColor,
			textColor: textColor
		};
	}
  
	//编辑测试使用
	async test(){
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
  
	//组件单独在桌面运行时调用
	async init(){
		if (!config.runsInWidget) return
		let widget = await this.render()
		Script.setWidget(widget)
		Script.complete()
	}
}

module.exports = Im3xWidget

// 如果是在编辑器内编辑、运行、测试，则取消注释这行，便于调试：
//await new Im3xWidget().test()

// 如果是组件单独使用（桌面配置选择这个组件使用，则取消注释这一行：
//await new Im3xWidget(args.widgetParameter).init()