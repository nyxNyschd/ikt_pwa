var CACHE_STATIC_NAME = 'static-v23';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';
var STATIC_FILES = [
    '/',
    '/index.html',
    '/offline.html',
    '/src/js/app.js',
    '/src/js/feed.js',
    '/src/js/material.min.js',
    '/src/css/app.css',
    '/src/css/feed.css',
    '/src/images/fridge_norm.jpg',
    'https://fonts.googleapis.com/css?family=Roboto:400,700',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://code.getmdl.io/1.3.0/material.blue-light_blue.min.css'];



/* function trimCache(cacheName, maxItems) {
    caches.open(cacheName)
    .then(function(cache) {
        return cache.keys()
        .then(function(keys){
            if (keys.length > maxItems) {
                cache.delete(keys[0])
                .then(trimCache(cacheName, maxItems));
                console.log('cache trimmed')
            }
    });
})
} */

self.addEventListener('install', event =>{
    console.log('[Service Worker] Installing Service Worker ...', event);
    event.waitUntil(caches.open(CACHE_STATIC_NAME)
    .then((cache)=>{
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll(STATIC_FILES);                
    })
    )
});

self.addEventListener('activate', event =>{
    console.log('[Service Worker] Activating Service Worker ...', event)
    event.waitUntil(
        caches.keys()
        .then((keyList)=>{
            return Promise.all(keyList.map((key)=>{
                if (key != CACHE_STATIC_NAME && key != CACHE_DYNAMIC_NAME){
                    console.log('[Service Worker] Removing old cache.', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

function isInArray(string, array){
    for (var i = 0; i< array.length; i++){
        if (array[i] === string){
            return true;
        }
    }
    return false;
}

//Cache Then Network with Offline function
self.addEventListener('fetch', event =>{
   
    if (event.request.url.indexOf('https://httpbin.org/get') > -1){
        event.respondWith(
            caches.open(CACHE_DYNAMIC_NAME)
            .then((cache)=>{
                return fetch(event.request)
                .then((res)=>{
                  //  trimCache(CACHE_DYNAMIC_NAME, 5);
                    cache.put(event.request, res.clone());
                    return res;
                });
            })
            );  
    } 
    else if(isInArray(event.request.url, STATIC_FILES)){
        event.respondWith(
            caches.match(event.request));
    }

    else{
        event.respondWith(
            caches.match(event.request)  
            .then((response)=>{
            if(response){
                return response;
            } 
            else {
                return fetch(event.request)
                .then((res)=>{
                    return caches.open(CACHE_DYNAMIC_NAME)
                    .then((cache)=>{
                        cache.put(event.request.url, res.clone());
                        return res;
                    })
                })
                .catch((error)=>{ 
                    return caches.open(CACHE_STATIC_NAME)
                .then((cache)=>{
                    if (event.request.headers.get('accept').includes('text/html')){
                        return cache.match('/offline.html');
                    }
                
                 });
                });
            } 
        })
        )
     }   
    
});
   




//Cache Then Network 
/* self.addEventListener('fetch', event =>{
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
            return caches.open(CACHE_STATIC_NAME)
            .then(function(cache){
                return cache.match('/offline.html');
            });
        });
    } 
   })
   );
}); */

//Network First with Cache Fallback and Dynamic Caching
/* self.addEventListener('fetch', event =>{
    event.respondWith(
        fetch(event.request)
        .then(function(res){
            return caches.open(CACHE_DYNAMIC_NAME)
            .then(function(cache){
                cache.put(event.request.url, res.clone());
                return res;
            })
        })
        .catch(function(error){
            return caches.match(event.request)
        })
  );
    }); 
        */
     

//importScripts(
//    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
//  );
  
//  workbox.routing.registerRoute(
 //     ({request}) => request.destination === 'image',
 //     new workbox.strategies.NetworkFirst()     // NetworkFirst() vs CacheFirst()
 // )

 //importScripts('src/js/idb.js');