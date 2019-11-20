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

##### [Fiber](https://juejin.im/post/5a2276d5518825619a027f57)
> 改变了之前react的组件渲染机制，新的架构使原来同步渲染的组件现在可以异步化，可中途中断渲染，执行更高优先级的任务。释放浏览器主线程.

- 增量渲染（把渲染任务拆分成块，匀到多帧).
- 更新时能够暂停，终止，复用渲染任务.
- 给不同类型的更新赋予优先级.
- 并发方面新的基础能力.


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

##### [PureComponent](https://segmentfault.com/a/1190000014979065):
> 将会对state和props进行浅比较，基本的数据类型直接比较数值是否相等，对象、数组、函数则比较对象的引用。

##### FLatList 优化
>- 修改maxToRenderPerBatch={20}可以解决白屏: 一次绘制的最大数目。

- 继承virtualizedList的属性。
- 当某行滑出渲染区域之外后，其内部状态将不会保留。请确保你在行组件以外的地方保留了数据。
- 为了优化内存占用同时保持滑动的流畅，列表内容会在屏幕外异步绘制。这意味着如果用户滑动的速度超过渲染的速度，则会先看到空白的内容。这是为了优化不得不作出的妥协，你可以根据自己的需求调整相应的参数，而我们也在设法持续改进。

- 设置getItemLayout = (length: ,offset: ,index) ,减少测量，节约性能。
- keyExtractor: 设置唯一识别ID，防止数据错乱和频繁刷新。
- extraData: 当额外的数据更改时要刷新flatlist，添加在里面,因为Flatlist继承PureComponent。
- initialNumToRender: 指定一开始渲染的元素数量，最好刚刚够填满一个屏幕，这样保证了用最短的时间给用户呈现可见的内容。注意这第一批次渲染的元素不会在滑动过程中被卸载，这样是为了保证用户执行返回顶部的操作时，不需要重新渲染首批元素。

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
- 函数式组件：没有生命周期，便于管理，相同输入，相同的组件。

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

##### redux-sage
- 实现原理
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

##### setState后发生了什么？
- this.state.key = 1是可以的，只是不会更新render.
- 如果将this.state赋值给一个新的对象引用，那么其他不在对象上的state将不会被放入状态队列中，当下次调用setState()并对状态队列进行合并时，直接造成了state丢失。
- .直接传递对象的setstate会被合并成一次 ，使用函数传递state不会被合并


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

##### [React Hook](https://juejin.im/post/5d6383d0f265da03b638b919)
- useState: 
- useEffects:(异步执行) componentDidMount、componentDidUpdate 的组合体。放回清理函数可选，在卸载时调用。有两个参数，第一个参数可以返回一个函数，第二个参数是一个数组，但数组里的值发生改变时，第一个函数的返回函数回被调用，当为空时，每次都会调用，当为[]是则componentWillUnmount才会调用。
- useContext
- useReducer

##### 异常: 
- global.ErrorUtils
- Sentry

##### CodePush热更新
> 1. CodePush增量升级只针对图片资源。2. 服务程序在国外不稳定。

- staging、production
- mandatory: 强制更新。

##### 虚拟DOM,Diff。
>虚拟DOM是在render里面调用的。[过程](https://mp.weixin.qq.com/s?__biz=MzIzNzA0NzE5Mg==&mid=2247488043&amp;idx=1&amp;sn=33769353115fb505e2573337131d39f0&source=41#wechat_redirect)，调用了render不一定绘制。有时候props和state没有改变也会调用render。

> 虚拟DOM: 使用JS对象去构造一个类DOM结构的对象，在React中使用React Element对象去构造一个虚拟DOM，React中元素属性或者状态发生该改变。shouldComponentUpdata如果返回true,则会将改组件把该组件的状态生成一个React元素树，将该元素树和以前的进行对比，得出最新更新单元。最后就像布丁更新。
- 虚拟DOM的优点: 
	- 1. 用一种更简单的方式去绘制界面，开发者不需要知道怎么刷新的DOM,只需要更改组件状态就可以了。
	- 2. 性能方面: 网上一大堆文章说性能比原生操作DOM好，但是得看情况:1. 首次渲染时性能肯定是原生好，不需要虚拟DOM的计算和转换。再刷新时虚拟DOM其实最终还是要进行DOM操作，这个操作我们其实也是可以手动完成，当React帮我们完成了，而且效率还行，大大减少我们操作DOM的时间和误操作行，提高了我们的开发效率。
	- 3. React自己实现了采用了事件代理，批量更新会把最近几次的更新合并在一起进行更新。

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

##### [interface、type区别](https://blog.csdn.net/qq_37653449/article/details/85072598)
- type可以生命别名、联合类型 type a = string; type b = Person|Car;
- interface: 能够声明合并、可以继承
- 当两者皆可的时候，要优先使用 interface。所以在 tslint 改规则之前，就优先使用 interface 吧。

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

##### 项目难点

##### [高阶组件](https://juejin.im/post/59b36b416fb9a00a636a207e)
- 代码复用：这是高阶组件最基本的功能。组件是React中最小单元，两个相似度很高的组件通过将组件重复部分抽取出来，再通过高阶组件扩展，增删改props，可达到组件可复用的目的；
- 条件渲染：控制组件的渲染逻辑，常见case：鉴权；
- 生命周期捕获/劫持：借助父组件子组件生命周期规则捕获子组件的生命周期，常见case：打点。
- 对组件进行二次封装。

- 1. 不要修改原始组件 
- 2. props保持一致: 高阶组件在为子组件添加特性的同时，要保持子组件的原有的props不受影响。传入的组件和返回的组件在props上尽量保持一致。
- 属性代理（Props Proxy）：高阶组件操控传递给 WrappedComponent 的 props，
- 反向继承（Inheritance Inversion）：高阶组件继承（extends）WrappedComponent。
- https://www.jianshu.com/p/0aae7d4d9bc1。
- 推崇组合，不推荐继承. 

##### 写过什么好的插件没有

##### 和解：[reconciliation](https://www.reactjscn.com/docs/reconciliation.html)，diff算法得出最小修改

##### Redux中间健
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
- ReactActivityDelegate 核心处理。