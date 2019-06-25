/**
 * 深拷贝
 * 深拷贝其实就是对对象进行拷贝，{}、[]
 * 其他类型的数据只是简单function、null。直接赋值
 */

// JSON.stringify,JSON.parse

function deepCopy(data) {
    if (!data || typeof data !== 'object') return data; // null也是object

    const result = Array.isArray(data) ? [] : {};
    for (let key in data) {
        if (data.hasOwnProperty(key)) { //原型链上的可枚举属性，去除原型链上的数据
            if (typeof data === 'object') {
                result[key] = deepCopy(data[key]);
            } else {
                result[key] = data[key];
            }
        }
    }

    return result;
}

function Person() {
    this.name = "王旋";
}
Person.prototype.age = 18;
const person = new Person();
person.num = "360124";

const testData = {
    a: 1,
    b: 'wang',
    c: null,
    d: undefined,

    e: function (m) {
        return m;
    },
    f: [1,2,3,4],
    g: {
        a: 1,
        b: [5,6,7,8],
        e: {
            f: function (w) {
                return w+1;
            },
            m: [11,12,13,14]
        }
    },
    person: person
}
const testData1 = [
    testData
]

console.warn(typeof testData1 === 'object', Array.isArray(testData1))
const result = deepCopy(testData)
result.g.b = 10;
console.log('改前: '+testData,'改后: '+result)
