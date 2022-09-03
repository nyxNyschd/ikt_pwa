var CACHE_STATIC_NAME = 'static-v4';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';

self.addEventListener('install', event =>{
    console.log('[Service Worker] Installing Service Worker ...', event);
    event.waitUntil(caches.open(CACHE_STATIC_NAME)
    .then((cache)=>{
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll([
            '/',
            '/index.html',
            '/src/js/app.js',
            '/src/js/feed.js',
            '/src/js/material.min.js',
            '/src/css/app.css',
            '/src/css/feed.css',
            '/src/images/fridge_norm.jpg',
            'https://fonts.googleapis.com/css?family=Roboto:400,700',
            'https://fonts.googleapis.com/icon?family=Material+Icons',
            'https://code.getmdl.io/1.3.0/material.blue-light_blue.min.css'
        ]);                
    })
    )
});

self.addEventListener('activate', event =>{
    console.log('[Service Worker] Activating Service Worker ...', event)
    event.waitUntil(
        caches.keys()
        .then(function(keyList){
            return Promise.all(keyList.map(function(key){
                if (key != CACHE_STATIC_NAME && key != CACHE_DYNAMIC_NAME){
                    console.log('[Service Worker] Removing old cache.', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', event =>{
   event.respondWith(
    caches.match(event.request)  
    .then(function(response){
        if(response){
            return response;
        } else {
        return fetch(event.request)
        .then(function(res){
            return caches.open(CACHE_DYNAMIC_NAME)
            .then(function(cache){
                cache.put(event.request.url, res.clone());
                return res;
            })
        })
        .catch(function(error){
        });
    } 
   })
   );
});


//importScripts(
//    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
//  );
  
//  workbox.routing.registerRoute(
 //     ({request}) => request.destination === 'image',
 //     new workbox.strategies.NetworkFirst()     // NetworkFirst() vs CacheFirst()
 // )

 //importScripts('src/js/idb.js');