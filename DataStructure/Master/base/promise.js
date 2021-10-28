class Promise1 {

    constructor(executor) {
        this.state = 'pending'; // pending、fulfilled、rejected
        this.onResolveCallBack = [];
        this.onRejectCallBack = [];
        this.resolveResult = null;
        this.rejectResult = null;
        let resolve = (value) => {
            if (this.state === 'pending') {
                this.state = "fulfilled";
                this.resolveResult = value;
                this.onResolveCallBack.forEach((callback) => callback())
            }
        }
        let reject = (value) => {
            if (this.state === 'pending') {
                this.state = "rejected";
                this.rejectResult = value;
                this.onRejectCallBack.forEach((callback) => callback())
            }
        }
        executor(resolve,reject);
    } 

    // then里函数有三种情况，需要返回不同的Promise状态，且Promise一但生成不能改状态
    then = (onFulfilled,onRejected) => {
        const promise = new Promise((resolved,rejected) => {
            if (this.state === 'pending') {
                if (onFulfilled) {
                    this.onResolveCallBack.push(() => {
                        setTimeout(()=>{
                            let result = onFulfilled(this.resolveResult);
                            this.resolvePromise(promise,result,resolved,rejected)
                        },0)
                    });
                }
                if (onRejected) {
                    this.onRejectCallBack.push(() => {
                        setTimeout(()=>{
                            let result = onRejected(this.rejectResult);
                            this.resolvePromise(promise,result,resolved,rejected)
                        },0)
                    });
                }
            }else if (this.state === 'fulfilled') {
                if (onFulfilled) {
                    setTimeout(()=>{
                        let result = onFulfilled(this.resolveResult);
                        this.resolvePromise(promise,result,resolved,rejected)
                    },0)
                }
            } else if (this.state === "rejected") {
                if (onRejected) {
                    setTimeout(() => {
                        let result = onRejected(this.rejectResult);
                        this.resolvePromise(promise,result,resolved,rejected)
                    },0)
                }
            }
        });
        return promise;
    }

    resolvePromise = (promise,result,resolved,rejected) => {
        if (promise === result) return rejected(new TypeError(''))
        // result != null && ((result === 'object' && result.__proto__.constructor === Promise2) || typeof result === 'function') 
        if (result != null && (typeof result === 'object' || typeof result === 'function')) {
            let nextThen = result.then;
            if (nextThen != null && typeof nextThen === 'function') {
                nextThen.call(result,newResolve => {
                    this.resolvePromise(promise,newResolve,resolved,rejected)
                }, error => {
                    rejected(error);
                });
            } else {
                resolved(result);
            }
        } else {
            resolved(result);
        }
    }
}

/**
 * 为什么Promise每次返回一个新的Promise
 * 正常then里面可以有返回指也可以没有。一个Promise状态只能改变一次。
 * 假设fulfilled->resolve.可以then里面返回一个状态为reject的promise
 * 但如果返回this肯定不行，this的状态已经确定了
 * 
 * 为什么要返回Promise
 * 要实现链式模式
 * 
 * 返回值除了Promise对象，其他的都是直接resolve(result)
 */

 class Promise2 {
   constructor(executor) {
     this.status = 'pendding'; // pendding->fulfilled、pendding->rejected
     this.value = undefined;
     this.reason = undefined;
     this.onResolveCallBack = [];
     this.onRejectedCallBack = [];
     const resolve = (value) => this.penddingToFulfilled(value);
     const rejected = (reason) => this.penddingToRejected(reason);

     try {
       executor(resolve, rejected);
     } catch (error) {
       rejected(error);
     }
   }

   penddingToFulfilled(value) {
     if (this.status === 'pendding') {
       this.status = 'fulfilled';
       this.value = value;
       this.onResolveCallBack.forEach((fun) => fun(this.value));
     }
   }

   penddingToRejected(reason) {
     if (this.status === 'pendding') {
       this.status = 'rejected';
       this.reason = reason;
       this.onRejectedCallBack.forEach((fun) => fun(this.reason));
     }
   }

   thenRejected(promise22, reject, onSuccessResolve, onErrorReject) {
     
       setTimeout(() => {
         try {
          // 直接执行
          const result = reject(this.reason);
          this.resolvePromise(
            promise22,
            result,
            onSuccessResolve,
            onErrorReject
          );
         } catch (error) {
           onErrorReject(error);
         }
       }, 0);
     
   }

   thenResolved (promise22, resolve, onSuccessResolve, onErrorReject)  {
      setTimeout(() => {
        try {
          // 直接执行
          const result = resolve(this.value);
          this.resolvePromise(
            promise22,
            result,
            onSuccessResolve,
            onErrorReject
          );
        } catch (error) {
          onErrorReject(error);
        }
      }, 0);
   }

   then(resolve, reject) {
     let _self = this;
     const promise22 = new Promise2((onSuccessResolve, onErrorReject)=>{
      if (_self.status === 'rejected') {
         _self.thenRejected(
           this, // promise2
           reject, 
           onSuccessResolve, 
           onErrorReject
          );
       } else if (_self.status === 'fulfilled') {
         _self.thenResolved(
           this,
           resolve,
           onSuccessResolve,
           onErrorReject
         );
       } else if (_self.status === 'pendding') {
         _self.onResolveCallBack.push(() => {
           _self.thenResolved(
             this,
             resolve,
             onSuccessResolve,
             onErrorReject
           );
         });
         _self.onRejectedCallBack.push(() => {
           _self.thenRejected(
             this,
             reject,
             onSuccessResolve,
             onErrorReject
           );
         });
       }
     });
     return promise22;
   }

   catch(fun) {
     return this.then(null, fun);
   }

   resolvePromise(promise2, result, resolve, reject) {
     if (promise2 === result) {
        return reject(new Error('不能返回自己，会造成无限循环引用'))
     }
     try {
      if (result != null && typeof result === 'object' && result instanceof Promise2) {
          // const nextThen = result.then;
          // if (nextThen != null && typeof nextThen === 'object') {
          //     nextThen.call(result, (newResult) => {
          //         this.resolvePromise(promise2, newResult, resolve, reject);
          //     }, (error) => {
          //         reject(error);
          //     });
          // } else {
          //     resolve(result);
          // }
          result.then(resolve, reject);
      } else if (result != null && typeof result === 'function') {
        this.resolvePromise(promise2, result(), resolve, reject); // 函数处理
      } else {
        resolve(result);
      }
     } catch (error) {
       reject(error);
     }
   }

 }

 // promise.出的东西是重新new 出来的，你看都是Promise出的
 Promise2.resolve = function(val){
    return new Promise2((resolve, reject) => {
        resolve(val);
    });
}

