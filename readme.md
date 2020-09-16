# mp-cookie
> 使用微信小程序`storage`模拟cookie库的操作，支持设置设置过期时间，支持获取过期后的cookie。

## Usage

### 初始化npm
参考：[npm支持](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)

### 安装依赖：
```
npm i mp-cookie --save
# or
yarn add mp-cookie
```

### 构建npm
参考：[npm支持](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)

### 使用`mp-cookie`
```js
// pages/index/index.js
import MpCookie from 'mp-cookie'
// 创建实例
const cookie = new MpCookie();
Page({
  data: {
    userInfo: {},
  },
  onShow() {
    const userInfo = cookie.get('USER_INFO')
    this.setData({
      userInfo,
    })
  }
})
```

### API

#### 配置

##### `options.path`
cookie生效路径，默认为空, 即全局生效，如果希望设置为当前页面生效，可以参考如下代码：
```js
const pages = getCurrentPages()
const currentPage = pages[pages.length - 1]
const cookie = new MpCookie({ path: currentPage.route })
```
##### `options.expires`
cookie过期时间，默认1天。这里之所以默认配置为短期失效，是为了更贴近原始cookie的特性。如果希望设置永久cookie，最好这里指定一个很大的数字
```js
// 失效日期10年
const cookie = new MpCookie({ expires: 10 * 365 * 24 * 60 * 60 * 1000 })
```

#### 方法

##### `cookie.get(KEY)`
获取键为`KEY`的cookie。

##### `cookie.set(KEY, VALUE)`
种入cookie，键为KEY, 值为VALUE, VALUE可以是任意可`JSON.stringify`的数据。

##### `cookie.remove(KEY)`
移除键为KEY的cookie。

##### `cookie.clear()`
清空当前实例的所有cookie。

##### `cookie.getExpired(KEY)`
获取已过期的cookie。为方便获取已过期数据，单独提供了这个方法。

### 实践
通常情况，一个小程序中往往只使用一个cookie实例。建议在公共文件管理cookie，调用方只需引入全局唯一cookie实例。
```js
//cookieManage.js
import MpCookie from 'mp-cookie'
export default new MpCookie({ expires: 10 * 365 * 24 * 60 * 60 * 1000 })

// pages/page/index.js
import cookie from '../cookieManage.js'
Page({
  onShow() {
    const userInfo = cookie.get('USER_INFO')
    this.setData({
      userInfo,  
    })  
  } 
})
```

### TODO
- []storage存储大小管理
- []支持长效cookie的简便写法
