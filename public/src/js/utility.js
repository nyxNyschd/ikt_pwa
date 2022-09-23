var dbPromise = idb.open('food-store', 1, function(db){
    if (!db.objectStoreNames.contains('posts')){
    db.createObjectStore('posts', {keyPath: 'id'});
    }
    if (!db.objectStoreNames.contains('sync-posts')){
    db.createObjectStore('sync-posts', {keyPath: 'id'});
    }
});

function writeData(stor, data){
    dbPromise //access promise and store posts
    .then((db)=>{
        var transaction = db.transaction(stor, 'readwrite');
        var store = transaction.objectStore(stor);
        store.put(data);
        return transaction.complete;
        });
}

function readAllData(stor){
    return dbPromise
    .then((db)=>{
        var transaction = db.transaction(stor, 'readonly');
        var st = transaction.objectStore(stor);
        return st.getAll();  //weil wir hier nicht schreiben, brauchen wir keine transaktionssicherheit
    });
}

function clearAllData(stor){
    return dbPromise
    .then((db)=>{
        var transaction = db.transaction(stor, 'readwrite');
        var st = transaction.objectStore(stor);
        st.clear();
        return transaction.complete;
    }) 
    .then(function(){
        console.log('Data deleted!')
    });
}

function deleteSingleItemFromData(stor,id){
    return dbPromise
    .then((db)=>{
        var transaction = db.transaction(stor, 'readwrite');
        var st = transaction.objectStore(stor);
        st.delete(id);
        return transaction.complete;
    })
    .then(function(){
        console.log('Item deleted!')
    });
}

function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);
  
    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab], {type: mimeString});
    return blob;
  }