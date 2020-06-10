# 常见题总结

## React-Native

##### 生命周期
- 生命周期前 Widget.defaultProps = {设置默认属性}。
- constructor(props)，构造函数,初始化state,访问props,tip: 编写构造函数必须要调用super,调用父类的构造函数，不调无法使用this,这是javascript的限制,反正在没有初始化时调用父类参数。如果不写props则在构造函数里无法使用this.props,无法初始化props，但在构造函数后，会把props传递给实例化后对象的props。
-  componentWillMount(肯) 组件挂载,可以修改state，做一些不消耗性能的操作。
- render 绘制。
- componentDidMount 第一次绘制结束。DOM已经构建完毕，RN是先调用子组件的componentDidMonunt再调用自己的。这时可以和子组件通信。
- componentWillReceviceProps(nextProps): 当属性props被改变时调用。这里可以监控一些props改变更新state。例如登入时。redux时这个状态也很重要。
- shouldComponetUpdate(nextProps,nextState); 返回一个bool是否跟新，这里可以做性能优化，减少一些不必要的重绘。
- componentWillUpdate(nextProps,nextState); 函数调用后新的状态和属性就会被更新上去。
- render: 重绘。
- componentDidUpdate(prevProps,prevState); 刷新结束
- componentWillUnmount(); 卸载阶段，移除监听，释放资源。

##### 新生命周期
>- React v16.3换了新的渲染机制，Fiber。以前渲染过程是同步的，一气呵成。当渲染组件过多，过于复杂时，会让JS线程处于长时间柱塞。让动画，用户操作变得卡顿。Fiber应该是可以中断组件的渲染，当有跟重要的事件要处理时，因为有些刷新可以晚一点刷新。
>- 删除了三个生命周期componentWillMount、componentWillUpdate、componentWillReceiveProps.16.x可以使用UNSAFE_,17后将会被移除。
>- 生命周期: defaultProps 挂载阶段: constructor、static getDerivedStateFromProps(nextprops,prevState) 、render、componentDidMount. 更新：getDerivedStateFromProps(nextProps,prevState)、shouldComponentUpdate(nextProps,nextState)、render、getSnapshotBeforeUpdate(prevProps,prevState)。componentDidUpdate。 componentWillUnmount

- static getDerivedStateFromProps(nextProps,prevState)必须要返回null。render之前会被调用返回的对象会被setState，由于是静态方法无法通过this.props获取props，可以把重要的信息props在state里存一份。
- getSnapshotBeforeUpdate(prevProps, prevState) 在render之后调用,而执行的时候DOM还没有更新。这时候可以返回一个参数给componentDidUpdate第三个参数传入.
- componentDidCatch(error,info) 不影响生命周期。如果render里出现异常，可以抓起组件异常

##### [规范](https://www.cnblogs.com/leftJS/p/11073481.html)

##### 动画
- Animated
	- createAnimatedComponent
	- View
	- Text
	- Image
	- ScrollView
	- setNativeProps
	
```
Animated.timing(this.state.animatedValue,{
	toValue: 1,   // 透明度最终变为1，即完全不透明
   duration: 10000,
   easing: 
}) //线性
Animated.decay //衰变效果，以一个初始的速度和一个衰减系数逐渐减慢变为0
Animated.spring //弹簧效果，提供了一个简单的弹簧物理模型.
//组合动画
parallel（同时执行）、
sequence（顺序执行）
delay /画延迟，在给定延迟后开始动画。
stagger//按照给定的延时间隔，顺序并行的启动动画。即在前一个动画开始之后，隔一段指定时间开始执行下一个动画，并不关心前一个动画是否已经完成，所以有可能会出现多个动画同时执行的情况。

interpolate({
	inputRange: [],
	outputrange: []// 可以为String,
})

useNativeDriver: true //只能使用非布局的属性，比如transform或者opacity
```

- LayoutAnimation
	- Android要设置UIManager.setLayoutAnimationEnabledExperimental

##### [RN事件传递](https://www.cnblogs.com/foxNike/p/11119204.html)

##### [PureComponent](https://segmentfault.com/a/1190000014979065):
> 将会对state和props进行浅比较，基本的数据类型直接比较数值是否相等，对象、数组、函数则比较对象的引用。

##### FLatList 优化

