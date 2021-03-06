## 前言

在开发中，数据都是存在于数据库中，前端没有办法直接操作数据库，只能通过请求后端的接口来间接操作。所以任意需要改变数据、获取信息的操作都需要通过请求后端的接口，工具：ajax。

工作中，除了自己写好静态页面之后，就是与后端进行交互的过程。

## 登录

登录是一个重难点，很多人都没搞懂登录这个过程中是在干什么，包括前后端都有。

数据库中的数据都是以每个用户为单位来保存的，即`A`用户的信息和`B`用户的信息不同，所以需要在请求接口时传给后端是哪个人在操作，以便操作他自己的数据或他有权限访问的其它数据。

> 这个问题怎么做？

访问过很多网站，通常是通过账号密码来登录，登录成功后知道了是某一个用户在操作，但是不可能每个接口都把账号密码传过去，例如想象一下，用户每点击一次，你就让输入账号密码一次，这种操作应该是没见过的，也不应该有。

为了使请求每个接口都知道是某个人在操作，还是需要在请求接口的时候带上一个唯一标识，唯一标识从第一次登录成功后在后端返回，例如：

```js
// 登录
axios.post('http://example.xieaben.com/login', {
    userName: '12333333',
    password: '123456'
})
```

通过上述方法发送登录请求（这里密码未加密，加密方式根据公司规定各不相同），后端在判断账号密码是否正确后返回一个唯一标识，例：

```js
.then((res) => {
    console.log(res.data) // {status:200, sessionId: 'asodnaindasnodasodoan'} 
})
```

+ `status`字段一般每个接口都会存在，但是每个公司规定的字段名称不同（如有的地方叫`code`等），但判断依据相同，如在这里`status`只要不等于`200`就代表操作失败，需根据后端返回的提示在前端弹框、轻提示来提示用户（一般在接口操作失败后后端都会返回一个字段写着错误信息，前端可以直接将这个错误信息显示出来，例如在你毕业设计接口中我返回的错误字段是`msg`）
+ `sessionId`字段这是一个习惯命名，也有叫`token`等，后面的值就是一个唯一标识符，需要你在后面每次请求接口的时候带上这个唯一标识符（在`header`中或者是`data`中），然后后端通过这个唯一标识符就可以判断出是哪个用户在操作，这样就达到不用每次都输入账号密码。

### 什么是内存存储，什么是磁盘存储？

内存容量跟电脑硬件**内存条**的大小有关，例如你现在内存有8G。短暂储存，在浏览器关闭的时候，包括浏览器所有使用的内存就被释放了，腾出空间给其它软件。

磁盘容量和电脑硬件的**硬盘**容量有关，例如一个电脑的硬盘是`250G`大小的固态硬盘。持久储存。

打开QQ这个软件会发生什么事情：

1. 首先QQ会安装在硬盘上，因为要持久储存，即电脑开关机后这个软件包不会丢失。
2. 因为操作硬盘添加修改数据效率非常低，所以在点击QQ后，系统会将QQ这个软件所有内容加载到**内存中**以便高效操作，关闭QQ后这片内存被释放，但是QQ在硬盘上的数据你不点删除永远都会存在。（360球显示的百分比就是内存占用百分比）

综上，拿浏览器环境中举例，如果只是想在当前运行时保存数据就直接使用内存储存，关闭浏览器后内存将被释放、清空。如果需要浏览器第二次打开的时候数据还在，就只能使用硬盘储存，将数据直接写到硬盘上，如`Cookie`和`window.localStorage`等。

在我们常见的网页中，一般只需要登录一次后即使关闭浏览器后也能好几天不用登录，实现这种方式就是将上述后端返回的`sessionId`字段值（即那一串唯一标识符）通过`Cookie`或者`window.localStorage`存储在硬盘中，以便后面都能获取达到一次登录用几天的情况。

### 完整的登录流程（附加其它操作）

#### 封装axios

提出一些相同的操作，例如：

+ 发送post表单请求时候，每次都需要用`qs`模块来包装
+ 每次都需要带上唯一标识符
+ 接口返回结果优化，如以前需要通过`res.data`才能访问到具体的值，优化为直接`res`访问。

查阅axios文档可以发现在`axios`中有`create`方法，即创建一个实例，里面包括一些默认数据和配置，即配置好之后每次通过这个实例发送的请求都会带上这些默认数据。

```js
import axios from 'axios'
import Vue from 'vue'

// 创建实例
const ins = axios.create({
  // 一般在开发中，开发的域名前缀和上线之后的域名前缀不同，可在这里定义之后方便更换。
  // 定义了`baseURL`之后，以后发送请求时填写url只需要写后面的路由
  // 例如 post('/login') => http://example.xieaben.com/login
  baseURL: 'http://example.xieaben.com'
    
  // 可以通过查阅文档了解有很多方法
  // 其中有个方法可以在发送之前对数据进行修改，例如统一加上唯一标识符和遇post表单请求加上qs模块。
  // 有个方法可以在接口响应之后对响应结果数据格式进行修改，例如修改完之后可以直接通过`res`访问不用`res.data`
  // 也可以不用他提供的方法，自己编写方法将数据统一处理之后再发送，给你的参考项目跟目录中`request.js`就是使用这种。
})

// 如果将ins绑定在Vue的原型中即在其它组件中可以通过this访问
Vue.prototype.$http = ins

// 发送请求示例
ins.post('/login'， {userName: '123', password: '123'}).then().catch()

// 根据上面的配置，组件中发送示例
export default {
    created() {
        this.$http.post('/login'， {userName: '123', password: '123'}).then().catch()
    }
}
```

#### 登录

```js
// login.vue
// 代码只是参考，不一样在你的环境中能跑通
export default {
    methods: {
        submit() {
            this.$http.post('/loign', {
                userName: '123',
                password: '123'
            }).then((res) => {
                if(res.status === 200) {
                    // 登录验证成功
                    window.localStorage.setItem('sessionId', res.sessionId)
                    this.$router.push({name: 'index'}) // 跳转到首页或者其它页面
                } else {
                    // 利用elementui的`$message.error`方法提示用户,
                    // res.msg为接口返回的错误信息，例如账号或密码错误等信息，
                    // 字段名称也可能不一定叫msg
                    this.$message.error(res.msg)
                }
            }).catch((err) => {
                // 发生接口请求错误，需要提示用户，err字段为错误对象，可用可不用。
                // 在有UI框架的时候不要使用alert
                // alert首先不美观，其次会阻断js进程，将页面卡主。
            })
        }
    }
}
```

## 商品选择

首先进入这个页面的时候就发送ajax，获取所有商品的信息

```js
export default {
    data() {
        return {
            goodsList: []
        }
    },
    created() {
        this.$http.post('/getAllGoodsList').then((res) => {
            this.goodsList = res.goodsList
        }).catch(() => {
            // 发生错误
        })
    }
}
```

你需要单独写一个功能将商品添加到购物车，参考项目中使用的是`vuex`，现在可以无视，你可以自定义一个如`cart.js`文件，用来对一个购物车进行操作，增删改查。购物车数据可以放在前端，也可以放在后端数据中，这里放在前端内存中，即下次打开后之前的购物车将被清空。



## 购物车

显示出已经在购物车中的商品，且包括修改数量等操作，确认无误后点击结算。

## 订单列表

表格展示所有下单的信息。

## 退出登录

退出登录接口实质上后端将唯一标识符提前失效，退出登录后需要重新登录获取新的会话标识符。