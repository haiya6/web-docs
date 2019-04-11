# 原生JavaScript知识

## js中数据类型
+ js中基本数据类型：`undefined`, `null`, `boolean`, `string`, `number`, `symbol`
+ 原始数据类型存储在栈内存中，存储的是具体的值
+ 复杂数据类型存储在堆内存中，存储的是地址值，所以在我们把一个指向对象的变量赋值给另一个变量的时候赋值的是对象在内存中的地址值，它们指向同一块内存空间，例如：

```js
const obj = {}
const newObj = obj

newObj.name = 'zhangsan'
console.log(obj.name) // zhangsan
```

## js判断各种数据类型
+ 首先`typeof`可以正确判断除`null`之外的基本数据类型，例如：

```js
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof 'zhangsan' // 'string'
typeof 1 // 'number'
typeof Symbol() // 'symbol'

typeof null // 'object'
```

+ `typeof`无法准确判断出复杂数据类型，例如：

```js
typeof [] // 'object'
typeof {} // 'object'
typeof function () {} // 'function'
```

+ 待完善

## `for of`, `for in`, `forEach`, `map`的区别

+ `for of`：前提是实现了`iterator`接口，遍历它的属性值。**可以中断循环**
+ `for in`：遍历对象自身和继承的可枚举属性，不能直接获取到属性值。**可以中断循环**
+ `forEach`：数组的方法，只能遍历数组，没有返回值。**不能中断循环**
+ `map`：数组的方法，只能遍历数组，返回新的数组。**不能中断循环**

> 注： `Object.keys()`： 返回给定对象的所有可枚举属性的字符串数组。

## 判断一个变量是不是数组

+ [Array.isArray](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)判断，方法返回`true`则是数组。
+ 使用`instanceof Array`，返回`true`则是数组。
+ 使用`Object.prototype.toString.call`判断，值为`[object Array]`则是数组。
+ 通过`constructor`判断，`arr.constructor === Array`则为数组，但是不准确，因为可以手动指定对象的`constructor`属性。

```js
const arr = []
const obj = {}

Array.isArray(arr) // true
arr instanceof Array // true
Object.prototype.toString.call(arr) === ['object Array'] // true
arr.constructor === Array // true

// 注意 constructor属性可以手动被更改。
obj.constructor = Array
console.log(obj.constructor === Array) // true

```

## 类数组与数组

类数组不是数组，没有数组的方法，只是一个普通的对象，但是有`length`属性。如：`arguments`对象，DOM对象列表（`window.document.querySelectAll('div')`）。  

类数组转换成数组:

```js
// 方法1
Array.from(arrayLike)

// 方法2
[...arrayLike]

// 方法3
Array.prototype.slice.call(arrayLike)
```

> 任意定义了`iterator`接口的对象都能被扩展运算符转换（`...`）为真正的数组。
> `Array.from`方法将用于将两类对象转为真正的数组：类似数组的对象（like-array）和可遍历（iterator）的对象。

<!-- ## `==`和`===`的区别和类型转换

+ `===`不需要进行类型的转换，只有类型和值都相同才返回`true`，其中复杂数据类型比较的是地址值。
+ `==`若两者类型不同，先进行类型转换，具体流程如下：
  1. 判断两者的类型是不是相同，如果相同，判断值是否相等；
  2. 如果类型不同，进行类型转换；
  3. 判断比较的是否是`null`或者`undefined`，如果是返回`true`；
  4. 判断两者类型是否是`string`和`number`，如果是将字符串转为`number`；
  5. 判断其中一方是否为`boolean`，如果是，将`boolean`转为`number`再进行判断
  6. 判断其中一方是否是`object`且另一方是`string`、`number`、`symblo`，如果是，将`object`转为基本数据类型进行判断 -->

## ES6、ES5中的类

```js
// 在es5中根据构造函数创建对象
function Person() {}
const person = new Person()

// es6中根据类创建对象
class Student {}
const student = new Student()
```

+ ES6中`class`内部所有定义的方法都是不可枚举的。

```js
function Person(name) {
  this.name = name
  this.say = function() {}
}
const person = new Person('zhangsan')
console.log(Object.keys(person)) // ['name', 'a']

class Student {
  constructor(name) {
    this.name = name
  }
  say() {}
}

const stu = new Student()
console.log(Object.keys(stu)) // ['name']
```

+ ES6中`class`不存在变量提升  

```js
const stu = new Student() // Student is not defined

class Student {
  constructor(name) {
    this.name = name
  }
  say() {}
}
```

+ ES6中`class`默认使用严格模式
+ ES6`class`子类必须在构造函数中调用`super()`，这样才有`this`对象；ES5中类继承的关系是相反的，先有子类的`this`，然后用父类的方法应用在`this`上。

## js中的变量提升和暂时性死区
变量提升意思是在变量声明前就能调用，值为`undefined`

```js
// var 存在变量提升
console.log(name) // undefined
var name = 'zhangsan'

console.log(age) // ReferenceError: age is not defined
let age = 2
```

在代码块内，使用 `let`,`const` 命令声明变量之前，该变量都是不可用的(会抛出错误)。这在语法上，称为“暂时性死区”。暂时性死区也意味着`typeof`不再是一个百分百安全的操作。

```js
console.log(typeof a) // 注意：并没有定义a变量，正常运行，值为 undefined

{
  console.log(typeof x) // 暂时性死区 ReferenceError: x is not defined
  let x
}
```
暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。

## js中的`this`指向
参考首页链接文章

## js的执行上下文栈和作用域链
执行上下文就是当前`js`代码被解析和执行时所在的环境，`js`执行上下文栈可以认为是一个存储函数调用的栈结果，遵循先进后出的原则。
+ `js`运行在单线程上，所有的代码都是排队执行。
+ 一开始浏览器执行全局的代码时，首先创建全局的执行上下文，压入执行栈顶部
+ 每当进入一个函数的执行就会创建函数的执行上下文，并且把它压入执行栈的顶部，当前函数执行完成后当前函数的执行上下文出栈，并等待垃圾回收
+ 浏览器的`js`执行引擎总是访问栈顶的执行上下文
+ 全局上下文只有唯一的一个，他在浏览器关闭时出栈

作用域链：无论是`LHS`还是`RHS`查询，都会在当前作用域开始查找，如果没有找到就会向上级作用域继续查找目标，每次上升一个作用域，一直到全局作用域为止。

<!-- ## js中闭包
## 函数的`bind`、`call`、`apply`方法
## `new`关键字的原理 -->

