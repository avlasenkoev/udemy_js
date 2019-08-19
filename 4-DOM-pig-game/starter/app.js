/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game


1. A player looses his ENTIRE score when he rolls two 6 in a row. After that, it's the next player's turn. (Hint: Always save the previous dice roll in a separate variable)
2. Add an input field to the HTML where players can set the winning score, so that they can change the predefined score of 100. (Hint: you can read that value with the .value property in JavaScript. This is a good oportunity to use google to figure this out :)
3. Add another dice to the game, so that there are two dices now. The player looses his current score when one of them is a 1. (Hint: you will need CSS to position the second dice, so take a look at the CSS code for the first one.)
*/


// set global values
var activePlayer, totalScore, currentScore, gamePlaying, lastRoll, winningScore;

// set start parameters
function set_start_parameters() {
    gamePlaying = false;
    currentScore = 0;
    activePlayer = 0;
    totalScore = [0, 0];
    // clear all fields
    document.getElementById('score-0').textContent = 0;
    document.getElementById('score-1').textContent = 0;
    document.getElementById('current-0').textContent = 0;
    document.getElementById('current-1').textContent = 0;
    document.getElementById('name-0').textContent = 'Player1';
    document.getElementById('name-1').textContent = 'Player2';
    document.querySelector('.dice-0').style.display = 'none';
    document.querySelector('.dice-1').style.display = 'none';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    // always start with player1
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');

    document.querySelector('.form-data').style.display = 'block';
    set_winning_score();
}

function set_winning_score() {
    document.querySelector('.submit-score').addEventListener('click', function () {
        winningScore = document.getElementById('winning-score').value;
        if (isNaN(winningScore)){
             winningScore = 100;
        }
        document.querySelector('.form-data').style.display = 'none';
        gamePlaying = true;
    })
}

// roll dice until get 1 point - it is loose
function roll() {
    if (gamePlaying) {
         // get random numbers
        var dice0 = Math.floor(Math.random() * (6)) + 1;
        var dice1 = Math.floor(Math.random() * (6)) + 1;
        // change images
        document.querySelector('.dice-0').src = 'dice-' + dice0 + '.png';
        document.querySelector('.dice-0').style.display = 'block';
        document.querySelector('.dice-1').src = 'dice-' + dice1 + '.png';
        document.querySelector('.dice-1').style.display = 'block';

        if (dice0 === 1 || dice1 === 1) {
            // lost, try for the next player
            change_player();
        } else {
            // if player rolls two times in a row  by 6 points he lost all scores
            if (dice0 === 6 && dice1 === 6 && dice0 + dice1 === lastRoll) {
                totalScore[activePlayer] = 0;
                document.getElementById('score-' + activePlayer).textContent = totalScore[activePlayer];
                change_player()
            } else {
                lastRoll = dice0 + dice1;
                // summarize roll results
                currentScore += dice0 + dice1;
                document.getElementById('current-' + activePlayer).textContent = currentScore;
            }
        }
    }
}

// change current player to the next
function change_player() {
    // zeroing parameters for current player
    lastRoll = 0;
    currentScore = 0;
    document.getElementById('current-' + activePlayer).textContent = 0;
    // change player
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
}

// set total score and change player
function hold() {
    // update total score
    totalScore[activePlayer] += currentScore;
    // check if player already won
    if (totalScore[activePlayer] >= winningScore) {
        gamePlaying = false;
        document.getElementById('score-' + activePlayer).textContent = totalScore[activePlayer];
        document.getElementById('name-' + activePlayer).textContent = 'Winner!!!';
        document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
        document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
    } else {
        // update displaying total score
        document.getElementById('score-' + activePlayer).textContent = totalScore[activePlayer];
        change_player()
    }
}


set_start_parameters();
document.querySelector('.btn-roll').addEventListener("click", roll);
document.querySelector('.btn-hold').addEventListener("click", hold);
document.querySelector('.btn-new').addEventListener("click", set_start_parameters);
