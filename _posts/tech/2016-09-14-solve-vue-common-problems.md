---
layout: post
title: Vue 常见问题解决方案记录
date: 2016-09-14 18:51:01 +0800
categories: 技术
tags: Vue
keywords: Vue,Http,Post
description: Vue 常见问题解决方案记录
---

## Vue-resource 使用记录
**[Vue-resource](https://github.com/vuejs/vue-resource)**, 她作为 Vue 家族一部分，可替代掉 jQuery-ajax; 使用起来也是蛮愉悦; 但初用起来却也需踩些小坑；
这部分就用来记录使用她过程中所学到的那些知识；

### 使用 post 请求

在[Vue-resource HTTP](https://github.com/vuejs/vue-resource/blob/master/docs/http.md), 已经蛮清楚的给出了 Post 请求使用示例，如下：

```
// global Vue object
Vue.http.get('/someUrl', [options]).then(successCallback, errorCallback);
Vue.http.post('/someUrl', [body], [options]).then(successCallback, errorCallback);

// in a Vue instance
this.$http.get('/someUrl', [options]).then(successCallback, errorCallback);
this.$http.post('/someUrl', [body], [options]).then(successCallback, errorCallback);
```

然而，这并不代表使用过程中不会遇到问题：(比如使用时遇到这样的报错：XMLHttpRequest cannot load XXX. Response for preflight has invalid HTTP status code 405)；这个$http请求和jquery的ajax还是有点区别，这里的post的data默认不是以form data的形式，而是request payload。解决起来倒也很简单：在vue实例中添加headers字段:

```
http: {
   headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}
```

或者使用 vue 方面提供的更加简单做法：

```
Vue.http.options.emulateJSON = true;
```

以上参考了 [vue.js 快速入门]([https://segmentfault.com/a/1190000003968020#articleHeader10]) 一文中写道的分享[这也得了解下form data和request payload的区别，才是彻底解决问题之道]; 另外还需注意的是，参数传递方面也跟 get 请求有些区别, 例如下面使用示例：

```
if (model === 'POST'){
	this.$http.post(apiUrl, params)
		.then((response) => {
			callback(response.data)
		})
		.catch(function (response) {
			console.log(response)
		})
} else {
	this.$http.get(apiUrl, {params: params})
		.then((response) => {
			callback(response.data)
		})
		.catch(function (response) {
			console.log(response)
		})
}
```

### vue-resource设置timeout回调？
在文档 [vue-resource | Interceptors](https://github.com/vuejs/vue-resource/blob/master/docs/http.md) 中，已经阐明了`Interceptors`(拦截器)的作用：

>Interceptors can be defined globally and are used for pre- and postprocessing of a request.

所以可以自己实现一个 `timeout interceptor` 的流程，据此实现你想要的需求；比如像这样：
```
Vue.http.interceptors.push((request, next) => {
    var timeout;
	// 這裡改用 _timeout ，就不會觸發原本的
    if (request._timeout) {
    	// 一樣綁定一個定時器，但是這裡是只要觸發了，就立即返回 response ， 並且這邊自定義了 status 和 statusText
        timeout = setTimeout(() => {
            next(request.respondWith(request.body, {
                 status: 408,
                 statusText: 'Request Timeout'
            }));
        }, request._timeout);
    }

    next((response) => {
        clearTimeout(timeout);
    });
})
```
具体可参见 [如何用vue-resource设置timeout回调？](https://segmentfault.com/q/1010000005800495)

未完待续...

LastModify: 2016-09-14 19:18
