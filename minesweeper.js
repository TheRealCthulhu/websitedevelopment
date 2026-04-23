var gameStart = false;
var minesArray = [];
let minesweeperData = JSON.parse(localStorage.getItem("minesweeperSetup"));
const mineCounter = document.getElementById("mineCount");
const difficulty = parseInt(minesweeperData["difficulty"]);
const rowSize = parseInt(minesweeperData["size"]);
const boardSize = Math.pow(rowSize, 2)
const numMines = Math.floor((boardSize * difficulty) / 100)
var minesLeft = numMines;
var lost = false;
let time = 0;
let startTime;
let timeInterval;
let gameFinished = false;

localStorage.removeItem("userScore");

function startTimer() {
    startTime = Date.now();
    timeInterval = setInterval(function updateTime() {
        time = Date.now() - startTime;
        document.getElementById("timeDisplay").innerText = formatTime(time);
    }, 10);

    const mineChecker = setInterval(() => {
        if (minesArray.every(element => element.classList.contains("visible") || element.classList.contains("flagged")) && !lost) {
            clearInterval(timeInterval);
            clearInterval(mineChecker)
            gameOverFunc()
        }
    }, 10);
}


function generateGrid(n) {
    var bigBox = document.getElementById("bigBox");
    var mineBox = document.getElementById("mineBox");
    mineBox.innerHTML = "";
    minesArray = [];
    for (let i = 0; i < n * n; i++) {
        const mineTile = document.createElement("div");
        mineTile.className = "hidden";
        mineTile.id = "tile-" + i;
        // mineTile.textContent = i;
        mineTile.addEventListener("click", clickHidden);
        mineTile.addEventListener("contextmenu", toggleFlag);
        mineBox.appendChild(mineTile);
        minesArray.push(mineTile);
    }
    mineBox.style.width = 24 * n + "px";
    gameOver.style.width = 24 * n + "px";
    gameOver.style.padding = "15px";
    mineBox.style.padding = "15px";
    mineBox.style.alignContent = "center";
    mineBox.style.justifyContent = "center";
    bigBox.style.width = 30 * n + 80 + "px";
    bigBox.style.height = (25 * n) + 120 + "px";
    bigBox.style.alignContent = "center";
    bigBox.style.justifyContent = "center";
    toggleFlag(null)
}

function clickHidden(event) {
    var clickedTile = event.currentTarget;
    if (clickedTile.classList.contains("flagged")) {
    } else {
        if (!gameStart) {
            startTimer();
            clickedTile.className = "visible"
            gameStart = true;
            generateMines(numMines);
            updateTiles(clickedTile);
        }
        else {
            clickedTile.classList.replace("hidden", "visible")
            if (clickedTile.classList.contains("mine")) {
                clickedTile.innerHTML = "<img src='assets/bomb.png' width='20px'>"
                showBoard();
                lost = true;
                alert("Game Over");
                gameOverFunc();
            } else { updateTiles(clickedTile); }
        }
    }
}

function generateMines(mines) {
    let mineCount = mines;
    for (let i = 0; i < mineCount; i) {
        let mineSetter = document.getElementById("tile-" + Math.floor(Math.random() * boardSize))
        if (mineSetter.classList.contains("hidden") && !mineSetter.classList.contains("mine")) {
            mineSetter.classList.add("mine");
            i++;
        } else { }
    }
}

function toggleFlag(event) {
    if (event) {
        event.preventDefault()
        let clickedTile = event.currentTarget;
        if (clickedTile.classList.contains("hidden")) {
            if (clickedTile.classList.contains("flagged")) {
                clickedTile.classList.remove("flagged");
                clickedTile.innerHTML = "";
                minesLeft++;
            } else {
                clickedTile.classList.add("flagged");
                clickedTile.innerHTML = "<img src='assets/flag.png' width=20px>"
                minesLeft--;
            }
            mineCounter.innerText = minesLeft;
        }
    }
    else { mineCounter.innerText = minesLeft; }
}

function updateTiles(target) {
    var clickedTile = target;
    var surroundingMines = 0;
    var n = parseInt(clickedTile.getAttribute("id").substring(5))
    for (let i = n - rowSize; i <= n + rowSize; i += rowSize) {
        for (let j = -1; j <= 1; j++) {
            let tile = document.getElementById("tile-" + (i + j))
            if (tile && tile.id !== ("tile-" + n)) {
                if ((n % rowSize) == rowSize - 1) {
                    if ((i + j) % rowSize == 0) {
                    } else if (tile.classList.contains("mine")) {
                        surroundingMines++;
                    }
                }
                else if (n % rowSize == 0) {
                    if ((i + j) % rowSize == rowSize - 1) {
                    } else if (tile.classList.contains("mine")) {
                        surroundingMines++;
                    }
                }
                else if (tile.classList.contains("mine")) {
                    surroundingMines++;
                }
                else if (tile.classList.contains("mine")) {
                    surroundingMines++;
                }
            }
        }
    }
    if (surroundingMines > 0) { clickedTile.innerHTML = "" + surroundingMines; }
    else {
        for (let i = n - rowSize; i <= n + rowSize; i += rowSize) {
            for (let j = -1; j <= 1; j++) {
                let tile = document.getElementById("tile-" + (i + j))
                if (tile && tile.id !== ("tile-" + n) && !tile.classList.contains("visible")) {
                    if ((n % rowSize) == rowSize - 1) {
                        if ((i + j) % rowSize == 0) {
                        } else if (!tile.classList.contains("mine")) {
                            tile.click()
                        }
                    }
                    else if (n % rowSize == 0) {
                        if ((i + j) % rowSize == rowSize - 1) {

                        }
                        else { tile.click() }
                    }
                    else {
                        tile.click()
                    }

                }
            }
        }
    }
}
function showBoard() {
    minesArray.forEach(element => {
        if (!element.classList.contains("mine")) {
            updateTiles(element)
        }
        else {
            element.innerHTML = "<img src='assets/bomb.png' width='20px'>"
            element.classList.replace("hidden", "visible")
        }
        element.classList.replace("hidden", "visible")
    });
}

function gameOverFunc() {
    document.getElementById("gameOver").innerHTML = "<div id='tooBad'>Too Bad</div> <div id='continue'><button type='submit' id='continueButton'>Continue</button></div>"
    if (!lost) {
        document.getElementById("tooBad").innerText = "Congratulations"
    }
    document.getElementById("continueButton").addEventListener("click", event => {
        event.preventDefault();
        if (!lost) {
            const score = { "time": time, "user": minesweeperData["user"], "size": rowSize, "diff": minesweeperData["difficulty"] }
            localStorage.setItem("userScore", JSON.stringify(score));
        }
        window.location.href = "gameOverScreen.html";
    });
}

function formatTime(t) {
    return ("" + Math.floor(t / 1000))
}

generateGrid(rowSize)