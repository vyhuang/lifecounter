
// Player ID
let playerID = "";

firebase.initializeApp({
    apiKey: "AIzaSyBEbkeEo4QQd2uGSXs-iUzOiAlZGR3Wr-g",
    authDomain: "lifecounter-15538.firebaseapp.com",
    databaseURL: "https://lifecounter-15538.firebaseio.com",
    projectId: "lifecounter-15538"
});

// Initialize Cloud Firestore through Firebase
const db = firebase.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);

attachDocumentListener(db, 1);

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});

// method that asks for 3-character ID
function askForID() {
    playerID = "";
    let promptText = "Please enter a three-character ID.";
    while (true) {
        const player = prompt(promptText, "123");
        if (player !== null && player.length === 3) {
            playerID = player.toLocaleUpperCase();
            console.log("Consulting firebase");
            if (!duplicateID(db, 1, playerID)) {
                addID(db, 1, playerID);
                break;
            }
            promptText = "That ID already exists. \n"
        }
    }
}

function attachDocumentListener(database, roomNum) {
    database.collection("rooms").doc("room" + roomNum)
    .onSnapshot(function(doc) {
        renderAllLifeTotals(database,1);
    });
}

// Returns true if ID already exists, false otherwise
function duplicateID(database, roomNum, ID){
    let roomDocRef = database.collection("rooms").doc("room" + roomNum);

    roomDocRef.get().then(function(doc) {
        if (doc.exists) {
            console.log(doc.data());
            if (ID in doc.data()) {
                console.log (ID + " already found in database.");
                return true;
            }
            return false;
        }
        else {
            console.log("room" + roomNum + " not found");
            alert("Catastrophic failure. Abort abort abort.");
            return true;
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    })
}

function addID(database, roomNum, ID) {
    let roomDocRef = database.collection("rooms").doc("room" + roomNum);

    roomDocRef.get().then(function(doc) {
        if (doc.exists) {
            roomDocRef.update(ID, 20);
            return true;
        }
        else {
            console.log("room" + roomNum + " not found");
            return false;
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    })
}

function getIDLife(database, roomNum, ID) {
    let roomDocRef = database.collection("rooms").doc("room" + roomNum);

    roomDocRef.get().then(function(doc) {
        if (doc.exists) {
            let life = doc.data()[ID];
            return { "id": ID, "life": life };
        }
        else {
            console.log("room" + roomNum + " not found");
            return false;
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    })
}

// method that calls renderLife() for each player
function renderAllLifeTotals(database, roomNum) {
    let roomDocRef = database.collection("rooms").doc("room" + roomNum);

    roomDocRef.get().then(function(doc) {
        if (doc.exists) {
            document.getElementById("players").innerHTML = "";
            console.log(doc.data);
            Object.keys(doc.data()).forEach( function(key, index) {
                let life = doc.data()[key];
                renderPlayerLifeTotal(key, life);
            });
       }
        else {
            console.log("room" + roomNum + " not found");
            return false;
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    })
}

// (renderLife) method that inserts the proper html for each player
function renderPlayerLifeTotal(key, lifeTotal) {
    console.log(key + " life: " + lifeTotal);
    let player = ""
    const ID = key;
    console.log(`playerID: ${playerID}, currentID: ${ID}`);
    if (playerID === ID)
    {
        player = "currentPlayer";
    }
    
    let playerLifeString = `<span class=${player}>${ID}: ` + 
    `${lifeTotal}</span><br>`;
    document.getElementById("players").innerHTML += (
        playerLifeString);
}

// method that increments/decrements life counter totals
function changePlayerLifeTotal(database, roomNum, ID, changeInLife) {
    let roomDocRef = database.collection("rooms").doc("room" + roomNum);

    roomDocRef.get().then(function(doc) {
        if (doc.exists) {
            let currentLife = doc.data()[ID];
            roomDocRef.update(ID, currentLife + changeInLife);
        }
        else {
            console.log("room" + roomNum + "not found");
            return false;
        }

    }).catch(function(error) {
        console.log("Error getting document:", error);
    })
}
function buttonClick(changeInLife) {
    changePlayerLifeTotal(db, 1, playerID, changeInLife);
}

function clearRoom() {
    const promptText = "Do you want to delete " + 
    "all the players from this room? " +
    "If so, enter 'CLEAR' in the text box below.";
    const clear = prompt(promptText, "");
    if (clear.trim().toUpperCase() === "clear".trim().toUpperCase())
    {
        deletePlayersInRoom(db, 1);
    }
    askForID()
}
function deletePlayersInRoom(database, roomNum) {
    let roomDocRef = database.collection("rooms").doc("room" + roomNum);

    roomDocRef.get().then(function(doc) {
        if (doc.exists) {
            Object.keys(doc.data()).forEach( function(key, index) {
                roomDocRef.update(key, firebase.firestore.FieldValue.delete());
            });
       }
        else {
            console.log("room" + roomNum + " not found");
            return false;
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    })
}

// call functions
askForID();