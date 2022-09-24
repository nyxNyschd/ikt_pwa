
importScripts('/src/js/idb.js');
importScripts('src/js/utility.js');

var CACHE_STATIC_NAME = 'static-v15';
var CACHE_DYNAMIC_NAME = 'dynamic-v6';
var STATIC_FILES = [
    '/',
    '/index.html',
    '/offline.html',
    '/src/js/app.js',
    '/src/js/feed.js',
    '/src/js/idb.js',
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

//open indexedDB
/* var dbPromise = idb.open('food-store', 1, function(db){
    if (!db.objectStoreNames.contains('posts')){
    db.createObjectStore('posts', {keyPath: 'id'});
    }
});  */

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

    var url = 'https://wg-food-default-rtdb.europe-west1.firebasedatabase.app/posts';
   
    if (event.request.url.indexOf(url) > -1){
        event.respondWith(fetch(event.request)
        .then((res)=>{                                            //  caches.open(CACHE_DYNAMIC_NAME)  .then((cache)=>{   return
            var clonedRes = res.clone();                                                           //  trimCache(CACHE_DYNAMIC_NAME, 5);
            clearAllData('posts')                                 //cache.put(event.request, res.clone());
            .then(()=>{
                return clonedRes.json();
            })                                                        
            .then((data)=>{
                for (var key in data) {
                    //dbPromise //access promise and store posts
                    writeData('posts',data[key])
                }
            });
            return res;
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

//Background syncing - only supported on (original) chrome
   
self.addEventListener('sync', (event)=>{
    console.log('[Service Worker] Background Syncing', event);
    if(event.tag === 'sync-new-post'){
        console.log('[Service Worker] Syncing new post');
        event.waitUntil(
            readAllData('sync-posts')
            .then((data)=>{
                for (var dat of data){
                    fetch('https://us-central1-wg-food.cloudfunctions.net/storeRecipes', {
                        method:'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                        id: dat.id,
                        title: dat.title,
                        recipe: dat.recipe,
                        image: 'https://firebasestorage.googleapis.com/v0/b/wg-food.appspot.com/o/summerrolls_sm.jpg?alt=media&token=3a51d92a-0580-4741-855b-cc98348d42be'
                        //rawLocationLat: dat.rawLocation.lat,
                        //rawLocationLong : dat.rawLocation.lng
    
                    })
                    })               
                    .then((res)=>{
                        console.log('Sent data', res); //now I can send it to firebase endpoint, get id from response
                    if (res.ok){
                        res.json()
                        .then((resData)=>{
                            deleteSingleItemFromData('sync-posts',resData.id);
                        });
                        
                    }
                    })
                    .catch((err)=>{
                        console.log('Error while sending data',err)
                    });

                }   
        
            })
        );
    }
});

//adding the notification-listener (notifications are a system event on my computer, handled by the serviceworker!)
self.addEventListener('notificationclick', (event)=>{

    //access notification: which notification was clicked
    var notification = event.notification;
    console.log(notification);

    //access action: which action was clicked
    var action = event.action;
    
    if (action === 'confirm'){
        console.log('User confirmed');
        notification.close();
    } else{
        console.log(action); //show, which action was chosen
        event.waitUntil(
            clients.matchAll()
            .then((cls)=>{

                //find open notification windows managed by the serviceworker
                var client = cls.find((c)=>{
                    return c.visibilityState=== 'visible';
                });
            //if there is no open window
            if (client !== undefined)  
                {client.navigate(notification.data.url);
            client.focus();

        } else {
            client.openWindow(notification.data.url); //uses the url set in the backend server: the /help page
        }
        notification.close();
            })
        ); 
    }
});

self.addEventListener('notificationclose', (event)=>{
    console.log('Notification was closed')
});

self.addEventListener('push', (event)=>{
    console.log('Push Notification received', event);

    var data = {title: 'New dummy', content: 'Something newish happened (not really)', openUrl:'/'};
    if(event.data){
        data = JSON.parse(event.data.text());
    }

    var options = {
        body: data.content,
        data: {
            url: data.openUrl
        }
    };
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
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


