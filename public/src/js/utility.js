var dbPromise = idb.open('food-store', 1, function(db){
    if (!db.objectStoreNames.contains('posts')){
    db.createObjectStore('posts', {keyPath: 'id'});
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