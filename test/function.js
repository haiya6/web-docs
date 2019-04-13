
// const func1 = function f1() {
//   console.log(this.foo)
// }

// func1() // undefined


// const obj = {
//   foo: 'haha'
// }
// const func2 = function f2() {
//   console.log(this.foo)
// }
// func2.call(obj) // haha

// const obj2 = {
//   foo: 'xixi'
// }
// const func3 = function f3(name) {
//   console.log(this.foo, name)
// }
// func3.call(obj2, 'zhangsan') // 除第一个参数外，其他的参数都会传递给func3


// // 这里为了测试，直接在Function.prototype上修改了call方法
// Function.prototype.call = function(context, ...arg) {
//   if(!context) {
//     context = window ? window : global
//   }
//   context.fn = this
//   const res = context.fn(...arg)
//   delete context.fn
//   return res
// }

// const obj3 = {
//   foo: 'lala'
// }
// const func4 = function f4(name) {
//   console.log(this.foo, name)
// }
// func4.call(obj3, 'zhangsan') // lala zhangsan


// const func5 = function f5() {
//   console.log(this.foo)
// }
// const obj4 = {
//   foo: 'oooo'
// }

// const newFunc5 = func5.bind(obj4)
// newFunc5() // oooo

// Function.prototype.bind = function (context) {
//   if (typeof this !== "function") {
//     throw new TypeError("not a function");
//   }
//   let self = this;
//   let args = [...arguments].slice(1);
//   function Fn() { };
//   Fn.prototype = this.prototype;
//   let bound = function () {
//     let res = [...args, ...arguments]; //bind传递的参数和函数调用时传递的参数拼接
//     context = this instanceof Fn ? this : context || this;
//     return self.apply(context, res);
//   }
//   //原型链
//   bound.prototype = new Fn();
//   return bound;
// }

// var name = 'Jack';
// function person(age, job, gender) {
//   console.log(this.name, age, job, gender);
// }
// var Yve = { name: 'Yvette' };
// // let result = person.bind(Yve, 22, 'enginner')('female');
// const personBind = person.bind(Yve, 22, 'enginner')
// new personBind()

// Function.prototype.bind = function (context, ...defaultArgs) {
//   const fn = this
//   return function (...args) {
//     fn.call(context, ...defaultArgs, ...args)
//   }
// }

// const obj5 = {name: 'zhangsan'}
// const func6 = function(age, city) {
//   console.log(this.name, age, city)
// }
// const func6Bind = func6.bind(obj5, 18)
// func6Bind('wuhan') // zhangsan 18 wuhan


// function A() {

// }
// A.bind()

// A.prototype

// const fn = this
// let bound = function () {

// }
// bound.prototype = A.prototype


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
  //原型链
  bound.prototype = fn.prototype;
  return bound;
}

const obj6 = {name: 'zhangsan'}
const func7 = function f7(age, city) {
  console.log(this.name, age, city)
}
const bindFunc7 = func7.bind(obj6, 20)
bindFunc7('wuhan')
new bindFunc7()
