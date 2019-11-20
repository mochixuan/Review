/**
 * 深拷贝
 * 深拷贝其实就是对对象进行拷贝，{}、[]
 * 其他类型的数据只是简单function、null。直接赋值
 */

// JSON.stringify,JSON.parse: 里面 new Date: 被立刻执行,RegExp，Function会为 空对象{}

// https://yq.aliyun.com/articles/610052?utm_content=m_1000006154

// Map: Map对象保存键值对，类似于数据结构字典；与传统上的对象只能用字符串当键不同，Map对象可以使用任意值当键
// WeakMap: 对象保存键值对，与Map不同的是其键必须是对象，因为键是弱引用，在键对象消失后自动释放内存.
function deepCopy(data,map = new WeakMap()) {
    if (!data || typeof data !== 'object') return data; // null也是object

    const result = Array.isArray(data) ? [] : {};

    if (map.has(data)) {
        return map.get(data);
    } else {
        map.set(data,result);
    }

    for (let key in data) {
        if (key != null && data.hasOwnProperty(key)) { //原型链上的可枚举属性，去除原型链上的数据
            if (typeof data === 'object') {
                result[key] = deepCopy(data[key],map);
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
    person: person,
    m: new Date()
}
testData.x = testData;

const testData1 = [
    testData
]

console.warn(typeof testData1 === 'object', Array.isArray(testData1))
const result = deepCopy(testData)
result.g.b = 10;
console.log('改前: ',testData,'改后: ',result)
