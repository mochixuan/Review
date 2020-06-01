# 常见题总结

## Android

##### Serializable和Parcelable序列化对象
> 把对象转换为字节序列的过程称为对象的序列化。
###### 序列化的目的：
> 在安卓中进程之间的数据传输只支持基本的数据类型，如果要传输复杂的对象，需要在一端进行序列化数据，另一端进行反序列化。序列化只对变量序列化不对对象做序列化。
##### Parcelable
> 实现Parcelable需要写四个方法，构造函数、writeToPacel(Parcel in,int flags)、describeContents()、static CREATOR .
##### Parcelable与Serializable的性能比较
> Oarcelable性能要优于Serializable。主要由于1.后者在序列化时会产生大量的临时数据，由于它使用的是反射机制进行序列化，会频繁的调用GC。而前者是使用IBinder，进程间通信。在读写时前者直接读写，后者是通过IO流的形式，它需要写到磁盘中，这也会造成内存性能消耗，但当数据需要进行磁盘序列化，只能用后者。1. 可以对性能进行提升。2. 多线程

##### [静态代理和动态代理](https://blog.csdn.net/weixin_39079048/article/details/98852947)
- 编译时就确定了被代理的类是哪一个，那么就可以直接使用静态代理；
- 运行时才确定被代理的类是哪个，那么可以使用类动态代理;

##### kotlin
- var 和 val的区别是val编译成java代码后会带上final修饰，final用来修饰属性、方法、类。被修饰的对象只能进行一次赋值，被修饰的类不能被继承。kotlin默认很多是final修饰的。如果一个类不允许其子类覆盖某个方法，则可以把这个方法声明为final方法。

##### IBinder和AIDL
1. 每一个进程都有一个虚拟地址空间。每个虚拟地址空间都包含了两块：一个用户空间，一个内核空间。用户空间是不能进行通信的，但内核空间可以。Binder便是通过内核空间进行通信的。
2. IBinder只需要一次拷贝
	1. 其他IPC需要 从用户空间copy到内核空间缓存区中，接收方开辟一段内存空间，然后通过系统调用将内核缓存区中的数据copy到接收方的内存缓存区。
	2. 用户空间的虚拟内存地址是映射到物理内存中的,对虚拟内存的读写实际上是对物理内存的读写，这个过程就是内存映射。

3. AIDL: IPC、多应用、多进程。Binder不能用于多进程
4. Short类型不支持。不支持的类型要实现Parcelabel。
5. AIDL步骤
	1. 首先服务端或者别的App的。创建一个AIDL文件。里面包括一些要实现的功能定义和参数定义（interface IBookManager）. 
	2. 之后编译一下生成一个IBookManager.java（class Stub extends android.os.Binder implements com.lvr.aidldemo.IBookManager）。
	3. 定义service里面的生成一个Binder，Binder为生成的.java的对象。例如IBookManager.stub(){}.serive返回的值为Ibinder为生成的对象。
	4. 把AIDL文件复制到客服端。客服端编译也会生成.java文件。客户端实现bindSerive.serive里有个mServiceConnection。mIBookManager = IBookManager.Stub.asInterface(binder)获取IBookManager可以使用了。
6. in、out、inout 所有的非基本参数都需要一个定向tag来指出数据流通的方式，不管是 in , out , 还是 inout 。基本参数的定向tag默认是并且只能是 in。
	1. in 客户端流向服务端.服务端修改了数据后不会改变客户端的数据。但是客户端的那个对象不会因为服务端对传参的修改而发生变动。
	2. out 的话表现为服务端将会接收到那个对象的的空对象，但是在服务端对接收到的空对象有任何修改之后客户端将会同步变动。
	3. inout 为定向 tag 的情况下，服务端将会接收到客户端传来对象的完整信息，并且客户端将会同步服务端对该对象的任何变动。

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
- IntentService: 内部维护一个线程。其他方法和Service，不需要手动停止stopSelf，当任务完成后自动停止服务。每个耗时操作都会放到一个任务队列里，执行时从里面取出来。原理是:通过HanderThread+Handler实现线程切换在onCreate生成的，然后在onStartCommand里通过Hander将Intent发生到Handler里的消息队列里，优先级高于Service当处于后台时。复写onHandleIntent。
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

##### Android各个版本新特性、适配
- 适配

>- 5.0 MD
>- 6.0 安卓权限
>- 7.0 分屏、添加文件权限
>- 8.0 通知栏管理变更
	- 权限限制
	- 安装包限制
	- 通知渠道
	- 限制隐式广播的接收
	- 悬浮窗