- 继承virtualizedList的属性。
- 当某行滑出渲染区域之外后，其内部状态将不会保留。请确保你在行组件以外的地方保留了数据。
- 为了优化内存占用同时保持滑动的流畅，列表内容会在屏幕外异步绘制。这意味着如果用户滑动的速度超过渲染的速度，则会先看到空白的内容。这是为了优化不得不作出的妥协，你可以根据自己的需求调整相应的参数，而我们也在设法持续改进。

- 设置getItemLayout = (length: ,offset: ,index) ,减少测量，节约性能。
- keyExtractor: 设置唯一识别ID，防止数据错乱和频繁刷新。
- extraData: 当额外的数据更改时要刷新flatlist，添加在里面,因为Flatlist继承PureComponent。

- initialNumToRender: 指定一开始渲染的元素数量，最好刚刚够填满一个屏幕，这样保证了用最短的时间给用户呈现可见的内容。注意这第一批次渲染的元素不会在滑动过程中被卸载，这样是为了保证用户执行返回顶部的操作时，不需要重新渲染首批元素, 属性默认为10.
- windowSize: 渲染区域高度，一般为 Viewport 的整数倍。这里我设置为 3，从 debug 指示条可以看出，它的高度是 Viewport 的 3 倍，上面扩展 1 个屏幕高度，下面扩展 1 个屏幕高度。在这个区域里的内容都会保存在内存里。
- 修改maxToRenderPerBatch={20}可以解决白屏: 一次绘制的最大数目。
- updateCellsBatchingPeriod: 具有较低渲染优先级的元素（比如那些离屏幕相当远的元素）的渲染批次之间的时间间隔。与 maxToRenderPerBatch 具有相同的目的，都是为了在渲染速率和响应性之间获得一个平衡。

##### bundle拆包：
	- 减少bundle过大的问题。
	- 实现按需加载，而不是一进入就全部加载bundle,将业务代码和三方库+工具库拆开，也方便维护。
	- 在进行热更新的时候减少diff/load比较和加载的效率。
- 原生+RN复杂界面可以实现预加载。 

##### 性能优化
- 首屏白屏: 加入广告页，主要是bundle.js解析和加载需要时间。
- 减少重绘: 
	- 尽量减少不必要的更新，合并更新，shouldComponentUpdate，有些更新频率不大的节目可以使用PureComponent减少不必要的重绘,当界面组件过多时，需要刷新一个组件的属性可以使用setNativeProps(不推荐)，直接修改Native，这样不会调用组件的生命期，减少dom的计算。
	- 在render里尽量不要去写函数，每次渲染都会重新生成函数浪费性能。
- 相应速度优化:
	- 当进入新界面时，或者进行动画，将一些复杂的，耗时的JS操作放在动画结束后或者界面绘制完成后去做，因为JS是单线程的，将重要的UI绘制放在前面完成，反正出现界面卡顿。InteractionManager. runAfterInteractions(()=>{})。
	- requestAnimationFrame:下一帧立刻执行。
	- 减少不必要的动画,使用LayoutAnimation来替代。
- FlatList优化。
- 图片优化。
- immutable: 结构共享、持久化数据。
- 函数式组件：没有生命周期，便于管理，相同输入，相同的组件

##### Redux
>- 全局的状态共享，全局的状态管理。reducers,store,
>- 三大原则: 单一的数据源(全局只有唯一的一个store)、state只能读唯一能改变state的只有action、用纯函数来控制修改保证可控。
- createStore(allReducers,initialState,middleware)
	- store API: subscribe(监听状态改变)、dispatch、getState(获取状态树)。
- reducer: combineReducers 
- mapStateToProps、MapDIspatchToProps。

##### [Redux原理](https://www.jb51.net/article/123418.htm)
- createStore(reducers,initialState,enhance: 高阶函数，常用中间件)生成一个全局的对象树(状态)，组件通过connect(mapStateToProps,mapDispatchProps)将对象树的状态和需要改变对象的方法dispactch注入到组件里，connect里的第一个返回一个对象，对象里如果有值将会监控state的对应值的改变，当发生改变时会通知component进行刷新。
- 为什么组件可以拿到state呢，最外层有个provider。实现是把store放在context中，这样组件可以通过this.context.store获取到上下文。
- connenct并不会改变它“连接”的组件，而是提供一个经过包裹的connect组件。 conenct接受4个参数，分别是mapStateToProps，mapDispatchToProps，mergeProps，options(使用时注意参数位置顺序).

