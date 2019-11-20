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

##### [prototype、__proto__、constructor](https://www.jianshu.com/p/dee9f8b14771)
- __proto__和constructor属性是对象所独有的
- prototype属性是函数所独有的
- 但是由于JS中函数也是一种对象，所以函数也拥有__proto__和constructor属性.

- 原型、实例、构造函数：每个构造函数(constructor)都有一个原型对象(prototype),原型对象都包含一个指向构造函数的指针,而实例(instance)都包含一个指向原型对象的内部指针。
- 原型链: 一个对象的原型层层递进直到寻找到Object的原型对象，这样的原型和实例所形成的链条叫做原型链。
- 第一种是使用 instanceof 操作符, 只要用这个操作符来测试实例(instance)与原型链中出现过的构造函数,结果就会返回true. 以下几行代码就说明了这点.

##### 原型和原型链
[链接1](https://blog.csdn.net/yucihent/article/details/79424506)

1. 当调用某种方法或查找某种属性时，首先会在自身调用和查找，如果自身并没有该属性或方法，则会去它的__ proto __属性中调用查找，也就是它构造函数的prototype中调用查找。
2. p.___proto__.__proto__.constructor得到拥有多个参数的Object()函数，Person.prototype的隐式原型的constructor指向Object()，即Person.prototype.__proto__.constructor == Object()。
3. 从p.__proto__.constructor返回的结果为构造函数本身得到Person.prototype.constructor == Person()所以p.___proto__.__proto__== Object.prototype
4. 原型链的缺点: 
	- 1. 当原型链中包含引用类型值的原型时,该引用类型值会被所有实例共享;
	- 2. 在创建子类型(例如创建Son的实例)时,不能向超类型(例如Father)的构造函数中传递参数;

![](https://img-blog.csdn.net/2018030222305858)

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

##### 事件轮训机制 Event-Loop
> js引擎存在monitoring process进程。

- 同步和异步任务分别进入不同的执行"场所"，同步的进入主线程，异步的进入Event Table并注册函数。
- 当指定的事情完成时，Event Table会将这个函数移入Event Queue。
- 主线程内的任务执行完毕为空，会去Event Queue读取对应的函数，进入主线程执行。
- 上述过程会不断重复，也就是常说的Event Loop(事件循环)

- 任务分配
	- macro-task(宏任务): script(整体代码)、setTimeout、setInterval、I/O、事件、postMessage、 MessageChannel、setImmediate (Node.js)。
	- micro-task(微任务): Promise.then、 MutaionObserver、process.nextTick (Node.js)。
	
- setTimeout和网络请求会交给浏览器的其他线程去完成，当完成的时候会把回调函数写到任务队列。

- 1.如果在微任务执行期间微任务队列加入了新的微任务，会将新的微任务加入队列尾部，之后也会被执行。
- 2.所有微任务总会在下一个宏任务之前全部执行完毕.
- 3.执行栈: 任务会被压入到栈里执行，一个线程一个栈。异步任务也是一样的会被压入异步站里执行。
- 4.同步任务（宏任务，微任务），异步任务。
- 5.Promise.resolve(async2())里的函数是同步函数。
- 6.Promise.then每一个then里的东西都是微任务，将会放在微任务队列的最后位置，优先级还是大于宏任务，会then1、then2、then3、then4、timeout0.

##### 让同步函数同步执行，异步函数异步执行
> (async () => f())();

##### 深拷贝

##### eval和JSON.parse
- 安全性: eval可以直接解析出数据有可能会出病毒
- JSON.parse:必须是正确的JSON格式
- 如果返回的字符串内容是一个数组，可以直接转化，如果返回的字符串内容是一个对象，必须在字符串的前后加上().

##### 为什么JS为单线程
> 我们都知道 JavaScript 是一门 单线程 语言，也就是说同一时间只能做一件事。这是因为 JavaScript 生来作为浏览器脚本语言，主要用来处理与用户的交互、网络以及操作 DOM。这就决定了它只能是单线程的，否则会带来很复杂的同步问题。例如一个删除一个修改，可能就崩溃了。

##### promise和async+await对比
- async/await: 
	- 1.内置执行器
	- 2.更好的语义
	- 3.返回值是 Promise
	- 4.更广的适用性(yield 命令后面只能是 Thunk 函数或 Promise对象。而 async 函数的 await 命令后面则可以是 Promise 或者 原始类型的值（Number，string，boolean，但这时等同于同步操作)。
	- **当async 函数中只要一个 await 出现 reject 状态，则后面的 await 都不会被执行例如: await Promise.reject('error'); 解决办法：可以添加 try/catch**；

- promise
	- pending、fulfilled、rejected. 
	
##### 回调地狱
> 函数作为参数层层嵌套

##### [TS](https://segmentfault.com/a/1190000010969537?utm_source=tag-newest)
- 最简单判断该用readonly还是const的方法是看要把它做为变量使用还是做为一个属性。 做为变量使用的话用const，若做为属性则使用readonly。interface里的属性非常适合。
- type 和 interface	
	- 都可以描述函数和对象
	- type 可以声明基本类型别名，联合类型，元组等类型
	- interface可以实现extends 、implement、合并。

##### [JS事件委托、捕获、冒泡](https://www.jianshu.com/p/d3e9b653fa95)
``` 
// 事件监听，第三个参数是布尔值，默认false，false是事件冒泡，true是事件捕获
document.getElementById('box3').addEventListener('click', sayBox3, false);
event.stopPropagation(); //实现停止冒泡
```

##### [GET和POST区别](https://mp.weixin.qq.com/s?__biz=MzI3NzIzMzg3Mw==&mid=100000054&idx=1&sn=71f6c214f3833d9ca20b9f7dcd9d33e4#rd)

##### [JS继承问题](https://juejin.im/post/5d259684e51d454d56535874) [第二个](https://www.jianshu.com/p/dee9f8b14771)

- [手写简易版](https://juejin.im/post/5d51e16d6fb9a06ae17d6bbc#heading-11)
- 原型链继承
	- 缺点: 每个实例对引用类型属性的修改都会被其他的实例共享
	- let b = Object.create(a)作用是b.__proto__=a.

```
Child.prototype = new Parent()
Child.prototype.constructor = Child
```

- 借用构造函数 Parent.call(this)
	- 优点: 解决了原型链数据共享问题。
	- 缺点: 原型链方法无法获取、每次都要初始化父类。
	
- 组合继承(原型链 + 借用构造函数)
	-  解决无法获取原型链方法问题。
	-  缺点: 需执行两次父类构造函数。
- 寄生式继承
	- 缺点: 同借用构造函数一样，无法复用父类函数，每次创建对象都会创建一遍方法. 

```
function createEnhanceObj(o) {
    //代替原型式继承的createObj
    var clone = Object.create(o)
    clone.getName = function () {
        console.log('arzh')
    }
    return clone;
}
``` 