>- 9.0 大刘海: 适配非常重要
	- http请求配置。
	- 去除httpclient
	- 限制非 SDK 接口的调用.
	- 前台服务权限
>- 10.0 存储范围变更:
	- 类似于沙盒

##### Handler
- 非静态的匿名内部类(匿名内部类会隐式的继承一个类或者实现一个接口)会持有外部类的引用。
- 内部类默认会持有外部类的引用，也就是handler持有activity的引用而Message持有handler引用。
- Looper.myLooper()获取了当前线程保存的Looper实例
- msg.target.dispatchMessage(msg);
- msg.recycle()回收资源
- dispatchMessage会调用：mCallback.handleMessage(msg)

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
- 卡顿检查: BlockCanary

##### 热修复
- Android的类加载器分为两种,PathClassLoader和DexClassLoader，两者都继承自BaseDexClassLoader。
	- PathClassLoader: 用来加载系统类和应用类。
	- DexClassLoader: 用来加载jar、apk、dex文件.加载jar、apk也是最终抽取里面的Dex文件进行加载。

##### 堆和栈
- 数据结构:
	- 堆: 是一个树形结构，是一个完全二叉树,是在程序运行时申请内存，而不是在申请
	- 栈: 运算受限的线性表，后进先出，在顶端进，顶端出。
	- 堆栈: 本身就是栈，换了个名称。
- Java和Android
	- 堆: 对象实例、方法内部变量(复杂类型)、动态变量
	- 栈: 静态变量、常量、对象的指针、方法内部变量(静态类型) 、基本数据类型。

##### [RecyclerView的缓存机制](https://juejin.im/post/5a5d3d9b518825734216e1e8)
> 四级缓存，比ListView多两层缓存。缓存的东西也不一样，ListView缓存是View，而recyclerView缓存单位是ViewHolder。RecyclerView api更多，可以实现局部刷新。

- mAttachedScrap: List<ViewHolder>实现屏幕内的ItemView快速复用。在onLayout时被先移除children，在添加进来。滑动时的复用不是在这里。不需要调用onCreateViewHolder、onBindViewHolder.具有两次 onLayout() 过程，第二次 onLayout() 中直接使用第一次 onLayout() 缓存的 View，而不必再创建。
	- mChangedScrap: 则是存储 notifXXX 方法时需要改变的 ViewHolder。 
- mCachedView: 当滑出屏幕的ItemView会被缓存到CachedView。
- mViewCacheExtension: 没有实现的，需要自己去实现，当在CachedView+RecyclerPool都没有时才会查找这个。一般都不写。
- mRecyclerPool: 是一个缓存池，默认缓存大小为5，这个是所以RecyclerView公用的。

##### 进程和线程
- 进程: 是系统进行资源分配的独立单元，让多个程序同时运行。正在运行程序的抽象。
- 线程: 程序执行的基本单元。
- 每个进程都有独立的地址空间。在进程内创建和停止线程，线程间可以进行通信，进程间则需要实现进程通信的方法(AIDL、文件、Messager、ContentProvider、Socket)

##### [Handler、Message](https://blog.csdn.net/lmj623565791/article/details/38377229)

##### [线程池](https://blog.csdn.net/weixin_36244867/article/details/72832632)

- FixedThreadPool: 通过Executors的newFixedThreadPool()方法创建，它是个线程数量固定的线程池，该线程池的线程全部为核心线程，它们没有超时机制且排队任务队列无限制，因为全都是核心线程，所以响应较快，且不用担心线程会被回收.
- CachedThreadPool: 通过Executors的newCachedThreadPool()方法来创建，它是一个数量无限多的线程池，它所有的线程都是非核心线程，当有新任务来时如果没有空闲的线程则直接创建新的线程不会去排队而直接执行，并且超时时间都是60s，所以此线程池适合执行大量耗时小的任务。由于设置了超时时间为60s，所以当线程空闲一定时间时就会被系统回收，所以理论上该线程池不会有占用系统资源的无用线程.
- ScheduledThreadPool: 通过Executors的newScheduledThreadPool()方法来创建，ScheduledThreadPool线程池像是上两种的合体，它有数量固定的核心线程，且有数量无限多的非核心线程，但是它的非核心线程超时时间是0s，所以非核心线程一旦空闲立马就会被回收。这类线程池适合用于执行定时任务和固定周期的重复任务。
- SingleThreadExecutor: 通过Executors的newSingleThreadExecutor()方法来创建，它内部只有一个核心线程，它确保所有任务进来都要排队按顺序执行。它的意义在于，统一所有的外界任务到同一线程中，让调用者可以忽略线程同步问题。
- shutDown()，关闭线程池，需要执行完已提交的任务；
- shutDownNow()，关闭线程池，并尝试结束已提交的任务；
- allowCoreThreadTimeOut(boolen)，允许核心线程闲置超时回收；
- execute()，提交任务无返回值；
- submit()，提交任务有返回值；

