
// const m1 = function func1() {
//   const a = 10
// }
// console.log(a) // ReferenceError: a is not defined



const m2 = function func2() {
  const a = 10
  return function inner() { // 闭包
    return a
  }
}
const inner = m2()
console.log(inner()) // 10