var shareRecipeButton = document.querySelector('#share-recipe-button');
var postRecipeArea = document.querySelector('#post-recipe');
var closeShareRecipeAreaButton = document.querySelector('#close-post-recipe');
var sharedRecipesArea = document.querySelector('#shared-recipes');
var form = document.querySelector('form');
var titleInput = document.querySelector('#title');
var recipeInput = document.querySelector('#recipe');
var videoPlayer = document.querySelector('#player');
var canvasElement = document.querySelector('#canvas');
var captureButton = document.querySelector('#capture-btn');
var imagePicker = document.querySelector('#image-picker');
var picArea = document.querySelector('#pick-image');
var locationButton = document.querySelector('#location-btn') ;
var locationLoader = document.querySelector('#location-loader') ;
var fetchedLocation;

locationButton.addEventListener('click', (event)=>{
  if(!('geolocation' in navigator)){
    return;
  }
  locationButton.style.display ='none';
  locationLoader.style.display ='block';
  

  navigator.geolocation.getCurrentPosition((position)=>{
    locationButton.style.display ='inline';
    locationLoader.style.display ='none';
    fetchedLocation = {lat:position.coords.latitude, lng:0}; 
    locationInput.value = 'In Berlin';
    locationInput.classLisst.add('is-focused');

  }, (err)=>{
    console.log(err)
    locationButton.style.display ='inline';
    locationLoader.style.display ='none';
    fetchedLocation = {lat:null, lng:null}; 
    alert('No geodata signal')
  }, 
  {timeout: 5000}
  );


});

function initLocation(){
  if(!('geolocation' in navigator)){
    locationButton.style.display ='none';
  
  }
}


function initMedia(){
  if(!('mediaDevices' in navigator)){  //mediaDevices API accesses mobile media devices such as camera, microphone
    navigator.mediaDevices ={};    //support up to now is sparse --> therefore we are here creating our own mediaDevice object 
  }

 if(!('getUserMedia' in navigator.mediaDevices)){
    navigator.mediaDevices.getUserMedia = function(constraints){
        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                          //safari's video implemetation   || mozilla video implementation
        if (!getUserMedia){
          return Promise.reject(new Error('getUserMedia is not implemented!'));  //worst case: no possible implementation for userMedia
        }
        return new Promise((resolve,reject)=>{ 
          getUserMedia.call(navigator,constraints,resolve,reject);  //refer to custom implementation for user Media
        });
    }                    
  }  
  navigator.mediaDevices.getUserMedia({video:true})  //option 2: {audio:true}
  .then((stream)=>{
    videoPlayer.srcObject = stream;
    videoPlayer.style.display='block';
  })
  .catch(function(err){
    picArea.style.display='block';
  });
}

captureButton.addEventListener('click', ((event)=>{
  canvasElement.style.display = 'block';
  videoPlayer.style.display = 'none';
  captureButton.style.display = 'none';
  var context = canvasElement.getContext('2d');
  context.drawImage(videoPlayer, 0, 0, canvas.width, videoPlayer.videoHeight / (videoPlayer.videoWidth / canvas.width));
  videoPlayer.srcObject.getVideoTracks().forEach((track)=>{
    track.stop();
  })

}));


function sendData(){
  fetch('https://us-central1-wg-food.cloudfunctions.net/storeRecipes', {
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      id: new Date().toISOString(),
      title: titleInput.value,
      recipe: recipeInput.value,
      image: 'https://firebasestorage.googleapis.com/v0/b/wg-food.appspot.com/o/summerrolls_sm.jpg?alt=media&token=3a51d92a-0580-4741-855b-cc98348d42be'
      //rawLocationLat: fetchedLocation.lat,
      //rawLocationLong : fetchedLocation.lng
    })
  })
  .then((res)=>{
    console.log('Sent data', res);
    updateUI(res);
  })
}

