# 常见题总结

## Android
##### Serializable和Parcelable序列化对象
###### 序列化的目的：
> 在安卓中进程之间的数据传输只支持基本的数据类型，如果要传输复杂的对象，需要在一端进行序列化数据，另一端进行反序列化。序列化只对变量序列化不对对象做序列化。
##### Parcelable
> 实现Parcelable需要写四个方法，构造函数、writeToPacel(Parcel in,int flags)、describeContents()、static CREATOR .
##### Parcelable与Serializable的性能比较
> Oarcelable性能要优于Serializable。主要由于1.后者在序列化时会产生大量的临时数据，由于它使用的是反射机制进行序列化，会频繁的调用GC。而前者是使用IBinder，进程间通信。在读写时前者直接读写，后者是通过IO流的形式，它需要写到磁盘中，这也会造成内存性能消耗，但当数据需要进行磁盘序列化，只能用后者。

##### Activity
- onReStart->onStart
- onPauseA - onCreateB - onStartB - onResumeB - onStopA
- 横竖屏或异常时: (onPause、onSaveInstanceState随机的顺序) - onStop - onDestroy - onCreate - onStart - onRestoreInstanceState - onResume
- FLags三种选择: FLAG_ACTIVITY_NEW_TASK、FLAG_ACTIVITY_SINGLE_TOP、FLAG_ACTIVITY_CLEAR_TOP。
- 四种启动模式 *onNewIntent
- configChanges="orientation| screenSize". onConfigurationChanged

##### Service
> Service是Android中实现程序后台运行的解决方案，它非常适用于去执行那些不需要和用户交互而且还要求长期运行的任务。Service默认并不会运行在子线程中，它也不运行在一个独立的进程中，它同样执行在UI线程中，因此，不要在Service中执行耗时的操作，除非你在Service中创建了子线程来完成耗时操作

- HandlerThread: 管理线程Handler(mHandlerThread.getLooper())
- IntentService: 内部维护一个线程。
- 生命周期 onCreate(1次) - onStartCommand(n次、每次startService都会调用一次) - onDestroy
- onCreate - onBind - onUnbind - onDestroy
- 关闭服务: stopService() 、stopSelf()、应用管理里关闭服务、内存不足GC清理。
- BIND_AUTO_CREATE:这样就会在service不存在时创建一个。

##### BroadcastReceiver
> Binder机制
- 静态注册、动态注册
- 对于动态广播，有注册就必然得有注销，否则会导致内存泄露
- 广播的类型
- 1. 普通广播 2.有序广播 3. 粘性广播(API 21中已经失效) 4. 系统广播 5. App应用内广播(exported属性设置为false、增设相应权限permission)

##### ContentProvider
> 进程间 进行数据交互 & 共享(Binder机制)，开放自己的数据根据需求。

##### Fragment
- 生命周期 onAttach - onCreate - onCreateView - onActivityCreated - onStart - onResume - onPause - onStop - onDestroyView - onDestroy - onDettach

##### Android各个版本新特性
>- 5.0 MD
>- 6.0 安卓权限
>- 7.0 分屏、添加文件权限
>- 8.0 通知栏管理变更
>- 9.0 大刘海

##### Handler
> 非静态的匿名内部类(匿名内部类会隐式的继承一个类或者实现一个接口)会持有外部类的引用。

