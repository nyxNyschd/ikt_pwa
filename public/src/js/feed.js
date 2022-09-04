var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
console.log('hello,hello, feed.js here')

var sharedRecipesArea = document.querySelector('#shared-recipes');

//Unregistering a serviceworker:

/* if('serviceWorker' in navigator){
  navigator.serviceWorker.getRegistrations()
  .then(function(registrations){
    for (var i = 0; i < registrations.length; i++){
      registrations[i].unregister();
    }
  })
} */


//Currently not in use, enables caching recipes on demand
function getRecipe(event){
  console.log('clicked');
  if ('caches' in window){
    caches.open('user-request')
  .then((cache)=>{
    cache.add('https://httpbin.org/get');
    cache.add('/src/images/summerrolls.jpg');
    console.log('added user-request')
  });
  }  
}

function clearCards(){
  while(sharedRecipesArea.hasChildNodes()){
    sharedRecipesArea.removeChild(sharedRecipesArea.lastChild);
  }
}

function createCard() {
  console.log('executing createCard')
  let cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-recipe-card mdl-card mdl-shadow--2dp';
  let cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url("/src/images/summerrolls.jpg")';
  cardTitle.style.backgroundSize = '100%';
  cardTitle.style.height = '180px';
  cardTitle.style.width = 'auto';
  cardWrapper.appendChild(cardTitle);
  let cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = 'Food tipp';
  cardTitle.appendChild(cardTitleTextElement);
  cardTitleTextElement.style.color = 'black';
  let cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = 'Fresh and yummy: Summerrolls';
  cardSupportingText.style.textAlign = 'center';
  cardWrapper.appendChild(cardSupportingText);
  let recipe_button = document.createElement('button');
  recipe_button.className='mdl-button mdl-button--raised mdl-button--colored';
  recipe_button.textContent = 'get recipe';
  recipe_button.style.textAlign = 'center';
  //recipe_button.addEventListener('click',getRecipe);
  cardWrapper.appendChild(recipe_button)
  componentHandler.upgradeElement(cardWrapper);
  sharedRecipesArea.appendChild(cardWrapper);
  console.log('executed createCard');
} 

function openCreatePostModal() {
  createPostArea.style.display = 'block';
}
function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}


shareImageButton.addEventListener('click', openCreatePostModal);
closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);


//Fetching
var networkDataReceived = false;
var url = 'https://httpbin.org/get';

fetch('https://httpbin.org/get')
.then((res)=>{
    return res.json();})
.then((data)=>{
  console.log('From web', data);
  console.log('executing clearCards');
  clearCards();
  console.log('executed clearCards');
  console.log('creating new card');
  createCard()});
  

if ('caches' in window){
  caches.match(url)
  .then((response)=>{
    if(response){
      return response.json();
    }
  })
  .then(function(data){
    console.log('From cache',data);
    if(!networkDataReceived){
      console.log('executing clearCards');
      clearCards();
      console.log('executed clearCards');
      console.log('creating new card');
      createCard();
    }
    
  });
}

