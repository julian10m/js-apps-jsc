'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const mvts = sort ? movements.slice().sort((a, b) => a - b) : movements;
  mvts.forEach(function (mvt, i) {
    const typeMvt = mvt > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${typeMvt}">${
      i + 1
    } ${typeMvt}</div>
          <div class="movements__value">${mvt}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displaySummary = function (acc) {
  acc.balance = calculateBalance(acc.movements);
  labelBalance.textContent = `${acc.balance}€`;
  //   console.log(maxMovement(acc.movements));
  labelSumIn.textContent = `${calculateInBalance(acc.movements)}€`;
  labelSumOut.textContent = `${Math.abs(calculateOutBalance(acc.movements))}€`;
  labelSumInterest.textContent = `${calculateInterest(acc)}€`;
};

const updateUI = function (acc) {
  displayMovements(acc.movements, displaySortedMovements);
  displaySummary(acc);
};

const setupLoginUI = function (event) {
  event.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    containerApp.style.opacity = 100;
    updateUI(currentAccount);
  }
};

const transferMoney = function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
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
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
};

const closeAccount = function (event) {
  event.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
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
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mvt => mvt >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
};

const toogleSortDisplayMovements = function (event) {
  event.preventDefault();
  displaySortedMovements = !displaySortedMovements;
  displayMovements(currentAccount.movements, displaySortedMovements);
};

let currentAccount;
let displaySortedMovements = false;
accounts.forEach(createUsername);
btnLogin.addEventListener('click', setupLoginUI);
btnTransfer.addEventListener('click', transferMoney);
btnClose.addEventListener('click', closeAccount);
btnLoan.addEventListener('click', loanTool);
btnSort.addEventListener('click', toogleSortDisplayMovements);
