# 原生JavaScript知识

## js中的数据类型
+ js中基本数据类型：`undefined`, `null`, `boolean`, `string`, `number`, `symbol`
+ 原始数据类型存储在栈内存中，存储的是具体的值
+ 复杂数据类型存储在堆内存中，存储的是地址值，所以在我们把一个指向对象的变量赋值给另一个变量的时候赋值的是对象在内存中的地址值，它们指向同一块内存空间，例如：

```js
const obj = {}
const newObj = obj

newObj.name = 'zhangsan'
console.log(obj.name) // zhangsan
```

## 数据类型判断
+ `typeof`可以正确判断除`null`之外的基本数据类型，例如：

```js
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof 'zhangsan' // 'string'
typeof 1 // 'number'
typeof Symbol() // 'symbol'

typeof null // 'object'

// typeof无法准确判断出复杂数据类型
typeof [] // 'object'
typeof {} // 'object'
typeof function () {} // 'function'
```

+ `instanceof`可以判断复杂数据类型，但不能正确的判断基本数据类型，例如：

```js
const arr = []
console.log(arr instanceof Array) // true

const obj = {}
console.log(obj instanceof Object) // true

const func = () => {}
console.log(func instanceof Function) // true

console.log(1 instanceof Number) // false
```
`instanceof`是通过原型链来判断的，`A instanceof B`在A的原型链中查找，是否有原型（`A.__proto__`）等于`B.prototype`，如果一直找到`A`的原型链的顶端（`null`，即`Object.prototype.__proto__`）仍然不等于`B.prototype`返回`false`，否则`true`。  
```js
/**
 * 简单实现 instanceof
 * @param {左边} ins 
 * @param {右边} c 
 */
const _instanceof = (ins, c) => {
  let proto = ins.__proto__
  while (proto) {
    if(proto === c.prototype) {
      return true
    } else {
      proto = proto.__proto__
    }
  }

  return false
}
```
+ `Object.prototype.toString`准确判断各种类型

```js
const toString = Object.prototype.toString
console.log(toString.call(undefined)) // [object Undefined]
console.log(toString.call(true)) // [object Boolean]
console.log(toString.call('zhangsan')) // [object String]
console.log(toString.call(0)) // [object Number]
console.log(toString.call(Symbol())) // [object Symbol]
console.log(toString.call(null)) // [object Null]
console.log(toString.call({})) // [object Object]
console.log(toString.call([])) // [object Array]
console.log(toString.call(function () { })) // [object Function]
```
+ 另外一种判断基本数据类型和复杂数据类型方法https://github.com/YvetteLau/Blog/blob/master/JS/data-type.js

## js中类型转换

### 显示转换
```js
// 将任意值转为Nubmer类型
Number()
// 转为String
String()
// 转为Boolean
Boolean()
```

### 隐式转换

在`JavaScript`中当运算符在运算时，如果两边运算不统一，cpu将无法计算，所以编译器会自动将两边的数据做一个数据类型转换，这种转换称为**隐式转换**。

_待完善_


## js中`for of`, `for in`, `forEach`, `map`的区别

