# 「小件件」开发框架

> iOS 小组件快速开发框架 / 模板 / 小组件源码  👉 for [Scriptable](https://scriptable.app)    
> [查看老版本（main分支）](https://github.com/im3x/Scriptables/tree/main)

# 介绍
这是一个便于开发者在电脑上开发、测试、预览 iOS 小组件（Scriptable）的开发框架    
通过简单安装，就可以获得一个舒适的Scriptable脚本开发环境，支持语法高亮、自动补全、实时同步测试预览。    
不用再在手机上敲代码了！并且该开发框架封装了很多常用的操作接口，让开发者专注数据解析+小组件UI设计，大大节省开发时间！

# 开始
**首先，我们配置电脑开发环境：**    
1. 下载安装 VSCode 编辑器
2. 下载本项目的`v2-dev`分支zip或代码：`git clone -b v2-dev https://github.com/im3x/Scriptables.git`    
   （⚠️注意要加`-b`参数指定分支）    
3. VSCode打开代码目录，进入终端，运行安装依赖命令：`npm install`    
4. 安装好依赖，开启开发服务命令：`npm start`    

> ⚠️ 提示： windows 用户请存放源码到用户目录，比如 `C:\Users\xxx\Scriptables`，否则可能会引发权限问题导致运行失败

**然后，配置手机运行环境：**    
1. 运行服务后，会输出地址，手机访问该地址即可按照步骤初始化。或手动复制 [install-runtime.js](install-runtime.js) 脚本代码，打开 `Scriptable` 应用，点击右上角➕，粘贴代码，点击运行    
2. 如果成功，应该新加了两个插件文件：`「小件件」开发环境`、「`源码」小组件示例`    
3. 点击 `「源码」小组件示例` 或者其他任何基于此框架开发的小组件，点击操作菜单的远程开发，即可连接电脑，开启远程开发体验！    



# 发布

开发测试完毕后，可以 `pull` 到本分支进行开源分享    
小组件源码存放在 [Scrips](Scripts) 目录，你也可以复制其他的小组件进行修改使用。    


**打包分享**： 你可以使用如下命令，打包你的小组件成一个单独的文件，从而可以分享给其他用户使用：
``` bash
$ node pack.js Scripts/「源码」你的小组件.js
```
> 将会生成在 `Dist` 目录

**压缩代码**：打包的文件过大，如果需要压缩减少体积、加密敏感信息，可以通过如下脚本处理打包后的文件：
``` bash
$ node encode.js Dist/「小件件」你的小组件.js
```
> 将会在 `Dist` 目录生成 `「小件件」你的小组件.enc.js` 文件    
> 该脚本需要`javascript-obfuscator`库，如未安装请先在项目目录 `npm install`


微信小程序「小件件」 后续会开放开发者中心，开发者到时候可以上传、发布、出售自己的原创小组件。    
目前测试中，敬请关注！    

开发讨论交流群：https://x.im3x.cn/images/qun1.jpeg


![](https://x.im3x.cn/images/qr2.png)
