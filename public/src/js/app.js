if('serviceWorker' in navigator){
    navigator.serviceWorker
    .register('/sw.js')
    .then(registration => {
        console.log('Service worker successfully registered!');
        if (registration.installing){
            registration.installing.postMessage("Your installing page says hello.");
        }
    })
    .catch( err => {
        console.error("Installing the service worker failed :( ", err);
}) 
 


window.addEventListener('beforeinstallprompt', function(event){
    console.log('beforeinstallprompt fired');
  event.preventDefault();
    deferredPrompt = event;
    return false;
})};


//});

//promise.then(function(text){
//    console.log(text);
//}, function(err){
//    console.log(err.code, err.message);
//});

//promise.then(function(text){
 //   return(text);
//})
//.catch(function(err){
  //  console.log(err.code, err.message);
//});


//console.log('this is executed right after the start of the Timeout function')