##### [LeakCanary](https://blog.csdn.net/xiaohanluo/article/details/78196755)

##### [BlockCanary](https://www.jianshu.com/p/e58992439793)

##### [绘制](https://lrh1993.gitbooks.io/android_interview_guide/content/android/basis/decorview.html) [自定义View](https://lrh1993.gitbooks.io/android_interview_guide/content/android/basis/custom_view.html)
> View绘制从上而下，Activity->PhoneWindow->DecorView->ViewGround->View

- 绘制流程
	- 1. 测量: measure根据父布局的尺寸以及自己想要的尺寸得到最终自己的尺寸.
		- setMeasuredDimension(width,height)
		- MeasureSpec: 高两位表示模式、低30位表示大小 
		- Mode: LayoutParams(当子View的LayoutParams的布局格式是wrap_content，可以看到子View的大小是父View的剩余尺寸，和设置成match_parent时，子View的大小没有区别。为了显示区别，一般在自定义View时，需要重写onMeasure方法，处理wrap_content时的情况，进行特别指定。)
			- UNSPECIFIED: 不对View进行任何限制，要多大给多大，一般用于系统内部.
			- EXACTLY: match_parent、确定大小。
			- AT_MOST: View的大小不能大于父容器的大小.wrap_content.
	- 2. 布局: ayout用于确定子View的位置.
	- 3. 绘制: draw负责绘制自己. 
		- FontMetircs 高度 top ascent baseline descent bottom 
		- drawText(text, 200, 100, paint) 左下角 
		- getFontSpacing两个baseline距离
		- 在 Android 里，硬件加速专指把 View 中绘制的计算工作交给 GPU 来处理。
		- 绘制的计算工作由 CPU 转交给了 GPU
		
	- Mode
- 刷新方法: 
	- invalidate
	- postInvalidate
	- View执行requestLayout方法，会向上递归到顶级父View中，再执行这个顶级父View的requestLayout，所以其他View的onMeasure，onLayout也可能会被调用。

##### [Android 堆栈，小程序](https://blog.csdn.net/cadi2011/article/details/82754415)
> 小程序被杀死后内存会被回收。

##### Android GC回收机制

##### [垃圾回收机制1](https://juejin.im/post/5ce50acdf265da1bb0039583#heading-20)
##### [垃圾回收机制2](https://juejin.im/post/5b17a5475188257d6225a7a2)
- 标记清除
- 复制
- 标记整理
- 分代收集

##### 垃圾回收器如何回收
- 引用计数法
- 可达性分析算法
- 判断对象是否存活与“引用”有关

##### [JVM虚拟机和dalvik/art 虚拟机区别](https://juejin.im/post/59b7fa8cf265da066d3323bb)
- 执行的文件不同，一个是class，一个是dex。
- Dalvik是基于寄存器(寄存器是有限存贮容量的高速存贮部件，它们可用来暂存指令、数据和地址,在它们编译的时候，花费的时间更短,65536个可用的寄存器中)的，而JVM是基于栈的(一个线程一个栈，存放方法、对象的地址、常量)。
- Dalvik适合内存和处理器速度有限的系统。
- Java运行的环境和Java的容器。
- JVM需要的资源和系统性能的消耗远远大于Dalivk虚拟机.
- dex文件除了减少整体的文件尺寸和I/O操作次数，也提高了类的查找速度,代码密度小，运行效率高，节省资源。
- aapt即Android Asset Packaging Tool。
- GC回收时会挂起所以线程，串行的。dalvik这么做的好处是，当pause了之后，GC势必是相当快速的。但是如果出现GC频繁并且内存吃紧势必会导致UI卡顿、掉帧、操作不流畅等。

##### JVM
- 栈(stack)：是简单的数据结构，但在计算机中使用广泛。栈最显著的特征是：LIFO(Last In, First Out, 后进先出)。比如我们往箱子里面放衣服，先放入的在最下方，只有拿出后来放入的才能拿到下方的衣服。栈中只存放基本类型和对象的引用(不是对象)。
- 堆(heap)：堆内存用于存放由new创建的对象和数组。在堆中分配的内存，由java虚拟机自动垃圾回收器来管理。JVM只有一个堆区(heap)被所有线程共享，堆中不存放基本类型和对象引用，只存放对象本身。
- 方法区(method): 又叫静态区，跟堆一样，被所有的线程共享。方法区包含所有的class和static变量(1.7方法区、1.8常量池)。