Promise2.reject = function(val) {
    return new Promise2((resolve, reject) => {
        reject(val);
    });
}

Promise2.all = function(promises) {
    return new Promise2((resolve, reject) => {
        let len = promises.length;
        let count = 0;
        let arr = []
        for (let i = 0; i < promises.length; i++) {
            let index = i;
            Promise2.resolve(promises[i])
              .then((result)=>{
                count++;
                arr[index] = result;
                if (count === len) {
                  resolve(arr);
                }
              }).catch((error)=>{
                reject(error)
              })
        }
    });
}

Promise2.race = function(promises) {
  return new Promise2((resolve,reject)=>{
    promises.forEach((item)=>{
      item.then((result)=>{
        resolve(result)
      }).catch((error)=>{
        reject(error)
      })
      // 更简单的
      // item.then(resolve, reject);
    })
  })
}

Promise2.race = function(promises) {
    const results = [];
    let cursorIndex = 0;
    function proccessData(index, data, resolve){
        cursorIndex = cursorIndex + 1;
        results[cursorIndex] = data;
        if (cursorIndex === promises.length) {
            resolve(results);
        } 
    }
    return new Promise2((resolve, reject)=>{
        for(let i = 0 ; i < promises.length ; i++) {
            promises[i].then((result) => {
                proccessData(i, result, resolve);
                return result;
            }, reject)
        }
    })
}

new Promise((resolve,reject)=>{
  resolve('哈哈')
}).then((result)=>{
  console.log('result', result)
  throw new Error('你错了')
} ,(error) => {
  console.log('error', error)
}).then((result) => {
  console.log('result1', result)
}, (error) => {
  console.log('error1', error)
}).then((result) => {
  console.log('result2', result)
  return Promise.resolve().then(()=> 12345)
}, (error) => {
  console.log('error2', error)
}).then((result) => {
  console.log('result3', result)
}, (error) => {
  console.log('error3', error)
})

setTimeout(()=>{
  console.warn("===============")
  new Promise2((resolve, reject) => {
    resolve('哈哈')
  }).then((result) => {
    console.log('result', result)
    throw new Error('你错了')
  }, (error) => {
    console.log('error', error)
  }).then((result) => {
    console.log('result1', result)
  }, (error) => {
    console.log('error1', error)
  }).then((result) => {
    console.log('result2', result)
    return Promise2.resolve().then(() => 12345)
  }, (error) => {
    console.log('error2', error)
  }).then((result) => {
    console.log('result3', result)
  }, (error) => {
    console.log('error3', error)
  })
})

new Promise1((resolve, reject)=>{
  resolve(21)
}).then(()=>{
  console.log('====123')
  return new Promise1((resolve, reject) => {
    resolve(34)
  })
}).then(() => {
  console.log('====123')
  return function () {}
})