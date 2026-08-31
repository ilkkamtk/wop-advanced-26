'use strict';

const restaurantRow = (restaurant) => {
  const {name, address, company, city} = restaurant;
  const tr = document.createElement('tr');

  const nameTd = document.createElement('td');
  nameTd.innerText = name;

  const addressTd = document.createElement('td');
  addressTd.innerText = address;

  const companyTd = document.createElement('td');
  companyTd.innerText = company;

  const cityTd = document.createElement('td');
  cityTd.innerText = city;

  tr.append(nameTd, addressTd, companyTd, cityTd);

  return tr;
};

export {restaurantRow};
