# ikt_pwa: "Feed my hungry WG" 
'WG' is short for collective housing, here meaning the people sharing food, lives and taking care of eachother

This project is building a progressive web app as part of the course "current trends in information technologies" at HTW Berlin (University of Applied Sciences). 
_________________

# The idea

- The people living together can post both their favourite recipes along with pictures of delicious food and restaurant recommendations, either using the restaurant's geolocations or recipe's urls. Adding new items sends push notifications to subscribed users
- an added shopping list (to be implemented) displays the items needed in the house - if an item was added, a push notification should be sent: Your WG needs {milk or else}.

Not yet implemented, but definitely great for future implementation which the author is excited about: 
- webscraping the ingredients of the uploaded recipes (this would involve limiting urls for recipe upload to a scrapable site)
- a form to share your mum's recipes not to be found online
- a button "i want to cook this today" which adds the needed ingredients and amounts to the shoppinglist 
  --> triggers a push-notification: "Your flatmate wants to cook today, please support them by going shopping"
___________________________________

# Understanding the branch setup

The author undertook two different approaches to the task, first due to time management issues, then because of unhappiness with the firebase setup. The result is therefore still a work in progress.

1) main branch: Contains the nearly fully successful approach (but) using firebase server --> description see "implementation", downsides: "disadvantages"
     firebase_backend is equal to main
     losing_firebase documents the (unfortunately undebugged) attempt to upload pictures to firebase as well as retrieve them

2) backend: contains the second approach creating a REST API using node.js and mongoDB. --> description see "Second approach"
   master: contains the frontend intended to be used with the second approach's backend, only containing rather basic functionalities,see "Second approach"
                     
_________________________

# The implementation

The current main-branch holds the implementation using google firebase as backend server: this can be found in the functions/index.js file
Here, also serverside push notifications are implemented which are triggered when data was added

This approach was chosen to speed things up: firebase offers full backend endpoints, storage and functions support. (Disadvantages and second approach see below)

The successful part of the client-side implementation consists of 
1. The serviceWorker: public/sw.js 
offering the following features:
- making the app installable, and offline available (of course along withpublic/manifest.json)
- static and dynamic caching 
- implemetation of indexed db

implemented but due to browser support not testable (the author uses linux chromium, browser support only for "real" chrome):
- backend synchronisation

2. client.side action handlers: public/src/js/feed.js
offering:
- responsive design (by a medium talented designer as the author needs to call themselves)
- web push notifications triggerd by user-actions in the frontend
- camera access, taking beautiful pictures 
  (due to great heartache debugging firebase -see below- the pictures are unfortunately not storable and therefore not retrievable)
- the implementation of location retrieval 
  (commented out and not tested, because firebase crashed in between when trying to store pictures and couldn't be reanimated)

__________________________________________

# Disadvantages of chosing firebase

-The need to hand over data to google
(in general if you want google to delete data found in public, here is a form to claim your data and have it deleted): 
https://reportcontent.google.com/forms/rtbf?hl=de&utm_source=wmx&utm_medium=deprecation-pane&utm_content=legal-removal-request
               
-Firebase is hard to debug
--> the author failed to debug the function to upload, store and retrieve the picture taken (the attempt is saved in branch "losing_firebase"), therefore being unable to proceed and finish the beautiful project initially planned. 
The initially for time reasons dismissed second approach had to be taken in addition

____________________________________________

# Second approach

The second, much more recommendable approach, consists in creating a REST API paired with MongoDB.
This second attempt to create a functioning backend is to be found in the branch "backend". 

C-R-U-D
Successfull implemented:
Uploading, storing and updating data of different formats: C- U
Still in debugging: Reading/downloading data: R
To be implemented: Deleting data: D

ToDo:
- the successful debugging of the download functionality. 
- implementing delete data from server
- Bringing the frontend (--> to be found in the master-branch) up to the state of the firebase-implementation
- Connecting frontend to backend.
