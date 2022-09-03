var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
console.log('hello,hello, feed.js here')

var sharedRecipesArea = document.querySelector('#shared-recipes');



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


 fetch('https://httpbin.org/get')
.then((res)=>{
    return res.json();})
.then(function(data){
  createCard()});


// Anfrage ans backend: (lektion indexedDB)
//fetch('http://localhost:3000/posts')
 // .then((res) => {
 //   return res.json();   //wenn einzige anweisung return ist, dann geht auch folgende
//notation: (res) => res.json(); result: array aus allen geepeicherten posts
//  })
//  .then(function(data){
//    updateUI(data);
//  })

//  function updateUI(data)
 // {
 //   for (let post of data)
 //   {
 //     createCard(post);
 //   }
 // }

var promise = new Promise(function(resolve, reject){
  //  setTimeout(function(){
      resolve(createCard);
        reject({message:'An error occurred'});
   });