'use strict';

const version = 'v-2017-11-14 22:10';
const __DEVELOPMENT__ = false;
const __DEBUG__ = true;
const offlineResources = [
  '/',
  '/index.html'
];

const ignoreCache = [
  /https?:\/\/hm.baidu.com\//,
  /https?:\/\/cdn.bootcss.com\//,
  /https?:\/\/static.duoshuo.com\//,
  /https?:\/\/www.google-analytics.com\//,
  /https?:\/\/dn-lbstatics.qbox.me\//,
  /https?:\/\/ajax.cloudflare.com\//,
  /https?:\/\/cdn1.lncld.net\//,
  /https?:\/\/api.leancloud.cn\//,
  /https?:\/\/lzw.me\/wp\-admin/,
  /https?:\/\/fonts.googleapis.com\/css/,
  /chrome-extension:\//
];

let port;

/**
* common function
*/

function developmentMode() {
  return __DEVELOPMENT__ || __DEBUG__;
}

function cacheKey() {
  return [version, ...arguments].join(':');
}

function log() {
  if (developmentMode()) {
    console.log("SW:", ...arguments);
  }
}

function shouldAlwaysFetch(request) {
  return __DEVELOPMENT__ ||
    request.method !== 'GET' ||
    ignoreCache.some(regex => request.url.match(regex));
}

function shouldFetchAndCache(request) {
  return (/text\/html/i).test(request.headers.get('Accept'));
}

function sendNotify(title, options, event) {
  if (Notification.permission !== 'granted') {
    log('Not granted Notification permission.');

    if (port && port.postMessage) {
      port.postMessage({
        type: 'applyNotify',
        info: {title, options}
      });
    }

    return;
  }

  const notificationPromise = self.registration.showNotification(title || '渣渣', Object.assign({
    body: '千年王八万年龟！',
    icon: 'https://zhouyueting.github.io/icon.png',
    tag: 'push'
  }, options));

  return event && event.waitUntil(notificationPromise);
}

/**
* onClickNotify
*/

function onClickNotify(event) {
  event.notification.close();
  const url = "https://zhouyueting.github.io/";

  event.waitUntil(
    self.clients.matchAll({
      type: "window"
    })
    .then(() => {
      if (self.clients.openWindow) {
          return self.clients.openWindow(url);
      }
    })
  );
}

/**
* Install
*/

function onInstall(event) {
  log('install event in progress.');

  event.waitUntil(
    caches.open(cacheKey('offline'))
        .then(cache => cache.addAll(offlineResources))
        .then(() => log('installation complete! version: ' + version))
        .then(() => self.skipWaiting())
  );
}

/**
* Fetch
*/

function offlineResponse(request) {
  log('(offline)', request.method, request.url);
  if (request.url.match(/\.(jpg|png|gif|svg|jpeg)(\?.*)?$/)) {
    return caches.match('/wp-content/themes/Kratos/images/default.jpg');
  } else {
    return caches.match('/offline.html');
  }
}

function cachedOrOffline(request) {
  return caches
    .match(request)
    .then((response) => response || offlineResponse(request));
}

function networkedAndCache(request) {
  return fetch(request)
    .then(response => {
      const copy = response.clone();

      caches.open(cacheKey('resources'))
          .then(cache => {
              cache.put(request, copy);
          });

      log("(network: cache write)", request.method, request.url);
      return response;
    });
}

function cachedOrNetworked(request) {
  return caches.match(request)
      .then((response) => {
          log(response ? '(cached)' : '(network: cache miss)', request.method, request.url);
          return response ||
              networkedAndCache(request)
              .catch(() => offlineResponse(request));
      });
}

function networkedOrOffline(request) {
  return fetch(request)
      .then(response => {
          log('(network)', request.method, request.url);
          return response;
      })
      .catch(() => offlineResponse(request));
}

function onFetch(event) {
  const request = event.request;

  if (shouldAlwaysFetch(request)) {
      log('AlwaysFetch request: ', event.request.url);
      event.respondWith(networkedOrOffline(request));
      return;
  }

  if (shouldFetchAndCache(request)) {
      event.respondWith(
          networkedAndCache(request).catch(() => cachedOrOffline(request))
      );
      return;
  }

  event.respondWith(cachedOrNetworked(request));
}

/**
* Activate
*/

function removeOldCache() {
  return caches
      .keys()
      .then(keys =>
          Promise.all(
              keys
              .filter(key => !key.startsWith(version))
              .map(key => caches.delete(key))
          )
      )
      .then(() => {
          log('removeOldCache completed.');
      });
}

function onActivate(event) {
  log('activate event in progress.');
  event.waitUntil(Promise.all([
      self.clients.claim(),
      removeOldCache()
  ]))
}

/**
* onPush
*/

function onPush(event) {
  log('onPush ', event);
  sendNotify('Hi:', {
      body: `onPush${new Date()}？_ ？~`
  }, event);
}

/**
* onSync
*/

function onSync(event) {
  log('onSync', event);
  sendNotify('Hi:', {
      body: `onSync${new Date()}？_ ？ ~`
  }, event);
}

/**
* onMessage
*/

function onMessage(event) {
  log('onMessage', event);

  if (event.ports) {
      port = event.ports[0];
  }

  if (!event.data) {
      return;
  }

  if (event.data.type === 'notify') {
      const {title, options} = event.data.info || {};
      sendNotify(title, options, event);
  }
}

log("Hello from ServiceWorker land!", version);

self.addEventListener('install', onInstall);
self.addEventListener('fetch', onFetch);
self.addEventListener("activate", onActivate);
self.addEventListener("push", onPush);
self.addEventListener("sync", onSync);
self.addEventListener('message', onMessage);
self.addEventListener("notificationclick", onClickNotify);