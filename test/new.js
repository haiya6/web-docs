

const myNew = function _new(func, ...args) {
  // 1. 创建一个对象
  const target = {}
  // 2. 原型链接
  target.__proto__ = func.prototype
  // 3. 绑定this
  const res = func.call(target, ...args)
  // 4. 返回，注意 这里只做了一个简单的判断
  return res ? res : target
}


function Person(name) {
  this.name = name
}
Person.prototype.say = function () {
  console.log('my name', this.name)
}

// const p = new Person('zhangsan')
// p.say()

const p2 = myNew(Person, 'zhangsan')
p2.say()

