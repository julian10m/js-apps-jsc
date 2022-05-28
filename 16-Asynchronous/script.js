'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const renderData = function (data, className = '') {
  console.log(data);
  const html = `
     <article class="country ${className}">
      <img class="country__img" src="${data.flags.svg}" />
      <div class="country__data">
          <h3 class="country__name">${data.name.common}</h3>
          <h4 class="country__region">${data.region}</h4>
          <p class="country__row"><span>👫</span>${(
            +data.population / 1e6
          ).toFixed(1)} people</p>
          <p class="country__row"><span>🗣️</span>${
            Object.values(data.languages)[0]
          }</p>
          <p class="country__row"><span>💰</span>${
            Object.values(data.currencies)[0].name
          }</p>
      </div>
      </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const getCountryData = function (country) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    renderData(data);
    data.borders.forEach(neigh => {
      console.log(neigh);
      const request = new XMLHttpRequest();
      request.open('GET', `https://restcountries.com/v3.1/alpha/${neigh}`);
      request.send();
      request.addEventListener('load', function () {
        renderData(JSON.parse(this.responseText)[0], 'neighbour');
      });
    });
  });
};

const getJSON = function (url, errorMessage = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok)
      throw new Error(`(${response.status} status) ${errorMessage}`);
    return response.json();
  });
};

const getPosition = () =>
    new Promise(
        (resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));

const getCountryDataPromises = function (country) {
    getPosition()
        .then(function(pos){
            return getJSON(`https://geocode.xyz/${pos.coords.latitude},${pos.coords.longitude}?geoit=json`,
                           'Geolocation failed!')        
        })
        .then(data => getJSON(
            `https://restcountries.com/v3.1/name/${data.country}`,
            `Country ${data.country} not found`
          ))
        .then(function (data) {
            console.log(data);
            renderData(data[0]);
            data[0].borders.forEach(neigh => {
                console.log(neigh);
                getJSON(
                    `https://restcountries.com/v3.1/alpha/${neigh}`,
                    `Country ${neigh} not found`
                )
                .then(data => renderData(data[0], 'neighbour'))
                .catch(err => renderError(`${err.message}!!`))
                .finally(() => console.log('I am always executed'));
            });
        })
        .catch(err => renderError(`${err.message}!!`))
        .finally(() => console.log('I am always executed'));
};

const getCountryDataAsync = async function (country) {
    try {
        const pos = await getPosition();
        const geoResp = await fetch(`https://geocode.xyz/${pos.coords.latitude},${pos.coords.longitude}?geoit=json`);
        if (!geoResp.ok) throw new Error(`(${geoResp.status} status) Geolocation failed!`);
        const geoData = await geoResp.json();
        const countryResp = await fetch(`https://restcountries.com/v3.1/name/${geoData.country}`);
        if (!countryResp.ok) throw new Error(`(${countryResp.status} status) Country ${geoData.country} not found!`);
        const countryData = await countryResp.json();
        renderData(countryData[0]);
        const allNeighPromises = countryData[0].borders.map(async neigh => 
            await getJSON(
                `https://restcountries.com/v3.1/alpha/${neigh}`,
                `Country ${neigh} not found`
            )
        )
        const allNeighData = await Promise.all(allNeighPromises);
        allNeighData.forEach(data => renderData(data[0], 'neighbour'));
    } catch (err) {
        renderError(err.message);
    }
};

// getCountryData('portugal');
// getCountryData('argentina');
// getCountryDataPromises('julian');
// btn.addEventListener('click', () => getCountryDataPromises());
btn.addEventListener('click', () => getCountryDataAsync());