form.addEventListener('submit', function(event){
  event.preventDefault(); 

  if(titleInput.value.trim()=== '' || recipe.value.trim() ===''){
    alert('Please enter valid data.')
    return closePostRecipeArea();
  }
  /*  
  //Background Synchronisation - only supported on (original) chrome   
  
  if('serviceWorker' in navigator && 'SyncManager' in window){
    navigator.serviceWorker.ready
    .then(function(sw){
    var post = {
      id: new Date().toISOString(),
      title: titleInput.value,
      recipe: recipeInput.value,
      picture: picture,
      rawLocation: fetchedLocation
    };
    writeData('sync-posts', post)
    .then(()=>{
      return sw.sync.register('sync-new-post');
    })
    .then(()=>{
      var snackbarContainer = document.querySelector('#confirmation-toast');
      var data = {message: 'Your recipe was saved for syncing!'};
      snackbarContainer.MaterialSnackbar.showSnackbar(data);
    })
    .catch((err)=>{
      console.log(err);
    });      
  });
}*/
else { 
  sendData();
  
}

});  

function openPostRecipeArea(){
  postRecipeArea.style.display = 'block';
  setTimeout(()=>{postRecipeArea.style.transform = 'translateY(0)';})
  initMedia();
  
  if (deferredPrompt){
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choiceResult)=>{
    console.log(choiceResult.outcome);

    if (choiceResult.outcome ==="dismissed"){
      console.log('Installation cancelled by user');
    } else {
      console.log('Added to homescreen');
    }
  });

  deferredPrompt = null;

  }
}

function closePostRecipeArea() {
  console.log('closing share recipes');
  postRecipeArea.style.transform = 'translateY(100vh)';
  picArea.style.display = 'none';
  videoPlayer.style.display = 'none';
  canvasElement.style.display = 'none';
  locationButton.style.display = 'inline';
  locationLoader.style.display = 'none';
  location.reload();
}

shareRecipeButton.addEventListener('click', openPostRecipeArea);
closeShareRecipeAreaButton.addEventListener('click', closePostRecipeArea);


function clearCards() {
  while (sharedRecipesArea.hasChildNodes()) {
    sharedRecipesArea.removeChild(sharedRecipesArea.lastChild);
  }
}

function createCard(data) {
  console.log('executing createCard')
  let cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-recipe-card mdl-card mdl-shadow--2dp';
  let cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url(' + data.image + ')'; //'url("/src/images/summerrolls.jpg")';
  cardTitle.style.backgroundPosition = 'top';
  cardTitle.style.height = '250px';
  cardTitle.style.width = 'auto';
  cardWrapper.appendChild(cardTitle);
  let cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = data.title;
  cardTitle.appendChild(cardTitleTextElement);
  cardTitleTextElement.style.color = '#40C4FF';
  let cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__title-text';
  //cardSupportingText.textContent = data.title;
  cardSupportingText.style.textAlign = 'center';
  cardWrapper.appendChild(cardSupportingText);
  let recipe_button_link = document.createElement('a');
  recipe_button_link.href = data.recipe;
  recipe_button_link.style.textDecoration = 'none';
  let recipe_button = document.createElement('button');
  recipe_button.className = 'mdl-button mdl-button--raised mdl-button--colored';
  recipe_button.id = 'recipe_button';
  recipe_button.textContent = 'get recipe';
  recipe_button.style.textAlign = 'center';
  recipe_button_link.appendChild(recipe_button);
  cardWrapper.appendChild(recipe_button_link);
  componentHandler.upgradeElement(cardWrapper);
  sharedRecipesArea.appendChild(cardWrapper);
  console.log('executed createCard');
}


function updateUI(data) {
  clearCards();
  for (var i = 0; i < data.length; i++) {
    createCard(data[i])
  }
}

//Fetching
var networkDataReceived = false;
var url = 'https://wg-food-default-rtdb.europe-west1.firebasedatabase.app/posts.json';

fetch(url)
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    networkDataReceived = true;
    console.log('From web', data);
    var dataArray = [];
    for (var key in data) {
      dataArray.push(data[key]);
    }
    updateUI(dataArray);
  });

//accessing indexedDB's data
  if ('indexedDB' in window) {
    readAllData('posts')
    .then(function(data){
      if (!networkDataReceived){
        console.log('From indexedDB', data);
        updateUI(data);
      }
    })
    .catch((err)=>{
      console.log(err);
    })
    };

if ('caches' in window) {
  caches.match(url)
    .then((response) => {
      if (response) {
        return response.json();
      }
    })
    .then(function (data) {
      console.log('From cache', data);
      if (!networkDataReceived) {
        var dataArray = [];
        for (var key in data) {
          dataArray.push(data[key]);
        }
        updateUI(dataArray);

      }
    });
}

