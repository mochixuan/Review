# 常见题总结

## JS
##### JS数据类型
> 1 Null 、2 undefined 、 3 boolean 、 4 Number 、5 String 、6 Symbol 、 7 Object

##### ES基本方法
- filter 过滤
- splice(index,howmany,item1,.....,itemX):从数组中添加/删除项目，然后返回被删除的项目index:从那个位置开始 howmany 删除的数量，item1...itemX添加什么。
- slice(start,end)可选，可为负，[1,2,3,4]slice(1,2)[2]end不包括该位置[start,end)。
- split(char,num): 分割字符串，char用匹配的单词num保留多少个对象，“abcdabcdabcd”split("cd",2) ["ab","ab"]
- substring(start,end) start开始位置end是结束位置的坐标但不包含结束位置。
- substr(star,num) num为取多少位
- reverse 倒叙
- join 合并
- shift 移除数组的第一个元素
- unshitf()向数组的第一个位置插入元素
- includes数组和字符串都可以是否包含该原属
- concat: 该方法不会改变现有的数组，而仅仅会返回被连接数组的一个副本。

##### new一个对象步骤
- 1. 创建一个新的空对象 
- 2. 设置新对象的contructor属性为构造函数的名称，设置新对象的__proto__属性指向构造函数的prototype对象。
- 3. 使用新对象调用函数，使函数中的this指向新对象。
- 4. 将初始化完毕的新对象地址，赋值给左边的对象。

``` js
function Person() {
	this.name = "mochixuan"
}
var person = {} // var person = new Object();
person.__proto__ = Person.prototype;
Person.call(obj) // {}.构造函数()
```

##### prototype、__proto__、constructor
- __proto__和constructor属性是对象所独有的
- prototype属性是函数所独有的
- 但是由于JS中函数也是一种对象，所以函数也拥有__proto__和constructor属性.

- 原型、实例、构造函数：每个构造函数(constructor)都有一个原型对象(prototype),原型对象都包含一个指向构造函数的指针,而实例(instance)都包含一个指向原型对象的内部指针。
- 原型链: 一个对象的原型层层递进直到寻找到Object的原型对象，这样的原型和实例所形成的链条叫做原型链。
- 第一种是使用 instanceof 操作符, 只要用这个操作符来测试实例(instance)与原型链中出现过的构造函数,结果就会返回true. 以下几行代码就说明了这点.

##### this 的指向和 call、apply、bind 
- this指向最后调用它的那个对象。
- 箭头函数的 this 始终指向函数定义时的 this，而非执行时（箭头函数中没有 this 绑定，必须通过查找作用域链来决定其值）
- apply() 方法调用一个函数, 其具有一个指定的this值，以及作为一个数组（或类似数组的对象）提供的参数。（指定的 this 值并不一定是该函数执行时真正的 this 值，如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动指向全局对象（浏览器中就是window对象））同时值为原始值（数字，字符串，布尔值）的 this 会指向该原始值的自动包装对象
- call: 
- apply、call差别：所以 apply 和 call 的区别是 call 方法接受的是若干个参数列表，而 apply 接收的是一个包含多个参数的数组。
- bind()方法创建一个新的函数, 当被调用时，将其this关键字设置为提供的值，在调用新函数时，在任何提供之前提供一个给定的参数序列。1. bind返回的函数被new调用作为构造函数则绑定会失效，this重新指向原函数。2.定义了绑定后函数的 length 属性和 name 属性（不可枚举属性）3. 绑定后函数的原型需指向原来的函数 。
- call、apply直接调用，bind需要在调用。bind是生成新的函数内部也用call进行this的指向的改变。call，apply可以去实现js继承关系。

##### JS异步
> JS是单线程，但浏览器内核可以多线程执行任务。浏览器一般会有三个线程javascript执行线程。GUI线程、事件触发线程。其他的异步任务是在浏览器的其他线程执行的，执行完成后会把结果返回js执行的任务队列的最后。

- promise: 正常执行异步操作，可以then、catch接收结果。
- genrator: redux-saga是使用这个，要自己实现执行器，返回iterator.
- async+awiat: 可以执行多个异步操作。自带执行器，可以try/catch。语法更加语意。await 后面可以是promise也可以是其他的类型的结果。返回结果是promise。
