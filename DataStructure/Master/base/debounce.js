// 防抖、节流
function debounce(func, wait,immediate) {
    let timeout;
    const debounced = function () {
        const thisArg = this;
        const args = arguments;

        if (timeout) clearTimeout(timeout)

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
