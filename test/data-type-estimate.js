/**
 * 数据类型判断
 */


// 基本数据类型
const basic = () => {
  console.log(typeof undefined) // 'undefined'
  console.log(typeof true) // 'boolean'
  console.log(typeof 'zhangsan') // 'string'
  console.log(typeof 0) // 'number'
  console.log(typeof Symbol()) // 'symbol'

  console.log(typeof null) // 'object'
}
// basic()


// 复杂数据类型
const complex = () => {
  const arr = []
  console.log(arr instanceof Array) // true

  const obj = {}
  console.log(obj instanceof Object) // true

  const func = () => {}
  console.log(func instanceof Function) // true
}
// complex()

const func3 = () => {
  // Object.prototype.toString方法
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
}
// func3()

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


