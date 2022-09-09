var shareRecipeButton = document.querySelector('#share-recipe-button');
var postRecipeArea = document.querySelector('#post-recipe');
var closeShareRecipeAreaButton = document.querySelector('#close-post-recipe');
var sharedRecipesArea = document.querySelector('#shared-recipes');
//var form = document.querySelector('form');
//var titleInput = document.querySelector('#title');
//var location = document.querySelector('#location');

/* form.addEventListener('submit', function(event){
  event.preventDefault(); //default of submit event: send data to server

  if(titleInput.value.trim()=== '' || location.value.trim() ===''){
    alert('Please enter valid data.')
    return;
  }else{
    closePostRecipeArea();
  }

}); */

function openPostRecipeArea(){
  postRecipeArea.style.display = 'block';
  setTimeout(()=>{postRecipeArea.style.transform = 'translateY(0)';})
  
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
  postRecipeArea.style.display = 'none';
  postRecipeArea.style.transform = 'translateY(100vh)';
}

//shareRecipeButton.addEventListener('click', openPostRecipeArea);
//closeShareRecipeAreaButton.addEventListener('click', closePostRecipeArea);


//Currently not in use, enables caching recipes on demand
function getRecipe(event) {
  console.log('clicked');
  if ('caches' in window) {
    caches.open('user-request')
      .then((cache) => {
        cache.add('https://httpbin.org/get');
        cache.add('/src/images/summerrolls.jpg');
        console.log('added user-request')
      });
  }
}

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
  //cardTitleTextElement.textContent = 'Food tipp';
  cardTitle.appendChild(cardTitleTextElement);
  cardTitleTextElement.style.color = 'black';
  let cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__title-text';
  cardSupportingText.textContent = data.title;
  cardSupportingText.style.textAlign = 'center';
  cardWrapper.appendChild(cardSupportingText);
  let recipe_button = document.createElement('button');
  recipe_button.className = 'mdl-button mdl-button--raised mdl-button--colored';
  recipe_button.id = 'recipe_button';
  recipe_button.textContent = 'get recipe';
  recipe_button.style.textAlign = 'center';
  
  // recipe_button.addEventListener('click',window.open(data.recipe));
  cardWrapper.appendChild(recipe_button);
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


/* fetch('https://httpbin.org/get')
.then((res)=>{
    return res.json();})
.then((data)=>{
  console.log('From web', data);
  console.log('executing clearCards');
  clearCards();
  console.log('executed clearCards');
  console.log('creating new card');
  createCard()}); */


  if ('indexedDB' in window) {
    readAllData('posts')
    .then(function(data){
      if (!networkDataReceived){
        console.log('From cache', data);
        updateUI(data);
      }
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
        /* console.log('executing clearCards');
        clearCards();
        console.log('executed clearCards');
        console.log('creating new card');
        createCard(); */
        var dataArray = [];
        for (var key in data) {
          dataArray.push(data[key]);
        }
        updateUI(dataArray);

      }
    });
}

