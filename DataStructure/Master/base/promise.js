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
