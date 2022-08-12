import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener(
  'input',
  debounce(handleSearchCountries, DEBOUNCE_DELAY)
);

function handleSearchCountries(e) {
  const inputValue = e.target.value.trim();
  if (inputValue === '') return;

  fetchCountries(inputValue)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }

      if (data.length <= 10) {
        renderContriesList(data);
      }

      if (data.length === 1) {
        countryList.innerHTML = '';
        renderCountryInfo(data);
      }
    })
    .catch(error => {
      console.log(error);
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderContriesList(countries) {
  const markup = countries
    .map(country => {
      return `<li class="country-item">
          <img class="country-flag" src="${country.flags.svg}" alt="flag of ${country.name.common}" width="60" >
          <p class="country-name">${country.name.common}</p>
        </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCountryInfo(country) {
  const language = country.languages;
  const markup = `<img class="country-flag" src="${country.flags.svg}" alt="flag of ${country.name.common}" width="60">
  <h2>${country.name.common}</h2>
    <p><b>Capital: </b>${country.capital}</p>
  <p><b>Population: </b>${country.population}</p>
  <p><b>Languages: </b>${country.capital}</p>`;

  countryInfo.innerHTML = markup;
}
