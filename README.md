# Scriptables
iOS14桌面组件神器（Scriptable）原创脚本分享


## 项目设计思路

1. 创建一个加载器（js入口），然后客户端仅需要添加这个加载器代码即可    
2. 用户添加桌面组件，选择这个加载器，然后参数那里可以配置，比如配置插件的名称、版本、参数。
类似于：`demo@latest:test-params`、`demo:hello`（如果没有指定版本号，则加载最新的

3. 文件命名开发设计：
用项目名称做文件夹，比如`v2ex`，然后文件夹里放入脚本代码，比如`v1.0.0.js`、`latest.js`   
每次更新前，复制`latest.js`为版本号命名，这样就能每次更新都不改动之前的脚本了。

## 部分坑和注意事项
因为插件代码运行在`eval`中，所以有些组件代码单独执行可以，用插件调用就不行，是因为一些变量域或其他的关系。
所以我们在编写中，应该遵守一些“规则”，这样既能让自己的组件完美运行在插件中，也能让用户单独下载使用。

1. 坑1:async & await 不能放在函数外执行
比如插件最顶部的代码：
``` js
let data = await getData()
let widget = await createWidget(data)
```
这部分代码单独执行是可以的，远程调用执行会出错。
所以如果我们改成下边方式：
``` js
main()
async function main() {
  let data = await getData()
  let widget = await createWidget(data)
}
```
则代码就可以完美在单独组件和远程加载插件中运行～～
