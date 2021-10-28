const hasOwnProperty = Object.prototype.hasOwnProperty //该方法会忽略掉那些从原型链上继承到的属性
// 下面就是进行浅比较了, 有不了解的可以提issue, 到时可以写一篇对比的文章。
function is(x, y) {
    // === 严格判断适用于对象和原始类型。但是有个例外，就是NaN和正负0。
    if (x === y) {
        //这个是个例外，为了针对0的不同，譬如 -0 === 0 : true
        // (1 / x) === (1 / y)这个就比较有意思，可以区分正负0, 1 / 0 : Infinity, 1 / -0 : -Infinity
        return x !== 0 || y !== 0 || 1 / x === 1 / y
    } else {
        // 这个就是针对上面的NaN的情况: parseInt('abc')  // NaN
        return x !== x && y !== y
    }
}


function shallowEqual(objA, objB) {

    // Object.is()
    if (is(objA, objB)) {
        return true;
    }

    // null 也是对象 
    //下面这个就是，如果objA和objB其中有个不是对象或者有一个是null, 那就认为不相等。
    //不是对象，或者是null.我们可以根据上面的排除来猜想是哪些情况:
    //有个不是对象类型或者有个是null,那么我们就直接返回，认为他不同。其主要目的是为了确保两个都是对象，并且不是null。
    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
        return false
    } 

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    //这里只比较了对象A和B第一层是否相等，当对象过深时，无法返回正确结果
    // Test for A's keys different from B.
    for (var i = 0; i < keysA.length; i++) {
        if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }

    return true;
}

shallowEqual([1,2,3], [1,2,3])