##### 事件分发
> [参考下图](https://blog.csdn.net/qq_30379689/article/details/53967177)

- dispatchTouchEvent 分发事件
- onInterceptTouchEvent 拦截事件只存在ViewGrounp
- onTouchEvent 出来触摸事件
> 当不重写或者调用super时事件从Activity的dispatchTouchEvent再到ViewGropA的的dispatchTouchEvent到onInterceptTouchEvent。再到View的dispatchTouchEvent，onTouchEvent再到ViewGropA的onTouchEvent再到Activity的onTouchEvent。

##### AsyncTask
- 维护了两个线程池：一个SerialExecutor负责用于任务的排队，THREAD_POOL_EXECUTOR用于任务的执行，InternalHandler将线程切回住线程.
- 三个参数1.传入的参数、进度类型、结果没有则可以写Void

##### IPC
- Intent: 一个进程启动另一个进程可以通过Bundle传输数据。
- 文件共享: SharedPreferences。
- Messenger: Messenger 是一种轻量级的 IPC 方案，它的底层实现是 AIDL ，可以在不同进程中传递 Message 对象，主要是通过创建Messager,通信时使用Binder服务。replyTo。串型，不适合大量并发处理。
- AIDL: 
- ContentProvider
- Socket

##### Android 动画
- 帧动画
- 属性动画
- 补间动画: translate、alpha、scale、rotate

##### 进程
- 前台进程
	- 处于正在与用户交互的activity
	- 正在执行oncreate（），onstart（），ondestroy方法的 service
	- 进程中包含正在执行onReceive（）方法的BroadcastReceiver
	- 调用了startForeground（）方法的service 
	- 与前台activity绑定的service
- 可视进程
	- 不在前台,但仍然可见的activity(调用了onpause但没调用onstop的activity)。
	- 可见activity绑定的service。
- 服务进程
	- 已经启动的service
- 后台进程
	- 不可见的activity（调用onstop（）之后的activity）
- 空进程
	- 任何没有活动的进程

##### Android软引用、弱引用
- SoftReference(软引用): 软引用-->当虚拟机内存不足时，将会回收它指向的对象(图片缓存)。
- WeakReference(弱引用): 随时可能会被垃圾回收器回收，不一定要等到虚拟机内存不足时才强制回收(Handler)。

##### Android 性能优化
- 布局优化
	- 减少布局嵌套(constraint布局)、能用简单的布局就用简单的布局，能用LinearLayout就不用RelativeLayout, RelativeLayout相对复杂。
	- ViewStub: ViewStub提供了按需加载的功能，当需要时才会将ViewStub中的布局加载到内存，提高了程序初始化效率.初始化ViewStub时，如果里面View为不可见不会进行初始化。
- 绘制优化:
	- 自定义View的onDraw不要做大量的操作，有些可以提前初始化的可以构造函数里初始化，例如不要创建局部对象，onDraw调用会特别频繁。
- 内存泄漏优化:
	- leakcanary
	- Android Lint:Lint 是 Android Studio 提供的 代码扫描分析工具，它可以帮助我们发现代码机构 / 质量问题，同时提供一些解决方案，检测内存泄露当然也不在话下，使用也是非常的简单.
	- 非静态类持有外部类的强引用。 
	- Java没有指针，全凭引用来和对象进行关联，通过引用来操作对象。如果一个对象没有与任何引用关联，那么这个对象也就不太可能被使用到了，回收器便是把这些“无任何引用的对象”作为目标，回收了它们占据的内存空间。
- 响应速度优化:
	- 避免在主线程中做耗时操作.
	- Activity如果5秒钟之内无法响应屏幕触摸事件或者键盘输入事件就会出现ANR，而BroadcastReceiver如果10秒钟之内还未执行完操作也会出现ANR。 
- ListView/RecycleView及Bitmap优化:
	-  ViewHolder: 避免了每次在调用getView的时候都去通过findViewById实例化数据。
	-  https://juejin.im/post/5a5d3d9b518825734216e1e8
- 线程优化:
- 其他性能优化的建议:
	- 不要过度使用枚举，枚举占用的内存空间要比整型大。
	- 尽量采用静态内部类，这样可以避免潜在的由于内部类而导致的内存泄漏。

##### Android 内存泄露
- 静态存储区（方法区）：主要存放静态数据、全局 static 数据和常量。这块内存在程序编译时就已经分配好，并且在程序整个运行期间都存在。
- 栈区 ：当方法被执行时，方法体内的局部变量都在栈上创建，并在方法执行结束时这些局部变量所持有的内存将会自动被释放。因为栈内存分配运算内置于处理器的指令集中，效率很高，但是分配的内存容量有限。
- 堆区 ： 又称动态内存分配，通常就是指在程序运行时直接 new 出来的内存。这部分内存在不使用时将会由 Java 垃圾回收器来负责回收。

##### 热修复
- Android的类加载器分为两种,PathClassLoader和DexClassLoader，两者都继承自BaseDexClassLoader。
	- PathClassLoader: 用来加载系统类和应用类。
	- DexClassLoader: 用来加载jar、apk、dex文件.加载jar、apk也是最终抽取里面的Dex文件进行加载。

##### RxJava: (链式编程)
- 转换操作符、组合操作符、功能操作符、过滤操作符、条件操作符。
- rxlifecycle: 生命周期管理。
- RxBinding: 防止抖动。
- RxAndroid 就是通过 Handler 来拿到主线程的。

```
private static final class MainHolder {
    static final Scheduler DEFAULT = new HandlerScheduler(new Handler(Looper.getMainLooper()));
    }

    private static final Scheduler MAIN_THREAD = RxAndroidPlugins.initMainThreadScheduler(
        new Callable<Scheduler>() {
            @Override public Scheduler call() throws Exception {
                return MainHolder.DEFAULT;
            }
        }
    );

    public static Scheduler mainThread() {
        return RxAndroidPlugins.onMainThreadScheduler(MAIN_THREAD);
    }

    public static Scheduler from(Looper looper) {
        if (looper == null) throw new NullPointerException("looper == null");
        return new HandlerScheduler(new Handler(looper));
    }
}
```

```
Observable.create(new ObservableOnSubcribe<T>(){
	subcribe(ObservableEmitter e) {
		
	}
}).doOnSubscribe(new Consumer<Disposable>() {
    @Override
    public void accept(Disposable disposable) throws Exception {
        
	}).subscribe(new Observer<T>(){
		onSubscibe(Disposable e)、onError、onComplete、onNext
	})
```
- doOnSubscribe: 的作用就是只有订阅时才会发送事件可以调用Disposable
- Just(T...): 创建一个被观察者，并发送事件，发送的事件不可以超过10个以上
- fromArray([]): 这个方法和 just() 类似，只不过 fromArray 可以传入多于10个的变量
- fromIterable(List): 遍历数据。
- defer延缓(): 直到被观察者被订阅后才会创建被观察者
- empty() ： 直接发送 onComplete() 事件
- never()：不发送任何事件
- error()：发送 onError() 事件
- map
- flatMap 
- concatMap有序的。
- switchMap: 当源Observable发射一个新的数据项时，如果旧数据项订阅还未完成，就取消旧订阅数据和停止监视那个数据项产生的Observable,开始监视新的数据项
- groupBy 通过key分组。scan、window
- throttleFirst取第一次。
- 组合: 
	- concat: 串行，一个执行完成后，执行另一个只能发生4个 concatArray大于四个，当一个发生错误时就会终止。
	- merge: 并行的,一起完成，只能4个，mergeArray大于4个，当一个发生错误时就会终止。
	- concatArrayDelayError、mergeArrayDelayError
	- zip:会将多个被观察者合并，根据各个被观察者发送事件的顺序一个个结合起来，最终发送的事件数量会与源 Observable 中最少事件的数量一样。
- Scheduler:
	- immediate: 直接在当前线程运行，相当于不指定线程。这是默认的 Scheduler.
	- newThread: 总是启用新线程，并在新线程执行操作.
	- io: I/O 操作（读写文件、读写数据库、网络信息交互等）所使用的 Scheduler。行为模式和 newThread() 差不多，区别在于 io() 的内部实现是是用一个无数量上限的线程池，可以重用空闲的线程，
            因此多数情况下 io() 比 newThread() 更有效率。不要把计算工作放在 io() 中，可以避免创建不必要的线程.
	- computation: 计算所使用的 Scheduler。用于循环，这个计算指的是 CPU 密集型计算，即不会被 I/O 等操作限制性能的操作，例如图形的计算。这个 Scheduler 使用的固定的线程池，大小为 CPU 核数。
            不要把 I/O 操作放在 computation() 中，否则 I/O 操作的等待时间会浪费 CPU
	- AndroidSchedulers.mainThread 
	- observeOn 可以调用多次
	- 背压: 一般情况下可以通过subscription.request(n)来请求。
	- BackpressureStrategy: 当事件大于128时例如(1000)
		- ERROR: 这种方式会在出现上下游流速不均衡的时候直接抛出一个异常,这个异常就是著名的MissingBackpressureException .
		- BUFFER: 它没有大小限制 .
		- DROP: 直接把存不下的事件丢弃.
		- LATEST: 只保留最新的事件 .

- 其他观察者模式:
	- Single、SingleObserver 
	- Completable、CompletableObserver
	- Maybe、MaybeObserver

##### 堆和栈
- 数据结构:
	- 堆: 是一个树形结构，是一个完全二叉树,是在程序运行时申请内存，而不是在申请
	- 栈: 运算受限的线性表，后进先出，在顶端进，顶端出。
	- 堆栈: 本身就是栈，换了个名称。
- Java和Android
	- 堆: 对象实例、方法内部变量(复杂类型)、动态变量
	- 栈: 静态变量、常量、对象的指针、方法内部变量(静态类型) 、基本数据类型。

##### RecyclerView的缓存机制
> 四级缓存，比ListView多两层缓存。缓存的东西也不一样，ListView缓存是View，而recyclerView缓存单位是ViewHolder。RecyclerView api更多，可以实现局部刷新。

- mAttachedScrap: List<ViewHolder>实现屏幕内的ItemView快速复用。在onLayout时被先移除children，在添加进来。滑动时的复用不是在这里。不需要调用onCreateViewHolder、onBindViewHolder.
	- mChangedScrap: 则是存储 notifXXX 方法时需要改变的 ViewHolder。 
- mCachedView: 当滑出屏幕的ItemView会被缓存到CachedView。
- mViewCacheExtension: 没有实现的，需要自己去实现，当在CachedView+RecyclerPool都没有时才会查找这个。一般都不写。
- mRecyclerPool: 是一个缓存池，默认缓存大小为5，这个是所以RecyclerView公用的。