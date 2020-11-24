// Array with lego figures
const figures = [
    "lego1.png",
    "lego1.png",
    "lego2.png",
    "lego2.png",
    "lego3.png",
    "lego3.png",
    "lego4.png",
    "lego4.png",
    "lego5.png",
    "lego5.png",
    "lego6.png",
    "lego6.png",
    "lego7.png",
    "lego7.png",
    "lego8.png",
    "lego8.png"
]

// ----------------------- Global variables
// Game level modal
const easy_button = document.getElementById("easy");
const medium_button = document.getElementById("medium");
const hard_button = document.getElementById("hard");

// Main menu section
const mainMenuSection = document.getElementById("main-menu-section");

// Game arena section
const gameArenaSection = document.getElementById("game-arena-section");
const board_div = document.getElementById("board");
let points_span = document.querySelector("#points span");
let level_span = document.querySelector("#level span");
let time_span = document.querySelector("#time span");
let counter_span = document.querySelector("#counter span");

// Game win modal
const gameLevel_td = document.getElementById("game-level");
const pointsScored_td = document.getElementById("points-scored");
const mistakesPenalties_td = document.getElementById("mistakes-penalties")
const timeBonus_td = document.getElementById("time-bonus");
const totalScore_strong = document.querySelector("#total-score strong");
let playerName_input = document.getElementById("playerName");
const save_button = document.getElementById("save-score");

// ----------------------- JS variables
let turnCounter = 0;
let time;
let addPoints = 0;
let subtractPoints = 0;

window.onload = level;

// Create cards in game arena
function level() {
    let cards = "";
    for (i = 0; i <= 7; i++) {
        cards = `${cards}<div class="card" onclick="reverse(${i})" id="c${i}"></div>`
    }
    board_div.innerHTML = cards;
    level_span.innerHTML = `Level: Test`
    time = 60;
    pairs = 4;
    shuffle();
    timer();

    $('#highscores-modal').modal('show');
};

// Shuffle cards before game starts
function shuffle() {
    let i,
        j,
        temp;
    for (i = 7 - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = figures[i];
        figures[i] = figures[j];
        figures[j] = temp;
    };
    return figures;
};

// Add figure on the other side of card
// Check if one or two cards reversed
// Check if two cards are the same
// Add lock to prevent reverse more than 2 cards before check
// Add scoring system that will add points for cards that match and subtract points for cards that not match
let oneVisible = false;
let firstCardNo;
let lock = false;
function reverse(no) {
    if (lock === false) {

        lock = true;

        let element = `c${no}`
        let picture = `url(assets/images/${figures[no]})`
        document.getElementById(element).style.background = picture
        document.getElementById(element).style.backgroundSize = "cover";
        document.getElementById(element).classList.add("cardA");
        document.getElementById(element).classList.remove("card");

        if (oneVisible === false) {
            oneVisible = true;
            firstCardNo = no;
            lock = false;
        } else {
            if (figures[firstCardNo] === figures[no]) {
                keep2Cards();
                addPoints++;
            } else {
                setTimeout(function () {
                    restore2Cards(firstCardNo, no);
                }, 750);
                subtractPoints++
            };

            turnCounter++;
            counter_span.innerHTML = `Turn counter: ${turnCounter}`
            oneVisible = false;
            scoreSystem();
        };
    };
};

// When 2 reversed cards match
function keep2Cards() {
    lock = false;
    pairs--;
};

// When 2 reversed cards do not match
function restore2Cards(firstCardNo, no) {
    let element1 = `c${firstCardNo}`;
    let element2 = `c${no}`;
    document.getElementById(element1).style.background = "rgb(67, 176, 42)";
    document.getElementById(element1).classList.add("card");
    document.getElementById(element1).classList.remove("cardA");
    document.getElementById(element2).style.background = "rgb(67, 176, 42)";
    document.getElementById(element2).classList.add("card");
    document.getElementById(element2).classList.remove("cardA");

    lock = false;
}

// Set game timer
function timer() {
    time--;
    time_span.innerHTML = `Time: ${time}`
    if (time === 0) {
        return;
    } else if (pairs === 0) {
        return;
    }
    setTimeout(timer, 1000);
};

// Score system
// Show game win modal when all pairs match
function scoreSystem() {
    points_span.innerHTML = `Points: ${50 * addPoints - 20 * subtractPoints}`
    if (pairs === 0) {
        points_span.innerHTML = `Points: ${(50 * addPoints - 20 * subtractPoints) + time}`

        $('#game-win-modal').modal('show');
        gameLevel_td.innerHTML = "test"
        pointsScored_td.innerHTML = 50 * addPoints;
        mistakesPenalties_td.innerHTML = -20 * subtractPoints;
        timeBonus_td.innerHTML = time;
        totalScore_strong.innerHTML = (50 * addPoints - 20 * subtractPoints) + time
    };
};

// Save score to local storage
const printScores_tbody = document.getElementById("print-scores");
const getHighScores = JSON.parse(localStorage.getItem("highScores")) || [];

save_button.addEventListener("click", function () {
    const score = {
        name: playerName_input.value,
        score: totalScore_strong.innerHTML,
        level: "test",
    };

    getHighScores.push(score);

    localStorage.setItem("highScores", JSON.stringify(getHighScores))
});

printScores_tbody.innerHTML = getHighScores
    .map(score => {
        return `<tr>
        <td>${score.name}</td>
        <td>${score.score}</td>
        <td>${score.level}</td>
        </tr>`;
    }).join("");

