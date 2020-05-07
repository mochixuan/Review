Function.prototype.bind1 = function bind(thisArg) {
    if (typeof this !== 'function') throw new Error(`${this} must be a function`)
    const _self = this;
    const arg1 = Array.prototype.slice.call(thisArg, 1);
    function EmptyFC() {}
    function bound() {
        const arg2 = Array.prototype.slice.call(thisArg);
        const arg = arg1.concat(arg2);
        return _self.apply(this instanceof EmptyFC ? this : thisArg, arg)
    }
    EmptyFC.prototype = _self.prototype;
    bound.prototype = new EmptyFC();
    return bound;
}


let obj = {
    name: 'mochixuan'
}

function test(a,b) {
    console.log('test',this)
}
test.prototype.wx = 'wang xuan';
let bindFC = test.bind1(obj,[1,2,3])
bindFC(1,2)
const instance = new bindFC(1,2)

console.warn('bindFC.prototype', bindFC.prototype.wx);
console.warn('new bindFC.wx', bindFC.wx);

let obj1 = {
    name: 'mochixuan'
}
function test2(a,b){
    this.name = 1
    console.log('test2',this)
}

// call
Function.prototype.call1 = function () {
    let [thisArgs,...args] = [...arguments];
    thisArgs = thisArgs || window;
    const tempArg = Symbol('call1');
    thisArgs[tempArg] = this;
    let result;
    if (args == undefined) {
        result = thisArgs[tempArg]()
    } else {
        result = thisArgs[tempArg](...args)
    }
    delete thisArgs[tempArg]
    return result;
}

// apply
Function.prototype.apply1 = function (thisArgs,args) {
    thisArgs = thisArgs || window;
    const tempArg = Symbol('apply1');
    thisArgs[tempArg] = this;
    let result;
    if (args == undefined) {
        result = thisArgs[tempArg]()
    } else {
        result = thisArgs[tempArg](...args)
    }
    delete thisArgs[tempArg]
    return result;
}

let person1 = {
    name: 'mochixuan'
}
let person2 = {
    name: 'wang'
}

this.name = 'tianyaxue'

function personFC(a,b) {
    return this.name+" = "+a+b;
}

console.warn(personFC.call1(person1,1,2))
console.warn(personFC.apply1(person2,[1,2]))
console.warn(personFC.apply1())
