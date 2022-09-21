var functions = require("firebase-functions");
var admin = require('firebase-admin');
//const {ref} = require("firebase-functions/v1/database");
var cors = require('cors')({origin:true});
var webpush = require('web-push');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
var serviceAccount = require("./k/wg-food-firebase-adminsdk-k8n4t-b01aa600ae.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://wg-food-default-rtdb.europe-west1.firebasedatabase.app'
 });

 exports.storeRecipes = functions.https.onRequest((request, response) => {
   functions.logger.info("Hello logs!", {structuredData: true});
   cors(request, response, ()=>{
    admin.database().ref('posts').push({
        id: request.body.id,
        title: request.body.title,
        recipe: request.body.recipe,
        image : request.body.image
    })
    .then(()=>{
        webpush.setVapidDetails('mailto: hungry@wg.org', 'BNxnE6Mez8eJtSV6IcmOjJNz9sXqU3iMMbEaDVCZFNmIh1QeZmvAUorENV_9tA-mX4IHlY047TLj9jSiCgdJuNo','sl7r6QspPOElNjRRZ1razeOCFPfvLWmC4QxKkfj9GB4');
        return admin.database().ref('subscriptions').once('value');
        
    })
    .then((subscriptions)=>{
        subscriptions.forEach((sub)=>{
            var pushConfig = {
                endpoint: sub.val().endpoint,
                keys: {
                    auth: sub.val().keys.auth,
                    p256dh: sub.val().keys.p256dh
                }
            };
            webpush.sendNotification(pushConfig, JSON.stringify({
                title: 'New Post', 
                content: 'New Post added!',
                openUrl: '/help'
            }))
            .catch((err)=>{
                console.log(err);
            })
        });
        response.status(201).json({message: 'Data stored', id: request.body.id});
    })

    .catch(function(err){
        response.status(500).json({error:err});
    });
   });
 });