+ `for of`：前提是实现了[`iterator`](http://es6.ruanyifeng.com/#docs/iterator)接口，遍历它的属性值。**可以中断循环**

```js
const arr = ['zhangsan', 'lishi']

for(const value of arr) {
  console.log(value) // zhangsan  lishi
}

const obj = {}
for(const value of obj) {
  console.log(value) // TypeError: obj is not iterable，普通对象没有具备Interator接口
}
```

+ `for in`：遍历对象自身和继承的可枚举属性，不能直接获取到属性值。**可以中断循环**

```js
// 遍历数组索引
const arr = ['zhangsan', 'lishi']
for(const key in arr) {
  console.log(key) // 0 1
}

// 遍历对象的key
const obj = {
  a: 1,
  func() {

  }
}
for(const key in obj) {
  console.log(key) // a  func
}

class Student {
  constructor(name) {
    this.name = name
  }
  say() {}
}
const stu = new Student('zhangsan')
for(const key in stu) {
  console.log(key) // name  注意：for in只能遍历可枚举属性，在ES6中class内定义的方法是不可枚举的
}
```

> `for of`与`for in`遍历方法可以使用`break`或`continue`结束、中断循环

+ `forEach`：数组的方法，只能遍历数组，没有返回值。**不能中断循环**

```js
// 使用**数组**的forEach方法来遍历数组
const arr = ['zhangsan', 'lishi']
arr.forEach(item => {
  console.log(item) // zhangsan lishi
})

```

+ `map`：数组的方法，只能遍历数组，返回新的数组。**不能中断循环**

```js
// 使用**数组**的map方法来遍历数组
const arr = ['zhangsan', 'lishi']
const newArr = arr.map(item => {
  return 'hello ' + item
})
console.log(newArr)  // [ 'hello zhangsan', 'hello lishi' ]
```

> `forEach`和`map`方法由于是执行的回调函数，所以没办法正常终止循环。它们在方法体内没有直接操作数组的情况下不会改变当前数组。

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
变量提升通俗来说是在变量声明前就能调用，值为`undefined`

```js
// var 存在变量提升
console.log(name) // undefined
var name = 'zhangsan'

// let和const不会存在变量提升，更符合常理
console.log(age) // ReferenceError: age is not defined
let age = 2
```

**暂时性死区**：在代码块内，使用 `let`,`const` 命令声明变量之前，该变量都是不可用的(会抛出错误)。这在语法上，称为“暂时性死区”。有了暂时性死区也意味着`typeof`不再是一个百分百安全的操作。

```js
// 正常情况
console.log(typeof a) // 注意：并没有定义a变量，正常运行，打印值为 'undefined'

{
  // 使用let const
  console.log(typeof x) // 暂时性死区 ReferenceError: x is not defined
  let x
}
```
暂时性死区的本质就是，只要一进入当前作用域（`let`、`const`为块级作用域），所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。

## js中的`this`指向
参考首页链接文章

## 数组方法总结
**会改变原数组的方法**
+ `push`，向数组末尾添加一个元素
+ `reverse`，反转数组
+ `fill`
+ `copyWithin`
+ `sort` 根据给定的方式来排序数组
+ `pop` 移除并返回数组最后一个元素
+ `unshift` 将一个或多个元素添加到数组的开头
+ `shift` 移除并返回数组第一个元素

**不修改原数组**
+ `slice`
+ `map`
+ `forEach`
+ `every`
+ `filter`
+ `reduce`
+ `entries`
+ `find`
+ `findIndex`

## js中的闭包
在`js`中，由于函数作用域的特点，在函数外不能直接访问到函数里的变量，那如果想做到这一点就可以使用闭包来完成，如下
```js
const m1 = function func1() {
  const a = 10
}
console.log(a) // ReferenceError: a is not defined



const m2 = function func2() {
  const a = 10
  return function inner() { // 闭包函数
    return a
  }
}
const inner = m2()
console.log(inner()) // 10
```
> 产生闭包最简单的方式就是在函数内中创建另一个函数返回，如上面代码中的`inner`方法。  

`inner`方法的作用域链包含：
+ `inner`方法自己的作用域
+ `m2`方法的作用域，因此它能访问到`m2`中的变量
+ 全局作用域

### 闭包注意事项
> 在`js`中，如果一个对象不再被引用，那么这个对象就会被垃圾回收机制回收； 如果两个对象互相引用，而不再被第三者所引用，那么这两个互相引用的对象也会被回收。  

通常情况下，函数的作用域及其所有变量会在函数执行完后销毁，但是在创建了闭包之后，这个函数的作用域就会一直保存到闭包不存在为止，所以在使用闭包的时候一定要在用完或不再使用的时候将其销毁，否则产生过多的闭包占用内存会导致**内存泄漏**。

```js
const m2 = function func2() {
  const a = 10
  return function inner() { // 闭包函数
    return a
  }
}
let inner = m2()
inner = null // 此时没有变量再指向闭包，所以m2和闭包不久将都会被垃圾回收机制回收，释放内存。
```

具体讲解闭包文章:
+ https://juejin.im/post/5b081f8d6fb9a07a9b3664b6

## js中函数的`bind`、`call`、`apply`方法
> 在了解这3个方法前需要理解`js`中的`this`指向。

+ 其中`call`和`apply`方法使用方式相同，功能细微差别，都是在执行方法时改变方法体中的`this`指向。

```js
const func1 = function f1() {
  console.log(this.foo)
}

func1() // undefined 


// 使用call方法调用函数，并改变函数体中this为obj对象
const obj = {
  foo: 'haha'
}
const func2 = function f2() {
  console.log(this.foo) // 相当于 obj.foo
}
func2.call(obj) // haha
func2.apply(obj) // haha
```
它们的区别在于传递给函数参数方式
```js
const obj2 = {
  foo: 'xixi'
}
const func3 = function f3(name, age) {
  console.log(this.foo, name, age) 
}
// call 方法需要一一对应参数
func3.call(obj2, 'zhangsan', 17)  // 'xixi', 'zhangsan', 17
// apply会将第二个参数数组展开传递给func3方法
func3.apply(obj2, ['zhangsan', 17]) // 'xixi', 'zhangsan', 17
```
简单实现一个`call`方法
```js
// 这里为了测试，直接在Function.prototype上修改了call方法，这是错误的
Function.prototype.call = function(context, ...arg) {
  if(!context) {
    context = window ? window : global // 如果没有指定context，将会是window或node环境中的glogal
  }
  context.fn = this // 当前this为调用call方法的函数
  const res = context.fn(...arg)
  delete context.fn
  return res
}

const obj3 = {
  foo: 'lala'
}
const func4 = function f4(name) {
  console.log(this.foo, name)
}
func4.call(obj3, 'zhangsan') // lala zhangsan
```

+ `bind`方法和`call`/`apply`有个很大的区别是，后者会立即执行方法，而`bind`则是创建了一个改变了`this`指向的新的函数，之后的一序列参数将会在传递的实参前传入作为它的参数。

```js
const func5 = function f5() {
  console.log(this.foo)
}
const obj4 = {
  foo: 'oooo'
}

const newFunc5 = func5.bind(obj4)
newFunc5() // oooo
```

**`bind`函数实现**

基本功能，绑定`this`、添加默认参数
```js
// 这里为了测试，直接在Function.prototype上修改了bind方法，这是错误的
Function.prototype.bind = function (context, ...defaultArgs) {
  const fn = this
  return function (...args) {
    fn.call(context, ...defaultArgs, ...args)
  }
}

const obj5 = {name: 'zhangsan'}
const func6 = function(age, city) {
  console.log(this.name, age, city)
}
const func6Bind = func6.bind(obj5, 18)
func6Bind('wuhan') // zhangsan 18 wuhan
```

在`js`中，函数也可作为构造函数创建对象，所以这里还需要处理一下此种情况，保持它之前的原型链。

```js
// 这里为了测试，直接在Function.prototype上修改了bind方法，这是错误的
Function.prototype.bind = function (context, ...defaultArgs) {
  if (typeof this !== "function") {
    throw new TypeError("not a function");
  }
  const fn = this;
  const bound = function (...args) {
    if (this instanceof fn) {
      // new 操作
      context = this
    }
    return fn.call(context, ...defaultArgs, ...args);
  }
  // 保持原型链
  bound.prototype = fn.prototype;
  return bound;
}

const obj6 = {name: 'zhangsan'}
const func7 = function f7(age, city) {
  console.log(this.name, age, city)
}
const bindFunc7 = func7.bind(obj6, 20)
bindFunc7('wuhan') // zhangsan 20 wuhan
new bindFunc7() // undefined 20 undefined
```

## js中的`new`关键字

在`js`中，使用`new`关键字创建一个对象，发生了如下过程：
1. 创建一个空对象；
2. 这个新对象原型链接
3. 将构造函数的作用域赋值给新对象，即`this`的绑定
4. 如果函数没有返回其它对象则返回创建的新对象。

**`new`关键字简单实现**

```js
const myNew = function _new(func, ...args) {
  // 1. 创建一个对象
  const target = {}
  // 2. 原型链接
  target.__proto__ = func.prototype
  // 3. 绑定this给target赋值
  const res = func.call(target, ...args)
  // 4. 返回，注意 这里只做了一个简单的判断
  return res ? res : target
}
```

在网上很多讨论关于使用字面量创建对象还是`new`关键字创建对象，这里推荐使用字面量创建对象（`const obj = {}`），简单，高效！

## js中的执行环境和作用域
执行环境（环境）定义了变量或函数有权访问的其他数据，决定了它们各自的行为。每个执行环境都有一个与之关联的**变量对象**，环境中定义的所有变量和函数都保存在这个对象中，但我们在编写代码的过程中无法访问这个对象，只有解析器在处理数据时会在后台使用它。

```js
// 变量对象模拟
const f1 = function func1() {
  // 在这函数作用域中
  const a = 10
}
```