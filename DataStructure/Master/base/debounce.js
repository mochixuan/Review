// 防抖:debounce(防的是最后一次: 进入页面、或者第一次: 网络请求、输入后网络请求)、节流:Throttle:鼠标移动
function debounce(func, wait,immediate) {
    let timeout;
    const debounced = function () {
        const thisArg = this;
        const args = [...arguments];

        if (timeout) {
            clearTimeout(timeout)
            timeout = undefined;
        }

        let result;
        if (immediate) {
            if (!timeout) result = func.apply(thisArg,args)
            timeout = setTimeout(function () {
                timeout = null;
            },wait)
        } else {
            timeout = setTimeout(function(){
                func.apply(thisArg,args)
            }, wait);
        }
        return result;
    }

    debounced.cancel = function () {
        if (timeout) {
            clearTimeout(timeout)
            timeout = undefined;
        }
    }

    return debounced
}

let i = 0;
let name = 'mo chi xuan'

function requestData(name) {
    console.warn('requestData',i,name)
}
let debounceRequest = debounce(requestData,120,true);
let testInterval = setInterval(()=>{
    i = i+1;
    console.log('setInterval',i)
    debounceRequest('xuan');
    if (i == 10) {
        clearInterval(testInterval)
    }
},100)


function testTable(target) {
    target.isEnable = true;
}

///@testTable
class TestTableClass {

}

console.log('decorator',TestTableClass.isEnable)

function throttle(fn, wait) {
    let timeout;
    let last = 0;
    function throttled() {
        const thisArg = this;
        const args = [...arguments];
        if (timeout != null) {
            clearTimeout(timeout);
            timeout = null;
        }
        const current = new Date().getTime();
        if ((current - last)/1000 >= wait) {
            last = new Date().getTime();
            fn(args);
        }
        timeout = setTimeout(()=>{
            last = new Date().getTime();
            fn(args);
        }, wait)
    }
    function cancel() {
        last = 0;
        clearTimeout(timeout);
        timeout = null;
    }
}