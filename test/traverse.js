
// const arr = ['zhangsan', 'lishi']

// for(const value of arr) {
//   console.log(value) // zhangsan  lishi
// }

// const obj = {}
// for(const value of obj) {
//   console.log(value) // TypeError: obj is not iterable，普通对象没有具备Interator接口
// }


// 遍历数组索引
// const arr = ['zhangsan', 'lishi']
// for(const key in arr) {
//   console.log(key) // 0 1
// }

// // 遍历对象的key
// const obj = {
//   a: 1,
//   func() {

//   }
// }
// for(const key in obj) {
//   console.log(key) // a  func
// }

// class Student {
//   constructor(name) {
//     this.name = name
//   }
//   say() {}
// }
// const stu = new Student('zhangsan')
// for(const key in stu) {
//   console.log(key) // name  注意：for in只能遍历可枚举属性，在ES6中class内定义的方法是不可枚举的
// }


// 使用**数组**的forEach方法来遍历数组
const arr = ['zhangsan', 'lishi']
arr.forEach(item => {
  console.log(item) // zhangsan lishi
})

// 使用**数组**的map方法来遍历数组
const newArr = arr.map(item => {
  return 'hello ' + item
})
console.log(newArr)  // [ 'hello zhangsan', 'hello lishi' ]