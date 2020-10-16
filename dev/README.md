## 组件远程调试服务

使用前，确保手机和node运行的服务在同一个局域网。

1. 在本目录运行node服务

```bash
npm install
npm run serve
```
正确的话，会在console得到已开启调试的提示。

2. 服务运行起来之后，修改`debug.js`的ip和端口。

```bash
const nodeServeUrl = `http://**:8023` // 8023为默认端口
```

3. 确保步骤2完成之后，将`debug.js`的代码粘贴到scriptable上。当然要在桌面小组件上查看啦。

4. 编写你的小组件代码，位于`/www/latest.js`。

5. 改动之后，到scriptable粘贴的`debug.js`脚本代码上点击运行。回到桌面查看修改，由于scripatable的更新机制，或许需要多次运行才行。

6. 组件代码完成之后就可以放到最后的目录上啦。