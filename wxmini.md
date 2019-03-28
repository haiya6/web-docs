# 微信小程序

在有前端开发经验的朋友开发微信小程序上手[微信开发文档](https://developers.weixin.qq.com/miniprogram/dev/)足够。

## 开发准备

+ 了解微信小程序架构，[官方指南](https://developers.weixin.qq.com/ebook?action=get_post_info&docid=0008aeea9a8978ab0086a685851c0a)。
+ 精通微信小程序组件的使用方法，包括每个组件的每个属性。
+ 精通微信小程序生命周期及其触发顺序。尤其`onLoad`、`onShow`、`onHide`、`onUnload`。
+ 阅读微信小程序提供的所有API。
+ 清楚微信小程序授权逻辑和相关API。

## 开发注意事项

1. 在微信开发工具中创建一个页面时会产生4个文件（`js`、`wxss`、`json`、`wxml`)，其中每个文件都带着基础模板，为了防止以后产生没有想到的错误（如`js`文件中，会带`onShareAppMessage`生命周期函数，促使每个页面默认都带了分享功能），需要手动全部清空且`js`文件第一步先引入app方便后续使用。

```js
// index.js
const app = getApp()

Page({
  // ...
})
```

2. 使用`const`、`let`代替`var`，避免写出让人不可以理解的操作，使用方法和介绍参考[阮一峰老师的es6入门](http://es6.ruanyifeng.com/#docs/let)。

3. 避免为了实现一个小功能而引入一个第三方整套文件，控制小程序体积不超过2M。

4. 优化微信支付接口的调用方式。

```js
// 其中  res.testPayData为接口返回的支付参数对象。

// 一般情况
wx.requestPayment({
  timeStamp: res.testPayData.timeStamp,
  nonceStr: res.testPayData.nonceStr,
  package: res.testPayData.package,
  signType: res.testPayData.signType,
  paySign: res.testPayData.paySign,
  success: () => {
    // ...
  },
  fail: () => {
    // ...
  }
})

// 优化后
const { testPayData} = res
testPayData.success = () => { 
  // ...
}
testPayData.fail = () => { 
  // ...
}
wx.requestPayment(testPayData)
```

5. 操作成功使用轻提示，操作失败使用弹框。

```js

// 成功操作
wx.showToast({
  title: '操作成功',
  // icon: 'none' // 看需求需不需要显示icon
})

// 失败操作
wx.showModal({
  title: '提示',
  content: '操作失败',
  // showCancel: false // 根据业务情况判断要不要显示取消按钮
})
```

6. 操作判断全面，且根据错误类型进行不同提示。如使用小程序扫描指定二维码进入页面。

```js
wx.scanCode({
  success: () => {
    // 1. 扫描成功，但不是需要的数据
    // 2. 扫描成功且是需要的数据和格式
  },
  fail: () => {
    // 接口调用错误，如用户扫描的不是二维码或条形码
  }
})
```

7. 用`bind`函数或箭头函数绑定`this`指向

```js
// bad
const that = this
wx.request({
  success: function(){
    that.setData()
  }
})

// 使用bind函数
wx.request({
  success: function(){
    this.setData()
  }.bind(this)
})
// 使用箭头函数
wx.request({
  success: () => {
    this.setData()
  }
})
```

8. `wxml`中使用遍历一定带上唯一的`key`属性

```wxml
<!-- bad -->
<view wx:for="{{list}}">{{item}}</view>

<!-- good -->
<view wx:for="{{list}}" wx:key="{{item.id}}">{{item}}</view>
```

9. `js`需要使用与视图绑定的属性都在`data`中预先定义初始化。

```js
// bad
const app = getApp()

Page({
  onLoad(){
    this.setData({
      a: 1
    })
  }
})


// good
const app = getApp()

Page({
  data: {
    a: 0
  },
  onLoad(){
    this.setData({
      a: 1
    })
  }
})
```

10. 在页面中创建的定时器、延时器一定要在页面卸载的时候清除。

```js
// error!
const app = getApp()

Page({
  onLoad(){
    this.timer = setInterval(() => {
      // ...
    }, 1000)
  }
})


// good
const app = getApp()

Page({
  onLoad(){
    this.timer = setInterval(() => {
      // ...
    }, 1000)
  },
  onUnload(){
    clearInterval(this.timer)
  }
})

// very good 在页面被隐藏的时候暂时关闭定时器
const app = getApp()

Page({
  onShow() {
    this.handle()
  },
  handle() {
    this.timer = setInterval(() => {
      // ...
    }, 1000)
  },
  onHide(){
    clearInterval(this.timer)
  },
  onUnload(){
    clearInterval(this.timer)
  }
})
```

11. 确定不需要的代码直接删除不要注释放着不管。

12. 利用小程序页面自带跳转动画来优化用户体验，尽量不要使用重定向！

13. 使用`===`代替`==`判断。

13. 判断状态码的时候定义一个常量匹配，不要疯狂使用`wx:if`。

bad
```wxml
<view wx:if="{{order.status === 1}}">待付款</view>
<view wx:if="{{order.status === 2}}">待发货</view>
<view wx:if="{{order.status === 3}}">待收货</view>
<view wx:if="{{order.status === 4}}">待评价</view>
```

good
```js
// in js
const app = getApp()

Page({
  data: {
    ORDERSTATUS: ['', '待付款', '待发货', '待收货', '待评价']
  }
})
```
```wxml
<!-- in wxml -->
<view>{{ORDERSTATUS[order.status]}}</view>
```

14. 使用`JSON.parse`注意处理异常，该方法不是百分百成功。

```js
// bad 
const res = JSON.parse(a)

// good 
let res = null
try {
  res = JSON.parse(a)
}catch(e) {
  console.log(e)
}
```

## 开发常遇问题

### 等待登录完成后再发起其他请求

在小程序中通过`wx.login`登录获取`code`给后端朋友换取会话标识（如`sessionid`、`token`之类的），其它的接口需带上该标识请求。

而http请异步的，有很大几率会出现登录的请求还没有响应首页的请求已经发出去了，这时候由于首页接口没有带上会话标识导致错误。

**思路**

```js
// 二次封装request方法

// 定义 callback 数组
const callbacks = []
// 发出请求之前进行判断
// if have token 直接发送

// else 没有token，或后端返回403代表token过期了， callback 存着该次请求等登录完成后再发起
```

### 各种授权

小程序开发中，如果想获取用户一些隐私数据则需要经过用户授权通过才可以。

若当前小程序必须要获取你的权限，如地理位置，这时候就要考虑用户各种行为。其中需要注意是，一旦用户拒绝了一项权限，则在规定时期内即使调用该接口方法也不会弹框询问用户而是立即失败。

```js
// in page a
const app = getApp()

Page({
  onLoad(){
    this.getUserLocation()
  },
  getUserLocation(){
    // 尝试获取
    wx.getLocation({
      success: (res) => {
        // 成功获取 进行后续操作
      },
      fail: () => {
        // 用户拒绝或曾经拒绝 
        this.openUserSetting()
      }
    })
  },
  openUserSetting(){
    // 注意：2.3.0 版本开始，用户发生点击行为后，才可以跳转打开设置页，管理授权信息。如点击一个按钮，在点击事件中打开
    // 目前版本存在bug，可以在wx.showModel也能触发打开设置页。
    wx.showModal({
      title: 'title',
      content: 'content',
      showCancel: false,
      success: () => {
        wx.openSetting({
          success: (res) => {
            if(!res.authSetting['scope.userLocation']) {
              this.openUserSetting() // 继续弹框
            }else {
              this.getUserLocation()
            }
          },
          fail: () => {
            // 微信发生预期之外的错误
          }
        })
      }
    })
  }
})
```

### 页面之间传值

在开发中难免会碰到页面之间传值的情况，例如当前下单页面需要填写备注项，点击后会跳转到另一个页面填写备注然后返回。

这时候需要在下单页面获取这些内容，微信没有提供直接的api，但每个页面都能访问到`app`实例，因此可以在利用`app`来做中间桥梁。

```js
// app.js
App({
  // tempData 属性名随意，或 globalData
  tempData: {
    remark: null
  }
})
```

```js
// 备注填写页面
const app = getApp()

Page({
  inputOver(remark){
    app.tempData.remark = remark
    wx.navigateBack()
  }
})
```

```js
// 下单页面
const app = getApp()

Page({
  data: {
    remark: ''
  },
  onShow(){
    this.checkRemark()
  },
  checkRemark(){
    const remark = app.tempData.remark
    if(remark !== null) {
      this.setData({
        remark
      })
    }
  },
  onUnload(){
    app.tempData.remark = null // 一定要在页面卸载的时候重置这个变量，否则下次进去该页面时会自动获取上次填写的remark
  }
})
```

## 小程序基础模板
该模板内置了一些常用的组件和工具，封装了http请求。
### 下载
使用脚手架下载安装
```
// 全局安装脚手架
npm i wx-mini-cli -g
// 初始化项目
wx-mini-cli init <project-name>
```

**注意事项**
1. 在导入创建项目时需要手动更改appid！
2. 该模板基础库可能不是最新，需在微信开发工具中手动变更基础库版本。



