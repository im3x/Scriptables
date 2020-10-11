![](/v2ex/screenshot.jpg)

# v2ex for scriptable
> iOS14 桌面组件展示 v2ex 站点的文章，点击后跳转文章详情页面


## api 版本
最新文章参数：`v2ex@api`     
最热文章参数：`v2ex@api:hot`

## tab 版本
> 就是 [v2ex](https://www.v2ex.com) 站点的首页顶部 tab 分类，比如全部分类是`all`、创意分类是`creative`，依次类推

技术分类：`v2ex@tab:tech`    
创意：`v2ex@tab:creative`    
好玩：`v2ex@tab:play`    
Apple：`v2ex@tab:apple`    
酷工作：`v2ex@tab:jobs`    
交易：`v2ex@tab:deals`    
城市：`v2ex@tab:city`    
问与答：`v2ex@tab:qna`    
最热：`v2ex@tab:hot`
全部：`v2ex@tab:all` （默认，也可以直接输入参数`v2ex@tab`）    
R2：`v2ex@tab:r2`    

## go 节点版本
> 就是点击节点进入的界面，比如[分享创造](https://www.v2ex.com/go/create)，节点就是：`create`，对应参数：`v2ex@go:create`    

各种节点参数请参考官方网站列表：https://www.v2ex.com/planes

## 如何使用
桌面添加组件，然后选择加载器，`Parameter` 参数中填写如下格式：

1. 最新文章：`v2ex@api`
2. 最热文章：`v2ex@api:hot`

## 其他说明
目前该组件仅支持展示最新、最热文章（调用官方api接口）