##### [Dalvik VM(7.0回归) 与 ART(4.4 混合、5.0-6.0) 的不同](https://juejin.im/post/5c232907f265da61662482b4#comment)
- DVM使用JIT来将字节码转换成机器码，效率低。
- ART采用了AOT预编译技术，执行速度更快。
- ART会占用更多的应用安装时间和存储空间。

##### [Dalvik](https://www.csdn.net/gather_26/MtTagg5sMDA1NC1ibG9n.html)
> 主要负责完成: 对象生命周期管理、堆栈管理、线程管理、安全和异常管理，以及垃圾回收等

##### [Android Hook](https://blog.csdn.net/gdutxiaoxu/article/details/81459830)
> Hook 又叫“钩子”，它可以在事件传送的过程中截获并监控事件的传输，将自身的代码与系统方法进行融入。这样当这些方法被调用时，也就可以执行我们自己的代码，这也是面向切面编程的思想（AOP）。

##### [Android 内存模型](https://www.jianshu.com/p/76959115d486)
- 静态存储区（方法区）：主要存放静态数据、全局 static 数据和常量。这块内存在程序编译时就已经分配好，并且在程序整个运行期间都存在。
- 栈区 ：当方法被执行时，方法体内的局部变量都在栈上创建，并在方法执行结束时这些局部变量所持有的内存将会自动被释放。因为栈内存分配运算内置于处理器的指令集中，效率很高，但是分配的内存容量有限。
- 堆区 ： 又称动态内存分配，通常就是指在程序运行时直接 new 出来的内存。这部分内存在不使用时将会由 Java 垃圾回收器来负责回收。
- Java内存模型（Java Memory Model ,JMM）就是一种符合内存模型规范的，屏蔽了各种硬件和操作系统的访问差异的，保证了Java程序在各种平台下对内存的访问都能保证效果一致的机制及规范。

##### Glide
- with: Glide监控生命周期是通过向对象(Activity、Fragment)里添加一个隐藏的Fragment去监控生命周期，用于在Activity被摧毁时进行销毁。
- 非主线程当中使用的Glide，那么不管你是传入的Activity还是Fragment，都会被强制当成Application来处理。
- load: DrawableRequestBuilder里面有很多方法。
- into: 进行配置
- 网络请求: Downsampler进行下载的(HttpUrlConnection)
- 判断是否是GIF: 流中读取2个字节的数据，来判断这张图是GIF图还是普通的静图。
- 内存缓存的主要作用是防止应用重复将图片数据读取到内存当中，而硬盘缓存的主要作用是防止应用重复从网络或其他地方重复下载和读取数据。
- 内存缓冲: 正在使用中的图片使用弱引用来进行缓存，不在使用中的图片使用LruCache来进行缓存的功能。
- 当内存不足的时候，Activity、Fragment会调用onLowMemory方法，可以在这个方法里去清除缓存，Glide使用的就是这一种方式来防止OOM。
- 两个缓存都是LruCache。不使用原生的，使用的是LinkedHashMap实现的。
- RGB_565每像素大小4. ARGB_8888每像素2。
-  Glide内存开销是Picasso的一半，就是因为默认Bitmap格式不同。
-  8.0 Bitmap存储在native里不会出现OOM。
-  文中开头列出 Fresco 的优点是：“在5.0以下(最低2.3)系统，Fresco将图片放到一个特别的内存区域(Ashmem区)” 这个Ashmem区是一块匿名共享内存，Fresco 将Bitmap像素放到共享内存去了，共享内存是属于native堆内存。Fresco 使用匿名共享内存来保存Bitmap数据。

##### 图片缓冲机制大致步骤
> 三级缓冲: 磁盘缓存、内存缓存、网络缓存
1. 磁盘缓存就是存在内存卡里、内存缓存就是应用运行内存、网络缓存就是网络请求。
2. 首先会判断是否在内存中缓存，没有再去查找磁盘是否缓存，再没有就网络请求。
3. 网络缓存: 先进行网络下载，把图片下载到本地，再对图片进行压缩和裁切，把裁切后的图片加入缓存和显示到界面上。
3. 首先是内存缓存：一般都是LruCache (Least Recently Used)(内部是LinkedHashMap)是当缓存满了时候会优先淘汰最近最少使用的。一般每次都是应用最大内存的1/8。缓存前可以对。

##### 保活
- android:excludeFromRecents="true" 在任务队列里隐藏。
- taskAffinity: 任务栈。taskAffinity 经常会和 singleTask 搭配使用,小程序里常用

##### RxJava: (链式编程)
> 一个在 Java VM 上使用可观测的序列来组成异步的、基于事件的程序的库

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

