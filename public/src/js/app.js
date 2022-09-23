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

// handling the button to enable notifications: react to user's choice when subscribing
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
        // react to user clicking on action buttons in notification window
        actions: [
          {action: 'confirm', title:'OK'},  //,icon:'link_to_checkmark_icon'
          {action: 'cancel', title:'Cancel'} //,icon: 'link to cancel icon'
      ]
      };     

        swregist.showNotification('Subscription successful!', options);
           
    });
  }
}

//function to react to user subscribing to notifications
function configurePushSubscriptions(){
  //if no serviceworker, then notifications are not supported anyway --> check for feature availibility!
  if(!('serviceWorker' in navigator)){
    return;
  }
  var regi;
  navigator.serviceWorker.ready
    .then((swregist)=>{
     regi = swregist;

     //check for existing subscriptions using the current browser-serviceWorker-device combination
     return swregist.pushManager.getSubscription();

    }) 
    .then((sub)=>{ 
      if(sub === null){

        console.log('no existing subscription: Creating a new one')

    //setting up security with vapid keys: setting our server as the only viable source of sending push messages
        var vapidPublicKey = 'BNxnE6Mez8eJtSV6IcmOjJNz9sXqU3iMMbEaDVCZFNmIh1QeZmvAUorENV_9tA-mX4IHlY047TLj9jSiCgdJuNo';
        var convertedVapidpubKey = urlBase64ToUint8Array(vapidPublicKey);

    //Creating new subscription
        return regi.pushManager.subscribe({
          userVisibleOnly: true, //push notifications only visible to our user                   
          applicationServerKey: convertedVapidpubKey //sending vapid key
      })
      //passing new subscription to server
      .then((newSub)=>{ 
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
    });       
             

      }else{
        //We already have a subscription
        console.log('Yeah, we already have a subscription <3', regi)
      }
    });
  } 
   

//handling user's choice when asked if they want to subscribe to notifications
function askForNotificationPermission(){
  Notification.requestPermission((result)=>{
    console.log('User`s choice: permission ',result);
    if(result!== 'granted'){
      console.log('No notification permission granted!');
    }else {
      configurePushSubscriptions();
      //displayConfirmNotification();
    }
  });
}

if('Notification' in window && 'serviceWorker' in navigator){
  for (var i = 0; i< enableNotificationsButtons.length; i++){
    enableNotificationsButtons[i].style.display = 'inline-block';
    enableNotificationsButtons[i].addEventListener('click', askForNotificationPermission);
  }
}

