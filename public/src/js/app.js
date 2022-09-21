var deferredPrompt;
var enableNotificationsButtons = document.querySelectorAll('.enable-notifications');

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

function displayConfirmNotification(){
  if('serviceWorker' in navigator){
    navigator.serviceWorker.ready
    .then((swregist)=>{
      var options = {
        body:'You successfully subscribed to our notifications!',
        //icon: '/src/images/icons/apple-splash-640-1136.jpg',
        image: '/src/images/fridge_sm.jpg',
        dir:'ltr',
        lang:'en-US',  //BCP 47 language encoding necessary!
        vibrate: [100,50,200],
        //badge: '/src/images/icons/apple-splash-640-1136.jpg'  //needs to be 96x96,
        tag:'confirm-notification', //to stack notifications
        renotify:true, 
        actions: [
          {action: 'confirm', title:'OK'},
          {action: 'cancel', title:'Cancel'}
      ]
      };     

        swregist.showNotification('Subscription successful!', options);
           
    });
  }
}


function configurePushSubscriptions(){
  if(!('serviceWorker' in navigator)){
    return;
  }
  //var regi;
  navigator.serviceWorker.ready
    .then((swregist)=>{
     // regi = swregist;
      return swregist.pushManager.getSubscription();
    });/* 
    .then((sub)=>{
      if(sub === null){
        //Create new subscription
       /*  var vapidPublicKey = 'BNxnE6Mez8eJtSV6IcmOjJNz9sXqU3iMMbEaDVCZFNmIh1QeZmvAUorENV_9tA-mX4IHlY047TLj9jSiCgdJuNo';
        var convertedVapidpubKey = urlBase64ToUint8Array(vapidPublicKey);
        return regi.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidpubKey
        }); */
   //   }else{
        //We already have a subscription
    //  }
    //});
 // } */
    /* .then((newSub)=>{ 
      return fetch('https://wg-food-default-rtdb.europe-west1.firebasedatabase.app/subscriptions.json', {
        
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newSub)
      })
    })
    .then((res)=>{
      if (res.ok){
      displayConfirmNotification();
      }
    })
    .catch((err)=>{
      console.log(err);
    });*/

} 


function askForNotificationPermission(){
  Notification.requestPermission((result)=>{
    console.log('User Choice',result);
    if(result!== 'granted'){
      console.log('No notification permission granted!');
    }else {
      //configurePushSubscriptions();
      displayConfirmNotification();
    }
  });
}

if('Notification' in window && 'serviceWorker' in navigator){
  for (var i = 0; i< enableNotificationsButtons.length; i++){
    enableNotificationsButtons[i].style.display = 'inline-block';
    enableNotificationsButtons[i].addEventListener('click', askForNotificationPermission);
  }
}

