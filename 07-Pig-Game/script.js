'use strict';

const toogleActivePlayerDisplay = function () {
  document
    .querySelector(`.player--${activePlayer}`)
    .classList.toggle('player--active');
};
const switchPlayer = function () {
  toogleActivePlayerDisplay();
  activePlayer = (activePlayer + 1) % numberOfPlayers;
  toogleActivePlayerDisplay();
};

const resetCurrentScoreForActivePlayer = function () {
  currentScore = 0;
  document.querySelector(`#current--${activePlayer}`).textContent = 0;
};

const setEndGameDisplay = function () {
  document
    .querySelector(`.player--${activePlayer}`)
    .classList.add('player--winner');
  diceElement.classList.add('hidden');
  isGameFinished = true;
};

const updateActivePlayerScore = function () {
  scores[activePlayer] += currentScore;
  document.querySelector(`#score--${activePlayer}`).textContent =
    scores[activePlayer];
};

const holdScore = function () {
  if (!isGameFinished) {
    if (currentScore) {
      updateActivePlayerScore();
      resetCurrentScoreForActivePlayer();
      if (scores[activePlayer] >= winningScore) {
        toogleActivePlayerDisplay();
        setEndGameDisplay();
      } else {
        diceElement.classList.add('hidden');
        switchPlayer();
      }
    }
  }
};

const resetGame = function () {
  isGameFinished = false;
  for (let playerIdx = 0; playerIdx < numberOfPlayers; playerIdx++) {
    scores.push(0);
    document.querySelector(`#score--${playerIdx}`).textContent = 0;
    document.querySelector(`#current--${playerIdx}`).textContent = 0;
    document
      .querySelector(`.player--${playerIdx}`)
      .classList.remove('player--active');
    document
      .querySelector(`.player--${playerIdx}`)
      .classList.remove('player--winner');
  }
  activePlayer = 0;
  document
    .querySelector(`.player--${activePlayer}`)
    .classList.add('player--active');
  currentScore = 0;
  diceElement.classList.add('hidden');
};

const rollAndDisplayDice = function () {
  const dice = Math.trunc(Math.random() * 6) + 1;
  diceElement.classList.remove('hidden');
  diceElement.src = `dice-${dice}.png`;
  return dice;
};

const updateCurrentGameStatus = function () {
  if (!isGameFinished) {
    const dice = rollAndDisplayDice();
    if (dice !== 1) {
      currentScore += dice;
      document.querySelector(`#current--${activePlayer}`).textContent =
        currentScore;
    } else {
      resetCurrentScoreForActivePlayer();
      switchPlayer();
    }
  }
};

const diceElement = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
let currentScore, activePlayer, isGameFinished;
let numberOfPlayers = document.querySelectorAll('.player').length;
const winningScore = 25;
const scores = [];

resetGame();
btnRoll.addEventListener('click', updateCurrentGameStatus);
btnHold.addEventListener('click', holdScore);
btnNew.addEventListener('click', resetGame);
