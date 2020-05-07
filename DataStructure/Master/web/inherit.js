function Parent(name) {
    this.name = name;
}

Parent.prototype.say = function (name) {
    console.log(`parent say ${name}`)
}

function Child(name, age) { 
    Parent.call(this,name);
    this.age = age;
}

// 继承原型链，使用 Object.create 防止
// 1. Child.prototype = Parent.prototype 的原因是怕共享内存，修改父类原型对象就会影响子类, 修改子类的原型父类的原型也会被改变
// 2. new Parent() 的原因是会调用2次父类的构造方法（另一次是call），会存在一份多余的父类实例属性

Child.prototype = Object.create(Parent.prototype);
Child.prototype.say = function(name) {
    console.log(`child say ${name}`)
}
Child.prototype.constructor = Child;

const parent = new Parent('mo');
const child = new Child('xuan',20);

console.log('parent',parent.name);
parent.say(parent.name);
console.log('child',child.name);
child.say(child.name);
