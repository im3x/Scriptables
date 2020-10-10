# Scriptables
iOS14桌面组件神器（Scriptable）原创框架，脚本开发教程、精美作品分享！    
（[国内 Gitee 仓库地址](https://gitee.com/im3x/Scriptables)），喜欢烦请给个🌟，欢迎一起添加完善 ❤️    

![screenshot.jpg](https://i.loli.net/2020/10/10/6tLnwuzBrk3qxGd.jpg)

# 快速使用
1. iPhone 上下载 [Scriptable](https://apps.apple.com/cn/app/scriptable/id1405459188) App（确保你的系统已更新为 iOS14+）    
2. Safari点击下载：[GitHub版源](https://im3x.cn/scriptables/Loader.Github.scriptable)、[国内Gitee源](https://im3x.cn/scriptables/Loader.Gitee.scriptable)，然后点击下载的文件，用`Scriptable` App打开
2. 手动版：打开App，点击右上角 + 号，复制项目中对应的 [loader.github.js](loader.github.js) 或 [loader.gitee.js](loader.gitee.js) 代码    
3. 长按桌面，添加组件，选择 `Scriptable`，然后点击组件配置，选择刚刚保存的脚本，下方的参数格式为：`插件名@版本号:自定义参数`     
例如，我要显示`one`每日图文组件，配置下方输入`one`或`one@latest`即可（显示昨天的文章输入配置`one:1`，依次类推）。    
**更多插件的配置参数，请查阅插件目录的`README.md`说明    **

## 插件开发
每一个项目，都创建一个文件夹，可以是中英文，最好不要有其他特殊符号。    
文件夹中存放该项目的版本号等文件，比如：    
1. `latest.js` 最新版本代码文件    
2. `README.md` 插件说明使用文档    
3. `v2.0.0.js` 其他版本或功能区分文件    

测试的时候，添加桌面组件，选择加载器，然后参数输入格式：`项目文件夹名@版本号:参数`，比如`v2ex`项目中有个`api.js`代码文件，传递：`v2ex@api:hot`类似格式的配置，也可以直接输入项目名即可（版本号默认latest，参数默认脚本定义）

插件代码，请直接复制项目中的`template.sample.js`模板编辑
