var gameFinished = false;
var images = [];

function play(boardSize) {
    images = createImages(boardSize);
    drawBoard(boardSize);
    startTimer();
}

function createImages(boardSize) {
    // decide source based on board size
    let source = "../../assets/images/";
    switch (boardSize) {
        case 16:
            source += "medium/";
            break;
        case 36:
            source += "hard/";
            break;
        default:
            source += "easy/";
    }

    // add images to array
    let newImages = [];
    for (let i = 1; i <= boardSize/2; i++) {
        for (let j = 0; j < 2; j++) {
            // create an image with the right source
            let image = document.createElement("img");
            image.src = source + i + ".jpg";
            newImages.push(image);        
        }
    }
    
    // shuffle images
    for (var i = newImages.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = newImages[i];
        newImages[i] = newImages[j];
        newImages[j] = temp;
    }

    return newImages;
}

function drawBoard(boardSize) {
    let board = document.getElementById("board");

    // add empty tile if needed (3x3 board)
    if (boardSize == 8) {
        let emptyTile = document.createElement("div");
        emptyTile.className = "empty-tile";
        board.append(emptyTile);
    }

    // create a new div for every tile in the memory
    for (let i = 0; i < boardSize; i++) {
        let tile = document.createElement("div");

        // turn the tile when clicked on
        tile.onclick = function() {turnTile(tile, i, boardSize)};

        // choose color of the tile's back
        tile.setAttribute("class", tileColor(i, boardSize));

        board.appendChild(tile);
    }
}

let turnedTiles = 0; // score
let turnedPairs = 0; // check for win
let lastTurned = []; // keep track of turned tiles

function turnTile(tile, i, boardSize) {
    // cancel if already lost, or card has already been turned
    if (gameFinished || images[i] == "turned") return;

    // cancel if pressed the same tile twice (same index)
    if (lastTurned.length == 1) if (lastTurned[0][1] == i) return;

    // else add to array
    lastTurned.push([tile, i]);
    tile.innerHTML = "";
    tile.appendChild(images[i]);

    // if two images have been clicked, after adding one to array
    if (lastTurned.length >= 2) {
        // if the they are the same image
        if (images[lastTurned[0][1]].src == images[lastTurned[1][1]].src) {      
            turnedPairs++;

            // check for win
            if (turnedPairs >= boardSize/2) {
                showWinScreen("win");
            }
            
            // remove images from array so we can't click them again
            images[lastTurned[0][1]] = "turned";
            images[lastTurned[1][1]] = "turned";
        } 
        else {
            let turningTiles = lastTurned;
            setTimeout(() => {
                // empty tiles, if they haven't been turned by another instance of the function
                if (images[turningTiles[0][1]] != "turned" && !lastTurned.includes(turningTiles[0])) {
                    turningTiles[0][0].innerHTML = "";
                } 
                if (images[turningTiles[1][1]] != "turned" && !lastTurned.includes(turningTiles[1])) {
                    turningTiles[1][0].innerHTML = "";
                }
            }, 1000);
        }
        lastTurned = [];
    }
    turnedTiles++;
}

let timerSeconds;
let interval;
function startTimer() { 
    // load the number of seconds from the html
    timerSeconds = document.getElementById("timer").innerHTML;

    // first update timer to get the correct starting format
    updateTimer();

    // start the interval
    interval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    minutes = Math.floor(timerSeconds / 60);
    seconds = timerSeconds - minutes*60; 

    // add zero if seconds is one digit
    extraZero = "";
    if (seconds < 10) {
        extraZero = "0";
    }

    // update timer
    let timer = document.getElementById("timer");
    timer.innerHTML = minutes + ":" + extraZero + seconds;

    // check if lost
    if (timerSeconds <= 0) {
        showWinScreen("lose");
    }

    timerSeconds--;
}

function showWinScreen(outcome) {
    let winScreen = document.getElementById("win-screen");

    // stop timer
    clearInterval(interval);

    gameFinished = true;

    if (outcome == "win") {
        winScreen.firstElementChild.firstElementChild.innerHTML = "You win!"
    } else {
        winScreen.firstElementChild.firstElementChild.innerHTML = "Too bad, you suck!"
    }

    // stats
    winScreen.firstElementChild.children[1].innerHTML = timerSeconds + " seconds left,";
    winScreen.firstElementChild.children[2].innerHTML = turnedTiles + " turns";
    winScreen.firstElementChild.children[3].innerHTML = "and " + turnedPairs + " pairs found.";

    // show win screen
    winScreen.style.display = "flex";

    // scroll down to bottom of page if necessary
    window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
}

// purely an aesthetic function to make the memory more colorful
function tileColor(i, boardSize) {
    let num = i * (boardSize/2 + Math.floor(Math.random()*10));
    switch (num % (boardSize/2 + 3)) {
        case 0:
            return "blue";
        case 1:
            return "orange";
        case 3:
            return "blue";
        case 4:
            return "orange";
        case 5:
            return "blue";
        case 6:
            return "orange";
        default: 
            return "purple";
    }
}
