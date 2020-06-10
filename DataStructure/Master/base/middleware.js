// 中间价编写
const defineWare = ({getState,dispatch}) => (next) => (action) => {
    return next(action);
}

compose(...applymiddleware(...defineWare)); // 中间价代码

applymiddleware = (middleWares) => {
    let store = {};
    middlewareAPI = {
        getState: store.getState, 
        dispatch: store.dispatch,
    }
    middleWares = middleWares.map((item) => item(middleWares));
    dispatch = compose(...middleWares)(store.dispatch)

    dispatch(action);
}

compose = (middleWares) => {
    // middlen(dispatch) 作为 middlen-1的参数，最后middle0(next) 
   middleWares = middleWares.reverse(); //取反
   let result;
   const next = (dispatch) => {
       result = dispatch;
       for (let i = 0; i < middleWares.length; i++) {
           result = middleWares[i](result);
       }
   }
   return next; // middleN(dispatch) n的next是dispatch. 返回的指作为(actio) => {} 作为middleN-1 0: next(action)
}