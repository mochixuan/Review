

Function.prototype.bind1 = function bind(thisArg) {
    if (typeof this !== 'function') return new TypeError(thisArg+"not function")
    // arguments 是个伪数组对象，没有slice
    let oldArgs = Array.prototype.slice.call(arguments,1);
    let self = this;
    let bound = function (args) {
        let newArgs = Array.prototype.slice.call(arguments)
        let allArgs = oldArgs.concat(newArgs);
        return self.apply(thisArg,allArgs)
    }
    return bound;
}

let obj = {
    name: 'mochixuan'
}

function test(a,b) {
    console.log('test',this)
}

let bindFC = test.bind1(obj)
bindFC(1,2)
const instance = new bindFC(1,2)

Function.prototype.bind2 = function (thisArg) {
    if (typeof this !== 'function') return new TypeError(this+'must be function')
    const arg1 = Array.prototype.slice.call(arguments,1);
    const self = this;
    const bound = function (args) {
        const arg2 = Array.prototype.slice.call(arguments);
        const allArgs = arg1.concat(arg2);
        if (this instanceof bound) {
            if (self.prototype) {
                function TempFC() {}
                TempFC.prototype = self.prototype;
                bound.prototype = new TempFC();
            }
            return self.apply(this,allArgs);
        } else {
            return self.apply(thisArg,allArgs);
        }

    }
    return bound;
}

let obj1 = {
    name: 'mochixuan'
}

function test2(a,b){
    console.log('test2',this)
}
let bind2FC = test2.bind2(obj1)
bind2FC(1,2)
const instance2 = new bind2FC(1,2)

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
