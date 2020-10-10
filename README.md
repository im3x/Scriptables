# Scriptables
iOS14桌面组件神器（Scriptable）原创脚本分享（[国内 Gitee 仓库地址](https://gitee.com/im3x/Scriptables)），喜欢请给🌟，欢迎一起添加完善 ❤️    


# 快速使用
1. iPhone 上下载 [Scriptable](https://apps.apple.com/cn/app/scriptable/id1405459188) App    
2. 点击下载：[GitHub版源](https://im3x.cn/scriptables/Loader.Github.scriptable)、[国内Gitee源](https://im3x.cn/scriptables/Loader.Gitee.scriptable)，然后点击下载的文件，用`Scriptable` App打开
2. 手动版：打开App，点击右上角 + 号，复制项目中对应的 [loader.github.js](loader.github.js) 或 [loader.gitee.js](loader.gitee.js) 代码    
3. 长按桌面，添加组件，选择 `Scriptable`，然后点击组件配置，选择刚刚保存的脚本，下方的参数根据情况输入配置即可！    
例如，我要显示`one`每日图文组件，配置下方输入`one`即可。    
更多插件的配置参数，请查阅插件目录的`README.md`说明    

![](https://im3x.cn/scriptables/screenshots_2.jpg)

## 插件开发
每一个项目，都创建一个文件夹，文件夹中存放该项目的版本号等文件，比如：
1. `latest.js` 最新版本代码文件    
2. `README.md` 插件说明使用文档    
3. `v2.0.0.js` 其他版本或功能区分文件    

测试的时候，添加桌面组件，选择加载器，然后参数输入格式：`项目文件夹名@版本号:参数`，比如`one`项目中有个`test.js`代码文件，传递：`one@test:1`类似格式的配置，也可以直接输入项目名即可（版本号默认latest，参数默认脚本定义）

插件代码，请直接复制项目中的`template.sample.js`模板编辑
