'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2022-03-27T18:49:59.371Z',
    '2022-03-28T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const createUsername = function (acc) {
  acc.username = acc.owner
    .split(' ')
    .map(name => name[0].toLowerCase())
    .join('');
};

const calculateBalance = function (movements) {
  return movements.reduce((acc, mvt) => acc + mvt, 0);
};

const calculateInBalance = function (movements) {
  return calculateBalance(movements.filter(mvt => mvt > 0));
};

const calculateOutBalance = function (movements) {
  return calculateBalance(movements.filter(mvt => mvt < 0));
};

const calculateInterest = function (acc) {
  return acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
};

const maxMovement = function (movements) {
  return movements.reduce((acc, cur) => (cur > acc ? cur : acc), 0);
};

const formatMovementDate = function (dateStr, locale) {
  const calculateDaysSince = (d1, d2) =>
    Math.round(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24));
  const date = new Date(dateStr);
  const daysPassed = calculateDaysSince(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
  //   return `${String(date.getDate()).padStart(2, 0)}/${String(
  // date.getMonth() + 1
  //   ).padStart(2, 0)}/${date.getFullYear()}`;
};

const formatMovement = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// const getHtmlFor = function (mvt, currency, dateStr, locale, mvtId) {
//   const typeMvt = mvt > 0 ? 'deposit' : 'withdrawal';
//   return `
//       <div class="movements__row">
//           <div class="movements__type movements__type--${typeMvt}">${
//     mvtId + 1
//   } ${typeMvt}</div>
//           <div class="movements__date">${formatMovementDate(
//             dateStr,
//             locale
//           )}</div>
//           <div class="movements__value">${formatMovement(
//             mvt,
//             locale,
//             currency
//           )}</div>
//       </div>
//     `;
// };

const createHtml = function (mvt, currency, dateStr, locale, mvtId) {
  const typeMvt = mvt > 0 ? 'deposit' : 'withdrawal';
  return `
        <div class="movements__row">
            <div class="movements__type movements__type--${typeMvt}">${
    mvtId + 1
  } ${typeMvt}</div>
            <div class="movements__date">${formatMovementDate(
              dateStr,
              locale
            )}</div>
            <div class="movements__value">${formatMovement(
              mvt,
              locale,
              currency
            )}</div>
        </div>
      `;
};

const displayMovements = function (acc, sort = false) {
  const insertMovement = (mvt, i) => {
    containerMovements.insertAdjacentHTML(
      'afterbegin',
      createHtml(mvt, acc.currency, acc.movementsDates[i], acc.locale, i)
    );
  };
  containerMovements.innerHTML = '';
  const mvts = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  mvts.forEach(insertMovement);
};

const displaySummary = function (acc) {
  const locale = acc.locale;
  const currency = acc.currency;
  acc.balance = calculateBalance(acc.movements);
  labelBalance.textContent = `${formatMovement(acc.balance, locale, currency)}`;
  //   console.log(maxMovement(acc.movements));
  labelSumIn.textContent = `${formatMovement(
    calculateInBalance(acc.movements),
    locale,
    currency
  )}`;
  labelSumOut.textContent = `${formatMovement(
    Math.abs(calculateOutBalance(acc.movements)),
    locale,
    currency
  )}`;
  labelSumInterest.textContent = `${formatMovement(
    calculateInterest(acc),
    locale,
    currency
  )}`;
};

const updateUI = function (acc) {
  displayMovements(acc, displaySortedMovements);
  displaySummary(acc);
};

const setLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Please log in';
      containerApp.style.opacity = 0;
    }
    time--;
  };
  let time = 120;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const setupLoginUI = function (event) {
  event.preventDefault();
  if (timer) clearInterval(timer);
  timer = setLogoutTimer();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    containerApp.style.opacity = 100;
    const dateOptions = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      //   weekday: 'long',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      dateOptions
    ).format(new Date());
    updateUI(currentAccount);
  }
};

const transferMoney = function (event) {
  event.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    receiverAcc &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
  clearInterval(timer);
  timer = setLogoutTimer();
};

const closeAccount = function (event) {
  event.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
};

const loanTool = function (event) {
  event.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mvt => mvt >= amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
  clearInterval(timer);
  timer = setLogoutTimer();
};

const toogleSortDisplayMovements = function (event) {
  event.preventDefault();
  displaySortedMovements = !displaySortedMovements;
  displayMovements(currentAccount, displaySortedMovements);
};

let currentAccount, timer;
let displaySortedMovements = false;
accounts.forEach(createUsername);

btnLogin.addEventListener('click', setupLoginUI);
btnTransfer.addEventListener('click', transferMoney);
btnClose.addEventListener('click', closeAccount);
btnLoan.addEventListener('click', loanTool);
btnSort.addEventListener('click', toogleSortDisplayMovements);
