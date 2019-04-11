
// function Person(name) {
//   this.name = name
//   this.say = function() {}
// }
// const person = new Person('zhangsan')
// console.log(Object.keys(person)) // ['name', 'a']

// class Student {
//   constructor(name) {
//     this.name = name
//   }
//   say() {}
// }

// const stu = new Student()
// console.log(Object.keys(stu)) // ['name']


// const stu = new Student() // Student is not defined

// class Student {
//   constructor(name) {
//     this.name = name
//   }
//   say() {}
// }

// console.log(name) // undefined
// var name = 'zhangsan'

// console.log(age) // ReferenceError: age is not defined
// let age = 2

// console.log(typeof a) // 正常运行，值为 undefined

// {
//   console.log(typeof x) // 暂时性死区
//   let x
// }

const fun1 = function f() {
  const arr = []

  const inner = function innerFunc(item) {
    arr.push(item)
  }

  return inner
}