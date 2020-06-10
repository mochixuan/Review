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
     try {
       setTimeout(() => {
         // 直接执行
         const result = reject(this.reason);
         this.resolvePromise(
           promise22,
           result,
           onSuccessResolve,
           onErrorReject
         );
       }, 0);
     } catch (error) {
       reject(error);
     }
   }

   thenResolved(promise22, resolve, reject, onSuccessResolve, onErrorReject) {
     try {
       setTimeout(() => {
         // 直接执行
         const result = resolve(this.value);
         this.resolvePromise(
           promise22,
           result,
           onSuccessResolve,
           onErrorReject
         );
       }, 0);
     } catch (error) {
       reject(error);
     }
   }

   then(resolve, reject) {
     const promise22 = new Promise2((onSuccessResolve, onErrorReject) => {
       if (this.status === 'rejected') {
         this.thenRejected(promise22, reject, onSuccessResolve, onErrorReject);
       } else if (this.status === 'fulfilled') {
         this.thenResolved(
           promise22,
           resolve,
           reject,
           onSuccessResolve,
           onErrorReject
         );
       } else if (this.status === 'pendding') {
         this.onResolveCallBack.push(() => {
           this.thenResolved(
             promise22,
             resolve,
             reject,
             onSuccessResolve,
             onErrorReject
           );
         });
         this.onRejectCallBack.push(() => {
           this.thenRejected(
             promise22,
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
        return reject(new Error('不能返回自己，会找出无限循环引用'))
     }
     if (result != null && typeof result === 'function') {
        try {
            const nextThen = result.then;
            if (nextThen != null && typeof nextThen === 'function') {
                nextThen.call(result, (newResult) => {
                    this.resolvePromise(promise2, newResult, resolve, reject);
                }, (error) => {
                    reject(error);
                });
            } else {
                resolve(result);
            }
        } catch (error) {
            reject(error);
        }
     } else {
         resolve(result);
     }
   }

 }

 Promise2.resolve = function(val){
    return new Promise2((resolve, reject) => {
        resolve(val);
    });
}

Promise2.reject = function(val) {
    return new Promise2((resolve, reject) => {
        resolve(val);
    });
}

Promise2.all = function(promises) {
    return new Promise2((resolve, reject) => {
        let len = promises.length;
        let count = 0;
        let arr = []
        for (let i = 0; i < promises.length; i++) {
            let index = i;
            Promise2.resolve(promises)
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