```
class Provider extends Component {
  getChildContext() {
    return {
      store: this.props.store
    };
  }
  render() {
    return this.props.children;
  }
}

```

##### redux-sage: 管理 Redux 应用程序中的 副作用.
1. 首先他是中间价可以监控action,普获自己需要的type,使用store。初始化的时候有个run，启动监控take。
2. call: 可以理解 await + promise
3. fork: 直接 + promise
4. take: 实现yield后take+while可以实现多次监控。yield可以根据自己需求进行执行。
- [实现原理](https://juejin.im/post/59e083c8f265da43111f3a1f)
- [原理](https://www.yuque.com/lovesueee/blog/redux-saga)
- genearator *+yield
- all({...}) all([]) // 全部运行完成
- call(fu,obj) //阻塞: fun 即可以是一个 普通 函数，也可以是一个 Generator 函数。
- fork(fn,obj) // 不会柱塞，返回Task。使用cancle(task)
- put() //发生action
- select //获取状态树数据
- take(string or array) 柱塞返回action
- takeEvery() //连续相应 take+fork
- takeLatest() // 只运行最新的 take+fork+cancel
- takeLeading // take,call

##### React-Navigation
- react-native-gesture-handler
- createAppContainer
- createStackNavigator
- createBottomTabNavigator
- createMaterialTopTabNavigator
- createDrawerNavigator
- transitionConfig: ({ screenInterpolator: })
- onTransitionStart.
- onTransitionEnd.

##### UI布局和适配
- dimension、PixleRatio
- justifyContent: flex-start、flex-end、center、space-around、space-between
- alignItems: flex-start、flex-end、center,stretch,baseline
- alignSelf: flex-start、flex-end、center,stretch,baseline、auto
- flexDirection: row,column。
- flexWrap: wrap,nowrap

##### redux-devtools、react-addons-perf

##### React-Native 拆包
- 拆包工具: Facebook的metro、携程的moles-packer、google的diff-match-patch
- 将重复的代码或者是工具类和RN三方库打成基础包。
- 优点: 1. 解决jsbundle过大，初始化加载过慢。2.按需求进行加载，提高加载效率。3.提高热更新包diff/load.
- 打包命定
	- entry-file：即入口文件，打包时以该文件作为入口，一步步进行模块分析处理。
	- platform：用于区分打包什么平台的 bundle
	- dev：用于区分 bundle 使用环境，非 dev 时，会对代码进行 minified
	- bundle-output：打包产物输出地址，即打包好的 bundle 存放地址
	- sourcemap-output：打包时生成对应的 sourcemap 文件存放地址，在跟踪查找错误或崩溃时，能帮助开发快速定位到代码
	- assets-dest：bundle 中使用的静态资源文件存放地址
- createModuleIdFactory
- processModuleFilte
- AppRegistry.registerComponent(appName,() => component,)

##### [setState后发生了什么？](https://blog.csdn.net/u012031958/article/details/105380499/)
[事物](https://blog.csdn.net/handsomexiaominge/article/details/86183735)
- this.state.key = 1是可以的，只是不会更新render.
- 如果将this.state赋值给一个新的对象引用，那么其他不在对象上的state将不会被放入状态队列中，当下次调用setState()并对状态队列进行合并时，直接造成了state丢失。
- .直接传递对象的setstate会被合并成一次 ，使用函数传递state不会被合并, 不会设置批处理状态isBatchingUpdates=false,直接进行更新。


```
void setState(
  function(prevState,props)|object nextState,
  [function callback]
)
```
>- setState是异步的，将setState里的对象存入缓存队列，判断是否处于批更新阶段，如果是则将数据存入dirtyComponent中，如果不是则进入批处理更新，并设置为处于批处理更新阶段，后续的短时间内的setState会存入dirtyComponent后序进行批处理更新。

##### Refs

##### 高阶组件
> 高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧，高阶组件是参数为组件，返回值为新组件的函数。redux.


##### Hook
- [React Hook](https://juejin.im/post/5d6383d0f265da03b638b919)
- [Hook 所以基本方法](https://www.jianshu.com/p/6c43b440dab8)
- [全](https://github.com/wuyawei/fe-code/blob/master/react/%E6%B7%B1%E5%85%A5%20React%20hooks%20%20%E2%80%94%20%20useState.md)
- useState: 
- useEffects:(异步执行) componentDidMount、componentDidUpdate 的组合体。放回清理函数可选，在卸载时调用。有两个参数，第一个参数可以返回一个函数，第二个参数是一个数组，但数组里的值发生改变时，第一个函数的返回函数回被调用，当为空时，每次都会调用，当为[]是则componentWillUnmount才会调用。
-  [useLayoutEffect](https://www.cnblogs.com/sunidol/p/11301785.html)里面的callback函数会在DOM更新完成后立即执行,但是会在浏览器进行任何绘制之前运行完成,阻塞了浏览器的绘制。
- useContext
- useReducer
- useRef
- useCallBack
- useMemo

##### 高价组件、Hook、继承
- 如果一个函数 接受一个或多个函数作为参数或者返回一个函数 就可称之为 高阶函数。

>- 继承可以实现的高阶组件大多都可以实现(静态方法、ref).高阶组件更加清晰。实现操作props、state。hook函数式组件。

###### [高阶组件](https://juejin.im/post/5c72b97de51d4545c66f75d5)
1. 无状态是指包裹组件的参数是来自纯参数、有状态则是来自state、除参数外其他参数。
- 属性代理: 
	- 操作props. x继承无法实现
	- 抽离state做props. 做纯显示组件 x继承无法实现
	- 通过ref控制组件DOM属性。一般不用 x继承无法实现
	- 用其他元素包裹传入的组件。为组件添加不同的背景 可以实现
- 反向继承:
	- 操作state 也可以实现
	- 渲染劫持
- 缺陷:
	- 静态方法丢失，只扩展不删除 (hoist-non-react-statics可以拷贝)
	- refs 属性不能透传 React.forwardRef可以解决
	- 反向继承不能保证完整的子组件树被解析
- 实战
	- 权限控制
		- 那些界面需要显示，更具不同权限显示
		- 组件渲染性能追踪

###### Hook 1. [hook原理](https://segmentfault.com/a/1190000019966124) 2. [hook 优点](https://zhuanlan.zhihu.com/p/50953073) 3.[hook 原理](https://zhuanlan.zhihu.com/p/51356920) 4. [hook原理细节](https://zhuanlan.zhihu.com/p/88593858) 5.[源码](https://www.jianshu.com/p/fc31704ad0ee?from=timeline) 6. [源码](https://mp.weixin.qq.com/s/Err3W38ZMAX9Bm__SAI1jg)
> React Hooks通过一个数组和下标实现的，每次调用的时候从数组里读取state,setState函数，且数组游标向下移动，渲染的时候会将下标重制为0.

- 不要在循环，条件判断，函数嵌套中使用hooks
- 只能在函数组件中使用hooks
- 其中hooks队列中第一个节点的引用将存储在渲染完成的fiber对象的memoizedState属性中，这意味着hooks队列及其状态可以在外部被定位到：

继承和其他的缺点：

- 自定义Hook可以更加方便的复用逻辑。例如可以把播放器的逻辑全部抽离出来。(组件复用UI简单、复用逻辑比较难)。
- 解构清晰、不用层层嵌套、使用更加少，更容易阅读。
- 复杂的组件逻辑。很多的生命周期。hook把生命周期简化了
- this的指定，但我觉得没问题。
- 更容易拆分组件。
- 清除副作用更加紧凑。useEffect

缺点：

- 你需要去考虑hook的第二个参数，因为大多数更新和性能优化都喝它有关。
- 和传统的开发模式不一样。有一些解决问题的思路会有点不一样。
- 函数的运行是独立的，每个函数都有一份独立的作用域。函数的变量是保存在运行时的作用域里面，当我们有异步操作的时候，经常会碰到异步回调的变量引用是之前的，也就是旧的（这里也可以理解成闭包）。闭包的问题，内函数持有外函数的引用，当外函数重新创建时，内函数的变量还是一起外函数的变量。

##### 异常: 
- global.ErrorUtils
- Sentry

##### CodePush热更新
> 1. CodePush增量升级只针对图片资源。2. 服务程序在国外不稳定。

- staging、production
- mandatory: 强制更新。

1. code-push在首次热更的时候会全量下载为后面的资源增量热更做准备。这里注意的是它只是资源文件进行增量，bundle文件并不会，现今bundle文件越来越大的时候bundle文件增量也是一个不错的优化空间。

##### 虚拟DOM,Diff。
>虚拟DOM是在render里面调用的。[过程](https://mp.weixin.qq.com/s?__biz=MzIzNzA0NzE5Mg==&mid=2247488043&amp;idx=1&amp;sn=33769353115fb505e2573337131d39f0&source=41#wechat_redirect)，调用了render不一定绘制。有时候props和state没有改变也会调用render。

> 虚拟DOM: 使用JS对象去构造一个类DOM结构的对象，在React中使用React Element对象去构造一个虚拟DOM，React中元素属性或者状态发生该改变。shouldComponentUpdata如果返回true,则会将改组件把该组件的状态生成一个React元素树，将该元素树和以前的进行对比，得出最新更新单元。最后就像布丁更新。
- 虚拟DOM的优点: 
	- 1. 用一种更简单的方式去绘制界面，开发者不需要知道怎么刷新的DOM,只需要更改组件状态就可以了。
	- 2. 性能方面: 网上一大堆文章说性能比原生操作DOM好，但是得看情况:1. 首次渲染时性能肯定是原生好，不需要虚拟DOM的计算和转换。再刷新时虚拟DOM其实最终还是要进行DOM操作，这个操作我们其实也是可以手动完成，当React帮我们完成了，而且效率还行，大大减少我们操作DOM的时间和误操作行，提高了我们的开发效率。
	- 3. React自己实现了采用了事件代理，批量更新会把最近几次的更新合并在一起进行更新。

##### 虚拟DOM详情
1. 如何生成生成的虚拟DOM: 虚拟DOM是局部生成的，哪一块改变那一块生成虚拟DOM和对应块进行对比。
2. React.createElement是生成的是组件或者类为tag。不是render。
3. 当state改变时：判断shouldComponentUpdate是否要进行更新。如果需要调用render生成虚拟DOM，再进行diff算法进行对比，把差异批量更新到render上去。但调用render是进行diff生成虚拟DOM但如果没有改变其实是不会生成差异的，所以其实是不会操作dom进行刷新的。

##### 为什么每个文件都要引用React
> 每个文件都是一个单独模块，如果没有引入React,将JSX转换为js要调用React.createElement。

##### contructor(props)
- [contructor 1](https://www.cnblogs.com/faith3/p/9219446.html)
- [contructor 2](https://www.jianshu.com/p/8f6dd832e57a)

#### Text、阴影
- 居中问题
	- lineHeight // iOS
	- textAlignVertical // Android
- 底部对齐
	- Text里嵌套Text可以实现，再微调

##### 基本组件

##### [immutable](https://github.com/camsong/blog/issues/3)
>- 认真看清图: [怎么实现结构共享](https://segmentfault.com/a/1190000016404944)。
>- 简而言之，Immutable数据就是一旦创建，就不能更改的数据。每当对Immutable对象进行修改的时候，就会返回一个新的Immutable对象，以此来保证数据的不可变。没有被引用的对象会被垃圾回收。
>- 持久化数据结构
>- 结构共享(字典树)节约性能、共享相同的部分，大大提高性能。
>- 惰性操作: 用的时候再调。
>- 开销比较大,toJS很好性能。
>- 结构共享的核心思路是以空间换时间。树形结构实现数据共享：二叉树log2n,如果分支越多查询会越快，但占用的空间是比较大的2层32*32.
>- Javascript里对象可以拥有的key的最大数量一般不会超过2^32个
>- Immutable.js 在具体实现时肯定不会傻乎乎的占用这么大空间，它对树的高度和宽度都做了“压缩”.同时通过 Vector trie 和 Hash maps trie 压缩空间结构，使其深度最小，性能最优
>- Object.freeze可以实现属性不可变。
>- immutable对象直接可以转JSON.stringify(),不需要显式手动调用toJS()转原生。 

##### 写过什么好的插件没有

##### 和解：[reconciliation](https://www.reactjscn.com/docs/reconciliation.html)，diff算法得出最小修改

##### [Redux中间健](https://www.cnblogs.com/rock-roll/p/10763383.html)
中间件是先调用数组后面的中间件进行处理，类似于递归性。
applyMiddleware(...func)
compose(...func)

```

const store = createStore(reducers, initialState, compose([...applyMiddleware([中间件])]))

const log = ({getState,dispacth}) => (next) => (action) => {
	return next(action);
}

// applyMiddleware 使用柯里化获取三层参数: 可以生成新的函数进行传输
// compose 柯里化
dispatch = compose(...chain)(store.dispatch);

const last = middles[middles.length - 1];
const rest = middles.slice(0, -1);

第一个参数 ({getState, dispacth})
先进行middles.map((middle) => middle({getState,dispacth}));
第二个参数 next是一个函数嵌套式:
是倒叙执行的reduceRight先执行最好一个函数参数store.dispacth,每一次执行都会得到一个函数，函数的结果就是下一个函数的参数。只有next()才会向下执行。
第三个参数： (action)
compose后会返回一个dispacth，一层层中间件嵌套而成的函数。 

```

##### [深入浅出Object.defineProperty](https://www.jianshu.com/p/8fe1382ba135)
- 1. defineProperty 全为false还是可以通过点进行添加属性，只是不能删除而已，配合下面的就可以。
- 2. preventExtensions：防止添加新属性，依然可以通过defineProperty扩展。
- 3. seal：object.preventExtensions(...)并把所有现有属性标记为configurable:false。但可以改一起属性
- 4. freeze：属性不可再改。

##### [Mobx](https://zhuanlan.zhihu.com/p/25585910)
![Mobx过程](https://upload-images.jianshu.io/upload_images/445830-af18a09d9d65eb72.png)

- actions 是任一一段可以改变状态的代码。用户事件、后端数据推送、预定事件、等等。
- observable: 监听状态的变化
- reactions：更新UI

> 原理主要是更具使用的store的属性来定点更新。autoRun里一样。实现原理是Object.defineProperty都对象的属性进行监控get、set方法监控熟悉是否被改变。和那些组件调用了他

##### Redux和Mobx区别
- Redux采用的是订阅的形式,观察者模式。Mobx采用
- Redux更多的是遵循函数式编程（Functional Programming, FP）思想，而Mobx则更多从面相对象角度考虑问题.
- store是应用管理数据的地方，在Redux应用中，我们总是将所有共享的应用数据集中在一个大的store中，而Mobx则通常按模块将应用状态划分，在多个独立的store中管理.
- Redux默认以JavaScript原生对象形式存储数据，而Mobx使用可观察对象。
- 使用inject将特定store注入某组件，store可以传递状态或action；然后使用observer保证组件能响应store中的可观察对象（observable）变更，即store更新，组件视图响应式更新。



##### Redux-Sage
Sagas属于一个错误管理模式，也同时用于控制复杂事务的执行和回滚等。
当特定action被dispatch时,saga就可以被唤醒。

##### [WebSocket、即时通讯](https://www.zhihu.com/question/20215561)
- 特点:
	- 建立在 TCP 协议之上，服务器端的实现比较容易。
	- 握手阶段采用 HTTP 协议 
	- 数据格式比较轻量，性能开销小，通信高效, 不需重复连接和断开
	- 可以发送文本，也可以发送二进制数据
	- 没有同源限制，客户端可以与任意服务器通信
	- 协议标识符是ws（如果加密，则为wss），服务器网址就是 URL。
	- 相比于Http来说，它响应及时，消耗很小流量，不需要频繁的连接和请求头数据的平凡传输。

- 请求头多: 
	- Upgrade: websocket
	- Connection: Upgrade 
	- Sec-WebSocket-Key: 验证用的
	- Sec-WebSocket-Protocol: 是一个用户定义的字符串，用来区分同 URL 下，不同的服务所需要的协议
	- Sec-WebSocket-Version: websocket 协议版本版本号

##### Other
[requestIdleCallback](https://www.jianshu.com/p/2771cb695c81)

##### [小程序](https://www.zhihu.com/search?type=content&q=%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%8E%9F%E7%90%86)
##### [小程序](https://zhuanlan.zhihu.com/p/81775922)
##### [微信小程序原理](https://blog.csdn.net/xiangzhihong8/article/details/66521459)

##### React-Native通信、React-Native对比Flutter
- React-Native和Flutter实现原理不同，RN是通过JSCore解析Bundle，最后通过原生组件堆叠出来的。Flutter中组件是通过自己实现了一套，Flutter实现Surface和Canvas，通过Skia进行绘制。
- 都有类型虚拟DOM树。转化为RenderObject再次进行绘制。而最终组成RenderObject树。
- JS 是动态语言弱类型语言，而 Dart 是伪动态语言的强类型语言(类型推导)。
- Flutter样式和组件代码没有分离。
- Flutter状态的共效InheritedWidget。
- Flutter 的整体渲染脱离了原生层面，直接和 GPU 交互，导致了原生的控件无法直接插入其中。
- Flutter 原生控件的接入上是仍不如 React Native 稳定。
- 在 Android 中是 index.android.bunlde 文件，而在 IOS 下是 main.jsbundle。
- 直接与 CPU / GPU 交互的特性

##### 加载。

##### RN通信层和RN绘制流程

##### 原生组件
- RN绘制是ReactRootView绘制在Activity上调用setContentView(mRootView)。
- extends ReactPackage: 
	- List<NativeModule> createNativeModules(ReactApplicationContext)
	- List<ViewManager> createViewManagers(ReactApplicationContext)
	- NativeModule extends ReactContextBaseJavaModule @ReactMethod
	- ViewManager extends SimpleViewManager<T> @ReactProp
- callback 是异步的，不会立刻被执行。
- promise async+await
- NativeEventEmitter和原生进行通信。
- extends ReactActivity: getMainComponentName放回名字
- Android Application实现ReactNativeHost
- ReactActivityDelegate 核心处理。Update Readme

##### [原生组件通信、交互、实现ScrollView](https://www.jianshu.com/p/014acf7e9ef7)
> 实现通信 X implements ReactPackage 实现 createNativeModules(仅能进行通信 promise、callback)、createViewManagers(可以实现View也可进行通信)。

1. **createNativeModules**
	1. promise和callback区别: callback只能调用一次是异步的、callback可以回参数，但只能返回基本的参数callback.invoke(100, 100, 200, 200);promise类似于js中promise有三个状态，可以实现链式处理。
	2. 继承: ReactContextBaseJavaModule。
	3. 使用方式 @ReactMethod注解形式。
	4. 通信方式:
		
```js

JS调用Native方法
NativeModules.X.method(callback、promise、args)
JS监听Native
const NativeNotificationMoudule = new NativeEventEmitter(NativeModules.EventEmitterModule);
NativeNotificationMoudule.addListener("WZUmeng",(response)=>{  })

Native调用JS方法
mReactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName,data); 事件名+数据
Native回馈JS监听
callback、promise回调

```
		
2. **createViewManagers**
	1. JS如何传递属性给Naitve: props改变是 @ReactProps可以监控。
	2. Native如何传递数据给JS属性上
	3. 如何通过props调用Native方法
	4. 如何传递属性: 

``` js
View发送给JS
注册：将原生事件name映射到js事件name，类似于key-value。
getExportedCustomDirectEventTypeConstants: 
发送：数据给JS View
reactContext.getJSModule(RCTEventEmitter.class).receiveEvent( view.getId(),NATIVE_EVENT_ON_SCROLL ,map);
JS 端的props的方法onScroll等可以通过这个。 
  
View接收JS   
注册：JS发送到Native的方法
getCommandsMap  
接收：Native端接收的方法、ID为注册的ID       
receiveCommand

```
	

##### [Fiber](https://juejin.im/post/5a2276d5518825619a027f57) [Fiber1](https://zhuanlan.zhihu.com/p/57346388) [Fiber2](https://juejin.im/post/5dadc6045188255a270a0f85) [Fiber过程较好](https://blog.csdn.net/sinat_17775997/article/details/93774887)
> 改变了之前react的组件渲染机制，新的架构使原来同步渲染的组件现在可以异步化，可中途中断渲染，执行更高优先级的任务。释放浏览器主线程.

- 增量渲染（把渲染任务拆分成块，匀到多帧).
- 更新时能够暂停，终止，复用渲染任务.
- 给不同类型的更新赋予优先级.
- 并发方面新的基础能力.
- React 在 Reconciliation 过程中会构建一颗新的树(官方称为workInProgress tree，WIP树)，可以认为是一颗表示当前工作进度的树。还有一颗表示已渲染界面的旧树，React就是一边和旧树比对，一边构建WIP树的。 alternate 指向旧树的同等节点。

**重点**

1. 如何划分优先级：更具不同的任务划分不同的优先级。
2. 如何设置优先级：expirationTime设置到期时间，时间越短优先级越高。
3. 如何暂停任务：
4. Fiber结构：
5. 渲染有两个阶段：Reconciliation(协调阶段) 和 Commit(提交阶段).
6. 结构：

##### [Proxy](https://www.jianshu.com/p/77eaaf34e732)

##### 项目难点