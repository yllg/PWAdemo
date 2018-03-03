
//获得整个网页的控制权
//搞定页面所有的require； 还可以本地拦截

//几个基本的全局对象
//self  表示的是serviceWorker scope的作用域
//caches 控制缓存用的环境变量
//clients 表示serviceWorker接管的页面
//skipWaiting 强制的将我们处于waiting状态的脚本进入active状态

//缓存的文件名
const cacheName = 'lgPWA-step-v1';
//需要缓存的文件， index.html就是所说的app shell
const filesToCache = [
    '/js/index.js',
    // '/js/test.js',
    '/css/index.css',
    '/images/马赛克拼图.jpeg',
    '/index.html',
    '/'
];


//首次访问被执行，所以资源要在这里进行缓存
self.addEventListener('install',function(event){
    console.log('安装完成');
    //装载静态资源 缓存
    event.waitUntil(updateStaticCache());
});

//首次加载缓存文件的方法
const updateStaticCache = ()=>{
    return caches.open(cacheName)
    .then((cache)=>{
        //原子操作，如果一个文件缓存失败，所有的缓存都失败
        return cache.addAll(filesToCache);
    }).then(()=>{
        //强制的将处于waiting状态的脚本进入active状态
        //加这一句比较保险
        self.skipWaiting();
    });
};


//下次激活页面时，激活文件取缓存

//首先是activate 一般用来控制版本的变化 
//注意是activate不是active哦
self.addEventListener('activate',function(event){
    //keyList 实际工程中可能有很多key
    event.waitUntil(caches.keys().then((keyList)=>{
        // console.log(keyList);
        return Promise.all(keyList.map(function(key){
            console.log('serviceWorker Removing old key',key);
            if(key !== cacheName){
                //把老key的数据清除掉，保证版本的变化
                return caches.delete(key);
            }
        }));
    }));
});

//真正的让资源 run起来
self.addEventListener('fetch',function(event){
    console.log(event.request);
    //测试一下
    //拦住，第三次刷新页面就返回 Hello World; 类似nodejs的功能
    // event.respondWith(new Response("Hello World"));
    
    //在缓存中匹配请求,并返回结果
    //缓存有从缓存拿，缓存没有就fetch网络请求
    event.respondWith(
        caches.match(event.request).then(function(response){
            return response || fetch(event.request);
        })
    );
});





