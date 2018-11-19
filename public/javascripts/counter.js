
// Player ID
let playerID = "";

firebase.initializeApp({
    apiKey: "AIzaSyBEbkeEo4QQd2uGSXs-iUzOiAlZGR3Wr-g",
    authDomain: "lifecounter-15538.firebaseapp.com",
    databaseURL: "https://lifecounter-15538.firebaseio.com",
    projectId: "lifecounter-15538"
});

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

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
            return life;
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
            let IDs = doc.data();
            console.log(IDs);
            Object.keys(IDs).forEach( function(key, index) {
                renderPlayerLifeTotal(roomNum, key.trim());
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
function renderPlayerLifeTotal(roomNum, ID) {
    // Urgh, I need to wait for getIDLife to finish before doing anything else.
    let currentLife = getIDLife(db, 1, ID);
    console.log(ID + ": " + currentLife);
}

// method that increments/decrements life counter totals
function changePlayerLifeTotal(roomNum, ID, changeInLife) {
    let roomDocRef = db.collection("rooms").doc("room" + roomNum);

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
        console.log("ERror getting document:", error);
    })
}


// call functions
askForID();
renderAllLifeTotals(db, 1);