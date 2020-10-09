# Scriptables
iOS14桌面组件神器（Scriptable）原创脚本分享


## 项目设计思路

1. 创建一个加载器（js入口），然后客户端仅需要添加这个加载器代码即可    
2. 用户添加桌面组件，选择这个加载器，然后参数那里可以配置，比如配置插件的名称、版本、参数。
类似于：`demo@latest:test-params`、`demo:hello`（如果没有指定版本号，则加载最新的

3. 文件命名开发设计：
用项目名称做文件夹，比如`v2ex`，然后文件夹里放入脚本代码，比如`v1.0.0.js`、`latest.js`   
每次更新前，复制`latest.js`为版本号命名，这样就能每次更新都不改动之前的脚本了。

## 文件命名
目前的规则是：
根据项目命名，创建一个目录，比如我要创建一个`v2ex`站点的文章更新桌面组件，那么该项目中就创建一个`v2ex`的文件夹（命名自定义），然后在该文件夹下，创建必须的`latest.js`（最新&默认代码）、可选的`README.md`（插件说明&使用文档）

如果有功能分类，比如我要创建一个指定节点更新的插件，一个最新、最热更新的插件（两者API和解析方式不一样），那么我就可以创建两个不同版本的代码，比如`node.js`、`latest.js`
`node.js`则需要用户在添加桌面组件时，配置自定义参数，比如：`v2ex@node:分享创造`，这样就会自动加载节点这个插件代码，并解析指定节点的数据了。 如果参数是`v2ex:hot`，则加载`latest.js`代码，根据参数加载最热的文章列表。
同理

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