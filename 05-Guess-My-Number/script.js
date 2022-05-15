'use strict';

const generateRandomNumber = function () {
  return Math.trunc(MAX_VALUE * Math.random()) + 1;
};

const reloadGame = function () {
  lose = false;
  win = false;
  livesLeft = DEFAULT_LIVES;
  document.querySelector('.score').textContent = livesLeft;
  secretNumber = generateRandomNumber();
  document.querySelector('.number').textContent = '?';
  document.querySelector('.message').textContent = 'Start guessing...';
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.guess').value = '';
  document.querySelector('.number').style.width = '15rem';
};

const setEndGameDisplaySettings = function (color) {
  document.querySelector('.number').textContent = secretNumber;
  document.querySelector('.number').style.width = '30rem';
  document.querySelector('body').style.backgroundColor = color;
};

const setMessage = function (message) {
  document.querySelector('.message').textContent = message;
};

const setWinDisplay = function () {
  win = true;
  setMessage('🥇 Correct number! 😎');
  setEndGameDisplaySettings('#60b347');
  if (highscore < livesLeft) {
    highscore = livesLeft;
    document.querySelector('.highscore').textContent = highscore;
  }
};

const setLoseDisplay = function () {
  lose = true;
  setMessage('😈 You lost! hah 🤣');
  setEndGameDisplaySettings('#f52525bf');
};

const MAX_VALUE = 30;
const DEFAULT_LIVES = 10;
let win;
let lose;
let secretNumber;
let livesLeft;
let highscore = 0;
reloadGame();

document.querySelector('.again').addEventListener('click', reloadGame);

document.querySelector('.check').addEventListener('click', function () {
  if (win || lose) return;
  const guess = Number(document.querySelector('.guess').value);
  let guessMessage;
  if (!guess) {
    setMessage('⛔ No number!');
  } else if (guess === secretNumber) {
    setWinDisplay();
  } else {
    livesLeft--;
    if (livesLeft > 0) {
      setMessage(guess < secretNumber ? 'Try higher!' : 'Try lower!');
    } else {
      setLoseDisplay();
    }
  }
  document.querySelector('.score').textContent = livesLeft;
});
