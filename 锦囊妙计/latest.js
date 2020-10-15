//
// 心灵毒鸡汤
// 项目地址：https://github.com/im3x/Scriptables
//

class Im3xWidget {
  /**
   * 初始化
   * @param arg 外部传递过来的参数
   */
  constructor(arg, loader) {
    this.ORM = {
      舔狗日记: "0c97d296-e5b1-11ea-9d4b-00163e1e93a5",
      你好污啊: "485eee9c-e603-11ea-9d4b-00163e1e93a5",
      文艺句子: "ed92-11ea-9d4b-00163e1e93a5",
      毒鸡汤: "b1386080-e5b7-11ea-9d4b-00163e1e93a5",
      网抑云: "f67a73f4-e5b7-11ea-9d4b-00163e1e93a5",
      动漫语录: "0760fbcd-e5b8-11ea-9d4b-00163e1e93a5",
      土味情话: "b40bc82d-e5b7-11ea-9d4b-00163e1e93a5",
      名人名言: "bb11e9b0-e5b7-11ea-9d4b-00163e1e93a5",
      诗词: "c4c2abc1-e5b7-11ea-9d4b-00163e1e93a5",
    };
    this.arg = arg;
    this.typeId = this.ORM[arg];
    this.loader = loader;
    this.fileName = module.filename.split("Documents/")[1];
    this.widgetSize = config.widgetFamily;
  }
  /**
   * 渲染组件
   */
  async render() {
    if (this.widgetSize === "medium") {
      return await this.renderMedium();
    } else if (this.widgetSize === "large") {
      return await this.renderLarge();
    } else {
      return await this.renderSmall();
    }
  }

  /**
   * 渲染小尺寸组件
   */
  async renderSmall() {
    let w = new ListWidget();
    w = await this.renderHeader(
      w,
      "https://s1.ax1x.com/2020/10/15/0TfGfP.jpg",
      this.arg
    );
    let data = await this.getData(
      `https://api.wangpinpin.com/unAuth/getDoglickingDiary?typeId=${this.typeId}`,
      true
    );
    if (!data) {
      data = { data: "[数据加载失败]" };
    }
    let content = w.addText(data.data);
    content.font = Font.lightSystemFont(14);

    if (this.loader) {
      w.url = this.getURIScheme("do", data.data);
    }
    return w;
  }
  /**
   * 渲染中尺寸组件
   */
  async renderMedium() {
    return await this.renderSmall();
  }
  /**
   * 渲染大尺寸组件
   */
  async renderLarge() {
    return await this.renderSmall();
  }

  /**
   * 渲染标题
   * @param widget 组件对象
   * @param icon 图标url地址
   * @param title 标题
   */
  async renderHeader(widget, icon, title) {
    let header = widget.addStack();
    header.centerAlignContent();
    let _icon = header.addImage(await this.getImage(icon));
    _icon.imageSize = new Size(14, 14);
    _icon.cornerRadius = 4;
    header.addSpacer(10);
    let _title = header.addText(title);
    // _title.textColor = Color.white()
    _title.textOpacity = 0.7;
    _title.font = Font.boldSystemFont(12);
    widget.addSpacer(15);
    return widget;
  }

  /**
   * 获取api数据
   * @param api api地址
   * @param json 接口数据是否是 json 格式，如果不是（纯text)，则传递 false
   * @return 数据 || null
   */
  async getData(api, json = true) {
    let data = null;
    try {
      let req = new Request(api);
      data = await (json ? req.loadJSON() : req.loadString());
    } catch (e) {}
    // 判断数据是否为空（加载失败）
    if (!data) {
      // 刷新
      return null;
    }
    return data;
  }
  /**
   * 加载远程图片
   * @param url string 图片地址
   * @return image
   */
  async getImage(url) {
    try {
      let req = new Request(url);
      return await req.loadImage();
    } catch (e) {
      let ctx = new DrawContext();
      ctx.size = new Size(100, 100);
      ctx.setFillColor(Color.red());
      ctx.fillRect(new Rect(0, 0, 100, 100));
      return await ctx.getImage();
    }
  }

  /**
   * 给图片加上半透明遮罩
   * @param img 要处理的图片对象
   * @return image
   */
  async shadowImage(img) {
    let ctx = new DrawContext();
    ctx.size = img.size;
    ctx.drawImageInRect(
      img,
      new Rect(0, 0, img.size["width"], img.size["height"])
    );
    // 图片遮罩颜色、透明度设置
    ctx.setFillColor(new Color("#000000", 0.7));
    ctx.fillRect(new Rect(0, 0, img.size["width"], img.size["height"]));
    let res = await ctx.getImage();
    return res;
  }
  async runActions() {
    let { act, data } = this.parseQuery();
    if (!act) return;
    if (act !== "do") return;
    const alert = new Alert();
    alert.title = "锦囊妙计";
    alert.message = data;
    alert.addAction("复制内容");
    alert.addAction("查看源码");
    alert.addCancelAction("取消操作");

    let idx = await alert.presentSheet();
    switch (idx) {
      case 0:
        Pasteboard.copyString(data);
        break;
      case 1:
        Safari.openInApp("https://github.com/im3x/Scriptables/", false);
        break;
    }
  }

  // 获取跳转自身 urlscheme
  // w.url = this.getURIScheme("copy", "data-to-copy")
  getURIScheme(act, data) {
    let _raw = typeof data === "object" ? JSON.stringify(data) : data;
    let _data = Data.fromString(_raw);
    let _b64 = _data.toBase64String();
    return `scriptable:///run?scriptName=${encodeURIComponent(
      Script.name()
    )}&act=${act}&data=${_b64}&__widget__=${encodeURIComponent(
      args["widgetParameter"]
    )}`;
  }
  // 解析 urlscheme 参数
  // { act: "copy", data: "copy" }
  parseQuery() {
    const { act, data } = args["queryParameters"];
    if (!act) return { act };
    let _data = Data.fromBase64String(data);
    let _raw = _data.toRawString();
    let result = _raw;
    try {
      result = JSON.parse(_raw);
    } catch (e) {}
    return {
      act,
      data: result,
    };
  }
  /**
   * 编辑测试使用
   */
  async test() {
    if (config.runsInWidget) return;
    this.widgetSize = "small";
    let w1 = await this.render();
    await w1.presentSmall();
    this.widgetSize = "medium";
    let w2 = await this.render();
    await w2.presentMedium();
    this.widgetSize = "large";
    let w3 = await this.render();
    await w3.presentLarge();
  }

  /**
   * 组件单独在桌面运行时调用
   */
  async init() {
    if (!config.runsInWidget) return await this.runActions();
    let widget = await this.render();
    Script.setWidget(widget);
    Script.complete();
  }
}

module.exports = Im3xWidget;

// 如果是在编辑器内编辑、运行、测试，则取消注释这行，便于调试：
// await new Im3xWidget('舔狗日记').test()

// 如果是组件单独使用（桌面配置选择这个组件使用，则取消注释这一行：
// await new Im3xWidget(args.widgetParameter, true).init()
